import "dotenv/config";
import sequelize from "../config/database.js";

async function dropSchema() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB");

    const [results] = await sequelize.query(`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public';
    `);

    for (const row of results) {
      await sequelize.query(`DROP TABLE IF EXISTS "${row.tablename}" CASCADE;`);
      console.log(`Dropped ${row.tablename}`);
    }

    console.log("Dropped all tables successfully.");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

dropSchema();
