import { ApiError } from '../utils/apiError.js';

/**
 * @description Role-Based Access Control (RBAC) Middleware
 * @param {string} permission - Required permission codename (e.g., 'employees:view')
 */
export const rbac = (permission) => {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return next(new ApiError(401, "User not authenticated"));
      }

      // Check if user has explicit permission or is super_admin
      const hasPermission = user.role?.permissions?.some(p => p.codename === permission);
      const isSuperAdmin = user.role?.name === 'super_admin';

      if (hasPermission || isSuperAdmin) {
        return next();
      }

      return next(new ApiError(403, "Access denied: Insufficient permissions"));
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      next(new ApiError(500, "Internal Server Error in access control"));
    }
  };
};
