import express, { Application } from 'express';
import { ipBlocker } from "./middleware/ipBlocker";
import { securityScanner } from "./middleware/securityScanner";
import { authMiddleware } from './middleware/auth.middleware';
import cors from 'cors';

import authRoutes from './routes/auth.routes';
import logRoutes from './routes/log.routes';
import incidentRoutes from './routes/incident.routes';
import blockedIPRoutes from './routes/blockedIP.routes';
import dashboardRoutes from './routes/dashboard.routes';

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
app.use("/api/logs", logRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/blocked-ips", blockedIPRoutes);
app.use("/api/dashboard", dashboardRoutes);


export default app;
