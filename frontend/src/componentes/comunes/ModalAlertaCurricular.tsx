import React from 'react';
import { AlertTriangle, BookOpen, Clock, X, RotateCcw, ArrowRight } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const ModalAlertaCurricular: React.FC = () => {
  const { alertaCurricular, descartarAlertaCurricular, entrarAFilaVirtual, establecerPasoActual } =
    usarTomaRamos();

  if (!alertaCurricular) return null;

  const esExpirada = alertaCurricular.tipo === 'SESION_EXPIRADA';
  const esLimiteCreditos = alertaCurricular.tipo === 'LIMITE_CREDITOS';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-alerta-curricular"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border ${
          esExpirada
            ? 'border-red-300 ring-2 ring-red-400/30'
            : esLimiteCreditos
            ? 'border-amber-300 ring-2 ring-amber-400/30'
            : 'border-slate-200'
        } animate-scaleUp`}
      >
        {/* Encabezado con Icono */}
        <div
          className={`p-5 flex items-center justify-between text-white ${
            esExpirada
              ? 'bg-gradient-to-r from-red-600 to-rose-700'
              : esLimiteCreditos
              ? 'bg-gradient-to-r from-amber-600 to-orange-600'
              : 'bg-gradient-to-r from-[#004A77] to-sky-700'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-xs">
              {esExpirada ? (
                <Clock className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '8s' }} />
              ) : esLimiteCreditos ? (
                <AlertTriangle className="w-5 h-5 text-white" />
              ) : (
                <BookOpen className="w-5 h-5 text-white" />
              )}
            </div>
            <div>
              <span className="text-[10px] uppercase font-black tracking-widest text-white/80 block">
                {esExpirada ? 'Aviso de Transacción' : 'Validación Curricular UV'}
              </span>
              <h3 id="titulo-alerta-curricular" className="font-extrabold text-base text-white leading-tight">
                {alertaCurricular.titulo}
              </h3>
            </div>
          </div>

          <button
            onClick={descartarAlertaCurricular}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            {alertaCurricular.mensaje}
          </p>

          {esLimiteCreditos && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">💡</span>
              <p>
                <strong>Reglamento Académico de Pregrado:</strong> El tope semestral regular está fijado en <strong>30 SCT</strong> para garantizar el rendimiento óptimo del estudiante. Si necesitas sobrecarga, debes solicitar una resolución a tu Jefatura de Carrera.
              </p>
            </div>
          )}

          {esExpirada && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-3.5 text-xs text-red-900 flex items-start gap-2.5">
              <span className="text-base flex-shrink-0">🛡️</span>
              <p>
                Para volver a postular a las vacantes, puedes ingresar nuevamente a la sala de espera inteligente. El avance de la fila es fluido (~15 alumnos por minuto).
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-end">
            {esExpirada ? (
              <>
                <button
                  onClick={() => {
                    descartarAlertaCurricular();
                    establecerPasoActual('PORTAL_ALUMNOS');
                  }}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all active:scale-95"
                >
                  Volver al Portal
                </button>
                <button
                  onClick={() => {
                    descartarAlertaCurricular();
                    entrarAFilaVirtual();
                  }}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reingresar a Fila Virtual</span>
                </button>
              </>
            ) : (
              <button
                onClick={descartarAlertaCurricular}
                className="w-full py-2.5 px-4 bg-[#004A77] hover:bg-[#003859] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Entendido, continuar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
