import sequelize from '../config/database.js';
import Role from '../models/roleModel.js';
import Permission from '../models/permissionModel.js';
import RolePermission from '../models/rolePermissionModel.js';

const seedRolesAndPermissions = async () => {
    try {
        await sequelize.authenticate();
        console.log('Database connection established.');

        // 1. Define Modules and Actions
        const modules = {
            'employees': 'Employee Management',
            'payroll': 'Payroll',
            'leave': 'Leave Management',
            'recruitment': 'Recruitment / ATS',
            'performance': 'Performance Reviews',
            'attendance': 'Attendance',
            'training': 'Training & LMS',
            'documents': 'Documents',
            'reports': 'Reports & Analytics',
            'system_config': 'System Config',
            'audit_logs': 'Audit Logs',
            'expenses': 'Expense Claims',
            'onboarding': 'Onboarding / Offboarding',
            'assets': 'Asset Management'
        };

        const actions = ['manage', 'view', 'own', 'approve', 'team', 'assign', 'enroll', 'job'];

        // 2. Create Permissions
        console.log('Seeding Permissions...');
        const permissionMap = {};
        for (const [moduleKey, moduleName] of Object.entries(modules)) {
            for (const action of actions) {
                const codename = `${moduleKey}:${action}`;
                const [permission] = await Permission.findOrCreate({
                    where: { codename },
                    defaults: {
                        module: moduleKey,
                        action: action,
                        codename: codename,
                        description: `Can ${action} in ${moduleName}`
                    }
                });
                permissionMap[codename] = permission.id;
            }
        }

        // 3. Define Roles
        const rolesData = [
            { name: 'super_admin', label: 'Super Admin', in_system: 1 },
            { name: 'hr_admin', label: 'HR Admin', in_system: 1 },
            { name: 'manager', label: 'Manager', in_system: 1 },
            { name: 'employee', label: 'Employee', in_system: 1 },
            { name: 'recruiter', label: 'Recruiter', in_system: 1 },
            { name: 'finance', label: 'Finance', in_system: 1 },
            { name: 'auditor', label: 'Auditor', in_system: 1 }
        ];

        console.log('Seeding Roles...');
        const roleMap = {};
        for (const roleData of rolesData) {
            const [role] = await Role.findOrCreate({
                where: { name: roleData.name },
                defaults: roleData
            });
            roleMap[roleData.name] = role.id;
        }

        // 4. Define Permission Matrix Assignments
        // Mapping from Matrix to codename:
        // ✓ -> manage
        // View -> view
        // Own -> own
        // Approve -> approve
        // Team -> team
        // Assign -> assign
        // Enroll -> enroll
        // Job -> job

        const matrix = {
            'super_admin': {
                'employees': 'manage', 'payroll': 'manage', 'leave': 'manage', 'recruitment': 'manage',
                'performance': 'manage', 'attendance': 'manage', 'training': 'manage', 'documents': 'manage',
                'reports': 'manage', 'system_config': 'manage', 'audit_logs': 'manage', 'expenses': 'manage',
                'onboarding': 'manage', 'assets': 'manage'
            },
            'hr_admin': {
                'employees': 'manage', 'payroll': 'manage', 'leave': 'manage', 'recruitment': 'manage',
                'performance': 'manage', 'attendance': 'manage', 'training': 'manage', 'documents': 'manage',
                'reports': 'manage', 'audit_logs': 'view', 'expenses': 'manage', 'onboarding': 'manage',
                'assets': 'manage'
            },
            'manager': {
                'employees': 'view', 'leave': 'approve', 'recruitment': 'view', 'performance': 'manage',
                'attendance': 'team', 'training': 'assign', 'documents': 'team', 'reports': 'team',
                'expenses': 'approve', 'assets': 'view'
            },
            'employee': {
                'employees': 'own', 'payroll': 'view', 'leave': 'view', 'performance': 'view',
                'attendance': 'own', 'training': 'enroll', 'documents': 'own', 'expenses': 'view',
                'onboarding': 'own', 'assets': 'own'
            },
            'recruiter': {
                'recruitment': 'manage', 'documents': 'job'
            },
            'finance': {
                'payroll': 'manage', 'reports': 'manage', 'expenses': 'manage', 'assets': 'manage'
            },
            'auditor': {
                'employees': 'view', 'payroll': 'view', 'leave': 'view', 'recruitment': 'view',
                'performance': 'view', 'attendance': 'view', 'training': 'view', 'documents': 'view',
                'reports': 'view', 'audit_logs': 'view', 'expenses': 'view', 'onboarding': 'view',
                'assets': 'view'
            }
        };

        console.log('Assigning Permissions to Roles...');
        for (const [roleName, modulePerms] of Object.entries(matrix)) {
            const roleId = roleMap[roleName];
            for (const [moduleKey, action] of Object.entries(modulePerms)) {
                const codename = `${moduleKey}:${action}`;
                const permissionId = permissionMap[codename];

                if (permissionId) {
                    await RolePermission.findOrCreate({
                        where: { role_id: roleId, permission_id: permissionId }
                    });
                }
            }
        }

        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding roles and permissions:', error);
        process.exit(1);
    }
};

seedRolesAndPermissions();
