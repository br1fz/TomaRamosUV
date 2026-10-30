// Web Audio API Synthesizer for Institutional Audio Cues (Zero external asset dependency)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Harmonious institutional chime indicating that the student's turn has arrived.
 * C5 -> E5 -> G5 -> C6 glockenspiel/bell cascade.
 */
export function playTurnChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    
    const notes = [
      { freq: 523.25, time: 0.0, dur: 0.4 },  // C5
      { freq: 659.25, time: 0.15, dur: 0.4 }, // E5
      { freq: 783.99, time: 0.30, dur: 0.5 }, // G5
      { freq: 1046.50, time: 0.45, dur: 1.2 }, // C6
    ];

    notes.forEach((note) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(0.35, now + note.time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);
    });
  } catch (e) {
    console.warn('Audio playback not permitted yet by user gesture', e);
  }
}

/**
 * Sharp warning tone for schedule collision (Tope de Horario).
 */
export function playConflictAlert() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    [0, 0.12].forEach((offset) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now + offset); // A4
      osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.1);

      gain.gain.setValueAtTime(0.25, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.1);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.11);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

/**
 * Joyful success chord for atomic reservation completion.
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 987.77, 1046.50]; // C Major 7
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.0, now + idx * 0.05);
      gain.gain.linearRampToValueAtTime(0.2, now + idx * 0.05 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 0.9);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}
