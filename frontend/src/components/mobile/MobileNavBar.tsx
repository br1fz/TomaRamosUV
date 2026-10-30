import React from 'react';
import { Newspaper, CalendarDays, Link2, Bell } from 'lucide-react';

interface MobileNavBarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export const MobileNavBar: React.FC<MobileNavBarProps> = ({
  activeTab = 'novedades',
  onTabChange,
}) => {
  return (
    <nav className="bg-[#14151A] border-t border-[#2D323E] text-slate-400 h-16 flex items-center justify-around px-2 sticky bottom-0 z-30 select-none">
      {/* Novedades */}
      <button
        onClick={() => onTabChange?.('novedades')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeTab === 'novedades' ? 'text-[#31C4D7]' : 'hover:text-slate-200'
        }`}
      >
        <Newspaper className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Novedades</span>
      </button>

      {/* Actividades */}
      <button
        onClick={() => onTabChange?.('actividades')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeTab === 'actividades' ? 'text-[#31C4D7]' : 'hover:text-slate-200'
        }`}
      >
        <CalendarDays className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Actividades</span>
      </button>

      {/* Enlaces */}
      <button
        onClick={() => onTabChange?.('enlaces')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-colors ${
          activeTab === 'enlaces' ? 'text-[#31C4D7]' : 'hover:text-slate-200'
        }`}
      >
        <Link2 className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Enlaces</span>
      </button>

      {/* Notificaciones (Badge 15 in Coral Red #EC1C24) */}
      <button
        onClick={() => onTabChange?.('notificaciones')}
        className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg relative transition-colors ${
          activeTab === 'notificaciones' ? 'text-[#31C4D7]' : 'hover:text-slate-200'
        }`}
      >
        <div className="relative">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-[#EC1C24] text-white text-[9px] font-black rounded-full shadow-sm animate-pulse">
            15
          </span>
        </div>
        <span className="text-[10px] font-bold tracking-tight">Notificaciones</span>
      </button>
    </nav>
  );
};
