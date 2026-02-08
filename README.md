# DGG Multichat – Stream Chat Split View

Shows the embedded stream’s chat (Kick or YouTube) in a split view next to DGG chat on **destiny.gg/bigscreen** when you’re watching a Kick or YouTube stream.

## Requirements

- A userscript manager: **Tampermonkey** or **Violentmonkey** (or compatible).
- Use the site at `https://www.destiny.gg/bigscreen` with a stream embed indicated by the URL hash:
  - **Kick:** `#kick/<username>` (e.g. `https://www.destiny.gg/bigscreen#kick/mizkif`).
  - **YouTube:** `#youtube/<videoId>` (e.g. `https://www.destiny.gg/bigscreen#youtube/dQw4w9WgXcQ`). Use the video ID from the live stream URL (`youtube.com/watch?v=VIDEO_ID`). Each livestream has its own chat, so a new stream = new video ID.

## Behavior

- **Only on stream embeds:** The script runs when the bigscreen URL hash is `#kick/<username>` or `#youtube/<videoId>`. Other bigscreen URLs are unchanged.
- **Layout:** The existing DGG chat area is turned into a two-column layout: DGG chat | stream chat (Kick popout or YouTube live chat iframe).
- **No backend:** Everything runs in your browser; no server or account is required.
