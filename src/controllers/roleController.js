


// GET
// /roles/
// HR Admin
// List roles


import Permission from "../models/permissionModel.js"
import Role from "../models/roleModel.js"



export const getAllRoles = async (req, res) => {
    try {
        const { tenant_id } = req.user
        const roles = await Role.findAll({})
        if (!roles) {
            return res.status(404).json({
                message: "Roles not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Roles fetch sucessfully",
            success: true,
            data: roles
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            messsage: "Internal server error",
            error: err.messsage,
            success: false
        })
    }
}

// POST
// /roles/
// Super Admin
// Create custom role

export const createCustomRole = async (req, res) => {
    try {
        const { name, label } = req.body;
        if (!name || !label) {
            return res.status(400).json({
                success: false,
                message: "name and label are required",

            })
        }
        const existingUserRole = await Role.findOne({
            where: {
                name,
                label
            }
        })
        if (existingUserRole) {
            return res.status(409).json({
                message: "Role already exist",
                success: false,
                error: "Role already exist"
            })
        }
        const role = await Role.create({
            name,
            label
        })
        return res.status(201).json({
            success: true,
            message: "Role create sucessfilly",
            data: role
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server Error",
            error: err.message,
            success: false
        })
    }
}
export const getPermissionOnRole = async (req, res) => {
    try {
        const { role_id } = req.params;
        const role = await Role.findByPk(role_id, {
            include: [{
                model: Permission,
                as: 'permissions',
                through: {
                    attributes: [] // exclude join table attributes
                }
            }]
        });

        if (!role) {
            return res.status(404).json({
                message: "Role not found",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Permissions fetched successfully",
            success: true,
            data: role.permissions
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




// PUT
// /roles/{id}/permissions/
// Admin
// Set role permissions
export const getAllPermissions = async (req, res) => {
    try {
        const permission = await Permission.findAll({
            attributes: ["id", 'module', "action"]
            
        })
        if (!permission || permission.length === 0) {
            return res.status(404).json({
                message: "Permission not found",
                success: false,
                data: []
            })
        }
        return res.status(200).json({
            success: true,
            message: "Permission fetched successfully",
            data: permission
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            success: false
        })
    }
}
export const setPermissionOnRole = async (req, res) => {
    try {
        const { role_id } = req.params;
        const { permissions } = req.body;
        if (!role_id || !permissions) {
            return res.status(400).json({
                message: "role_id and permissions are required",
                success: false,
                error: "role_id and permissions are required"
            })
        }
        const role = await Role.findByPk(role_id);
        if (!role) {
            return res.status(404).json({
                message: "Role not found",
                success: false,
                error: "Role not found"
            })
        }
        await role.setPermissions(permissions);
        return res.status(200).json({
            message: "Permissions set successfully",
            success: true,
            data: role
        })
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            error: err.message,
            success: false
        })
    }
}




