# MelodiX Audio Proxy

A simple FastAPI server that uses yt-dlp to extract audio stream URLs from YouTube videos.

## Deploy to Render

1. Push this directory to a GitHub repo (or use the parent repo)
2. On Render.com, create a new Web Service
3. Connect your GitHub repo
4. Set:
   - **Runtime**: Python
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Health Check Path**: `/health`
5. Add environment variable `AUDIO_PROXY_KEY` with a secret value
6. Deploy

## Usage

```bash
curl "https://your-app.onrender.com/audio?videoId=kXYiU_JCYtU&key=YOUR_KEY"
```

Returns:
```json
{
  "url": "https://...",
  "duration": 187,
  "title": "Linkin Park - Numb",
  "channel": "Linkin Park",
  "thumbnail": "https://..."
}
```
