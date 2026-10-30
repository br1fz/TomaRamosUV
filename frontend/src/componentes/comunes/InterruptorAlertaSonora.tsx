import React from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesInterruptorAlertaSonora {
  clasePersonalizada?: string;
  modoOscuro?: boolean;
}

export const InterruptorAlertaSonora: React.FC<PropiedadesInterruptorAlertaSonora> = ({
  clasePersonalizada = '',
  modoOscuro = false,
}) => {
  const { metricasFila, configurarAlertaSonora, probarAlertaSonora } = usarTomaRamos();

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        modoOscuro
          ? 'bg-[#1a1d24] border-[#2d323e] text-slate-200'
          : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
      } ${clasePersonalizada}`}
    >
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={metricasFila.alertaSonoraHabilitada}
          onChange={(e) => configurarAlertaSonora(e.target.checked)}
          className="w-4 h-4 rounded text-[#004A77] focus:ring-[#004A77] cursor-pointer"
        />
        <div className="flex items-center gap-2 text-xs font-semibold">
          {metricasFila.alertaSonoraHabilitada ? (
            <Bell className="w-4 h-4 text-emerald-500 animate-wiggle" />
          ) : (
            <BellOff className="w-4 h-4 text-slate-400" />
          )}
          <span>Aviso sonoro al llegar mi turno</span>
        </div>
      </label>

      <button
        type="button"
        onClick={probarAlertaSonora}
        title="Probar sonido amigable de llegada de turno"
        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg flex items-center gap-1 transition-all ${
          modoOscuro
            ? 'bg-[#20232a] hover:bg-[#2c313c] text-[#31C4D7]'
            : 'bg-slate-100 hover:bg-slate-200 text-[#004A77]'
        }`}
      >
        <Volume2 className="w-3.5 h-3.5" />
        <span>Probar</span>
      </button>
    </div>
  );
};
