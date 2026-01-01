import express, { Application } from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app: Application = express();

// Core middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

export default app;
