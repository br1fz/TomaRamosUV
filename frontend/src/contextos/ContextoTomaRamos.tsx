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
  UsuarioPrueba,
  ResultadoAutenticacion,
} from '../tipos';
import {
  CATALOGO_MALLA_COMPLETA,
  USUARIOS_PRUEBA_ALPHA,
  buscarUsuarioPrueba,
} from '../datos';
import {
  autenticarUsuario,
  firmarTokenJWT,
  guardarSesion,
  restaurarSesionActiva,
  limpiarSesion,
} from '../servicios';
import { detectarTopeHorario } from '../utilidades/detectorTopesHorarios';
import { evaluarPrerrequisitosEstudiante } from '../utilidades/validadorPrerrequisitos';
import {
  reproducirArpegioLlegadaTurno,
  reproducirAlertaTopeHorario,
  reproducirAcordeExitoInscripcion,
} from '../utilidades/sintetizadorAudioUV';
import { canalSesionUnica } from '../utilidades/canalTransmisionSesion';

export interface InfoAlertaCurricular {
  tipo: 'LIMITE_CREDITOS' | 'SIN_ASIGNATURAS' | 'SESION_EXPIRADA' | 'INFO';
  titulo: string;
  mensaje: string;
}

interface TipoContextoTomaRamos {
  estudiante: Estudiante;
  establecerEstudiante: (est: Estudiante) => void;
  usuariosPrueba: UsuarioPrueba[];
  filtroSemestre: number | 'TODOS';
  establecerFiltroSemestre: (semestre: number | 'TODOS') => void;
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
  alertaCurricular: InfoAlertaCurricular | null;
  descartarAlertaCurricular: () => void;
  // Métodos de control y acciones
  iniciarSesion: (correo: string, rut: string) => void;
  iniciarSesionConCredenciales: (correo: string, contrasena: string) => Promise<ResultadoAutenticacion>;
  seleccionarUsuarioPruebaDirecto: (idOUsuario: string | UsuarioPrueba) => Promise<void>;
  cerrarSesion: () => void;
  entrarAFilaVirtual: () => void;
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

const CLAVE_ALMACENAMIENTO_SESION = 'toma_ramos_uv_estado_sesion_v1';

interface EstadoPersistente {
  pasoActual: PasoFlujoTomaRamos;
  metricasFila: MetricasFilaVirtual;
  asignaturasInscritas: AsignaturaInscrita[];
  asignaturasEnListaEspera: Record<string, number>;
  comprobanteOficial: ComprobanteOficialInscripcion | null;
  estaInscripcionCompletada: boolean;
}

const cargarEstadoPersistido = (): EstadoPersistente | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(CLAVE_ALMACENAMIENTO_SESION);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignorar error de lectura
  }
  return null;
};

const cargarUsuarioPersistido = (): Estudiante => {
  if (typeof window === 'undefined') return USUARIOS_PRUEBA_ALPHA[0];
  try {
    const raw = sessionStorage.getItem('toma_ramos_uv_usuario_activo_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.rut) return parsed;
    }
  } catch {
    // ignorar error
  }
  return USUARIOS_PRUEBA_ALPHA[0];
};

export const ProveedorTomaRamos: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const estadoPersistido = cargarEstadoPersistido();

  const [estudiante, establecerEstudiante] = useState<Estudiante>(cargarUsuarioPersistido);
  const [filtroSemestre, establecerFiltroSemestre] = useState<number | 'TODOS'>(
    cargarUsuarioPersistido().semestreActual || 5
  );
  const [modoVisualizacion, establecerModoVisualizacion] = useState<ModoVisualizacion>('ESCRITORIO_WEB');
  const [pasoActual, establecerPasoActual] = useState<PasoFlujoTomaRamos>(
    estadoPersistido?.pasoActual || 'INICIO_PORTAL'
  );
  const [metricasFila, establecerMetricasFila] = useState<MetricasFilaVirtual>(
    estadoPersistido?.metricasFila || METRICAS_INICIALES_FILA
  );
  const [asignaturas, establecerAsignaturas] = useState<Asignatura[]>(CATALOGO_MALLA_COMPLETA);
  const [asignaturasInscritas, establecerAsignaturasInscritas] = useState<AsignaturaInscrita[]>(
    estadoPersistido?.asignaturasInscritas || []
  );
  const [conflictoActivo, establecerConflictoActivo] = useState<ConflictoTopeHorario | null>(null);
  const [sesionTransferida, establecerSesionTransferida] = useState<boolean>(false);
  const [asignaturasEnListaEspera, establecerAsignaturasEnListaEspera] = useState<Record<string, number>>(
    estadoPersistido?.asignaturasEnListaEspera || {}
  );
  const [comprobanteOficial, establecerComprobanteOficial] = useState<ComprobanteOficialInscripcion | null>(
    estadoPersistido?.comprobanteOficial || null
  );
  const [estaInscripcionCompletada, establecerEstaInscripcionCompletada] = useState<boolean>(
    estadoPersistido?.estaInscripcionCompletada || false
  );
  const [alertaCurricular, establecerAlertaCurricular] = useState<InfoAlertaCurricular | null>(null);
  const [mostrarCelebracionTurno, establecerMostrarCelebracionTurno] = useState<boolean>(false);

  // Multiplicador de velocidad de avance para la simulación
  const velocidadRef = useRef<number>(1);
  const turnoConcedidoRef = useRef<boolean>(false);

  // Intentar restaurar sesión activa JWT al montar
  useEffect(() => {
    restaurarSesionActiva().then((usuario) => {
      if (usuario) {
        establecerEstudiante(usuario);
        establecerFiltroSemestre(usuario.semestreActual);
      }
    });
  }, []);

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
          establecerAlertaCurricular({
            tipo: 'SESION_EXPIRADA',
            titulo: 'Tiempo de Reserva Agotado (10:00 min)',
            mensaje:
              'Tu ventana protegida de 10 minutos para tomar ramos ha concluido. Para garantizar la equidad de cupos con los demás estudiantes, tus vacantes temporales han sido liberadas.',
          });
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

  // Sincronizar estado en sessionStorage para resistir refrescos accidentales (F5)
  useEffect(() => {
    try {
      const aGuardar: EstadoPersistente = {
        pasoActual,
        metricasFila,
        asignaturasInscritas,
        asignaturasEnListaEspera,
        comprobanteOficial,
        estaInscripcionCompletada,
      };
      sessionStorage.setItem(CLAVE_ALMACENAMIENTO_SESION, JSON.stringify(aGuardar));
    } catch {
      // Ignorar si storage no está disponible
    }
  }, [
    pasoActual,
    metricasFila,
    asignaturasInscritas,
    asignaturasEnListaEspera,
    comprobanteOficial,
    estaInscripcionCompletada,
  ]);

  const iniciarSesion = (correo: string, rut: string) => {
    const usuarioEncontrado = buscarUsuarioPrueba(correo) || buscarUsuarioPrueba(rut);
    if (usuarioEncontrado) {
      establecerEstudiante(usuarioEncontrado);
      establecerFiltroSemestre(usuarioEncontrado.semestreActual);
      firmarTokenJWT(usuarioEncontrado).then((token) => {
        guardarSesion(token, usuarioEncontrado);
      });
    }
    // Notificar a otras pestañas para bloquear concurrencia unitaria
    canalSesionUnica.notificarNuevoInicioSesion(rut || estudiante.rut);
    establecerPasoActual('PORTAL_ALUMNOS');
  };

  const iniciarSesionConCredenciales = async (
    correo: string,
    contrasena: string
  ): Promise<ResultadoAutenticacion> => {
    const resultado = await autenticarUsuario(correo, contrasena);
    if (resultado.exito && resultado.estudiante) {
      establecerEstudiante(resultado.estudiante);
      establecerFiltroSemestre(resultado.estudiante.semestreActual);
      canalSesionUnica.notificarNuevoInicioSesion(resultado.estudiante.rut);
      establecerPasoActual('PORTAL_ALUMNOS');
    }
    return resultado;
  };

  const seleccionarUsuarioPruebaDirecto = async (
    idOUsuario: string | UsuarioPrueba
  ): Promise<void> => {
    let targetUser: UsuarioPrueba | undefined;
    if (typeof idOUsuario === 'string') {
      targetUser = buscarUsuarioPrueba(idOUsuario);
    } else {
      targetUser = idOUsuario;
    }
    if (!targetUser) return;

    const token = await firmarTokenJWT(targetUser);
    guardarSesion(token, targetUser);
    establecerEstudiante(targetUser);
    establecerFiltroSemestre(targetUser.semestreActual);
    canalSesionUnica.notificarNuevoInicioSesion(targetUser.rut);
    establecerPasoActual('PORTAL_ALUMNOS');
  };

  const entrarAFilaVirtual = () => {
    establecerMetricasFila({
      ...METRICAS_INICIALES_FILA,
      tokenAcceso: 'TOK_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      estado: 'EN_ESPERA',
    });
    establecerPasoActual('FILA_VIRTUAL');
  };

  const cerrarSesion = () => {
    limpiarSesion();
    try {
      sessionStorage.removeItem(CLAVE_ALMACENAMIENTO_SESION);
    } catch {
      // Ignorar
    }
    establecerPasoActual('INICIO_PORTAL');
    establecerAsignaturasInscritas([]);
    establecerComprobanteOficial(null);
    establecerEstaInscripcionCompletada(false);
    establecerMostrarCelebracionTurno(false);
    establecerAlertaCurricular(null);
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

    // 2. Verificación de Prerrequisitos (Regla de negocio UV: >= 4.0 o gracia = 3.9)
    const evaluacionPrerreq = evaluarPrerrequisitosEstudiante(asignatura, estudiante);
    if (!evaluacionPrerreq.habilitado) {
      establecerAlertaCurricular({
        tipo: 'INFO',
        titulo: 'Prerrequisito Institucional Pendiente',
        mensaje: evaluacionPrerreq.motivo,
      });
      return false;
    }

    // 3. Verificación preventiva de topes de horario (Regla de Choque en Horario)
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
      establecerAlertaCurricular({
        tipo: 'LIMITE_CREDITOS',
        titulo: 'Límite Curricular Excedido',
        mensaje: `La asignatura ${asignatura.codigo} (${asignatura.creditosSCT} SCT) supera el límite máximo permitido de 30 créditos SCT semestrales. Tu carga total proyectada sería de ${creditosProyectados} SCT.`,
      });
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
      establecerAlertaCurricular({
        tipo: 'SIN_ASIGNATURAS',
        titulo: 'Sin Asignaturas Seleccionadas',
        mensaje:
          'Debes seleccionar e inscribir al menos una asignatura en tu horario antes de confirmar y emitir tu comprobante oficial UV.',
      });
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

  const descartarAlertaCurricular = () => {
    establecerAlertaCurricular(null);
  };

  const reiniciarSimulacion = () => {
    limpiarSesion();
    try {
      sessionStorage.removeItem(CLAVE_ALMACENAMIENTO_SESION);
    } catch {
      // Ignorar
    }
    establecerAsignaturas(CATALOGO_MALLA_COMPLETA);
    establecerAsignaturasInscritas([]);
    establecerConflictoActivo(null);
    establecerSesionTransferida(false);
    establecerAsignaturasEnListaEspera({});
    establecerComprobanteOficial(null);
    establecerEstaInscripcionCompletada(false);
    establecerMostrarCelebracionTurno(false);
    establecerAlertaCurricular(null);
    establecerMetricasFila(METRICAS_INICIALES_FILA);
    establecerPasoActual('INICIO_PORTAL');
  };

  return (
    <ContextoTomaRamos.Provider
      value={{
        estudiante,
        establecerEstudiante,
        usuariosPrueba: USUARIOS_PRUEBA_ALPHA,
        filtroSemestre,
        establecerFiltroSemestre,
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
        alertaCurricular,
        descartarAlertaCurricular,
        iniciarSesion,
        iniciarSesionConCredenciales,
        seleccionarUsuarioPruebaDirecto,
        cerrarSesion,
        entrarAFilaVirtual,
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

export function useTomaRamos() {
  const contexto = useContext(ContextoTomaRamos);
  if (!contexto) {
    throw new Error('useTomaRamos debe ser utilizado dentro de un ProveedorTomaRamos');
  }
  return contexto;
}

export const usarTomaRamos = useTomaRamos;
