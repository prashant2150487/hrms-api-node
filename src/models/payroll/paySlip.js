import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import PayrollRun from "./payrollRun.js";
import Employee from "../employeemodel.js";

const PaySlip = sequelize.define(
  "PaySlip",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    payroll_run_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "payroll_runs",
        key: "id",
      },
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
    },
    gross: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    deductions: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },
    net: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
    },
    tax: {
      type: DataTypes.DECIMAL(15, 2),
      defaultValue: 0,
    },
    status: {
      type: DataTypes.ENUM("draft", "paid", "cancelled"),
      defaultValue: "draft",
    },
    pdf_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "payslips",
  }
);

// Associations
PayrollRun.hasMany(PaySlip, {
  foreignKey: "payroll_run_id",
  onDelete: "CASCADE",
});
PaySlip.belongsTo(PayrollRun, { foreignKey: "payroll_run_id" });

Employee.hasMany(PaySlip, { foreignKey: "employee_id" });
PaySlip.belongsTo(Employee, { foreignKey: "employee_id" });

export default PaySlip;
