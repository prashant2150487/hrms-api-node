import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './userModel.js';
import Tenant from './tenatModel.js';
import Department from './departmentmodel.js';
import Designation from './designationModel.js';

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  // Every employee belongs to a tenant directly (not just via user)
  tenant_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: 'tenants', key: 'id' },
  },
  // 1:1 with users table
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: { model: 'users', key: 'id' },
  },
  // Auto-generated: EMP-0001
  emp_code: {
    type: DataTypes.STRING(30),
    allowNull: false,
    unique: true,
  },

  // ── Personal Info ───────────────────────────────────────────
  first_name: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  last_name: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  middle_name: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  date_of_birth: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  // male | female | non_binary | prefer_not_to_say
  gender: {
    type: DataTypes.ENUM('male', 'female', 'non_binary', 'prefer_not_to_say'),
    allowNull: true,
  },
  marital_status: {
    type: DataTypes.ENUM('single', 'married', 'divorced', 'widowed'),
    allowNull: true,
  },
  // ISO 3166-1 alpha-2 country code
  nationality: {
    type: DataTypes.CHAR(2),
    allowNull: true,
  },
  // Encrypted at-rest: NIN / SSN / Aadhaar etc.
  national_id: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  passport_number: {
    type: DataTypes.STRING(30),
    allowNull: true,
  },
  personal_email: {
    type: DataTypes.STRING(180),
    allowNull: true,
  },
  phone_primary: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  phone_emergency: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  emergency_contact_name: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  emergency_contact_rel: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  blood_group: {
    type: DataTypes.STRING(5),
    allowNull: true,
  },

  // ── Address ─────────────────────────────────────────────────
  address_line1: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  address_line2: {
    type: DataTypes.STRING(200),
    allowNull: true,
  },
  city: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  state: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  postal_code: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  country_code: {
    type: DataTypes.CHAR(2),
    allowNull: true,
  },

  // ── Org Assignment ──────────────────────────────────────────
  department_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'departments', key: 'id' },
  },
  designation_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'designations', key: 'id' },
  },
  // INT FK — matches work_locations.id (INT)
  work_location_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    // references: { model: 'work_locations', key: 'id' }, // TODO: Re-enable when work_locations model exists
  },
  // Self-referencing FK for reporting line
  manager_id: {
    type: DataTypes.UUID,
    allowNull: true,
    references: { model: 'employees', key: 'id' },
  },

  // ── Employment ──────────────────────────────────────────────
  // Schema uses underscores: full_time not full-time
  employment_type: {
    type: DataTypes.ENUM('full_time', 'part_time', 'contract', 'intern', 'consultant'),
    allowNull: false,
    defaultValue: 'full_time',
  },
  work_mode: {
    type: DataTypes.ENUM('onsite', 'remote', 'hybrid'),
    allowNull: false,
    defaultValue: 'onsite',
  },
  date_of_joining: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  probation_end_date: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  // NULL = still employed
  date_of_leaving: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
  notice_period_days: {
    type: DataTypes.SMALLINT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'on_leave', 'absconding', 'resigned', 'terminated', 'deceased'),
    allowNull: false,
    defaultValue: 'active',
  },
  exit_reason: {
    type: DataTypes.ENUM('resignation', 'termination', 'retirement', 'contract_end', 'other'),
    allowNull: true,
  },
  exit_notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  // ── Payroll / Statutory ─────────────────────────────────────
  // INT FK — matches salary_grades.id (INT)
  // salary_grade_id: {
  //   type: DataTypes.INTEGER,
  //   allowNull: true,
  //   references: { model: 'salary_grades', key: 'id' },
  // },
  // All encrypted at-rest
  bank_account_no: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
  bank_ifsc: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  bank_name: {
    type: DataTypes.STRING(80),
    allowNull: true,
  },
  pan_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },
  uan_number: {
    type: DataTypes.STRING(20),
    allowNull: true,
  },

  // Soft delete
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Employee',
  tableName: 'employees',
  timestamps: true,
  underscored: true,
  paranoid: true,   // soft-delete via deleted_at
  indexes: [
    { fields: ['tenant_id'] },
    { fields: ['department_id'] },
    { fields: ['designation_id'] },
    { fields: ['date_of_joining'] },
    { fields: ['date_of_leaving'] },
    { fields: ['status'] },
    { unique: true, fields: ['emp_code'] },
  ],
});

// ── Associations ─────────────────────────────────────────────
Tenant.hasMany(Employee, { foreignKey: 'tenant_id' });
Employee.belongsTo(Tenant, { foreignKey: 'tenant_id' });

User.hasOne(Employee, { foreignKey: 'user_id' });
Employee.belongsTo(User, { foreignKey: 'user_id' });

Department.hasMany(Employee, { foreignKey: 'department_id' });
Employee.belongsTo(Department, { foreignKey: 'department_id' });

Designation.hasMany(Employee, { foreignKey: 'designation_id' });
Employee.belongsTo(Designation, { foreignKey: 'designation_id' });

// Self-referencing manager hierarchy
Employee.hasMany(Employee, { as: 'subordinates', foreignKey: 'manager_id' });
Employee.belongsTo(Employee, { as: 'manager', foreignKey: 'manager_id' });

export default Employee;