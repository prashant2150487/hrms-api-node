import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import Tenant from "../tenatModel.js";

const SalaryComponent = sequelize.define(
  "SalaryComponent",
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
    type: {
      type: DataTypes.ENUM("earning", "deduction"),
      allowNull: false,
    },
    is_taxable: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    formula: {
      type: DataTypes.STRING, // e.g., 'base * 0.1' or fixed value
      allowNull: true,
    },
  },
  {
    timestamps: true,
    underscored: true,
    tableName: "salary_components",
  }
);

// Associations
Tenant.hasMany(SalaryComponent, { foreignKey: "tenant_id" });
SalaryComponent.belongsTo(Tenant, { foreignKey: "tenant_id" });

export default SalaryComponent;
