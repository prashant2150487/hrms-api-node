import "dotenv/config";
import app from "./app.js";
import sequelize from "./config/database.js";
import "./models/index.js";

const PORT = Number(process.env.PORT) || 3000;

const startServer = async () => {
  try {
    // await sequelize.authenticate();
    console.log("Database connected successfully.");

    await sequelize.sync({ alter: true });
    console.log("Database sync complete.");

    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup error:", error);
    process.exit(1);
  }
};

startServer();
