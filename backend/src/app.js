import express from 'express';
import cookieParser from 'cookie-parser';
import { db } from './db.js';
import { authRouter } from './routes/auth.js';
import { gestionErreurs } from './middlewares/erreurs.js';

export const app = express();

app.use(express.json());        // lit le corps JSON → req.body
app.use(cookieParser());        // lit les cookies → req.cookies

// Vérifie que l'API répond et que la base est joignable
app.get('/api/sante', async (req, res) => {
  await db.query('SELECT 1');
  res.json({ api: 'ok', base: 'ok' });
});

app.use('/api/auth', authRouter);

app.use(gestionErreurs);        // toujours en dernier
