import React from 'react';
import {
  Monitor,
  Smartphone,
  FastForward,
  ShieldAlert,
  Volume2,
  RotateCcw,
} from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';
import type { AppStep } from '../../types';

export const DevControlBar: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    step,
    setStep,
    advanceQueueInstant,
    simulateConcurrencyClash,
    testAudioAlert,
    resetSimulation,
  } = useQueue();

  const steps: { key: AppStep; label: string }[] = [
    { key: 'HOME', label: '0. Inicio Portal/App' },
    { key: 'LOGIN', label: '1. Login SSO' },
    { key: 'QUEUE', label: '2. Fila Virtual' },
    { key: 'ENROLLMENT', label: '3. Toma de Ramos' },
    { key: 'SCHEDULE_VIEW', label: '4. Horario Armado' },
    { key: 'VOUCHER', label: '5. Comprobante QR' },
  ];

  return (
    <aside aria-label="Simulador y Control de Entorno UV" className="bg-slate-900 text-white border-b border-slate-800 text-xs py-2 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Project identity & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-bold text-sky-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="uppercase tracking-wider">Wireflow UV • Malla 5125</span>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setViewMode('DESKTOP')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'DESKTOP'
                  ? 'bg-[#004A77] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Portal Web</span>
            </button>
            <button
              onClick={() => setViewMode('MOBILE')}
              className={`px-2.5 py-1 rounded-md font-semibold flex items-center gap-1.5 transition-all ${
                viewMode === 'MOBILE'
                  ? 'bg-[#31C4D7] text-slate-900 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>APPTUI Móvil</span>
            </button>
          </div>
        </div>

        {/* Center: Stage / Step Switcher */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700 overflow-x-auto">
          {steps.map((s) => (
            <button
              key={s.key}
              onClick={() => setStep(s.key)}
              className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-all ${
                step === s.key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Right: Quick Simulation Triggers */}
        <div className="flex items-center gap-2">
          {step === 'QUEUE' && (
            <button
              onClick={advanceQueueInstant}
              title="Acelera la cola para pasar al turno de inmediato"
              className="px-2.5 py-1 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 rounded-md font-bold flex items-center gap-1 transition-all"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Adelantar Turno</span>
            </button>
          )}

          <button
            onClick={testAudioAlert}
            title="Probar sonido festivo y amigable: '¡Uy! ¡Al fin me toca!'"
            className="px-2.5 py-1 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950/70 border border-emerald-700/50 rounded-md font-bold flex items-center gap-1.5 transition-all"
          >
            <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Sonido "¡Al fin me toca!"</span>
          </button>

          <button
            onClick={simulateConcurrencyClash}
            title="Simula que este alumno abrió sesión en otra pestaña o smartphone"
            className="px-2.5 py-1 bg-red-950/40 text-red-300 hover:bg-red-950/70 border border-red-700/50 rounded-md font-bold flex items-center gap-1 transition-all"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Simular Concurrencia</span>
          </button>

          <button
            onClick={resetSimulation}
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
