import React, { useState } from 'react';
import { Key, Wifi, Battery, Signal, Loader2, ArrowLeft, Globe, Lock } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

const IconoInstagram: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface PropiedadesLoginApptuiMovil {
  alIngresarExitoso?: () => void;
}

export const LoginApptuiMovil: React.FC<PropiedadesLoginApptuiMovil> = ({ alIngresarExitoso }) => {
  const { estudiante, iniciarSesion } = usarTomaRamos();
  const [cargando, setCargando] = useState(false);
  const [vistaSSO, setVistaSSO] = useState<'LOGIN' | 'TIPO_CUENTA' | 'FORM_PREGRADO'>('LOGIN');
  const [correoInput, setCorreoInput] = useState('bruno.diaz');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');

  const manejarIngresoDirecto = () => {
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      iniciarSesion(estudiante.correo, estudiante.rut);
      if (alIngresarExitoso) alIngresarExitoso();
    }, 700);
  };

  const manejarIngresoSSO = (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setTimeout(() => {
      setCargando(false);
      iniciarSesion(`${correoInput}@estudiantes.uv.cl`, estudiante.rut);
      if (alIngresarExitoso) alIngresarExitoso();
    }, 700);
  };

  // 1. Subflujo SSO Oficial (In-App Browser simulado según WhatsApp Image 2026-10-30 at 5.11.03 PM (3) y (4))
  if (vistaSSO === 'TIPO_CUENTA') {
    return (
      <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col justify-between animate-fadeIn text-xs">
        {/* Barra superior de navegador webview */}
        <div className="bg-[#0f1115] border-b border-[#2D323E] px-4 py-2 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <button onClick={() => setVistaSSO('LOGIN')} className="p-1 text-slate-300 hover:text-white">
              <ArrowLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-[11px] text-slate-300">sso.uv.cl</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400 text-[10px]">
            <Globe className="w-3.5 h-3.5 text-[#31C4D7]" />
            <span>SSL Seguro</span>
          </div>
        </div>

        {/* Encabezado Institucional UV */}
        <div className="bg-[#003853] p-3 text-center border-b border-[#00283c]">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/apptui_extracted/assets/images/logos/header_uv.png"
              alt="Universidad de Valparaíso"
              className="h-9 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left text-white text-[9px] leading-tight font-medium border-l border-white/30 pl-2">
              <p className="font-bold">Universidad de Valparaíso</p>
              <p className="text-[#31C4D7] font-semibold">ACREDITADA NIVEL DE EXCELENCIA</p>
              <p className="text-white/70 text-[8px]">Hasta marzo 2029 • CNA-Chile</p>
            </div>
          </div>
        </div>

        {/* Cuerpo selector tipo de cuenta */}
        <div className="p-5 flex-1 flex flex-col justify-center max-w-xs mx-auto w-full space-y-4">
          <h2 className="text-base font-bold text-center text-white mb-2">
            Selecciona tu tipo de cuenta
          </h2>

          <button
            onClick={() => setVistaSSO('FORM_PREGRADO')}
            className="w-full py-3.5 px-4 bg-[#0d6e7a] hover:bg-[#118b9b] text-white font-bold rounded-2xl flex items-center justify-center gap-3 shadow-md active:scale-95 transition-all text-xs"
          >
            <span className="text-base">🎓</span>
            <span>Estudiante Pregrado</span>
          </button>

          <button
            onClick={() => manejarIngresoDirecto()}
            className="w-full py-3 px-4 bg-[#144955] hover:bg-[#1c5d6c] text-white font-semibold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs"
          >
            <span className="text-base">💼</span>
            <span>Funcionario</span>
          </button>

          <button
            onClick={() => manejarIngresoDirecto()}
            className="w-full py-3 px-4 bg-[#144955] hover:bg-[#1c5d6c] text-white font-semibold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs"
          >
            <span className="text-base">🖥️</span>
            <span>Académico</span>
          </button>

          <button
            onClick={() => setVistaSSO('FORM_PREGRADO')}
            className="w-full py-3 px-4 bg-[#144955] hover:bg-[#1c5d6c] text-white font-semibold rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-xs"
          >
            <span className="text-base">🎓</span>
            <span>Estudiante Postgrado</span>
          </button>
        </div>

        {/* Pie CIDUV */}
        <div className="p-4 text-center border-t border-[#2D323E]/50">
          <img
            src="/apptui_extracted/assets/images/logos/ciduv.png"
            alt="CIDUV"
            className="h-7 w-auto mx-auto object-contain brightness-0 invert opacity-60"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>
      </div>
    );
  }

  if (vistaSSO === 'FORM_PREGRADO') {
    return (
      <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col justify-between animate-fadeIn text-xs">
        {/* Barra superior de navegador webview */}
        <div className="bg-[#0f1115] border-b border-[#2D323E] px-4 py-2 flex items-center justify-between text-slate-400">
          <button onClick={() => setVistaSSO('TIPO_CUENTA')} className="flex items-center gap-1.5 text-slate-300 hover:text-white text-[11px] font-semibold">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Volver</span>
          </button>
          <span className="font-mono text-[11px] text-slate-300">sso.uv.cl</span>
          <div className="w-6" />
        </div>

        {/* Encabezado UV */}
        <div className="bg-[#003853] p-3 text-center border-b border-[#00283c]">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/apptui_extracted/assets/images/logos/header_uv.png"
              alt="Universidad de Valparaíso"
              className="h-8 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left text-white text-[8px] leading-tight font-medium border-l border-white/30 pl-2">
              <p className="font-bold">Universidad de Valparaíso</p>
              <p className="text-[#31C4D7] font-semibold">ACREDITADA NIVEL DE EXCELENCIA</p>
              <p className="text-white/70">Hasta marzo 2029</p>
            </div>
          </div>
        </div>

        {/* Formulario SSO Estudiante Pregrado */}
        <div className="p-5 flex-1 flex flex-col justify-center max-w-xs mx-auto w-full">
          <h2 className="text-sm font-bold text-center text-white mb-5 leading-snug">
            Acceso para Estudiante Pregrado
          </h2>

          <form onSubmit={manejarIngresoSSO} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Cuenta institucional*
              </label>
              <div className="flex rounded-xl overflow-hidden border border-[#2D323E] focus-within:border-[#31C4D7]">
                <input
                  type="text"
                  value={correoInput}
                  onChange={(e) => setCorreoInput(e.target.value)}
                  className="bg-[#20232A] text-white px-3 py-2.5 text-xs flex-1 outline-none"
                  placeholder="nombre.apellido"
                />
                <span className="bg-[#002b40] text-slate-300 px-2.5 py-2.5 text-[10px] font-bold flex items-center border-l border-[#2D323E]">
                  @estudiantes.uv.cl
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-1">
                Contraseña cuenta Microsoft*
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full bg-[#20232A] text-white px-3 py-2.5 rounded-xl border border-[#2D323E] focus:border-[#31C4D7] outline-none text-xs"
                  placeholder="Contraseña"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            <div className="text-right">
              <a href="#olvido" onClick={(e) => e.preventDefault()} className="text-[10px] text-[#31C4D7] font-semibold hover:underline">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full py-3 bg-[#0d6e7a] hover:bg-[#118b9b] text-white font-black rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Validando credenciales...</span>
                </>
              ) : (
                <span>Acceder</span>
              )}
            </button>
          </form>
        </div>

        {/* Footer CIDUV */}
        <div className="p-4 text-center border-t border-[#2D323E]/50 flex items-center justify-between px-6">
          <img
            src="/apptui_extracted/assets/images/logos/ciduv.png"
            alt="CIDUV"
            className="h-6 w-auto object-contain brightness-0 invert opacity-60"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <span className="text-[10px] text-slate-400 font-mono">https://ciduv.uv.cl</span>
        </div>
      </div>
    );
  }

  // 2. Pantalla de Inicio Oficial APPTUI UV (100% fiel a WhatsApp Image 2026-10-30 at 5.11.03 PM (1))
  return (
    <div className="bg-[#14151A] text-white min-h-full flex flex-col justify-between p-4 relative animate-fadeIn select-none">
      {/* Barra de Estado del Smartphone */}
      <div className="flex items-center justify-between px-1 pt-1 pb-2 text-[11px] font-semibold text-slate-300">
        <span>5:09</span>
        <div className="flex items-center gap-2">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Encabezado Superior APPTUI UV */}
      <div className="text-center pt-1 pb-2">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-xl font-black tracking-wider text-white">APPTUI UV</span>
          <div className="w-7 h-7 rounded-md border border-white/20 p-0.5 flex items-center justify-center bg-white/5">
            <img
              src="/uv_azul.svg"
              alt="UV"
              className="w-full h-full object-contain invert brightness-0"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Bloque de Acreditación Institucional */}
        <div className="flex items-center justify-center gap-3 px-2 text-left">
          <div className="border-r border-slate-700 pr-3">
            <p className="text-[10px] text-slate-300 leading-tight">Universidad de Valparaíso</p>
            <p className="text-[10px] font-extrabold text-white tracking-wide">ACREDITADA</p>
            <p className="text-[10px] font-black text-white tracking-wide">NIVEL DE EXCELENCIA</p>
            <p className="text-[7.5px] text-slate-400 max-w-[190px] leading-tight mt-0.5">
              Gestión Institucional, Docencia de Pregrado Investigación, Vinculación con el Medio y Docencia de Postgrado
            </p>
            <p className="text-[8px] font-semibold text-slate-300 mt-0.5">Hasta marzo 2029</p>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            {/* Sello CNA-Chile */}
            <div className="font-black text-sm tracking-tighter text-white">
              <span className="text-white">M</span>
            </div>
            <span className="text-[7px] text-slate-400 font-semibold leading-tight">
              Comisión Nacional<br />de Acreditación<br />CNA-Chile
            </span>
          </div>
        </div>
      </div>

      {/* Título Iniciar Sesión */}
      <div className="text-center my-1">
        <h1 className="text-xl font-bold text-white tracking-tight">Iniciar Sesión</h1>
      </div>

      {/* Ilustración Animada Oficial (iniciarSesion.gif) */}
      <div className="flex items-center justify-center my-2">
        <div className="w-36 h-36 flex items-center justify-center relative">
          <img
            src="/apptui_extracted/assets/images/iniciarSesion.gif"
            alt="Iniciar Sesión UV"
            className="w-full h-full object-contain filter drop-shadow-lg"
            onError={(e) => {
              // Fallback si la imagen no carga
              (e.target as HTMLImageElement).src = '/portal_alumnos_files/iniciarSesion_fallback.png';
            }}
          />
        </div>
      </div>

      {/* Texto de Bienvenida */}
      <div className="text-center px-4 my-1">
        <p className="text-xs text-slate-300 leading-relaxed font-normal">
          Accede con tu cuenta para disfrutar de todos los servicios y beneficios que te ofrece la{' '}
          <strong className="text-white font-bold">Universidad de Valparaíso</strong>.
        </p>
      </div>

      {/* Botón Principal: Ingresar */}
      <div className="px-3 my-2">
        <button
          onClick={manejarIngresoDirecto}
          className="w-full py-3.5 bg-[#168a9a] hover:bg-[#1a9cac] text-white font-black rounded-2xl text-sm flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all tracking-wide"
        >
          <Key className="w-4 h-4 text-white rotate-45" />
          <span>Ingresar</span>
        </button>
      </div>

      {/* Enlaces de Ayuda y Soporte */}
      <div className="text-center space-y-2.5 my-2">
        <div>
          <button
            onClick={() => setVistaSSO('TIPO_CUENTA')}
            className="text-[11px] font-bold text-[#eb445a] hover:text-[#f87171] uppercase tracking-wide transition-colors"
          >
            ¿TIENES PROBLEMAS PARA INICIAR SESIÓN?
          </button>
        </div>

        <div>
          <a
            href="https://clave.uv.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-bold text-[#31C4D7] hover:underline uppercase tracking-wide"
          >
            ¿OLVIDASTE TU CONTRASEÑA?
          </a>
        </div>

        <div>
          <button
            onClick={() => setVistaSSO('TIPO_CUENTA')}
            className="text-[11px] font-bold text-[#31C4D7] hover:underline uppercase tracking-wide"
          >
            CONOCE TU APLICACIÓN
          </button>
        </div>
      </div>

      {/* Footer CIDUV e Instagram */}
      <div className="pt-2 pb-1 border-t border-[#2D323E]/50 flex items-center justify-between px-2">
        {/* Logo CIDUV Oficial */}
        <div className="flex items-center gap-2">
          <img
            src="/apptui_extracted/assets/images/logos/ciduv.png"
            alt="CIDUV Centro de Innovación Digital UV Chile"
            className="h-10 w-auto object-contain brightness-0 invert opacity-80"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        {/* Botón Instagram Oficial */}
        <a
          href="https://instagram.com/ciduv_oficial"
          target="_blank"
          rel="noopener noreferrer"
          className="w-10 h-10 rounded-xl bg-[#20232A] border border-[#2D323E] flex items-center justify-center text-slate-300 hover:text-white hover:border-[#31C4D7] transition-all"
          title="Instagram @ciduv_oficial"
        >
          <IconoInstagram className="w-5 h-5 text-slate-200" />
        </a>
      </div>

      {/* Modal / Toast Oficial de Carga "Iniciando sesión" (WhatsApp Image 2026-10-30 at 5.11.03 PM (2)) */}
      {cargando && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl px-6 py-5 shadow-2xl flex items-center gap-3.5 max-w-[240px] text-left">
            <Loader2 className="w-6 h-6 animate-spin text-[#31C4D7] flex-shrink-0" />
            <span className="text-xs font-bold text-white tracking-wide">
              Iniciando sesión
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
