import React from 'react';
import { AlertCircle, Clock, Calendar, Check } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

export const ConflictModal: React.FC = () => {
  const { activeConflict, clearConflict } = useQueue();

  if (!activeConflict) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-200">
        {/* Header */}
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3 text-white">
          <AlertCircle className="w-6 h-6 flex-shrink-0 animate-pulse" />
          <h3 className="font-bold text-lg">Tope Horario Preventivo Detectado</h3>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-sm text-slate-700 mb-4 leading-relaxed">
            El sistema de validación curricular ha detectado un cruce de horario directo que impide
            inscribir esta sección:
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Día: {activeConflict.day}</span>
              <span className="text-red-400">|</span>
              <Clock className="w-4 h-4 text-red-600" />
              <span>Bloque: {activeConflict.timeSlot} hrs</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-red-200">
              <div className="p-2.5 bg-white rounded-lg border border-red-100 shadow-sm">
                <span className="text-slate-400 font-medium block">Ya inscrita:</span>
                <span className="font-bold text-slate-800 block text-sm">
                  {activeConflict.conflictingSubject.code}
                </span>
                <span className="text-slate-600 truncate block">
                  {activeConflict.conflictingSubject.name}
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded text-[11px]">
                  Sec. {activeConflict.conflictingSection.sectionNumber}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-red-300 shadow-sm bg-red-50/50">
                <span className="text-red-600 font-medium block">Intento rechazado:</span>
                <span className="font-bold text-red-700 block text-sm">
                  {activeConflict.attemptedSubject.code}
                </span>
                <span className="text-slate-600 truncate block">
                  {activeConflict.attemptedSubject.name}
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 text-red-800 font-semibold rounded text-[11px]">
                  Sec. {activeConflict.attemptedSection.sectionNumber}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-6 flex items-start gap-2">
            <span className="text-emerald-600 font-bold">✓</span>
            <span>
              <strong>Acción preventiva:</strong> La segunda asignatura fue desmarcada
              automáticamente para resguardar la validez de tu inscripción. Por favor selecciona
              otra sección alternativa que no genere conflicto en tu horario semanal.
            </span>
          </div>

          {/* Action button */}
          <button
            onClick={clearConflict}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
          >
            <Check className="w-4 h-4" />
            Entendido, elegir otra sección
          </button>
        </div>
      </div>
    </div>
  );
};
