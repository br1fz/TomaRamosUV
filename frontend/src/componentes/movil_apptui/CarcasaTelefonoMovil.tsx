import React, { useState } from 'react';
import { EncabezadoSuperiorApptui } from './EncabezadoSuperiorApptui';
import { MenuLateralApptui } from './MenuLateralApptui';
import { BarraNavegacionInferiorApptui } from './BarraNavegacionInferiorApptui';
import { InicioApptuiMovil } from './InicioApptuiMovil';
import { VistaEsperaFilaApptui } from './VistaEsperaFilaApptui';
import { InscripcionRamosApptui } from './InscripcionRamosApptui';
import { InicioSesionSSOWeb } from '../escritorio_web/InicioSesionSSOWeb';
import { VistaHorarioArmado } from '../comunes/VistaHorarioArmado';
import { ComprobanteOficialInscripcion } from '../comunes/ComprobanteOficialInscripcion';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { Smartphone, Monitor } from 'lucide-react';

export const CarcasaTelefonoMovil: React.FC = () => {
  const { pasoActual, establecerPasoActual } = usarTomaRamos();
  const [menuAbierto, establecerMenuAbierto] = useState(false);
  const [pestanaMovil, establecerPestanaMovil] = useState('novedades');
  const [usarChasisSmartphone, establecerUsarChasisSmartphone] = useState(true);

  const manejarCambioPestana = (pestana: string) => {
    establecerPestanaMovil(pestana);
    if (pestana === 'novedades') establecerPasoActual('INICIO_PORTAL');
    if (pestana === 'actividades') establecerPasoActual('HORARIO_ARMADO');
  };

  const contenido = (
    <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col relative">
      <EncabezadoSuperiorApptui alAbrirMenu={() => establecerMenuAbierto(true)} />
      <MenuLateralApptui estaAbierto={menuAbierto} alCerrar={() => establecerMenuAbierto(false)} />

      <main className="flex-1 overflow-y-auto">
        {pasoActual === 'INICIO_PORTAL' && <InicioApptuiMovil />}
        {pasoActual === 'INICIO_SESION_SSO' && <InicioSesionSSOWeb />}
        {pasoActual === 'FILA_VIRTUAL' && <VistaEsperaFilaApptui />}
        {pasoActual === 'SELECCION_RAMOS' && <InscripcionRamosApptui />}
        {pasoActual === 'HORARIO_ARMADO' && <VistaHorarioArmado />}
        {pasoActual === 'COMPROBANTE_OFICIAL' && <ComprobanteOficialInscripcion />}
      </main>

      <BarraNavegacionInferiorApptui pestanaActiva={pestanaMovil} alCambiarPestana={manejarCambioPestana} />
    </div>
  );

  return (
    <div className="py-6 px-2 flex flex-col items-center justify-center animate-fadeIn">
      {/* Botón de alternancia de marco de dispositivo */}
      <div className="mb-4 flex items-center gap-2 bg-slate-800 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-md">
        <button
          onClick={() => establecerUsarChasisSmartphone(true)}
          className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            usarChasisSmartphone ? 'bg-[#31C4D7] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Marco Smartphone (APPTUI)</span>
        </button>
        <button
          onClick={() => establecerUsarChasisSmartphone(false)}
          className={`px-3 py-1 rounded-full flex items-center gap-1.5 transition-all ${
            !usarChasisSmartphone ? 'bg-[#31C4D7] text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Monitor className="w-3.5 h-3.5" />
          <span>Pantalla Completa</span>
        </button>
      </div>

      {usarChasisSmartphone ? (
        /* Chasis Realista de Smartphone */
        <div className="w-[390px] h-[844px] bg-[#1a1b20] p-3 rounded-[54px] shadow-2xl border-4 border-slate-700/80 ring-1 ring-slate-600 relative overflow-hidden flex flex-col">
          {/* Dynamic Island / Muesca Superior */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-950/60 ring-1 ring-blue-900/40" />
          </div>

          {/* Área de Pantalla */}
          <div className="w-full h-full bg-[#14151A] rounded-[44px] overflow-hidden flex flex-col relative border border-[#2D323E]/50 shadow-inner">
            {contenido}

            {/* Barra indicadora inferior de inicio */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5 z-40" />
          </div>
        </div>
      ) : (
        /* Vista de Contenedor sin marco */
        <div className="w-full max-w-md bg-[#14151A] rounded-2xl border border-[#2D323E] shadow-2xl overflow-hidden min-h-[700px]">
          {contenido}
        </div>
      )}
    </div>
  );
};
