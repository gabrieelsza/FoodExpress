import cors from 'cors';
import express from 'express';
import { errorHandler } from './middlewares/errorHandler.js';
import { apiRouter } from './routes/apiRoutes.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '1mb' }));

  app.use('/api', apiRouter);

  app.use((req, res) => {
    res.status(404).json({
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: `Rota ${req.method} ${req.originalUrl} não encontrada.`,
      },
    });
  });

  app.use(errorHandler);
  return app;
}

export const app = createApp();
