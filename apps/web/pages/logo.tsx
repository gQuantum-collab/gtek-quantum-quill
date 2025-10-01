import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function LogoGenerator() {
  const [mood, setMood] = useState('professional');
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const moods = ['professional', 'playful', 'elegant', 'bold', 'calm'];

  const generatePalette = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: any = await api.generatePalette({ mood });
      setColors(result.colors);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate palette');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Logo Generator - QUILL Studio</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Logo Generator</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Generate Color Palette</h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            >
              {moods.map((m) => (
                <option key={m} value={m}>
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={generatePalette}
            disabled={loading}
            className="w-full bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Generating...' : 'Generate Palette'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {colors.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Generated Palette</h2>
            <div className="grid grid-cols-5 gap-4">
              {colors.map((color, index) => (
                <div key={index} className="text-center">
                  <div
                    className="w-full h-32 rounded-lg shadow-md mb-2 border border-gray-200"
                    style={{ backgroundColor: color }}
                  />
                  <p className="text-sm font-mono text-gray-600">{color}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600">
                <strong>Tip:</strong> Use these colors as the foundation for your brand identity.
                Each color is optimized for accessibility and visual harmony.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
