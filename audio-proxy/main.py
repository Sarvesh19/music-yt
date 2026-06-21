import os
import json
import subprocess
import tempfile
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

API_KEY = os.environ.get("AUDIO_PROXY_KEY", "melodix-dev-key")

app = FastAPI(title="MelodiX Audio Proxy")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET"],
    allow_headers=["*"],
)


def extract_audio(video_id: str) -> dict:
    url = f"https://www.youtube.com/watch?v={video_id}"
    with tempfile.TemporaryDirectory() as tmpdir:
        result = subprocess.run(
            [
                "yt-dlp",
                "--no-warnings",
                "--print-json",
                "-f", "bestaudio/best",
                "--no-playlist",
                url,
            ],
            capture_output=True,
            text=True,
            timeout=60,
            cwd=tmpdir,
        )
        if result.returncode != 0:
            raise RuntimeError(f"yt-dlp failed: {result.stderr.strip()}")

        data = json.loads(result.stdout.strip())
        formats = data.get("formats") or [data]
        audio = None
        for f in formats:
            if f.get("url") and f.get("vcodec") == "none":
                if not audio or f.get("abr", 0) > audio.get("abr", 0):
                    audio = f

        if not audio:
            audio = formats[0] if formats else data

        return {
            "url": audio["url"],
            "duration": data.get("duration") or 0,
            "title": data.get("title") or "",
            "channel": data.get("channel") or data.get("uploader") or "",
            "thumbnail": data.get("thumbnail") or "",
        }


@app.get("/audio")
def get_audio(
    videoId: str = Query(..., alias="videoId"),
    key: str = Query(..., alias="key"),
):
    if key != API_KEY:
        raise HTTPException(401, "Invalid API key")
    try:
        result = extract_audio(video_id=videoId)
        return result
    except Exception as e:
        raise HTTPException(500, str(e))


@app.get("/health")
def health():
    return {"status": "ok"}
