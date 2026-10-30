import React from 'react';
import { Users, Clock, ShieldCheck, Wifi, FastForward } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';
import { AudioAlertToggle } from '../shared/AudioAlertToggle';

export const WebQueueWidget: React.FC = () => {
  const { queueMetrics, advanceQueueInstant, student } = useQueue();

  const formatWaitTime = (seconds: number) => {
    if (seconds <= 0) return 'Menos de 10 segundos';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    if (m === 0) return `${s} seg`;
    return `${m} min ${s > 0 ? `${s} seg` : ''}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      {/* Main Glassmorphic Queue Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Top ambient gradient */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#004A77] via-[#0284c7] to-[#31C4D7]" />

        {/* Header with Title and Connection Status */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Fila Virtual Activa • WebSocket Conectado
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Sala de Espera Inteligente UV
            </h2>
            <p className="text-xs text-slate-500">
              Estudiante: <strong>{student.name}</strong> • Token:{' '}
              <span className="font-mono">{queueMetrics.token}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={advanceQueueInstant}
              title="Acelera la cola para pasar directamente al turno (demostración)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#004A77] border border-sky-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <FastForward className="w-4 h-4 text-sky-600" />
              <span>Adelantar Turno (Demo)</span>
            </button>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
          {/* Position in Queue */}
          <div className="bg-gradient-to-br from-[#004A77] to-[#003352] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden text-center md:text-left">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Users className="w-28 h-28" />
            </div>
            <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
              Tu Puesto en la Fila
            </span>
            <div className="text-5xl font-black tracking-tight my-1 text-white flex items-baseline justify-center md:justify-start gap-1">
              <span>#{queueMetrics.position}</span>
            </div>
            <span className="text-[11px] text-sky-200/90 font-medium">
              Orden FIFO Estricto en Memoria
            </span>
          </div>

          {/* Ahead Count */}
          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-center md:text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Alumnos por Delante
              </span>
              <div className="text-4xl font-extrabold text-slate-800 my-1">
                {queueMetrics.aheadCount}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Tasa: ~15 alumnos / min</span>
            </div>
          </div>

          {/* Estimated Wait Time */}
          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-center md:text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tiempo Estimado
              </span>
              <div className="text-3xl font-extrabold text-[#004A77] my-1 font-mono">
                {formatWaitTime(queueMetrics.estimatedWaitSeconds)}
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Cálculo dinámico en vivo</span>
            </div>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Progreso hacia tu turno</span>
            <span className="font-bold text-[#004A77] font-mono">
              {queueMetrics.progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#004A77] via-[#0284c7] to-[#31C4D7] rounded-full transition-all duration-700 shadow-sm relative overflow-hidden"
              style={{ width: `${queueMetrics.progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Audio Alert Toggle */}
        <div className="mb-6">
          <AudioAlertToggle />
        </div>

        {/* Anti-Anxiety & Transparency Guarantees */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3 bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
            <Wifi className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block text-xs mb-0.5">
                Tolerancia al corte de red
              </strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Si experimentas una caída de señal móvil o cambio de Wi-Fi, tu lugar se conserva
                durante 120 segundos para reconexión automática.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block text-xs mb-0.5">Desincentivo al F5</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                No necesitas refrescar la página. El estado se sincroniza en tiempo real por
                WebSocket y tu token está protegido en tu navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
