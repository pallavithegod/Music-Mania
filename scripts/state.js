import { albums, artists, featured, playlists, tracks } from "./data.js";

const savedTheme = localStorage.getItem("music-mania-theme");

export const state = {
  route: { name: "home", id: null },
  searchTerm: "",
  currentTrackId: featured.recentlyPlayed[0],
  isPlaying: false,
  progress: 0,
  volume: 76,
  queue: [...featured.recentlyPlayed, ...tracks.map((track) => track.id).filter((id) => !featured.recentlyPlayed.includes(id))],
  panels: { queue: false, lyrics: false },
  settings: {
    theme: savedTheme || "light",
    autoplay: true,
    highQuality: true,
    reduceGlass: false
  }
};

export const getArtist = (id) => artists.find((artist) => artist.id === id);
export const getAlbum = (id) => albums.find((album) => album.id === id);
export const getPlaylist = (id) => playlists.find((playlist) => playlist.id === id);
export const getTrack = (id) => tracks.find((track) => track.id === id);

export function getAlbumTracks(albumId) {
  return tracks.filter((track) => track.albumId === albumId);
}

export function getArtistTracks(artistId) {
  return tracks.filter((track) => track.artistId === artistId);
}

export function getPlaylistTracks(playlistId) {
  const playlist = getPlaylist(playlistId);
  return playlist ? playlist.trackIds.map(getTrack).filter(Boolean) : [];
}

export function getTrackContext(trackId) {
  const track = getTrack(trackId);
  if (!track) return null;
  const artist = getArtist(track.artistId);
  const album = getAlbum(track.albumId);
  return { track, artist, album };
}

export function setRoute(name, id = null) {
  state.route = { name, id };
}

export function setTheme(theme) {
  state.settings.theme = theme;
  localStorage.setItem("music-mania-theme", theme);
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
}

export function setCurrentTrack(trackId, queueIds = null) {
  if (!getTrack(trackId)) return;
  state.currentTrackId = trackId;
  state.progress = 0;
  if (queueIds?.length) {
    state.queue = [...queueIds];
  }
}

export function nextTrack() {
  const currentIndex = state.queue.indexOf(state.currentTrackId);
  const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % state.queue.length : 0;
  setCurrentTrack(state.queue[nextIndex]);
}

export function previousTrack() {
  const currentIndex = state.queue.indexOf(state.currentTrackId);
  const previousIndex = currentIndex > 0 ? currentIndex - 1 : state.queue.length - 1;
  setCurrentTrack(state.queue[previousIndex]);
}
