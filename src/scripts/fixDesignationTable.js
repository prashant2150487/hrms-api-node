import "dotenv/config";
import sequelize from "../config/database.js";

async function fixTable() {
  try {
    await sequelize.authenticate();
    console.log("Connected to DB");

    const queryInterface = sequelize.getQueryInterface();
    const tableInfo = await queryInterface.describeTable("designations");
    console.log("Table info id type:", tableInfo.id.type);

    if (tableInfo.id.type === "INTEGER") {
      console.log("Dropping designations table to fix id column type...");
      await sequelize.query('DROP TABLE IF EXISTS "designations" CASCADE;');
      console.log("Dropped. It will be recreated on next server start.");
    }
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

fixTable();
