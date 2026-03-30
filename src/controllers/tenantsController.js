import Tenant from "../models/tenatModel.js"


// only super admin can access this controller
export const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenant.findAll();
        return res.status(200).json({
            success: true,
            message: "alll tenants fetched sucessfully",
            data: tenants
        })

    } catch (err) {
        console.err(err)
        return res.status(500).json({
            sucess: true,
            message: "internal server error",
            error: err.message
        })

    }
}

export const getTenantById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return res.status(404).json({
                message: "Tenant not found",
                sucess: false,
                data: null
            })
        }
        return res.status(200).json({
            message: "Tenant fetch sucessfully",
            data: tenant,
            sucess: true
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Internal server error",
            sucess: false
        })
    }
}

export const updateTenant = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return res.status(404).json({
                message: "Tenant not found",
                sucess: false,
                data: null
            })
        }
        tenant.name = name;
        await tenant.save();
        return res.status(200).json({
            sucess: true,
            message: "Tenant update sucessfully",
            data: tenant
        })



    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Internal server error",
            sucess: false
        })
    }
}

export const deleteTenant = async (req, res) => {
    try {
        const { id } = req.params
        const tenant = await Tenant.findByPk(id);
        if (!tenant) {
            return res.status(400).json({
                message: "Tenant not found",
                sucess: false,
                data: null
            })
        }
        // soft delete
        tenant.is_active = 0
        await tenant.save();
        return res.status(200).json({
            sucess: true,
            message: "Tenant deleted sucessfully",
            data: null
        })
    }
    catch (err) {
        console.err(err);
        return res.status(500).json({
            sucess: false,
            message: true,
            data: null
        })
    }
}