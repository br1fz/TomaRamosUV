import React, { useState } from 'react';
import {
  Clock,
  Check,
  Users,
  ShieldCheck,
  Calendar,
  BookOpen,
  MapPin,
  CheckCircle2,
  Search,
  ChevronDown,
  Info,
  Trash2,
  Lock,
  Sparkles,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { evaluarPrerrequisitosEstudiante } from '../../utilidades';
import { BLOQUES_HORARIOS_OFICIALES, DIAS_DE_LA_SEMANA } from '../../datos';
import type { DiaSemana, Asignatura } from '../../tipos';

export const InscripcionRamosApptui: React.FC = () => {
  const {
    estudiante,
    asignaturas,
    asignaturasInscritas,
    seleccionarSeccion,
    desinscribirAsignatura,
    inscribirEnListaEspera,
    asignaturasEnListaEspera,
    confirmarInscripcionCurricular,
    totalCreditosSCT,
    establecerPasoActual,
    filtroSemestre,
    establecerFiltroSemestre,
  } = usarTomaRamos();

  const [pestanaActiva, establecerPestanaActiva] = useState<'asignaturas' | 'horario'>('asignaturas');
  const [diaSeleccionado, establecerDiaSeleccionado] = useState<DiaSemana>('Lunes');
  const [busqueda, setBusqueda] = useState('');
  const [acordeonAbierto, setAcordeonAbierto] = useState<Record<string, boolean>>({});

  const alternarAcordeon = (codigo: string) => {
    setAcordeonAbierto((prev) => ({ ...prev, [codigo]: !prev[codigo] }));
  };

  const estaSeccionInscrita = (codigoAsignatura: string, seccionId: string) => {
    return asignaturasInscritas.some(
      (item) => item.asignatura.codigo === codigoAsignatura && item.seccion.id === seccionId
    );
  };

  // Filtrado reactivo de asignaturas
  const asignaturasFiltradas = asignaturas.filter((asig: Asignatura) => {
    if (filtroSemestre !== 'TODOS' && asig.semestre !== filtroSemestre) {
      return false;
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      const coincideTexto =
        asig.nombre.toLowerCase().includes(q) ||
        asig.codigo.toLowerCase().includes(q) ||
        asig.prerrequisitos.some((p) => p.toLowerCase().includes(q));
      if (!coincideTexto) return false;
    }
    return true;
  });

  return (
    <div className="pb-6 animate-fadeIn text-slate-100 select-none">
      {/* Píldoras de Navegación Tipo Ionic Segment */}
      <div className="p-3 pb-1">
        <div className="grid grid-cols-2 gap-1 bg-[#14151A] p-1 rounded-2xl border border-[#2D323E]">
          <button
            onClick={() => establecerPestanaActiva('asignaturas')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              pestanaActiva === 'asignaturas'
                ? 'bg-[#20232A] text-[#31C4D7] shadow-md border border-[#31C4D7]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Propuesta ({asignaturas.length})</span>
          </button>

          <button
            onClick={() => establecerPestanaActiva('horario')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              pestanaActiva === 'horario'
                ? 'bg-[#20232A] text-[#31C4D7] shadow-md border border-[#31C4D7]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mi Horario ({asignaturasInscritas.length})</span>
          </button>
        </div>
      </div>

      {pestanaActiva === 'asignaturas' ? (
        <div className="p-3 space-y-3">
          {/* Card Información Importante (del chunk /inscripcionAsig) */}
          <div className="bg-[#1a2332] border border-[#234e70] rounded-2xl p-3 flex items-start gap-2.5 shadow-sm text-xs">
            <Info className="w-4 h-4 text-[#31C4D7] flex-shrink-0 mt-0.5" />
            <div className="text-[11px] text-slate-300 leading-snug">
              <strong className="text-white block font-bold mb-0.5">Información importante</strong>
              Para inscribir, despliega cada asignatura y selecciona tu sección preferida. El sistema valida choques de horario en tiempo real.
            </div>
          </div>

          {/* Buscador Tipo ion-searchbar */}
          <div className="relative">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código o nombre..."
              className="w-full bg-[#20232A] border border-[#2D323E] rounded-2xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-[#31C4D7]"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* Chips de Categorías y Semestres */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-thin">
            <button
              onClick={() => establecerFiltroSemestre('TODOS')}
              className={`px-3 py-1 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer ${
                filtroSemestre === 'TODOS'
                  ? 'bg-[#31C4D7] text-slate-950 font-black'
                  : 'bg-[#20232A] text-slate-300 border border-[#2D323E]'
              }`}
            >
              Todas ({asignaturas.length})
            </button>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sem) => {
              const esActivo = filtroSemestre === sem;
              const esSemAlumno = sem === estudiante.semestreActual;
              return (
                <button
                  key={sem}
                  onClick={() => establecerFiltroSemestre(sem)}
                  className={`px-2.5 py-1 rounded-xl font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1 ${
                    esActivo
                      ? 'bg-[#31C4D7] text-slate-950 font-black'
                      : 'bg-[#20232A] text-slate-300 border border-[#2D323E]'
                  }`}
                >
                  <span>Sem {sem}</span>
                  {esSemAlumno && (
                    <span
                      className={`text-[8px] px-1 rounded-full ${
                        esActivo ? 'bg-slate-950 text-sky-200' : 'bg-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      ★ Mi nivel
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Lista de Asignaturas con Acordeones Tipo ion-accordion-group */}
          <div className="space-y-3">
            {asignaturasFiltradas.map((asig) => {
              const inscripcionExistente = asignaturasInscritas.find(
                (item) => item.asignatura.codigo === asig.codigo
              );
              const turnoListaEspera = asignaturasEnListaEspera[asig.codigo];
              const estaAbierto = acordeonAbierto[asig.codigo] ?? false;
              const evalPrerreq = evaluarPrerrequisitosEstudiante(asig, estudiante);

              return (
                <div
                  key={asig.codigo}
                  className={`bg-[#20232A] border rounded-2xl overflow-hidden transition-all shadow-md ${
                    inscripcionExistente
                      ? 'border-[#31C4D7] ring-1 ring-[#31C4D7]/50'
                      : !evalPrerreq.habilitado
                      ? 'border-amber-600/40 opacity-90'
                      : 'border-[#2D323E] hover:border-slate-500'
                  }`}
                >
                  {/* Encabezado del Acordeón (ion-accordion header) */}
                  <div
                    onClick={() => alternarAcordeon(asig.codigo)}
                    className="p-3.5 bg-[#1a1d24] flex items-center justify-between gap-2 cursor-pointer active:bg-[#1f232c] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider flex-shrink-0"
                        style={{ backgroundColor: asig.colorDistintivo, color: asig.colorTexto }}
                      >
                        {asig.codigo}
                      </span>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-xs text-white truncate leading-tight">
                          {asig.nombre}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                          <span className="text-sky-300 font-semibold">Sem. {asig.semestre}</span>
                          <span>•</span>
                          <span>{asig.creditosSCT} SCT</span>
                          <span>•</span>
                          {evalPrerreq.habilitado ? (
                            evalPrerreq.esReglaEspecial39 ? (
                              <span className="text-amber-400 font-bold flex items-center gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>★ Regla 3.9</span>
                              </span>
                            ) : (
                              <span className="text-emerald-400 font-semibold">✓ Habilitada</span>
                            )
                          ) : (
                            <span className="text-red-400 font-semibold flex items-center gap-0.5" title={evalPrerreq.motivo}>
                              <Lock className="w-2.5 h-2.5" />
                              <span>Pendiente ({evalPrerreq.notaObtenida ?? 's/n'} &lt; 3.9)</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {inscripcionExistente ? (
                        <span className="px-2 py-0.5 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-lg text-[10px] font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          <span>Sec. {inscripcionExistente.seccion.numeroSeccion}</span>
                        </span>
                      ) : turnoListaEspera ? (
                        <span className="px-2 py-0.5 bg-amber-950/80 text-amber-400 border border-amber-800 rounded-lg text-[10px] font-bold">
                          Espera #{turnoListaEspera}
                        </span>
                      ) : null}

                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          estaAbierto ? 'rotate-180 text-white' : ''
                        }`}
                      />
                    </div>
                  </div>

                  {/* Cuerpo Expandido del Acordeón (ion-accordion content) */}
                  {estaAbierto && (
                    <div className="p-3.5 bg-[#14151A] space-y-3 border-t border-[#2D323E]/80 animate-fadeIn">
                      {/* Meta Información Curricular Oficial */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#1a1d24] p-2.5 rounded-xl border border-[#2D323E]">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Tema / Área:</span>
                          <span className="font-semibold text-slate-200">Línea de Especialidad</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Cupo estricto:</span>
                          <span className="font-semibold text-[#31C4D7]">Sí (Concurrente)</span>
                        </div>
                      </div>

                      {/* Lista de Secciones Disponibles */}
                      <div className="space-y-2.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Secciones Disponibles
                        </span>

                        {asig.secciones.map((sec) => {
                          const estaSeleccionada = estaSeccionInscrita(asig.codigo, sec.id);
                          const estaSinCupo = sec.cuposDisponibles <= 0;

                          return (
                            <div
                              key={sec.id}
                              className={`p-3 rounded-2xl border transition-all ${
                                estaSeleccionada
                                  ? 'bg-[#13262F] border-[#31C4D7] shadow-md'
                                  : 'bg-[#20232A] border-[#2D323E]'
                              }`}
                            >
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-extrabold text-xs text-white">
                                      Sección {sec.numeroSeccion}
                                    </span>
                                    {estaSeleccionada && (
                                      <span className="px-1.5 py-0.2 bg-[#31C4D7] text-slate-950 font-black text-[9px] rounded">
                                        INSCRITA
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-300 mt-0.5">
                                    Académico: <strong>{sec.profesor}</strong>
                                  </p>
                                </div>

                                <div className="text-right">
                                  <span
                                    className={`text-[11px] font-mono font-bold block ${
                                      estaSinCupo ? 'text-red-400' : 'text-emerald-400'
                                    }`}
                                  >
                                    {sec.cuposDisponibles}/{sec.cuposTotales} cupos
                                  </span>
                                  <span className="text-[9px] text-slate-400">
                                    {estaSinCupo ? 'Sin cupo' : 'Disponibles'}
                                  </span>
                                </div>
                              </div>

                              {/* Horario de la Sección */}
                              <div className="space-y-1 mb-3 bg-[#14151A] p-2 rounded-xl text-[10px] text-slate-300 border border-[#2D323E]/50">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                                  Horario Programado:
                                </span>
                                {sec.horario.map((bloque, idx) => (
                                  <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-3 h-3 text-[#31C4D7]" />
                                      <span className="font-bold text-white">{bloque.dia}</span>
                                      <span>{bloque.horaInicio} - {bloque.horaFin}</span>
                                    </div>
                                    <span className="text-slate-400">{bloque.sala}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Botones de Selección / Lista de Espera */}
                              {estaSeleccionada ? (
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 py-2 bg-[#0c2b33] text-[#31C4D7] font-black rounded-xl text-xs flex items-center justify-center gap-1.5 border border-[#31C4D7]/50">
                                    <Check className="w-4 h-4" />
                                    <span>Sección Asignada</span>
                                  </div>
                                  <button
                                    onClick={() => desinscribirAsignatura(asig.codigo)}
                                    title="Quitar sección"
                                    className="p-2 bg-red-950/40 text-red-400 hover:bg-red-900/60 rounded-xl border border-red-800/50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : estaSinCupo ? (
                                turnoListaEspera ? (
                                  <div className="w-full py-2 bg-amber-950/50 text-amber-300 border border-amber-700/60 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                    <span>En Lista de Espera (Turno #{turnoListaEspera})</span>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => inscribirEnListaEspera(asig.codigo)}
                                    className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow"
                                  >
                                    <Users className="w-3.5 h-3.5" />
                                    <span>Anotarse en Lista de Espera</span>
                                  </button>
                                )
                              ) : !evalPrerreq.habilitado ? (
                                <button
                                  onClick={() => seleccionarSeccion(asig, sec)}
                                  className="w-full py-2 bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-700/60 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                                  title={evalPrerreq.motivo}
                                >
                                  <Lock className="w-3.5 h-3.5 text-red-400" />
                                  <span>Prerrequisito Pendiente</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => seleccionarSeccion(asig, sec)}
                                  className="w-full py-2 bg-[#20232A] hover:bg-[#282d37] text-white hover:text-[#31C4D7] border border-[#2D323E] hover:border-[#31C4D7] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                                >
                                  <span>Inscribir Sección {sec.numeroSeccion}</span>
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* VISTA DEL HORARIO MÓVIL POR DÍA */
        <div className="p-3 space-y-3">
          {/* Píldoras Selectoras de Día */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {DIAS_DE_LA_SEMANA.map((dia) => (
              <button
                key={dia}
                onClick={() => establecerDiaSeleccionado(dia)}
                className={`flex-1 py-2 px-1 text-xs font-bold rounded-xl transition-all text-center ${
                  diaSeleccionado === dia
                    ? 'bg-[#31C4D7] text-slate-950 shadow-md font-black'
                    : 'bg-[#20232A] text-slate-400 hover:text-white border border-[#2D323E]'
                }`}
              >
                {dia.substring(0, 3).toUpperCase()}
              </button>
            ))}
          </div>

          {/* Bloques para el día seleccionado */}
          <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 divide-y divide-[#2D323E]">
            {BLOQUES_HORARIOS_OFICIALES.map((bloque) => {
              const coincidencia = asignaturasInscritas.find((item) =>
                item.seccion.horario.some(
                  (b) => b.dia === diaSeleccionado && b.indiceBloque === bloque.indice
                )
              );
              const bloqueHorario = coincidencia?.seccion.horario.find(
                (b) => b.dia === diaSeleccionado && b.indiceBloque === bloque.indice
              );

              return (
                <div key={bloque.indice} className="py-2.5 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                    <span className="font-mono font-semibold">Bloque {bloque.indice + 1}</span>
                    <span>{bloque.horario}</span>
                  </div>

                  {coincidencia && bloqueHorario ? (
                    <div
                      className="p-3 rounded-xl text-white shadow-sm"
                      style={{ backgroundColor: coincidencia.asignatura.colorDistintivo }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-black text-xs">{coincidencia.asignatura.codigo}</span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 bg-black/20 rounded">
                          Sec. {coincidencia.seccion.numeroSeccion}
                        </span>
                      </div>
                      <p className="text-xs font-semibold mt-0.5">{coincidencia.asignatura.nombre}</p>
                      <div className="flex items-center justify-between text-[10px] text-white/90 mt-2 pt-1 border-t border-white/20">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {bloqueHorario.sala}
                        </span>
                        <span>{coincidencia.seccion.profesor}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2 text-center text-slate-500 text-[11px] border border-dashed border-[#2D323E] rounded-xl">
                      Sin clase en este bloque
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Barra Inferior Adherida (Sticky) para Confirmar Inscripción */}
      <div className="sticky bottom-0 left-0 right-0 bg-[#14151A]/95 backdrop-blur-md border-t border-[#2D323E] p-3 z-30 flex items-center justify-between gap-3 shadow-2xl">
        <div>
          <span className="text-[10px] text-slate-400 block font-bold uppercase">
            Total Créditos:
          </span>
          <span className="text-sm font-black text-[#31C4D7] font-mono">
            {totalCreditosSCT} / 30 SCT
          </span>
        </div>

        <button
          onClick={() => {
            const exito = confirmarInscripcionCurricular();
            if (exito) {
              establecerPasoActual('COMPROBANTE_OFICIAL');
            }
          }}
          disabled={asignaturasInscritas.length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
            asignaturasInscritas.length > 0
              ? 'bg-[#31C4D7] text-slate-950 hover:bg-[#28b2c4]'
              : 'bg-[#20232A] text-slate-500 cursor-not-allowed border border-[#2D323E]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confirmar Inscripción</span>
        </button>
      </div>
    </div>
  );
};
