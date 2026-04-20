import Employee from "../models/employeemodel.js";
import { Op } from "sequelize";
import Role from "../models/roleModel.js";
import User from "../models/userModel.js";
import bcrypt from 'bcryptjs'; // Add this import

// GET
// /employees/
// HR Admin/Manager
// List employees (filterable)


export const getAllEmployees = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { page = 1, limit = 10, search = "" } = req.query;

        const offset = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            tenant_id,
            deleted_at: null,

        }
        if (search) {
            where[Op.or] = [
                { first_name: { [Op.iLike]: `%${search}%` } },
                { last_name: { [Op.iLike]: `%${search}%` } },
                { personal_email: { [Op.iLike]: `%${search}%` } },
                { emp_code: { [Op.iLike]: `%${search}%` } }
            ];
        }
        const { count, rows } = await Employee.findAndCountAll({
            where,
            limit: parseInt(limit),
            offset,
            attributes: [
                "id",
                "first_name",
                "last_name",
                "personal_email",
                "emp_code",
                "phone_primary",
                "date_of_joining",
                "status",
                "department_id",
                "designation_id",
                "manager_id",
                "work_location_id",
                "employment_type",
                "probation_end_date",
                "date_of_leaving",
                "exit_reason"
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            data: {
                count,
                employees: rows,
                totalPages: Math.ceil(count / parseInt(limit)),
                currentPage: parseInt(page),
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
            error: err.message

        })
    }
}

// GET
// /employees/{id}/
// HR Admin/Manager/Self
// Employee detail

export const getEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;
        const employee = await Employee.findOne({
            where: {
                id,
                tenant_id
            }
        })
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
                success: false
            })
        }
        return res.status(200).json({
            sucess: false,
            message: "Employee fetched sucessfklly",
            data: employee

        })


    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

// PATCH
// /employees/{id}/
// HR Admin
// Update employee info
export const updateEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;
        const { first_name, last_name, date_of_joining } = req.body;
        const employee = await Employee.findOne({
            where: {
                id,
                tenant_id
            }
        })
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
                sucess: false,

            })
        }
        employee.first_name = first_name;
        employee.last_name = last_name;
        employee.date_of_joining = date_of_joining;
        await employee.save();
        return res.status(200).json({
            sucess: true,
            message: "Employee updated sucessfully",
            data: employee
        })

    } catch (err) {
        console.error(err)
        return res.status(500).json({
            message: "Internal Server Error",
            sucess: false,
            error: err.message
        })
    }
}
// DELETE
// /employees/{id}/
// HR Admin
// Soft-delete / terminate employee
export const deleteEmployeeById = async (req, res) => {
    try {
        const { id } = req.params;
        const { tenant_id } = req.user;

        const employee = await Employee.findOne({
            where: {
                id,
                tenant_id
            }
        });

        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            });
        }

        // Use Sequelize's paranoid soft-delete feature
        await employee.destroy();

        return res.status(200).json({
            success: true,
            message: "Employee deleted successfully",
            data: employee
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
// POST
// /employees/
// HR Admin
// Create employee profile

export const createEmployee = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { first_name, last_name, email, personal_email, emp_code, phone_primary, date_of_joining, employment_type = 'full_time', role_id } = req.body;

        // Basic validation for required fields
        if (!first_name || !last_name || !emp_code || !date_of_joining || !email || !role_id) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: first_name, last_name, emp_code, date_of_joining, email, role_id"
            });
        }

        // Check if emp_code already exists
        const existingEmployee = await Employee.findOne({
            where: {
                emp_code,
                tenant_id
            }
        });
        if (existingEmployee) {
            return res.status(409).json({
                success: false,
                message: "Employee code already exists"
            });
        }

        // Check if email already exists
        const existingUser = await User.findOne({
            where: { email, tenant_id }
        });
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already exists"
            });
        }

        const role = await Role.findOne({ where: { id: role_id } });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found"
            });
        }

        // Generate secure password (placeholder - implement proper generation)
        const salt = await bcrypt.genSalt(10);
        const defaultPassword = "temporary_password"; // Replace with secure generation
        const password_hash = await bcrypt.hash(defaultPassword, salt);

        const user = await User.create({
            email,
            tenant_id,
            password_hash,
            role_id: role.id
        });

        const newEmployee = await Employee.create({
            tenant_id,
            user_id: user.id,
            first_name,
            last_name,
            personal_email,
            emp_code,
            phone_primary,
            date_of_joining,
            employment_type,
        });

        return res.status(201).json({
            success: true,
            message: "Employee created successfully",
            data: newEmployee
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: err.message
        });
    }
};



