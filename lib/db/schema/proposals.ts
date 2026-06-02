import { pgTable, text, timestamp, uuid, jsonb, integer } from 'drizzle-orm/pg-core';
import { users } from './users';

export const proposalStatus = ['pending', 'accepted', 'rejected', 'dismissed'] as const;
export type ProposalStatus = typeof proposalStatus[number];

export const proposalType = [
  'create',
  'update',
  'delete',
  'reorder',
  'needs-confirmation'
] as const;
export type ProposalType = typeof proposalType[number];

// Proposals table - enforces "agents propose, user disposes" invariant
export const proposals = pgTable('proposals', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Proposal metadata
  type: text('type').notNull(), // create | update | delete | reorder | needs-confirmation
  channels: jsonb('channels').$type<string[]>().default([]), // which channels this affects
  priority: integer('priority').notNull().default(5), // 1-10, higher = more important
  status: text('status').notNull().default('pending'), // pending | accepted | rejected | dismissed

  // The actual change
  before: jsonb('before'), // original value (null for creates)
  after: jsonb('after'), // proposed value (null for deletes)

  // Context
  rationale: text('rationale').notNull(), // why the agent is suggesting this
  createdByAgent: text('created_by_agent').notNull(), // which agent created this proposal

  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  reviewedAt: timestamp('reviewed_at'),
  reviewedByUser: text('reviewed_by_user'), // email/id of reviewer
});

export type Proposal = typeof proposals.$inferSelect;
export type NewProposal = typeof proposals.$inferInsert;
