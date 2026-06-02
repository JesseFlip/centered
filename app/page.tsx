import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Persona
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          Personal Brand Sync Platform
        </p>
        <p className="text-lg mb-8">
          Local-first, AI-assisted personal brand management.
          Update once, sync everywhere.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold mb-2">Core Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Single source of truth for your professional brand
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">🤖</div>
            <h3 className="font-semibold mb-2">AI Agents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Propose improvements, you approve
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="text-3xl mb-2">🔄</div>
            <h3 className="font-semibold mb-2">Multi-Channel Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resume, LinkedIn, website - all in sync
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-4 justify-center mb-8">
          <Link
            href="/profile"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Go to Profile
          </Link>
          <Link
            href="/proposals"
            className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
          >
            View Proposals
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Built with Next.js 16 + React 19.2 + Tailwind CSS v4</p>
          <p className="mt-2">Spec-Driven Development with Claude Code</p>
        </div>
      </div>
    </main>
  );
}
