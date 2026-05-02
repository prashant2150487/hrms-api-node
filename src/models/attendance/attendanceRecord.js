import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Employee from "../employeemodel.js";

const AttendanceRecord = sequelize.define(
  "AttendanceRecord",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    employee_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "employees",
        key: "id",
      },
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    check_in: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    check_out: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    work_hours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    overtime_hours: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0,
    },
    source: {
      type: DataTypes.ENUM("biometric", "manual", "geo"),
      defaultValue: "manual",
    },
    status: {
      type: DataTypes.ENUM("present", "absent", "half-day", "holiday"),
      defaultValue: "present",
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "attendance_records",
  }
);

// Associations
Employee.hasMany(AttendanceRecord, { foreignKey: "employee_id" });
AttendanceRecord.belongsTo(Employee, { foreignKey: "employee_id" });

export default AttendanceRecord;
