import * as authService from '../services/auth.js';
import { ErreurHttp } from '../erreurs.js';

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LONGUEUR_MIN_MOT_DE_PASSE = 8;
const DUREE_COOKIE_MS = 2 * 60 * 60 * 1000;   // 2 h, comme le token

// ---------- Validation : la forme des données, avant toute règle métier ----------
function validerInscription({ prenom, email, motDePasse }) {
  const erreurs = {};
  if (typeof prenom !== 'string' || prenom.trim() === '') {
    erreurs.prenom = 'Le prénom est obligatoire';
  } else if (prenom.trim().length > 100) {
    erreurs.prenom = 'Le prénom fait au maximum 100 caractères';
  }
  if (typeof email !== 'string' || !FORMAT_EMAIL.test(email.trim())) {
    erreurs.email = "L'email n'a pas un format valide";
  }
  if (typeof motDePasse !== 'string' || motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE) {
    erreurs.motDePasse = `Le mot de passe fait au moins ${LONGUEUR_MIN_MOT_DE_PASSE} caractères`;
  }
  return erreurs;
}

// Toujours le même format d'email en base : sans espaces, en minuscules
const normaliserEmail = (email) => email.trim().toLowerCase();

// ---------- Les handlers : reçoivent la requête, appellent le service, répondent ----------
export async function inscription(req, res) {
  const body = req.body ?? {};
  const erreurs = validerInscription(body);
  if (Object.keys(erreurs).length > 0) {
    throw new ErreurHttp(422, 'Données invalides', erreurs);
  }

  const utilisateur = await authService.inscrire({
    prenom: body.prenom.trim(),
    email: normaliserEmail(body.email),
    motDePasse: body.motDePasse,
  });
  res.status(201).json({ utilisateur });
}

function validerConnexion({ email, motDePasse }) {
  const erreurs = {};
  if (typeof email !== 'string' || email.trim() === '') erreurs.email = "L'email est obligatoire";
  if (typeof motDePasse !== 'string' || motDePasse === '') erreurs.motDePasse = 'Le mot de passe est obligatoire';
  return erreurs;
}

export async function connexion(req, res) {
  const body = req.body ?? {};
  const erreurs = validerConnexion(body);
  if (Object.keys(erreurs).length > 0) {
    throw new ErreurHttp(422, 'Données invalides', erreurs);
  }

  const { utilisateur, token } = await authService.connecter({
    email: normaliserEmail(body.email),
    motDePasse: body.motDePasse,
  });

  // Le token voyage dans un cookie httpOnly : le JavaScript du navigateur ne peut pas le lire
  res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: DUREE_COOKIE_MS,
  });
  res.json({ utilisateur });
}

export async function deconnexion(req, res) {
  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production' });
  res.status(204).end();
}

export async function moi(req, res) {
  const utilisateur = await authService.profil(req.utilisateur.id);
  res.json({ utilisateur });
}
