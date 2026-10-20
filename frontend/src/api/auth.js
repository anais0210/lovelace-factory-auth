// Tous les appels à l'API d'authentification, au même endroit.
// Chaque fonction renvoie les données, ou lance une erreur qui porte le status et les erreurs par champ.

async function appeler(chemin, options = {}) {
  const res = await fetch(`/api/auth${chemin}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (res.status === 204) return null;
  const donnees = await res.json().catch(() => ({}));
  if (!res.ok) {
    const erreur = new Error(donnees.message ?? 'Erreur inattendue');
    erreur.status = res.status;
    erreur.erreurs = donnees.erreurs ?? {};
    throw erreur;
  }
  return donnees;
}

export const inscrire = (infos) =>
  appeler('/inscription', { method: 'POST', body: JSON.stringify(infos) });

export const connecter = (identifiants) =>
  appeler('/connexion', { method: 'POST', body: JSON.stringify(identifiants) });

export const deconnecter = () => appeler('/deconnexion', { method: 'POST' });

export const recupererMoi = () => appeler('/moi');
