import { ApiError } from '../utils/apiError.js';
import Tenant from '../models/tenatModel.js';
import User from '../models/userModel.js';

const tenantMiddleware = async (req, res, next) => {
  let subdomain = req.headers['x-tenant-subdomain'] || req.body.subdomain;

  if (!subdomain && req.body.email) {
    try {
      // Find the user across all tenants to identify their tenant
      const users = await User.findAll({ where: { email: req.body.email } });
      if (users.length === 0) {
        return next(new ApiError(404, 'No account found with this email'));
      }
      if (users.length === 1) {
        const tenant = await Tenant.findByPk(users[0].tenant_id);
        if (tenant) {
          req.tenant = tenant;
          req.subdomain = tenant.subdomain;
          return next();
        }
      } else if (users.length > 1) {
        return next(new ApiError(400, 'Multiple tenants found for this email. Please provide the subdomain.'));
      }
    } catch (error) {
      return next(new ApiError(500, 'Error identifying tenant from email', [error.message]));
    }
  }

  if (!subdomain) {
    return next(new ApiError(400, 'Tenant subdomain is required (header: x-tenant-subdomain or body: subdomain)'));
  }

  req.subdomain = subdomain;

  try {
    const tenant = await Tenant.findOne({ where: { subdomain: req.subdomain, is_active: true } });

    if (!tenant) {
      return next(new ApiError(404, 'Tenant not found or inactive'));
    }

    req.tenant = tenant;
    next();
  } catch (error) {
    next(new ApiError(500, 'Error identifying tenant', [error.message]));
  }
};

export default tenantMiddleware;

