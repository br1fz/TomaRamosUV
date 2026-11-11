import React from 'react';
import {
  FastForward,
  ShieldAlert,
  Volume2,
  RotateCcw,
  UserCheck,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const BarraControlDesarrollador: React.FC = () => {
  const {
    estudiante,
    usuariosPrueba,
    seleccionarUsuarioPruebaDirecto,
    pasoActual,
    adelantarFilaInstantaneamente,
    simularColisionConcurrencia,
    probarAlertaSonora,
    reiniciarSimulacion,
  } = usarTomaRamos();

  return (
    <aside
      aria-label="Simulador y Barra de Control de Entorno UV"
      className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Identidad del Proyecto */}
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-sky-400 uppercase tracking-wider">
            Toma de Ramos UV • Portal Web
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline ml-2">
            | Malla 5125
          </span>
        </div>

        {/* Controles de Simulación y Usuario Alpha */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Selector Rápido de Alumno Alpha Tester */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
            <select
              value={estudiante.correo}
              onChange={(e) => {
                const u = usuariosPrueba.find((user) => user.correo === e.target.value);
                if (u) seleccionarUsuarioPruebaDirecto(u);
              }}
              className="bg-transparent text-[11px] font-semibold text-slate-200 outline-none cursor-pointer"
              title="Cambiar entre los 12 usuarios de prueba Alpha"
            >
              {usuariosPrueba.map((u) => (
                <option key={u.id} value={u.correo} className="bg-slate-900 text-white">
                  {u.correo.split('@')[0]} (Sem. {u.semestreActual} - {u.nombre})
                </option>
              ))}
            </select>
          </div>

          {/* Acciones Rápidas de Simulación */}
          <div className="flex items-center gap-2">
            {pasoActual === 'FILA_VIRTUAL' && (
              <button
                onClick={adelantarFilaInstantaneamente}
                title="Acelera la cola para pasar al turno de inmediato"
                className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Adelantar Turno</span>
              </button>
            )}

            <button
              onClick={probarAlertaSonora}
              title="Probar sonido de alarma de turno disponible"
              className="px-2.5 py-1 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-700/50 rounded-md font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Sonido Alarma</span>
            </button>

            <button
              onClick={simularColisionConcurrencia}
              title="Simula que este alumno abrió sesión en otra pestaña o dispositivo"
              className="px-2.5 py-1 bg-red-950/40 text-red-300 hover:bg-red-950/70 border border-red-700/50 rounded-md font-bold flex items-center gap-1 transition-all cursor-pointer"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Simular Concurrencia</span>
            </button>

            <button
              onClick={reiniciarSimulacion}
              title="Reiniciar flujo al paso inicial de Login"
              className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-md font-semibold flex items-center gap-1 transition-all cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reiniciar</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
