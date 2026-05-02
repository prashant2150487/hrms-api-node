import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import User from "../models/userModel.js";
import sequelize from "../config/database.js";
import Tenant from "../models/tenatModel.js";
import Role from "../models/roleModel.js";
import Employee from "../models/employeemodel.js";
import Permission from "../models/permissionModel.js";

export const register = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, subdomain, email, password } = req.body;

    if (!name || !subdomain || !email || !password) {
      return next(new ApiError(400, "All field are required"));
    }

    const existingTenant = await Tenant.findOne({
      where: { subdomain },
      transaction: t,
    });
    if (existingTenant) {
      return next(new ApiError(400, "Subdomain already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const tenant = await Tenant.create(
      {
        name,
        subdomain,
        plan: "free",
        is_active: true,
      },
      { transaction: t }
    );

    const adminRole = await Role.findOne({
      where: { name: "admin" },
      transaction: t,
    });

    if (!adminRole) {
      throw new Error("Admin role not found. Please seed the database.");
    }

    const user = await User.create(
      {
        email,
        tenant_id: tenant.id,
        password_hash,
        role_id: adminRole.id,
      },
      { transaction: t }
    );

    // Split name for employee profile
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "Super";
    const lastName = nameParts.slice(1).join(" ") || "Admin";

    // Create initial employee profile for the Super Admin
    await Employee.create(
      {
        tenant_id: tenant.id,
        user_id: user.id,
        emp_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`, // Random initial code or implement a sequence
        first_name: firstName,
        last_name: lastName,
        date_of_joining: new Date(),
        status: "active",
        employment_type: "full_time",
        work_mode: "onsite",
      },
      { transaction: t }
    );

    // Commit transaction
    await t.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userId: user.id, tenantId: tenant.id, subdomain: tenant.subdomain },
          "User created successfully"
        )
      );
  } catch (error) {
    await t.rollback();
    console.error(error);
    next(new ApiError(500, "Internal server error", [error.message]));
  }
};
export const login = async (req, res, next) => {
  // Obtain JWT access + refresh tokens

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new ApiError(400, "All fields are required"));
    }
    const user = await User.findOne({
      where: { email, tenant_id: req.tenant.id },
      include: [
        {
          model: Role,
          as: "role",
          include: [
            {
              model: Permission,
              as: "permissions",
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      return next(new ApiError(404, "User not Found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid Password"));
    }

    // Prepare permissions list from user.role.permissions
    const permissions = user.role?.permissions?.map((p) => p.codename) || [];

    // req.tenant is already validated and confirmed active by tenantMiddleware
    const tenant = req.tenant;
    const payload = {
      id: user.id,
      tenant_id: user.tenant_id,
      role_id: user.role_id,
      email: user.email,
      subdomain: tenant.subdomain,
      permissions: permissions,
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
    });

    await User.update(
      { refresh_token: refreshToken },
      { where: { id: user.id } }
    );
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS only in prod
      sameSite: "Strict", // or "Lax" if frontend separate domain
    };
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    // Set cookies
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.status(200).json(new ApiResponse(200, {}, "Login successful"));
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Internal server error", [error.message]));
  }
};

export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      return next(new ApiError(401, "User not authenticated"));
    }

    const { tenant_id, id } = req.user;

    const [employeeDetails, userDetails] = await Promise.all([
      Employee.findOne({ where: { tenant_id, user_id: id } }),
      User.findOne({
        where: { id },
        attributes: { exclude: ["password_hash", "refresh_token"] },
        include: [
          {
            model: Role,
            as: "role",
            include: [
              {
                model: Permission,
                as: "permissions",
                through: { attributes: [] }, // hide junction table fields
              },
            ],
          },
        ],
      }),
    ]);

    const permissions =
      userDetails?.role?.permissions?.map((p) => p.codename) || [];

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { userDetails, employeeDetails, permissions },
          "User details fetched successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Internal server error", [error.message]));
  }
};
export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return next(new ApiError(401, "Refresh token missing"));
    }
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findOne({
      where: { id: decoded.id, refresh_token: refreshToken },
    });
    if (!user) {
      return next(new ApiError(401, "Invalid refresh token"));
    }
    const tenant = await Tenant.findOne({
      where: {
        id: decoded.tenant_id,
        is_active: true,
      },
    });
    if (!tenant) {
      return next(new ApiError(401, "Tenant is not active"));
    }
    const payload = {
      id: user.id,
      tenant_id: user.tenant_id,
      role_id: user.role_id,
      email: user.email,
      subdomain: tenant.subdomain,
    };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
    });
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000, // 15 min
    });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: newAccessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    console.error(error);
    return next(new ApiError(500, "Internal server error", [error.message]));
  }
};
