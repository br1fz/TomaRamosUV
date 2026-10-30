import React from 'react';
import {
  X,
  Home,
  BookOpen,
  Clock,
  Calendar,
  FileText,
  CreditCard,
  MessageSquare,
  LogOut,
  User,
  RefreshCw,
  ChevronRight,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesMenuLateralApptui {
  estaAbierto: boolean;
  alCerrar: () => void;
}

export const MenuLateralApptui: React.FC<PropiedadesMenuLateralApptui> = ({
  estaAbierto,
  alCerrar,
}) => {
  const { estudiante, cerrarSesion, establecerPasoActual, pasoActual } = usarTomaRamos();

  if (!estaAbierto) return null;

  const elementosMenu = [
    { etiqueta: 'Inicio', icono: Home, accion: () => establecerPasoActual('FILA_VIRTUAL') },
    {
      etiqueta: 'Toma de Ramos / Asignaturas',
      icono: BookOpen,
      activo: pasoActual === 'SELECCION_RAMOS',
      accion: () => establecerPasoActual('SELECCION_RAMOS'),
    },
    { etiqueta: 'Horario Semanal', icono: Clock, accion: () => establecerPasoActual('HORARIO_ARMADO') },
    { etiqueta: 'Calendario Académico', icono: Calendar },
    { etiqueta: 'Documentos & Certificados', icono: FileText, accion: () => establecerPasoActual('COMPROBANTE_OFICIAL') },
    { etiqueta: 'Tarjeta TUI UV', icono: CreditCard },
    { etiqueta: 'Chat Institucional UV', icono: MessageSquare },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Fondo semitransparente */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={alCerrar}
      />

      {/* Contenedor del Menú Desplegable */}
      <div className="relative w-80 max-w-[85vw] h-full bg-[#14151A] text-slate-200 border-r border-[#2D323E] shadow-2xl flex flex-col z-10 animate-slideRight">
        {/* Cabecera del Perfil de Usuario */}
        <div className="p-5 border-b border-[#2D323E] bg-[#1a1d24]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <img
                src={estudiante.fotoPerfilUrl}
                alt={estudiante.nombre}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#31C4D7]"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <h4 className="font-extrabold text-sm text-white leading-tight">{estudiante.nombre}</h4>
                <p className="text-[11px] text-[#31C4D7] font-semibold mt-0.5">
                  Ingeniería Civil Informática
                </p>
                <p className="text-[10px] text-slate-400 font-mono">{estudiante.rut}</p>
              </div>
            </div>

            <button onClick={alCerrar} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="px-2.5 py-1 bg-[#13262F] text-[#31C4D7] border border-[#31C4D7]/30 rounded-lg text-[11px] font-bold flex items-center gap-1">
              <User className="w-3 h-3" />
              Ver perfil
            </span>
            <span className="px-2 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] font-bold">
              {estudiante.estadoAcademico}
            </span>
          </div>
        </div>

        {/* Lista de Navegación */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          {elementosMenu.map((item, indice) => {
            const Icono = item.icono;
            return (
              <button
                key={indice}
                onClick={() => {
                  if (item.accion) item.accion();
                  alCerrar();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${
                  item.activo
                    ? 'bg-[#13262F] text-[#31C4D7] font-bold border border-[#31C4D7]/30'
                    : 'text-slate-300 hover:bg-[#20232A] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icono className={`w-4 h-4 ${item.activo ? 'text-[#31C4D7]' : 'text-slate-400'}`} />
                  <span>{item.etiqueta}</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              </button>
            );
          })}

          <div className="pt-4 border-t border-[#2D323E]">
            <button
              onClick={() => {
                cerrarSesion();
                alCerrar();
              }}
              className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-950/30 rounded-xl transition-all font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>

        {/* Pie del Menú */}
        <div className="p-4 border-t border-[#2D323E] bg-[#14151A]">
          <button className="w-full py-2 px-3 bg-[#20232A] hover:bg-[#2c313c] text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar Menú</span>
          </button>
        </div>
      </div>
    </div>
  );
};
