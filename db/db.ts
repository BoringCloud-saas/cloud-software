import { drizzle } from 'drizzle-orm/vercel-postgres';
import { createPool } from '@vercel/postgres';
import 'dotenv/config';

// Verbindungs-Pool erstellen
const pool = createPool({
  connectionString: "postgresql://neondb_owner:npg_K1vSJnT5QsPw@ep-solitary-term-a9zlsb2i-pooler.gwc.azure.neon.tech/neondb?sslmode=require", 
});

export const db = drizzle(pool); // Pool an drizzle übergeben
