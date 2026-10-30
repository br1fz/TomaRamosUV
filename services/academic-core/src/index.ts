import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
}));
app.use(express.json());

// In-Memory fallback store if Redis/Postgres are not yet connected locally
interface StudentSession {
  rut: string;
  socketId: string;
  token: string;
  timestamp: number;
}
const activeSessions = new Map<string, StudentSession>();
const virtualQueue: { token: string; rut: string; joinedAt: number }[] = [];

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  console.log(`[WebSocket] Cliente conectado: ${socket.id}`);

  socket.on('JOIN_QUEUE', ({ rut, token }) => {
    // Single-Session Lock Check
    const existing = activeSessions.get(rut);
    if (existing && existing.socketId !== socket.id) {
      // Invalidate previous socket
      io.to(existing.socketId).emit('SESSION_TRANSFERRED', {
        message: 'Tu sesión se ha transferido a otro dispositivo o ventana.',
      });
    }

    activeSessions.set(rut, { rut, socketId: socket.id, token, timestamp: Date.now() });

    if (!virtualQueue.some((q) => q.token === token)) {
      virtualQueue.push({ token, rut, joinedAt: Date.now() });
    }

    const position = virtualQueue.findIndex((q) => q.token === token) + 1;
    socket.emit('QUEUE_UPDATE', {
      position,
      aheadCount: Math.max(0, position - 1),
      estimatedWaitSeconds: position * 4,
      progressPercentage: Math.min(100, Math.round(((18 - position) / 18) * 100)),
    });
  });

  socket.on('disconnect', () => {
    console.log(`[WebSocket] Cliente desconectado: ${socket.id}`);
  });
});

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({
    status: 'UP',
    service: 'UV Academic Core & Virtual Queue Engine',
    timestamp: new Date().toISOString(),
  });
});

// Single-Session Lock Login Endpoint
app.post('/api/auth/login', (req, res) => {
  const { rut, email } = req.body;
  if (!rut || !email) {
    return res.status(400).json({ error: 'RUT y correo requeridos.' });
  }

  // Generate turn token
  const token = 'tok_' + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Invalidate any old session
  const existing = activeSessions.get(rut);
  if (existing) {
    io.to(existing.socketId).emit('SESSION_TRANSFERRED', {
      message: 'Sesión transferida por nuevo inicio de sesión.',
    });
  }

  return res.json({
    token,
    student: {
      rut,
      email,
      name: 'Bruno Díaz Fernández',
      career: 'Ingeniería Civil Informática',
      careerCode: '19085',
      curriculumPlan: 'Malla 5125 / Plan Común UV',
      semester: 5,
    },
  });
});

// Atomic Enrollment Endpoint
app.post('/api/academic/enroll', (req, res) => {
  const { studentRut, selectedSections } = req.body;
  if (!studentRut || !Array.isArray(selectedSections)) {
    return res.status(400).json({ error: 'Datos de inscripción inválidos.' });
  }

  const verificationCode = `UV-2026-ICI-5125-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  return res.json({
    success: true,
    verificationCode,
    message: 'Carga curricular registrada atómicamente.',
    timestamp: new Date().toISOString(),
  });
});

server.listen(PORT, () => {
  console.log(`[UV API] Servidor activo en puerto ${PORT}`);
});
