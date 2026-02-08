# DGG Multichat – Kick Chat Split View

Shows the embedded Kick stream’s chat in a split view next to DGG chat on **destiny.gg/bigscreen** when you’re watching a Kick stream (e.g. `https://www.destiny.gg/bigscreen/kick/gabeisgunk`).

## Requirements

- A userscript manager: **Tampermonkey** or **Violentmonkey** (or compatible).
- Use the site at `https://www.destiny.gg/bigscreen` with a Kick stream embedded. The embed is indicated by the hash: `#kick/<username>` (e.g. `https://www.destiny.gg/bigscreen#kick/mizkif`).

## Installation

1. Install a userscript manager in your browser:
   - [Tampermonkey](https://www.tampermonkey.net/) (Chrome, Firefox, Edge, Safari)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. Open the script file `dgg-kick-chat-split.user.js` in this repo (e.g. open the raw file in GitHub or open the local file in your editor).

3. Copy the entire script (from `// ==UserScript==` to the end).

4. In Tampermonkey/Violentmonkey: **Add new script** / **Create new script**, paste the code, and save.

5. Go to `https://www.destiny.gg/bigscreen#kick/<streamer>` (replace `<streamer>` with a Kick username). The page should show DGG chat on the left half and Kick chat on the right half of the chat area.

## Behavior

- **Only on Kick embeds:** The script runs only when the bigscreen URL hash is `#kick/<username>` (e.g. `.../bigscreen#kick/gabeisgunk`). Other bigscreen URLs (e.g. no stream or non-Kick) are unchanged.
- **Layout:** The existing DGG chat area is turned into a two-column layout: DGG chat | Kick popout chat (iframe from `https://kick.com/popout/<username>/chat`).
- **No backend:** Everything runs in your browser; no server or account is required.

## Note

If Kick’s popout chat cannot be embedded in an iframe on other sites (e.g. due to `X-Frame-Options`), the Kick chat panel may appear blank. In that case you can open the stream’s chat in a separate tab.
