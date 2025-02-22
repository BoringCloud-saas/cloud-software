import { pgTable, serial, varchar, timestamp } from 'drizzle-orm/pg-core';

// Tabelle für Benutzer
export const users = pgTable('users', {
  id: serial('id').primaryKey(), // Auto-Inkrementierende ID
  access_token: varchar('access_token', { length: 255 }).notNull().unique(), // Das Access Token für die OAuth-Verbindung
  refresh_token: varchar('refresh_token', { length: 255 }).notNull(),
  sub: varchar('sub', { length: 255 }).notNull(), // Sub-ID aus OAuth
  name: varchar('name', { length: 255 }).notNull(), // Vollständiger Name des Benutzers
  given_name: varchar('given_name', { length: 255 }).notNull(), // Vorname des Benutzers
  family_name: varchar('family_name', { length: 255 }).notNull(), // Nachname des Benutzers
  email: varchar('email', { length: 255 }).notNull().unique(), // E-Mail des Benutzers
  private_key: varchar('private_key', { length: 255 }),
  historyID: varchar('historyID').notNull(),
  created_at: timestamp('created_at').defaultNow(),
});