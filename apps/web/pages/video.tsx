import { useState } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import { api } from '@/lib/api';

export default function VideoStudio() {
  const [template, setTemplate] = useState<'30s' | '60s'>('30s');
  const [headline, setHeadline] = useState('Your Brand Message Here');
  const [colors, setColors] = useState(['#2563eb', '#ffffff', '#1e40af']);
  const [renderResult, setRenderResult] = useState<any>(null);
  const [publishResult, setPublishResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const renderVideo = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.renderVideo({
        template,
        headline,
        colors,
      });
      setRenderResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to render video');
    } finally {
      setLoading(false);
    }
  };

  const publishToYouTube = async () => {
    if (!renderResult?.jobId) return;

    setLoading(true);
    setError(null);
    try {
      const result = await api.publishToYouTube({
        videoPath: `/videos/${renderResult.jobId}.mp4`,
        title: headline,
        description: 'Created with QUILL Studio',
        privacyStatus: 'private',
      });
      setPublishResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish video');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Video Studio - QUILL Studio</title>
      </Head>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Video Studio</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Video Configuration</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template
            </label>
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value as '30s' | '60s')}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="30s">30 seconds</option>
              <option value="60s">60 seconds</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter your headline"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Palette
            </label>
            <div className="flex space-x-2">
              {colors.map((color, index) => (
                <input
                  key={index}
                  type="color"
                  value={color}
                  onChange={(e) => {
                    const newColors = [...colors];
                    newColors[index] = e.target.value;
                    setColors(newColors);
                  }}
                  className="w-16 h-16 rounded-md border border-gray-300 cursor-pointer"
                />
              ))}
            </div>
          </div>

          <button
            onClick={renderVideo}
            disabled={loading || !headline}
            className="w-full bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? 'Rendering...' : 'Render Video'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </div>

        {renderResult && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Render Status</h2>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md mb-4">
              <p className="text-green-800">
                <strong>Status:</strong> {renderResult.status}
              </p>
              <p className="text-green-800">
                <strong>Job ID:</strong> {renderResult.jobId}
              </p>
              {renderResult.message && (
                <p className="text-green-800 mt-2">{renderResult.message}</p>
              )}
            </div>

            <button
              onClick={publishToYouTube}
              disabled={loading}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {loading ? 'Publishing...' : 'Publish to YouTube'}
            </button>
          </div>
        )}

        {publishResult && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">YouTube Publish Status</h2>
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-blue-800">
                <strong>Status:</strong> {publishResult.status}
              </p>
              {publishResult.message && (
                <p className="text-blue-800 mt-2">{publishResult.message}</p>
              )}
              {publishResult.url && (
                <p className="text-blue-800 mt-2">
                  <strong>URL:</strong>{' '}
                  <a
                    href={publishResult.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    {publishResult.url}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Video Specifications
          </h3>
          <ul className="list-disc list-inside text-blue-800 space-y-1">
            <li>Resolution: 1920x1080 (1080p)</li>
            <li>Frame Rate: 30 FPS</li>
            <li>Format: MP4 (H.264)</li>
            <li>Background: Customizable color from palette</li>
            <li>Text: Centered headline with contrasting color</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
