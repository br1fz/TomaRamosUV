import React, { useState } from 'react';
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
  ChevronDown,
  Sparkles,
  Key,
  GraduationCap,
  Users,
  PenTool,
  CheckSquare,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesMenuLateralApptui {
  estaAbierto: boolean;
  alCerrar: () => void;
  alAbrirPerfil?: () => void;
}

export const MenuLateralApptui: React.FC<PropiedadesMenuLateralApptui> = ({
  estaAbierto,
  alCerrar,
  alAbrirPerfil,
}) => {
  const {
    estudiante,
    cerrarSesion,
    establecerPasoActual,
    entrarAFilaVirtual,
    estaInscripcionCompletada,
  } = usarTomaRamos();

  const [documentosExpandido, setDocumentosExpandido] = useState(false);
  const [uvExpandido, setUvExpandido] = useState(false);
  const [daeExpandido, setDaeExpandido] = useState(false);

  if (!estaAbierto) return null;

  return (
    <div className="fixed inset-0 z-50 flex select-none">
      {/* Fondo semitransparente oscuro */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={alCerrar}
      />

      {/* Contenedor del Drawer Menú Desplegable (WhatsApp Image 2026-10-30 at 5.11.00 PM (2)) */}
      <div className="relative w-72 max-w-[80vw] h-full bg-[#14151A] text-slate-200 border-r border-[#2D323E] shadow-2xl flex flex-col z-10 animate-slideRight">
        {/* Cabecera Superior: Escudo Universidad de Valparaíso CHILE */}
        <div className="p-4 pt-5 pb-3 bg-[#111317] border-b border-[#2D323E]/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src="/apptui_extracted/assets/images/logos/header_uv.png"
              alt="Universidad de Valparaíso CHILE"
              className="h-10 w-auto object-contain brightness-0 invert"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div className="text-left text-white leading-tight">
              <span className="text-xs font-black uppercase tracking-wider block">
                Universidad
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[#31C4D7] block">
                de Valparaíso
              </span>
              <span className="text-[9px] font-bold text-slate-400 tracking-widest block">
                CHILE
              </span>
            </div>
          </div>

          <button
            onClick={alCerrar}
            className="p-1 text-slate-400 hover:text-white rounded-lg active:bg-[#20232A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tarjeta de Perfil de Usuario (WhatsApp Image 2026-10-30 at 5.11.00 PM (2)) */}
        <div className="p-3.5 m-3 bg-[#20232A] border border-[#2D323E] rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            {/* Foto de Bruno Díaz */}
            <div className="w-14 h-16 rounded-xl overflow-hidden border border-[#2D323E] flex-shrink-0 bg-slate-800">
              <img
                src={estudiante.fotoPerfilUrl}
                alt={estudiante.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/portal_alumnos_files/avatar_bruno_diaz.jpg';
                }}
              />
            </div>

            {/* Datos */}
            <div className="flex-1 min-w-0">
              <h4 className="font-extrabold text-sm text-white truncate">
                Bruno Díaz
              </h4>
              <p className="text-[11px] text-slate-400 truncate leading-snug">
                Ingenieria Civil En Informatica
              </p>

              <button
                onClick={() => {
                  alCerrar();
                  if (alAbrirPerfil) alAbrirPerfil();
                }}
                className="mt-2 px-2.5 py-1 bg-[#113b45] text-[#31C4D7] border border-[#31C4D7]/40 rounded-xl text-[10px] font-bold flex items-center gap-1 active:scale-95 transition-all hover:bg-[#154955]"
              >
                <User className="w-3 h-3 text-[#31C4D7]" />
                <span>Ver perfil</span>
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Navegación Oficial (WhatsApp Image 2026-10-30 at 5.11.00 PM (2) y 5.11.01 PM) */}
        <nav className="flex-1 overflow-y-auto px-3 py-1 space-y-0.5 text-xs font-medium">
          {/* Inicio */}
          <button
            onClick={() => {
              establecerPasoActual('PORTAL_ALUMNOS');
              alCerrar();
            }}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <Home className="w-4 h-4 text-slate-400" />
            <span>Inicio</span>
          </button>

          {/* Toma de Ramos 2026-1 (MÓDULO DESTACADO PRIORITARIO) */}
          <button
            onClick={() => {
              if (estaInscripcionCompletada) {
                establecerPasoActual('HORARIO_ARMADO');
              } else {
                entrarAFilaVirtual();
              }
              alCerrar();
            }}
            className="w-full flex items-center justify-between p-2.5 bg-[#13262F] text-[#31C4D7] font-black rounded-xl border border-[#31C4D7]/40 shadow-xs hover:bg-[#1a3845] transition-all"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[#31C4D7] animate-pulse" />
              <span>Toma de Ramos 2026-1</span>
            </div>
            <span className="px-1.5 py-0.5 bg-[#31C4D7] text-slate-900 text-[9px] font-black rounded-md tracking-wider">
              ACTIVO
            </span>
          </button>

          {/* Asignaturas */}
          <button
            onClick={() => {
              if (estaInscripcionCompletada) {
                establecerPasoActual('HORARIO_ARMADO');
              } else {
                entrarAFilaVirtual();
              }
              alCerrar();
            }}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <BookOpen className="w-4 h-4 text-slate-400" />
            <span>Asignaturas</span>
          </button>

          {/* Horario */}
          <button
            onClick={() => {
              establecerPasoActual('HORARIO_ARMADO');
              alCerrar();
            }}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Horario</span>
          </button>

          {/* Calendario Académico */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Calendario Académico</span>
          </button>

          {/* Documentos (Dropdown) */}
          <div>
            <button
              onClick={() => setDocumentosExpandido(!documentosExpandido)}
              className="w-full flex items-center justify-between p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-slate-400" />
                <span>Documentos</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  documentosExpandido ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            {documentosExpandido && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-[11px] text-slate-400 animate-fadeIn">
                <button
                  onClick={() => {
                    establecerPasoActual('COMPROBANTE_OFICIAL');
                    alCerrar();
                  }}
                  className="w-full text-left py-1 text-slate-300 hover:text-[#31C4D7]"
                >
                  • Comprobante Inscripción 2026-1
                </button>
                <div className="py-1 hover:text-[#31C4D7]">• Certificado Alumno Regular</div>
                <div className="py-1 hover:text-[#31C4D7]">• Concentración de Notas</div>
              </div>
            )}
          </div>

          {/* UV (Dropdown) */}
          <div>
            <button
              onClick={() => setUvExpandido(!uvExpandido)}
              className="w-full flex items-center justify-between p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="w-4 h-4 text-slate-400" />
                <span>UV</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  uvExpandido ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            {uvExpandido && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-[11px] text-slate-400 animate-fadeIn">
                <div className="py-1 hover:text-[#31C4D7]">• Portal Institucional uv.cl</div>
                <div className="py-1 hover:text-[#31C4D7]">• Malla Curricular Informática</div>
                <div className="py-1 hover:text-[#31C4D7]">• Reglamento Académico General</div>
              </div>
            )}
          </div>

          {/* Solicitud Salas */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <Key className="w-4 h-4 text-slate-400" />
            <span>Solicitud Salas</span>
          </button>

          {/* TUI */}
          <button
            onClick={() => {
              alCerrar();
              if (alAbrirPerfil) alAbrirPerfil();
            }}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <CreditCard className="w-4 h-4 text-slate-400" />
            <span>TUI</span>
          </button>

          {/* Horas SEMDA */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <span className="w-4 h-4 text-[10px] font-black border border-slate-400 rounded flex items-center justify-center">
              31
            </span>
            <span>Horas SEMDA</span>
          </button>

          {/* DAE (Dropdown) */}
          <div>
            <button
              onClick={() => setDaeExpandido(!daeExpandido)}
              className="w-full flex items-center justify-between p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4 text-slate-400" />
                <span>DAE</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-500 transition-transform ${
                  daeExpandido ? 'rotate-180 text-white' : ''
                }`}
              />
            </button>
            {daeExpandido && (
              <div className="pl-9 pr-2 py-1 space-y-1 text-[11px] text-slate-400 animate-fadeIn">
                <div className="py-1 hover:text-[#31C4D7]">• Becas y Créditos</div>
                <div className="py-1 hover:text-[#31C4D7]">• Salud Estudiantil</div>
                <div className="py-1 hover:text-[#31C4D7]">• Actividades Deportivas</div>
              </div>
            )}
          </div>

          {/* Nombre social */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <span className="w-4 h-4 text-xs font-bold flex items-center justify-center">
              Aa
            </span>
            <span>Nombre social</span>
          </button>

          {/* Encuestas */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <PenTool className="w-4 h-4 text-slate-400" />
            <span>Encuestas</span>
          </button>

          {/* Votaciones */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <CheckSquare className="w-4 h-4 text-slate-400" />
            <span>Votaciones</span>
          </button>

          {/* ChatUV */}
          <button
            onClick={alCerrar}
            className="w-full flex items-center gap-3 p-2.5 text-slate-200 hover:bg-[#20232A] hover:text-white rounded-xl transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-slate-400" />
            <span>ChatUV</span>
          </button>

          {/* Salir (Cerrar Sesión) */}
          <div className="pt-2 border-t border-[#2D323E]/80">
            <button
              onClick={() => {
                cerrarSesion();
                alCerrar();
              }}
              className="w-full flex items-center gap-3 p-2.5 text-red-400 hover:bg-red-950/30 rounded-xl transition-colors font-semibold"
            >
              <LogOut className="w-4 h-4" />
              <span>Salir</span>
            </button>
          </div>
        </nav>

        {/* Pie del Menú Lateral: Actualizar menú */}
        <div className="p-3 border-t border-[#2D323E] bg-[#111317]">
          <button
            onClick={alCerrar}
            className="w-full py-2 px-3 bg-[#20232A] hover:bg-[#2c313c] text-slate-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualizar menú</span>
          </button>
        </div>
      </div>
    </div>
  );
};
