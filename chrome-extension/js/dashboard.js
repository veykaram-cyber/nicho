// dashboard.js

document.getElementById('get-analytics-btn').addEventListener('click', () => {
  const urls = document.getElementById('channel-urls').value.split('\n');
  chrome.runtime.sendMessage({ action: 'getCombinedAnalytics', urls: urls }, (response) => {
    if (response && response.analytics) {
      const resultsDiv = document.getElementById('analytics-results');
      resultsDiv.innerHTML = ''; // Clear previous results
      response.analytics.forEach(channel => {
        resultsDiv.innerHTML += `
          <div>
            <h3>${channel.name}</h3>
            <p>Subscribers: ${channel.subs}</p>
            <p>Average Views: ${channel.avgViews}</p>
            <p>Estimated Revenue: ${channel.revenue}</p>
            <p>Estimated Net Profit: ${channel.netProfit}</p>
          </div>
        `;
      });

      // Add dummy forecast data
      const forecastDiv = document.getElementById('forecast-results');
      forecastDiv.innerHTML = `
        <p>Next 30 days: +10K subscribers, +1M views</p>
        <p>Next 90 days: +50K subscribers, +5M views</p>
      `;

      // Add dummy top content
      const topContentDiv = document.getElementById('top-content-results');
      topContentDiv.innerHTML = `
        <p>1. "How to go viral" - 10M views</p>
        <p>2. "My top 10 tips" - 5M views</p>
      `;
    }
  });
});
