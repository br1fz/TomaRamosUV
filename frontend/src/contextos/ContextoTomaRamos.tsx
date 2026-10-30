import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type {
  Estudiante,
  Asignatura,
  SeccionAsignatura,
  AsignaturaInscrita,
  MetricasFilaVirtual,
  ConflictoTopeHorario,
  ComprobanteOficialInscripcion,
  ModoVisualizacion,
  PasoFlujoTomaRamos,
} from '../tipos';
import {
  ESTUDIANTE_INICIAL_BRUNO_DIAZ,
  ASIGNATURAS_INICIALES_5TO_SEMESTRE,
} from '../datos';
import { detectarTopeHorario } from '../utilidades/detectorTopesHorarios';
import {
  reproducirArpegioLlegadaTurno,
  reproducirAlertaTopeHorario,
  reproducirAcordeExitoInscripcion,
} from '../utilidades/sintetizadorAudioUV';
import { canalSesionUnica } from '../utilidades/canalTransmisionSesion';

interface TipoContextoTomaRamos {
  estudiante: Estudiante;
  modoVisualizacion: ModoVisualizacion;
  establecerModoVisualizacion: (modo: ModoVisualizacion) => void;
  pasoActual: PasoFlujoTomaRamos;
  establecerPasoActual: (paso: PasoFlujoTomaRamos) => void;
  metricasFila: MetricasFilaVirtual;
  asignaturas: Asignatura[];
  asignaturasInscritas: AsignaturaInscrita[];
  totalCreditosSCT: number;
  conflictoActivo: ConflictoTopeHorario | null;
  descartarConflicto: () => void;
  sesionTransferida: boolean;
  descartarSesionTransferida: () => void;
  asignaturasEnListaEspera: Record<string, number>;
  comprobanteOficial: ComprobanteOficialInscripcion | null;
  estaInscripcionCompletada: boolean;
  mostrarCelebracionTurno: boolean;
  cerrarCelebracionTurno: () => void;
  // Métodos de control y acciones
  iniciarSesion: (correo: string, rut: string) => void;
  cerrarSesion: () => void;
  configurarAlertaSonora: (habilitada: boolean) => void;
  probarAlertaSonora: () => void;
  seleccionarSeccion: (asignatura: Asignatura, seccion: SeccionAsignatura) => boolean;
  desinscribirAsignatura: (codigoAsignatura: string) => void;
  inscribirEnListaEspera: (codigoAsignatura: string) => void;
  confirmarInscripcionCurricular: () => boolean;
  adelantarFilaInstantaneamente: () => void;
  simularColisionConcurrencia: () => void;
  reiniciarSimulacion: () => void;
}

const ContextoTomaRamos = createContext<TipoContextoTomaRamos | undefined>(undefined);

const METRICAS_INICIALES_FILA: MetricasFilaVirtual = {
  estado: 'NO_INICIADA',
  posicionEnFila: 18,
  alumnosPorDelante: 17,
  tiempoEstimadoEsperaSegundos: 72, // ~15 alumnos/min = 4s/alumno -> 18 * 4 = 72s
  tiempoInicialEsperaSegundos: 72,
  porcentajeAvance: 15,
  alertaSonoraHabilitada: true,
  tokenAcceso: 'TOK_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
  segundosRestantesTransaccion: 600, // 10:00 minutos protegidos
};

export const ProveedorTomaRamos: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [estudiante] = useState<Estudiante>(ESTUDIANTE_INICIAL_BRUNO_DIAZ);
  const [modoVisualizacion, establecerModoVisualizacion] = useState<ModoVisualizacion>('ESCRITORIO_WEB');
  const [pasoActual, establecerPasoActual] = useState<PasoFlujoTomaRamos>('INICIO_PORTAL');
  const [metricasFila, establecerMetricasFila] = useState<MetricasFilaVirtual>(METRICAS_INICIALES_FILA);
  const [asignaturas, establecerAsignaturas] = useState<Asignatura[]>(ASIGNATURAS_INICIALES_5TO_SEMESTRE);
  const [asignaturasInscritas, establecerAsignaturasInscritas] = useState<AsignaturaInscrita[]>([]);
  const [conflictoActivo, establecerConflictoActivo] = useState<ConflictoTopeHorario | null>(null);
  const [sesionTransferida, establecerSesionTransferida] = useState<boolean>(false);
  const [asignaturasEnListaEspera, establecerAsignaturasEnListaEspera] = useState<Record<string, number>>({});
  const [comprobanteOficial, establecerComprobanteOficial] = useState<ComprobanteOficialInscripcion | null>(null);
  const [estaInscripcionCompletada, establecerEstaInscripcionCompletada] = useState<boolean>(false);
  const [mostrarCelebracionTurno, establecerMostrarCelebracionTurno] = useState<boolean>(false);

  // Multiplicador de velocidad de avance para la simulación
  const velocidadRef = useRef<number>(1);
  const turnoConcedidoRef = useRef<boolean>(false);

  // Cálculo dinámico de créditos inscritos
  const totalCreditosSCT = asignaturasInscritas.reduce(
    (acumulador, actual) => acumulador + actual.asignatura.creditosSCT,
    0
  );

  // Escuchar eventos de sesión única entre pestañas
  useEffect(() => {
    const cancelarSuscripcion = canalSesionUnica.suscribirAEventos((evento) => {
      if (evento.tipo === 'SESION_TRANSFERIDA' && evento.rut === estudiante.rut) {
        establecerSesionTransferida(true);
      }
    });
    return cancelarSuscripcion;
  }, [estudiante.rut]);

  // Temporizador de avance en la fila virtual
  useEffect(() => {
    if (pasoActual !== 'FILA_VIRTUAL' || metricasFila.estado !== 'EN_ESPERA') return;

    const temporizadorFila = setInterval(() => {
      establecerMetricasFila((anterior) => {
        if (anterior.posicionEnFila <= 1) {
          clearInterval(temporizadorFila);
          turnoConcedidoRef.current = true;

          // Aviso sonoro si está habilitado: arpegio festivo
          if (anterior.alertaSonoraHabilitada) {
            reproducirArpegioLlegadaTurno();
          }

          // Desplegar modal "¡Uy! ¡Al fin me toca!"
          establecerMostrarCelebracionTurno(true);
          establecerPasoActual('SELECCION_RAMOS');

          return {
            ...anterior,
            posicionEnFila: 0,
            alumnosPorDelante: 0,
            tiempoEstimadoEsperaSegundos: 0,
            porcentajeAvance: 100,
            estado: 'TURNO_ASIGNADO',
            instanteAsignacionTurno: Date.now(),
            segundosRestantesTransaccion: 600,
          };
        }

        const nuevaPosicion = anterior.posicionEnFila - 1;
        const nuevosAlumnosAdelante = Math.max(0, nuevaPosicion - 1);
        const segundosEstimados = nuevaPosicion * 4;
        const nuevoAvance = Math.min(98, Math.round(((18 - nuevaPosicion) / 18) * 100));

        return {
          ...anterior,
          posicionEnFila: nuevaPosicion,
          alumnosPorDelante: nuevosAlumnosAdelante,
          tiempoEstimadoEsperaSegundos: segundosEstimados,
          porcentajeAvance: nuevoAvance,
        };
      });
    }, 2000 / velocidadRef.current);

    return () => clearInterval(temporizadorFila);
  }, [pasoActual, metricasFila.estado]);

  // Cuenta regresiva protegida de 10:00 minutos durante la toma de ramos
  useEffect(() => {
    if (pasoActual !== 'SELECCION_RAMOS' || metricasFila.estado !== 'TURNO_ASIGNADO') return;

    const temporizadorTransaccion = setInterval(() => {
      establecerMetricasFila((anterior) => {
        if (anterior.segundosRestantesTransaccion <= 1) {
          clearInterval(temporizadorTransaccion);
          return {
            ...anterior,
            segundosRestantesTransaccion: 0,
            estado: 'EXPIRADA',
          };
        }
        return {
          ...anterior,
          segundosRestantesTransaccion: anterior.segundosRestantesTransaccion - 1,
        };
      });
    }, 1000);

    return () => clearInterval(temporizadorTransaccion);
  }, [pasoActual, metricasFila.estado]);

  const iniciarSesion = (_correo: string, rut: string) => {
    // Notificar a otras pestañas para bloquear concurrencia unitaria
    canalSesionUnica.notificarNuevoInicioSesion(rut);
    establecerMetricasFila({
      ...METRICAS_INICIALES_FILA,
      tokenAcceso: 'TOK_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      estado: 'EN_ESPERA',
    });
    establecerPasoActual('FILA_VIRTUAL');
  };

  const cerrarSesion = () => {
    establecerPasoActual('INICIO_PORTAL');
    establecerAsignaturasInscritas([]);
    establecerComprobanteOficial(null);
    establecerEstaInscripcionCompletada(false);
    establecerMostrarCelebracionTurno(false);
    establecerMetricasFila(METRICAS_INICIALES_FILA);
    establecerSesionTransferida(false);
  };

  const configurarAlertaSonora = (habilitada: boolean) => {
    establecerMetricasFila((anterior) => ({ ...anterior, alertaSonoraHabilitada: habilitada }));
  };

  const probarAlertaSonora = () => {
    reproducirArpegioLlegadaTurno();
  };

  const cerrarCelebracionTurno = () => {
    establecerMostrarCelebracionTurno(false);
  };

  const seleccionarSeccion = (asignatura: Asignatura, seccion: SeccionAsignatura): boolean => {
    // 1. Verificación preventiva de cupos
    if (seccion.cuposDisponibles <= 0) {
      return false;
    }

    // 2. Verificación preventiva de topes de horario
    const conflicto = detectarTopeHorario(asignatura, seccion, asignaturasInscritas);
    if (conflicto) {
      establecerConflictoActivo(conflicto);
      reproducirAlertaTopeHorario();
      return false;
    }

    // 3. Verificación de límite de créditos (máximo 30 SCT)
    const mismaAsignaturaPrevia = asignaturasInscritas.find(
      (item) => item.asignatura.codigo === asignatura.codigo
    );
    const creditosPrevios = mismaAsignaturaPrevia ? mismaAsignaturaPrevia.asignatura.creditosSCT : 0;
    const creditosProyectados = totalCreditosSCT - creditosPrevios + asignatura.creditosSCT;

    if (creditosProyectados > 30) {
      alert('Ha superado el límite curricular semestral de 30 créditos SCT.');
      return false;
    }

    // 4. Actualizar asignaturas inscritas (reemplaza si ya existía otra sección de la misma asignatura)
    const filtradas = asignaturasInscritas.filter(
      (item) => item.asignatura.codigo !== asignatura.codigo
    );
    establecerAsignaturasInscritas([...filtradas, { asignatura, seccion }]);
    establecerConflictoActivo(null);
    return true;
  };

  const desinscribirAsignatura = (codigoAsignatura: string) => {
    establecerAsignaturasInscritas((anterior) =>
      anterior.filter((item) => item.asignatura.codigo !== codigoAsignatura)
    );
  };

  const inscribirEnListaEspera = (codigoAsignatura: string) => {
    establecerAsignaturasEnListaEspera((anterior) => ({
      ...anterior,
      [codigoAsignatura]: 4, // El alumno toma el Turno #4 como se requirió
    }));
  };

  const confirmarInscripcionCurricular = (): boolean => {
    if (asignaturasInscritas.length === 0) {
      alert('Debe inscribir al menos una asignatura antes de confirmar.');
      return false;
    }

    // Simulación de decremento atómico de cupos en base de datos
    establecerAsignaturas((asignaturasActuales) =>
      asignaturasActuales.map((asig) => {
        const inscrita = asignaturasInscritas.find((item) => item.asignatura.codigo === asig.codigo);
        if (!inscrita) return asig;

        return {
          ...asig,
          secciones: asig.secciones.map((sec) => {
            if (sec.id === inscrita.seccion.id) {
              return {
                ...sec,
                cuposDisponibles: Math.max(0, sec.cuposDisponibles - 1),
              };
            }
            return sec;
          }),
        };
      })
    );

    // Generar Comprobante Oficial Digital UV
    const codigoVerificacion = `UV-2026-ICI-5125-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const firmaSHA256 =
      'SHA256:' +
      Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

    const nuevoComprobante: ComprobanteOficialInscripcion = {
      id: `COMPROBANTE-${Date.now()}`,
      codigoVerificacion,
      estudiante,
      asignaturasInscritas,
      totalCreditosSCT,
      fechaHoraConfirmacion: new Date().toLocaleString('es-CL', {
        dateStyle: 'full',
        timeStyle: 'medium',
      }),
      firmaDigitalSHA256: firmaSHA256,
    };

    establecerComprobanteOficial(nuevoComprobante);
    establecerEstaInscripcionCompletada(true);
    establecerPasoActual('HORARIO_ARMADO');
    reproducirAcordeExitoInscripcion();
    return true;
  };

  const adelantarFilaInstantaneamente = () => {
    establecerMetricasFila((anterior) => ({
      ...anterior,
      posicionEnFila: 1,
      alumnosPorDelante: 0,
      tiempoEstimadoEsperaSegundos: 2,
    }));
  };

  const simularColisionConcurrencia = () => {
    canalSesionUnica.notificarNuevoInicioSesion(estudiante.rut);
    establecerSesionTransferida(true);
  };

  const descartarConflicto = () => {
    establecerConflictoActivo(null);
  };

  const descartarSesionTransferida = () => {
    establecerSesionTransferida(false);
  };

  const reiniciarSimulacion = () => {
    establecerAsignaturas(ASIGNATURAS_INICIALES_5TO_SEMESTRE);
    establecerAsignaturasInscritas([]);
    establecerConflictoActivo(null);
    establecerSesionTransferida(false);
    establecerAsignaturasEnListaEspera({});
    establecerComprobanteOficial(null);
    establecerEstaInscripcionCompletada(false);
    establecerMostrarCelebracionTurno(false);
    establecerMetricasFila(METRICAS_INICIALES_FILA);
    establecerPasoActual('INICIO_PORTAL');
  };

  return (
    <ContextoTomaRamos.Provider
      value={{
        estudiante,
        modoVisualizacion,
        establecerModoVisualizacion,
        pasoActual,
        establecerPasoActual,
        metricasFila,
        asignaturas,
        asignaturasInscritas,
        totalCreditosSCT,
        conflictoActivo,
        descartarConflicto,
        sesionTransferida,
        descartarSesionTransferida,
        asignaturasEnListaEspera,
        comprobanteOficial,
        estaInscripcionCompletada,
        mostrarCelebracionTurno,
        cerrarCelebracionTurno,
        iniciarSesion,
        cerrarSesion,
        configurarAlertaSonora,
        probarAlertaSonora,
        seleccionarSeccion,
        desinscribirAsignatura,
        inscribirEnListaEspera,
        confirmarInscripcionCurricular,
        adelantarFilaInstantaneamente,
        simularColisionConcurrencia,
        reiniciarSimulacion,
      }}
    >
      {children}
    </ContextoTomaRamos.Provider>
  );
};

export const usarTomaRamos = () => {
  const contexto = useContext(ContextoTomaRamos);
  if (!contexto) {
    throw new Error('usarTomaRamos debe ser utilizado dentro de un ProveedorTomaRamos');
  }
  return contexto;
};
