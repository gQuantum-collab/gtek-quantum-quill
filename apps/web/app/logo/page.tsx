'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LogoPage() {
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generatePalette = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/v1/palette');
      const data = await response.json();
      setPalette(data.colors);
    } catch (error) {
      console.error('Error fetching palette:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Link href="/" className="mb-8 text-blue-500 hover:underline">
        ← Back to Home
      </Link>
      
      <h1 className="text-4xl font-bold mb-8">Logo Designer</h1>
      
      <div className="max-w-2xl w-full">
        <button
          onClick={generatePalette}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 mb-4"
        >
          {loading ? 'Generating...' : 'Generate Color Palette'}
        </button>
        
        {palette.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Your Palette</h2>
            <div className="flex gap-4">
              {palette.map((color, index) => (
                <div key={index} className="flex-1">
                  <div
                    className="h-24 rounded-lg shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-center mt-2 font-mono">{color}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
