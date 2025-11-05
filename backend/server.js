const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
const port = 3000;

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
if (!YOUTUBE_API_KEY) {
  console.error('YOUTUBE_API_KEY environment variable is not set.');
  process.exit(1);
}
const youtube = google.youtube({
  version: 'v3',
  auth: YOUTUBE_API_KEY,
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Nicho Backend is running!');
});

app.post('/channel-stats', async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) {
    return res.status(400).json({ error: 'channelId is required' });
  }

  try {
    const response = await youtube.channels.list({
      part: 'statistics',
      id: channelId,
    });

    if (response.data.items.length === 0) {
      return res.status(404).json({ error: 'Channel not found' });
    }

    const stats = response.data.items[0].statistics;
    res.json({
      subs: stats.subscriberCount,
      avgViews: stats.viewCount, // Note: This is total views, not average. Avg would require more calls.
      revenue: '$5K - $10K', // Placeholder, as API does not provide this
    });
  } catch (error) {
    console.error('Error fetching channel stats:', error);
    res.status(500).json({ error: 'Failed to fetch channel stats' });
  }
});

app.post('/similar-channels', async (req, res) => {
  const { channelId } = req.body;
  if (!channelId) {
    return res.status(400).json({ error: 'channelId is required' });
  }

  try {
    // 1. Get channel's uploads playlist ID
    const channelResponse = await youtube.channels.list({
      part: 'contentDetails',
      id: channelId,
    });
    const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

    // 2. Get recent videos from the uploads playlist
    const playlistResponse = await youtube.playlistItems.list({
      part: 'snippet',
      playlistId: uploadsPlaylistId,
      maxResults: 5, // Get the 5 most recent videos
    });
    const videoIds = playlistResponse.data.items.map(item => item.snippet.resourceId.videoId);

    // 3. Find related videos for each of those videos
    const relatedChannels = new Map();
    for (const videoId of videoIds) {
      const relatedResponse = await youtube.search.list({
        part: 'snippet',
        relatedToVideoId: videoId,
        type: 'video',
        maxResults: 5,
      });
      relatedResponse.data.items.forEach(item => {
        const channelId = item.snippet.channelId;
        const channelTitle = item.snippet.channelTitle;
        if (!relatedChannels.has(channelId)) {
          relatedChannels.set(channelId, { name: channelTitle, subs: 'N/A', avgViews: 'N/A' });
        }
      });
    }

    res.json(Array.from(relatedChannels.values()));
  } catch (error) {
    console.error('Error finding similar channels:', error);
    res.status(500).json({ error: 'Failed to find similar channels' });
  }
});

app.post('/combined-channel-stats', async (req, res) => {
  const { channelIds } = req.body;
  if (!channelIds || !Array.isArray(channelIds)) {
    return res.status(400).json({ error: 'channelIds array is required' });
  }

  try {
    const response = await youtube.channels.list({
      part: 'statistics,snippet',
      id: channelIds.join(','),
    });

    const stats = response.data.items.map(item => ({
      channelId: item.id,
      name: item.snippet.title,
      subs: item.statistics.subscriberCount,
      avgViews: item.statistics.viewCount,
      revenue: '$5K - $10K', // Placeholder
      netProfit: '$2.5K - $5K', // Placeholder
    }));

    res.json(stats);
  } catch (error) {
    console.error('Error fetching combined channel stats:', error);
    res.status(500).json({ error: 'Failed to fetch combined channel stats' });
  }
});

app.post('/resolve-handle', async (req, res) => {
  const { handle } = req.body;
  if (!handle) {
    return res.status(400).json({ error: 'handle is required' });
  }
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: handle,
      type: 'channel',
      maxResults: 1,
    });
    if (response.data.items.length > 0) {
      res.json({ channelId: response.data.items[0].id.channelId });
    } else {
      res.status(404).json({ error: 'Handle not found' });
    }
  } catch (error) {
    console.error('Error resolving handle:', error);
    res.status(500).json({ error: 'Failed to resolve handle' });
  }
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
