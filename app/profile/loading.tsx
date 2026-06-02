import { Loader2 } from 'lucide-react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-8"></div>

          <div className="flex gap-4 mb-6">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
