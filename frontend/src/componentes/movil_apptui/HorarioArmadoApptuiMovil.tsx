import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  FileText,
  Home,
  User,
  BookOpen,
  Printer,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { BLOQUES_HORARIOS_OFICIALES, DIAS_DE_LA_SEMANA, ASIGNATURAS_INICIALES_5TO_SEMESTRE } from '../../datos';
import type { DiaSemana, AsignaturaInscrita } from '../../tipos';

export const HorarioArmadoApptuiMovil: React.FC = () => {
  const {
    estudiante,
    asignaturasInscritas,
    totalCreditosSCT,
    establecerPasoActual,
  } = usarTomaRamos();

  const [diaSeleccionado, setDiaSeleccionado] = useState<DiaSemana>('Lunes');
  const [vistaModo, setVistaModo] = useState<'DIA' | 'LISTA'>('DIA');

  // Si no hay asignaturas inscritas aún (ej. salto directo desde la barra de desarrollo),
  // mostramos las asignaturas sugeridas del 5.° semestre como horario proyectado.
  const listaAsignaturas: AsignaturaInscrita[] =
    asignaturasInscritas.length > 0
      ? asignaturasInscritas
      : ASIGNATURAS_INICIALES_5TO_SEMESTRE.map((asig) => ({
          asignatura: asig,
          seccion: asig.secciones[0],
        }));

  const creditos =
    asignaturasInscritas.length > 0
      ? totalCreditosSCT
      : listaAsignaturas.reduce((acc, curr) => acc + curr.asignatura.creditosSCT, 0);

  // Buscar si hay clase en un bloque específico
  const obtenerClaseEnBloque = (dia: DiaSemana, indiceBloque: number) => {
    for (const item of listaAsignaturas) {
      const bloque = item.seccion.horario.find(
        (b) => b.dia === dia && b.indiceBloque === indiceBloque
      );
      if (bloque) {
        return { item, bloque };
      }
    }
    return null;
  };

  // Contar cuántas clases hay por día
  const contarClasesPorDia = (dia: DiaSemana) => {
    let cuenta = 0;
    for (let i = 0; i < 6; i++) {
      if (obtenerClaseEnBloque(dia, i)) cuenta++;
    }
    return cuenta;
  };

  return (
    <div className="p-3.5 space-y-3.5 animate-fadeIn text-slate-100 select-none pb-24">
      {/* Botón Superior de Navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => establecerPasoActual('PORTAL_ALUMNOS')}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#20232A] text-slate-300 hover:text-white border border-[#2D323E] rounded-xl text-xs font-semibold active:scale-95 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al Inicio</span>
        </button>

        <span className="px-2.5 py-1 bg-emerald-950/80 text-emerald-400 border border-emerald-800 rounded-full text-[10px] font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>Horario Oficial 2026-1</span>
        </span>
      </div>

      {/* Banner Principal de Confirmación */}
      <div className="bg-gradient-to-br from-[#0c4055] via-[#112d3b] to-[#14151A] border-2 border-[#31C4D7]/50 rounded-3xl p-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-1.5">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#13262F] text-[#31C4D7] rounded-full text-[10px] font-black uppercase tracking-wider border border-[#31C4D7]/30">
            <Sparkles className="w-3 h-3 text-[#31C4D7]" />
            Carga Académica Estructurada
          </span>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/60">
            0 Topes
          </span>
        </div>

        <h2 className="text-base font-black text-white leading-tight">
          Horario Semanal de Clases
        </h2>
        <p className="text-xs text-slate-300 mt-0.5 leading-snug">
          {estudiante.carrera} • Casa Central
        </p>

        {asignaturasInscritas.length === 0 && (
          <div className="mt-2 p-2 bg-[#20232A]/90 border border-[#31C4D7]/30 rounded-xl text-[10px] text-amber-300 flex items-center gap-1.5">
            <span>ℹ️</span>
            <span>Mostrando proyección sugerida de 5.° semestre (sin inscripción previa).</span>
          </div>
        )}
      </div>

      {/* Cuadrícula de 4 Métricas Clave (2x2) */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Asignaturas
          </span>
          <div className="text-xl font-black text-white mt-0.5">
            {listaAsignaturas.length}
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            100% Cupos Confirmados
          </span>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Créditos
          </span>
          <div className="text-xl font-black text-[#31C4D7] font-mono mt-0.5">
            {creditos} <span className="text-[10px] font-normal text-slate-400">/ 30 SCT</span>
          </div>
          <span className="text-[10px] text-slate-400 font-semibold block">
            Carga Semestral Óptima
          </span>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Topes de Horario
          </span>
          <div className="text-xl font-black text-emerald-400 mt-0.5">
            0
          </div>
          <span className="text-[10px] text-emerald-400 font-semibold block">
            Validación Preventiva
          </span>
        </div>

        <div className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3 shadow-md">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Estado Alumno
          </span>
          <div className="text-xs font-black text-emerald-400 mt-1 uppercase tracking-tight">
            REGULAR ACTIVO
          </div>
          <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
            {estudiante.rut}
          </span>
        </div>
      </div>

      {/* Selector de Modo: Vista por Día vs. Lista de Cátedras */}
      <div className="grid grid-cols-2 gap-1 bg-[#14151A] p-1 rounded-2xl border border-[#2D323E]">
        <button
          onClick={() => setVistaModo('DIA')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            vistaModo === 'DIA'
              ? 'bg-[#20232A] text-[#31C4D7] shadow-md border border-[#31C4D7]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Vista por Día</span>
        </button>

        <button
          onClick={() => setVistaModo('LISTA')}
          className={`py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            vistaModo === 'LISTA'
              ? 'bg-[#20232A] text-[#31C4D7] shadow-md border border-[#31C4D7]/30'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Lista Cátedras ({listaAsignaturas.length})</span>
        </button>
      </div>

      {/* VISTA 1: HORARIO POR DÍA (LUN, MAR, MIÉ, JUE, VIE) */}
      {vistaModo === 'DIA' ? (
        <div className="space-y-3">
          {/* Píldoras Selectoras de Día */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1">
            {DIAS_DE_LA_SEMANA.map((dia) => {
              const numClases = contarClasesPorDia(dia);
              const estaActivo = diaSeleccionado === dia;

              return (
                <button
                  key={dia}
                  onClick={() => setDiaSeleccionado(dia)}
                  className={`flex-1 py-2 px-1 rounded-2xl transition-all text-center flex flex-col items-center justify-center ${
                    estaActivo
                      ? 'bg-[#31C4D7] text-slate-950 shadow-lg font-black'
                      : 'bg-[#20232A] text-slate-400 hover:text-white border border-[#2D323E]'
                  }`}
                >
                  <span className="text-xs uppercase font-extrabold">
                    {dia.substring(0, 3)}
                  </span>
                  <span
                    className={`text-[9px] mt-0.5 px-1.5 rounded-full font-bold ${
                      estaActivo
                        ? 'bg-black/20 text-slate-950'
                        : numClases > 0
                        ? 'bg-[#13262F] text-[#31C4D7]'
                        : 'text-slate-600'
                    }`}
                  >
                    {numClases} {numClases === 1 ? 'clase' : 'clases'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bloques del Día Seleccionado (Bloques 1 al 6) */}
          <div className="bg-[#20232A] border border-[#2D323E] rounded-3xl p-3.5 space-y-2.5 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#2D323E] text-xs">
              <span className="font-extrabold text-white">
                Programación del {diaSeleccionado}
              </span>
              <span className="text-[11px] text-[#31C4D7] font-semibold">
                {contarClasesPorDia(diaSeleccionado)} actividades
              </span>
            </div>

            <div className="space-y-2">
              {BLOQUES_HORARIOS_OFICIALES.map((bloque) => {
                const clase = obtenerClaseEnBloque(diaSeleccionado, bloque.indice);

                return (
                  <div
                    key={bloque.indice}
                    className={`rounded-2xl border transition-all ${
                      clase
                        ? 'bg-[#14151A] border-[#31C4D7]/40 shadow-sm p-3'
                        : 'bg-[#14151A]/40 border-dashed border-[#2D323E] p-2.5'
                    }`}
                  >
                    {/* Encabezado del bloque */}
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <div className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3 h-3 text-[#31C4D7]" />
                        <span className="font-bold text-slate-300">
                          Bloque {bloque.indice + 1}
                        </span>
                        <span>•</span>
                        <span className="font-mono text-slate-400">{bloque.horario}</span>
                      </div>

                      {clase && (
                        <span className="px-1.5 py-0.2 bg-[#13262F] text-[#31C4D7] text-[9px] font-black rounded border border-[#31C4D7]/30">
                          Sec. {clase.item.seccion.numeroSeccion}
                        </span>
                      )}
                    </div>

                    {clase ? (
                      <div className="space-y-2 pt-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider flex-shrink-0"
                              style={{
                                backgroundColor: clase.item.asignatura.colorDistintivo,
                                color: clase.item.asignatura.colorTexto,
                              }}
                            >
                              {clase.item.asignatura.codigo}
                            </span>
                            <h4 className="font-extrabold text-xs text-white truncate leading-tight">
                              {clase.item.asignatura.nombre}
                            </h4>
                          </div>

                          <span className="text-[10px] font-bold text-slate-400 font-mono flex-shrink-0">
                            {clase.item.asignatura.creditosSCT} SCT
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-[#2D323E]/60 text-slate-300">
                          <div className="flex items-center gap-1 truncate">
                            <MapPin className="w-3 h-3 text-[#31C4D7] flex-shrink-0" />
                            <span className="font-semibold text-white truncate">
                              {clase.bloque.sala}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 truncate justify-end">
                            <User className="w-3 h-3 text-slate-400 flex-shrink-0" />
                            <span className="truncate max-w-[130px]">
                              {clase.item.seccion.profesor.replace('Prof. ', '')}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 font-medium pl-5 italic">
                        Sin actividad programada en este bloque
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA 2: LISTA DE CÁTEDRAS INSCRITAS */
        <div className="space-y-2.5">
          {listaAsignaturas.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#20232A] border border-[#2D323E] rounded-2xl p-3.5 space-y-2 shadow-md"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="px-2 py-0.5 rounded text-[10px] font-black tracking-wider flex-shrink-0"
                    style={{
                      backgroundColor: item.asignatura.colorDistintivo,
                      color: item.asignatura.colorTexto,
                    }}
                  >
                    {item.asignatura.codigo}
                  </span>
                  <h4 className="font-extrabold text-xs text-white truncate leading-tight">
                    {item.asignatura.nombre}
                  </h4>
                </div>

                <span className="px-2 py-0.5 bg-[#13262F] text-[#31C4D7] border border-[#31C4D7]/40 rounded-md text-[10px] font-bold font-mono flex-shrink-0">
                  {item.asignatura.creditosSCT} SCT
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-300">
                <span className="font-bold text-emerald-400">
                  Sección {item.seccion.numeroSeccion}
                </span>
                <span className="text-slate-400 text-[10px] truncate max-w-[180px]">
                  {item.seccion.profesor}
                </span>
              </div>

              {/* Horario Programado */}
              <div className="bg-[#14151A] p-2 rounded-xl border border-[#2D323E]/60 space-y-1 text-[10px]">
                {item.seccion.horario.map((bloque, bIdx) => (
                  <div key={bIdx} className="flex items-center justify-between text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-[#31C4D7]" />
                      <strong className="text-white">{bloque.dia}</strong>
                      <span>{bloque.horaInicio} - {bloque.horaFin}</span>
                    </div>
                    <span className="flex items-center gap-1 text-slate-400">
                      <MapPin className="w-2.5 h-2.5 text-slate-500" />
                      {bloque.sala}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botones de Acción al Pie */}
      <div className="space-y-2 pt-2">
        <button
          onClick={() => establecerPasoActual('COMPROBANTE_OFICIAL')}
          className="w-full py-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <FileText className="w-4 h-4" />
          <span>Ver Comprobante Oficial QR</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => window.print()}
            className="py-2.5 px-3 bg-[#20232A] hover:bg-[#282d37] text-white border border-[#2D323E] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-[#31C4D7]" />
            <span>Imprimir Horario</span>
          </button>

          <button
            onClick={() => establecerPasoActual('PORTAL_ALUMNOS')}
            className="py-2.5 px-3 bg-[#20232A] hover:bg-[#282d37] text-white border border-[#2D323E] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Home className="w-3.5 h-3.5 text-[#31C4D7]" />
            <span>Volver a Inicio</span>
          </button>
        </div>
      </div>
    </div>
  );
};
