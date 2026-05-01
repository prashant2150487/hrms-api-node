import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Tenant from './tenatModel.js';
import Role from './roleModel.js';

const User = sequelize.define('User', {
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
  role_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "roles",
      key: "id"
    }
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    // unique: 'user_tenant_email', 
  },
  password_hash: {
    type: DataTypes.STRING(225),
    allowNull: true
  },
  refresh_token: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false
  },
  is_email_varified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  mfa_enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false
  },
  mfa_secret: {
    type: DataTypes.STRING(64),
    allowNull: true,
  },
  failed_attempts: {
    type: DataTypes.SMALLINT,
    allowNull: false,
    defaultValue: 0,
  },
  locked_until: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  last_login_ip: {
    type: DataTypes.STRING(45),
    allowNull: true,
  },
  avatar_url: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  delete_at: {
    type: DataTypes.DATE,
    allowNull: true,
  }


}, {
  timestamps: true,
  underscored: true,
  tableName: 'users',
  paranoid: true,
  indexes: [
    {
      unique: true,
      fields: ['tenant_id', 'email'],
      name: 'user_tenant_email'
    },
    {
      fields: ['tenant_id']
    },
    {
      fields: ['role_id']
    }
  ]
});

// Associations
Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Role.hasMany(User, { foreignKey: 'role_id', as: 'users' });
User.belongsTo(Role, { foreignKey: 'role_id', as: 'role' });

export default User;
