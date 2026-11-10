import React, { useState } from 'react';
import {
  Check,
  Users,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Search,
  BookOpen,
  Filter,
  Lock,
  Sparkles,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { evaluarPrerrequisitosEstudiante } from '../../utilidades';

export const SelectorAsignaturasWeb: React.FC = () => {
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
    filtroSemestre,
    establecerFiltroSemestre,
  } = usarTomaRamos();

  const [busqueda, setBusqueda] = useState<string>('');

  const estaSeccionInscrita = (codigoAsignatura: string, seccionId: string) => {
    return asignaturasInscritas.some(
      (item) => item.asignatura.codigo === codigoAsignatura && item.seccion.id === seccionId
    );
  };

  // Filtrado reactivo por semestre y por texto
  const asignaturasFiltradas = asignaturas.filter((asig) => {
    if (filtroSemestre !== 'TODOS' && asig.semestre !== filtroSemestre) {
      return false;
    }
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase().trim();
      const coincideCodigo = asig.codigo.toLowerCase().includes(q);
      const coincideNombre = asig.nombre.toLowerCase().includes(q);
      const coincidePrerreq = asig.prerrequisitos.some((p) => p.toLowerCase().includes(q));
      return coincideCodigo || coincideNombre || coincidePrerreq;
    }
    return true;
  });

  const semestresDisponibles: Array<{ id: number | 'TODOS'; etiqueta: string }> = [
    { id: 'TODOS', etiqueta: 'Todos' },
    { id: 1, etiqueta: 'Sem 1' },
    { id: 2, etiqueta: 'Sem 2' },
    { id: 3, etiqueta: 'Sem 3' },
    { id: 4, etiqueta: 'Sem 4' },
    { id: 5, etiqueta: 'Sem 5' },
    { id: 6, etiqueta: 'Sem 6' },
    { id: 7, etiqueta: 'Sem 7' },
    { id: 8, etiqueta: 'Sem 8' },
    { id: 9, etiqueta: 'Sem 9' },
    { id: 10, etiqueta: 'Sem 10' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        {/* Cabecera Principal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                Oferta Curricular UV •{' '}
                {filtroSemestre === 'TODOS'
                  ? 'Malla Completa (61 Ramos)'
                  : `${filtroSemestre}.° Semestre`}
              </h2>
              <span className="px-2 py-0.5 bg-sky-100 text-[#004A77] rounded text-[11px] font-bold">
                {asignaturasFiltradas.length} asignaturas
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {estudiante.carrera} • Estudiante: <strong>{estudiante.nombre}</strong> (Semestre {estudiante.semestreActual})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Carga proyectada:</span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold font-mono border ${
                totalCreditosSCT > 30
                  ? 'bg-red-50 text-red-700 border-red-200'
                  : 'bg-sky-50 text-[#004A77] border-sky-200'
              }`}
            >
              {totalCreditosSCT} / 30 Créditos SCT
            </span>
          </div>
        </div>

        {/* Barra de Filtros: Pestañas de Semestres + Buscador */}
        <div className="mt-4 space-y-3">
          {/* Fila de Filtro por Semestres */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-bold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              Nivel:
            </span>
            {semestresDisponibles.map((sem) => {
              const esActivo = filtroSemestre === sem.id;
              const esSemestreAlumno = sem.id === estudiante.semestreActual;
              return (
                <button
                  key={sem.id}
                  onClick={() => establecerFiltroSemestre(sem.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                    esActivo
                      ? 'bg-[#004A77] text-white shadow-sm ring-2 ring-[#004A77]/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  <span>{sem.etiqueta}</span>
                  {esSemestreAlumno && (
                    <span
                      className={`text-[9px] px-1 py-0.2 rounded-full font-extrabold ${
                        esActivo ? 'bg-sky-400 text-slate-950' : 'bg-emerald-100 text-emerald-800'
                      }`}
                      title="Semestre actual del estudiante autenticado"
                    >
                      ★ Mi nivel
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Campo de Búsqueda Reactiva */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por código (ej. INF 110, MAT 111) o nombre de asignatura..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
            />
            {busqueda && (
              <button
                onClick={() => setBusqueda('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕ Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Lista de Asignaturas */}
        <div className="space-y-4 mt-5">
          {asignaturasFiltradas.length === 0 ? (
            <div className="text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No se encontraron asignaturas</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No hay asignaturas que coincidan con el filtro de nivel seleccionado o con el término "{busqueda}".
              </p>
              <button
                onClick={() => {
                  establecerFiltroSemestre('TODOS');
                  setBusqueda('');
                }}
                className="mt-3 px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-[#004A77] rounded-lg text-xs font-bold transition-colors cursor-pointer"
              >
                Restablecer filtros (Ver todas)
              </button>
            </div>
          ) : (
            asignaturasFiltradas.map((asig) => {
              const inscripcionExistente = asignaturasInscritas.find(
                (item) => item.asignatura.codigo === asig.codigo
              );
              const turnoListaEspera = asignaturasEnListaEspera[asig.codigo];
              const evalPrerreq = evaluarPrerrequisitosEstudiante(asig, estudiante);

              return (
                <div
                  key={asig.codigo}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    inscripcionExistente
                      ? 'border-blue-300 bg-blue-50/20 shadow-md'
                      : !evalPrerreq.habilitado
                      ? 'border-amber-200 bg-amber-50/20 hover:border-amber-300'
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
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 text-sm">{asig.nombre}</h3>
                          <span className="text-[10px] font-bold text-slate-600 bg-slate-200/90 px-2 py-0.5 rounded-full">
                            Semestre {asig.semestre}
                          </span>
                          <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-2 py-0.5 rounded-full">
                            {asig.creditosSCT} Créditos SCT
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] mt-1">
                          <span className="text-slate-500 font-medium">
                            Prerrequisitos: {asig.prerrequisitos.join(', ')}
                          </span>
                          <span>•</span>
                          {evalPrerreq.habilitado ? (
                            evalPrerreq.esReglaEspecial39 ? (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1 shadow-xs">
                                <Sparkles className="w-3 h-3 text-amber-600" />
                                <span>Habilitado por Regla UV 3.9 (Gracia)</span>
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1">
                                ✓ Habilitado (Aprobado)
                              </span>
                            )
                          ) : (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1"
                              title={evalPrerreq.motivo}
                            >
                              <Lock className="w-3 h-3 text-red-600" />
                              <span>Pendiente (Nota {evalPrerreq.notaObtenida ?? 's/n'} &lt; 3.9)</span>
                            </span>
                          )}
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
                          className="text-xs text-red-600 hover:text-red-800 hover:underline font-semibold ml-1 cursor-pointer"
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
                                  className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold rounded-xl text-xs transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                                >
                                  <Users className="w-3.5 h-3.5" />
                                  Anotarse en Lista de Espera (Turno #4)
                                </button>
                              )
                            ) : !evalPrerreq.habilitado ? (
                              <button
                                onClick={() => seleccionarSeccion(asig, sec)}
                                className="px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-800 border border-red-200 cursor-pointer"
                                title={evalPrerreq.motivo}
                              >
                                <Lock className="w-3.5 h-3.5 text-red-600" />
                                <span>Bloqueado (Ver Motivo)</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => seleccionarSeccion(asig, sec)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer ${
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
            })
          )}
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
