import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Tenant from "./tenatModel.js";
import Department from "./departmentmodel.js";

const Designation = sequelize.define(
  "Designation",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "tenants", key: "id" },
    },
    department_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "departments", key: "id" },
    },
    title: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: "title should be unique within a tenant",
    },
    // Schema ENUM (note: c_level with underscore, includes intern and director)
    level: {
      type: DataTypes.ENUM(
        "intern",
        "junior",
        "mid",
        "senior",
        "lead",
        "manager",
        "director",
        "c_level"
      ),
      allowNull: false,
    },
    // Annual CTC salary band for this designation
    salary_band_min: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    salary_band_max: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true,
    },
    is_active: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    sequelize,
    modelName: "Designation",
    tableName: "designations",
    timestamps: true,
    updatedAt: false,
    createdAt: "created_at",
    underscored: true,
    indexes: [{ fields: ["tenant_id"] }, { fields: ["department_id"] }],
  }
);

Tenant.hasMany(Designation, { foreignKey: "tenant_id" });
Designation.belongsTo(Tenant, { foreignKey: "tenant_id" });

Department.hasMany(Designation, { foreignKey: "department_id" });
Designation.belongsTo(Department, { foreignKey: "department_id" });

export default Designation;
