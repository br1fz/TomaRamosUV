/**
 * Canal de Comunicación entre pestañas para Simulación de Bloqueo de Sesión Única
 * (Single-Session Lock Bus UV)
 * 
 * Permite detectar si el estudiante abre sesión en otra pestaña del navegador
 * o dispositivo, notificando a las sesiones previas para invalidarlas de inmediato.
 */

type RetrollamadaSesion = (evento: {
  tipo: 'SESION_TRANSFERIDA' | 'NUEVO_INICIO_SESION';
  rut: string;
  marcaDeTiempo: number;
}) => void;

class GestorCanalSesionUnica {
  private canal: BroadcastChannel | null = null;
  private oyentes: RetrollamadaSesion[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.canal = new BroadcastChannel('bus_bloqueo_sesion_unica_uv');
        this.canal.onmessage = (evento) => {
          this.oyentes.forEach((funcion) => funcion(evento.data));
        };
      } catch (error) {
        console.warn('BroadcastChannel no soportado o restringido:', error);
      }
    }

    // Mecanismo secundario mediante evento storage de localStorage
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (eventoAlmacenamiento) => {
        if (
          eventoAlmacenamiento.key === 'evento_transferencia_sesion_uv' &&
          eventoAlmacenamiento.newValue
        ) {
          try {
            const datos = JSON.parse(eventoAlmacenamiento.newValue);
            this.oyentes.forEach((funcion) => funcion(datos));
          } catch {
            // Ignorar errores de análisis sintáctico
          }
        }
      });
    }
  }

  public notificarNuevoInicioSesion(rut: string) {
    const cargaUtil = {
      tipo: 'SESION_TRANSFERIDA' as const,
      rut,
      marcaDeTiempo: Date.now(),
    };

    if (this.canal) {
      this.canal.postMessage(cargaUtil);
    }

    try {
      localStorage.setItem('evento_transferencia_sesion_uv', JSON.stringify(cargaUtil));
    } catch {
      // Ignorar restricciones de almacenamiento local
    }
  }

  public suscribirAEventos(retrollamada: RetrollamadaSesion) {
    this.oyentes.push(retrollamada);
    return () => {
      this.oyentes = this.oyentes.filter((funcion) => funcion !== retrollamada);
    };
  }
}

export const canalSesionUnica = new GestorCanalSesionUnica();
