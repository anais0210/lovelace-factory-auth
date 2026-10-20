import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';
import { Champ } from '../components/Champ.jsx';

export function Connexion() {
  const [form, setForm] = useState({ email: '', motDePasse: '' });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const modifier = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function soumettre(e) {
    e.preventDefault();
    setErreurs({});
    setMessage('');
    setEnvoi(true);
    try {
      await connexion(form);
      navigate(location.state?.depuis ?? '/', { replace: true });
    } catch (erreur) {
      setErreurs(erreur.erreurs);
      setMessage(erreur.status === 422 ? 'Corrige les champs signalés.' : erreur.message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="carte-form">
      <h1>Se connecter</h1>
      {location.state?.inscrite && (
        <p role="status" className="succes">Compte créé : tu peux te connecter.</p>
      )}
      {message && <p role="alert" className="alerte">{message}</p>}
      <form onSubmit={soumettre} noValidate>
        <Champ id="email" label="Email" type="email" value={form.email} onChange={modifier}
          erreur={erreurs.email} autoComplete="email" required />
        <Champ id="motDePasse" label="Mot de passe" type="password" value={form.motDePasse}
          onChange={modifier} erreur={erreurs.motDePasse} autoComplete="current-password" required />
        <button type="submit" disabled={envoi}>{envoi ? 'Connexion…' : 'Se connecter'}</button>
      </form>
      <p>Pas encore de compte ? <Link to="/inscription">Créer un compte</Link></p>
    </main>
  );
}
