import React from 'react';
import {
  BookOpen,
  Calendar,
  CreditCard,
  FileText,
  GraduationCap,
  CheckCircle2,
  ArrowRight,
  Clock,
  Sparkles,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const InicioPortalAlumnosWeb: React.FC = () => {
  const {
    estudiante,
    establecerPasoActual,
    asignaturasInscritas,
    totalCreditosSCT,
    estaInscripcionCompletada,
  } = usarTomaRamos();

  const modulosAcademicos = [
    {
      titulo: 'Toma de Ramos 2026-1',
      descripcion: 'Inscripción curricular por sala de espera virtual',
      icono: BookOpen,
      distintivo: estaInscripcionCompletada ? 'COMPLETADO' : 'HABILITADO',
      colorDistintivo: estaInscripcionCompletada
        ? 'bg-emerald-100 text-emerald-800'
        : 'bg-amber-100 text-amber-800',
      accion: () => establecerPasoActual(estaInscripcionCompletada ? 'HORARIO_ARMADO' : 'INICIO_SESION_SSO'),
      destacado: true,
    },
    {
      titulo: 'Mis Asignaturas',
      descripcion: 'Revisa cátedras inscritas, notas y asistencia',
      icono: GraduationCap,
      accion: () => estaInscripcionCompletada && establecerPasoActual('HORARIO_ARMADO'),
    },
    {
      titulo: 'Horario Semanal',
      descripcion: 'Visualización gráfica de bloques y salas de clases',
      icono: Calendar,
      accion: () => estaInscripcionCompletada && establecerPasoActual('HORARIO_ARMADO'),
    },
    {
      titulo: 'Simulador Académico',
      descripcion: 'Proyección curricular y cálculo de avance',
      icono: Clock,
    },
    {
      titulo: 'Situación Arancelaria',
      descripcion: 'Convenios, pagarés y pagos de matrícula',
      icono: CreditCard,
    },
    {
      titulo: 'Mis Certificados',
      descripcion: 'Alumno regular, notas y concentración académica',
      icono: FileText,
      accion: () => estaInscripcionCompletada && establecerPasoActual('COMPROBANTE_OFICIAL'),
    },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner de Bienvenida y Acción Principal */}
      <div className="bg-gradient-to-r from-[#004A77] via-[#003859] to-[#0284c7] text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-[-40px] top-[-40px] opacity-10 pointer-events-none">
          <img src="/uv_azul.svg" alt="" className="w-80 h-80 invert brightness-0" />
        </div>

        <div className="max-w-3xl relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs uppercase font-bold tracking-wider text-sky-200">
              Período Académico Activo • Primer Semestre 2026
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
            ¡Hola, {estudiante.nombre.split(' ')[0]}! Bienvenido al Portal Académico UV
          </h1>

          <p className="text-xs sm:text-sm text-sky-100 leading-relaxed mb-6 max-w-2xl">
            {estudiante.carrera} • {estudiante.planCurricular} • Casa Central, Valparaíso
          </p>

          {/* Banner Condicional: Inscripción Completada vs Pendiente */}
          {estaInscripcionCompletada ? (
            <div className="bg-emerald-950/60 border border-emerald-400/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-300">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white">
                    Carga Curricular 2026-1 Guardada Exitosamente
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Has inscrito {asignaturasInscritas.length} asignaturas ({totalCreditosSCT} créditos SCT).
                    Tu horario semanal ya se encuentra consolidado.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => establecerPasoActual('HORARIO_ARMADO')}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Ver Horario Armado</span>
                </button>
                <button
                  onClick={() => establecerPasoActual('COMPROBANTE_OFICIAL')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-xs transition-all border border-white/20 flex items-center gap-1.5"
                >
                  <FileText className="w-4 h-4" />
                  <span>Comprobante QR</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white/10 border border-white/20 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-white flex items-center gap-2">
                    <span>Toma de Ramos Primer Semestre 2026</span>
                    <span className="text-[10px] px-2 py-0.5 bg-amber-400 text-slate-900 rounded font-black">
                      HABILITADO
                    </span>
                  </h3>
                  <p className="text-xs text-sky-100">
                    Tu turno prioritario (Grupo 1) se encuentra listo para acceder a la sala de espera
                    virtual inteligente.
                  </p>
                </div>
              </div>

              <button
                onClick={() => establecerPasoActual('INICIO_SESION_SSO')}
                className="w-full sm:w-auto px-6 py-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-900 font-black rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer"
              >
                <span>Ingresar a la Toma de Ramos</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cuadrícula Principal: Resumen del Alumno y Módulos de Servicios */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna Izquierda: Tarjeta Rápida del Estudiante */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <img
              src={estudiante.fotoPerfilUrl}
              alt={estudiante.nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#004A77]"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">{estudiante.nombre}</h3>
              <p className="text-xs font-mono text-slate-500">{estudiante.rut}</p>
              <span className="inline-block mt-0.5 px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded">
                {estudiante.estadoAcademico}
              </span>
            </div>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 font-medium block">Correo Institucional:</span>
              <span className="text-slate-800">{estudiante.correo}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Carrera:</span>
              <strong className="text-slate-900">{estudiante.carrera}</strong>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Estado de Inscripción 2026-1:</span>
              <strong className={estaInscripcionCompletada ? 'text-emerald-700' : 'text-amber-700'}>
                {estaInscripcionCompletada ? 'Carga Registrada (18 SCT)' : 'Pendiente de Inscripción'}
              </strong>
            </div>
          </div>
        </div>

        {/* Columnas Derechas: Módulos de Servicios Académicos */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modulosAcademicos.map((modulo, indice) => {
              const Icono = modulo.icono;
              return (
                <div
                  key={indice}
                  onClick={modulo.accion}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    modulo.destacado
                      ? 'bg-sky-50/50 border-[#004A77]/40 hover:border-[#004A77] shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#004A77]">
                      <Icono className="w-5 h-5" />
                    </div>
                    {modulo.distintivo && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${modulo.colorDistintivo}`}
                      >
                        {modulo.distintivo}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">{modulo.titulo}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 leading-snug">{modulo.descripcion}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
