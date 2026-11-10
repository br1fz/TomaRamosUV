import React from 'react';
import {
  User,
  CreditCard,
  Briefcase,
  GraduationCap,
  ChevronRight,
  Info,
  HelpCircle,
  Shield,
  LogOut,
  X,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesPerfilApptuiMovil {
  alCerrar: () => void;
}

export const PerfilApptuiMovil: React.FC<PropiedadesPerfilApptuiMovil> = ({ alCerrar }) => {
  const { estudiante, cerrarSesion, establecerPasoActual } = usarTomaRamos();

  return (
    <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col p-4 space-y-4 animate-fadeIn select-none">
      {/* Encabezado Mi Perfil */}
      <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#2D323E]">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-white" />
          <h2 className="text-base font-bold text-white tracking-wide">Mi Perfil</h2>
        </div>
        <button
          onClick={alCerrar}
          className="p-1.5 text-slate-400 hover:text-white rounded-xl active:bg-[#20232A]"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tarjeta de Información del Estudiante (WhatsApp Image 2026-10-30 at 5.11.03 PM) */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-3xl p-4 shadow-xl flex items-start gap-4">
        {/* Foto del Estudiante */}
        <div className="w-20 h-24 rounded-2xl overflow-hidden border border-[#2D323E] flex-shrink-0 bg-slate-800">
          <img
            src={estudiante.fotoPerfilUrl}
            alt={estudiante.nombre}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/portal_alumnos_files/mis_datos.png';
            }}
          />
        </div>

        {/* Datos Académicos */}
        <div className="flex-1 space-y-1 text-xs">
          <h3 className="font-extrabold text-sm text-white leading-tight">
            {estudiante.nombre}
          </h3>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px] pt-1">
            <CreditCard className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="font-mono">{estudiante.rut}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <Briefcase className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span>Estudiante</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="text-emerald-400 font-semibold">{estudiante.estadoAcademico}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300 text-[11px]">
            <GraduationCap className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="leading-tight">{estudiante.carrera}</span>
          </div>
        </div>
      </div>

      {/* Banner Configura tu panel de favoritos */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#13262F] flex items-center justify-center text-lg">
            📚
          </div>
          <span className="text-xs font-bold text-white">
            Configura tu panel de favoritos.
          </span>
        </div>
        <button className="w-8 h-8 rounded-xl bg-[#13262F] text-[#31C4D7] flex items-center justify-center hover:bg-[#1a3845] transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Cuadrícula de Información / Versión / Ayuda */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="w-8 h-8 rounded-full bg-[#13262F] flex items-center justify-center mb-2">
            <Info className="w-4 h-4 text-[#31C4D7]" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-white block">Versión de APPTUI UV</span>
            <span className="text-[10px] text-slate-400">v5.1.1 Oficial</span>
          </div>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3.5 flex flex-col justify-between">
          <div className="w-8 h-8 rounded-full bg-[#13262F] flex items-center justify-center mb-2">
            <HelpCircle className="w-4 h-4 text-[#31C4D7]" />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-white block">¿Necesitas ayuda?</span>
            <span className="text-[10px] text-slate-400">Mesa Central UV</span>
          </div>
        </div>
      </div>

      {/* Políticas de Privacidad */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#13262F] flex items-center justify-center">
            <Shield className="w-4 h-4 text-[#31C4D7]" />
          </div>
          <span className="text-xs font-bold text-white">Políticas de Privacidad</span>
        </div>
        <button className="px-3 py-1 bg-[#13262F] text-[#31C4D7] text-[11px] font-bold rounded-lg border border-[#31C4D7]/30">
          IR
        </button>
      </div>

      {/* Sección Sistemas */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl overflow-hidden">
        <div className="p-3 bg-[#1a1d24] border-b border-[#2D323E] flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Sistemas Institucionales</span>
          <span className="text-[10px] font-bold text-[#31C4D7]">1 Activo</span>
        </div>
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xl">👨‍🎓</span>
            <div>
              <h4 className="text-xs font-bold text-white">Portal Académico De Alumnos</h4>
              <p className="text-[10px] text-slate-400">Acceso a notas y trámites</p>
            </div>
          </div>
          <button
            onClick={() => {
              alCerrar();
              establecerPasoActual('PORTAL_ALUMNOS');
            }}
            className="px-3 py-1 bg-[#13262F] text-[#31C4D7] text-[11px] font-bold rounded-lg border border-[#31C4D7]/30"
          >
            IR
          </button>
        </div>
      </div>

      {/* Botón Cerrar Sesión Oficial */}
      <div className="pt-2">
        <button
          onClick={() => {
            alCerrar();
            cerrarSesion();
          }}
          className="w-full py-3.5 bg-[#168a9a] hover:bg-[#1a9cac] text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};
