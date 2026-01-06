import express, { Application } from 'express';
import { ipBlocker } from "./middlewares/ipBlocker";
import { securityScanner } from "./middlewares/securityScanner";
import cors from 'cors';

import authRoutes from './routes/auth.routes';

const app: Application = express();

// Core middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.use(ipBlocker);

// ACTIVE DEFENSE LAYER (runs before routes)
app.use(securityScanner);

// Routes
app.use('/api/auth', authRoutes);


export default app;
