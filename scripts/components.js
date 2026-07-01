import { navItems } from "./data.js";
import { getAlbum, getArtist, getTrackContext, state } from "./state.js";

const iconPaths = {
  home: "M3 10.5 12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
  spark: "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z",
  library: "M4 4h4v16H4z M10 4h4v16h-4z M16 6h4v14h-4z",
  search: "M10.5 18a7.5 7.5 0 1 1 5.3-12.8 7.5 7.5 0 0 1 0 10.6L21 21l-2 2-5.2-5.2A7.4 7.4 0 0 1 10.5 18z",
  settings: "M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z M4 13l-2-1 2-4 2 .7a8 8 0 0 1 1.3-.8L7.7 5h8.6l.4 2.9c.5.2.9.5 1.3.8l2-.7 2 4-2 1v2l2 1-2 4-2-.7c-.4.3-.8.6-1.3.8l-.4 2.9H7.7l-.4-2.9a8 8 0 0 1-1.3-.8l-2 .7-2-4 2-1z",
  play: "M8 5v14l11-7z",
  pause: "M7 5h4v14H7z M13 5h4v14h-4z",
  queue: "M4 7h16v2H4z M4 11h16v2H4z M4 15h10v2H4z",
  lyrics: "M5 4h14v12H8l-3 4z",
  heart: "M12 21s-8-4.7-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 6.3-8 11-8 11z",
  more: "M5 12a2 2 0 1 0 .01 0z M12 12a2 2 0 1 0 .01 0z M19 12a2 2 0 1 0 .01 0z",
  previous: "M6 5h3v14H6z M10 12l10 7V5z",
  next: "M18 5h-3v14h3z M14 12L4 19V5z",
  volume: "M4 10v4h4l5 4V6l-5 4z M16 8c1.4 1.4 1.4 6.6 0 8",
  close: "M6 6l12 12M18 6L6 18"
};

export function icon(name, size = 20) {
  const path = iconPaths[name] || iconPaths.more;
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${path}" fill="currentColor"></path></svg>`;
}

export function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainder = String(seconds % 60).padStart(2, "0");
  return `${minutes}:${remainder}`;
}

export function artBlock(item, className = "art") {
  const background = item.color || item.art || "linear-gradient(135deg, #fa233b, #111113)";
  const image = item.cover || item.image;
  return `<div class="${className}" style="--art-bg: ${background}">${image ? `<img src="${image}" alt="">` : ""}</div>`;
}

export function albumCard(album) {
  const artist = getArtist(album.artistId);
  return `
    <button class="album-card" type="button" data-route="album" data-id="${album.id}" aria-label="Open ${album.title}">
      ${artBlock(album)}
      <span class="card-title">${album.title}</span>
      <span class="card-subtitle">${artist.name}</span>
    </button>
  `;
}

export function artistCard(artist) {
  return `
    <button class="artist-card" type="button" data-route="artist" data-id="${artist.id}" aria-label="Open ${artist.name}">
      ${artBlock(artist)}
      <span class="card-title">${artist.name}</span>
      <span class="card-subtitle">${artist.genre}</span>
    </button>
  `;
}

export function playlistCard(playlist) {
  const stack = playlist.trackIds.slice(0, 4).map((trackId) => {
    const context = getTrackContext(trackId);
    return `<span class="mini-art" style="--art-bg: ${context.album.color}"></span>`;
  }).join("");
  return `
    <button class="playlist-card" type="button" data-route="playlist" data-id="${playlist.id}" aria-label="Open ${playlist.title}">
      <span class="playlist-stack">${stack}</span>
      <span>
        <span class="card-title">${playlist.title}</span>
        <span class="card-subtitle">${playlist.description}</span>
      </span>
    </button>
  `;
}

export function trackRow(track, index, queueIds) {
  const { artist, album } = getTrackContext(track.id);
  const isActive = state.currentTrackId === track.id;
  return `
    <button class="track-row ${isActive ? "is-active" : ""}" type="button" data-track="${track.id}" data-queue="${queueIds.join(",")}" aria-label="Play ${track.title} by ${artist.name}">
      <span class="track-index">${isActive && state.isPlaying ? icon("pause", 14) : index + 1}</span>
      <span class="track-main">
        <span class="track-title">${track.title}</span>
        <span class="track-meta">${artist.name}</span>
      </span>
      <span class="track-meta">${album.title}</span>
      <span class="track-duration">${formatDuration(track.duration)}</span>
      <span class="track-meta">${icon("more", 18)}</span>
    </button>
  `;
}

export function section(title, content, action = "") {
  return `
    <section class="section">
      <div class="section-head">
        <h2 class="section-title">${title}</h2>
        ${action}
      </div>
      ${content}
    </section>
  `;
}

export function renderPrimaryNav(container, playlists) {
  container.innerHTML = navItems.map((item) => `
    <button class="nav-item ${state.route.name === item.id ? "is-active" : ""}" type="button" data-route="${item.id}">
      <span class="nav-icon">${icon(item.icon)}</span>
      <span>${item.label}</span>
    </button>
  `).join("");

  const playlistNav = document.querySelector("#playlist-nav");
  playlistNav.innerHTML = playlists.map((playlist) => `
    <button class="playlist-link ${state.route.name === "playlist" && state.route.id === playlist.id ? "is-active" : ""}" type="button" data-route="playlist" data-id="${playlist.id}">
      <span>${playlist.title}</span>
    </button>
  `).join("");
}

export function renderMobileNav(container) {
  const mobileItems = navItems.slice(0, 5);
  container.innerHTML = mobileItems.map((item) => `
    <button class="mobile-nav-item ${state.route.name === item.id ? "is-active" : ""}" type="button" data-route="${item.id}">
      <span class="nav-icon">${icon(item.icon)}</span>
      <span>${item.label}</span>
    </button>
  `).join("");
}

export function renderQueuePanel(container) {
  const currentId = state.currentTrackId;
  container.classList.toggle("is-open", state.panels.queue);
  container.innerHTML = `
    <div class="panel-head">
      <h2 class="panel-title">Up Next</h2>
      <button class="icon-button" type="button" data-close-panel="queue" aria-label="Close queue">${icon("close")}</button>
    </div>
    <div class="track-list">
      ${state.queue.map((trackId) => {
        const context = getTrackContext(trackId);
        if (!context) return "";
        return `
          <button class="queue-item ${trackId === currentId ? "is-active" : ""}" type="button" data-track="${trackId}" data-queue="${state.queue.join(",")}">
            ${artBlock(context.album)}
            <span>
              <span class="card-title">${context.track.title}</span>
              <span class="card-subtitle">${context.artist.name}</span>
            </span>
          </button>
        `;
      }).join("")}
    </div>
  `;
}

export function renderLyricsPanel(container) {
  const context = getTrackContext(state.currentTrackId);
  container.classList.toggle("is-open", state.panels.lyrics);
  container.innerHTML = `
    <div class="panel-head">
      <div>
        <p class="eyebrow">Lyrics</p>
        <h2 class="panel-title">${context.track.title}</h2>
      </div>
      <button class="icon-button" type="button" data-close-panel="lyrics" aria-label="Close lyrics">${icon("close")}</button>
    </div>
    <div class="lyrics-body">
      ${context.track.lyrics.map((line, index) => `<div class="lyrics-line ${index === Math.floor((state.progress / 100) * context.track.lyrics.length) ? "is-current" : ""}">${line}</div>`).join("")}
    </div>
  `;
}

export function renderPlayer(container) {
  const context = getTrackContext(state.currentTrackId);
  const elapsed = Math.round((state.progress / 100) * context.track.duration);
  container.innerHTML = `
    <div class="player-inner">
      <div class="now-playing">
        ${artBlock(context.album)}
        <div class="track-main">
          <div class="track-title">${context.track.title}</div>
          <div class="track-meta">${context.artist.name}</div>
        </div>
      </div>
      <div class="player-center">
        <div class="transport">
          <button class="icon-button" type="button" data-player="previous" aria-label="Previous track">${icon("previous", 18)}</button>
          <button class="play-toggle" type="button" data-player="toggle" aria-label="${state.isPlaying ? "Pause" : "Play"}">${icon(state.isPlaying ? "pause" : "play", 20)}</button>
          <button class="icon-button" type="button" data-player="next" aria-label="Next track">${icon("next", 18)}</button>
        </div>
        <div class="progress-row">
          <span data-time="elapsed">${formatDuration(elapsed)}</span>
          <div class="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(state.progress)}">
            <span class="progress-fill" style="--value: ${state.progress}%"></span>
            <input class="range-input" type="range" min="0" max="100" step="0.1" value="${state.progress}" data-slider="progress" aria-label="Song progress">
          </div>
          <span data-time="duration">${formatDuration(context.track.duration)}</span>
        </div>
      </div>
      <div class="player-actions">
        <button class="icon-button" type="button" data-panel="lyrics" aria-label="Open lyrics" data-tooltip="Lyrics">${icon("lyrics", 18)}</button>
        <button class="icon-button" type="button" data-panel="queue" aria-label="Open queue" data-tooltip="Queue">${icon("queue", 18)}</button>
        <button class="icon-button" type="button" aria-label="Favorite" data-tooltip="Favorite">${icon("heart", 18)}</button>
        <div class="volume" aria-label="Volume">
          ${icon("volume", 18)}
          <div class="volume-bar">
            <span class="volume-fill" style="--value: ${state.volume}%"></span>
            <input class="range-input" type="range" min="0" max="100" step="1" value="${state.volume}" data-slider="volume" aria-label="Volume">
          </div>
        </div>
      </div>
    </div>
  `;
}

export function toast(message) {
  const region = document.querySelector("#toast-region");
  const element = document.createElement("div");
  element.className = "toast";
  element.textContent = message;
  region.append(element);
  window.setTimeout(() => element.remove(), 2200);
}
