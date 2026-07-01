import dotenv from 'dotenv';

// carrega variáveis da Groq
dotenv.config({
  path: '.env.grooq'
});

import express from 'express';
import cors from 'cors';
import path from 'path';

import authRoutes from './routes/auth.routes';
import donationsRoutes from './routes/donations.routes';
import analyticsRoutes from './routes/analytics.routes';
import assistenteRoutes from './routes/assistenteRoutes';

const app = express();
const PORT = process.env.PORT || 3333;

// CORS PRIMEIRO
app.use(
  cors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174'
    ],
    credentials: true,
  })
);
// BODY PARSER DEPOIS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// UPLOADS
const uploadDir = process.env.UPLOAD_DIR || './uploads';

app.use(
  '/uploads',
  express.static(path.resolve(uploadDir))
);

// HEALTH
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    name: 'Alimenta+ API',
    version: '1.0.0',
    message: 'Conectando alimentos a quem precisa.',
  });
});

// ROTAS
app.use('/assistente', assistenteRoutes);

app.use('/api/auth', authRoutes);
app.use('/api/donations', donationsRoutes);
app.use('/api/analytics', analyticsRoutes);

// 404
app.use((_req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada'
  });
});

// ERRO GLOBAL
app.use((
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) => {
  console.error(err);

  res.status(500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

// START
app.listen(PORT, () => {
  console.log(
    `🌱 Alimenta+ API rodando em http://localhost:${PORT}`
  );
});

export default app;