import React from 'react';
import { Bell, BellOff, Volume2 } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

interface AudioAlertToggleProps {
  className?: string;
  isDark?: boolean;
}

export const AudioAlertToggle: React.FC<AudioAlertToggleProps> = ({
  className = '',
  isDark = false,
}) => {
  const { queueMetrics, setSoundAlert, testAudioAlert } = useQueue();

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
        isDark
          ? 'bg-[#1a1d24] border-[#2d323e] text-slate-200'
          : 'bg-white/80 border-slate-200 text-slate-700 shadow-sm'
      } ${className}`}
    >
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={queueMetrics.soundAlertEnabled}
          onChange={(e) => setSoundAlert(e.target.checked)}
          className="w-4 h-4 rounded text-[#004A77] focus:ring-[#004A77] cursor-pointer"
        />
        <div className="flex items-center gap-2 text-xs font-semibold">
          {queueMetrics.soundAlertEnabled ? (
            <Bell className="w-4 h-4 text-emerald-500 animate-wiggle" />
          ) : (
            <BellOff className="w-4 h-4 text-slate-400" />
          )}
          <span>Aviso sonoro al llegar mi turno</span>
        </div>
      </label>

      <button
        type="button"
        onClick={testAudioAlert}
        title="Probar sonido de campana institucional"
        className={`px-2.5 py-1 text-[11px] font-medium rounded-lg flex items-center gap-1 transition-all ${
          isDark
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
