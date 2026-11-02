/**
 * AI Condition Assist Service
 *
 * Provides a clean interface for image-assisted animal condition description.
 * Adheres strictly to security and safety requirements:
 * - Does not expose API keys in frontend code
 * - Connects to secure backend proxy if configured
 * - Reports exact missing backend integration requirements when unconfigured
 * - Does not substitute fake hardcoded descriptions
 */

export async function describeConditionWithAI(photoDataOrUrl) {
  // 1. Image presence validation
  if (!photoDataOrUrl || (typeof photoDataOrUrl === 'string' && !photoDataOrUrl.trim())) {
    return {
      success: false,
      error: 'Please upload or capture an animal photo first before requesting AI condition analysis.'
    };
  }

  // 2. Query backend vision proxy endpoint
  const backendProxyUrl = '/api/ai/describe-condition';

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(backendProxyUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: photoDataOrUrl,
        prompt: 'Describe visible observations of this animal condition for an emergency rescue report. List visible wounds, posture, and coat observations without diagnosing internal injuries.'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.description) {
        return {
          success: true,
          description: data.description
        };
      }
    }

    // Backend endpoint returned non-OK or is not implemented
    return {
      success: false,
      error: 'AI Vision Service Unavailable: The secure server-side proxy (POST /api/ai/describe-condition) is not currently configured on the backend. Please provide the observed condition manually below.'
    };
  } catch (err) {
    // Network failure, connection refused, or endpoint 404
    return {
      success: false,
      error: 'AI Vision Service Unavailable: A secure backend proxy (/api/ai/describe-condition) and vision API key must be configured on the server to analyze photos. Manual condition entry is active below.'
    };
  }
}
