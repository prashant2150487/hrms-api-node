import { ApiError } from '../utils/apiError.js';
import Tenant from '../models/tenatModel.js';

const tenantMiddleware = async (req, res, next) => {
  const subdomain = req.headers['x-tenant-subdomain'];

  if (!subdomain) {
    // For login, we might want to check the body if header is missing
    const bodySubdomain = req.body.subdomain;
    if (!bodySubdomain) {
      return next(new ApiError(400, 'Tenant subdomain is required (header: x-tenant-subdomain or body: subdomain)'));
    }
    req.subdomain = bodySubdomain;
  } else {
    req.subdomain = subdomain;
  }

  try {
    const tenant = await Tenant.findOne({ where: { subdomain: req.subdomain, is_active: 1 } });

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
