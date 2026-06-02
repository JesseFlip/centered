import { create } from 'zustand';
import { db } from './db/storage';

export interface Experience {
  id: string;
  company: string;
  role: string;
  location?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  bullets: string[];
  source: string;
  verified: boolean;
  confidence: number;
  visibility: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category?: string;
  proficiency?: string;
  yearsOfExperience?: number;
  source: string;
  verified: boolean;
  confidence: number;
  visibility: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  url?: string;
  startDate?: string;
  endDate?: string;
  bullets: string[];
  technologies: string[];
  source: string;
  verified: boolean;
  confidence: number;
  visibility: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface Education {
  id: string;
  institution: string;
  degree?: string;
  field?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  honors: string[];
  description?: string;
  source: string;
  verified: boolean;
  confidence: number;
  visibility: string[];
  lastUpdated: Date;
  createdAt: Date;
}

export interface Proposal {
  id: string;
  type: string;
  channels: string[];
  priority: number;
  status: 'pending' | 'accepted' | 'rejected' | 'dismissed';
  before?: any;
  after?: any;
  rationale: string;
  createdByAgent: string;
  createdAt: Date;
  reviewedAt?: Date;
  reviewedByUser?: string;
}

interface PersonaStore {
  experiences: Experience[];
  skills: Skill[];
  projects: Project[];
  education: Education[];
  proposals: Proposal[];

  // Experience actions
  addExperience: (experience: Omit<Experience, 'id' | 'lastUpdated' | 'createdAt'>) => Promise<void>;
  updateExperience: (id: string, experience: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;

  // Skill actions
  addSkill: (skill: Omit<Skill, 'id' | 'lastUpdated' | 'createdAt'>) => Promise<void>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;

  // Project actions
  addProject: (project: Omit<Project, 'id' | 'lastUpdated' | 'createdAt'>) => Promise<void>;
  updateProject: (id: string, project: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Education actions
  addEducation: (education: Omit<Education, 'id' | 'lastUpdated' | 'createdAt'>) => Promise<void>;
  updateEducation: (id: string, education: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;

  // Proposal actions
  acceptProposal: (id: string) => Promise<void>;
  rejectProposal: (id: string) => Promise<void>;
  dismissProposal: (id: string) => Promise<void>;

  // Load data from IndexedDB
  loadData: () => Promise<void>;
}

export const usePersonaStore = create<PersonaStore>((set, get) => ({
  experiences: [],
  skills: [],
  projects: [],
  education: [],
  proposals: [],

  // Experience actions
  addExperience: async (experience) => {
    const newExperience = {
      ...experience,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    await db.experiences.add(newExperience);
    set((state) => ({
      experiences: [...state.experiences, newExperience],
    }));
  },

  updateExperience: async (id, updates) => {
    const updated = {
      ...updates,
      lastUpdated: new Date(),
    };
    await db.experiences.update(id, updated);
    set((state) => ({
      experiences: state.experiences.map((exp) =>
        exp.id === id ? { ...exp, ...updated } : exp
      ),
    }));
  },

  deleteExperience: async (id) => {
    await db.experiences.delete(id);
    set((state) => ({
      experiences: state.experiences.filter((exp) => exp.id !== id),
    }));
  },

  // Skill actions
  addSkill: async (skill) => {
    const newSkill = {
      ...skill,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    await db.skills.add(newSkill);
    set((state) => ({
      skills: [...state.skills, newSkill],
    }));
  },

  updateSkill: async (id, updates) => {
    const updated = {
      ...updates,
      lastUpdated: new Date(),
    };
    await db.skills.update(id, updated);
    set((state) => ({
      skills: state.skills.map((skill) =>
        skill.id === id ? { ...skill, ...updated } : skill
      ),
    }));
  },

  deleteSkill: async (id) => {
    await db.skills.delete(id);
    set((state) => ({
      skills: state.skills.filter((skill) => skill.id !== id),
    }));
  },

  // Project actions
  addProject: async (project) => {
    const newProject = {
      ...project,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    await db.projects.add(newProject);
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },

  updateProject: async (id, updates) => {
    const updated = {
      ...updates,
      lastUpdated: new Date(),
    };
    await db.projects.update(id, updated);
    set((state) => ({
      projects: state.projects.map((proj) =>
        proj.id === id ? { ...proj, ...updated } : proj
      ),
    }));
  },

  deleteProject: async (id) => {
    await db.projects.delete(id);
    set((state) => ({
      projects: state.projects.filter((proj) => proj.id !== id),
    }));
  },

  // Education actions
  addEducation: async (education) => {
    const newEducation = {
      ...education,
      id: crypto.randomUUID(),
      lastUpdated: new Date(),
      createdAt: new Date(),
    };
    await db.education.add(newEducation);
    set((state) => ({
      education: [...state.education, newEducation],
    }));
  },

  updateEducation: async (id, updates) => {
    const updated = {
      ...updates,
      lastUpdated: new Date(),
    };
    await db.education.update(id, updated);
    set((state) => ({
      education: state.education.map((edu) =>
        edu.id === id ? { ...edu, ...updated } : edu
      ),
    }));
  },

  deleteEducation: async (id) => {
    await db.education.delete(id);
    set((state) => ({
      education: state.education.filter((edu) => edu.id !== id),
    }));
  },

  // Proposal actions
  acceptProposal: async (id) => {
    const proposal = get().proposals.find((p) => p.id === id);
    if (!proposal) return;

    const updated = {
      status: 'accepted' as const,
      reviewedAt: new Date(),
    };

    await db.proposals.update(id, updated);
    set((state) => ({
      proposals: state.proposals.map((prop) =>
        prop.id === id ? { ...prop, ...updated } : prop
      ),
    }));

    // TODO: Apply the proposal changes to the respective entity
  },

  rejectProposal: async (id) => {
    const updated = {
      status: 'rejected' as const,
      reviewedAt: new Date(),
    };

    await db.proposals.update(id, updated);
    set((state) => ({
      proposals: state.proposals.map((prop) =>
        prop.id === id ? { ...prop, ...updated } : prop
      ),
    }));
  },

  dismissProposal: async (id) => {
    const updated = {
      status: 'dismissed' as const,
      reviewedAt: new Date(),
    };

    await db.proposals.update(id, updated);
    set((state) => ({
      proposals: state.proposals.map((prop) =>
        prop.id === id ? { ...prop, ...updated } : prop
      ),
    }));
  },

  // Load data from IndexedDB
  loadData: async () => {
    const [experiences, skills, projects, education, proposals] = await Promise.all([
      db.experiences.toArray(),
      db.skills.toArray(),
      db.projects.toArray(),
      db.education.toArray(),
      db.proposals.toArray(),
    ]);

    set({
      experiences,
      skills,
      projects,
      education,
      proposals,
    });
  },
}));
