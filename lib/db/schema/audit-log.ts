import { pgTable, text, timestamp, uuid, jsonb } from 'drizzle-orm/pg-core';
import { users } from './users';

export const auditAction = [
  'proposal_created',
  'proposal_accepted',
  'proposal_rejected',
  'proposal_dismissed',
  'profile_created',
  'profile_updated',
  'profile_deleted',
] as const;
export type AuditAction = typeof auditAction[number];

// Append-only audit log for compliance, versioning, and eval datasets
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // What happened
  action: text('action').notNull(), // proposal_accepted | profile_updated | etc.
  entityType: text('entity_type').notNull(), // 'experience' | 'skill' | 'proposal' | etc.
  entityId: uuid('entity_id'), // ID of the affected entity

  // The change
  before: jsonb('before'), // state before change
  after: jsonb('after'), // state after change

  // Context
  actor: text('actor').notNull(), // 'user' | 'agent:organizer' | 'agent:resume' | etc.
  metadata: jsonb('metadata'), // additional context

  timestamp: timestamp('timestamp').notNull().defaultNow(),
});

export type AuditLog = typeof auditLog.$inferSelect;
export type NewAuditLog = typeof auditLog.$inferInsert;
