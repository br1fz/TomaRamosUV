import React from 'react';
import { Bell, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

export const NotificacionesApptuiMovil: React.FC = () => {
  const { entrarAFilaVirtual, estaInscripcionCompletada } = usarTomaRamos();

  const notificaciones = [
    {
      id: 1,
      titulo: 'Proceso de Toma de Ramos 2026-1 Habilitado',
      descripcion: 'Tu grupo de prioridad (Grupo 1) se encuentra habilitado para ingresar a la sala de espera virtual.',
      fecha: 'Hoy, 09:00 hrs',
      tipo: 'PRIORITARIO',
      noLeida: true,
      accion: () => !estaInscripcionCompletada && entrarAFilaVirtual(),
    },
    {
      id: 2,
      titulo: 'Acreditación Institucional Nivel de Excelencia',
      descripcion: 'La CNA-Chile acreditó a la Universidad de Valparaíso por un período de 6 años hasta marzo de 2029.',
      fecha: 'Ayer, 16:30 hrs',
      tipo: 'INSTITUCIONAL',
      noLeida: true,
    },
    {
      id: 3,
      titulo: 'Horario Oficial 5.° Semestre Publicado',
      descripcion: 'Ya puedes revisar las secciones y bloques horarios de Ingeniería Civil Informática.',
      fecha: 'Hace 2 días',
      tipo: 'ACADEMICO',
      noLeida: true,
    },
    {
      id: 4,
      titulo: 'Matrícula Semestral 2026-1 Confirmada',
      descripcion: 'Tu condición académica es REGULAR ACTIVO. No presentas retenciones arancelarias ni de biblioteca.',
      fecha: 'Hace 3 días',
      tipo: 'ADMINISTRATIVO',
      noLeida: false,
    },
    {
      id: 5,
      titulo: 'Beneficios Santander Campus Digital',
      descripcion: 'Accede a descuentos especiales en PedidosYa y transporte universitario con tu credencial digital TUI.',
      fecha: 'Hace 4 días',
      tipo: 'BENEFICIOS',
      noLeida: false,
    },
    {
      id: 6,
      titulo: 'Encuesta Docente 2025-2',
      descripcion: 'Agradecemos tu participación en la evaluación académica del semestre anterior.',
      fecha: 'Hace 1 semana',
      tipo: 'ENCUESTA',
      noLeida: false,
    },
    {
      id: 7,
      titulo: 'Actualización AppTUI UV v5.1.1',
      descripcion: 'Mejoras en el rendimiento de la fila virtual e integración con credencial móvil NFC.',
      fecha: 'Hace 1 semana',
      tipo: 'SISTEMA',
      noLeida: false,
    },
    {
      id: 8,
      titulo: 'Bienvenida Semestre Académico 2026-1',
      descripcion: 'Palabras de bienvenida de la Decanatura de la Facultad de Ingeniería.',
      fecha: 'Hace 2 semanas',
      tipo: 'INSTITUCIONAL',
      noLeida: false,
    },
    {
      id: 9,
      titulo: 'Talleres DAE Playa Ancha',
      descripcion: 'Inscripciones abiertas para actividades deportivas y extracurriculares en el gimnasio central.',
      fecha: 'Hace 2 semanas',
      tipo: 'VIDA_UNIVERSITARIA',
      noLeida: false,
    },
    {
      id: 10,
      titulo: 'Reserva de Salas de Estudio Biblioteca Central',
      descripcion: 'Nuevo sistema de reserva inmediata disponible desde el menú de la app.',
      fecha: 'Hace 3 semanas',
      tipo: 'SERVICIOS',
      noLeida: false,
    },
    {
      id: 11,
      titulo: 'Clave UV Única Actualizada',
      descripcion: 'Tu contraseña de acceso Microsoft 365 ha sido sincronizada satisfactoriamente.',
      fecha: 'Hace 3 semanas',
      tipo: 'SEGURIDAD',
      noLeida: false,
    },
    {
      id: 12,
      titulo: 'Horas Médicas SEMDA Disponibles',
      descripcion: 'Atención dental y médica general en el Servicio Médico y Dental de Alumnos.',
      fecha: 'Hace 1 mes',
      tipo: 'SALUD',
      noLeida: false,
    },
    {
      id: 13,
      titulo: 'Fondo Solidario UV (FUSA)',
      descripcion: 'Período de postulación a becas de alimentación y residencia estudiantil.',
      fecha: 'Hace 1 mes',
      tipo: 'BENEFICIOS',
      noLeida: false,
    },
    {
      id: 14,
      titulo: 'Feria Laboral de Ingeniería 2026',
      descripcion: 'Más de 40 empresas del rubro TI y tecnología en la sede de Playa Ancha.',
      fecha: 'Hace 1 mes',
      tipo: 'LABORAL',
      noLeida: false,
    },
    {
      id: 15,
      titulo: 'Registro de Nombre Social',
      descripcion: 'Recordatorio sobre el protocolo institucional de identidad de género de la UV.',
      fecha: 'Hace 2 meses',
      tipo: 'INSTITUCIONAL',
      noLeida: false,
    },
  ];

  return (
    <div className="p-4 space-y-3 animate-fadeIn text-slate-100 select-none pb-20">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#31C4D7]" />
          <h2 className="text-base font-extrabold text-white">Notificaciones</h2>
        </div>
        <span className="px-2 py-0.5 bg-[#EC1C24] text-white text-[10px] font-black rounded-full">
          15 en total
        </span>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-2.5">
        {notificaciones.map((notif) => (
          <div
            key={notif.id}
            onClick={notif.accion}
            className={`p-3.5 rounded-2xl border transition-all ${
              notif.tipo === 'PRIORITARIO'
                ? 'bg-[#13262F] border-[#31C4D7] shadow-md cursor-pointer hover:bg-[#1a3845]'
                : notif.noLeida
                ? 'bg-[#20232A] border-[#2D323E] hover:border-slate-500'
                : 'bg-[#14151A] border-[#2D323E]/60 text-slate-400'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {notif.tipo === 'PRIORITARIO' ? (
                  <Sparkles className="w-4 h-4 text-[#31C4D7] flex-shrink-0 animate-pulse" />
                ) : notif.noLeida ? (
                  <span className="w-2 h-2 rounded-full bg-[#31C4D7] flex-shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                )}
                <h4
                  className={`text-xs font-bold leading-tight ${
                    notif.tipo === 'PRIORITARIO'
                      ? 'text-[#31C4D7]'
                      : notif.noLeida
                      ? 'text-white'
                      : 'text-slate-300'
                  }`}
                >
                  {notif.titulo}
                </h4>
              </div>
              <span className="text-[9px] text-slate-400 font-mono flex-shrink-0">
                {notif.fecha}
              </span>
            </div>

            <p className="text-[11px] text-slate-300 mt-1 pl-5 leading-snug">
              {notif.descripcion}
            </p>

            {notif.tipo === 'PRIORITARIO' && (
              <div className="mt-2.5 pl-5">
                <button
                  onClick={notif.accion}
                  className="py-1.5 px-3 bg-[#31C4D7] hover:bg-[#28b2c4] text-slate-900 font-black rounded-xl text-[11px] flex items-center gap-1.5 active:scale-95 transition-all shadow"
                >
                  <span>Ingresar a Fila Virtual</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
