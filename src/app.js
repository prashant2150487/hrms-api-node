import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { ApiResponse } from './utils/apiResponse.js';
import errorHandler from './middleware/errorHandler.js';

import v1Routes from './routes/v1/index.js';

const app = express();

app.use(helmet());
app.use(cors({
  origin: [
    process.env.CLIENT_URL
  ], credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/v1', v1Routes);

app.get('/health', (req, res) => {
  res.status(200).json(new ApiResponse(200, { status: 'ok' }, 'HRMS API is healthy'));
});

// Global Error Handler
app.use(errorHandler);

export default app;
