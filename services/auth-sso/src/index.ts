import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ service: 'auth-sso', status: 'OK' });
});

app.listen(PORT, () => {
  console.log(`[Auth-SSO] Microservicio corriendo en puerto ${PORT}`);
});
