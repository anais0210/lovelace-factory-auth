-- 001_initial.sql : le schéma de départ de Lovelace Factory (extrait utile à l'authentification)
CREATE TABLE utilisateurs (
  id               SERIAL       PRIMARY KEY,
  prenom           VARCHAR(100) NOT NULL,
  email            VARCHAR(200) NOT NULL UNIQUE,
  role             VARCHAR(50)  NOT NULL DEFAULT 'apprenante',
  date_inscription DATE         DEFAULT CURRENT_DATE,
  CONSTRAINT utilisateurs_role_check CHECK (role IN ('apprenante', 'formateurice'))
);
