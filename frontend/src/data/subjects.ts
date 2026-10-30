import type { Subject, Student } from '../types';

export const TIME_BLOCKS = [
  { index: 0, time: '08:30 - 10:00', label: 'Bloque 1 (08:30 - 10:00)' },
  { index: 1, time: '10:15 - 11:45', label: 'Bloque 2 (10:15 - 11:45)' },
  { index: 2, time: '12:00 - 13:30', label: 'Bloque 3 (12:00 - 13:30)' },
  { index: 3, time: '14:00 - 15:30', label: 'Bloque 4 (14:00 - 15:30)' },
  { index: 4, time: '15:45 - 17:15', label: 'Bloque 5 (15:45 - 17:15)' },
  { index: 5, time: '17:30 - 19:00', label: 'Bloque 6 (17:30 - 19:00)' },
];

export const DAYS_OF_WEEK = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'] as const;

export const INITIAL_STUDENT: Student = {
  name: 'Bruno Díaz Fernández',
  rut: '19.926.640-3',
  email: 'bruno.diazf@estudiantes.uv.cl',
  career: 'Ingeniería Civil Informática',
  careerCode: '19085 - Casa Central - Diurno',
  campus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
  curriculumPlan: 'Malla 5125 / Plan Común UV',
  semester: 5,
  avatarUrl: '/bruno_photo.jpg',
  academicStatus: 'REGULAR ACTIVO',
  priorityGroup: 'Grupo 1 (Prioridad Académica Alta - Rango 1)',
};

export const INITIAL_SUBJECTS: Subject[] = [
  {
    code: 'CIN 311',
    name: 'Estructuras de Datos',
    credits: 5,
    semester: 5,
    prerequisites: ['CIN 211 (Programación Avanzada)'],
    prereqStatus: 'APPROVED',
    color: '#0284c7', // Sky blue
    textColor: '#ffffff',
    badgeBg: '#e0f2fe',
    sections: [
      {
        id: 'CIN311-1',
        sectionNumber: 1,
        professor: 'Prof. Álvaro Morales',
        totalQuota: 40,
        availableQuota: 4,
        isFull: false,
        schedule: [
          {
            day: 'Lunes',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0,
            room: 'LAB-INFO 201',
          },
          {
            day: 'Miércoles',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0,
            room: 'LAB-INFO 201',
          },
        ],
      },
      {
        id: 'CIN311-2',
        sectionNumber: 2,
        professor: 'Prof. Gonzalo Rivera',
        totalQuota: 40,
        availableQuota: 15,
        isFull: false,
        schedule: [
          {
            day: 'Martes',
            startTime: '10:15',
            endTime: '11:45',
            blockIndex: 1,
            room: 'SALA B-12',
          },
          {
            day: 'Jueves',
            startTime: '10:15',
            endTime: '11:45',
            blockIndex: 1,
            room: 'SALA B-12',
          },
        ],
      },
    ],
  },
  {
    code: 'CIN 312',
    name: 'Arquitectura de Computadores',
    credits: 4,
    semester: 5,
    prerequisites: ['CIN 212 (Sistemas Digitales)'],
    prereqStatus: 'APPROVED',
    color: '#7c3aed', // Purple
    textColor: '#ffffff',
    badgeBg: '#ede9fe',
    sections: [
      {
        id: 'CIN312-1',
        sectionNumber: 1,
        professor: 'Prof. Roberto Silva',
        totalQuota: 35,
        availableQuota: 12,
        isFull: false,
        schedule: [
          {
            day: 'Lunes',
            startTime: '10:15',
            endTime: '11:45',
            blockIndex: 1,
            room: 'SALA C-04',
          },
          {
            day: 'Miércoles',
            startTime: '10:15',
            endTime: '11:45',
            blockIndex: 1,
            room: 'SALA C-04',
          },
        ],
      },
    ],
  },
  {
    code: 'CIN 313',
    name: 'Modelos de Base de Datos',
    credits: 4,
    semester: 5,
    prerequisites: ['CIN 211 (Programación Avanzada)'],
    prereqStatus: 'APPROVED',
    color: '#d97706', // Amber
    textColor: '#ffffff',
    badgeBg: '#fef3c7',
    sections: [
      {
        id: 'CIN313-1',
        sectionNumber: 1,
        professor: 'Prof. Claudia Castro',
        totalQuota: 40,
        availableQuota: 0,
        isFull: true,
        waitlistCount: 4,
        schedule: [
          {
            day: 'Martes',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0,
            room: 'LAB-BD 103',
          },
          {
            day: 'Jueves',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0,
            room: 'LAB-BD 103',
          },
        ],
      },
    ],
  },
  {
    code: 'CIN 314',
    name: 'Fundamentos de Ingeniería de Software',
    credits: 4,
    semester: 5,
    prerequisites: ['PRO 121 (Taller de Desarrollo)'],
    prereqStatus: 'APPROVED',
    color: '#059669', // Emerald
    textColor: '#ffffff',
    badgeBg: '#d1fae5',
    sections: [
      {
        id: 'CIN314-1',
        sectionNumber: 1,
        professor: 'Prof. Patricia Valdés',
        totalQuota: 35,
        availableQuota: 18,
        isFull: false,
        schedule: [
          {
            day: 'Viernes',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0,
            room: 'AUD-ING 1',
          },
          {
            day: 'Viernes',
            startTime: '10:15',
            endTime: '11:45',
            blockIndex: 1,
            room: 'AUD-ING 1',
          },
        ],
      },
    ],
  },
  {
    code: 'FIS 311',
    name: 'Física Electromagnetismo',
    credits: 5,
    semester: 5,
    prerequisites: ['FIS 211 (Mecánica)', 'MAT 211 (Cálculo III)'],
    prereqStatus: 'APPROVED',
    color: '#0891b2', // Cyan
    textColor: '#ffffff',
    badgeBg: '#cffafe',
    sections: [
      {
        id: 'FIS311-1',
        sectionNumber: 1,
        professor: 'Prof. Manuel Herrera',
        totalQuota: 30,
        availableQuota: 10,
        isFull: false,
        schedule: [
          {
            day: 'Lunes',
            startTime: '08:30',
            endTime: '10:00',
            blockIndex: 0, // DIRECT CLASH WITH CIN 311 Sec. 1
            room: 'SALA F-02',
          },
        ],
      },
      {
        id: 'FIS311-2',
        sectionNumber: 2,
        professor: 'Prof. Karla Contreras',
        totalQuota: 35,
        availableQuota: 8,
        isFull: false,
        schedule: [
          {
            day: 'Martes',
            startTime: '14:00',
            endTime: '15:30',
            blockIndex: 3,
            room: 'LAB-FIS 2',
          },
          {
            day: 'Martes',
            startTime: '15:45',
            endTime: '17:15',
            blockIndex: 4,
            room: 'LAB-FIS 2',
          },
        ],
      },
    ],
  },
];
