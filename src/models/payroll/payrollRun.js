import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Tenant from "../tenatModel.js";
import User from "../userModel.js";

const PayrollRun = sequelize.define(
  "PayrollRun",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "tenants",
        key: "id",
      },
    },
    period_start: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    period_end: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("draft", "processing", "approved", "paid"),
      defaultValue: "draft",
    },
    processed_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "payroll_runs",
  }
);

// Associations
Tenant.hasMany(PayrollRun, { foreignKey: "tenant_id" });
PayrollRun.belongsTo(Tenant, { foreignKey: "tenant_id" });

User.hasMany(PayrollRun, { foreignKey: "processed_by" });
PayrollRun.belongsTo(User, { as: "processor", foreignKey: "processed_by" });

export default PayrollRun;
