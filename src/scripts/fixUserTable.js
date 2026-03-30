console.log('Script file loaded');
import sequelize from '../config/database.js';

const fixUserTable = async () => {
  try {
    console.log('Starting database fix...');
    
    // 1. Drop existing default
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_active" DROP DEFAULT;');
    console.log('Dropped default for is_active');

    // 2. Change column type with casting
    // If it was 1/0, we cast to boolean
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_active" TYPE BOOLEAN USING (is_active::integer::boolean);');
    console.log('Changed is_active type to BOOLEAN');

    // 3. Set new default
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_active" SET DEFAULT true;');
    console.log('Set new default for is_active');

    // 3. Fix is_email_varified if it was changed
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_email_varified" DROP DEFAULT;');
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_email_varified" TYPE BOOLEAN USING (is_email_varified::integer::boolean);');
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "is_email_varified" SET DEFAULT false;');
    console.log('Changed is_email_varified type to BOOLEAN');

    // 4. Fix mfa_enabled if it was changed
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "mfa_enabled" DROP DEFAULT;');
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "mfa_enabled" TYPE BOOLEAN USING (mfa_enabled::integer::boolean);');
    await sequelize.query('ALTER TABLE "users" ALTER COLUMN "mfa_enabled" SET DEFAULT false;');
    console.log('Changed mfa_enabled type to BOOLEAN');

    console.log('Database fix completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing database:', error);
    process.exit(1);
  }
};

fixUserTable();
