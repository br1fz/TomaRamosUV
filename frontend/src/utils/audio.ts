// Web Audio API Synthesizer for Institutional Audio Cues (Zero external asset dependency)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Cálida, amigable y reconfortante notificación sonora para el momento:
 * "¡Uy! ¡Al fin me toca!"
 * Diseñada para aliviar la ansiedad de la espera mediante un arpegio ascendente
 * de marimba/campana suave (F4 -> A4 -> C5 -> E5 -> G5 -> C6) con armónicos
 * brillantes y reverberación suave, generando alegría y satisfacción.
 */
export function playTurnArrivedCelebrationSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // F4, A4, C5, E5, G5, C6 (Acorde Mayor con séptima mayor y novena - cálido y esperanzador)
    const melody = [
      { freq: 349.23, time: 0.00, dur: 0.5, gain: 0.28 }, // F4
      { freq: 440.00, time: 0.12, dur: 0.5, gain: 0.30 }, // A4
      { freq: 523.25, time: 0.24, dur: 0.55, gain: 0.32 }, // C5
      { freq: 659.25, time: 0.36, dur: 0.6, gain: 0.35 }, // E5
      { freq: 783.99, time: 0.48, dur: 0.7, gain: 0.38 }, // G5
      { freq: 1046.50, time: 0.62, dur: 1.5, gain: 0.42 }, // C6 (campana final luminosa)
    ];

    melody.forEach((note) => {
      // Oscilador principal cálido (onda triangular + seno)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.freq, now + note.time);

      gain.gain.setValueAtTime(0, now + note.time);
      gain.gain.linearRampToValueAtTime(note.gain, now + note.time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + note.time);
      osc.stop(now + note.time + note.dur);

      // Shimmer armónico suave en octava superior para sensación de brillo/alegría
      const shimmer = ctx.createOscillator();
      const shimmerGain = ctx.createGain();

      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(note.freq * 2, now + note.time);

      shimmerGain.gain.setValueAtTime(0, now + note.time);
      shimmerGain.gain.linearRampToValueAtTime(note.gain * 0.25, now + note.time + 0.04);
      shimmerGain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.dur * 0.8);

      shimmer.connect(shimmerGain);
      shimmerGain.connect(ctx.destination);

      shimmer.start(now + note.time);
      shimmer.stop(now + note.time + note.dur * 0.8);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}

/**
 * Chime institucional estándar de turno.
 */
export function playTurnChime() {
  playTurnArrivedCelebrationSound();
}

/**
 * Tono sutil preventivo para advertir choque de horario (Tope de Horario).
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

      gain.gain.setValueAtTime(0.2, now + offset);
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
 * Fanfarria de éxito para la confirmación de la carga académica.
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    const chords = [523.25, 659.25, 783.99, 987.77, 1046.50]; // Acorde mayor
    chords.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.0, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.22, now + idx * 0.06 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.06 + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + idx * 0.06 + 0.9);
    });
  } catch (e) {
    console.warn('Audio playback error', e);
  }
}
