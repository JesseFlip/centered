import { pgTable, text, timestamp, uuid, boolean, real, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const skills = pgTable('skills', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Core fields
  name: text('name').notNull(),
  category: text('category'), // e.g., 'technical', 'soft', 'language'
  proficiency: text('proficiency'), // e.g., 'beginner', 'intermediate', 'expert'
  yearsOfExperience: real('years_of_experience'),

  // Metadata
  source: text('source').notNull().default('user'),
  verified: boolean('verified').notNull().default(true),
  confidence: real('confidence').default(1.0),
  visibility: jsonb('visibility').$type<string[]>().default([]),

  lastUpdated: timestamp('last_updated').notNull().defaultNow(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
