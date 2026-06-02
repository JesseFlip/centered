import { pgTable, text, timestamp, uuid, boolean, real, jsonb, date } from 'drizzle-orm/pg-core';
import { users } from './users';

export const education = pgTable('education', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Core fields
  institution: text('institution').notNull(),
  degree: text('degree'),
  field: text('field'),
  location: text('location'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  gpa: text('gpa'),
  honors: jsonb('honors').$type<string[]>().default([]),
  description: text('description'),

  // Metadata
  source: text('source').notNull().default('user'),
  verified: boolean('verified').notNull().default(true),
  confidence: real('confidence').default(1.0),
  visibility: jsonb('visibility').$type<string[]>().default([]),

  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Education = typeof education.$inferSelect;
export type NewEducation = typeof education.$inferInsert;
