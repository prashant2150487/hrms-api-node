import User from "../models/userModel.js";
import bcrypt from "bcryptjs";




export const getAllUsers = async (req, res) => {
    // list all users in tanats
    try {
        const users = await User.findAll({
            where: {
                tenant_id: req.user.tenant_id,
                is_active: true,

            },
            attributes: {
                exclude: ['password_hash', "refresh_token"]
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
// POST
// /users/
// HR Admin
// Create user (assigns role)
export const createUser = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { email, password, role_id } = req.body;

        if (!email || !password || !role_id) {
            return res.status(400).json({
                success: false,
                message: "Email, password, and role_id are required fields"
            });
        }

        const existingUser = await User.findOne({
            where: { tenant_id, email }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User with this email already exists"
            });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password_hash,
            role_id,
            tenant_id,
            is_active: true
        });

        const userData = user.toJSON();
        delete userData.password_hash;

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userData
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
}
// /users/{id}/
// HR Admin
// User detail
export const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user
        const user = await User.findOne({
            where: {
                tenant_id,
                id
            },
            attributes: {
                exclude: ["password_hash", "refresh_token"]
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }
        return res.status(200).json({
            message: "User details fetched successfully",
            success: true,
            data: user
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// /users/{id}/
// HR Admin
// Update user (role, status)

export const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params
        const { tenant_id } = req.user
        const { role_id, is_active } = req.body
        const user = await User.findOne({
            where: {
                id,
                tenant_id
            },
            attributes: {
                exclude: ["password_hash", "refresh_token"]
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,

            })
        }
        if (role_id !== undefined) {
            user.role_id = role_id;
        }
        if (is_active !== undefined) {
            user.is_active = is_active;
        }
        await user.save();
        return res.status(200).json({
            message: "User updated successfully",
            success: true,
            data: user
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}
// /users/{id}/
// HR Admin
// Deactivate user

export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user
        const user = await User.findOne({
            where: {
                id,
                tenant_id
            }
        })
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,

            })
        }
        user.is_active = false;
        await user.save();
        return res.status(200).json({
            message: "User deactivated successfully",
            success: true,
            data: user
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}



