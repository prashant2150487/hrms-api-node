import { DataTypes } from 'sequelize';
import sequelize from "../config/database.js";


const Permission = sequelize.define('Permission', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    // Module the permission belongs to
    // employees | payroll | leave | attendance | recruitment |
    // performance | training | documents | reports | system_config |
    // audit_logs | expenses | onboarding | assets
    module: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Atomic action: view | create | update | delete | approve | export | assign | enroll
    action: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Unique dot-notation key e.g. "leave.approve", "payroll.export"
    // Used for runtime permission checks in middleware
    codename: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: true,
    },
    description: {
        type: DataTypes.STRING(255),
        allowNull: true,
    },
}, {
    timestamps: false,
    underscored: true,
    tableName: 'permissions'
});



export default Permission;