// PARAZ Web Music — setiap lagu punya file audio dan video background sendiri.
// Upload MP3 ke folder music/ dan MP4 ke folder videos/ di repository GitHub.

const tracks = [
  { title: "Paparazzi", artist: "Lady Gaga", audio: "music/paparazzi.mp3", video: "videos/paparazzi.mp4", note: "Paparazzi — pilih lagu dan nikmati videonya." },
  { title: "Consume", artist: "Chase Atlantic", audio: "music/consume.mp3", video: "videos/consume.mp4", note: "Video background Consume." },
  { title: "Perfect", artist: "Ed Sheeran", audio: "music/perfect.mp3", video: "videos/perfect.mp4", note: "Video background Perfect." },
  { title: "Unconditionally", artist: "Katy Perry", audio: "music/unconditionally.mp3", video: "videos/unconditionally.mp4", note: "Video background Unconditionally." },
  { title: "Rewrite the Stars", artist: "James Arthur & Anne-Marie", audio: "music/rewrite-the-stars.mp3", video: "videos/rewrite-the-stars.mp4", note: "Video background Rewrite the Stars." },
  { title: "Somebody's Pleasure", artist: "Aziz Hedra", audio: "music/somebodys-pleasure.mp3", video: "videos/somebodys-pleasure.mp4", note: "Video background Somebody's Pleasure." }
];

const audio = document.getElementById("audio");
const video = document.getElementById("backgroundVideo");
const visual = document.getElementById("visual");
const playlist = document.getElementById("playlist");
const playButton = document.getElementById("playButton");
const repeatButton = document.getElementById("repeatButton");
const progress = document.getElementById("progress");
let current = 0, repeat = false, shuffle = false;

function renderPlaylist() {
  playlist.innerHTML = "";
  tracks.forEach((track, i) => {
    const button = document.createElement("button");
    button.className = "track" + (i === current ? " active" : "");
    button.innerHTML = `<span class="track-art">${String(i+1).padStart(2,"0")}</span>
      <span class="track-copy"><strong>${track.title}</strong><small>${track.artist}</small></span>
      <span class="track-state">${i === current && !audio.paused ? "♫" : "♪"}</span>`;
    button.addEventListener("click", () => selectTrack(i, true));
    playlist.appendChild(button);
  });
}
function selectTrack(index, autoplay=false) {
  current = index;
  const track = tracks[current];
  document.getElementById("songTitle").textContent = track.title;
  document.getElementById("songArtist").textContent = track.artist;
  document.getElementById("lyricsText").textContent = track.note;

  audio.pause();
  audio.src = track.audio;
  audio.load();

  video.pause();
  video.src = track.video;
  video.load();
  visual.classList.remove("has-video");
  video.onloadeddata = () => visual.classList.add("has-video");
  video.onerror = () => visual.classList.remove("has-video");

  progress.value = 0;
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("duration").textContent = "0:00";
  if (autoplay) startPlayback();
  updatePlayButton();
  renderPlaylist();
}
function startPlayback() {
  audio.play().then(() => {
    if (video.src) video.play().catch(() => {});
  }).catch(() => {
    document.getElementById("lyricsText").textContent = "Audio belum ditemukan atau belum bisa diputar. Periksa nama file MP3 di folder music/.";
  });
}
function updatePlayButton() {
  const playing = !audio.paused;
  playButton.textContent = playing ? "Ⅱ" : "▶";
  visual.classList.toggle("playing", playing);
  if (!playing) video.pause();
  renderPlaylist();
}
function nextTrack() {
  let next = shuffle ? Math.floor(Math.random()*tracks.length) : (current+1)%tracks.length;
  if (tracks.length > 1 && next === current) next = (current+1)%tracks.length;
  selectTrack(next, true);
}
function previousTrack() { selectTrack((current-1+tracks.length)%tracks.length, true); }
function timeFormat(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  return `${Math.floor(seconds/60)}:${String(Math.floor(seconds%60)).padStart(2,"0")}`;
}
playButton.addEventListener("click", () => {
  if (audio.paused) startPlayback();
  else audio.pause();
});
document.getElementById("nextButton").addEventListener("click", nextTrack);
document.getElementById("prevButton").addEventListener("click", previousTrack);
repeatButton.addEventListener("click", () => {
  repeat = !repeat; audio.loop = repeat;
  repeatButton.classList.toggle("selected", repeat);
  repeatButton.textContent = repeat ? "↻¹" : "↻";
});
document.getElementById("shuffleButton").addEventListener("click", e => {
  shuffle = !shuffle; e.currentTarget.classList.toggle("selected", shuffle);
});
document.getElementById("volume").addEventListener("input", e => audio.volume = Number(e.target.value));
progress.addEventListener("input", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (progress.value/100)*audio.duration;
});
audio.addEventListener("timeupdate", () => {
  if (Number.isFinite(audio.duration)) progress.value = (audio.currentTime/audio.duration)*100;
  document.getElementById("currentTime").textContent = timeFormat(audio.currentTime);
  document.getElementById("duration").textContent = timeFormat(audio.duration);
});
audio.addEventListener("play", () => {
  updatePlayButton();
  video.play().catch(() => {});
});
audio.addEventListener("pause", updatePlayButton);
audio.addEventListener("ended", () => { if (!repeat) nextTrack(); });
document.getElementById("likeButton").addEventListener("click", e => {
  e.currentTarget.textContent = e.currentTarget.textContent === "♡" ? "♥" : "♡";
});
audio.volume = 0.75;
document.getElementById("trackCount").textContent = `${String(tracks.length).padStart(2,"0")} TRACKS`;
selectTrack(0);
