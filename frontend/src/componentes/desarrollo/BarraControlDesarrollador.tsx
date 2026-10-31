import React from 'react';
import {
  Monitor,
  Smartphone,
  FastForward,
  ShieldAlert,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import type { PasoFlujoTomaRamos } from '../../tipos';

export const BarraControlDesarrollador: React.FC = () => {
  const {
    modoVisualizacion,
    establecerModoVisualizacion,
    pasoActual,
    establecerPasoActual,
    adelantarFilaInstantaneamente,
    simularColisionConcurrencia,
    probarAlertaSonora,
    reiniciarSimulacion,
  } = usarTomaRamos();

  const pasosWireflow: { clave: PasoFlujoTomaRamos; etiqueta: string }[] = [
    { clave: 'INICIO_PORTAL', etiqueta: '0. Login Portal UV' },
    { clave: 'PORTAL_ALUMNOS', etiqueta: '1. Portal Académico' },
    { clave: 'FILA_VIRTUAL', etiqueta: '2. Fila Virtual' },
    { clave: 'SELECCION_RAMOS', etiqueta: '3. Toma de Ramos' },
    { clave: 'HORARIO_ARMADO', etiqueta: '4. Horario Armado' },
    { clave: 'COMPROBANTE_OFICIAL', etiqueta: '5. Comprobante QR' },
  ];

  return (
    <aside
      aria-label="Simulador y Barra de Control de Entorno UV"
      className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Identidad del Proyecto y Selector de Dispositivo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">Wireflow UV • Malla 5125</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* Alternador de Modo de Visualización */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => establecerModoVisualizacion('ESCRITORIO_WEB')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                modoVisualizacion === 'ESCRITORIO_WEB'
                  ? 'bg-[#004A77] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Portal Web</span>
            </button>
            <button
              onClick={() => establecerModoVisualizacion('MOVIL_APPTUI')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                modoVisualizacion === 'MOVIL_APPTUI'
                  ? 'bg-[#31C4D7] text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APPTUI Móvil</span>
            </button>
          </div>
        </div>

        {/* Selector de Pasos del Wireflow */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 overflow-x-auto">
          {pasosWireflow.map((paso) => (
            <button
              key={paso.clave}
              onClick={() => establecerPasoActual(paso.clave)}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                pasoActual === paso.clave
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {paso.etiqueta}
            </button>
          ))}
        </div>

        {/* Acciones Rápidas de Simulación */}
        <div className="flex items-center gap-2">
          {pasoActual === 'FILA_VIRTUAL' && (
            <button
              onClick={adelantarFilaInstantaneamente}
              title="Acelera la cola para pasar al turno de inmediato"
              className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-md font-bold flex items-center gap-1 transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adelantar Turno</span>
            </button>
          )}

          <button
            onClick={probarAlertaSonora}
            title="Probar sonido festivo y amigable: '¡Uy! ¡Al fin me toca!'"
            className="px-2.5 py-1 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-700/50 rounded-md font-bold flex items-center gap-1.5 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sonido "¡Al fin me toca!"</span>
          </button>

          <button
            onClick={simularColisionConcurrencia}
            title="Simula que este alumno abrió sesión en otra pestaña o smartphone"
            className="px-2.5 py-1 bg-red-950/40 text-red-300 hover:bg-red-950/70 border border-red-700/50 rounded-md font-bold flex items-center gap-1 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Simular Concurrencia</span>
          </button>

          <button
            onClick={reiniciarSimulacion}
            title="Reiniciar todos los estados y cupos al inicio del flujo"
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-md transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
