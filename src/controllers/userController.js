import User from "../models/userModel.js";




export const getAllUsers = async (req, res, next) => {
    // list all users in tanats
    try {
        const users = await User.findAll({
            where: {
                tenant_id: req.user.tenant_id,
                is_active: true,
                is_deleted: false,

            }
        })
        if (!users) {
            return res.status(404).json({
                message: "No user ",
                success: false
            })
        }
        return res.status(200).json({
            message: "Users fetched successfully",
            success: true,
            data: users
        })



    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,

        })
    }
}