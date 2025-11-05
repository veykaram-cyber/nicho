// background.js

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'findSimilarChannels') {
    // In a real extension, you would fetch this data from an API.
    const similarChannels = [
      { name: 'Channel 1', subs: '1M', avgViews: '100K' },
      { name: 'Channel 2', subs: '2M', avgViews: '200K' },
      { name: 'Channel 3', subs: '3M', avgViews: '300K' },
    ];
    sendResponse({ channels: similarChannels });
  } else if (request.action === 'getChannelAnalytics') {
    // In a real extension, you would fetch this data from an API.
    const channelAnalytics = {
      avgViews: '150K',
      subs: '1.5M',
      revenue: '$5K - $10K',
    };
    sendResponse({ analytics: channelAnalytics });
  } else if (request.action === 'getCombinedAnalytics') {
    const combinedAnalytics = request.urls.map(url => ({
      name: url.split('/').pop() || 'Unknown Channel', // Extract channel name from URL
      subs: `${Math.floor(Math.random() * 5) + 1}M`,
      avgViews: `${Math.floor(Math.random() * 200) + 50}K`,
      revenue: `$${Math.floor(Math.random() * 10) + 1}K - $${Math.floor(Math.random() * 20) + 10}K`,
      netProfit: `$${Math.floor(Math.random() * 5) + 1}K - $${Math.floor(Math.random() * 10) + 5}K`, // Assuming a 50% profit margin for simplicity
    }));
    sendResponse({ analytics: combinedAnalytics });
  } else if (request.action === 'getAudienceData') {
    const audienceData = {
      avgViews: '175K',
      demographics: '60% Male, 40% Female; 18-35 years old',
    };
    sendResponse({ data: audienceData });
  } else if (request.action === 'getMonetizationStatus') {
    sendResponse({ status: 'Yes' });
  }
  return true; // Indicates that the response is sent asynchronously
});
