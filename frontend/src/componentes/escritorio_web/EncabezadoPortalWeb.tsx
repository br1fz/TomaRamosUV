import React from 'react';
import { LogOut, Shield } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const EncabezadoPortalWeb: React.FC = () => {
  const { estudiante, cerrarSesion, pasoActual } = usarTomaRamos();

  return (
    <header className="bg-[#004A77] text-white shadow-md sticky top-0 z-40">
      {/* Barra Principal Superior */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Izquierda: Logotipo y Título */}
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center">
            <img src="/uv_azul.svg" alt="Universidad de Valparaíso" className="h-9 w-auto" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-wide">PORTAL UV</span>
              <span className="text-[11px] font-semibold bg-[#003352] px-2 py-0.5 rounded text-sky-200 uppercase tracking-wider">
                Académico
              </span>
            </div>
            <p className="text-xs text-sky-100/80 hidden sm:block">
              Sistema de Toma de Ramos & Fila Virtual Unificada
            </p>
          </div>
        </div>

        {/* Derecha: Perfil del Estudiante y Acciones */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2 text-xs text-sky-100">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>Sesión Segura Azure AD</span>
          </div>

          <div className="h-6 w-px bg-sky-800/60 hidden sm:block" />

          {/* Tarjeta de Identificación del Alumno */}
          <div className="flex items-center gap-2 bg-[#003859] px-3 py-1.5 rounded-full border border-sky-700/50">
            <img
              src={estudiante.fotoPerfilUrl}
              alt={estudiante.nombre}
              className="w-7 h-7 rounded-full object-cover border border-white/50"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left hidden sm:block">
              <span className="block text-xs font-bold leading-tight truncate max-w-[140px]">
                {estudiante.nombre}
              </span>
              <span className="block text-[10px] text-sky-200 font-mono leading-tight">
                {estudiante.rut}
              </span>
            </div>
          </div>

          {pasoActual !== 'INICIO_SESION_SSO' && (
            <button
              onClick={cerrarSesion}
              title="Cerrar Sesión Institucional"
              className="p-2 hover:bg-sky-800 rounded-lg text-sky-200 hover:text-white transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Barra de Migas de Pan (Breadcrumb) */}
      <div className="bg-[#003859] border-t border-sky-800/50 px-4 sm:px-6 py-2 text-xs text-sky-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span>Inicio</span>
            <span>/</span>
            <span>Pregrado</span>
            <span>/</span>
            <span className="text-white font-semibold">Toma de Ramos Primer Semestre 2026</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-sky-300">
            <span>Facultad de Ingeniería</span>
            <span>•</span>
            <span className="font-semibold text-white">Ing. Civil Informática (Malla 5125)</span>
          </div>
        </div>
      </div>
    </header>
  );
};
