import express from "express";
import cors from "cors";
import colors from "colors";
import ConnectDataBase from "./config/connection.js"; // Import the async function to connect to MongoDB
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import favoritesRoutes from "./routes/favorite.routes.js";
import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();
colors.enable();
// Cors policy
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/favorites", favoritesRoutes);
// Root route to verify server is running
app.use("/", (req, res) => {
  res.send(`Server is Running ${process.env.PORT} `);
});
// Routes

// Connect to the database and start the server
app.listen(PORT, async () => {
  ConnectDataBase(); // Ensure database connection is established
  console.log(`Server listening on port ${PORT}`.blue.underline);
});
