import Department from "../models/departmentmodel.js";

import Designation from "../models/designationModel.js";
import { levelsEnums } from "../utils/enum.js";

export const getAllDesignations = async (req, res) => {
  try {
    const { tenant_id } = req.user;

    const designations = await Designation.findAll({
      where: {
        tenant_id,
        is_active: 1,
      },
      include: [
        {
          model: Department,
          attributes: ["id", "name"],
          // where: department_id ? { id: department_id } : undefined,
        },
      ],
    });

    if (!designations) {
      return res.status(404).json({
        success: true,
        message: "No designations found for this tenant",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Designations fetched successfully",
      data: designations,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const createDesignation = async (req, res) => {
  try {
    const { tenant_id } = req.user;

    const { title, level, department_id, salary_band_min, salary_band_max } =
      req.body;

    // Title validation
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    // Level validation
    if (!level || !level.trim()) {
      return res.status(400).json({
        success: false,
        message: "Level is required",
      });
    }

    if (!levelsEnums.includes(level.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: "Invalid level provided",
      });
    }

    // Salary validation
    if (
      salary_band_min &&
      salary_band_max &&
      Number(salary_band_min) > Number(salary_band_max)
    ) {
      return res.status(400).json({
        success: false,
        message: "Min salary cannot be greater than max salary",
      });
    }

    // Department validation
    if (department_id) {
      const department = await Department.findOne({
        where: { id: department_id, tenant_id },
      });

      if (!department) {
        return res.status(404).json({
          success: false,
          message: "Department not found",
        });
      }
    }

    // Duplicate check
    const existing = await Designation.findOne({
      where: {
        title: title.trim(),
        tenant_id,
        is_active: 1,
      },
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Designation already exists",
      });
    }

    // Create
    const newDesignation = await Designation.create({
      tenant_id,
      title: title.trim(),
      level: level.trim().toLowerCase(),
      department_id: department_id || null,
      salary_band_min: salary_band_min || null,
      salary_band_max: salary_band_max || null,
    });

    return res.status(201).json({
      success: true,
      message: "Designation created successfully",
      data: newDesignation,
    });
  } catch (err) {
    console.error("Create Designation Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
    });
  }
};
export const getDesignationById = async (req, res) => {
  try {
    const { tenant_id } = req.user;
    const { id } = req.params;
    const designation = await Designation.findOne({
      where: {
        id,
        tenant_id,
        is_active: 1,
      },
      include: [
        {
          model: Department,
          attributes: ["id", "name"],
        },
      ],
    });

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Designation fetched successfully",
      data: designation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateDesignation = async (req, res) => {
  try {
    const { tenant_id } = req.user;
    const { id } = req.params;
    const { title, level, department_id } = req.body;
    const designation = await Designation.findOne({
      where: {
        id,
        tenant_id,
        is_active: 1,
      },
    });
    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }
    if (title) {
      designation.title = title;
    }
    if (level) {
      designation.level = level;
    }
    if (department_id) {
      designation.department_id = department_id;
    }
    await designation.save();
    return res.status(200).json({
      success: true,
      message: "Designation update successfully",
      data: designation,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteDesignation = async (req, res) => {
  try {
    const { tenant_id } = req.user;
    const { id } = req.params;

    const designation = await Designation.findOne({
      where: {
        id,
        tenant_id,
        is_active: 1,
      },
    });
    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }
    designation.is_active = false;
    await designation.save();
    return res.status(200).json({
      success: true,
      message: "Designation deleted sucessfully",
      data: designation,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err.message,
    });
  }
};
