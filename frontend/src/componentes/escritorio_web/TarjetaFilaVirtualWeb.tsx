import React, { useEffect, useState } from 'react';
import { Users, Clock, ShieldCheck, Wifi, FastForward, Bell } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { InterruptorAlertaSonora } from '../comunes/InterruptorAlertaSonora';

export const TarjetaFilaVirtualWeb: React.FC = () => {
  const { metricasFila, adelantarFilaInstantaneamente, estudiante } = usarTomaRamos();
  const [permisoNotif, setPermisoNotif] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  // 1. Mantener pantalla encendida (Wake Lock API) para evitar suspensión en móviles/laptops
  useEffect(() => {
    let candadoPantalla: { release: () => Promise<void> } | null = null;
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      (navigator as unknown as { wakeLock: { request: (tipo: string) => Promise<{ release: () => Promise<void> }> } }).wakeLock
        .request('screen')
        .then((lock) => {
          candadoPantalla = lock;
        })
        .catch(() => {
          // Ignorar si el usuario cambió de pestaña o la política del navegador lo restringe
        });
    }

    return () => {
      if (candadoPantalla) {
        candadoPantalla.release().catch(() => {});
      }
    };
  }, []);

  // 2. Notificación push del navegador al llegar el turno
  useEffect(() => {
    if (metricasFila.posicionEnFila <= 1 && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        try {
          new Notification('¡Uy! ¡Al fin me toca! - Toma de Ramos UV', {
            body: `Hola ${estudiante.nombre}, tu turno ha llegado. Tienes 10 minutos protegidos para seleccionar tus asignaturas.`,
            icon: '/uv_azul.svg',
          });
        } catch {
          // Ignorar fallas silenciosas de notificación
        }
      }
    }
  }, [metricasFila.posicionEnFila, estudiante.nombre]);

  const solicitarPermisoNotificaciones = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permiso = await Notification.requestPermission();
      setPermisoNotif(permiso);
    }
  };

  const formatearTiempoEspera = (segundos: number) => {
    if (segundos <= 0) return 'Menos de 10 segundos';
    const minutos = Math.floor(segundos / 60);
    const segs = segundos % 60;
    if (minutos === 0) return `${segs} seg`;
    return `${minutos} min ${segs > 0 ? `${segs} seg` : ''}`;
  };

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6 animate-fadeIn">
      {/* Tarjeta de Fila Virtual con Estilo Glassmorphic */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
        {/* Degradado Ambiental Superior */}
        <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-[#004A77] via-[#0284c7] to-[#31C4D7]" />

        {/* Encabezado con Título y Estado de Conexión */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                Fila Virtual Activa
              </span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
              Sala de Espera Inteligente UV
            </h2>
            <p className="text-xs text-slate-500">
              Estudiante: <strong>{estudiante.nombre}</strong> • Token:{' '}
              <span className="font-mono">{metricasFila.tokenAcceso}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={adelantarFilaInstantaneamente}
              title="Acelera la cola para pasar directamente al turno (demostración)"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-[#004A77] border border-sky-200 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95"
            >
              <FastForward className="w-4 h-4 text-sky-600" />
              <span>Adelantar Turno (Demo)</span>
            </button>
          </div>
        </div>

        {/* Cuadrícula de Métricas en Vivo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
          {/* Puesto en la Fila */}
          <div className="bg-gradient-to-br from-[#004A77] to-[#003352] text-white p-6 rounded-2xl shadow-lg relative overflow-hidden text-center md:text-left">
            <div className="absolute -right-4 -bottom-4 opacity-10">
              <Users className="w-28 h-28" />
            </div>
            <span className="text-xs font-semibold text-sky-200 uppercase tracking-wider block">
              Tu Puesto en la Fila
            </span>
            <div className="text-5xl font-black tracking-tight my-1 text-white flex items-baseline justify-center md:justify-start gap-1">
              <span>#{metricasFila.posicionEnFila}</span>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-sky-200/90 font-medium">
              <Users className="w-3.5 h-3.5 text-sky-300" />
              <span>Tasa promedio: ~15 alumnos / min</span>
            </div>
          </div>

          {/* Tiempo Estimado de Espera */}
          <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-2xl text-center md:text-left flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Tiempo Estimado
              </span>
              <div className="text-3xl font-extrabold text-[#004A77] my-1 font-mono">
                {formatearTiempoEspera(metricasFila.tiempoEstimadoEsperaSegundos)}
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-1.5 text-[11px] text-emerald-600 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Cálculo dinámico en vivo</span>
            </div>
          </div>
        </div>

        {/* Barra de Progreso hacia el Turno */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-2">
            <span>Progreso hacia tu turno</span>
            <span className="font-bold text-[#004A77] font-mono text-sm">
              {metricasFila.alumnosPorDelante === 0
                ? '¡Es tu turno!'
                : metricasFila.alumnosPorDelante === 1
                ? '1 persona por delante'
                : `${metricasFila.alumnosPorDelante} personas por delante`}
            </span>
          </div>
          <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-[#004A77] via-[#0284c7] to-[#31C4D7] rounded-full transition-all duration-700 shadow-sm relative overflow-hidden"
              style={{ width: `${metricasFila.porcentajeAvance}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Interruptor de Alerta Sonora y Notificación Push */}
        <div className="mb-6 space-y-3">
          <InterruptorAlertaSonora />

          {permisoNotif !== 'granted' && (
            <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-sky-900">
                <Bell className="w-4 h-4 text-[#004A77] flex-shrink-0" />
                <span>¿Deseas recibir un aviso en pantalla cuando sea tu turno aunque cambies de pestaña?</span>
              </div>
              <button
                onClick={solicitarPermisoNotificaciones}
                className="px-3.5 py-1.5 bg-[#004A77] hover:bg-[#003859] text-white font-bold rounded-xl whitespace-nowrap active:scale-95 transition-all text-xs self-end sm:self-center shadow-xs"
              >
                Activar Notificación
              </button>
            </div>
          )}
        </div>

        {/* Garantías de Transparencia y Reducción de Ansiedad */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600 pt-6 border-t border-slate-100">
          <div className="flex items-start gap-3 bg-sky-50/60 p-3.5 rounded-xl border border-sky-100">
            <Wifi className="w-5 h-5 text-sky-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block text-xs mb-0.5">
                Tolerancia al corte de red
              </strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                Si experimentas una caída de señal móvil o cambio de Wi-Fi, tu lugar se conserva
                durante 120 segundos para reconexión automática.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-amber-50/60 p-3.5 rounded-xl border border-amber-100">
            <ShieldCheck className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800 block text-xs mb-0.5">Desincentivo al F5</strong>
              <p className="text-[11px] text-slate-600 leading-snug">
                No necesitas refrescar la página. El estado se sincroniza en tiempo real por
                WebSocket y tu token está protegido en tu navegador.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
