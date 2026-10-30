import React from 'react';
import { Check, Users, ShieldCheck, CheckCircle2, Clock } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const SelectorAsignaturasWeb: React.FC = () => {
  const {
    asignaturas,
    asignaturasInscritas,
    seleccionarSeccion,
    desinscribirAsignatura,
    inscribirEnListaEspera,
    asignaturasEnListaEspera,
    confirmarInscripcionCurricular,
    totalCreditosSCT,
  } = usarTomaRamos();

  const estaSeccionInscrita = (codigoAsignatura: string, seccionId: string) => {
    return asignaturasInscritas.some(
      (item) => item.asignatura.codigo === codigoAsignatura && item.seccion.id === seccionId
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Oferta Académica • 5.° Semestre
            </h2>
            <p className="text-xs text-slate-500">
              Ingeniería Civil Informática • Malla Curricular 5125 UV
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Total seleccionado:</span>
            <span className="px-3 py-1 bg-sky-50 text-[#004A77] border border-sky-200 rounded-full text-xs font-bold font-mono">
              {totalCreditosSCT} / 30 Créditos
            </span>
          </div>
        </div>

        {/* Lista de Asignaturas */}
        <div className="space-y-5 mt-5">
          {asignaturas.map((asig) => {
            const inscripcionExistente = asignaturasInscritas.find(
              (item) => item.asignatura.codigo === asig.codigo
            );
            const turnoListaEspera = asignaturasEnListaEspera[asig.codigo];

            return (
              <div
                key={asig.codigo}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  inscripcionExistente
                    ? 'border-blue-300 bg-blue-50/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Encabezado de la Asignatura */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/70 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <span
                      className="px-2.5 py-1 text-xs font-black rounded-lg shadow-sm"
                      style={{ backgroundColor: asig.colorDistintivo, color: asig.colorTexto }}
                    >
                      {asig.codigo}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-sm">{asig.nombre}</h3>
                        <span className="text-[11px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
                          {asig.creditosSCT} Créditos SCT
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          ✓ Prerrequisito Cumplido: {asig.prerrequisitos.join(', ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {inscripcionExistente && (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        Inscrita (Sec. {inscripcionExistente.seccion.numeroSeccion})
                      </span>
                      <button
                        onClick={() => desinscribirAsignatura(asig.codigo)}
                        className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold ml-1"
                      >
                        Desmarcar
                      </button>
                    </div>
                  )}
                </div>

                {/* Lista de Secciones Disponibles */}
                <div className="p-4 sm:p-5 divide-y divide-slate-100">
                  {asig.secciones.map((sec) => {
                    const estaSeleccionada = estaSeccionInscrita(asig.codigo, sec.id);
                    const estaSinCupo = sec.cuposDisponibles <= 0;

                    return (
                      <div
                        key={sec.id}
                        className={`py-3 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                          estaSeleccionada ? 'bg-sky-50/50 p-3 rounded-xl' : ''
                        }`}
                      >
                        {/* Información de la sección */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs px-2 py-0.5 bg-slate-100 text-slate-800 rounded">
                              Sección {sec.numeroSeccion}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">
                              {sec.profesor}
                            </span>
                          </div>

                          {/* Bloques horarios */}
                          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 pt-1">
                            {sec.horario.map((bloque, indiceBloque) => (
                              <span
                                key={indiceBloque}
                                className="inline-flex items-center gap-1 bg-slate-100/90 text-slate-700 px-2 py-1 rounded-md text-[11px]"
                              >
                                <Clock className="w-3 h-3 text-slate-400" />
                                <strong>{bloque.dia}:</strong> {bloque.horaInicio}-{bloque.horaFin} ({bloque.sala})
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Estado de Cupos y Botón de Acción */}
                        <div className="flex items-center justify-between md:justify-end gap-4 flex-shrink-0">
                          {/* Medidor de Cupos */}
                          <div className="text-right">
                            <span className="text-[11px] text-slate-400 block font-medium">Cupos:</span>
                            <div className="flex items-center gap-1 text-xs">
                              <span
                                className={`font-extrabold ${
                                  estaSinCupo ? 'text-red-600' : 'text-slate-800'
                                }`}
                              >
                                {sec.cuposDisponibles}
                              </span>
                              <span className="text-slate-400">/ {sec.cuposTotales}</span>
                            </div>
                          </div>

                          {/* Botón */}
                          {estaSinCupo ? (
                            turnoListaEspera ? (
                              <span className="px-3.5 py-2 bg-amber-100 text-amber-900 border border-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
                                En Lista de Espera (Turno #{turnoListaEspera})
                              </span>
                            ) : (
                              <button
                                onClick={() => inscribirEnListaEspera(asig.codigo)}
                                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                              >
                                <Users className="w-3.5 h-3.5" />
                                Anotarse en Lista de Espera (Turno #4)
                              </button>
                            )
                          ) : (
                            <button
                              onClick={() => seleccionarSeccion(asig, sec)}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 ${
                                estaSeleccionada
                                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                  : 'bg-[#004A77] text-white hover:bg-[#003859]'
                              }`}
                            >
                              {estaSeleccionada ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Seleccionada
                                </>
                              ) : (
                                'Inscribir Sección'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barra Inferior de Confirmación Atómica */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-600 space-y-0.5 text-center sm:text-left">
            <p>
              Asignaturas seleccionadas: <strong>{asignaturasInscritas.length}</strong> • Total créditos:{' '}
              <strong className="text-[#004A77] font-bold">{totalCreditosSCT} SCT</strong>
            </p>
            <p className="text-[11px] text-slate-400">
              Al confirmar, se ejecuta una transacción atómica protegida en la base de datos UV.
            </p>
          </div>

          <button
            onClick={confirmarInscripcionCurricular}
            disabled={asignaturasInscritas.length === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-extrabold text-sm transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${
              asignaturasInscritas.length > 0
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Confirmar y Guardar Carga Curricular
          </button>
        </div>
      </div>
    </div>
  );
};
