import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Tenant = sequelize.define('Tenant', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(150),
    allowNull: false,
  },
  subdomain: {
    type: DataTypes.STRING(80),
    allowNull: false,
    validate: {
      notEmpty: true,
      is: /^[a-z0-9-]+$/, // only safe subdomain chars
    },
    set(value) {
      this.setDataValue('subdomain', value.toLowerCase());
    }
  },
  plan: {
    type: DataTypes.ENUM('free', 'starter', 'professional', 'enterprise'),
    allowNull: false,
    defaultValue: 'free',
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
  //  ISO 3166-1 alpha-2  e.g. IN, US, GB
  country_code: {
    type: DataTypes.CHAR(2),
    allowNull: true
  },
  // IANA timezone string e.g. Asia/Kolkata
  timezone: {
    type: DataTypes.STRING(60),
    allowNull: false,
    defaultValue: 'UTC',
  },
  // currency code e.g. INR, USD, EUR
  currency_code: {
    type: DataTypes.CHAR(3),
    allowNull: true,
    defaultValue: 'INR'
  },
  logo_url: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  // Branding, feature flags, policy 


  settings: {
    type: DataTypes.JSON,
    defaultValue: {},
    allowNull: true
  },
  // Max employees allowed under current plan
  max_employees: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 10
  },
  delete_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
  underscored: true,
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['subdomain'],
    }
  ],
  tableName: 'tenants',
});


export default Tenant;
