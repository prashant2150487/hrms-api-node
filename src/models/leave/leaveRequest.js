import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Employee from '../employeemodel.js';
import LeavePolicy from './leavePolicy.js';

const LeaveRequest = sequelize.define('LeaveRequest', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  employee_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
  leave_type_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'leave_policies',
      key: 'id',
    },
  },
  from_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  to_date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'cancelled'),
    defaultValue: 'pending',
  },
  approved_by: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'employees',
      key: 'id',
    },
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'leave_requests',
});

// Associations
Employee.hasMany(LeaveRequest, { foreignKey: 'employee_id' });
LeaveRequest.belongsTo(Employee, { foreignKey: 'employee_id' });

LeavePolicy.hasMany(LeaveRequest, { foreignKey: 'leave_type_id' });
LeaveRequest.belongsTo(LeavePolicy, { foreignKey: 'leave_type_id' });

Employee.hasMany(LeaveRequest, { as: 'approvedRequests', foreignKey: 'approved_by' });
LeaveRequest.belongsTo(Employee, { as: 'approver', foreignKey: 'approved_by' });

export default LeaveRequest;
