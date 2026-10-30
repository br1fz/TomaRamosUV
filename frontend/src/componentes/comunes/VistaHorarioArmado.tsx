import React from 'react';
import {
  Calendar,
  Printer,
  FileText,
  Home,
  MapPin,
  GraduationCap,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { BLOQUES_HORARIOS_OFICIALES, DIAS_DE_LA_SEMANA } from '../../datos';
import type { DiaSemana } from '../../tipos';

export const VistaHorarioArmado: React.FC = () => {
  const { estudiante, asignaturasInscritas, totalCreditosSCT, establecerPasoActual, modoVisualizacion } = usarTomaRamos();

  const obtenerInscripcionEnBloque = (dia: DiaSemana, indiceBloque: number) => {
    for (const item of asignaturasInscritas) {
      const bloque = item.seccion.horario.find(
        (b) => b.dia === dia && b.indiceBloque === indiceBloque
      );
      if (bloque) {
        return { item, bloque };
      }
    }
    return null;
  };

  const manejarImpresion = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6 animate-fadeIn">
      {/* Banner Superior: Éxito y Confirmación */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-[#004A77] text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-300 animate-ping" />
              <span className="text-xs font-black uppercase tracking-wider text-emerald-100">
                Transacción Atómica Confirmada
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Horario Armado y Estructurado 2026-1
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
              ¡Felicitaciones, <strong>{estudiante.nombre}</strong>! Tus cambios curriculares han sido
              registrados exitosamente en los servidores de la Universidad de Valparaíso.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={manejarImpresion}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all print:hidden"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir Horario</span>
            </button>
            <button
              onClick={() => establecerPasoActual('COMPROBANTE_OFICIAL')}
              className="px-4 py-2.5 bg-[#004A77] hover:bg-[#003859] text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md border border-white/20 active:scale-95 transition-all print:hidden"
            >
              <FileText className="w-4 h-4" />
              <span>Comprobante QR</span>
            </button>
            <button
              onClick={() => establecerPasoActual('INICIO_PORTAL')}
              className="px-5 py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-black rounded-xl text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all print:hidden"
            >
              <Home className="w-4 h-4" />
              <span>
                {modoVisualizacion === 'MOVIL_APPTUI'
                  ? 'Finalizar y Volver a APPTUI UV'
                  : 'Finalizar y Volver a Mi Portal UV'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas KPI de Resumen */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Asignaturas Inscritas
          </span>
          <span className="text-2xl font-black text-slate-900">{asignaturasInscritas.length}</span>
          <span className="text-xs text-emerald-600 font-medium block mt-0.5">
            100% Cupos Confirmados
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Total Créditos SCT
          </span>
          <span className="text-2xl font-black text-[#004A77] font-mono">
            {totalCreditosSCT} <span className="text-xs text-slate-400 font-normal">/ 30 SCT</span>
          </span>
          <span className="text-xs text-slate-500 font-medium block mt-0.5">
            Carga Semestral Óptima
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Topes de Horario
          </span>
          <span className="text-2xl font-black text-emerald-600">0</span>
          <span className="text-xs text-emerald-700 font-medium block mt-0.5">
            Validación Preventiva Exitosa
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Estado de Matrícula
          </span>
          <span className="text-xs font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-md inline-block mt-1">
            REGULAR ACTIVO
          </span>
          <span className="text-[11px] text-slate-400 font-mono block mt-1">
            RUN: {estudiante.rut}
          </span>
        </div>
      </div>

      {/* Malla Semanal Estructurada de Clases */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 overflow-hidden">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#004A77]" />
            <h2 className="text-base font-extrabold text-slate-900">
              Malla Semanal de Clases (Lunes a Viernes 08:30 - 19:00 hrs)
            </h2>
          </div>
          <span className="text-xs text-slate-500 hidden sm:block">
            Casa Central • Facultad de Ingeniería UV
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[750px] text-xs">
            <thead>
              <tr className="bg-[#004A77] text-white">
                <th className="py-3 px-3 text-left font-bold w-32 rounded-tl-xl">Bloque / Hora</th>
                {DIAS_DE_LA_SEMANA.map((dia, indiceDia) => (
                  <th
                    key={dia}
                    className={`py-3 px-3 text-center font-bold ${
                      indiceDia === DIAS_DE_LA_SEMANA.length - 1 ? 'rounded-tr-xl' : ''
                    }`}
                  >
                    {dia}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {BLOQUES_HORARIOS_OFICIALES.map((bloque) => (
                <tr key={bloque.indice} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-3 bg-slate-50 font-mono font-semibold text-slate-600 border-r border-slate-200 text-center">
                    <div className="text-xs font-bold text-slate-800">Bloque {bloque.indice + 1}</div>
                    <div className="text-[10px] text-slate-500">{bloque.horario}</div>
                  </td>

                  {DIAS_DE_LA_SEMANA.map((dia) => {
                    const coincidencia = obtenerInscripcionEnBloque(dia, bloque.indice);

                    return (
                      <td
                        key={dia}
                        className="p-1.5 border-r border-slate-200 last:border-r-0 align-top h-24"
                      >
                        {coincidencia ? (
                          <div
                            className="h-full p-2.5 rounded-2xl text-white shadow-md flex flex-col justify-between transition-transform hover:scale-[1.02]"
                            style={{ backgroundColor: coincidencia.item.asignatura.colorDistintivo }}
                          >
                            <div>
                              <div className="flex items-center justify-between gap-1">
                                <span className="font-black text-xs tracking-wide">
                                  {coincidencia.item.asignatura.codigo}
                                </span>
                                <span className="text-[10px] font-bold px-1.5 py-0.2 bg-black/20 rounded">
                                  Sec. {coincidencia.item.seccion.numeroSeccion}
                                </span>
                              </div>
                              <p className="text-xs font-semibold leading-tight truncate mt-0.5">
                                {coincidencia.item.asignatura.nombre}
                              </p>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-white/90 pt-1 border-t border-white/20 mt-1">
                              <span className="flex items-center gap-1 font-semibold truncate">
                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                {coincidencia.bloque.sala}
                              </span>
                              <span className="truncate max-w-[90px]">
                                {coincidencia.item.seccion.profesor.replace('Prof. ', '')}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full rounded-xl border border-dashed border-slate-200/90 flex items-center justify-center text-[10px] text-slate-300">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Tabla de Detalle Consolidado de Cátedras */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <h3 className="font-extrabold text-sm text-slate-900 mb-4 flex items-center gap-2">
          <GraduationCap className="w-4 h-4 text-[#004A77]" />
          <span>Detalle de Cátedras y Docentes Asignados</span>
        </h3>

        <div className="divide-y divide-slate-100">
          {asignaturasInscritas.map((item) => (
            <div
              key={item.asignatura.codigo}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-1 rounded-lg text-white font-black text-xs"
                  style={{ backgroundColor: item.asignatura.colorDistintivo }}
                >
                  {item.asignatura.codigo}
                </span>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm">{item.asignatura.nombre}</h4>
                  <p className="text-slate-500 text-xs">
                    Docente: <strong>{item.seccion.profesor}</strong> • Sección {item.seccion.numeroSeccion}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-left sm:text-right text-[11px] text-slate-600">
                  {item.seccion.horario.map((bloque, indice) => (
                    <div key={indice}>
                      <strong>{bloque.dia}</strong> {bloque.horaInicio}-{bloque.horaFin} ({bloque.sala})
                    </div>
                  ))}
                </div>

                <div className="text-right font-mono font-bold text-sm text-[#004A77] bg-slate-50 px-3 py-1 rounded-xl">
                  {item.asignatura.creditosSCT} SCT
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de Retorno al Menú Principal */}
      <div className="pt-4 text-center print:hidden">
        <button
          onClick={() => establecerPasoActual('INICIO_PORTAL')}
          className="px-8 py-4 bg-[#004A77] hover:bg-[#003859] text-white font-black text-sm rounded-2xl shadow-xl active:scale-95 transition-all inline-flex items-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>
            {modoVisualizacion === 'MOVIL_APPTUI'
              ? 'Finalizar y Regresar al Menú Principal de APPTUI UV'
              : 'Finalizar y Regresar al Menú Principal de Portal UV'}
          </span>
        </button>
      </div>
    </div>
  );
};
