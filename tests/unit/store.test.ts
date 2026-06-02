import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePersonaStore } from '@/lib/store';

// Mock the database
vi.mock('@/lib/db/storage', () => ({
  db: {
    experiences: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    skills: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    projects: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    education: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
    proposals: {
      add: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      toArray: vi.fn().mockResolvedValue([]),
    },
  },
}));

describe('Persona Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    usePersonaStore.setState({
      experiences: [],
      skills: [],
      projects: [],
      education: [],
      proposals: [],
    });
  });

  describe('Experiences', () => {
    it('should add an experience', async () => {
      const { addExperience, experiences } = usePersonaStore.getState();

      await addExperience({
        company: 'Test Company',
        role: 'Software Engineer',
        startDate: '2020-01-01',
        bullets: [],
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });

      const updatedExperiences = usePersonaStore.getState().experiences;
      expect(updatedExperiences).toHaveLength(1);
      expect(updatedExperiences[0].company).toBe('Test Company');
      expect(updatedExperiences[0].role).toBe('Software Engineer');
    });

    it('should delete an experience', async () => {
      const { addExperience, deleteExperience } = usePersonaStore.getState();

      await addExperience({
        company: 'Test Company',
        role: 'Software Engineer',
        startDate: '2020-01-01',
        bullets: [],
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });

      const experienceId = usePersonaStore.getState().experiences[0].id;
      await deleteExperience(experienceId);

      expect(usePersonaStore.getState().experiences).toHaveLength(0);
    });
  });

  describe('Skills', () => {
    it('should add a skill', async () => {
      const { addSkill } = usePersonaStore.getState();

      await addSkill({
        name: 'React',
        category: 'Technical',
        proficiency: 'Expert',
        source: 'user',
        verified: true,
        confidence: 1.0,
        visibility: [],
      });

      const skills = usePersonaStore.getState().skills;
      expect(skills).toHaveLength(1);
      expect(skills[0].name).toBe('React');
    });
  });

  describe('Proposals', () => {
    it('should accept a proposal', async () => {
      // Add a mock proposal first
      usePersonaStore.setState({
        proposals: [
          {
            id: 'test-proposal',
            type: 'update',
            channels: [],
            priority: 5,
            status: 'pending',
            rationale: 'Test rationale',
            createdByAgent: 'test-agent',
            createdAt: new Date(),
          },
        ],
      });

      const { acceptProposal } = usePersonaStore.getState();
      await acceptProposal('test-proposal');

      const proposals = usePersonaStore.getState().proposals;
      expect(proposals[0].status).toBe('accepted');
      expect(proposals[0].reviewedAt).toBeDefined();
    });

    it('should reject a proposal', async () => {
      usePersonaStore.setState({
        proposals: [
          {
            id: 'test-proposal',
            type: 'update',
            channels: [],
            priority: 5,
            status: 'pending',
            rationale: 'Test rationale',
            createdByAgent: 'test-agent',
            createdAt: new Date(),
          },
        ],
      });

      const { rejectProposal } = usePersonaStore.getState();
      await rejectProposal('test-proposal');

      const proposals = usePersonaStore.getState().proposals;
      expect(proposals[0].status).toBe('rejected');
    });
  });
});
