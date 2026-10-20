// Lancer : node --test   (une base PostgreSQL en mémoire est démarrée pour les tests)
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PGlite } from '@electric-sql/pglite';
import { PGLiteSocketServer } from '@electric-sql/pglite-socket';

let serveurBdd, serveurApi, base, db;

before(async () => {
  const pglite = await PGlite.create();
  serveurBdd = new PGLiteSocketServer({ db: pglite, port: 54329, host: '127.0.0.1' });
  await serveurBdd.start();
  process.env.DATABASE_URL = 'postgres://postgres@127.0.0.1:54329/postgres';
  process.env.JWT_SECRET = 'secret-de-test';
  ({ db } = await import('../src/db.js'));
  for (const f of ['001_initial.sql', '002_authentification.sql']) {
    await db.query(readFileSync(new URL(`../db/migrations/${f}`, import.meta.url), 'utf8'));
  }
  await db.query("INSERT INTO utilisateurs (prenom, email) VALUES ('Camille', 'camille@ada.fr')");
  const { app } = await import('../src/app.js');
  await new Promise((ok) => { serveurApi = app.listen(0, ok); });
  base = `http://127.0.0.1:${serveurApi.address().port}/api/auth`;
});
after(async () => { serveurApi?.close(); await db?.end(); await serveurBdd?.stop(); });

const post = (chemin, body, cookie) => fetch(base + chemin, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(cookie && { Cookie: cookie }) },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const ines = { prenom: 'Inès', email: '  Ines@Ada.fr ', motDePasse: 'motdepasse123' };

test('inscription : 201, email normalisé, aucun mot de passe renvoyé', async () => {
  const res = await post('/inscription', ines);
  assert.equal(res.status, 201);
  const { utilisateur } = await res.json();
  assert.equal(utilisateur.email, 'ines@ada.fr');
  assert.equal(utilisateur.role, 'apprenante');
  assert.equal('mot_de_passe_hash' in utilisateur, false);
  const { rows } = await db.query("SELECT mot_de_passe_hash FROM utilisateurs WHERE email = 'ines@ada.fr'");
  assert.match(rows[0].mot_de_passe_hash, /^\$2[aby]\$10\$/);
  assert.notEqual(rows[0].mot_de_passe_hash, ines.motDePasse);
});

test('inscription : 422 avec une erreur par champ', async () => {
  const res = await post('/inscription', { prenom: ' ', email: 'pas-un-email', motDePasse: 'court' });
  assert.equal(res.status, 422);
  assert.deepEqual(await res.json(), {
    message: 'Données invalides',
    erreurs: {
      prenom: 'Le prénom est obligatoire',
      email: "L'email n'a pas un format valide",
      motDePasse: 'Le mot de passe fait au moins 8 caractères',
    },
  });
});

test('inscription : 409 si l’email existe déjà, quelle que soit la casse', async () => {
  const res = await post('/inscription', { ...ines, email: 'INES@ada.fr' });
  assert.equal(res.status, 409);
  assert.deepEqual(await res.json(), { message: 'Un compte existe déjà avec cet email' });
});

test('JSON mal formé : 400', async () => {
  const res = await post('/inscription', '{"prenom": ');
  assert.equal(res.status, 400);
});

test('connexion : mauvais mot de passe, email inconnu, compte sans mot de passe → même 401', async () => {
  for (const essai of [
    { email: 'ines@ada.fr', motDePasse: 'mauvais-mot' },
    { email: 'personne@ada.fr', motDePasse: 'motdepasse123' },
    { email: 'camille@ada.fr', motDePasse: 'motdepasse123' },
  ]) {
    const res = await post('/connexion', essai);
    assert.equal(res.status, 401);
    assert.deepEqual(await res.json(), { message: 'Email ou mot de passe incorrect' });
  }
});

test('connexion réussie : cookie httpOnly, puis /moi, puis déconnexion', async () => {
  const res = await post('/connexion', { email: 'INES@ada.fr', motDePasse: 'motdepasse123' });
  assert.equal(res.status, 200);
  const setCookie = res.headers.get('set-cookie');
  assert.match(setCookie, /^token=/);
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /SameSite=Lax/);
  const { utilisateur } = await res.json();
  assert.equal(utilisateur.prenom, 'Inès');
  assert.equal('mot_de_passe_hash' in utilisateur, false);

  const cookie = setCookie.split(';')[0];
  const moi = await fetch(base + '/moi', { headers: { Cookie: cookie } });
  assert.equal(moi.status, 200);
  assert.equal((await moi.json()).utilisateur.email, 'ines@ada.fr');

  const sortie = await post('/deconnexion', {}, cookie);
  assert.equal(sortie.status, 204);
  assert.match(sortie.headers.get('set-cookie'), /token=;.*Expires=Thu, 01 Jan 1970/);
});

test('/moi : 401 sans cookie ou avec un token falsifié', async () => {
  assert.equal((await fetch(base + '/moi')).status, 401);
  const faux = await fetch(base + '/moi', { headers: { Cookie: 'token=abc.def.ghi' } });
  assert.equal(faux.status, 401);
  assert.deepEqual(await faux.json(), { message: 'Session expirée ou invalide' });
});
