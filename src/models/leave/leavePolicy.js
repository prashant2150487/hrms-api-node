import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Tenant from '../tenatModel.js';

const LeavePolicy = sequelize.define('LeavePolicy', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'tenants',
      key: 'id',
    },
  },
  leave_type: {
    type: DataTypes.ENUM('annual', 'sick', 'maternity', 'paternity', 'unpaid', 'comp-off'),
    allowNull: false,
  },
  days_allowed: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  carryover_limit: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  applicable_to: {
    type: DataTypes.JSONB, // e.g., { gender: 'female', employment_type: 'full-time' }
    defaultValue: {},
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'leave_policies',
});

// Associations
Tenant.hasMany(LeavePolicy, { foreignKey: 'tenant_id' });
LeavePolicy.belongsTo(Tenant, { foreignKey: 'tenant_id' });

export default LeavePolicy;
