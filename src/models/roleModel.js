import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";
import Tenant from "./tenatModel.js";

const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "tenants",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    in_system: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "roles",
    updatedAt: false,
    createdAt: "created_at",
    indexes: [
      {
        fields: ["tenant_id"],
      },
    ],
  }
);

// Associations
Tenant.hasMany(Role, { foreignKey: "tenant_id", as: "roles" });
Role.belongsTo(Tenant, { foreignKey: "tenant_id", as: "tenant" });

export default Role;
