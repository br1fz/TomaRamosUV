import React from 'react';
import { Clock } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

export const WebSidebar: React.FC = () => {
  const { student, totalCredits, queueMetrics, step } = useQueue();

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = queueMetrics.transactionSecondsRemaining < 120; // less than 2 min

  return (
    <aside className="w-full lg:w-80 flex-shrink-0 space-y-4">
      {/* Student Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 overflow-hidden relative">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#004A77] shadow-sm"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Conectado" />
          </div>

          <div>
            <h3 className="font-extrabold text-slate-900 text-sm leading-tight">
              {student.name}
            </h3>
            <p className="text-xs font-mono font-semibold text-slate-500 mt-0.5">
              RUN: {student.rut}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[11px] font-bold">
              {student.academicStatus}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
          <div>
            <span className="text-slate-400 font-medium block">Carrera:</span>
            <strong className="text-slate-800">{student.career}</strong>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Plan de Estudios:</span>
            <span className="text-slate-700">{student.curriculumPlan}</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Sede y Jornada:</span>
            <span className="text-slate-700">Casa Central • Diurno</span>
          </div>
          <div>
            <span className="text-slate-400 font-medium block">Prioridad de Inscripción:</span>
            <span className="text-blue-700 font-semibold">{student.priorityGroup}</span>
          </div>
        </div>
      </div>

      {/* Transactional Countdown Widget (when in ENROLLMENT step) */}
      {step === 'ENROLLMENT' && (
        <div
          className={`rounded-2xl border p-4 shadow-sm transition-all animate-fadeIn ${
            isLowTime
              ? 'bg-red-50 border-red-300 text-red-950 animate-pulse'
              : 'bg-emerald-50 border-emerald-200 text-emerald-950'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Clock className={`w-4 h-4 ${isLowTime ? 'text-red-600' : 'text-emerald-700'}`} />
              Ventana Protegida
            </span>
            <span className="text-[11px] font-semibold text-slate-500">Sesión Exclusiva</span>
          </div>

          <div className="flex items-baseline justify-between">
            <span className="text-xs text-slate-600">Tiempo restante:</span>
            <span
              className={`text-2xl font-black font-mono tracking-tight ${
                isLowTime ? 'text-red-700' : 'text-emerald-800'
              }`}
            >
              {formatCountdown(queueMetrics.transactionSecondsRemaining)}
            </span>
          </div>

          <p className="text-[11px] text-slate-500 mt-2 leading-tight">
            Tienes 10 minutos protegidos para seleccionar asignaturas y presionar{' '}
            <em>"Confirmar y Guardar"</em>.
          </p>
        </div>
      )}

      {/* Credit Meter Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">
            Créditos Seleccionados
          </span>
          <span className="text-xs font-bold text-[#004A77] bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
            {totalCredits} / 30 SCT
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-2">
          <div
            className={`h-full transition-all duration-300 ${
              totalCredits > 30
                ? 'bg-red-500'
                : totalCredits >= 20
                ? 'bg-emerald-500'
                : 'bg-[#004A77]'
            }`}
            style={{ width: `${Math.min(100, (totalCredits / 30) * 100)}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500">
          <span>0 SCT</span>
          <span>Recomendado: 22 SCT</span>
          <span>Máx: 30 SCT</span>
        </div>
      </div>

      {/* Quick Help & Guidelines */}
      <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
        <span className="font-bold text-slate-800 block text-xs uppercase tracking-wider">
          Instrucciones Clave:
        </span>
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-bold">•</span>
          <span>El sistema valida choques de horario de forma preventiva al instante.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-amber-600 font-bold">•</span>
          <span>Para ramos sin cupo puedes ingresar a la lista de espera automatizada.</span>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-emerald-600 font-bold">•</span>
          <span>La reserva de cupos se realiza de forma atómica al confirmar la carga.</span>
        </div>
      </div>
    </aside>
  );
};
