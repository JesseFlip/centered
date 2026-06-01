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
        <p className="text-lg">
          Local-first, AI-assisted personal brand management.
          Update once, sync everywhere.
        </p>
        <div className="mt-8 text-sm text-gray-500">
          <p>Built with Next.js 16 + React 19.2 + Tailwind CSS v4</p>
          <p className="mt-2">Spec-Driven Development with Claude Code</p>
        </div>
      </div>
    </main>
  );
}
