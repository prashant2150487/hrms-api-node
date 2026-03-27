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