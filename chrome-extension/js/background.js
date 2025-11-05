// background.js

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findSimilarChannels') {
    const channelId = getChannelIdFromUrl(sender.tab.url);
    fetch(`${BACKEND_URL}/similar-channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: channelId }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ channels: data }))
    .catch(error => console.error('Error fetching similar channels:', error));
    return true;
  } else if (request.action === 'getChannelAnalytics') {
    const channelId = getChannelIdFromUrl(sender.tab.url);
    fetch(`${BACKEND_URL}/channel-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: channelId }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ analytics: data }))
    .catch(error => console.error('Error fetching channel analytics:', error));
    return true;
  } else if (request.action === 'getCombinedAnalytics') {
    const channelIds = request.urls.map(url => getChannelIdFromUrl(url)).filter(id => id);
    fetch(`${BACKEND_URL}/combined-channel-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelIds: channelIds }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ analytics: data }))
    .catch(error => console.error('Error fetching combined channel stats:', error));
    return true;
  } else if (request.action === 'getAudienceData') {
    // Placeholder - requires more advanced API access
    sendResponse({ data: { avgViews: 'N/A', demographics: 'N/A' } });
  } else if (request.action === 'getMonetizationStatus') {
    // Placeholder - not directly available via public API
    sendResponse({ status: 'N/A' });
  }
  return true;
});

function getChannelIdFromUrl(url) {
  const match = url.match(/youtube\.com\/(channel|c)\/([^\/]+)/);
  return match ? match[2] : null;
}
