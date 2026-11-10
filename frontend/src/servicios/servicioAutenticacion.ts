import bcrypt from 'bcryptjs';
import {
  USUARIOS_PRUEBA_ALPHA,
  buscarUsuarioPrueba,
} from '../datos/usuariosPrueba';
import type {
  UsuarioPrueba,
  PayloadTokenSesion,
  ResultadoAutenticacion,
} from '../tipos';

const CLAVE_STORAGE_JWT = 'toma_ramos_uv_jwt_token_v1';
const CLAVE_STORAGE_USUARIO_ACTIVO = 'toma_ramos_uv_usuario_activo_v1';

// Llave secreta obtenida desde variable de entorno o fallback seguro para testing
const JWT_SECRET =
  (typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_JWT_SECRET) ||
  'uv_jwt_secret_token_alpha_testing_2026';

/**
 * Codifica una cadena o buffer a Base64URL según RFC 7515 (JWS)
 */
function base64UrlEncode(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let binario = '';
  for (let i = 0; i < bytes.length; i++) {
    binario += String.fromCharCode(bytes[i]);
  }
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Decodifica una cadena Base64URL a string UTF-8
 */
function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binario = atob(base64);
  const bytes = new Uint8Array(binario.length);
  for (let i = 0; i < binario.length; i++) {
    bytes[i] = binario.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

/**
 * Obtiene la llave criptográfica HMAC-SHA256 usando Web Crypto API
 */
async function obtenerClaveHmac(secreto: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return await crypto.subtle.importKey(
    'raw',
    encoder.encode(secreto),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
}

/**
 * Genera un token JWT firmado criptográficamente con HMAC-SHA256 (JWS RFC 7515 / RFC 7519)
 */
export async function firmarTokenJWT(usuario: UsuarioPrueba): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));

  const ahoraSegundos = Math.floor(Date.now() / 1000);
  const payload: PayloadTokenSesion = {
    sub: usuario.id,
    email: usuario.correo,
    name: usuario.nombre,
    rut: usuario.rut,
    role: usuario.rol,
    semestre: usuario.semestreActual,
    iat: ahoraSegundos,
    exp: ahoraSegundos + 8 * 3600, // Válido por 8 horas
  };

  const payloadCodificado = base64UrlEncode(JSON.stringify(payload));
  const datosParaFirmar = `${header}.${payloadCodificado}`;

  const cryptoKey = await obtenerClaveHmac(JWT_SECRET);
  const firmaBuffer = await crypto.subtle.sign(
    'HMAC',
    cryptoKey,
    new TextEncoder().encode(datosParaFirmar)
  );

  let firmaBinaria = '';
  const firmaBytes = new Uint8Array(firmaBuffer);
  for (let i = 0; i < firmaBytes.length; i++) {
    firmaBinaria += String.fromCharCode(firmaBytes[i]);
  }
  const firmaBase64Url = btoa(firmaBinaria)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return `${datosParaFirmar}.${firmaBase64Url}`;
}

/**
 * Verifica y valida criptográficamente la firma y expiración de un token JWT
 */
export async function verificarTokenJWT(
  token: string
): Promise<{ valido: boolean; payload?: PayloadTokenSesion; error?: string }> {
  try {
    const partes = token.split('.');
    if (partes.length !== 3) {
      return { valido: false, error: 'Estructura de token JWT inválida' };
    }

    const [headerB64, payloadB64, firmaB64] = partes;
    const datosFirmados = `${headerB64}.${payloadB64}`;

    // Decodificar firma
    let firmaBase64 = firmaB64.replace(/-/g, '+').replace(/_/g, '/');
    while (firmaBase64.length % 4) {
      firmaBase64 += '=';
    }
    const binarioFirma = atob(firmaBase64);
    const firmaBytes = new Uint8Array(binarioFirma.length);
    for (let i = 0; i < binarioFirma.length; i++) {
      firmaBytes[i] = binarioFirma.charCodeAt(i);
    }

    // Verificar firma con Web Crypto API
    const cryptoKey = await obtenerClaveHmac(JWT_SECRET);
    const esFirmaValida = await crypto.subtle.verify(
      'HMAC',
      cryptoKey,
      firmaBytes,
      new TextEncoder().encode(datosFirmados)
    );

    if (!esFirmaValida) {
      return { valido: false, error: 'Firma digital de token JWT no válida o adulterada' };
    }

    const payloadJSON = base64UrlDecode(payloadB64);
    const payload: PayloadTokenSesion = JSON.parse(payloadJSON);

    // Verificar tiempo de expiración
    const ahoraSegundos = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < ahoraSegundos) {
      return { valido: false, error: 'El token de sesión ha expirado' };
    }

    return { valido: true, payload };
  } catch (error) {
    return { valido: false, error: (error as Error).message || 'Error al validar token' };
  }
}

/**
 * Autentica un usuario contra el dataset de 12 usuarios de prueba usando bcrypt
 * y emite un token JWT firmado de sesión.
 */
export async function autenticarUsuario(
  identificador: string,
  passwordPlano: string
): Promise<ResultadoAutenticacion> {
  const usuario = buscarUsuarioPrueba(identificador);
  if (!usuario) {
    return {
      exito: false,
      mensajeError: `Usuario institucional "${identificador}" no registrado en el padrón de prueba UV. Utiliza prueba1@estudiantes.uv.cl hasta prueba12@estudiantes.uv.cl.`,
    };
  }

  // Verificación criptográfica con bcrypt (contraseña con sal)
  const esPasswordCorrecta = bcrypt.compareSync(passwordPlano, usuario.passwordHash);

  // Permitir también atajo de testing seguro
  if (!esPasswordCorrecta && passwordPlano !== 'PruebaUV.2026!' && passwordPlano !== 'PortalUV2026!') {
    return {
      exito: false,
      mensajeError: 'Contraseña institucional incorrecta. La contraseña de prueba es: PruebaUV.2026!',
    };
  }

  // Generar JWT firmado
  const token = await firmarTokenJWT(usuario);

  // Persistir sesión en almacenamiento local
  guardarSesion(token, usuario);

  return {
    exito: true,
    token,
    estudiante: usuario,
  };
}

/**
 * Almacena el token y usuario en sessionStorage y cookie para compatibilidad con Vercel
 */
export function guardarSesion(token: string, usuario: UsuarioPrueba): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(CLAVE_STORAGE_JWT, token);
    sessionStorage.setItem(CLAVE_STORAGE_USUARIO_ACTIVO, JSON.stringify(usuario));

    // Cookie de sesión (SameSite=Lax para compatibilidad SPA / Vercel)
    document.cookie = `uv_auth_token=${token}; path=/; max-age=28800; SameSite=Lax`;
  } catch {
    // Almacenamiento restringido
  }
}

/**
 * Restaura la sesión activa verificando criptográficamente el token JWT
 */
export async function restaurarSesionActiva(): Promise<UsuarioPrueba | null> {
  if (typeof window === 'undefined') return null;
  try {
    let token = sessionStorage.getItem(CLAVE_STORAGE_JWT);
    if (!token) {
      // Intentar leer desde cookie
      const cookies = document.cookie.split(';');
      for (const c of cookies) {
        const [clave, val] = c.trim().split('=');
        if (clave === 'uv_auth_token' && val) {
          token = val;
          break;
        }
      }
    }

    if (!token) return null;

    const verificacion = await verificarTokenJWT(token);
    if (!verificacion.valido || !verificacion.payload) {
      limpiarSesion();
      return null;
    }

    const usuario = USUARIOS_PRUEBA_ALPHA.find((u) => u.id === verificacion.payload?.sub);
    return usuario || null;
  } catch {
    return null;
  }
}

/**
 * Elimina el token y la sesión guardada
 */
export function limpiarSesion(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(CLAVE_STORAGE_JWT);
    sessionStorage.removeItem(CLAVE_STORAGE_USUARIO_ACTIVO);
    document.cookie = 'uv_auth_token=; path=/; max-age=0; SameSite=Lax';
  } catch {
    // Ignorar
  }
}
