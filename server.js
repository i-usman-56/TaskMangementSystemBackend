import express from "express";
import cors from "cors";
import ConnectDataBase from './config/connection.js';  // Import the async function to connect to MongoDB
import authRoutes from "./routes/authRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import favoritesRoutes from "./routes/favoriteRoutes.js"
import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.PORT || 5050;
const app = express();  

// Cors policy 
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/favorites', favoritesRoutes);
// Root route to verify server is running
app.use('/', (req, res) => {
  res.send(`Server is Running ${process.env.PORT} `);
});
// Routes

// Connect to the database and start the server
app.listen(PORT, async () => {
   ConnectDataBase();  // Ensure database connection is established
  console.log(`Server listening on port ${PORT}`);
});
