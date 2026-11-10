import type { Estudiante } from './tomaRamos';

export interface UsuarioPrueba extends Estudiante {
  id: string;
  passwordHash: string;
  rol: 'ESTUDIANTE';
}

export interface PayloadTokenSesion {
  sub: string;
  email: string;
  name: string;
  rut: string;
  role: string;
  semestre: number;
  iat: number;
  exp: number;
}

export interface ResultadoAutenticacion {
  exito: boolean;
  token?: string;
  estudiante?: Estudiante;
  mensajeError?: string;
}

