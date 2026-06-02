import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Core Profile
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Your single source of truth. Update once, sync everywhere.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <a href="#experiences" className="border-b-2 border-blue-500 py-4 px-1 text-sm font-medium text-blue-600 dark:text-blue-400">
              Experiences
            </a>
            <a href="#skills" className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Skills
            </a>
            <a href="#projects" className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Projects
            </a>
            <a href="#education" className="border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Education
            </a>
          </nav>
        </div>

        {/* Experiences Section */}
        <section id="experiences" className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Work Experience
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              + Add Experience
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No experiences added yet. Add your first work experience to get started.
            </p>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Skills
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              + Add Skill
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No skills added yet. Add your skills to showcase your expertise.
            </p>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Projects
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              + Add Project
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No projects added yet. Showcase your side projects and portfolio items.
            </p>
          </div>
        </section>

        {/* Education Section */}
        <section id="education" className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Education
            </h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              + Add Education
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No education added yet. Add your academic background.
            </p>
          </div>
        </section>

        {/* Quick Actions */}
        <div className="mt-8 flex gap-4">
          <Link href="/proposals" className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium">
            View Proposals
          </Link>
          <Link href="/" className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 font-medium">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
