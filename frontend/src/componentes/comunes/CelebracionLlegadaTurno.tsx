import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Clock, ShieldCheck, ArrowRight, Volume2 } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesCelebracionLlegadaTurno {
  estaAbierto: boolean;
  alContinuar: () => void;
}

export const CelebracionLlegadaTurno: React.FC<PropiedadesCelebracionLlegadaTurno> = ({
  estaAbierto,
  alContinuar,
}) => {
  const { estudiante, probarAlertaSonora } = usarTomaRamos();

  useEffect(() => {
    if (estaAbierto) {
      // Disparar confetti institucional (Azul UV, Turquesa, Dorado y Esmeralda)
      confetti({
        particleCount: 85,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#004A77', '#31C4D7', '#F9AB00', '#10B981', '#ffffff'],
      });
    }
  }, [estaAbierto]);

  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#31C4D7] animate-scaleUp">
        {/* Encabezado con degradado festivo */}
        <div className="bg-gradient-to-r from-[#004A77] via-[#0284c7] to-[#31C4D7] p-6 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-3 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg border border-white/40 animate-bounce">
            <Sparkles className="w-8 h-8 text-yellow-300" />
          </div>
          <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-widest text-sky-100 mb-1">
            ¡Turno Asignado en Fila Virtual!
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            ¡Uy! ¡Al fin me toca!
          </h2>
          <p className="text-xs text-sky-100 font-medium mt-1">
            Bienvenido al portal de inscripción, <strong>{estudiante.nombre}</strong>
          </p>
        </div>

        {/* Contenido */}
        <div className="p-6 sm:p-8 space-y-5">
          <p className="text-sm text-slate-700 text-center leading-relaxed">
            Tu turno en la sala de espera ha llegado. La plataforma ha habilitado tu acceso
            unitario con vacantes en tiempo real para <strong>Ingeniería Civil Informática</strong>.
          </p>

          {/* Caja de Garantías */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-xs text-emerald-950">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>10 Minutos Protegidos y Exclusivos</span>
            </div>
            <p className="text-[11px] text-emerald-900 leading-snug">
              Durante este lapso tienes prioridad absoluta para seleccionar asignaturas, resolver
              topes de horario y confirmar tu carga sin riesgo de sobrecupos ni caídas de sistema.
            </p>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Concurrencia Unitaria Verificada</span>
            </div>

            <button
              onClick={probarAlertaSonora}
              className="text-[#004A77] hover:underline font-semibold flex items-center gap-1 text-[11px]"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Repetir aviso sonoro</span>
            </button>
          </div>

          {/* Botón Principal de Acción */}
          <button
            onClick={alContinuar}
            className="w-full py-4 px-6 bg-[#004A77] hover:bg-[#003859] text-white font-black text-sm rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer group"
          >
            <span>Comenzar mi Toma de Ramos (10:00 restantes)</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
