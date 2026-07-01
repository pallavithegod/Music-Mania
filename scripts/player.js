import { nextTrack, previousTrack, state } from "./state.js";

let timer = null;
let onTick = () => {};

export function setPlayerTick(callback) {
  onTick = callback;
}

export function play() {
  state.isPlaying = true;
  startTimer();
}

export function pause() {
  state.isPlaying = false;
  stopTimer();
}

export function togglePlayback() {
  if (state.isPlaying) {
    pause();
  } else {
    play();
  }
}

export function playNext() {
  nextTrack();
  play();
}

export function playPrevious() {
  previousTrack();
  play();
}

function startTimer() {
  stopTimer();
  timer = window.setInterval(() => {
    state.progress += 0.6;
    if (state.progress >= 100) {
      state.progress = 0;
      nextTrack();
    }
    onTick();
  }, 1000);
}

function stopTimer() {
  if (timer) {
    window.clearInterval(timer);
    timer = null;
  }
}
