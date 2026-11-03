const songs = [
  {
    title: "Stereo Love",
    artist: "Edward Maya & Vika Jigulina",
    src: "music/ssstik.io_1793704832640.mp3",
    note: "A romantic dance-pop favorite."
  },
  {
    title: "Flatline",
    artist: "Justin Bieber",
    src: "music/ssstik.io_1793703924272.mp3",
    note: "A track for the late-night playlist."
  },
  {
    title: "Paparazzi",
    artist: "Lady Gaga",
    src: "music/ssstik.io_1793695580466.mp3",
    note: "A dramatic pop classic."
  }
];

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");
const playButton = document.getElementById("play");
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let isSeeking = false;

function renderPlaylist() {
  playlist.replaceChildren();
  songs.forEach((song, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "song-item" + (index === currentIndex ? " active" : "");
    button.setAttribute("aria-current", index === currentIndex ? "true" : "false");

    const number = document.createElement("span");
    number.className = "song-number";
    number.textContent = String(index + 1).padStart(2, "0");

    const copy = document.createElement("span");
    copy.className = "song-copy";
    const title = document.createElement("strong");
    title.textContent = song.title;
    const artist = document.createElement("small");
    artist.textContent = song.artist;
    copy.append(title, artist);

    const mark = document.createElement("span");
    mark.className = "song-playmark";
    mark.textContent = index === currentIndex && !audio.paused ? "♫" : "＋";

    button.append(number, copy, mark);
    button.addEventListener("click", () => loadSong(index, true));
    playlist.append(button);
  });
}

function loadSong(index, autoplay = false) {
  currentIndex = (index + songs.length) % songs.length;
  const song = songs[currentIndex];
  audio.src = song.src;
  document.getElementById("songTitle").textContent = song.title;
  document.getElementById("songArtist").textContent = song.artist;
  document.getElementById("songNote").textContent = song.note;
  document.getElementById("trackIndex").textContent =
    `${String(currentIndex + 1).padStart(2, "0")} / ${String(songs.length).padStart(2, "0")}`;
  document.getElementById("status").textContent = `Selected: ${song.title}`;
  document.getElementById("progress").value = 0;
  document.getElementById("currentTime").textContent = "0:00";
  document.getElementById("duration").textContent = "0:00";
  playButton.textContent = "▶";
  renderPlaylist();
  if (autoplay) playAudio();
}

async function playAudio() {
  try {
    await audio.play();
    playButton.textContent = "Ⅱ";
    document.getElementById("status").textContent = `Playing: ${songs[currentIndex].title}`;
    renderPlaylist();
  } catch (error) {
    playButton.textContent = "▶";
    document.getElementById("status").textContent =
      "Audio belum bisa diputar. Periksa nama dan lokasi file MP3.";
  }
}

playButton.addEventListener("click", () => {
  if (audio.paused) {
    if (!audio.src) loadSong(currentIndex);
    playAudio();
  } else {
    audio.pause();
    playButton.textContent = "▶";
    document.getElementById("status").textContent = "Paused";
    renderPlaylist();
  }
});

function nextTrack() {
  let nextIndex;
  if (isShuffle && songs.length > 1) {
    do { nextIndex = Math.floor(Math.random() * songs.length); }
    while (nextIndex === currentIndex);
  } else {
    nextIndex = (currentIndex + 1) % songs.length;
  }
  loadSong(nextIndex, true);
}

document.getElementById("next").addEventListener("click", nextTrack);
document.getElementById("previous").addEventListener("click", () => {
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
  } else {
    loadSong((currentIndex - 1 + songs.length) % songs.length, true);
  }
});

document.getElementById("shuffle").addEventListener("click", event => {
  isShuffle = !isShuffle;
  event.currentTarget.classList.toggle("active", isShuffle);
  event.currentTarget.setAttribute("aria-pressed", String(isShuffle));
});

document.getElementById("repeat").addEventListener("click", event => {
  isRepeat = !isRepeat;
  audio.loop = isRepeat;
  event.currentTarget.classList.toggle("active", isRepeat);
  event.currentTarget.setAttribute("aria-pressed", String(isRepeat));
});

document.getElementById("volume").addEventListener("input", event => {
  audio.volume = Number(event.target.value);
});
audio.volume = 0.8;

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);
  return `${minutes}:${String(remaining).padStart(2, "0")}`;
}

audio.addEventListener("loadedmetadata", () => {
  document.getElementById("duration").textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!isSeeking && Number.isFinite(audio.duration) && audio.duration > 0) {
    document.getElementById("progress").value = (audio.currentTime / audio.duration) * 100;
  }
  document.getElementById("currentTime").textContent = formatTime(audio.currentTime);
});
const progress = document.getElementById("progress");
progress.addEventListener("input", () => { isSeeking = true; });
progress.addEventListener("change", () => {
  if (Number.isFinite(audio.duration)) audio.currentTime = (Number(progress.value) / 100) * audio.duration;
  isSeeking = false;
});
audio.addEventListener("ended", () => {
  if (!isRepeat) nextTrack();
});

document.getElementById("favorite").addEventListener("click", event => {
  const button = event.currentTarget;
  const liked = button.classList.toggle("liked");
  button.textContent = liked ? "♥" : "♡";
  button.setAttribute("aria-label", liked ? "Remove favorite" : "Favorite this song");
});

audio.addEventListener("error", () => {
  document.getElementById("status").textContent =
    "File MP3 tidak ditemukan. Pastikan file ada di folder music dengan nama yang sama.";
});

loadSong(0);
