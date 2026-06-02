'use client';

import { useEffect } from 'react';
import { usePersonaStore } from '@/lib/store';
import { AddExperienceDialog } from '@/components/features/add-experience-dialog';
import { AddSkillDialog } from '@/components/features/add-skill-dialog';
import { AddProjectDialog } from '@/components/features/add-project-dialog';
import { AddEducationDialog } from '@/components/features/add-education-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfilePage() {
  const { experiences, skills, projects, education, loadData } = usePersonaStore();

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            Core Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your single source of truth. Update once, sync everywhere.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="experiences" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="experiences">Experiences</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
          </TabsList>

          {/* Experiences Tab */}
          <TabsContent value="experiences">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Work Experience
              </h2>
              <AddExperienceDialog />
            </div>

            <div className="space-y-4">
              {experiences.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No experiences added yet. Add your first work experience to get started.
                  </p>
                </div>
              ) : (
                experiences.map((exp) => (
                  <div key={exp.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {exp.role}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{exp.company}</p>
                    {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                    <p className="text-sm text-gray-500 mt-1">
                      {exp.startDate} - {exp.endDate || 'Present'}
                    </p>
                    {exp.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{exp.description}</p>
                    )}
                    {exp.bullets.length > 0 && (
                      <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {exp.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Skills
              </h2>
              <AddSkillDialog />
            </div>

            <div className="space-y-4">
              {skills.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No skills added yet. Add your skills to showcase your expertise.
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                      <div key={skill.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{skill.name}</h3>
                        {skill.category && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{skill.category}</p>
                        )}
                        {skill.proficiency && (
                          <p className="text-sm text-gray-500">{skill.proficiency}</p>
                        )}
                        {skill.yearsOfExperience && (
                          <p className="text-sm text-gray-500">{skill.yearsOfExperience} years</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Projects
              </h2>
              <AddProjectDialog />
            </div>

            <div className="space-y-4">
              {projects.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No projects added yet. Showcase your side projects and portfolio items.
                  </p>
                </div>
              ) : (
                projects.map((project) => (
                  <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
                      >
                        {project.url}
                      </a>
                    )}
                    {(project.startDate || project.endDate) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {project.startDate} - {project.endDate || 'Present'}
                      </p>
                    )}
                    {project.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{project.description}</p>
                    )}
                    {project.technologies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.bullets.length > 0 && (
                      <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {project.bullets.map((bullet, idx) => (
                          <li key={idx}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Education
              </h2>
              <AddEducationDialog />
            </div>

            <div className="space-y-4">
              {education.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    No education added yet. Add your academic background.
                  </p>
                </div>
              ) : (
                education.map((edu) => (
                  <div key={edu.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {edu.institution}
                    </h3>
                    {edu.degree && edu.field && (
                      <p className="text-gray-600 dark:text-gray-400">
                        {edu.degree} in {edu.field}
                      </p>
                    )}
                    {edu.location && <p className="text-sm text-gray-500">{edu.location}</p>}
                    {(edu.startDate || edu.endDate) && (
                      <p className="text-sm text-gray-500 mt-1">
                        {edu.startDate} - {edu.endDate || 'Present'}
                      </p>
                    )}
                    {edu.gpa && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">GPA: {edu.gpa}</p>}
                    {edu.honors.length > 0 && (
                      <ul className="mt-3 list-disc list-inside space-y-1 text-gray-700 dark:text-gray-300">
                        {edu.honors.map((honor, idx) => (
                          <li key={idx}>{honor}</li>
                        ))}
                      </ul>
                    )}
                    {edu.description && (
                      <p className="mt-3 text-gray-700 dark:text-gray-300">{edu.description}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
