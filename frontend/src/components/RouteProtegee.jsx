import { Navigate, useLocation } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

// Enveloppe une page réservée aux personnes connectées
export function RouteProtegee({ children }) {
  const { utilisatrice, chargement } = useAuth();
  const location = useLocation();

  if (chargement) return <p role="status">Chargement…</p>;
  if (!utilisatrice) {
    // On retient la page demandée pour y revenir après la connexion
    return <Navigate to="/connexion" replace state={{ depuis: location.pathname }} />;
  }
  return children;
}
