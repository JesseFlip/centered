import Link from 'next/link';
import { FileText, Bot, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-12 lg:p-24">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          Persona
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8">
          Personal Brand Sync Platform
        </p>
        <p className="text-base md:text-lg mb-12 max-w-2xl mx-auto">
          Local-first, AI-assisted personal brand management.
          Update once, sync everywhere.
        </p>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
                <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Core Profile</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Single source of truth for your professional brand
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
                <Bot className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">AI Agents</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Propose improvements, you approve
            </p>
          </div>
          <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
                <RefreshCw className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Multi-Channel Sync</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Resume, LinkedIn, website - all in sync
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild size="lg">
            <Link href="/profile">
              Go to Profile
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/proposals">
              View Proposals
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Built with Next.js 16 + React 19.2 + Tailwind CSS v4</p>
          <p className="mt-2">Spec-Driven Development with Claude Code</p>
        </div>
      </div>
    </main>
  );
}
