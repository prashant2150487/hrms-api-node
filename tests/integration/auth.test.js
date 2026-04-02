import request from 'supertest';
import app from '../../src/app.js';
import sequelize from '../../src/config/database.js';
import '../../src/models/index.js'; // Ensure all models are registered before sync
import Role from '../../src/models/roleModel.js';
import Tenant from '../../src/models/tenatModel.js';
import User from '../../src/models/userModel.js';
import Employee from '../../src/models/employeemodel.js';

beforeAll(async () => {
    // Safety check constraints
    if (process.env.NODE_ENV !== 'test') {
        throw new Error('Tests must be run with process.env.NODE_ENV = test');
    }

    // Connect to the DB and recreate schema
    await sequelize.authenticate();
    await sequelize.sync({ force: true });
    
    // The registration controller requires an 'admin' role to exist.
    // Create it here before the tests run.
    await Role.create({
        name: 'admin',
        description: 'Administrator role for testing',
        is_active: true
    });
});

afterAll(async () => {
    // Cleanup and close connection
    await sequelize.close();
});

describe('Auth Integration Tests', () => {

    describe('POST /api/v1/auth/register', () => {
        let createdTenantId;

        it('should successfully register a new tenant and an admin user', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Acme Test Corp',
                    subdomain: 'acme123',
                    email: 'admin@acmecorp.example.com',
                    password: 'SecurePassword123'
                });

            // Expect success response
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe('User created successfully');
            
            // Check payload data
            expect(res.body.data).toHaveProperty('userId');
            expect(res.body.data).toHaveProperty('tenantId');
            expect(res.body.data.subdomain).toBe('acme123');
            
            createdTenantId = res.body.data.tenantId;

            // Verify the Tenant in DB
            const tenant = await Tenant.findOne({ where: { subdomain: 'acme123' }});
            expect(tenant).not.toBeNull();
            expect(tenant.name).toBe('Acme Test Corp');

            // Verify the User in DB
            const user = await User.findByPk(res.body.data.userId);
            expect(user).not.toBeNull();
            expect(user.email).toBe('admin@acmecorp.example.com');
            expect(user.tenant_id).toBe(tenant.id);

            // Verify the generated Employee Profile form the first_name parsing logic
            const employee = await Employee.findOne({ where: { user_id: user.id }});
            expect(employee).not.toBeNull();
            expect(employee.tenant_id).toBe(tenant.id);
            expect(employee.first_name).toBe('Acme'); // Due to "name.split(' ')[0]"
            
        });

        it('should fail registration if the subdomain already exists', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Another Corp',
                    subdomain: 'acme123', // Reusing the same subdomain
                    email: 'admin2@othercorp.com',
                    password: 'SecurePassword123'
                });

            expect(res.status).toBe(400); 
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('Subdomain already exists');
        });

        it('should fail registration when required fields are missing', async () => {
            const res = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    name: 'Incomplete Corp' // Missing subdomain, email, and password
                });

            expect(res.status).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe('All field are required');
        });

    });

});
