import pg from 'pg';

// Un « pool » garde quelques connexions ouvertes et les réutilise
export const db = new pg.Pool({ connectionString: process.env.DATABASE_URL });
