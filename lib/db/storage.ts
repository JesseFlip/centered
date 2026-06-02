import Dexie, { type EntityTable } from 'dexie';
import type { Experience, Skill, Project, Education, Proposal } from '../store';

// Dexie database for local-first storage
class PersonaDatabase extends Dexie {
  experiences!: EntityTable<Experience, 'id'>;
  skills!: EntityTable<Skill, 'id'>;
  projects!: EntityTable<Project, 'id'>;
  education!: EntityTable<Education, 'id'>;
  proposals!: EntityTable<Proposal, 'id'>;

  constructor() {
    super('PersonaDatabase');

    this.version(1).stores({
      experiences: 'id, company, role, startDate, endDate, source, verified, *visibility',
      skills: 'id, name, category, proficiency, source, verified, *visibility',
      projects: 'id, name, startDate, endDate, source, verified, *visibility',
      education: 'id, institution, degree, field, startDate, endDate, source, verified, *visibility',
      proposals: 'id, type, status, priority, createdByAgent, createdAt',
    });
  }
}

export const db = new PersonaDatabase();

// Helper functions for CRUD operations

// Experiences
export async function createExperience(experience: Omit<Experience, 'id' | 'lastUpdated' | 'createdAt'>) {
  const now = new Date();
  const newExperience: Experience = {
    ...experience,
    id: crypto.randomUUID(),
    lastUpdated: now,
    createdAt: now,
  };
  await db.experiences.add(newExperience);
  return newExperience;
}

export async function getExperiences() {
  return await db.experiences.toArray();
}

export async function updateExperience(id: string, updates: Partial<Experience>) {
  await db.experiences.update(id, {
    ...updates,
    lastUpdated: new Date(),
  });
}

export async function deleteExperience(id: string) {
  await db.experiences.delete(id);
}

// Skills
export async function createSkill(skill: Omit<Skill, 'id' | 'lastUpdated' | 'createdAt'>) {
  const now = new Date();
  const newSkill: Skill = {
    ...skill,
    id: crypto.randomUUID(),
    lastUpdated: now,
    createdAt: now,
  };
  await db.skills.add(newSkill);
  return newSkill;
}

export async function getSkills() {
  return await db.skills.toArray();
}

export async function updateSkill(id: string, updates: Partial<Skill>) {
  await db.skills.update(id, {
    ...updates,
    lastUpdated: new Date(),
  });
}

export async function deleteSkill(id: string) {
  await db.skills.delete(id);
}

// Projects
export async function createProject(project: Omit<Project, 'id' | 'lastUpdated' | 'createdAt'>) {
  const now = new Date();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    lastUpdated: now,
    createdAt: now,
  };
  await db.projects.add(newProject);
  return newProject;
}

export async function getProjects() {
  return await db.projects.toArray();
}

export async function updateProject(id: string, updates: Partial<Project>) {
  await db.projects.update(id, {
    ...updates,
    lastUpdated: new Date(),
  });
}

export async function deleteProject(id: string) {
  await db.projects.delete(id);
}

// Education
export async function createEducation(education: Omit<Education, 'id' | 'lastUpdated' | 'createdAt'>) {
  const now = new Date();
  const newEducation: Education = {
    ...education,
    id: crypto.randomUUID(),
    lastUpdated: now,
    createdAt: now,
  };
  await db.education.add(newEducation);
  return newEducation;
}

export async function getEducation() {
  return await db.education.toArray();
}

export async function updateEducation(id: string, updates: Partial<Education>) {
  await db.education.update(id, {
    ...updates,
    lastUpdated: new Date(),
  });
}

export async function deleteEducation(id: string) {
  await db.education.delete(id);
}

// Proposals
export async function createProposal(proposal: Omit<Proposal, 'id' | 'createdAt'>) {
  const newProposal: Proposal = {
    ...proposal,
    id: crypto.randomUUID(),
    createdAt: new Date(),
  };
  await db.proposals.add(newProposal);
  return newProposal;
}

export async function getProposals(status?: string) {
  if (status) {
    return await db.proposals.where('status').equals(status).toArray();
  }
  return await db.proposals.toArray();
}

export async function updateProposal(id: string, updates: Partial<Proposal>) {
  await db.proposals.update(id, updates);
}

export async function deleteProposal(id: string) {
  await db.proposals.delete(id);
}
