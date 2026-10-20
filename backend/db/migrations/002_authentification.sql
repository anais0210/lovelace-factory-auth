-- 002_authentification.sql : ajouter le mot de passe hashé
-- La colonne accepte NULL : les comptes déjà en base n'ont pas encore de mot de passe.
ALTER TABLE utilisateurs ADD COLUMN mot_de_passe_hash VARCHAR(100);
