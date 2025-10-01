const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:8787';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  generatePalette: (data: { mood?: string }) =>
    apiRequest('/v1/palette/generate', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  solveLayout: (data: {
    elements: Array<{ type: string; content: string; priority: number }>;
    canvasWidth: number;
    canvasHeight: number;
  }) =>
    apiRequest('/v1/layout/solve', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  renderVideo: (data: {
    template: '30s' | '60s';
    headline: string;
    colors: string[];
  }) =>
    apiRequest('/v1/export/render', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  publishToYouTube: (data: {
    videoPath: string;
    title: string;
    description: string;
    privacyStatus?: 'private' | 'unlisted' | 'public';
  }) =>
    apiRequest('/v1/publish/youtube', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  exportGoogleAds: (data: {
    campaignName: string;
    adAssets: Array<{ type: string; path?: string; text?: string }>;
  }) =>
    apiRequest('/v1/ads/export', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};
