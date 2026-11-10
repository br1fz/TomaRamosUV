import React, { useState } from 'react';
import { Lock, Mail, User, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const InicioSesionSSOWeb: React.FC = () => {
  const {
    iniciarSesionConCredenciales,
    estudiante,
    usuariosPrueba,
  } = usarTomaRamos();

  const [correo, establecerCorreo] = useState<string>(estudiante.correo || 'prueba1@estudiantes.uv.cl');
  const [rut, establecerRut] = useState<string>(estudiante.rut || '20.123.456-5');
  const [clave, establecerClave] = useState<string>('PruebaUV.2026!');
  const [estaCargando, establecerEstaCargando] = useState<boolean>(false);
  const [mensajeError, establecerMensajeError] = useState<string | null>(null);

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    establecerEstaCargando(true);
    establecerMensajeError(null);

    const resultado = await iniciarSesionConCredenciales(correo, clave);
    establecerEstaCargando(false);

    if (!resultado.exito) {
      establecerMensajeError(resultado.mensajeError || 'Credenciales inválidas');
    }
  };

  const seleccionarAlumnoPrueba = (usuarioId: string) => {
    const usuario = usuariosPrueba.find((u) => u.id === usuarioId);
    if (usuario) {
      establecerCorreo(usuario.correo);
      establecerRut(usuario.rut);
      establecerClave('PruebaUV.2026!');
      establecerMensajeError(null);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative">
      {/* Decoración de onda UV en el fondo */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
        <img src="/wave.svg" alt="" className="w-full object-cover" />
      </div>

      <div className="w-full max-w-xl z-10 animate-fadeIn">
        {/* Tarjeta Institucional de Login */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          {/* Barra superior azul UV */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#004A77]" />

          {/* Encabezado UV y Título */}
          <div className="text-center mb-6">
            <img
              src="/uv_azul.svg"
              alt="Universidad de Valparaíso"
              className="h-16 w-auto mx-auto mb-3"
            />
            <h1 className="text-xl sm:text-2xl font-black text-[#004A77] tracking-tight">
              Portal Institucional UV
            </h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Autenticación Federada Microsoft Azure AD • Toma de Ramos 2026
            </p>
          </div>

          {/* BANNER OBLIGATORIO DE CONTROL DE CONCURRENCIA */}
          <div className="mb-5 p-4 rounded-2xl border-2 border-[#F9AB00] bg-[#FEF7E0] text-amber-950 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wide text-amber-900 mb-1">
                  REGISTRO ESTRICTAMENTE ÚNICO POR ESTUDIANTE VERIFICADO
                </h4>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  El acceso a la toma de ramos y su turno en la fila virtual está asociado
                  exclusivamente a su RUN y correo institucional. Iniciar sesión desde múltiples
                  pestañas, ventanas de incógnito o dispositivos distintos{' '}
                  <strong className="font-bold underline">
                    transferirá automáticamente la sesión activa al último acceso
                  </strong>{' '}
                  sin adelantar su lugar en la fila.
                </p>
              </div>
            </div>
          </div>

          {/* Error de inicio de sesión */}
          {mensajeError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-300 text-red-800 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />
              <span>{mensajeError}</span>
            </div>
          )}

          {/* Selector Rápido de Usuarios Alpha Testing */}
          <div className="mb-5 p-3.5 bg-sky-50/80 border border-sky-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-[#004A77] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                Alpha Testing: 12 Usuarios de Prueba Habilitados
              </span>
              <span className="text-[10px] text-sky-800 font-semibold">Semestres 1 a 10</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
              {usuariosPrueba.map((u) => {
                const nick = u.correo.split('@')[0];
                const esActivo = correo === u.correo;
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => seleccionarAlumnoPrueba(u.id)}
                    className={`py-1.5 px-1 rounded-lg text-center text-[10px] font-bold transition-all border cursor-pointer ${
                      esActivo
                        ? 'bg-[#004A77] text-white border-[#004A77] shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100 hover:border-sky-300'
                    }`}
                    title={`${u.nombre} - Semestre ${u.semestreActual} (${u.rut})`}
                  >
                    <div>{nick}</div>
                    <div className={`text-[8.5px] font-medium ${esActivo ? 'text-sky-200' : 'text-slate-500'}`}>
                      Sem {u.semestreActual}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formulario de Autenticación */}
          <form onSubmit={manejarEnvio} className="space-y-4">
            {/* Campo Correo Institucional */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Institucional UV
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={correo}
                  onChange={(e) => establecerCorreo(e.target.value)}
                  placeholder="prueba1@estudiantes.uv.cl"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campo RUN */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                RUN Estudiante (Con Guión y Dígito Verificador)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => establecerRut(e.target.value)}
                  placeholder="20.123.456-5"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña Única UV / Microsoft 365 (Bcrypt Hashed)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={clave}
                  onChange={(e) => establecerClave(e.target.value)}
                  placeholder="PruebaUV.2026!"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Botón de Envío */}
            <button
              type="submit"
              disabled={estaCargando}
              className="w-full py-3.5 px-4 bg-[#004A77] hover:bg-[#003859] text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {estaCargando ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Validando encriptación bcrypt & emitiendo JWT...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a Sala de Espera Virtual</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sello de Acreditación */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center justify-center text-center">
            <img
              src="/uv_acreditacion_azul.svg"
              alt="Universidad Acreditada de Excelencia"
              className="h-10 w-auto opacity-85"
            />
            <p className="text-[10px] text-slate-400 mt-2">
              Universidad de Valparaíso • Institución de Educación Superior Pública y Estatal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
