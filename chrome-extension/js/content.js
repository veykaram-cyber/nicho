// content.js

function addSimilarChannelsButton() {
  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
  if (channelHeader && !document.getElementById('similar-channels-btn')) {
    const btn = document.createElement('button');
    btn.id = 'similar-channels-btn';
    btn.textContent = 'Find Similar Channels';
    btn.style.marginLeft = '10px';
    channelHeader.appendChild(btn);

    btn.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'findSimilarChannels' }, (response) => {
        if (response && response.channels) {
          displaySimilarChannels(response.channels);
        }
      });
    });
  }
}

function displaySimilarChannels(channels) {
  // For now, just log the channels to the console.
  console.log('Similar Channels:', channels);
}

// Run the script when the page is loaded
addSimilarChannelsButton();

function addChannelAnalytics() {
  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
  if (channelHeader && !document.getElementById('channel-analytics-section')) {
    const analyticsSection = document.createElement('div');
    analyticsSection.id = 'channel-analytics-section';
    analyticsSection.style.marginTop = '10px';
    analyticsSection.innerHTML = `
      <h3>Channel Analytics</h3>
      <p>Average Views: <span id="avg-views">Loading...</span></p>
      <p>Subscriber Count: <span id="sub-count">Loading...</span></p>
      <p>Revenue Estimate: <span id="revenue-est">Loading...</span></p>
    `;
    channelHeader.appendChild(analyticsSection);

    chrome.runtime.sendMessage({ action: 'getChannelAnalytics' }, (response) => {
      if (response && response.analytics) {
        document.getElementById('avg-views').textContent = response.analytics.avgViews;
        document.getElementById('sub-count').textContent = response.analytics.subs;
        document.getElementById('revenue-est').textContent = response.analytics.revenue;
      }
    });
  }
}

function addFilterPanel() {
  const container = document.querySelector('#content.ytd-app');
  if (container && !document.getElementById('nicho-filter-panel')) {
    const filterPanel = document.createElement('div');
    filterPanel.id = 'nicho-filter-panel';
    filterPanel.style.padding = '10px';
    filterPanel.style.backgroundColor = '#f9f9f9';
    filterPanel.style.border = '1px solid #ddd';
    filterPanel.style.marginBottom = '10px';
    filterPanel.innerHTML = `
      <h3>Nicho Filters</h3>
      <label>Date Range: <input type="text" placeholder="e.g., last 7 days"></label>
      <label>Min Views: <input type="number" placeholder="e.g., 10000"></label>
      <label>Min Subs: <input type="number" placeholder="e.g., 1000"></label>
      <button>Apply Filters</button>
    `;
    // Prepend to the content container so it appears at the top
    container.prepend(filterPanel);
  }
}

function addThumbnailTools() {
  const thumbnails = document.querySelectorAll('ytd-thumbnail');
  thumbnails.forEach(thumbnail => {
    if (!thumbnail.querySelector('.nicho-thumbnail-tools')) {
      const tools = document.createElement('div');
      tools.className = 'nicho-thumbnail-tools';
      tools.style.position = 'absolute';
      tools.style.top = '0';
      tools.style.right = '0';
      tools.style.zIndex = '100';
      tools.innerHTML = `
        <button class="nicho-preview-btn">Preview</button>
        <button class="nicho-download-btn">Download</button>
      `;
      thumbnail.appendChild(tools);

      const downloadBtn = tools.querySelector('.nicho-download-btn');
      downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const img = thumbnail.querySelector('img');
        if (img && img.src) {
          // Get the highest resolution thumbnail URL
          const url = img.src.replace(/hqdefault|default|sddefault|mqdefault/, 'maxresdefault');
          window.open(url, '_blank');
        }
      });
    }
  });
}

function addScreenshotButton() {
  const player = document.querySelector('.html5-video-player');
  if (player && !document.getElementById('nicho-screenshot-btn')) {
    const btn = document.createElement('button');
    btn.id = 'nicho-screenshot-btn';
    btn.textContent = 'Screenshot';
    btn.style.position = 'absolute';
    btn.style.bottom = '10px';
    btn.style.right = '10px';
    btn.style.zIndex = '100';

    btn.addEventListener('click', () => {
      const video = document.querySelector('video');
      if (video) {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'screenshot.png';
        a.click();
      }
    });

    player.appendChild(btn);
  }
}

function makeTranscriptsSelectable() {
  const style = document.createElement('style');
  style.textContent = `
    ytd-transcript-segment-renderer {
      user-select: text !important;
    }
  `;
  document.head.appendChild(style);
}

function addCommentSentimentButton() {
  const commentsHeader = document.querySelector('#comments #header');
  if (commentsHeader && !document.getElementById('nicho-sentiment-btn')) {
    const btn = document.createElement('button');
    btn.id = 'nicho-sentiment-btn';
    btn.textContent = 'Analyze Sentiment';
    btn.style.marginLeft = '10px';
    commentsHeader.appendChild(btn);
  }
}

function addAudienceData() {
  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
  if (channelHeader && !document.getElementById('nicho-audience-data')) {
    const audienceData = document.createElement('div');
    audienceData.id = 'nicho-audience-data';
    audienceData.style.marginTop = '10px';
    audienceData.innerHTML = `
      <h3>Audience Demographics</h3>
      <p>Average Views: <span id="nicho-avg-views">Loading...</span></p>
      <p>Demographics: <span id="nicho-demographics">Loading...</span></p>
    `;
    channelHeader.appendChild(audienceData);

    chrome.runtime.sendMessage({ action: 'getAudienceData' }, (response) => {
      if (response && response.data) {
        document.getElementById('nicho-avg-views').textContent = response.data.avgViews;
        document.getElementById('nicho-demographics').textContent = response.data.demographics;
      }
    });
  }
}

function addMonetizationStatus() {
  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
  if (channelHeader && !document.getElementById('nicho-monetization-status')) {
    const monetizationStatus = document.createElement('div');
    monetizationStatus.id = 'nicho-monetization-status';
    monetizationStatus.style.marginTop = '10px';
    monetizationStatus.innerHTML = `
      <p>Monetization Enabled: <span id="nicho-monetization">Loading...</span></p>
    `;
    channelHeader.appendChild(monetizationStatus);

    chrome.runtime.sendMessage({ action: 'getMonetizationStatus' }, (response) => {
      if (response && response.status) {
        document.getElementById('nicho-monetization').textContent = response.status;
      }
    });
  }
}

function addSwipeFileButton() {
  // Add to video pages
  const videoActions = document.querySelector('#menu.ytd-video-primary-info-renderer');
  if (videoActions && !document.getElementById('nicho-save-video-btn')) {
    const btn = document.createElement('button');
    btn.id = 'nicho-save-video-btn';
    btn.textContent = 'Save to Swipe File';
    videoActions.appendChild(btn);

    btn.addEventListener('click', () => {
      const url = window.location.href;
      chrome.storage.local.get({swipeFile: []}, function(result) {
        const swipeFile = result.swipeFile;
        swipeFile.push({ type: 'video', url: url, title: document.title });
        chrome.storage.local.set({swipeFile: swipeFile}, function() {
          btn.textContent = 'Saved!';
        });
      });
    });
  }

  // Add to channel pages
  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
  if (channelHeader && !document.getElementById('nicho-save-channel-btn')) {
    const btn = document.createElement('button');
    btn.id = 'nicho-save-channel-btn';
    btn.textContent = 'Save to Swipe File';
    channelHeader.appendChild(btn);

    btn.addEventListener('click', () => {
      const url = window.location.href;
      chrome.storage.local.get({swipeFile: []}, function(result) {
        const swipeFile = result.swipeFile;
        swipeFile.push({ type: 'channel', url: url, title: document.title });
        chrome.storage.local.set({swipeFile: swipeFile}, function() {
          btn.textContent = 'Saved!';
        });
      });
    });
  }
}

function addAdPlacerButton() {
  // This is a simplified selector. The actual upload page is more complex.
  const uploadPage = document.querySelector('ytcp-uploads-dialog');
  if (uploadPage && !document.getElementById('nicho-ad-placer-btn')) {
    const btn = document.createElement('button');
    btn.id = 'nicho-ad-placer-btn';
    btn.textContent = 'Auto-place Mid-roll Ads';
    uploadPage.appendChild(btn);
  }
}

function addABTestingUI() {
  const videoThumbnails = document.querySelectorAll('ytd-rich-item-renderer');
  videoThumbnails.forEach(thumbnail => {
    if (!thumbnail.querySelector('.nicho-ab-test-ui')) {
      const ui = document.createElement('div');
      ui.className = 'nicho-ab-test-ui';
      ui.innerHTML = `
        <button>A/B Test</button>
      `;
      thumbnail.appendChild(ui);
    }
  });
}

function addShortsAnalytics() {
  const shortsPlayer = document.querySelector('ytd-reel-video-renderer');
  if (shortsPlayer && !shortsPlayer.querySelector('.nicho-shorts-analytics')) {
    const analytics = document.createElement('div');
    analytics.className = 'nicho-shorts-analytics';
    analytics.style.position = 'absolute';
    analytics.style.bottom = '10px';
    analytics.style.left = '10px';
    analytics.style.zIndex = '100';
    analytics.style.color = 'white';
    analytics.innerHTML = `
      <p>Views: 1.2M</p>
      <p>Likes: 100K</p>
    `;
    shortsPlayer.appendChild(analytics);
  }
}

function addSimilarVideos() {
  const relatedVideos = document.querySelector('#related');
  if (relatedVideos && !document.getElementById('nicho-similar-videos')) {
    const similarVideos = document.createElement('div');
    similarVideos.id = 'nicho-similar-videos';
    similarVideos.innerHTML = `
      <h3>Similar Videos (Nicho)</h3>
      <p>Video 1</p>
      <p>Video 2</p>
      <p>Video 3</p>
    `;
    relatedVideos.prepend(similarVideos);
  }
}

// Since YouTube is a single-page application, we need to observe for changes in the DOM
const observer = new MutationObserver(() => {
  addSimilarChannelsButton();
  addChannelAnalytics();
  addFilterPanel();
  addThumbnailTools();
  addScreenshotButton();
  makeTranscriptsSelectable();
  addCommentSentimentButton();
  addAudienceData();
  addMonetizationStatus();
  addSwipeFileButton();
});
observer.observe(document.body, { childList: true, subtree: a/chrome-extension/js/content.js
+++ b/chrome-extension/js/content.js
@@ -171,6 +171,26 @@
   }
 }

+function addSwipeFileButton() {
+  // Add to video pages
+  const videoActions = document.querySelector('#menu.ytd-video-primary-info-renderer');
+  if (videoActions && !document.getElementById('nicho-save-video-btn')) {
+    const btn = document.createElement('button');
+    btn.id = 'nicho-save-video-btn';
+    btn.textContent = 'Save to Swipe File';
+    videoActions.appendChild(btn);
+  }
+
+  // Add to channel pages
+  const channelHeader = document.querySelector('#channel-header .ytd-c4-tabbed-header-renderer');
+  if (channelHeader && !document.getElementById('nicho-save-channel-btn')) {
+    const btn = document.createElement('button');
+    btn.id = 'nicho-save-channel-btn';
+    btn.textContent = 'Save to Swipe File';
+    channelHeader.appendChild(btn);
+  }
+}
+
 // Since YouTube is a single-page application, we need to observe for changes in the DOM
 const observer = new MutationObserver(() => {
   addSimilarChannelsButton();
@@ -182,5 +202,6 @@
   addCommentSentimentButton();
   addAudienceData();
   addMonetizationStatus();
+  addSwipeFileButton();
  addAdPlacerButton();
  addABTestingUI();
  addShortsAnalytics();
  addSimilarVideos();
 });
 observer.observe(document.body, { childList: true, subtree: true });
