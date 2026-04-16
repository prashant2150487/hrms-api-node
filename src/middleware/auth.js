import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/apiError.js';
import User from '../models/userModel.js';
import Role from '../models/roleModel.js';
import Permission from '../models/permissionModel.js';

/**
 * @description Middleware to authenticate user using JWT.
 * Reads token from the accessToken cookie (set during login).
 */
export const auth = async (req, res, next) => {
  try {
    // 1. Extract token from cookie only
    const token = req.cookies?.accessToken;

    if (!token) {
      return next(new ApiError(401, 'Authentication token is missing'));
    }

    // 2. Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    // 3. Fetch user with role & permissions
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
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!user) {
      return next(new ApiError(401, 'User not found'));
    }

    // 4. Validate the token's tenant_id matches the user's actual tenant
    if (decoded.tenant_id && user.tenant_id !== decoded.tenant_id) {
      return next(new ApiError(403, 'Token tenant mismatch'));
    }

    // 5. Check user is active
    if (!user.is_active) {
      return next(new ApiError(403, 'User account is inactive'));
    }

    // 6. Attach user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error);
    next(new ApiError(500, 'Internal Server Error in authentication'));
  }
};
