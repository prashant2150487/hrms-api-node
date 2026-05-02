import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Tenant from "../tenatModel.js";

const ShiftSchedule = sequelize.define(
  "ShiftSchedule",
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    break_minutes: {
      type: DataTypes.INTEGER,
      defaultValue: 30,
    },
    days_of_week: {
      type: DataTypes.JSONB, // e.g., [1, 2, 3, 4, 5] for Mon-Fri
      defaultValue: [1, 2, 3, 4, 5],
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "shift_schedules",
  }
);

// Associations
Tenant.hasMany(ShiftSchedule, { foreignKey: "tenant_id" });
ShiftSchedule.belongsTo(Tenant, { foreignKey: "tenant_id" });

export default ShiftSchedule;
