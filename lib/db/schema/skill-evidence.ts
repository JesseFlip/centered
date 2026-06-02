import { pgTable, timestamp, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { skills } from './skills';
import { experiences } from './experiences';
import { projects } from './projects';

// Links skills to the experiences/projects that support them
// This powers the organizer's "unsupported skill" detection
export const skillEvidence = pgTable('skill_evidence', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  skillId: uuid('skill_id').notNull().references(() => skills.id, { onDelete: 'cascade' }),

  // One of these will be set (skill can be evidenced by either experience or project)
  experienceId: uuid('experience_id').references(() => experiences.id, { onDelete: 'cascade' }),
  projectId: uuid('project_id').references(() => projects.id, { onDelete: 'cascade' }),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type SkillEvidence = typeof skillEvidence.$inferSelect;
export type NewSkillEvidence = typeof skillEvidence.$inferInsert;
