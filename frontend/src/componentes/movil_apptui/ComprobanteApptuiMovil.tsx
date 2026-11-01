import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import {
  CheckCircle2,
  ShieldCheck,
  Calendar,
  User,
  FileText,
  Clock,
  MapPin,
  Download,
  ArrowLeft,
  Award,
} from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const ComprobanteApptuiMovil: React.FC = () => {
  const { comprobanteOficial, establecerPasoActual, asignaturasInscritas, totalCreditosSCT, estudiante } =
    usarTomaRamos();
  const lienzoQRRef = useRef<HTMLCanvasElement | null>(null);

  // Generar datos para el comprobante (usar el oficial o fallback de simulación si no se ha confirmado aún)
  const folio = comprobanteOficial?.codigoVerificacion || 'UV-8F92A1-2026';
  const [fechaActualDefecto] = useState(() =>
    new Date().toLocaleString('es-CL', { dateStyle: 'long', timeStyle: 'short' })
  );
  const fechaConfirmacion = comprobanteOficial?.fechaHoraConfirmacion || fechaActualDefecto;
  const firmaSHA =
    comprobanteOficial?.firmaDigitalSHA256 ||
    'a7f4c93e1b02847d95c21e0384f9a12c8e7456d90a123f4b5c6d7e8f9a0b1c2d';
  const listaAsignaturas =
    comprobanteOficial?.asignaturasInscritas || asignaturasInscritas;
  const creditos = comprobanteOficial?.totalCreditosSCT || totalCreditosSCT;

  useEffect(() => {
    if (lienzoQRRef.current) {
      const datosQR = `https://portal.uv.cl/validar?codigo=${folio}&rut=${estudiante.rut}&creditos=${creditos}&semestre=2026-1`;
      QRCode.toCanvas(lienzoQRRef.current, datosQR, {
        width: 140,
        margin: 1,
        color: {
          dark: '#003853',
          light: '#ffffff',
        },
      }).catch((error) => console.error('Error al generar código QR:', error));
    }
  }, [folio, estudiante.rut, creditos]);

  return (
    <div className="p-3.5 space-y-4 animate-fadeIn text-slate-100 select-none pb-24">
      {/* Botón Superior: Volver al Dashboard */}
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
          <span>Oficial UV</span>
        </span>
      </div>

      {/* Contenedor Tipo Certificado Digital / Boarding Pass */}
      <div className="bg-[#20232A] border-2 border-[#31C4D7]/40 rounded-3xl overflow-hidden shadow-2xl relative">
        {/* Resplandor decorativo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#31C4D7]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cabecera del Certificado */}
        <div className="p-4 bg-gradient-to-r from-[#003853] via-[#004A77] to-[#0d6e7a] text-white border-b border-[#2D323E]">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <img
                src="/apptui_extracted/assets/images/logos/header_uv.png"
                alt="Universidad de Valparaíso"
                className="h-8 w-auto brightness-0 invert object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="leading-tight">
                <span className="text-[10px] font-black uppercase tracking-wider block">
                  Universidad de Valparaíso
                </span>
                <span className="text-[9px] text-[#31C4D7] font-semibold block">
                  Dirección General de Pregrado • DTIC
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] text-slate-300 block font-mono">FOLIO:</span>
              <span className="text-xs font-mono font-black text-white bg-black/30 px-2 py-0.5 rounded border border-white/20">
                {folio}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-white/20 text-center">
            <h2 className="text-xs font-extrabold uppercase tracking-wide text-white">
              Comprobante Oficial de Inscripción Curricular
            </h2>
            <p className="text-[10px] text-slate-200 mt-0.5 font-medium">
              Primer Semestre 2026 • Modalidad Regular
            </p>
          </div>
        </div>

        {/* Datos del Alumno */}
        <div className="p-3.5 bg-[#1a1d24] border-b border-[#2D323E] space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[#31C4D7] flex-shrink-0" />
            <span className="text-slate-400 text-[11px]">Estudiante:</span>
            <strong className="text-white font-bold text-xs truncate">
              {estudiante.nombre}
            </strong>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
            <div className="bg-[#14151A] p-2 rounded-xl border border-[#2D323E]/60">
              <span className="text-[10px] text-slate-400 block font-mono">RUN</span>
              <strong className="text-white font-mono text-xs">{estudiante.rut}</strong>
            </div>

            <div className="bg-[#14151A] p-2 rounded-xl border border-[#2D323E]/60">
              <span className="text-[10px] text-slate-400 block">Condición</span>
              <strong className="text-emerald-400 text-xs">REGULAR ACTIVO</strong>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-300">
            <FileText className="w-3.5 h-3.5 text-[#31C4D7] flex-shrink-0" />
            <span className="truncate">{estudiante.carrera}</span>
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <Calendar className="w-3 h-3 text-slate-500 flex-shrink-0" />
            <span>Confirmado: {fechaConfirmacion}</span>
          </div>
        </div>

        {/* Resumen de Créditos y Estado Atómico */}
        <div className="p-3 bg-[#13262F] border-b border-[#31C4D7]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#31C4D7] flex-shrink-0" />
            <div>
              <span className="text-[10px] font-black uppercase text-[#31C4D7] block tracking-wide">
                Reserva Atómica Exitosa
              </span>
              <span className="text-[9px] text-slate-300 block">
                Cupos validados sin colisiones horarias
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[9px] text-slate-400 uppercase font-bold block">Total Carga</span>
            <span className="text-sm font-black text-white font-mono">
              {creditos} <span className="text-[10px] font-normal text-slate-400">/ 30 SCT</span>
            </span>
          </div>
        </div>

        {/* Asignaturas Inscritas Adaptadas en Tarjetas Móviles */}
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1">
            <span>Asignaturas Oficialmente Asignadas</span>
            <span className="text-[#31C4D7] text-[11px]">
              {listaAsignaturas.length} inscritas
            </span>
          </div>

          {listaAsignaturas.length === 0 ? (
            <div className="p-4 text-center text-xs text-slate-400 border border-dashed border-[#2D323E] rounded-2xl">
              No tienes asignaturas registradas actualmente.
            </div>
          ) : (
            listaAsignaturas.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#14151A] border border-[#2D323E] rounded-2xl p-3 space-y-2 shadow-xs"
              >
                {/* Cabecera de la Asignatura */}
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

                {/* Sección y Docente */}
                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-0.5">
                  <span className="font-bold text-emerald-400">
                    Sección {item.seccion.numeroSeccion}
                  </span>
                  <span className="text-slate-400 text-[10px] truncate max-w-[170px]">
                    {item.seccion.profesor}
                  </span>
                </div>

                {/* Horario y Sala */}
                <div className="bg-[#1a1d24] p-2 rounded-xl border border-[#2D323E]/50 space-y-1 text-[10px]">
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
            ))
          )}
        </div>

        {/* Certificación Digital y Código QR Oficial */}
        <div className="p-4 bg-[#111317] border-t border-[#2D323E] space-y-3">
          <div className="flex flex-col items-center justify-center text-center">
            {/* Lienzo del Código QR */}
            <div className="p-2 bg-white rounded-2xl shadow-lg border border-slate-300">
              <canvas ref={lienzoQRRef} className="block mx-auto" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#31C4D7] mt-2">
              Validación QR Oficial UV
            </span>
            <p className="text-[9px] text-slate-400 mt-0.5 max-w-[260px] leading-tight">
              Escanear para comprobar vigencia en{' '}
              <span className="text-white underline font-semibold">https://portal.uv.cl/validar</span>
            </p>
          </div>

          {/* Firma Criptográfica SHA-256 */}
          <div className="bg-[#14151A] p-2.5 rounded-xl border border-[#2D323E] text-center">
            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
              Firma Digital SHA-256 Emitida:
            </span>
            <p className="text-[8px] font-mono text-slate-400 break-all leading-tight">
              {firmaSHA}
            </p>
          </div>
        </div>
      </div>

      {/* Botones de Acción Móviles */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => window.print()}
          className="w-full py-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-950 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Descargar / Guardar Comprobante PDF</span>
        </button>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => establecerPasoActual('HORARIO_ARMADO')}
            className="py-2.5 px-3 bg-[#20232A] hover:bg-[#282d37] text-white border border-[#2D323E] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-[#31C4D7]" />
            <span>Ver Mi Horario</span>
          </button>

          <button
            onClick={() => establecerPasoActual('PORTAL_ALUMNOS')}
            className="py-2.5 px-3 bg-[#20232A] hover:bg-[#282d37] text-white border border-[#2D323E] font-bold rounded-2xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all"
          >
            <Award className="w-3.5 h-3.5 text-[#31C4D7]" />
            <span>Finalizar Proceso</span>
          </button>
        </div>
      </div>
    </div>
  );
};
