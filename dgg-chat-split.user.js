// ==UserScript==
// @name         DGG Bigscreen - Kick Chat Split View
// @namespace    https://github.com/
// @version      1.0.0
// @description  Shows Kick chat in a resizable panel to the side of destiny.gg/bigscreen
// @match        https://www.destiny.gg/bigscreen*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const STYLE_ID = 'dgg-kick-chat-split-styles';
    const PANEL_ID = 'dgg-kick-chat-panel';
    const HANDLE_ID = 'dgg-kick-chat-resize-handle';
    const TOGGLE_ID = 'dgg-kick-chat-toggle';
    const COLLAPSED_WIDTH = 28;
    const DEFAULT_WIDTH = 400;
    const MIN_WIDTH = 280;
    const MAX_WIDTH = 800;
    const STORAGE_KEY = 'dgg-kick-chat-width';
    const COLLAPSED_KEY = 'dgg-kick-chat-collapsed';

    function getKickSlugFromPath() {
        const hash = window.location.hash.slice(1).trim();
        if (!hash) return null;
        const segments = hash.split('/').filter(Boolean);
        if (segments[0] === 'kick' && segments[1]) return segments[1];
        return null;
    }

    function getStoredWidth() {
        try {
            const w = parseInt(localStorage.getItem(STORAGE_KEY), 10);
            if (w >= MIN_WIDTH && w <= MAX_WIDTH) return w;
        } catch (_) {}
        return DEFAULT_WIDTH;
    }

    function setStoredWidth(w) {
        try {
            localStorage.setItem(STORAGE_KEY, String(w));
        } catch (_) {}
    }

    function getStoredCollapsed() {
        try {
            return localStorage.getItem(COLLAPSED_KEY) === '1';
        } catch (_) {}
        return false;
    }

    function setStoredCollapsed(collapsed) {
        try {
            localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0');
        } catch (_) {}
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
            #${PANEL_ID} {
                position: fixed;
                top: 0;
                right: 0;
                bottom: 0;
                width: ${getStoredWidth()}px;
                display: flex;
                flex-direction: column;
                background: #18181b;
                z-index: 9999;
                box-shadow: -2px 0 8px rgba(0,0,0,0.3);
                box-sizing: border-box;
            }
            #${PANEL_ID} iframe {
                flex: 1;
                width: 100%;
                min-height: 0;
                border: 0;
            }
            #${HANDLE_ID} {
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 6px;
                cursor: col-resize;
                background: transparent;
            }
            #${HANDLE_ID}:hover {
                background: rgba(255,255,255,0.1);
            }
            #${PANEL_ID}.dgg-kick-collapsed #${HANDLE_ID},
            #${PANEL_ID}.dgg-kick-collapsed iframe {
                display: none;
            }
            #${PANEL_ID}.dgg-kick-collapsed {
                background: transparent;
                box-shadow: none;
            }
            #${TOGGLE_ID} {
                position: absolute;
                top: 8px;
                right: 8px;
                width: 24px;
                height: 24px;
                border: none;
                background: rgba(255,255,255,0.08);
                color: #a1a1aa;
                cursor: pointer;
                border-radius: 4px;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1;
                transition: background 0.15s, color 0.15s;
            }
            #${TOGGLE_ID}:hover {
                background: rgba(255,255,255,0.15);
                color: #fff;
            }
            #${PANEL_ID}.dgg-kick-collapsed #${TOGGLE_ID} {
                top: 50%;
                right: auto;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.35);
                opacity: 0.6;
            }
            #${PANEL_ID}.dgg-kick-collapsed #${TOGGLE_ID}:hover {
                opacity: 1;
                background: rgba(0,0,0,0.5);
            }
            body:has(#${PANEL_ID}) {
                margin-right: var(--dgg-kick-panel-width, ${getStoredWidth()}px);
            }
            body:has(#${PANEL_ID}.dgg-kick-collapsed) {
                margin-right: 0;
            }
        `;
        document.head.appendChild(style);
    }

    function applyCollapsedState(panel, collapsed) {
        if (!panel) return;
        const toggle = panel.querySelector('#' + TOGGLE_ID);
        if (!toggle) return;
        if (collapsed) {
            panel.classList.add('dgg-kick-collapsed');
            panel.style.width = COLLAPSED_WIDTH + 'px';
            document.documentElement.style.setProperty('--dgg-kick-panel-width', '0');
            toggle.textContent = '\u25B6';
            toggle.title = 'Expand Kick chat';
            toggle.setAttribute('aria-label', 'Expand Kick chat');
        } else {
            panel.classList.remove('dgg-kick-collapsed');
            panel.style.width = getStoredWidth() + 'px';
            document.documentElement.style.setProperty('--dgg-kick-panel-width', getStoredWidth() + 'px');
            toggle.textContent = '\u25C0';
            toggle.title = 'Collapse Kick chat';
            toggle.setAttribute('aria-label', 'Collapse Kick chat');
        }
    }

    function setupCollapse(panel, toggle) {
        toggle.addEventListener('click', function () {
            const collapsed = !panel.classList.contains('dgg-kick-collapsed');
            setStoredCollapsed(collapsed);
            applyCollapsedState(panel, collapsed);
        });
    }

    function makeResizable(panel) {
        const handle = document.getElementById(HANDLE_ID);
        if (!handle) return;

        let startX, startWidth;

        function onMove(e) {
            const dx = startX - e.clientX;
            const w = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + dx));
            panel.style.width = w + 'px';
            document.documentElement.style.setProperty('--dgg-kick-panel-width', w + 'px');
            setStoredWidth(w);
        }

        function onUp() {
            document.removeEventListener('mousemove', onMove);
            document.removeEventListener('mouseup', onUp);
        }

        handle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX;
            startWidth = panel.offsetWidth;
            document.addEventListener('mousemove', onMove);
            document.addEventListener('mouseup', onUp);
        });
    }

    function showKickPanel() {
        const slug = getKickSlugFromPath();
        if (!slug) return;

        let panel = document.getElementById(PANEL_ID);
        if (panel) {
            const iframe = panel.querySelector('iframe');
            if (iframe) iframe.src = 'https://kick.com/popout/' + slug + '/chat';
            return;
        }

        injectStyles();

        panel = document.createElement('div');
        panel.id = PANEL_ID;

        const toggle = document.createElement('button');
        toggle.id = TOGGLE_ID;
        toggle.type = 'button';
        toggle.title = 'Collapse Kick chat';
        toggle.textContent = '\u25C0';
        toggle.setAttribute('aria-label', 'Collapse Kick chat');

        const handle = document.createElement('div');
        handle.id = HANDLE_ID;
        handle.title = 'Drag to resize';

        const iframe = document.createElement('iframe');
        iframe.src = 'https://kick.com/popout/' + slug + '/chat';
        iframe.title = 'Kick chat: ' + slug;

        panel.appendChild(toggle);
        panel.appendChild(handle);
        panel.appendChild(iframe);
        document.body.appendChild(panel);
        makeResizable(panel);
        setupCollapse(panel, toggle);
        applyCollapsedState(panel, getStoredCollapsed());
    }

    function removeKickPanel() {
        const panel = document.getElementById(PANEL_ID);
        if (panel) panel.remove();
        document.documentElement.style.removeProperty('--dgg-kick-panel-width');
    }

    function init() {
        if (getKickSlugFromPath()) {
            showKickPanel();
        } else {
            removeKickPanel();
        }
    }

    init();

    window.addEventListener('hashchange', function () {
        const slug = getKickSlugFromPath();
        if (slug) {
            showKickPanel();
        } else {
            removeKickPanel();
        }
    });
})();
