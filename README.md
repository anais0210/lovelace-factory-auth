# Lovelace Factory · authentification

Le projet d'exercice du cours **« Authentification de bout en bout »** (Ada Tech School · Bloc 2).
Une API Express reliée à PostgreSQL, un front React, et l'authentification codée étape par étape.

## Prérequis sur ta machine

| Outil | Version | Vérifier |
|---|---|---|
| Node.js | 24 (LTS) | `node -v` → `v24.x` |
| npm | fourni avec Node | `npm -v` |
| PostgreSQL | 18 | `psql --version` |
| Git | récent | `git --version` |
| VS Code + extension REST Client | récent | pour `backend/requetes.http` |

## Démarrer

```bash
git clone <adresse-du-dépôt> lovelace-factory-auth
cd lovelace-factory-auth
git switch -c mon-travail depart        # ta branche, à partir du point de départ

# la base
createdb lovelace_factory
psql lovelace_factory -f backend/db/migrations/001_initial.sql

# l'API (terminal 1)
cd backend
cp .env.example .env                    # puis vérifie DATABASE_URL
npm install
npm run dev                             # http://localhost:3000/api/sante

# le front (terminal 2)
cd frontend
npm install
npm run dev                             # http://localhost:5173
```

## Les étapes

Chaque étape du cours a un **tag**. Si tu décroches pendant le live coding, récupère l'état exact du groupe :

```bash
git stash                               # met ton travail de côté
git switch -c rattrapage etape-1-socle  # une branche à partir du tag
```

| Tag | Contenu | Chapitres |
|---|---|---|
| `depart` | API Express + PostgreSQL et front React, sans authentification | 0 |
| `etape-1-socle` | migration, `ErreurHttp`, middleware d'erreurs, model `Utilisateur` | 6, 8, 9 |
| `etape-2-inscription` | `POST /api/auth/inscription` | 10 |
| `etape-3-connexion` | `POST /api/auth/connexion`, JWT en cookie httpOnly | 12 |
| `etape-4-session` | middleware `auth`, `/moi`, déconnexion, tests de l'API | 13 |
| `etape-5-front-socle` | proxy Vite, client API, contexte, route protégée | 14, 15, 18 |
| `etape-6-formulaires` | pages Inscription et Connexion : le projet complet | 16, 17 |

Les tags qui contiennent une correction (`etape-2`, `etape-3`, `etape-6`) sont publiés par la formateurice **après** la séance correspondante.

## Tester l'API

```bash
cd backend
npm test                                # à partir de etape-4-session, sans installer PostgreSQL
```
