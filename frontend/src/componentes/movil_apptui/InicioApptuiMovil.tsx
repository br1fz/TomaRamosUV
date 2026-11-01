import React, { useState } from 'react';
import {
  Lightbulb,
  RefreshCw,
  BookOpen,
  Calendar,
  CreditCard,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Clock,
  Info,
  ChevronRight,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

interface PropiedadesInicioApptuiMovil {
  alAbrirHorario?: () => void;
  alAbrirComprobante?: () => void;
}

export const InicioApptuiMovil: React.FC<PropiedadesInicioApptuiMovil> = ({
  alAbrirHorario,
  alAbrirComprobante,
}) => {
  const {
    establecerPasoActual,
    entrarAFilaVirtual,
    estaInscripcionCompletada,
    asignaturasInscritas,
    totalCreditosSCT,
  } = usarTomaRamos();

  const [indiceCarrusel, setIndiceCarrusel] = useState(0);

  // Anuncios oficiales de APPTUI UV (extraídos de capturas WhatsApp)
  const noticiasCarrusel = [
    {
      id: 1,
      titulo: 'Queremos conocer tu experiencia ...',
      subtitulo: 'Con Campus Digital obtén beneficios en PedidosYa. Responde la encuesta de percepción.',
      fecha: 'Publicado el 25/09/2026',
      imagen: '/portal_alumnos_files/canales_uv.png',
      tag: 'CAMPUS DIGITAL',
    },
    {
      id: 2,
      titulo: 'Acreditación Institucional de Excelencia',
      subtitulo: 'La Comisión Nacional de Acreditación (CNA-Chile) certificó a la UV por 6 años hasta 2029.',
      fecha: 'Publicado el 20/09/2026',
      imagen: '/portal_alumnos_files/experiencia_uv_2026.png',
      tag: 'INSTITUCIONAL',
    },
    {
      id: 3,
      titulo: 'Canales Oficiales DAE Casa Central',
      subtitulo: 'Conoce los horarios y servicios de bienestar para el período académico 2026.',
      fecha: 'Publicado el 15/09/2026',
      imagen: '/portal_alumnos_files/canales_dae.png',
      tag: 'BIENESTAR DAE',
    },
  ];

  return (
    <div className="p-4 space-y-4 animate-fadeIn text-slate-100 select-none pb-20">
      {/* Píldoras de acción rápida (WhatsApp Image 2026-10-30 at 5.11.00 PM (1)) */}
      <div className="flex items-center justify-between text-xs">
        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2b33] text-[#31C4D7] border border-[#31C4D7]/40 rounded-full font-bold shadow-xs">
          <Lightbulb className="w-3.5 h-3.5 text-[#31C4D7]" />
          <span>Últimas novedades</span>
        </button>

        <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0c2b33] text-[#31C4D7] border border-[#31C4D7]/40 rounded-full font-semibold shadow-xs">
          <RefreshCw className="w-3.5 h-3.5 text-[#31C4D7]" />
          <span>Actualizar</span>
        </button>
      </div>

      {/* Banner Destacado: Toma de Ramos 2026-1 */}
      {estaInscripcionCompletada ? (
        <div className="bg-[#13262F] border-2 border-[#31C4D7] rounded-3xl p-5 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-2 mb-1.5">
            <CheckCircle2 className="w-5 h-5 text-[#31C4D7]" />
            <span className="text-[11px] font-black uppercase tracking-wider text-[#31C4D7]">
              Carga Curricular 2026-1 Confirmada
            </span>
          </div>

          <h3 className="text-base font-black text-white">
            Horario Semanal Estructurado
          </h3>
          <p className="text-xs text-slate-300 mt-1 mb-4 leading-snug">
            Has inscrito satisfactoriamente <strong className="text-white">{asignaturasInscritas.length} asignaturas</strong> ({totalCreditosSCT} créditos SCT). Cupos bloqueados y validados.
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                if (alAbrirHorario) alAbrirHorario();
                else establecerPasoActual('HORARIO_ARMADO');
              }}
              className="py-2.5 px-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-900 font-extrabold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow"
            >
              <Calendar className="w-4 h-4" />
              <span>Ver Horario</span>
            </button>
            <button
              onClick={() => {
                if (alAbrirComprobante) alAbrirComprobante();
                else establecerPasoActual('COMPROBANTE_OFICIAL');
              }}
              className="py-2.5 px-3 bg-[#20232A] text-white border border-[#2D323E] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all hover:border-slate-500"
            >
              <Award className="w-4 h-4 text-[#31C4D7]" />
              <span>Comprobante QR</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-[#1d2732] via-[#1a1f29] to-[#14151A] border-2 border-[#31C4D7] rounded-3xl p-5 shadow-2xl relative overflow-hidden">
          {/* Resplandor decorativo de fondo */}
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#31C4D7]/15 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-center justify-between mb-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#13262F] text-[#31C4D7] rounded-full text-[10px] font-black uppercase tracking-wider border border-[#31C4D7]/30">
              <Sparkles className="w-3 h-3 text-[#31C4D7]" />
              Proceso Oficial 2026-1
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
              Grupo 1 Habilitado
            </span>
          </div>

          <h3 className="text-base font-black text-white leading-tight">
            Toma de Ramos Ing. Civil Informática
          </h3>
          <p className="text-xs text-slate-300 mt-1 mb-4 leading-snug">
            Accede a la sala de espera virtual inteligente con prioridad garantizada y validación preventiva de choques de horario.
          </p>

          <button
            onClick={() => entrarAFilaVirtual()}
            className="w-full py-3.5 bg-[#168a9a] hover:bg-[#1a9cac] text-white font-black rounded-2xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <span>Ingresar a Fila Virtual</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Carrusel de Novedades Oficial (WhatsApp Image 2026-10-30 at 5.11.00 PM (1)) */}
      <div className="bg-[#20232A] border border-[#2D323E] rounded-3xl overflow-hidden shadow-lg">
        {/* Banner Ilustrado */}
        <div className="relative h-36 bg-gradient-to-r from-[#b91c1c] via-[#dc2626] to-[#991b1b] p-4 flex flex-col justify-between overflow-hidden">
          {/* Logos UV y Santander Campus Digital */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-2 py-1 rounded-lg">
              <img
                src="/uv_azul.svg"
                alt="UV"
                className="h-4 w-auto brightness-0 invert"
              />
              <span className="text-[9px] font-extrabold text-white leading-tight">
                Universidad de Valparaíso CHILE
              </span>
            </div>

            <div className="bg-white px-2 py-0.5 rounded-md flex items-center gap-1 shadow-xs">
              <span className="text-[#EC1C24] text-[9px] font-black tracking-tight">
                campus digital
              </span>
            </div>
          </div>

          {/* Texto Central del Banner */}
          <div className="z-10 text-white">
            <h4 className="text-sm font-black uppercase leading-tight tracking-tight drop-shadow-sm">
              Con Campus Digital Obtén Beneficios en PedidosYa
            </h4>
            <p className="text-[10px] text-rose-100 font-semibold mt-0.5">
              RESPONDE LA ENCUESTA DE PERCEPCIÓN
            </p>
          </div>

          {/* Gráfico decorativo de fondo */}
          <div className="absolute right-2 bottom-1 opacity-25 pointer-events-none text-5xl">
            📋
          </div>
        </div>

        {/* Pie de la Tarjeta del Carrusel */}
        <div className="p-4 bg-[#20232A]">
          <h5 className="font-bold text-sm text-white leading-snug">
            {noticiasCarrusel[indiceCarrusel].titulo}
          </h5>

          <div className="mt-2 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-400">
              {noticiasCarrusel[indiceCarrusel].fecha}
            </span>

            <button className="flex items-center gap-1 text-[11px] font-bold text-[#31C4D7] hover:underline bg-[#13262F] px-2.5 py-1 rounded-xl border border-[#31C4D7]/30">
              <Info className="w-3 h-3" />
              <span>Ver más</span>
            </button>
          </div>
        </div>
      </div>

      {/* Puntos Indicadores del Carrusel de Noticias */}
      <div className="flex items-center justify-center gap-1.5 py-0.5">
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <span
            key={i}
            onClick={() => setIndiceCarrusel(i % noticiasCarrusel.length)}
            className={`transition-all cursor-pointer ${
              i === 1
                ? 'w-6 h-1.5 bg-[#31C4D7] rounded-full'
                : 'w-1.5 h-1.5 bg-slate-600 rounded-full'
            }`}
          />
        ))}
      </div>

      {/* Botón Beneficios Santander Oficial (WhatsApp Image 2026-10-30 at 5.11.00 PM (1)) */}
      <div className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3.5 flex items-center justify-between shadow-md active:scale-95 transition-all cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center p-1.5 shadow-sm">
            <img
              src="/apptui_extracted/assets/images/logos/logo_santander.png"
              alt="Santander"
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="font-extrabold text-sm text-white">
            Beneficios Santander
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400" />
      </div>

      {/* Dos Botones de Acción: Aula Virtual y Acceso UV */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3.5 flex items-center gap-3 shadow-md cursor-pointer transition-all active:scale-95">
          <div className="w-10 h-10 rounded-xl bg-[#13262F] flex items-center justify-center text-[#31C4D7] flex-shrink-0">
            <BookOpen className="w-5 h-5 text-[#31C4D7]" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">Aula Virtual</h5>
            <span className="text-[10px] text-slate-400 block">Docencia</span>
          </div>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3.5 flex items-center gap-3 shadow-md cursor-pointer transition-all active:scale-95">
          <div className="w-10 h-10 rounded-xl bg-[#13262F] flex items-center justify-center text-[#31C4D7] flex-shrink-0">
            <CreditCard className="w-5 h-5 text-[#31C4D7]" />
          </div>
          <div>
            <h5 className="font-extrabold text-xs text-white">Acceso UV</h5>
            <span className="text-[10px] text-slate-400 block">Tarjeta TUI</span>
          </div>
        </div>
      </div>

      {/* Cuadrícula de 4 Accesos Rápidos (WhatsApp Image 2026-10-30 at 5.11.00 PM (1)) */}
      <div className="grid grid-cols-4 gap-2.5 text-center text-xs">
        {/* Asignaturas */}
        <div
          onClick={() => {
            if (estaInscripcionCompletada) establecerPasoActual('HORARIO_ARMADO');
            else entrarAFilaVirtual();
          }}
          className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md aspect-square"
        >
          <BookOpen className="w-6 h-6 text-slate-200 mb-1.5" />
          <span className="text-[10px] font-semibold text-slate-200 leading-tight">
            Asignaturas
          </span>
        </div>

        {/* Horario */}
        <div
          onClick={() => {
            if (alAbrirHorario) alAbrirHorario();
            else establecerPasoActual('HORARIO_ARMADO');
          }}
          className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md aspect-square"
        >
          <Clock className="w-6 h-6 text-slate-200 mb-1.5" />
          <span className="text-[10px] font-semibold text-slate-200 leading-tight">
            Horario
          </span>
        </div>

        {/* Calendario Académico */}
        <div className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md aspect-square">
          <Calendar className="w-6 h-6 text-slate-200 mb-1.5" />
          <span className="text-[10px] font-semibold text-slate-200 leading-tight">
            Calendario
          </span>
        </div>

        {/* Certificados */}
        <div
          onClick={() => {
            if (alAbrirComprobante) alAbrirComprobante();
            else establecerPasoActual('COMPROBANTE_OFICIAL');
          }}
          className="bg-[#20232A] border border-[#2D323E] hover:border-slate-500 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all active:scale-95 shadow-md aspect-square"
        >
          <Award className="w-6 h-6 text-slate-200 mb-1.5" />
          <span className="text-[10px] font-semibold text-slate-200 leading-tight">
            Certificados
          </span>
        </div>
      </div>

      {/* Puntos Indicadores de la Cuadrícula Inferior */}
      <div className="flex items-center justify-center gap-1 py-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => (
          <span
            key={i}
            className={`transition-all ${
              i === 0
                ? 'w-5 h-1.5 bg-[#31C4D7] rounded-full'
                : 'w-1.5 h-1.5 bg-slate-600 rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
