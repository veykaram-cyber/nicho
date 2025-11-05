# Nicho Deployment Guide

This guide provides step-by-step instructions for deploying the Nicho website, backend service, and Chrome extension.

## Part 1: Deploying the Website

The website is a simple static site, which can be easily deployed to a service like Netlify or Vercel. We recommend **Netlify** for its simplicity and generous free tier.

### Steps:
1.  **Sign up for Netlify:** Create a free account at [netlify.com](https://www.netlify.com).
2.  **Connect to your Git provider:** Link your GitHub, GitLab, or Bitbucket account.
3.  **Create a New Site:** From your Netlify dashboard, click "Add new site" -> "Import an existing project".
4.  **Select the Repository:** Choose the `nicho` repository.
5.  **Configure Build Settings:** Netlify should automatically detect that this is a static site. The settings should be:
    *   **Base directory:** `website`
    *   **Build command:** Leave this blank.
    *   **Publish directory:** `website`
6.  **Deploy:** Click "Deploy site". Netlify will build and deploy your site, providing you with a public URL.

## Part 2: Deploying the Backend Service

The backend is a Node.js application containerized with Docker. We recommend deploying it on a service like **Render** or Heroku, which have free tiers that support Docker.

### Steps:
1.  **Sign up for Render:** Create a free account at [render.com](https://render.com).
2.  **Create a New Web Service:** From your Render dashboard, click "New +" -> "Web Service".
3.  **Connect Your Repository:** Connect your Git account and select the `nicho` repository.
4.  **Configure the Service:**
    *   **Environment:** Select `Docker`.
    *   **Name:** Give your service a name (e.g., `nicho-backend`).
    *   **Region:** Choose a region close to you.
    *   **Instance Type:** The free tier should be sufficient to start.
5.  **Add Environment Variables:** This is a crucial step.
    *   Click on the "Environment" tab.
    *   Click "Add Environment Variable".
    *   **Key:** `YOUTUBE_API_KEY`
    *   **Value:** Paste your YouTube Data API key here.
6.  **Deploy:** Click "Create Web Service". Render will pull your repository, build the Docker image, and deploy your service. Once it's live, Render will provide you with the public URL for your backend (e.g., `https://nicho-backend.onrender.com`).

## Part 3: Configuring and Loading the Chrome Extension

The Chrome extension needs to be configured to communicate with your deployed backend.

### Step 1: Update the Backend URL
1.  **Open the extension's code:** Navigate to `chrome-extension/js/background.js`.
2.  **Change the `BACKEND_URL`:** On the first line, you'll see `const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:3000';`. For a production build, you would replace this with your deployed backend URL. For now, you can manually change it to your Render URL:
    ```javascript
    const BACKEND_URL = 'https://your-render-backend-url.onrender.com';
    ```
    *Note: A more advanced setup would involve a build step that replaces this variable automatically.*

### Step 2: Load the Extension in Chrome
1.  **Open Chrome Extensions:** Open Chrome and navigate to `chrome://extensions`.
2.  **Enable Developer Mode:** In the top-right corner, toggle on "Developer mode".
3.  **Load the Extension:**
    *   Click the "Load unpacked" button.
    *   In the file dialog, navigate to and select the `chrome-extension` directory inside your `nicho` project.
4.  **Done!** The Nicho extension should now appear in your list of extensions and be active on YouTube, communicating with your live backend service.
