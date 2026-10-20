import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { inscrire } from '../api/auth.js';
import { Champ } from '../components/Champ.jsx';

export function Inscription() {
  const [form, setForm] = useState({ prenom: '', email: '', motDePasse: '' });
  const [erreurs, setErreurs] = useState({});
  const [message, setMessage] = useState('');
  const [envoi, setEnvoi] = useState(false);
  const navigate = useNavigate();

  const modifier = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function soumettre(e) {
    e.preventDefault();
    setErreurs({});
    setMessage('');
    setEnvoi(true);
    try {
      await inscrire(form);
      navigate('/connexion', { state: { inscrite: true } });
    } catch (erreur) {
      setErreurs(erreur.erreurs);                 // 422 : une erreur par champ
      // 409, 500… : un message global. Pour un 422, les messages sous les champs suffisent.
      setMessage(erreur.status === 422 ? 'Corrige les champs signalés.' : erreur.message);
    } finally {
      setEnvoi(false);
    }
  }

  return (
    <main className="carte-form">
      <h1>Créer un compte</h1>
      {message && <p role="alert" className="alerte">{message}</p>}
      <form onSubmit={soumettre} noValidate>
        <Champ id="prenom" label="Prénom" value={form.prenom} onChange={modifier}
          erreur={erreurs.prenom} autoComplete="given-name" required />
        <Champ id="email" label="Email" type="email" value={form.email} onChange={modifier}
          erreur={erreurs.email} autoComplete="email" required />
        <Champ id="motDePasse" label="Mot de passe (8 caractères minimum)" type="password"
          value={form.motDePasse} onChange={modifier} erreur={erreurs.motDePasse}
          autoComplete="new-password" required />
        <button type="submit" disabled={envoi}>{envoi ? 'Création…' : 'Créer mon compte'}</button>
      </form>
      <p>Déjà un compte ? <Link to="/connexion">Se connecter</Link></p>
    </main>
  );
}
