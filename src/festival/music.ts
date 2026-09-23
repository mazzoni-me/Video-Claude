// Background track: drop the file at public/music/tertulia.mp3.
export const MUSIC_FILE = "music/tertulia.mp3";
export const MUSIC_START_SECONDS = 121; // 2:01

// Tempo of "Tertulia" around 2:01, measured from the track.
export const BPM = 144;
// Seconds after the video starts at which the first beat falls.
export const FIRST_BEAT_SECONDS = 0.1;

// Beats elapsed since the first beat, as a float (1 = one beat).
export const beatsAt = (videoFrame: number, fps: number) =>
  ((videoFrame / fps - FIRST_BEAT_SECONDS) * BPM) / 60;
