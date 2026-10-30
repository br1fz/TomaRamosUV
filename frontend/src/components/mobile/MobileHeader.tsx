import React from 'react';
import { Menu, CreditCard, Wifi, Battery, Signal } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

interface MobileHeaderProps {
  onOpenDrawer: () => void;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({ onOpenDrawer }) => {
  const { student } = useQueue();

  return (
    <div className="bg-[#14151A] text-white border-b border-[#2D323E] sticky top-0 z-30 select-none">
      {/* Mobile Device Status Bar */}
      <div className="flex items-center justify-between px-5 pt-2 pb-1 text-[11px] font-semibold text-slate-300">
        <span>5:08</span>
        <div className="flex items-center gap-1.5">
          <Signal className="w-3.5 h-3.5" />
          <Wifi className="w-3.5 h-3.5" />
          <Battery className="w-4 h-4 text-emerald-400" />
        </div>
      </div>

      {/* Main APPTUI Header */}
      <div className="h-14 px-4 flex items-center justify-between">
        {/* Hamburger */}
        <button
          onClick={onOpenDrawer}
          className="p-2 -ml-2 text-slate-200 hover:text-white rounded-xl active:bg-[#20232A]"
          aria-label="Abrir Menú"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Center Logo */}
        <div className="flex items-center gap-2">
          <span className="font-black text-lg tracking-wider text-white">APPTUI UV</span>
          <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center p-0.5">
            <img src="/uv_azul.svg" alt="UV" className="w-full h-full object-contain invert brightness-0" />
          </div>
        </div>

        {/* Right icons: TUI & Avatar */}
        <div className="flex items-center gap-2">
          <button
            title="Tarjeta TUI Digital"
            className="p-1.5 text-slate-300 hover:text-white rounded-lg active:bg-[#20232A]"
          >
            <CreditCard className="w-5 h-5 text-[#31C4D7]" />
          </button>
          <button
            onClick={onOpenDrawer}
            className="w-7 h-7 rounded-full border border-[#31C4D7] overflow-hidden"
          >
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
