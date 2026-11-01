import React from 'react';
import { AlertCircle, Clock, Calendar, Check, Sparkles, CheckCircle2 } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { detectarTopeHorario } from '../../utilidades/detectorTopesHorarios';

export const ModalTopeHorario: React.FC = () => {
  const { conflictoActivo, descartarConflicto, seleccionarSeccion, asignaturasInscritas } = usarTomaRamos();

  if (!conflictoActivo) return null;

  // Buscar si la asignatura intentada tiene otra sección sin colisión y con cupos disponibles
  const seccionAlternativa = conflictoActivo.asignaturaIntentada.secciones.find(
    (sec) =>
      sec.id !== conflictoActivo.seccionIntentada.id &&
      sec.cuposDisponibles > 0 &&
      !detectarTopeHorario(conflictoActivo.asignaturaIntentada, sec, asignaturasInscritas)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-red-200">
        {/* Encabezado */}
        <div className="bg-red-600 px-6 py-4 flex items-center gap-3 text-white">
          <AlertCircle className="w-6 h-6 flex-shrink-0 animate-pulse" />
          <h3 className="font-bold text-lg">Tope Horario Preventivo Detectado</h3>
        </div>

        {/* Contenido Explicativo */}
        <div className="p-6">
          <p className="text-sm text-slate-700 mb-4 leading-relaxed">
            El sistema de validación curricular ha detectado un cruce de horario directo que impide
            inscribir esta sección:
          </p>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 space-y-3">
            <div className="flex items-center gap-2 text-red-900 font-semibold text-sm">
              <Calendar className="w-4 h-4 text-red-600" />
              <span>Día: {conflictoActivo.dia}</span>
              <span className="text-red-400">|</span>
              <Clock className="w-4 h-4 text-red-600" />
              <span>Bloque: {conflictoActivo.rangoHorario} hrs</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-red-200">
              <div className="p-2.5 bg-white rounded-lg border border-red-100 shadow-sm">
                <span className="text-slate-400 font-medium block">Ya inscrita:</span>
                <span className="font-bold text-slate-800 block text-sm">
                  {conflictoActivo.asignaturaEnConflicto.codigo}
                </span>
                <span className="text-slate-600 truncate block">
                  {conflictoActivo.asignaturaEnConflicto.nombre}
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-blue-100 text-blue-800 font-semibold rounded text-[11px]">
                  Sec. {conflictoActivo.seccionEnConflicto.numeroSeccion}
                </span>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-red-300 shadow-sm bg-red-50/50">
                <span className="text-red-600 font-medium block">Intento rechazado:</span>
                <span className="font-bold text-red-700 block text-sm">
                  {conflictoActivo.asignaturaIntentada.codigo}
                </span>
                <span className="text-slate-600 truncate block">
                  {conflictoActivo.asignaturaIntentada.nombre}
                </span>
                <span className="inline-block mt-1 px-1.5 py-0.5 bg-red-100 text-red-800 font-semibold rounded text-[11px]">
                  Sec. {conflictoActivo.seccionIntentada.numeroSeccion}
                </span>
              </div>
            </div>
          </div>

          {/* Sugerencia Inteligente de Sección Alternativa (Smart Resolution) */}
          {seccionAlternativa ? (
            <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 mb-4 shadow-sm animate-fadeIn">
              <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
                <span>Alternativa Inteligente UV Disponible</span>
              </div>
              <p className="text-xs text-slate-700 leading-snug mb-3">
                La <strong>Sección {seccionAlternativa.numeroSeccion}</strong> ({seccionAlternativa.profesor}) cuenta con <strong>{seccionAlternativa.cuposDisponibles} cupos libres</strong> y calza perfectamente en tu horario sin provocar choques.
              </p>
              <button
                onClick={() => {
                  seleccionarSeccion(conflictoActivo.asignaturaIntentada, seccionAlternativa);
                  descartarConflicto();
                }}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Inscribir Sección {seccionAlternativa.numeroSeccion} con 1 Clic</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-600 mb-6 flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span>
                <strong>Acción preventiva:</strong> La segunda asignatura fue desmarcada
                automáticamente para resguardar la validez de tu inscripción. Por favor selecciona
                otra sección alternativa que no genere conflicto en tu horario semanal.
              </span>
            </div>
          )}

          {/* Botón de Acción Principal */}
          <button
            onClick={descartarConflicto}
            className={`w-full py-3 px-4 font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
              seccionAlternativa
                ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{seccionAlternativa ? 'Descartar y revisar manualmente' : 'Entendido, elegir otra sección'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
