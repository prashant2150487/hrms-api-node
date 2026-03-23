import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Employee from '../employeemodel.js';
import ShiftSchedule from './shiftSchedule.js';

const EmployeeShift = sequelize.define('EmployeeShift', {
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
  shift_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'shift_schedules',
      key: 'id',
    },
  },
  effective_from: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  effective_to: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'employee_shifts',
});

// Associations
Employee.hasMany(EmployeeShift, { foreignKey: 'employee_id' });
EmployeeShift.belongsTo(Employee, { foreignKey: 'employee_id' });

ShiftSchedule.hasMany(EmployeeShift, { foreignKey: 'shift_id' });
EmployeeShift.belongsTo(ShiftSchedule, { foreignKey: 'shift_id' });

export default EmployeeShift;
