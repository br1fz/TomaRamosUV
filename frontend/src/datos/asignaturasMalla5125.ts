import type { Asignatura, Estudiante, DiaSemana } from '../tipos';

/**
 * Bloques horarios institucionales oficiales de la Universidad de Valparaíso
 * Sede Casa Central - Facultad de Ingeniería
 */
export const BLOQUES_HORARIOS_OFICIALES = [
  { indice: 0, horario: '08:30 - 10:00', etiqueta: 'Bloque 1 (08:30 - 10:00)' },
  { indice: 1, horario: '10:15 - 11:45', etiqueta: 'Bloque 2 (10:15 - 11:45)' },
  { indice: 2, horario: '12:00 - 13:30', etiqueta: 'Bloque 3 (12:00 - 13:30)' },
  { indice: 3, horario: '14:00 - 15:30', etiqueta: 'Bloque 4 (14:00 - 15:30)' },
  { indice: 4, horario: '15:45 - 17:15', etiqueta: 'Bloque 5 (15:45 - 17:15)' },
  { indice: 5, horario: '17:30 - 19:00', etiqueta: 'Bloque 6 (17:30 - 19:00)' },
] as const;

export const DIAS_DE_LA_SEMANA: DiaSemana[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
];

/**
 * Perfil de estudiante genérico para pruebas y simulación
 */
export const ESTUDIANTE_INICIAL_PRUEBA: Estudiante = {
  nombre: 'Bruno Enrique Díaz Fernández',
  rut: '19.926.640-3',
  correo: 'bruno.diaz@estudiantes.uv.cl',
  carrera: 'Ingeniería Civil Informática',
  codigoCarrera: '19085 - Casa Central - Diurno',
  sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
  planCurricular: 'Malla 5125 / Plan Común UV',
  semestreActual: 5,
  fotoPerfilUrl: '/portal_alumnos_files/avatar_bruno_diaz.jpg',
  estadoAcademico: 'REGULAR ACTIVO',
  grupoPrioridad: 'Grupo 1 (Prioridad Académica Alta - Rango 1)',
};

/**
 * Oferta de asignaturas curriculares del 5.° Semestre de Ingeniería Civil Informática
 * (Incluye la colisión horaria intencional entre CIN 311 Sec. 1 y FIS 311 Sec. 1 el Lunes 08:30-10:00)
 */
export const ASIGNATURAS_INICIALES_5TO_SEMESTRE: Asignatura[] = [
  {
    codigo: 'CIN 311',
    nombre: 'Estructuras de Datos',
    creditosSCT: 5,
    semestre: 5,
    prerrequisitos: ['CIN 211 (Programación Avanzada)'],
    estadoPrerrequisitos: 'APROBADO',
    colorDistintivo: '#0284c7', // Azul cielo
    colorTexto: '#ffffff',
    colorFondoBadge: '#e0f2fe',
    secciones: [
      {
        id: 'CIN311-1',
        numeroSeccion: 1,
        profesor: 'Prof. Álvaro Morales',
        cuposTotales: 40,
        cuposDisponibles: 4,
        estaLlena: false,
        horario: [
          {
            dia: 'Lunes',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0,
            sala: 'LAB-INFO 201',
          },
          {
            dia: 'Miércoles',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0,
            sala: 'LAB-INFO 201',
          },
        ],
      },
      {
        id: 'CIN311-2',
        numeroSeccion: 2,
        profesor: 'Prof. Gonzalo Rivera',
        cuposTotales: 40,
        cuposDisponibles: 15,
        estaLlena: false,
        horario: [
          {
            dia: 'Martes',
            horaInicio: '10:15',
            horaFin: '11:45',
            indiceBloque: 1,
            sala: 'SALA B-12',
          },
          {
            dia: 'Jueves',
            horaInicio: '10:15',
            horaFin: '11:45',
            indiceBloque: 1,
            sala: 'SALA B-12',
          },
        ],
      },
    ],
  },
  {
    codigo: 'CIN 312',
    nombre: 'Arquitectura de Computadores',
    creditosSCT: 4,
    semestre: 5,
    prerrequisitos: ['CIN 212 (Sistemas Digitales)'],
    estadoPrerrequisitos: 'APROBADO',
    colorDistintivo: '#7c3aed', // Púrpura UV
    colorTexto: '#ffffff',
    colorFondoBadge: '#ede9fe',
    secciones: [
      {
        id: 'CIN312-1',
        numeroSeccion: 1,
        profesor: 'Prof. Roberto Silva',
        cuposTotales: 35,
        cuposDisponibles: 12,
        estaLlena: false,
        horario: [
          {
            dia: 'Lunes',
            horaInicio: '10:15',
            horaFin: '11:45',
            indiceBloque: 1,
            sala: 'SALA C-04',
          },
          {
            dia: 'Miércoles',
            horaInicio: '10:15',
            horaFin: '11:45',
            indiceBloque: 1,
            sala: 'SALA C-04',
          },
        ],
      },
    ],
  },
  {
    codigo: 'CIN 313',
    nombre: 'Modelos de Base de Datos',
    creditosSCT: 4,
    semestre: 5,
    prerrequisitos: ['CIN 211 (Programación Avanzada)'],
    estadoPrerrequisitos: 'APROBADO',
    colorDistintivo: '#d97706', // Ámbar
    colorTexto: '#ffffff',
    colorFondoBadge: '#fef3c7',
    secciones: [
      {
        id: 'CIN313-1',
        numeroSeccion: 1,
        profesor: 'Prof. Claudia Castro',
        cuposTotales: 40,
        cuposDisponibles: 0,
        estaLlena: true,
        cantidadListaEspera: 4,
        horario: [
          {
            dia: 'Martes',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0,
            sala: 'LAB-BD 103',
          },
          {
            dia: 'Jueves',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0,
            sala: 'LAB-BD 103',
          },
        ],
      },
    ],
  },
  {
    codigo: 'CIN 314',
    nombre: 'Fundamentos de Ingeniería de Software',
    creditosSCT: 4,
    semestre: 5,
    prerrequisitos: ['PRO 121 (Taller de Desarrollo)'],
    estadoPrerrequisitos: 'APROBADO',
    colorDistintivo: '#059669', // Esmeralda
    colorTexto: '#ffffff',
    colorFondoBadge: '#d1fae5',
    secciones: [
      {
        id: 'CIN314-1',
        numeroSeccion: 1,
        profesor: 'Prof. Patricia Valdés',
        cuposTotales: 35,
        cuposDisponibles: 18,
        estaLlena: false,
        horario: [
          {
            dia: 'Viernes',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0,
            sala: 'AUD-ING 1',
          },
          {
            dia: 'Viernes',
            horaInicio: '10:15',
            horaFin: '11:45',
            indiceBloque: 1,
            sala: 'AUD-ING 1',
          },
        ],
      },
    ],
  },
  {
    codigo: 'FIS 311',
    nombre: 'Física Electromagnetismo',
    creditosSCT: 5,
    semestre: 5,
    prerrequisitos: ['FIS 211 (Mecánica)', 'MAT 211 (Cálculo III)'],
    estadoPrerrequisitos: 'APROBADO',
    colorDistintivo: '#0891b2', // Turquesa UV
    colorTexto: '#ffffff',
    colorFondoBadge: '#cffafe',
    secciones: [
      {
        id: 'FIS311-1',
        numeroSeccion: 1,
        profesor: 'Prof. Manuel Herrera',
        cuposTotales: 30,
        cuposDisponibles: 10,
        estaLlena: false,
        horario: [
          {
            dia: 'Lunes',
            horaInicio: '08:30',
            horaFin: '10:00',
            indiceBloque: 0, // COLISIÓN DIRECTA CON CIN 311 Sec. 1
            sala: 'SALA F-02',
          },
        ],
      },
      {
        id: 'FIS311-2',
        numeroSeccion: 2,
        profesor: 'Prof. Karla Contreras',
        cuposTotales: 35,
        cuposDisponibles: 8,
        estaLlena: false,
        horario: [
          {
            dia: 'Martes',
            horaInicio: '14:00',
            horaFin: '15:30',
            indiceBloque: 3,
            sala: 'LAB-FIS 2',
          },
          {
            dia: 'Martes',
            horaInicio: '15:45',
            horaFin: '17:15',
            indiceBloque: 4,
            sala: 'LAB-FIS 2',
          },
        ],
      },
    ],
  },
];
