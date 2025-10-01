import Link from 'next/link';

export default function VideoPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="/" className="mb-8 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Video Generator</h1>
      
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <p className="text-lg mb-4">
          Generate 30-60s videos for YouTube and Google Ads
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">Video Preview - Coming Soon</p>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Duration (seconds)</label>
          <input
            type="range"
            min="30"
            max="60"
            defaultValue="45"
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>30s</span>
            <span>60s</span>
          </div>
        </div>
      </div>
    </main>
  );
}
