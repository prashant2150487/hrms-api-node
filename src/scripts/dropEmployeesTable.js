import "dotenv/config";
import sequelize from "../config/database.js";

async function checkAndDrop() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB");

    // Drop employees table cascading
    await sequelize.query('DROP TABLE IF EXISTS "employees" CASCADE;');
    console.log("Dropped employees table.");

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

checkAndDrop();
