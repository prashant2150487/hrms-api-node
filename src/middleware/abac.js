import { ApiError } from "../utils/apiError.js";
import Employee from "../models/employeemodel.js";

/**
 * @description Attribute-Based Access Control (ABAC) Middleware
 * @param {string} permission - Required permission codename (e.g., 'employees:view')
 * @param {Object} options - Granular check options
 * @param {boolean} options.checkOwnership - Check if user is the resource owner
 * @param {string} options.ownershipField - Field in the resource that matches user ID (default: 'user_id')
 * @param {boolean} options.checkManager - Check if user is the manager of the resource owner
 * @param {boolean} options.checkDepartment - Check if user is in the same department
 * @param {Function} options.getResourceId - Function to extract resource ID from req (default: req.params.id)
 * @param {Object} options.model - Sequelize model to fetch the resource (required if ownership/manager/dept check enabled)
 */
export const abac = (permission, options = {}) => {
  return async (req, res, next) => {
    try {
      const user = req.user;
      if (!user) {
        return next(new ApiError(401, "User not authenticated"));
      }

      // 1. RBAC/Role Check: If user has explicitly granted permission or allowed role
      const hasPermission = permission
        ? user.role?.permissions?.some((p) => p.codename === permission)
        : false;
      const hasAllowedRole = options.allowedRoles
        ? options.allowedRoles.includes(user.role?.name)
        : false;

      const hasBaseAccess = hasPermission || hasAllowedRole;

      // If we only need RBAC/Role and user has access, we are done
      if (
        hasBaseAccess &&
        !options.checkOwnership &&
        !options.checkManager &&
        !options.checkDepartment
      ) {
        return next();
      }

      // 2. ABAC Check: If user doesn't have direct permission, or if we need specific attribute matches
      // We often allow 'super_admin' to bypass these checks
      if (user.role?.name === "super_admin") {
        return next();
      }

      // If we need to check attributes, we need the resource
      if (
        options.checkOwnership ||
        options.checkManager ||
        options.checkDepartment
      ) {
        const resourceId = options.getResourceId
          ? options.getResourceId(req)
          : req.params.id;

        if (!resourceId) {
          // If no resource ID and user doesn't have global permission, deny
          if (hasBaseAccess) return next();
          return next(
            new ApiError(403, "Access denied: Missing resource identifier")
          );
        }

        if (!options.model) {
          return next(
            new ApiError(
              500,
              "ABAC Configuration error: Model is required for attribute checks"
            )
          );
        }

        const resource = await options.model.findByPk(resourceId);
        if (!resource) {
          return next(new ApiError(404, "Resource not found"));
        }

        // Multi-tenant isolation check (mandatory for everyone except Super Admin)
        const isSuperAdmin = user.role?.name === "super_admin";
        if (resource.tenant_id !== user.tenant_id && !isSuperAdmin) {
          return next(
            new ApiError(
              403,
              "Access denied: Resource belongs to another tenant"
            )
          );
        }

        // Ownership Check
        if (options.checkOwnership) {
          const ownerField = options.ownershipField || "user_id";
          if (resource[ownerField] === user.id) {
            return next();
          }
        }

        // Fetch user's employee profile for manager/department checks
        const userEmployee = await Employee.findOne({
          where: { user_id: user.id },
        });

        if (userEmployee) {
          // Manager Check: Is the user the manager of the resource's owner?
          if (options.checkManager) {
            // This assumes the resource is an Employee or has an associated Employee
            // If resource is Employee
            if (
              options.model.name === "Employee" &&
              resource.manager_id === userEmployee.id
            ) {
              return next();
            }
            // If resource has employee_id, check that employee's manager
            if (resource.employee_id) {
              const resourceEmployee = await Employee.findByPk(
                resource.employee_id
              );
              if (
                resourceEmployee &&
                resourceEmployee.manager_id === userEmployee.id
              ) {
                return next();
              }
            }
          }

          // Department Check: Is user in same department?
          if (options.checkDepartment) {
            if (resource.department_id === userEmployee.department_id) {
              return next();
            }
          }
        }
      }

      // If all checks fail and user has the permission, they might have global 'view' access but not specific ABAC access.
      // Usually, having the permission allows viewing ALL records in the tenant, while ABAC restricts it.
      // But if user has NO permission and NO attribute match, deny.
      if (hasBaseAccess) {
        return next();
      }

      return next(new ApiError(403, "Access denied: Insufficient permissions"));
    } catch (error) {
      console.error("ABAC Middleware Error:", error);
      next(new ApiError(500, "Internal Server Error in access control"));
    }
  };
};

// Allows users with the 'employees:view' permission OR users with the 'admin' or 'hr_admin' role
// router.get("/", auth, abac('employees:view', { allowedRoles: ['admin', 'hr_admin'] }), getAllUsers);

// Enforces strictly that only 'admin' and 'super_admin' can access this route
// router.get("/sensitive-data", auth, abac(null, { allowedRoles: ['admin', 'super_admin'] }), getSensitiveData);
