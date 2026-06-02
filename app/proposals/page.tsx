import Link from 'next/link';

export default function ProposalsPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Proposal Review Queue
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            AI agents suggest changes. You review and approve.
          </p>
        </div>

        {/* Filter/Status Bar */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-md text-sm font-medium">
              Pending (0)
            </button>
            <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm font-medium">
              Accepted
            </button>
            <button className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md text-sm font-medium">
              Rejected
            </button>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400">
            Last updated: Just now
          </div>
        </div>

        {/* Empty State */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-12 text-center">
            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No pending proposals
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
              When AI agents suggest improvements to your profile, they'll appear here for your review.
              You always have the final say.
            </p>
            <Link
              href="/profile"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Go to Profile
            </Link>
          </div>
        </div>

        {/* Example Proposal Card (commented out - will show when there are proposals) */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6 hidden">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  Improve resume bullet consistency
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Suggested by: Organizer Agent · Priority: 7/10
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs font-medium rounded">
              Pending
            </span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Your experience bullets use inconsistent tense. Standardizing to past tense for consistency.
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium">
              Accept
            </button>
            <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium">
              Reject
            </button>
            <button className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 text-sm font-medium">
              Dismiss
            </button>
          </div>
        </div>

        {/* Back to Profile */}
        <div className="mt-8">
          <Link href="/profile" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline">
            ← Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
