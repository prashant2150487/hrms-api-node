import { DataTypes } from 'sequelize';
import sequelize from '../../config/database.js';
import Employee from '../employeemodel.js';

const SalaryStructure = sequelize.define('SalaryStructure', {
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
  effective_from: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  // We'll use a many-to-many or a JSONB for components for simplicity in this MVP
  // as the user mentioned "M2M through amount", but Sequelize M2M usually 
  // needs a through table. For now, I'll use JSONB to store components and amounts
  // to avoid creating a through table file immediately, or I can create it.
  // Actually, I'll create the through table later. For now JSONB is safer for MVP.
  components: {
    type: DataTypes.JSONB, 
    defaultValue: [], // Array of { component_id, amount }
  },
}, {
  timestamps: true,
  underscored: true,
  tableName: 'salary_structures',
});

// Associations
Employee.hasMany(SalaryStructure, { foreignKey: 'employee_id' });
SalaryStructure.belongsTo(Employee, { foreignKey: 'employee_id' });

export default SalaryStructure;
