import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './config/db.js';
import cors from 'cors';

import authRoute from './routes/authRoute.js';
import examRoute from './routes/examRoute.js';
import resultRoute from './routes/resultRoute.js';
import questionRoute from './routes/questionRoute.js';

const app = express();

// Config
dotenv.config();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Database connection
connectDB();

// Routes
app.use('/api/auth', authRoute);
app.use('/api/exam', examRoute);
app.use('/api/question', questionRoute);
app.use('/api/result', resultRoute);

// Root route
app.get('/', (req, res) => {
    res.send('welcome');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
