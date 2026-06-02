import { pgTable, text, timestamp, uuid, boolean, real, jsonb, date } from 'drizzle-orm/pg-core';
import { users } from './users';

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Core fields
  name: text('name').notNull(),
  description: text('description'),
  url: text('url'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  bullets: jsonb('bullets').$type<string[]>().default([]),
  technologies: jsonb('technologies').$type<string[]>().default([]),

  // Metadata
  source: text('source').notNull().default('user'),
  verified: boolean('verified').notNull().default(true),
  confidence: real('confidence').default(1.0),
  visibility: jsonb('visibility').$type<string[]>().default([]),

  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
