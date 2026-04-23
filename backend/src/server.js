import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import messageRoutes from './routes/message.routes.js';
import cors from "cors";
import connectDB from './lib/db.js';
import cookieParser from 'cookie-parser';
dotenv.config();
import cloudinary from './lib/cloudinary.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

// its better to connect to db first and then start the server, so that if db connection fails, we won't have a running server without db connection
connectDB().then(() => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
}).catch((error) => {
    console.error('Error connecting to database:', error);
    process.exit(1);
});

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
//     try {
//         connectDB();
//         console.log('Database connection successful');
//     } catch (error) {
//         console.error('Error connecting to database:', error);
//     }
// });