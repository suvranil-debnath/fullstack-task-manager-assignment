import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./db.js";
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT;

// ✅ FIX: Set proper CORS options
app.use(cors({
  origin: 'https://whattodonext24.netlify.app/',
  credentials: true,
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is working");
});

// importing routes
import toDoRouter from "./routes/todolist.js";
import authRoutes from './routes/auth.js';

// using routes
app.use("/api/todolist", toDoRouter); 
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});
