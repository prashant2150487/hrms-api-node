import { error } from "node:console";
import LeavePolicy from "../models/leavePolicy.js";
import { errorObject, removeUndefinedFields } from "bullmq";
import LeaveBalance from "../models/leaveBalance.js";
import { Op, Sequelize, where } from "sequelize";
import LeavePolicy from "../models/leavePolicy.js";
import Employee from "../models/employeemodel.js";
import LeaveRequest from "../models/leaveRequest.js";

export const createLeavePolicy = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { leave_type, days_allowed, carryover_limit, applicable_to } = req.body;

        if (!leave_type || !leave_type.trim()) {
            return res.status(400).json({
                success: false,
                message: "Leave type is required",
            });
        }
        if (days_allowed === undefined) {
            return res.status(400).json({
                success: false,
                message: "Days allowed is required",
            });
        }
        if (carryover_limit === undefined) {
            return res.status(400).json({
                success: false,
                message: "Carryover limit is required",
            });
        }
        if (!applicable_to) {
            return res.status(400).json({
                success: false,
                message: "Applicable to is required",
            });
        }

        const existingLeavePolicy = await LeavePolicy.findOne({
            where: {
                tenant_id,
                is_active: true,
                leave_type: leave_type.trim()
            }
        });

        if (existingLeavePolicy) {
            return res.status(409).json({
                success: false,
                message: "Leave policy already exists"
            });
        }

        const leavePolicy = await LeavePolicy.create({
            tenant_id,
            leave_type: leave_type.trim(),
            days_allowed: days_allowed,
            carryover_limit: carryover_limit,
            applicable_to: applicable_to
        });

        return res.status(201).json({
            success: true,
            message: "Leave policy created successfully",
            data: leavePolicy
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        });
    }
};
export const getLeavePolicy = async (req, res) => {
    try {
        const { tenant_id } = req.user;

        const leavePolicy = await LeavePolicy.findAll({
            where: {
                tenant_id,
                is_active: true,

            }
        })
        if (!leavePolicy) {
            return res.status(404).json({
                success: false,
                message: "Leave policy not found",

            })
        }
        return res.status(200).json({
            success: true,
            message: "Leave policy fetched successfully",
            data: leavePolicy
        })


    } catch (err) {
        console.err(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}
export const updateLeavePolicy = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { id } = req.params;
        const { days_allowed, carryover_limit, applicable_to, is_active } = req.body;
        const leavePolicy = await LeavePolicy.findOne({
            where: {
                tenant_id,
                id,
                is_active: true
            }
        })
        if (!leavePolicy) {
            return res.status(404).json({
                success: false,
                message: "Leave policy not found"
            })
        }
        if (days_allowed > 0) {
            leavePolicy.days_allowed = days_allowed
        }
        if (carryover_limit > 0) {
            leavePolicy.carryover_limit = carryover_limit
        }
        if (applicable_to) {
            leavePolicy.applicable_to = applicable_to
        }
        if (is_active != undefined) {
            leavePolicy.is_active = is_active
        }
        await leavePolicy.save();
        return res.status(200).json({
            success: true,
            message: "Leave policy updated successfully",
            data: leavePolicy
        })





    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}
export const deleteLeavePolicy = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { id } = req.params;
        const leavePolicy = await LeavePolicy.findOne({
            where: {
                tenant_id,
                id,
                is_active: true
            }
        })
        if (!leavePolicy) {
            return res.status(404).json({
                success: false,
                message: "Leave policy not found"
            })
        }
        leavePolicy.is_active = false;
        await leavePolicy.save();
        return res.status(200).json({
            success: true,
            message: "Leave policy deleted successfully",
            data: leavePolicy
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}


export const submitLeaveRequest = async (req, res) => {
    const t = await Sequelize.transaction()
    try {
        const { tenant_id } = req.user;
        const { employee_id, leave_type_id, from_date, to_date, number_of_days, reason } = req.body;


        //validation
        if (!employee_id) {
            return res.status(400).json({
                success: false,
                message: "Employee ID is required",
            });
        }
        if (!leave_type_id) {
            return res.status(400).json({
                success: false,
                message: "Leave type ID is required",
            });
        }
        if (!from_date) {
            return res.status(400).json({
                success: false,
                message: "From date is required",
            });
        }
        if (!to_date) {
            return res.status(400).json({
                success: false,
                message: "To date is required",
            });
        }
        if (number_of_days == undefined) {
            return res.status(400).json({
                success: false,
                message: "Number of days is required",
            });
        }
        if (reason != undefined) {
            if (!reason.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Reason should not be empty if provided",
                });
            }
        }


        // Check if leave request already exists for the same employee, leave type, and date range
        const employee = await Employee.findOne({
            where: {
                id: employee_id,
                tenant_id,
                is_active: true
            }
        })
        if (!employee) {
            return res.status(404).json({
                success: false,
                message: "Employee not found"
            })
        }
        const policy = await LeavePolicy.findOne({
            where: {
                id: leave_type_id,
                tenant_id,
                is_active: true

            }
        })
        if (!policy) {
            return res.status(400).json({
                success: false,
                message: "Leave policy not found"
            })
        }
        const existingLeaveRequest = await LeaveBalance.findOne({
            where: {
                tenant_id,
                employee_id,
                leave_type_id,
                status: "pending",
                [Op.or]: [
                    {
                        from_date: { [Op.between]: [from_date, to_date] }
                    },
                    {
                        to_date: { [Op.between]: [from_date, to_date] }
                    }
                ]
            }
        });

        if (existingLeaveRequest) {
            return res.status(409).json({
                success: false,
                message: "Leave request already exists for the same employee, leave type, and date range"
            })
        }

        const leaveRequest = await LeaveRequest.create({
            tenant_id,
            employee_id,
            leave_type_id,
            from_date,
            to_date,
            number_of_days,
            reason,
            status: "pending"
        }, { transaction: t })
        //update
        const leaveBalance = await LeaveBalance.findOne({
            where: {
                tenant_id,
                employee_id,
                leave_type_id,
            },
            lock: Sequelize.LOCK
        })
        if (!leaveBalance) {
            return res.status(404).json({
                success: false,
                message: "Leave balance not found"
            })
        }
        if (Number(leaveBalance.balance) < Number(number_of_days)) {
            return res.status(400).json({
                success: false,
                message: "Insufficient leave balance"
            })
        }
        leaveBalance.balance = Number(leaveBalance.balance) - Number(number_of_days)
        await leaveBalance.save({ transaction: t })
        await t.commit();

        return res.status(201).json({
            success: true,
            message: "Leave request submitted successfully",
            data: leaveRequest
        })

    } catch (err) {
        await t.rollback();
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: err.message
        })
    }
}