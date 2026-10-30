import React from 'react';
import { AlertTriangle, LogOut, ShieldAlert } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

export const ConcurrencyModal: React.FC = () => {
  const { sessionTransferred, clearSessionTransferred, logout, student } = useQueue();

  if (!sessionTransferred) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-amber-500">
        {/* Top Warning Bar */}
        <div className="bg-amber-500 px-6 py-4 flex items-center gap-3 text-slate-900 font-bold">
          <ShieldAlert className="w-6 h-6 text-slate-900 flex-shrink-0 animate-bounce" />
          <span className="text-lg uppercase tracking-wide">Control de Concurrencia Unitaria UV</span>
        </div>

        <div className="p-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-10 h-10" />
          </div>

          <h3 className="text-xl font-extrabold text-slate-900 text-center mb-2">
            Sesión Transferida a Otro Dispositivo
          </h3>

          <p className="text-sm text-slate-600 text-center mb-6 leading-relaxed">
            Se ha detectado un nuevo inicio de sesión para el RUT{' '}
            <strong className="text-slate-900">{student.rut}</strong> en otra pestaña, ventana de
            incógnito o dispositivo móvil.
          </p>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-900 space-y-2">
            <p className="font-semibold text-amber-950">
              POLÍTICA DE ACCESO EXCLUSIVO EN TOMA DE RAMOS:
            </p>
            <p>
              Para garantizar equidad estricta y evitar la saturación de servidores, la Universidad
              de Valparaíso aplica bloqueo de exclusión mutua en Redis. Tu turno y progreso se
              mantienen exclusivamente en el acceso más reciente.
            </p>
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => {
                clearSessionTransferred();
                logout();
              }}
              className="w-full py-3 px-4 bg-[#004A77] hover:bg-[#003859] text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <LogOut className="w-4 h-4" />
              Reconectar o Iniciar Nueva Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
