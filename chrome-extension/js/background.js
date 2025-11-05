// background.js

const BACKEND_URL = 'https://nicho-backend.onrender.com';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  handleMessage(request, sender, sendResponse);
  return true; // Keep the message channel open for async response
});

async function handleMessage(request, sender, sendResponse) {
  let channelId;
  if (sender.tab && sender.tab.url) {
    channelId = await getChannelIdFromUrl(sender.tab.url);
  }

  if (request.action === 'findSimilarChannels') {
    if (!channelId) return sendResponse({ error: 'Could not determine channel ID.' });
    fetch(`${BACKEND_URL}/similar-channels`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: channelId }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ channels: data }))
    .catch(error => console.error('Error fetching similar channels:', error));
  } else if (request.action === 'getChannelAnalytics') {
    if (!channelId) return sendResponse({ error: 'Could not determine channel ID.' });
    fetch(`${BACKEND_URL}/channel-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelId: channelId }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ analytics: data }))
    .catch(error => console.error('Error fetching channel analytics:', error));
  } else if (request.action === 'getCombinedAnalytics') {
    const channelIds = await Promise.all(request.urls.map(url => getChannelIdFromUrl(url)));
    const validChannelIds = channelIds.filter(id => id);
    fetch(`${BACKEND_URL}/combined-channel-stats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ channelIds: validChannelIds }),
    })
    .then(response => response.json())
    .then(data => sendResponse({ analytics: data }))
    .catch(error => console.error('Error fetching combined channel stats:', error));
  } else if (request.action === 'getAudienceData') {
    sendResponse({ data: { avgViews: 'N/A', demographics: 'N/A' } });
  } else if (request.action === 'getMonetizationStatus') {
    sendResponse({ status: 'N/A' });
  }
}

async function getChannelIdFromUrl(url) {
  const match = url.match(/youtube\.com\/(channel\/|c\/|@)([^\/?]+)/);
  if (!match) return null;

  const type = match[1];
  const value = match[2];

  if (type === 'channel/') {
    return value;
  }

  // If it's a handle (@) or a custom URL (/c/), we need to resolve it
  try {
    const response = await fetch(`${BACKEND_URL}/resolve-handle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle: value }),
    });
    if (response.ok) {
      const data = await response.json();
      return data.channelId;
    }
  } catch (error) {
    console.error('Error resolving handle:', error);
  }
  return null;
}
