import http from 'http';
import { Server } from 'socket.io';

const server = http.createServer();
const PORT = process.env.PORT || 4002;

const io = new Server(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`[Queue Engine] Conexión establecida: ${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`[Queue Engine] Microservicio de fila corriendo en puerto ${PORT}`);
});
