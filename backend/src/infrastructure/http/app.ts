import express from 'express';
import cors from 'cors';
import { env } from '../config/env.js';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import { createRoutes } from './routes/index.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api', createRoutes());

  app.use(errorHandler);

  return app;
}
