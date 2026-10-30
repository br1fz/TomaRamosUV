import React, { useState } from 'react';
import { Lock, Mail, User, AlertTriangle, ArrowRight } from 'lucide-react';
import { useQueue } from '../../context/QueueEnrollmentContext';

export const WebLoginSSO: React.FC = () => {
  const { login, student } = useQueue();
  const [email, setEmail] = useState<string>(student.email);
  const [rut, setRut] = useState<string>(student.rut);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      login(email, rut);
      setIsLoading(false);
    }, 600);
  };

  const handleFillDemo = () => {
    setEmail(student.email);
    setRut(student.rut);
    setPassword('PortalUV2026!');
  };

  return (
    <div className="min-h-[85vh] flex flex-col justify-center items-center py-10 px-4 sm:px-6 relative">
      {/* Background wave decoration */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none opacity-20">
        <img src="/wave.svg" alt="" className="w-full object-cover" />
      </div>

      <div className="w-full max-w-xl z-10 animate-fadeIn">
        {/* Institutional Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl p-6 sm:p-10 relative overflow-hidden">
          {/* Top blue bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#004A77]" />

          {/* UV Header & Title */}
          <div className="text-center mb-6">
            <img
              src="/uv_azul.svg"
              alt="Universidad de Valparaíso"
              className="h-16 w-auto mx-auto mb-3"
            />
            <h1 className="text-xl sm:text-2xl font-black text-[#004A77] tracking-tight">
              Portal Institucional UV
            </h1>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-1">
              Autenticación Federada Microsoft Azure AD • Toma de Ramos 2026
            </p>
          </div>

          {/* MANDATORY CONCURRENCY WARNING BANNER (Prompt section 60-63) */}
          <div className="mb-6 p-4 rounded-2xl border-2 border-[#F9AB00] bg-[#FEF7E0] text-amber-950 shadow-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5 animate-bounce" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-wide text-amber-900 mb-1">
                  REGISTRO ESTRICTAMENTE ÚNICO POR ESTUDIANTE VERIFICADO
                </h4>
                <p className="text-[11px] leading-relaxed text-amber-900/90">
                  El acceso a la toma de ramos y su turno en la fila virtual está asociado
                  exclusivamente a su RUT y correo institucional. Iniciar sesión desde múltiples
                  pestañas, ventanas de incógnito o dispositivos distintos{' '}
                  <strong className="font-bold underline">
                    transferirá automáticamente la sesión activa al último acceso
                  </strong>{' '}
                  sin adelantar su lugar en la fila.
                </p>
              </div>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Institucional UV
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nombre.apellido@estudiantes.uv.cl"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* RUT Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                RUT Estudiante
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={rut}
                  onChange={(e) => setRut(e.target.value)}
                  placeholder="19.926.640-3"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contraseña Única UV / Microsoft 365
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña institucional"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#004A77] focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Quick Demo Fill button */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <button
                type="button"
                onClick={handleFillDemo}
                className="text-[#004A77] hover:underline font-semibold flex items-center gap-1"
              >
                <span>Cargar alumno de prueba (Bruno Díaz)</span>
              </button>

              <span className="text-slate-400 text-[11px]">Single-Session Lock activo</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#004A77] hover:bg-[#003859] text-white font-extrabold rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Autenticando en SSO UV...</span>
                </>
              ) : (
                <>
                  <span>Ingresar a Sala de Espera Virtual</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Accreditation Footer */}
          <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col items-center justify-center text-center">
            <img
              src="/uv_acreditacion_azul.svg"
              alt="Universidad Acreditada de Excelencia"
              className="h-10 w-auto opacity-85"
            />
            <p className="text-[10px] text-slate-400 mt-2">
              Universidad de Valparaíso • Institución de Educación Superior Pública y Estatal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
