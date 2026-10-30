import http from 'http';
import { Server } from 'socket.io';

const servidorHttp = http.createServer();
const PUERTO = process.env.PORT || 4002;

const socketServidor = new Server(servidorHttp, { cors: { origin: '*' } });

socketServidor.on('connection', (socket) => {
  console.log(`[Motor Fila UV] Conexión establecida con cliente: ${socket.id}`);
});

servidorHttp.listen(PUERTO, () => {
  console.log(`[Motor Fila UV] Microservicio de fila corriendo en puerto ${PUERTO}`);
});
