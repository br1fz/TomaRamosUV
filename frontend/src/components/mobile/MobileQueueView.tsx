import React from 'react';
import { FastForward, Wifi } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';
import { AudioAlertToggle } from '../shared/AudioAlertToggle';

export const MobileQueueView: React.FC = () => {
  const { queueMetrics, advanceQueueInstant } = useQueue();

  const formatWaitTime = (seconds: number) => {
    if (seconds <= 0) return '< 10 seg';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s}s`;
    return `${m}m ${s > 0 ? `${s}s` : ''}`;
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn text-slate-100">
      {/* Top Banner */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[#31C4D7]">
            <span className="w-2 h-2 rounded-full bg-[#31C4D7] animate-ping" />
            Fila Virtual Activa
          </span>
          <button
            onClick={advanceQueueInstant}
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 bg-[#13262F] text-[#31C4D7] border border-[#31C4D7]/30 rounded-lg active:scale-95"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Adelantar (Demo)</span>
          </button>
        </div>

        <h2 className="text-lg font-black text-white mt-1">Sala de Espera APPTUI</h2>
        <p className="text-[11px] text-slate-400">
          Turno de inscripción asignado por orden de llegada (FIFO).
        </p>
      </div>

      {/* Main Queue Dial Card */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-3xl p-6 text-center relative overflow-hidden shadow-xl">
        {/* Glow circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#31C4D7]/5 rounded-full blur-2xl pointer-events-none" />

        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
          Tu Puesto Actual
        </span>

        {/* Circular Display */}
        <div className="w-36 h-36 mx-auto rounded-full border-4 border-[#13262F] border-t-[#31C4D7] flex flex-col items-center justify-center shadow-lg my-2 relative">
          <span className="text-4xl font-black text-white font-mono tracking-tight">
            #{queueMetrics.position}
          </span>
          <span className="text-[10px] text-[#31C4D7] font-semibold uppercase mt-0.5">
            En Cola
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-[#2D323E] text-xs">
          <div className="p-2.5 bg-[#14151A] rounded-xl border border-[#2D323E]/80">
            <span className="text-[11px] text-slate-400 block font-medium">Por delante:</span>
            <strong className="text-lg text-white font-bold">{queueMetrics.aheadCount}</strong>
          </div>
          <div className="p-2.5 bg-[#14151A] rounded-xl border border-[#2D323E]/80">
            <span className="text-[11px] text-slate-400 block font-medium">Espera aprox:</span>
            <strong className="text-lg text-[#31C4D7] font-mono font-bold">
              {formatWaitTime(queueMetrics.estimatedWaitSeconds)}
            </strong>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mb-1">
            <span>Avance</span>
            <span className="text-[#31C4D7] font-mono">{queueMetrics.progressPercentage}%</span>
          </div>
          <div className="w-full bg-[#14151A] h-2.5 rounded-full overflow-hidden border border-[#2D323E]">
            <div
              className="h-full bg-[#31C4D7] rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${queueMetrics.progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Audio alert toggle in dark mode */}
      <AudioAlertToggle isDark />

      {/* Network & Reconnection guarantee */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-4 text-xs text-slate-300 space-y-2">
        <div className="flex items-center gap-2 font-bold text-white">
          <Wifi className="w-4 h-4 text-[#31C4D7]" />
          <span>Protección contra cortes de señal</span>
        </div>
        <p className="text-[11px] text-slate-400 leading-snug">
          Si sales momentáneamente de la app o cambia tu conexión a 4G/Wi-Fi, tu posición se guarda
          automáticamente durante 120 segundos.
        </p>
      </div>
    </div>
  );
};
