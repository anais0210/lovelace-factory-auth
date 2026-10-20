import { useAuth } from '../context/AuthContext.jsx';

export function TableauDeBord() {
  const { utilisatrice, deconnexion } = useAuth();
  return (
    <main className="carte-form">
      <h1>Bonjour {utilisatrice.prenom}</h1>
      <p>Tu es connectée en tant que {utilisatrice.role}.</p>
      <button type="button" onClick={deconnexion}>Se déconnecter</button>
    </main>
  );
}
