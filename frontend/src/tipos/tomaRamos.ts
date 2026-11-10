/**
 * Definiciones de Tipos de Datos del Sistema de Toma de Ramos UV
 * Contexto: Escuela de Ingeniería Civil Informática (Malla 5125 / Plan Común UV)
 * Universidad de Valparaíso - Chile
 */

export type DiaSemana = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes';

export interface BloqueHorario {
  dia: DiaSemana;
  horaInicio: string;  // Ej: "08:30"
  horaFin: string;     // Ej: "10:00"
  indiceBloque: number; // 0: 08:30-10:00, 1: 10:15-11:45, 2: 12:00-13:30, 3: 14:00-15:30, 4: 15:45-17:15, 5: 17:30-19:00
  sala: string;        // Ej: "LAB-INFO 201"
}

export interface SeccionAsignatura {
  id: string;              // Ej: "CIN311-1"
  numeroSeccion: number;   // 1, 2
  profesor: string;        // Ej: "Prof. Álvaro Morales"
  horario: BloqueHorario[];
  cuposTotales: number;
  cuposDisponibles: number;
  estaLlena: boolean;
  cantidadListaEspera?: number;
}

export interface Asignatura {
  codigo: string;          // Ej: "CIN 311"
  nombre: string;          // Ej: "Estructuras de Datos"
  creditosSCT: number;     // 5 créditos SCT
  semestre: number;        // 5.° Semestre
  prerrequisitos: string[]; // ["CIN 211 (Programación Avanzada)"]
  estadoPrerrequisitos: 'APROBADO' | 'PENDIENTE';
  secciones: SeccionAsignatura[];
  colorDistintivo: string; // Color HEX para las etiquetas del horario
  colorTexto: string;
  colorFondoBadge: string;
}

export interface RegistroHistorialRamo {
  codigoRamo: string;
  nombreRamo: string;
  estado: 'INSCRITO' | 'APROBADO' | 'REPROBADO';
  notaFinal?: number; // 1.0 a 7.0 (Regla UV: Aprobado >= 4.0 o Gracia = 3.9)
}

export interface Estudiante {
  nombre: string;
  rut: string;
  correo: string;
  carrera: string;
  codigoCarrera: string;
  sedeCampus: string;
  planCurricular: string;
  semestreActual: number;
  fotoPerfilUrl: string;
  estadoAcademico: 'REGULAR ACTIVO' | 'SUSPENDIDO';
  grupoPrioridad: string;
  historialAcademico?: RegistroHistorialRamo[];
}

export type EstadoFilaVirtual =
  | 'NO_INICIADA'
  | 'EN_ESPERA'
  | 'TURNO_ASIGNADO'
  | 'EXPIRADA'
  | 'COMPLETADA';

export interface MetricasFilaVirtual {
  estado: EstadoFilaVirtual;
  posicionEnFila: number;
  alumnosPorDelante: number;
  tiempoEstimadoEsperaSegundos: number;
  tiempoInicialEsperaSegundos: number;
  porcentajeAvance: number;
  alertaSonoraHabilitada: boolean;
  tokenAcceso: string;
  instanteAsignacionTurno?: number;
  segundosRestantesTransaccion: number; // Cuenta regresiva protegida de 10:00 minutos (600 segundos)
}

export interface ConflictoTopeHorario {
  existeConflicto: boolean;
  asignaturaIntentada: Asignatura;
  seccionIntentada: SeccionAsignatura;
  asignaturaEnConflicto: Asignatura;
  seccionEnConflicto: SeccionAsignatura;
  dia: DiaSemana;
  rangoHorario: string;
  mensajeExplicativo: string;
}

export interface AsignaturaInscrita {
  asignatura: Asignatura;
  seccion: SeccionAsignatura;
}

export interface ComprobanteOficialInscripcion {
  id: string;
  codigoVerificacion: string;
  estudiante: Estudiante;
  asignaturasInscritas: AsignaturaInscrita[];
  totalCreditosSCT: number;
  fechaHoraConfirmacion: string;
  firmaDigitalSHA256: string;
}

export type ModoVisualizacion = 'ESCRITORIO_WEB' | 'MOVIL_APPTUI' | 'LIBRE';

export type PasoFlujoTomaRamos =
  | 'INICIO_PORTAL'
  | 'PORTAL_ALUMNOS'
  | 'INICIO_SESION_SSO'
  | 'FILA_VIRTUAL'
  | 'SELECCION_RAMOS'
  | 'HORARIO_ARMADO'
  | 'COMPROBANTE_OFICIAL';
