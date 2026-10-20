import { db } from '../db.js';

// Les colonnes qu'on peut renvoyer au front : jamais le hash
const COLONNES_PUBLIQUES = 'id, prenom, email, role, date_inscription';

export async function trouverParEmail(email) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES}, mot_de_passe_hash FROM utilisateurs WHERE email = $1`,
    [email]
  );
  return rows[0] ?? null;
}

export async function trouverParId(id) {
  const { rows } = await db.query(
    `SELECT ${COLONNES_PUBLIQUES} FROM utilisateurs WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
}

export async function creer({ prenom, email, motDePasseHash }) {
  const { rows } = await db.query(
    `INSERT INTO utilisateurs (prenom, email, mot_de_passe_hash)
     VALUES ($1, $2, $3)
     RETURNING ${COLONNES_PUBLIQUES}`,
    [prenom, email, motDePasseHash]
  );
  return rows[0];
}
