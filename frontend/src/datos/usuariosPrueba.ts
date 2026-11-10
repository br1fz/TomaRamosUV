import type { UsuarioPrueba } from '../tipos';

/**
 * Función para generar un avatar neutral en formato SVG Data-URI con las iniciales
 * del estudiante y colores institucionales UV.
 */
function generarAvatarSVG(iniciales: string, colorFondo: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
    <rect width="128" height="128" rx="64" fill="${colorFondo}"/>
    <text x="64" y="74" font-size="44" font-weight="bold" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" text-anchor="middle">${iniciales}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Hash bcrypt (10 rondas con sal) de la contraseña segura por defecto: "PruebaUV.2026!"
 * Generado con bcryptjs para almacenamiento seguro (sin contraseñas en texto plano).
 */
export const HASH_PASSWORD_POR_DEFECTO =
  '$2b$10$f0htJg3hg7O74CSTs9im..iYJBAY0N/eaezBfRKPuncEUgtTB.2j.';

export const PASSWORD_DEMO_REFERENCIA = 'PruebaUV.2026!';

/**
 * Dataset oficial de 12 usuarios de prueba para la fase de Alpha Testing de TomaRamosUV.
 * Cada usuario cuenta con RUN chileno matemáticamente verificado con Módulo 11,
 * nivel semestral representativo y credenciales criptográficamente resguardadas.
 */
export const USUARIOS_PRUEBA_ALPHA: UsuarioPrueba[] = [
  {
    id: 'usr_01',
    correo: 'prueba1@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 1 (Matías Sepúlveda Soto)',
    rut: '20.123.456-5',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 1,
    fotoPerfilUrl: generarAvatarSVG('MS', '#004A77'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_02',
    correo: 'prueba2@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 2 (Valentina Morales Castro)',
    rut: '20.234.567-0',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 2,
    fotoPerfilUrl: generarAvatarSVG('VM', '#0d6e7a'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_03',
    correo: 'prueba3@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 3 (Joaquín Silva Navarro)',
    rut: '20.345.678-6',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 3,
    fotoPerfilUrl: generarAvatarSVG('JS', '#0369a1'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 2 (Prioridad Regular - Rango 2)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_04',
    correo: 'prueba4@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 4 (Sofía Contreras Vera)',
    rut: '20.456.789-1',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 4,
    fotoPerfilUrl: generarAvatarSVG('SC', '#0f766e'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 2 (Prioridad Regular - Rango 2)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_05',
    correo: 'prueba5@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 5 (Benjamín Rojas Araya)',
    rut: '20.567.890-5',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 5,
    fotoPerfilUrl: generarAvatarSVG('BR', '#1d4ed8'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_06',
    correo: 'prueba6@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 6 (Isidora Fuentes Valenzuela)',
    rut: '20.678.901-8',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 6,
    fotoPerfilUrl: generarAvatarSVG('IF', '#4338ca'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_07',
    correo: 'prueba7@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 7 (Vicente Espinoza Riquelme)',
    rut: '20.789.012-K',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 7,
    fotoPerfilUrl: generarAvatarSVG('VE', '#6d28d9'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 2 (Prioridad Regular - Rango 2)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_08',
    correo: 'prueba8@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 8 (Camila Tapia Parra)',
    rut: '20.890.123-0',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 8,
    fotoPerfilUrl: generarAvatarSVG('CT', '#047857'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_09',
    correo: 'prueba9@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 9 (Tomás Carrasco Herrera)',
    rut: '20.901.234-0',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 9,
    fotoPerfilUrl: generarAvatarSVG('TC', '#b45309'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_10',
    correo: 'prueba10@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 10 (Florencia Muñoz Godoy)',
    rut: '21.012.345-8',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 10,
    fotoPerfilUrl: generarAvatarSVG('FM', '#be123c'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_11',
    correo: 'prueba11@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 11 (Lucas Alarcón Figueroa)',
    rut: '21.123.456-3',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 5,
    fotoPerfilUrl: generarAvatarSVG('LA', '#1e293b'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 3 (Prioridad Flexible - Rango 3)',
    rol: 'ESTUDIANTE',
  },
  {
    id: 'usr_12',
    correo: 'prueba12@estudiantes.uv.cl',
    passwordHash: HASH_PASSWORD_POR_DEFECTO,
    nombre: 'Estudiante Prueba 12 (Catalina Orellana Bravo)',
    rut: '21.234.567-9',
    carrera: 'Ingeniería Civil Informática',
    codigoCarrera: '19085 - Casa Central - Diurno',
    sedeCampus: 'Facultad de Ingeniería - Av. Gran Bretaña 1091, Playa Ancha',
    planCurricular: 'Malla 5125 / Plan Común UV',
    semestreActual: 5,
    fotoPerfilUrl: generarAvatarSVG('CO', '#0e7490'),
    estadoAcademico: 'REGULAR ACTIVO',
    grupoPrioridad: 'Grupo 1 (Prioridad Alta - Rango 1)',
    rol: 'ESTUDIANTE',
  },
];

/**
 * Función de búsqueda por correo o ID
 */
export function buscarUsuarioPrueba(identificador: string): UsuarioPrueba | undefined {
  const limpio = identificador.trim().toLowerCase();
  return USUARIOS_PRUEBA_ALPHA.find(
    (u) =>
      u.correo.toLowerCase() === limpio ||
      u.id.toLowerCase() === limpio ||
      u.correo.split('@')[0].toLowerCase() === limpio ||
      u.rut.replace(/\./g, '').replace(/-/g, '').toLowerCase() ===
        limpio.replace(/\./g, '').replace(/-/g, '')
  );
}
