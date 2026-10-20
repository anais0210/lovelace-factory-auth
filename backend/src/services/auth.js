import bcrypt from 'bcryptjs';
import * as Utilisateur from '../models/Utilisateur.js';
import { ErreurHttp } from '../erreurs.js';

const COUT_HASH = 10;          // plus c'est haut, plus c'est lent (et sûr)

export async function inscrire({ prenom, email, motDePasse }) {
  // Règle métier : un email ne sert qu'à un seul compte
  const existante = await Utilisateur.trouverParEmail(email);
  if (existante) {
    throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
  }

  const motDePasseHash = await bcrypt.hash(motDePasse, COUT_HASH);

  try {
    return await Utilisateur.creer({ prenom, email, motDePasseHash });
  } catch (erreur) {
    // 23505 = violation de UNIQUE : deux inscriptions au même instant
    if (erreur.code === '23505') {
      throw new ErreurHttp(409, 'Un compte existe déjà avec cet email');
    }
    throw erreur;
  }
}
