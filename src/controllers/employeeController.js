



// GET
// /employees/
// HR Admin/Manager
// List employees (filterable)

export const getAllEmployees = async (req, res, next) => {
    try {
        const { tenant_id } = req.user;
        const { page = 1, limit = 10, search = "" } = req.query;

        const offset = (page - 1) * limit;
        const where={
            tenant_id,
            [Op.or]:[
                {firstName:{[Op.iLike]:`%${search}%`}},
                {lastName:{[Op.iLike]:`%${search}%`}},
                {email:{[Op.iLike]:`%${search}%`}},
                {employeeCode:{[Op.iLike]:`%${search}%`}}
            ]
        }
        const {count,rows}=await Employee.findAndCountAll({
            where,
            limit,
            offset,
            attributes:[
                "id",
                "firstName",
                "lastName",
                "email",
                "employeeCode",
                "phone",
                "dateOfJoining",
                "status",
                "profilePicture",
                "departmentId",
                "designationId",
                "managerId",
                "roleId",
                "shiftId",
                "workLocationId",
                "employmentType",
                "probationEndDate",
                "employmentStatus",
                "terminationDate",
                "terminationReason",
                "rehireDate",
                "rehireReason"
            ]
        });

        return res.status(200).json({
            success: true,
            message: "Employees fetched successfully",
            data: {
                count,
                rows,
                totalPages: Math.ceil(count / limit),
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
