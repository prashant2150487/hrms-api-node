import Designation from "../models/designationModel.js";




export const getAllDesignations = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const designations = await Designation.findAll({
            where: {
                tenant_id,

            }
        })
        if (!designations) {
            return res.status(404).json({
                success: true,
                message: "No designations found for this tenant",
                data: null
            })
        }


        return res.status(200).json({
            success: true,
            message: "Designations fetched successfully",
            data: designations
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}


export const createDesignation = async (req, res) => {
    try {
        const { tenant_id } = req.user;
        const { title, level, department_id, salary_band_min, salary_band_max } = req.body;

        const newDesignation = await Designation.create({
            tenant_id,
            title,
            level,
            department_id,
            salary_band_min,
            salary_band_max
        })

        return res.status(201).json({
            success: true,
            message: "Designation created successfully",
            data: newDesignation
        })

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}