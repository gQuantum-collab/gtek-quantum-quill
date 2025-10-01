import Link from 'next/link';

export default function AdCanvasPage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="/" className="mb-8 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Ad Canvas</h1>
      
      <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        <p className="text-lg mb-4">
          Design compelling ad creatives with AI assistance
        </p>
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
          <p className="text-gray-500">Canvas Area - Coming Soon</p>
        </div>
      </div>
    </main>
  );
}
