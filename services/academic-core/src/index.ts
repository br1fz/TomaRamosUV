import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const servidorHttp = http.createServer(app);
const PUERTO = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());

// Estructura en memoria para respaldo y simulación local
interface SesionEstudiante {
  rut: string;
  identificadorSocket: string;
  tokenAcceso: string;
  marcaDeTiempo: number;
}
const sesionesActivas = new Map<string, SesionEstudiante>();
const filaVirtual: { tokenAcceso: string; rut: string; fechaIngreso: number }[] = [];

// Configuración de WebSocket Socket.IO
const socketServidor = new Server(servidorHttp, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

socketServidor.on('connection', (socket) => {
  console.log(`[WebSocket UV] Cliente conectado: ${socket.id}`);

  // Evento cuando el estudiante se une a la fila virtual
  socket.on('UNIRSE_A_FILA', ({ rut, tokenAcceso }) => {
    // Verificación de Bloqueo de Sesión Única (Single-Session Lock)
    const sesionPrevia = sesionesActivas.get(rut);
    if (sesionPrevia && sesionPrevia.identificadorSocket !== socket.id) {
      // Notificar e invalidar el socket previo
      socketServidor.to(sesionPrevia.identificadorSocket).emit('SESION_TRANSFERIDA', {
        mensaje: 'Tu sesión ha sido transferida a otro dispositivo o ventana.',
      });
    }

    sesionesActivas.set(rut, {
      rut,
      identificadorSocket: socket.id,
      tokenAcceso,
      marcaDeTiempo: Date.now(),
    });

    if (!filaVirtual.some((item) => item.tokenAcceso === tokenAcceso)) {
      filaVirtual.push({ tokenAcceso, rut, fechaIngreso: Date.now() });
    }

    const posicionEnFila = filaVirtual.findIndex((item) => item.tokenAcceso === tokenAcceso) + 1;
    socket.emit('ACTUALIZACION_FILA', {
      posicionEnFila,
      alumnosPorDelante: Math.max(0, posicionEnFila - 1),
      tiempoEstimadoEsperaSegundos: posicionEnFila * 4,
      porcentajeAvance: Math.min(100, Math.round(((18 - posicionEnFila) / 18) * 100)),
    });
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket UV] Cliente desconectado: ${socket.id}`);
  });
});

// Endpoint de verificación de salud del servicio
app.get('/health', (_peticion, respuesta) => {
  respuesta.json({
    estado: 'ACTIVO',
    servicio: 'Núcleo Académico y Motor de Fila Virtual UV',
    marcaDeTiempo: new Date().toISOString(),
  });
});

// Endpoint de Inicio de Sesión Institucional con Bloqueo de Sesión Única
app.post('/api/auth/login', (peticion, respuesta) => {
  const { rut, correo } = peticion.body;
  if (!rut || !correo) {
    return respuesta.status(400).json({ error: 'RUN y correo institucional requeridos.' });
  }

  // Generar token único de turno
  const tokenAcceso = 'TOK_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Invalidar cualquier sesión activa previa
  const sesionPrevia = sesionesActivas.get(rut);
  if (sesionPrevia) {
    socketServidor.to(sesionPrevia.identificadorSocket).emit('SESION_TRANSFERIDA', {
      mensaje: 'Sesión transferida por nuevo inicio de sesión institucional.',
    });
  }

  return respuesta.json({
    tokenAcceso,
    estudiante: {
      rut,
      correo,
      nombre: 'Estudiante de Prueba UV',
      carrera: 'Ingeniería Civil Informática',
      codigoCarrera: '19085',
      planCurricular: 'Malla 5125 / Plan Común UV',
      semestreActual: 5,
    },
  });
});

// Endpoint de Inscripción Curricular Atómica
app.post('/api/academico/inscribir', (peticion, respuesta) => {
  const { rutEstudiante, seccionesSeleccionadas } = peticion.body;
  if (!rutEstudiante || !Array.isArray(seccionesSeleccionadas)) {
    return respuesta.status(400).json({ error: 'Datos de inscripción curricular inválidos.' });
  }

  const codigoVerificacion = `UV-2026-ICI-5125-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  return respuesta.json({
    exito: true,
    codigoVerificacion,
    mensaje: 'Carga curricular registrada atómicamente en la base de datos UV.',
    marcaDeTiempo: new Date().toISOString(),
  });
});

servidorHttp.listen(PUERTO, () => {
  console.log(`[API UV] Servidor Académico activo en puerto ${PUERTO}`);
});
