/**
 * Sintetizador de Audio Institucional basado en Web Audio API
 * Genera notificaciones sonoras sin dependencias externas ni archivos remotos.
 * Universidad de Valparaíso - Chile
 */

let contextoAudio: AudioContext | null = null;

function obtenerContextoAudio(): AudioContext {
  if (!contextoAudio) {
    const ClaseAudioContext =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    contextoAudio = new ClaseAudioContext();
  }
  if (contextoAudio.state === 'suspended') {
    contextoAudio.resume();
  }
  return contextoAudio;
}

/**
 * Notificación sonora amigable, cálida y gratificante para el momento:
 * "¡Uy! ¡Al fin me toca!"
 * 
 * Diseñada para liberar dopamina y aliviar de inmediato la ansiedad de la espera
 * mediante un arpegio ascendente suave (Fa4 -> La4 -> Do5 -> Mi5 -> Sol5 -> Do6)
 * con timbre similar a marimba o campanillas orquestales con brillo armónico.
 */
export function reproducirArpegioLlegadaTurno() {
  try {
    const contexto = obtenerContextoAudio();
    const ahora = contexto.currentTime;

    // F4, A4, C5, E5, G5, C6 (Acorde Mayor con séptima mayor y novena - cálido y reconfortante)
    const melodiaTurno = [
      { frecuencia: 349.23, tiempo: 0.00, duracion: 0.50, ganancia: 0.28 }, // Fa4
      { frecuencia: 440.00, tiempo: 0.12, duracion: 0.50, ganancia: 0.30 }, // La4
      { frecuencia: 523.25, tiempo: 0.24, duracion: 0.55, ganancia: 0.32 }, // Do5
      { frecuencia: 659.25, tiempo: 0.36, duracion: 0.60, ganancia: 0.35 }, // Mi5
      { frecuencia: 783.99, tiempo: 0.48, duracion: 0.70, ganancia: 0.38 }, // Sol5
      { frecuencia: 1046.50, tiempo: 0.62, duracion: 1.50, ganancia: 0.42 }, // Do6 (campanada final)
    ];

    melodiaTurno.forEach((nota) => {
      // Oscilador cálido con onda triangular
      const oscilador = contexto.createOscillator();
      const nodoGanancia = contexto.createGain();

      oscilador.type = 'triangle';
      oscilador.frequency.setValueAtTime(nota.frecuencia, ahora + nota.tiempo);

      nodoGanancia.gain.setValueAtTime(0, ahora + nota.tiempo);
      nodoGanancia.gain.linearRampToValueAtTime(nota.ganancia, ahora + nota.tiempo + 0.03);
      nodoGanancia.gain.exponentialRampToValueAtTime(0.0001, ahora + nota.tiempo + nota.duracion);

      oscilador.connect(nodoGanancia);
      nodoGanancia.connect(contexto.destination);

      oscilador.start(ahora + nota.tiempo);
      oscilador.stop(ahora + nota.tiempo + nota.duracion);

      // Resonancia de brillo armónico en la octava superior
      const brilloArmonico = contexto.createOscillator();
      const gananciaBrillo = contexto.createGain();

      brilloArmonico.type = 'sine';
      brilloArmonico.frequency.setValueAtTime(nota.frecuencia * 2, ahora + nota.tiempo);

      gananciaBrillo.gain.setValueAtTime(0, ahora + nota.tiempo);
      gananciaBrillo.gain.linearRampToValueAtTime(nota.ganancia * 0.25, ahora + nota.tiempo + 0.04);
      gananciaBrillo.gain.exponentialRampToValueAtTime(0.0001, ahora + nota.tiempo + nota.duracion * 0.8);

      brilloArmonico.connect(gananciaBrillo);
      gananciaBrillo.connect(contexto.destination);

      brilloArmonico.start(ahora + nota.tiempo);
      brilloArmonico.stop(ahora + nota.tiempo + nota.duracion * 0.8);
    });
  } catch (error) {
    console.warn('Error al reproducir audio de llegada de turno:', error);
  }
}

/**
 * Tono sutil preventivo para advertir un cruce o colisión en la malla horaria semanal
 */
export function reproducirAlertaTopeHorario() {
  try {
    const contexto = obtenerContextoAudio();
    const ahora = contexto.currentTime;

    [0, 0.12].forEach((desplazamiento) => {
      const oscilador = contexto.createOscillator();
      const nodoGanancia = contexto.createGain();

      oscilador.type = 'sawtooth';
      oscilador.frequency.setValueAtTime(440, ahora + desplazamiento);
      oscilador.frequency.exponentialRampToValueAtTime(320, ahora + desplazamiento + 0.1);

      nodoGanancia.gain.setValueAtTime(0.2, ahora + desplazamiento);
      nodoGanancia.gain.exponentialRampToValueAtTime(0.001, ahora + desplazamiento + 0.1);

      oscilador.connect(nodoGanancia);
      nodoGanancia.connect(contexto.destination);

      oscilador.start(ahora + desplazamiento);
      oscilador.stop(ahora + desplazamiento + 0.11);
    });
  } catch (error) {
    console.warn('Error al reproducir audio de tope de horario:', error);
  }
}

/**
 * Acorde mayor brillante de confirmación exitosa de carga académica
 */
export function reproducirAcordeExitoInscripcion() {
  try {
    const contexto = obtenerContextoAudio();
    const ahora = contexto.currentTime;

    const frecuenciasAcorde = [523.25, 659.25, 783.99, 987.77, 1046.50];
    frecuenciasAcorde.forEach((frecuencia, indice) => {
      const oscilador = contexto.createOscillator();
      const nodoGanancia = contexto.createGain();

      oscilador.type = 'sine';
      oscilador.frequency.setValueAtTime(frecuencia, ahora + indice * 0.06);

      nodoGanancia.gain.setValueAtTime(0.0, ahora + indice * 0.06);
      nodoGanancia.gain.linearRampToValueAtTime(0.22, ahora + indice * 0.06 + 0.03);
      nodoGanancia.gain.exponentialRampToValueAtTime(0.0001, ahora + indice * 0.06 + 0.85);

      oscilador.connect(nodoGanancia);
      nodoGanancia.connect(contexto.destination);

      oscilador.start(ahora + indice * 0.06);
      oscilador.stop(ahora + indice * 0.06 + 0.90);
    });
  } catch (error) {
    console.warn('Error al reproducir audio de éxito de inscripción:', error);
  }
}
