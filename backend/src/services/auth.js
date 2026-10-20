import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as Utilisateur from '../models/Utilisateur.js';
import { ErreurHttp } from '../erreurs.js';

const COUT_HASH = 10;          // plus c'est haut, plus c'est lent (et sûr)
const DUREE_SESSION = '2h';

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

export async function connecter({ email, motDePasse }) {
  const utilisateur = await Utilisateur.trouverParEmail(email);

  // Même message que l'email existe ou non : on ne dit pas quels emails sont inscrits
  const correct = utilisateur?.mot_de_passe_hash
    && await bcrypt.compare(motDePasse, utilisateur.mot_de_passe_hash);
  if (!correct) {
    throw new ErreurHttp(401, 'Email ou mot de passe incorrect');
  }

  const token = jwt.sign(
    { sub: utilisateur.id, role: utilisateur.role },
    process.env.JWT_SECRET,
    { expiresIn: DUREE_SESSION }
  );

  const { mot_de_passe_hash, ...utilisateurPublic } = utilisateur;
  return { utilisateur: utilisateurPublic, token };
}

export async function profil(id) {
  const utilisateur = await Utilisateur.trouverParId(id);
  if (!utilisateur) {
    throw new ErreurHttp(401, 'Session invalide');
  }
  return utilisateur;
}
