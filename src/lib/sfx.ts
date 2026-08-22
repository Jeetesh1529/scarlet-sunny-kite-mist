/** Lightweight beep / blip generator using WebAudio — no asset files needed. */
let ctx: AudioContext | null = null;
function getCtx() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return ctx;
}

function tone(freq: number, durationMs: number, type: OscillatorType = "square", gain = 0.04) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(c.destination);
  osc.start();
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + durationMs / 1000);
  osc.stop(c.currentTime + durationMs / 1000);
}

let enabled = true;
export function setSoundEnabled(v: boolean) {
  enabled = v;
}
export function getSoundEnabled() {
  return enabled;
}

export const sfx = {
  send: () => enabled && tone(880, 60, "square", 0.03),
  receive: () => {
    if (!enabled) return;
    tone(660, 70, "square", 0.04);
    setTimeout(() => tone(990, 90, "square", 0.04), 80);
  },
  tap: () => enabled && tone(1200, 25, "square", 0.02),
  boot: () => {
    if (!enabled) return;
    [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => tone(f, 110, "square", 0.05), i * 110));
  },
  error: () => enabled && tone(220, 200, "sawtooth", 0.04),
};

let loopTimer: number | null = null;
let loopOsc: OscillatorNode | null = null;

export function stopMusic() {
  if (loopTimer != null) {
    window.clearInterval(loopTimer);
    loopTimer = null;
  }
  if (loopOsc) {
    try {
      loopOsc.stop();
    } catch {
      /* already stopped */
    }
    loopOsc = null;
  }
}

/** Tiny chiptune loop — Music Room, not a stream. */
export function playChiptune(bpm: number, seed: number) {
  stopMusic();
  if (!enabled) return;
  const c = getCtx();
  if (!c) return;
  void c.resume();
  const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63, 293.66, 246.94];
  const step = Math.max(140, 60000 / Math.max(60, bpm) / 2);
  let i = seed % notes.length;
  const tick = () => {
    const f = notes[i % notes.length]! * (seed % 2 === 0 ? 1 : 1.125);
    tone(f, step * 0.85, seed % 3 === 0 ? "square" : "triangle", 0.035);
    i += 1;
  };
  tick();
  loopTimer = window.setInterval(tick, step);
}
