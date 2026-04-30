import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Tenant from './tenatModel.js';

const Department = sequelize.define('Department', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  tenant_id: {
    type: DataTypes.CHAR(36),
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
  },
  name: {
    type: DataTypes.STRING(120),
    allowNull: false,
  },
  // Short dept code e.g. ENG, HR, FIN
  code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  // Self-referencing FK for org hierarchy — INT to match id type
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
  // FK to employees.id — schema column is head_employee_id (not head_id)
  head_employee_id: {
    type: DataTypes.CHAR(36),
    allowNull: true,
    references: { model: 'employees', key: 'id' },
  },
  // GL cost centre code
  cost_centre: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  is_active: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 1,
  },
}, {
  sequelize,
  modelName: 'Department',
  tableName: 'departments',
  timestamps: true,
  updatedAt: 'updated_at',
  createdAt: 'created_at',
  underscored: true,
  indexes: [
    { fields: ['tenant_id'] },
    { fields: ['code'] },
  ],
});

Tenant.hasMany(Department, { foreignKey: 'tenant_id' });
Department.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Self-referencing hierarchy
Department.hasMany(Department, { as: 'subDepartments', foreignKey: 'parent_id' });
Department.belongsTo(Department, { as: 'parentDepartment', foreignKey: 'parent_id' });

export default Department;