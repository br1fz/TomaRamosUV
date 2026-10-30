import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Printer, CheckCircle2, ShieldCheck, ArrowLeft, Calendar, User, FileText } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const ComprobanteOficialInscripcion: React.FC = () => {
  const { comprobanteOficial, establecerPasoActual } = usarTomaRamos();
  const lienzoQRRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (comprobanteOficial && lienzoQRRef.current) {
      const datosQR = `https://portal.uv.cl/validar?codigo=${comprobanteOficial.codigoVerificacion}&rut=${comprobanteOficial.estudiante.rut}&creditos=${comprobanteOficial.totalCreditosSCT}&semestre=2026-1`;
      QRCode.toCanvas(lienzoQRRef.current, datosQR, {
        width: 140,
        margin: 1,
        color: {
          dark: '#004A77',
          light: '#ffffff',
        },
      }).catch((error) => console.error('Error al generar código QR:', error));
    }
  }, [comprobanteOficial]);

  if (!comprobanteOficial) return null;

  const manejarImpresion = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 animate-fadeIn">
      {/* Barra Superior de Acciones (oculta al imprimir) */}
      <div className="print:hidden mb-6 flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <button
          onClick={() => establecerPasoActual('SELECCION_RAMOS')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la selección
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={manejarImpresion}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#004A77] hover:bg-[#003859] rounded-xl shadow-md transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar PDF
          </button>
        </div>
      </div>

      {/* Documento Oficial Imprimible */}
      <div
        id="documento-comprobante-oficial"
        className="bg-white rounded-2xl border-2 border-slate-200 shadow-xl p-6 sm:p-10 relative overflow-hidden print:border-none print:shadow-none print:p-0"
      >
        {/* Marca de agua UV */}
        <div className="absolute right-[-60px] bottom-[-60px] opacity-[0.03] pointer-events-none select-none">
          <img src="/uv_azul.svg" alt="marca de agua" className="w-[500px] h-[500px]" />
        </div>

        {/* Encabezado Oficial */}
        <div className="border-b-2 border-[#004A77] pb-6 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img src="/uv_azul.svg" alt="Universidad de Valparaíso" className="h-16 w-auto" />
              <div>
                <h1 className="text-xl font-extrabold text-[#004A77] tracking-tight">
                  UNIVERSIDAD DE VALPARAÍSO
                </h1>
                <p className="text-xs uppercase font-semibold text-slate-500 tracking-wider">
                  Dirección General de Pregrado • Dirección de Tecnologías de Información (DTIC)
                </p>
                <p className="text-xs text-slate-400">
                  Facultad de Ingeniería • Escuela de Ingeniería Civil Informática
                </p>
              </div>
            </div>

            <div className="text-right sm:text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold uppercase tracking-wider mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Inscripción Confirmada
              </span>
              <p className="text-[11px] text-slate-500 font-mono">
                Folio: <strong>{comprobanteOficial.codigoVerificacion}</strong>
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <h2 className="text-lg font-bold text-slate-900 uppercase tracking-wide">
              Comprobante Oficial de Inscripción Curricular
            </h2>
            <p className="text-xs font-medium text-slate-500">
              Período Académico: Primer Semestre 2026 • Modalidad Regular
            </p>
          </div>
        </div>

        {/* Cuícula de Datos del Estudiante */}
        <div className="bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 mb-6 text-xs text-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#004A77]" />
                <span className="text-slate-500">Estudiante:</span>
                <strong className="text-slate-900 font-bold text-sm">
                  {comprobanteOficial.estudiante.nombre}
                </strong>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <span className="text-slate-500">RUN:</span>
                <strong className="text-slate-800 font-mono">{comprobanteOficial.estudiante.rut}</strong>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <span className="text-slate-500">Correo Institucional:</span>
                <span className="text-slate-800">{comprobanteOficial.estudiante.correo}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#004A77]" />
                <span className="text-slate-500">Carrera:</span>
                <strong className="text-slate-900">{comprobanteOficial.estudiante.carrera}</strong>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <span className="text-slate-500">Plan Curricular:</span>
                <span className="text-slate-800 font-medium">
                  {comprobanteOficial.estudiante.planCurricular}
                </span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-slate-500">Fecha y Hora de Confirmación:</span>
                <span className="text-slate-800 font-mono">
                  {comprobanteOficial.fechaHoraConfirmacion}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla de Asignaturas Inscritas */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#004A77] text-white">
                <th className="py-2.5 px-3 rounded-tl-lg font-bold">Código</th>
                <th className="py-2.5 px-3 font-bold">Asignatura</th>
                <th className="py-2.5 px-3 font-bold text-center">Sección</th>
                <th className="py-2.5 px-3 font-bold text-center">Créditos</th>
                <th className="py-2.5 px-3 font-bold">Docente</th>
                <th className="py-2.5 px-3 rounded-tr-lg font-bold">Horario & Aula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {comprobanteOficial.asignaturasInscritas.map((item, indice) => (
                <tr key={item.asignatura.codigo} className={indice % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                  <td className="py-3 px-3 font-mono font-bold text-[#004A77]">
                    {item.asignatura.codigo}
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-800">
                    {item.asignatura.nombre}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-900 font-bold rounded-md">
                      Sec. {item.seccion.numeroSeccion}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900">
                    {item.asignatura.creditosSCT}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-medium">
                    {item.seccion.profesor}
                  </td>
                  <td className="py-3 px-3 text-slate-600 space-y-0.5">
                    {item.seccion.horario.map((bloque, indiceBloque) => (
                      <div key={indiceBloque} className="text-[11px]">
                        <strong>{bloque.dia}</strong> {bloque.horaInicio}-{bloque.horaFin} ({bloque.sala})
                      </div>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Resumen de Créditos */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-950 uppercase">
                Estado: Reserva Atómica Exitosa
              </h4>
              <p className="text-[11px] text-emerald-800">
                Vacantes reservadas y descontadas con concurrencia unitaria protegida.
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-600 uppercase font-semibold">Total Créditos SCT:</span>
            <div className="text-xl font-extrabold text-[#004A77]">
              {comprobanteOficial.totalCreditosSCT} <span className="text-xs font-normal text-slate-500">/ 30 SCT</span>
            </div>
          </div>
        </div>

        {/* Verificación Digital y Código QR */}
        <div className="border-t border-slate-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500">
          <div className="space-y-1.5 flex-1">
            <p className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
              Verificación Digital y Validez Curricular
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Este documento cuenta con firma y certificación digital emitida por los servidores de
              la Universidad de Valparaíso. Para verificar su autenticidad, escanee el código QR o
              ingrese el código de folio en{' '}
              <span className="text-[#004A77] font-semibold underline">
                https://portal.uv.cl/validar
              </span>
              .
            </p>
            <p className="font-mono text-[10px] text-slate-400 break-all pt-1">
              Firma Digital SHA-256: {comprobanteOficial.firmaDigitalSHA256}
            </p>
          </div>

          <div className="flex flex-col items-center flex-shrink-0 text-center">
            <div className="p-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <canvas ref={lienzoQRRef} className="block" />
            </div>
            <span className="text-[9px] font-mono text-slate-400 mt-1 uppercase">
              QR Oficial UV
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
