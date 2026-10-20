import { createContext, useContext, useEffect, useState } from 'react';
import * as api from '../api/auth.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [utilisatrice, setUtilisatrice] = useState(null);
  const [chargement, setChargement] = useState(true);

  // Au chargement de l'app : le cookie est-il encore valide ?
  useEffect(() => {
    api.recupererMoi()
      .then((donnees) => setUtilisatrice(donnees.utilisateur))
      .catch(() => setUtilisatrice(null))
      .finally(() => setChargement(false));
  }, []);

  async function connexion(identifiants) {
    const donnees = await api.connecter(identifiants);
    setUtilisatrice(donnees.utilisateur);
  }

  async function deconnexion() {
    await api.deconnecter();
    setUtilisatrice(null);
  }

  return (
    <AuthContext.Provider value={{ utilisatrice, chargement, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
