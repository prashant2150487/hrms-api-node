import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Employee from "../employeemodel.js";
import LeavePolicy from "./leavePolicy.js";

const LeaveBalance = sequelize.define(
  "LeaveBalance",
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
    leave_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "leave_policies",
        key: "id",
      },
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    allocated: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    used: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    pending: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    remaining: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "leave_balances",
  }
);

// Associations
Employee.hasMany(LeaveBalance, { foreignKey: "employee_id" });
LeaveBalance.belongsTo(Employee, { foreignKey: "employee_id" });

LeavePolicy.hasMany(LeaveBalance, { foreignKey: "leave_type_id" });
LeaveBalance.belongsTo(LeavePolicy, { foreignKey: "leave_type_id" });

export default LeaveBalance;
