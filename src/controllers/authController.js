import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import { ApiResponse } from '../utils/apiResponse.js';
import User from '../models/userModel.js';
import sequelize from '../config/database.js';
import Tenant from '../models/tenatModel.js';
import Role from '../models/roleModel.js';
import Employee from '../models/employeemodel.js';
import Permission from '../models/permissionModel.js';






export const register = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { name, subdomain, email, password } = req.body;

    if (!name || !subdomain || !email || !password) {
      return next(new ApiError(400, "All field are required"));
    }

    const existingTenant = await Tenant.findOne({ where: { subdomain }, transaction: t });
    if (existingTenant) {
      return next(new ApiError(400, "Subdomain already exists"));
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const tenant = await Tenant.create({
      name, subdomain, plan: "free", is_active: 1
    }, { transaction: t });

    const superAdminRole = await Role.findOne({
      where: { name: 'super_admin' },
      transaction: t,
    });

    if (!superAdminRole) {
      throw new Error('Super Admin role not found. Please seed the database.');
    }

    const user = await User.create({
      email,
      tenant_id: tenant.id,
      password_hash,
      role_id: superAdminRole.id
    }, { transaction: t });

    // Split name for employee profile
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || 'Super';
    const lastName = nameParts.slice(1).join(' ') || 'Admin';

    // Create initial employee profile for the Super Admin
    await Employee.create({
      tenant_id: tenant.id,
      user_id: user.id,
      emp_code: `EMP-${Math.floor(1000 + Math.random() * 9000)}`, // Random initial code or implement a sequence
      first_name: firstName,
      last_name: lastName,
      date_of_joining: new Date(),
      status: 'active',
      employment_type: 'full_time',
      work_mode: 'onsite'
    }, { transaction: t });

    // Commit transaction
    await t.commit();
    return res.status(200).json(new ApiResponse(200, { userId: user.id, tenantId: tenant.id, subdomain: tenant.subdomain }, 'User created successfully'));

  } catch (error) {
    await t.rollback();
    console.error(error)
    next(new ApiError(500, 'Interval server error', [error.message]));
  }

}
export const login = async (req, res, next) => {
  // Obtain JWT access + refresh tokens

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new ApiError(400, "All field are required"));
    }
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Role,
          as: 'role',
          include: [
            {
              model: Permission,
              as: 'permissions',
              through: { attributes: [] }
            }
          ]
        }
      ]
    });

    if (!user) {
      return next(new ApiError(404, "User not Found"));
    }
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return next(new ApiError(401, "Invalid Password"));
    }

    // Prepare permissions list from user.role.permissions
    const permissions = user.role?.permissions?.map(p => p.codename) || [];

    const tenant = await Tenant.findOne({ where: { id: user.tenant_id } });
    if (!tenant || !tenant.is_active) {
      return next(new ApiError(403, "Tenant is not active"));
    }
    const payload = {
      id: user.id,
      tenant_id: user.tenant_id,
      role_id: user.role_id,
      email: user.email,
      subdomain: tenant.subdomain,
      permissions: permissions
    }
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY });
    await User.update({ refresh_token: refreshToken }, { where: { id: user.id } });
    return res.status(200).json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));

  } catch (error) {
    console.error(error);
    
    return next(new ApiError(500, "", [error.message]));
  }
}
