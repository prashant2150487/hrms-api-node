import { Op } from "sequelize";
import Department from "../models/departmentmodel.js";
import Employee from "../models/employeemodel.js";



export const getDepartments = async (req, res) => {
    try {

        const { tenant_id } = req.user;
        const departments = await Department.findAll({
            where: {
                tenant_id,
                is_active: 1,

            }
        });
        if (!departments) {
            return res.status(404).json({
                success: false,
                message: " No departments found",
                data: []
            })

        }
        return res.status(200).json({
            success: true,
            message: 'Departments fetched sucessfully',
            data: departments
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: []

        })
    }
}
export const getDepartmentById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;
        const department = await Department.findOne({
            where: {
                id,
                tenant_id,

            }
        })

        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: []
            })
        }
        return res.status(200).json({
            success: true,
            message: "Department fetched successfully",
            data: department
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: []
        })
    }
}
export const createDepartment = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { name, code, parent_id = null, head_employee_id } = req.body;
        if (!name && !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Department name and code are required",
                data: []
            })
        }
        if (name.trim()?.length < 2) {
            return res.status(400).json({
                success: false,
                message: "department name must be at least 2 characters long",
                data: []
            })
        }
        if (name?.trim()?.length > 120) {
            return res.status(400).json({
                success: false,
                message: "department name must be less than 120 characters long",
                data: []
            })
        }
        const existingDepartment = await Department.findOne({
            where: {
                name: name?.trim(),
                tenant_id,
                is_active: 1
            }
        })
        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: `Department with the ${name?.trim()} name already exists`,
                data: []

            })
        }

        // validate code
        if (code) {
            const trimmedCode = code.trim();
            if (trimmedCode.length > 20) {
                return res.status(400).json({
                    success: false,
                    message: "Department code must be less than 20 characters long",
                    data: []
                })
            }
            const existingCode = await Department.findOne({
                where: {
                    code: trimmedCode,
                    tenant_id,
                    is_active: 1
                }
            })
            if (existingCode) {
                return res.status(409).json({
                    success: false,
                    message: `Department with the ${trimmedCode} code already exists`,
                    data: []
                })
            }

        }

        // validate parent_id
        if (parent_id) {
            const parentDepartment = await Department.findOne({
                where: {
                    id: parent_id,
                    tenant_id,
                    is_active: 1
                }
            })
            if (!parentDepartment) {
                return res.status(404).json({
                    success: false,
                    message: "Parent department not found",
                    data: []
                })
            }
            // if (parent_id === req.params?.id) {
            //     return res.status(400).json({
            //         success: false,
            //         message: "Department cannot be its own parent"
            //     });
            // }

        }
        if (head_employee_id) {
            const employee = await Employee.findOne({
                where: {
                    id: head_employee_id,
                    tenant_id,
                    status: "active"
                }
            })
            if (!employee) {
                return res.status(404).json({
                    success: false,
                    message: "Head employee not found",
                    data: []
                })
            }
        }

        const newDepartment = await Department.create({
            name: name.trim(),
            code: code?.trim() || null,
            parent_id,
            head_employee_id,
            tenant_id,
            is_active: 1
        })
        return res.status(201).json({
            success: true,
            message: "Department created successfully",
            data: newDepartment
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: []
        })
    }
}

export const updateDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;
        const { name, code, is_active } = req.body;
        const department = await Department.findOne({
            where: {
                id,
                tenant_id,

            }
        })
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: null
            })
        }
        const updateData = {};
        if (name !== undefined) {
            if (!name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Department name cannot be empty"
                });
            }

            if (name.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: "Department name must be at least 2 characters long"
                });
            }
            // Check if name already exists (excluding current department)
            const nameExists = await Department.findOne({
                where: {
                    tenant_id,
                    name: { [Op.iLike]: name.trim() },
                    id: { [Op.ne]: id },
                    is_active: 1
                }
            });
            if (nameExists) {
                return res.status(409).json({
                    success: false,
                    message: `Department with name "${name.trim()}" already exists`
                });
            }
            updateData.name = name.trim();

        }
        if (code !== undefined) {
            if (code && code.trim().length > 20) {
                return res.status(400).json({
                    success: false,
                    message: "Department code must not exceed 20 characters"
                });
            }

            const trimmedCode = code?.trim().toUpperCase() || null;

            if (trimmedCode) {
                const codeExists = await Department.findOne({
                    where: {
                        tenant_id,
                        code: trimmedCode,
                        id: { [Op.ne]: id },
                        is_active: 1
                    }
                });

                if (codeExists) {
                    return res.status(409).json({
                        success: false,
                        message: `Department with code "${trimmedCode}" already exists`
                    });
                }
            }

            updateData.code = trimmedCode;
        }
        if (is_active !== undefined) {
            updateData.is_active = is_active ? 1 : 0;
        }
        const updatedDepartment = await department.update(updateData);
        return res.status(200).json({
            success: true,
            message: "Department updated successfully",
            data: updatedDepartment
        });



    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
}
export const deleteDepartment = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;
        const department = await Department.findOne({
            where: {
                id,
                tenant_id,
                is_active: 1

            }
        })
        if (!department) {
            return res.status(404).json({
                success: false,
                message: "Department not found",
                data: null
            })
        }
        // Soft delete by marking inactive rather than removing the row
        await department.update({ is_active: 0 });
        return res.status(200).json({
            success: true,
            message: "Department deleted successfully",
            data: null
        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
}



