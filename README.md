# DGG Multichat – Kick Chat Split View

Shows the embedded Kick stream’s chat in a split view next to DGG chat on **destiny.gg/bigscreen** when you’re watching a Kick stream (e.g. `https://www.destiny.gg/bigscreen/kick/gabeisgunk`).

## Requirements

- A userscript manager: **Tampermonkey** or **Violentmonkey** (or compatible).
- Use the site at `https://www.destiny.gg/bigscreen` with a Kick stream embedded. The embed is indicated by the hash: `#kick/<username>` (e.g. `https://www.destiny.gg/bigscreen#kick/mizkif`).

## Behavior

- **Only on Kick embeds:** The script runs only when the bigscreen URL hash is `#kick/<username>` (e.g. `.../bigscreen#kick/gabeisgunk`). Other bigscreen URLs (e.g. no stream or non-Kick) are unchanged.
- **Layout:** The existing DGG chat area is turned into a two-column layout: DGG chat | Kick popout chat (iframe from `https://kick.com/popout/<username>/chat`).
- **No backend:** Everything runs in your browser; no server or account is required.
