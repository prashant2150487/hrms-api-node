import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Tenant from './tenatModel.js';

// type: DataTypes.CHAR(36),
// defaultValue: DataTypes.UUIDV4,

const Department = sequelize.define('Department', {
  id: {
   type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false,
  },
  tenant_id: {
   type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Tenant,
      key: 'id',
    },
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
  parent_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
  head_employee_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'employees', key: 'id' },
  },
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