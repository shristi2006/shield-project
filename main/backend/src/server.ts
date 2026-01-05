import dotenv from 'dotenv';
import { startAttackSimulator } from "./services/attackSimulator";

dotenv.config();

import app from './app';
import connectDB from './config/db';

connectDB();

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

startAttackSimulator(5000); // every 5 seconds

