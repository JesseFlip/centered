import { pgTable, text, timestamp, uuid, boolean, real, jsonb, date } from 'drizzle-orm/pg-core';
import { users } from './users';

export const experiences = pgTable('experiences', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Core fields
  company: text('company').notNull(),
  role: text('role').notNull(),
  location: text('location'),
  startDate: date('start_date').notNull(),
  endDate: date('end_date'), // null = current/present
  description: text('description'),
  bullets: jsonb('bullets').$type<string[]>().default([]),

  // Metadata (as per TECH_ARCH_SPEC §4)
  source: text('source').notNull().default('user'), // 'user' | 'import' | 'agent'
  verified: boolean('verified').notNull().default(true), // user confirmed
  confidence: real('confidence').default(1.0), // 0-1 for agent-inferred values
  visibility: jsonb('visibility').$type<string[]>().default([]), // ['resume', 'linkedin', 'site']

  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;
