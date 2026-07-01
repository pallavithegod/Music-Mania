import { albums, artists, featured, integrationNotes, playlists, tracks } from "./data.js";
import { albumCard, artistCard, artBlock, playlistCard, section, trackRow } from "./components.js";
import { getAlbum, getAlbumTracks, getArtist, getArtistTracks, getPlaylist, getPlaylistTracks, getTrackContext, state } from "./state.js";

function albumGrid(albumIds = albums.map((album) => album.id)) {
  return `<div class="grid album-grid">${albumIds.map((id) => albumCard(getAlbum(id))).join("")}</div>`;
}

function artistGrid(items = artists) {
  return `<div class="grid artist-grid">${items.map(artistCard).join("")}</div>`;
}

function playlistGrid(items = playlists) {
  return `<div class="grid playlist-grid">${items.map(playlistCard).join("")}</div>`;
}

function trackList(items) {
  const queueIds = items.map((track) => track.id);
  return `<div class="track-list">${items.map((track, index) => trackRow(track, index, queueIds)).join("")}</div>`;
}

export function homeView() {
  const heroAlbum = getAlbum(featured.heroAlbumId);
  const artist = getArtist(heroAlbum.artistId);
  const heroTracks = getAlbumTracks(heroAlbum.id);
  return `
    <div class="view">
      <section class="hero" style="--hero-bg: ${heroAlbum.color}">
        <div>
          <p class="eyebrow">Featured Album</p>
          <h1 class="view-title">${heroAlbum.title}</h1>
          <p class="view-subtitle">${heroAlbum.description}</p>
          <div class="stats-strip">
            <span class="chip">${artist.name}</span>
            <span class="chip">${heroAlbum.year}</span>
            <span class="chip">${heroTracks.length} songs</span>
          </div>
          <div class="hero-actions">
            <button class="play-button primary" type="button" data-track="${heroTracks[0].id}" data-queue="${heroTracks.map((track) => track.id).join(",")}">▶ Play</button>
            <button class="play-button" type="button" data-route="album" data-id="${heroAlbum.id}">Open Album</button>
          </div>
        </div>
        <div class="hero-card">${artBlock(heroAlbum)}</div>
      </section>
      ${section("Listen Now", albumGrid(featured.browse))}
      ${section("Recently Played", trackList(featured.recentlyPlayed.map((id) => tracks.find((track) => track.id === id))))}
      ${section("Made For You", playlistGrid(playlists))}
    </div>
  `;
}

export function browseView() {
  return `
    <div class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Browse</p>
          <h1 class="view-title">New music, cleanly curated.</h1>
          <p class="view-subtitle">Explore premium editorial picks, featured artists, and albums using only local mock data.</p>
        </div>
        <div class="segmented" aria-label="Browse category">
          <button class="is-active" type="button">Featured</button>
          <button type="button">Charts</button>
          <button type="button">Moods</button>
        </div>
      </header>
      ${section("Featured Releases", albumGrid())}
      ${section("Artists To Watch", artistGrid())}
      ${section("Essential Playlists", playlistGrid())}
    </div>
  `;
}

export function libraryView() {
  const savedTracks = tracks.slice(0, 7);
  return `
    <div class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Library</p>
          <h1 class="view-title">Your music.</h1>
          <p class="view-subtitle">Albums, artists, playlists, and saved tracks are modeled as frontend data modules ready for future persistence.</p>
        </div>
      </header>
      ${section("Saved Albums", albumGrid(["afterglow-city", "honey-moonline", "signal-bloom"]))}
      ${section("Saved Tracks", trackList(savedTracks))}
    </div>
  `;
}

export function searchView() {
  const term = state.searchTerm.trim().toLowerCase();
  const albumResults = term ? albums.filter((album) => album.title.toLowerCase().includes(term)) : albums;
  const artistResults = term ? artists.filter((artist) => artist.name.toLowerCase().includes(term) || artist.genre.toLowerCase().includes(term)) : artists;
  const trackResults = term ? tracks.filter((track) => {
    const context = getTrackContext(track.id);
    return track.title.toLowerCase().includes(term) || context.artist.name.toLowerCase().includes(term) || context.album.title.toLowerCase().includes(term);
  }) : tracks.slice(0, 6);

  const hasResults = albumResults.length || artistResults.length || trackResults.length;
  return `
    <div class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Search</p>
          <h1 class="view-title">${term ? `Results for “${state.searchTerm}”` : "Find your next obsession."}</h1>
          <p class="view-subtitle">Search works across mocked tracks, albums, artists, and genres with instant local rendering.</p>
        </div>
      </header>
      ${hasResults ? `
        ${section("Top Songs", trackList(trackResults))}
        ${section("Albums", albumGrid(albumResults.map((album) => album.id)))}
        ${section("Artists", artistGrid(artistResults))}
      ` : `<div class="empty-state"><p>No results found.</p></div>`}
    </div>
  `;
}

export function albumView(id) {
  const album = getAlbum(id) || albums[0];
  const artist = getArtist(album.artistId);
  const albumTracks = getAlbumTracks(album.id);
  return `
    <div class="view">
      <section class="hero-detail">
        ${artBlock(album)}
        <div>
          <p class="eyebrow">${album.type}</p>
          <h1 class="view-title">${album.title}</h1>
          <p class="view-subtitle">${album.description}</p>
          <div class="stats-strip">
            <button class="chip" type="button" data-route="artist" data-id="${artist.id}">${artist.name}</button>
            <span class="chip">${album.year}</span>
            <span class="chip">${albumTracks.length} songs</span>
          </div>
          <div class="inline-actions">
            <button class="play-button primary" type="button" data-track="${albumTracks[0].id}" data-queue="${albumTracks.map((track) => track.id).join(",")}">▶ Play</button>
            <button class="play-button" type="button">＋ Add</button>
          </div>
        </div>
      </section>
      ${section("Tracks", trackList(albumTracks))}
    </div>
  `;
}

export function artistView(id) {
  const artist = getArtist(id) || artists[0];
  const artistTracks = getArtistTracks(artist.id);
  const artistAlbums = albums.filter((album) => album.artistId === artist.id);
  return `
    <div class="view">
      <section class="hero-detail">
        ${artBlock(artist)}
        <div>
          <p class="eyebrow">Artist</p>
          <h1 class="view-title">${artist.name}</h1>
          <p class="view-subtitle">${artist.bio}</p>
          <div class="stats-strip">
            <span class="chip">${artist.genre}</span>
            <span class="chip">${artist.followers} followers</span>
          </div>
          <div class="inline-actions">
            <button class="play-button primary" type="button" data-track="${artistTracks[0].id}" data-queue="${artistTracks.map((track) => track.id).join(",")}">▶ Play</button>
            <button class="play-button" type="button">Follow</button>
          </div>
        </div>
      </section>
      ${section("Top Songs", trackList(artistTracks))}
      ${section("Albums", albumGrid(artistAlbums.map((album) => album.id)))}
    </div>
  `;
}

export function playlistView(id) {
  const playlist = getPlaylist(id) || playlists[0];
  const playlistTracks = getPlaylistTracks(playlist.id);
  return `
    <div class="view">
      <section class="hero-detail">
        <div class="playlist-stack" style="width: 100%">
          ${playlistTracks.slice(0, 4).map((track) => `<span class="mini-art" style="--art-bg: ${getAlbum(track.albumId).color}"></span>`).join("")}
        </div>
        <div>
          <p class="eyebrow">Playlist</p>
          <h1 class="view-title">${playlist.title}</h1>
          <p class="view-subtitle">${playlist.description}</p>
          <div class="stats-strip">
            <span class="chip">${playlistTracks.length} songs</span>
            <span class="chip">Music Mania</span>
          </div>
          <div class="inline-actions">
            <button class="play-button primary" type="button" data-track="${playlistTracks[0].id}" data-queue="${playlistTracks.map((track) => track.id).join(",")}">▶ Play</button>
            <button class="play-button" type="button">＋ Add</button>
          </div>
        </div>
      </section>
      ${section("Tracks", trackList(playlistTracks))}
    </div>
  `;
}

export function settingsView() {
  return `
    <div class="view">
      <header class="view-header">
        <div>
          <p class="eyebrow">Settings</p>
          <h1 class="view-title">Playback and profile.</h1>
          <p class="view-subtitle">Frontend preferences are kept separate from data access so authentication can be introduced later without reshaping views.</p>
        </div>
      </header>
      <section class="settings-grid">
        <article class="setting-card">
          <h3>Appearance</h3>
          <label class="toggle">
            <span>Dark Mode</span>
            <span class="switch"><input type="checkbox" data-setting="theme" ${state.settings.theme === "dark" ? "checked" : ""}><span></span></span>
          </label>
        </article>
        <article class="setting-card">
          <h3>Playback</h3>
          <label class="toggle">
            <span>Autoplay</span>
            <span class="switch"><input type="checkbox" data-setting="autoplay" ${state.settings.autoplay ? "checked" : ""}><span></span></span>
          </label>
          <label class="toggle">
            <span>High Quality Audio</span>
            <span class="switch"><input type="checkbox" data-setting="highQuality" ${state.settings.highQuality ? "checked" : ""}><span></span></span>
          </label>
        </article>
        <article class="setting-card">
          <h3>Future Services</h3>
          <p>${integrationNotes.storage}</p>
          <p>${integrationNotes.metadata}</p>
          <p>${integrationNotes.auth}</p>
        </article>
      </section>
    </div>
  `;
}
