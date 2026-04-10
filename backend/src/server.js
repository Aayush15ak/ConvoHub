//this is signup branch
import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import cors from "cors";
import connectDB from './lib/db.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
  origin: "https://convohub-app.vercel.app",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    try {
        connectDB();
        console.log('Database connection successful');
    } catch (error) {
        console.error('Error connecting to database:', error);
    }
});