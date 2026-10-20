import { Routes, Route } from 'react-router';
import { Inscription } from './pages/Inscription.jsx';
import { Connexion } from './pages/Connexion.jsx';
import { TableauDeBord } from './pages/TableauDeBord.jsx';
import { RouteProtegee } from './components/RouteProtegee.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/inscription" element={<Inscription />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/" element={<RouteProtegee><TableauDeBord /></RouteProtegee>} />
    </Routes>
  );
}
