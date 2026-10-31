import React from 'react';
import {
  Lightbulb,
  RefreshCw,
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Flame,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const InicioApptuiMovil: React.FC = () => {
  const {
    establecerPasoActual,
    entrarAFilaVirtual,
    estaInscripcionCompletada,
    asignaturasInscritas,
    totalCreditosSCT,
  } = usarTomaRamos();

  return (
    <div className="p-4 space-y-4 animate-fadeIn text-slate-100">
      {/* Píldoras de acción rápida */}
      <div className="flex items-center justify-between text-xs">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#13262F] text-[#31C4D7] border border-[#31C4D7]/30 rounded-xl font-bold">
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Últimas novedades</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#14151A] text-[#31C4D7] border border-[#2D323E] rounded-xl font-semibold">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Banner Destacado: Toma de Ramos 2026-1 */}
      {estaInscripcionCompletada ? (
        <div className="bg-[#13262F] border border-[#31C4D7] rounded-3xl p-5 shadow-lg relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle2 className="w-4 h-4 text-[#31C4D7]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#31C4D7]">
              Carga Curricular 2026-1 Confirmada
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white">
            Horario Semanal Estructurado
          </h3>
          <p className="text-xs text-slate-300 mt-1 mb-4 leading-snug">
            Has inscrito {asignaturasInscritas.length} asignaturas ({totalCreditosSCT} créditos SCT).
            Tus cupos se encuentran bloqueados atómicamente.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => establecerPasoActual('HORARIO_ARMADO')}
              className="py-2.5 px-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-900 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Horario</span>
            </button>
            <button
              onClick={() => establecerPasoActual('COMPROBANTE_OFICIAL')}
              className="py-2.5 px-3 bg-[#20232A] text-white border border-[#2D323E] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <span>Comprobante QR</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#20232A] to-[#14151A] border-2 border-[#31C4D7] rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#13262F] text-[#31C4D7] rounded-full text-[10px] font-black uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-[#31C4D7]" />
              Proceso Oficial 2026-1
            </span>
            <span className="text-[10px] font-bold text-amber-400">Grupo 1 Habilitado</span>
          </div>

          <h3 className="text-lg font-black text-white leading-tight">
            Toma de Ramos Ing. Civil Informática
          </h3>
          <p className="text-xs text-slate-300 mt-1 mb-4 leading-snug">
            Accede a la sala de espera virtual inteligente con prioridad garantizada y validación preventiva de choques de horario.
          </p>

          <button
            onClick={() => entrarAFilaVirtual()}
            className="w-full py-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span>Ingresar a Fila Virtual</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banner Santander Campus Digital (Auténtico de APPTUI UV) */}
      <div className="bg-[#B91C1C] rounded-2xl p-4 text-white relative overflow-hidden shadow-md flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-100">
            <Flame className="w-4 h-4 text-white" />
            <span>Beneficios Santander</span>
          </div>
          <h4 className="text-sm font-extrabold text-white">Campus Digital UV</h4>
          <p className="text-[11px] text-rose-100 leading-tight">
            Descuentos exclusivos y beneficios para estudiantes.
          </p>
        </div>
        <button className="px-3 py-1.5 bg-white text-[#B91C1C] font-extrabold text-xs rounded-xl flex-shrink-0">
          Ver más
        </button>
      </div>

      {/* Botones de Acción: Aula Virtual & Acceso UV */}
      <div className="grid grid-cols-2 gap-3">
        <button className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3.5 text-left transition-all">
          <BookOpen className="w-5 h-5 text-[#31C4D7] mb-2" />
          <h5 className="font-extrabold text-xs text-white">Aula Virtual</h5>
          <span className="text-[10px] text-slate-400">Plataforma docente</span>
        </button>

        <button className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3.5 text-left transition-all">
          <CreditCard className="w-5 h-5 text-[#31C4D7] mb-2" />
          <h5 className="font-extrabold text-xs text-white">Acceso UV</h5>
          <span className="text-[10px] text-slate-400">Credencial TUI</span>
        </button>
      </div>

      {/* Cuadrícula de Módulos Frecuentes */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs">
        <div
          onClick={() => estaInscripcionCompletada && establecerPasoActual('HORARIO_ARMADO')}
          className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-all"
        >
          <BookOpen className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[10px] font-semibold text-slate-300">Asignaturas</span>
        </div>

        <div
          onClick={() => estaInscripcionCompletada && establecerPasoActual('HORARIO_ARMADO')}
          className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-all"
        >
          <Calendar className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[10px] font-semibold text-slate-300">Horario</span>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-all">
          <Calendar className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[10px] font-semibold text-slate-300">Calendario</span>
        </div>

        <div
          onClick={() => estaInscripcionCompletada && establecerPasoActual('COMPROBANTE_OFICIAL')}
          className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer hover:border-slate-500 transition-all"
        >
          <Award className="w-5 h-5 text-slate-300 mb-1" />
          <span className="text-[10px] font-semibold text-slate-300">Certificados</span>
        </div>
      </div>
    </div>
  );
};
