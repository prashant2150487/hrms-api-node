import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Permission from '../models/permissionModel.js';

/**
 * @description Middleware to authenticate user using JWT
 */
export const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new ApiError(401, "Authentication token is missing"));
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return next(new ApiError(401, "Authentication token is missing"));
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error(err)
      return next(new ApiError(401, "Invalid or expired token"));
    }

    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password_hash', 'refresh_token'] },
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
      return next(new ApiError(401, "User not found"));
    }

    if (!user.is_active) {
      return next(new ApiError(403, "User account is inactive"));
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(new ApiError(500, "Internal Server Error in authentication"));
  }
};


