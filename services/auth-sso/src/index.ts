import express from 'express';
import cors from 'cors';

const app = express();
const PUERTO = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (_peticion, respuesta) => {
  respuesta.json({ servicio: 'autenticacion-sso-uv', estado: 'ACTIVO' });
});

app.listen(PUERTO, () => {
  console.log(`[Autenticación SSO UV] Microservicio corriendo en puerto ${PUERTO}`);
});
