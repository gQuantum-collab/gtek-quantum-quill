import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function AdCanvas() {
  const [elements, setElements] = useState([
    { type: 'logo', content: 'Brand Logo', priority: 10 },
    { type: 'text', content: 'Headline Text', priority: 9 },
    { type: 'image', content: 'Product Image', priority: 8 },
  ]);
  const [canvasWidth, setCanvasWidth] = useState(1920);
  const [canvasHeight, setCanvasHeight] = useState(1080);
  const [layout, setLayout] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solveLayout = async () => {
    setLoading(true);
    setError(null);
    try {
      const result: any = await api.solveLayout({
        elements,
        canvasWidth,
        canvasHeight,
      });
      setLayout(result.layout);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to solve layout');
    } finally {
      setLoading(false);
    }
  };

  const updateElement = (index: number, field: string, value: string | number) => {
    const newElements = [...elements];
    (newElements[index] as any)[field] = value;
    setElements(newElements);
  };

  return (
    <Layout>
      <Head>
        <title>Ad Canvas - QUILL Studio</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Ad Canvas</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Layout Configuration</h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Canvas Size
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Width"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Height"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Elements</h3>
              {elements.map((element, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-md">
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={element.type}
                      onChange={(e) => updateElement(index, 'type', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="logo">Logo</option>
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                    </select>
                    <input
                      type="text"
                      value={element.content}
                      onChange={(e) => updateElement(index, 'content', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Content"
                    />
                    <input
                      type="number"
                      value={element.priority}
                      onChange={(e) => updateElement(index, 'priority', Number(e.target.value))}
                      className="px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="Priority"
                      min="1"
                      max="10"
                    />
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={solveLayout}
              disabled={loading}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Solving...' : 'Solve Layout'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800">{error}</p>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            {layout.length > 0 ? (
              <div
                className="relative bg-gray-100 border border-gray-300 rounded-md overflow-hidden"
                style={{
                  width: '100%',
                  paddingBottom: `${(canvasHeight / canvasWidth) * 100}%`,
                }}
              >
                <div className="absolute inset-0">
                  {layout.map((item, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-primary-500 bg-primary-50 flex items-center justify-center text-xs"
                      style={{
                        left: `${(item.x / canvasWidth) * 100}%`,
                        top: `${(item.y / canvasHeight) * 100}%`,
                        width: `${(item.width / canvasWidth) * 100}%`,
                        height: `${(item.height / canvasHeight) * 100}%`,
                      }}
                    >
                      <div className="text-center p-1">
                        <div className="font-semibold">{item.type}</div>
                        <div className="text-gray-600">{item.content}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 border border-gray-300 rounded-md p-12 text-center text-gray-500">
                Solve layout to see preview
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
