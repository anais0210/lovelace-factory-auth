import { Routes, Route } from 'react-router';
import { TableauDeBord } from './pages/TableauDeBord.jsx';
import { RouteProtegee } from './components/RouteProtegee.jsx';

// Pages provisoires : elles sont codées aux chapitres 16 et 17
function AFaire({ titre }) {
  return (
    <main className="carte-form">
      <h1>{titre}</h1>
      <p>Page à coder.</p>
    </main>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/inscription" element={<AFaire titre="Créer un compte" />} />
      <Route path="/connexion" element={<AFaire titre="Se connecter" />} />
      <Route path="/" element={<RouteProtegee><TableauDeBord /></RouteProtegee>} />
    </Routes>
  );
}
