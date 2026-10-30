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
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { BLOQUES_HORARIOS_OFICIALES, DIAS_DE_LA_SEMANA } from '../../datos';
import type { DiaSemana } from '../../tipos';

export const InscripcionRamosApptui: React.FC = () => {
  const {
    asignaturas,
    asignaturasInscritas,
    seleccionarSeccion,
    desinscribirAsignatura,
    inscribirEnListaEspera,
    asignaturasEnListaEspera,
    confirmarInscripcionCurricular,
    totalCreditosSCT,
    metricasFila,
  } = usarTomaRamos();

  const [pestanaActiva, establecerPestanaActiva] = useState<'asignaturas' | 'horario'>('asignaturas');
  const [diaSeleccionado, establecerDiaSeleccionado] = useState<DiaSemana>('Lunes');

  const formatearCuentaRegresiva = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`;
  };

  const estaSeccionInscrita = (codigoAsignatura: string, seccionId: string) => {
    return asignaturasInscritas.some(
      (item) => item.asignatura.codigo === codigoAsignatura && item.seccion.id === seccionId
    );
  };

  return (
    <div className="pb-24 animate-fadeIn text-slate-100">
      {/* Banner de Cuenta Regresiva de Transacción */}
      <div className="bg-[#13262F] border-b border-[#31C4D7]/30 px-4 py-2.5 flex items-center justify-between text-xs sticky top-14 z-20">
        <div className="flex items-center gap-1.5 text-[#31C4D7] font-bold">
          <Clock className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Tiempo de Reserva:</span>
        </div>
        <span className="font-mono font-black text-sm text-[#31C4D7]">
          {formatearCuentaRegresiva(metricasFila.segundosRestantesTransaccion)}
        </span>
      </div>

      {/* Alternador de Vistas (Asignaturas / Mi Horario) */}
      <div className="p-4 pb-2">
        <div className="grid grid-cols-2 gap-1 bg-[#14151A] p-1 rounded-2xl border border-[#2D323E]">
          <button
            onClick={() => establecerPestanaActiva('asignaturas')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              pestanaActiva === 'asignaturas'
                ? 'bg-[#20232A] text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Asignaturas ({asignaturas.length})</span>
          </button>

          <button
            onClick={() => establecerPestanaActiva('horario')}
            className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              pestanaActiva === 'horario'
                ? 'bg-[#20232A] text-[#31C4D7] shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Mi Horario ({asignaturasInscritas.length})</span>
          </button>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="px-4 space-y-4">
        {pestanaActiva === 'asignaturas' ? (
          /* LISTA DE ASIGNATURAS */
          <div className="space-y-4">
            {asignaturas.map((asig) => {
              const inscripcionExistente = asignaturasInscritas.find(
                (item) => item.asignatura.codigo === asig.codigo
              );
              const turnoListaEspera = asignaturasEnListaEspera[asig.codigo];

              return (
                <div
                  key={asig.codigo}
                  className={`bg-[#20232A] border rounded-2xl overflow-hidden transition-all ${
                    inscripcionExistente
                      ? 'border-[#31C4D7] shadow-lg'
                      : 'border-[#2D323E] hover:border-slate-600'
                  }`}
                >
                  {/* Encabezado de la Tarjeta */}
                  <div className="p-4 bg-[#1a1d24] border-b border-[#2D323E]">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-black"
                          style={{ backgroundColor: asig.colorDistintivo, color: asig.colorTexto }}
                        >
                          {asig.codigo}
                        </span>
                        <h3 className="font-bold text-sm text-white leading-tight">{asig.nombre}</h3>
                      </div>
                      <span className="text-[11px] font-bold text-slate-400 font-mono">
                        {asig.creditosSCT} SCT
                      </span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[11px]">
                      <span className="text-emerald-400 font-medium">
                        ✓ {asig.prerrequisitos[0]}
                      </span>
                      {inscripcionExistente && (
                        <button
                          onClick={() => desinscribirAsignatura(asig.codigo)}
                          className="text-red-400 text-[11px] font-bold hover:underline"
                        >
                          Desmarcar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Secciones de la Asignatura */}
                  <div className="p-3 space-y-2.5">
                    {asig.secciones.map((sec) => {
                      const estaSeleccionada = estaSeccionInscrita(asig.codigo, sec.id);
                      const estaSinCupo = sec.cuposDisponibles <= 0;

                      return (
                        <div
                          key={sec.id}
                          className={`p-3 rounded-xl border transition-all ${
                            estaSeleccionada
                              ? 'bg-[#13262F] border-[#31C4D7]/50'
                              : 'bg-[#14151A] border-[#2D323E]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white">
                              Sección {sec.numeroSeccion} • {sec.profesor}
                            </span>
                            <span
                              className={`text-[11px] font-bold font-mono ${
                                estaSinCupo ? 'text-red-400' : 'text-slate-300'
                              }`}
                            >
                              {sec.cuposDisponibles}/{sec.cuposTotales} cupos
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 space-y-0.5 mb-3">
                            {sec.horario.map((bloque, indiceBloque) => (
                              <div key={indiceBloque} className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-[#31C4D7]" />
                                <span>
                                  <strong>{bloque.dia}</strong> {bloque.horaInicio}-{bloque.horaFin} ({bloque.sala})
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Botón de Acción */}
                          {estaSinCupo ? (
                            turnoListaEspera ? (
                              <div className="w-full py-2 bg-amber-950/40 text-amber-300 border border-amber-700/50 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                                <span>En Lista de Espera (Turno #{turnoListaEspera})</span>
                              </div>
                            ) : (
                              <button
                                onClick={() => inscribirEnListaEspera(asig.codigo)}
                                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95"
                              >
                                <Users className="w-3.5 h-3.5" />
                                <span>Anotarse en Lista de Espera (Turno #4)</span>
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => seleccionarSeccion(asig, sec)}
                              className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-95 ${
                                estaSeleccionada
                                  ? 'bg-[#31C4D7] text-[#14151A]'
                                  : 'bg-[#20232A] hover:bg-[#2c313c] text-white border border-[#2D323E]'
                              }`}
                            >
                              {estaSeleccionada ? (
                                <>
                                  <Check className="w-4 h-4" />
                                  <span>Sección Seleccionada</span>
                                </>
                              ) : (
                                <span>Seleccionar Sección {sec.numeroSeccion}</span>
                              )}
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* VISTA DEL HORARIO MÓVIL POR DÍA */
          <div className="space-y-4">
            {/* Píldoras Selectoras de Día */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
              {DIAS_DE_LA_SEMANA.map((dia) => (
                <button
                  key={dia}
                  onClick={() => establecerDiaSeleccionado(dia)}
                  className={`flex-1 py-2 px-2 text-xs font-bold rounded-xl transition-all text-center ${
                    diaSeleccionado === dia
                      ? 'bg-[#31C4D7] text-[#14151A] shadow-md'
                      : 'bg-[#20232A] text-slate-400 hover:text-white border border-[#2D323E]'
                  }`}
                >
                  {dia.substring(0, 3).toUpperCase()}
                </button>
              ))}
            </div>

            {/* Bloques para el día seleccionado */}
            <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-4 divide-y divide-[#2D323E]">
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
                  <div key={bloque.indice} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
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
                        <div className="flex items-center justify-between text-[11px] text-white/90 mt-2 pt-1 border-t border-white/20">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {bloqueHorario.sala}
                          </span>
                          <span>{coincidencia.seccion.profesor}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="py-2 text-center text-slate-600 text-xs border border-dashed border-[#2D323E] rounded-xl">
                        Sin actividad programada
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Barra Inferior Fija para Confirmación Móvil */}
      <div className="fixed bottom-16 left-0 right-0 bg-[#14151A]/95 backdrop-blur-md border-t border-[#2D323E] p-3 z-20 flex items-center justify-between gap-3 max-w-md mx-auto">
        <div>
          <span className="text-[10px] text-slate-400 block font-semibold uppercase">
            Créditos:
          </span>
          <span className="text-sm font-extrabold text-[#31C4D7] font-mono">
            {totalCreditosSCT} / 30 SCT
          </span>
        </div>

        <button
          onClick={confirmarInscripcionCurricular}
          disabled={asignaturasInscritas.length === 0}
          className={`px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shadow-md active:scale-95 flex items-center gap-1.5 ${
            asignaturasInscritas.length > 0
              ? 'bg-[#31C4D7] text-[#14151A] hover:bg-[#28b2c4]'
              : 'bg-[#20232A] text-slate-500 cursor-not-allowed border border-[#2D323E]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Confirmar Carga</span>
        </button>
      </div>
    </div>
  );
};
