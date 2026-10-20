import express from 'express';
import { db } from './db.js';

export const app = express();

app.use(express.json());

// Vérifie que l'API répond et que la base est joignable
app.get('/api/sante', async (req, res) => {
  await db.query('SELECT 1');
  res.json({ api: 'ok', base: 'ok' });
});
