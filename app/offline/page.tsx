export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">You're Offline</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          It looks like you've lost your internet connection.
        </p>
        <p className="text-lg mb-4">
          Don't worry - Persona works offline! Your edits will be saved locally
          and synced when you reconnect.
        </p>
        <p className="text-sm text-gray-500">
          Try refreshing the page when you're back online.
        </p>
      </div>
    </main>
  );
}
