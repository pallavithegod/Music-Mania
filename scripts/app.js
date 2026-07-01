import { playlists } from "./data.js";
import { formatDuration, renderLyricsPanel, renderMobileNav, renderPlayer, renderPrimaryNav, renderQueuePanel, toast } from "./components.js";
import { pause, play, playNext, playPrevious, setPlayerTick, togglePlayback } from "./player.js";
import { getTrackContext, setCurrentTrack, setRoute, setTheme, state } from "./state.js";
import { albumView, artistView, browseView, homeView, libraryView, playlistView, searchView, settingsView } from "./views.js";

const elements = {
  main: document.querySelector("#main-content"),
  primaryNav: document.querySelector("#primary-nav"),
  mobileNav: document.querySelector("#mobile-nav"),
  player: document.querySelector("#player"),
  queuePanel: document.querySelector("#queue-panel"),
  lyricsPanel: document.querySelector("#lyrics-panel"),
  search: document.querySelector("#global-search"),
  settingsButton: document.querySelector("#settings-button"),
  backButton: document.querySelector("#back-button"),
  forwardButton: document.querySelector("#forward-button")
};

const routeViews = {
  home: () => homeView(),
  browse: () => browseView(),
  library: () => libraryView(),
  search: () => searchView(),
  album: (id) => albumView(id),
  artist: (id) => artistView(id),
  playlist: (id) => playlistView(id),
  settings: () => settingsView()
};

function parseHash() {
  const [name = "home", id = null] = location.hash.replace("#/", "").split("/");
  const validRoute = routeViews[name] ? name : "home";
  setRoute(validRoute, id);
}

function navigate(name, id = null) {
  const nextHash = id ? `#/${name}/${id}` : `#/${name}`;
  if (location.hash === nextHash) {
    parseHash();
    renderApp();
  } else {
    location.hash = nextHash;
  }
}

function renderMain() {
  const view = routeViews[state.route.name] || routeViews.home;
  elements.main.innerHTML = view(state.route.id);
  elements.main.focus({ preventScroll: true });
}

function renderChrome() {
  renderPrimaryNav(elements.primaryNav, playlists);
  renderMobileNav(elements.mobileNav);
  renderPlayer(elements.player);
  renderQueuePanel(elements.queuePanel);
  renderLyricsPanel(elements.lyricsPanel);
}

function renderApp() {
  renderMain();
  renderChrome();
}

function handleRouteClick(target) {
  const routeElement = target.closest("[data-route]");
  if (!routeElement) return false;
  navigate(routeElement.dataset.route, routeElement.dataset.id || null);
  return true;
}

function handleTrackClick(target) {
  const trackElement = target.closest("[data-track]");
  if (!trackElement) return false;
  const queue = trackElement.dataset.queue ? trackElement.dataset.queue.split(",").filter(Boolean) : null;
  setCurrentTrack(trackElement.dataset.track, queue);
  play();
  renderChrome();
  toast("Now playing");
  return true;
}

function handlePanelClick(target) {
  const panelButton = target.closest("[data-panel]");
  if (panelButton) {
    const panel = panelButton.dataset.panel;
    state.panels[panel] = !state.panels[panel];
    if (panel === "queue") state.panels.lyrics = false;
    if (panel === "lyrics") state.panels.queue = false;
    renderChrome();
    return true;
  }

  const closeButton = target.closest("[data-close-panel]");
  if (closeButton) {
    state.panels[closeButton.dataset.closePanel] = false;
    renderChrome();
    return true;
  }

  return false;
}

function handlePlayerClick(target) {
  const playerButton = target.closest("[data-player]");
  if (!playerButton) return false;

  if (playerButton.dataset.player === "toggle") togglePlayback();
  if (playerButton.dataset.player === "next") playNext();
  if (playerButton.dataset.player === "previous") playPrevious();
  renderChrome();
  return true;
}

function handleSliderInput(target) {
  const slider = target.closest("[data-slider]");
  if (!slider) return false;

  const value = Number(slider.value);
  const fill = slider.parentElement.querySelector(".progress-fill, .volume-fill");
  if (fill) fill.style.setProperty("--value", `${value}%`);

  if (slider.dataset.slider === "progress") {
    state.progress = value;
    slider.parentElement.setAttribute("aria-valuenow", String(Math.round(value)));
    const context = getTrackContext(state.currentTrackId);
    const elapsed = Math.round((value / 100) * context.track.duration);
    document.querySelector("[data-time='elapsed']").textContent = formatDuration(elapsed);
    renderLyricsPanel(elements.lyricsPanel);
  }

  if (slider.dataset.slider === "volume") {
    state.volume = value;
  }

  return true;
}

function handleSettingsChange(target) {
  const input = target.closest("[data-setting]");
  if (!input) return false;
  const setting = input.dataset.setting;
  if (setting === "theme") {
    setTheme(input.checked ? "dark" : "light");
  } else {
    state.settings[setting] = input.checked;
  }
  renderApp();
  return true;
}

function onDocumentClick(event) {
  const target = event.target;
  if (handleRouteClick(target)) return;
  if (handleTrackClick(target)) return;
  if (handlePanelClick(target)) return;
  handlePlayerClick(target);
}

function bindEvents() {
  document.addEventListener("click", onDocumentClick);
  document.addEventListener("input", (event) => {
    if (!handleSliderInput(event.target) && event.target === elements.search) {
      state.searchTerm = event.target.value;
      if (state.route.name !== "search") {
        navigate("search");
      } else {
        renderMain();
      }
    }
  });
  document.addEventListener("change", (event) => handleSettingsChange(event.target));

  elements.search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") navigate("search");
  });

  elements.settingsButton.addEventListener("click", () => navigate("settings"));
  elements.backButton.addEventListener("click", () => history.back());
  elements.forwardButton.addEventListener("click", () => history.forward());

  window.addEventListener("hashchange", () => {
    parseHash();
    renderApp();
  });

  window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea")) return;
    if (event.code === "Space") {
      event.preventDefault();
      togglePlayback();
      renderChrome();
    }
    if (event.key === "Escape") {
      state.panels.queue = false;
      state.panels.lyrics = false;
      renderChrome();
    }
  });
}

function boot() {
  setTheme(state.settings.theme);
  parseHash();
  if (!location.hash) navigate("home");
  bindEvents();
  setPlayerTick(renderChrome);
  renderApp();
  pause();
}

boot();
