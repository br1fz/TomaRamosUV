import React, { useState } from 'react';
import { EncabezadoSuperiorApptui } from './EncabezadoSuperiorApptui';
import { MenuLateralApptui } from './MenuLateralApptui';
import { BarraNavegacionInferiorApptui } from './BarraNavegacionInferiorApptui';
import { LoginApptuiMovil } from './LoginApptuiMovil';
import { InicioApptuiMovil } from './InicioApptuiMovil';
import { PerfilApptuiMovil } from './PerfilApptuiMovil';
import { EnlacesApptuiMovil } from './EnlacesApptuiMovil';
import { NotificacionesApptuiMovil } from './NotificacionesApptuiMovil';
import { VistaEsperaFilaApptui } from './VistaEsperaFilaApptui';
import { InscripcionRamosApptui } from './InscripcionRamosApptui';
import { VistaHorarioArmado } from '../comunes/VistaHorarioArmado';
import { ComprobanteOficialInscripcion } from '../comunes/ComprobanteOficialInscripcion';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import { Smartphone, Monitor } from 'lucide-react';

export const CarcasaTelefonoMovil: React.FC = () => {
  const { pasoActual, establecerPasoActual } = usarTomaRamos();
  const [menuAbierto, establecerMenuAbierto] = useState(false);
  const [perfilAbierto, establecerPerfilAbierto] = useState(false);
  const [pestanaMovil, establecerPestanaMovil] = useState('novedades');
  const [usarChasisSmartphone, establecerUsarChasisSmartphone] = useState(true);

  const manejarCambioPestana = (pestana: string) => {
    establecerPestanaMovil(pestana);
    establecerPerfilAbierto(false);

    if (pasoActual !== 'INICIO_PORTAL' && pasoActual !== 'INICIO_SESION_SSO') {
      if (pestana === 'novedades') {
        establecerPasoActual('PORTAL_ALUMNOS');
      } else if (pestana === 'actividades') {
        establecerPasoActual('HORARIO_ARMADO');
      }
    }
  };

  // Contenido dinámico según el paso del flujo y la pestaña activa
  const renderizarCuerpo = () => {
    // 1. Pantalla de Entrada / Login AppTUI UV Oficial
    if (pasoActual === 'INICIO_PORTAL' || pasoActual === 'INICIO_SESION_SSO') {
      return <LoginApptuiMovil alIngresarExitoso={() => establecerPasoActual('PORTAL_ALUMNOS')} />;
    }

    // 2. Si el perfil está abierto en modal/vista completa
    if (perfilAbierto) {
      return <PerfilApptuiMovil alCerrar={() => establecerPerfilAbierto(false)} />;
    }

    // 3. Fila Virtual
    if (pasoActual === 'FILA_VIRTUAL') {
      return <VistaEsperaFilaApptui />;
    }

    // 4. Inscripción de Asignaturas (Toma de Ramos)
    if (pasoActual === 'SELECCION_RAMOS') {
      return <InscripcionRamosApptui />;
    }

    // 5. Horario Armado
    if (pasoActual === 'HORARIO_ARMADO') {
      return <VistaHorarioArmado />;
    }

    // 6. Comprobante Oficial con Código QR
    if (pasoActual === 'COMPROBANTE_OFICIAL') {
      return <ComprobanteOficialInscripcion />;
    }

    // 7. Navegación por pestañas del Home (PORTAL_ALUMNOS)
    if (pestanaMovil === 'enlaces') {
      return <EnlacesApptuiMovil />;
    }

    if (pestanaMovil === 'notificaciones') {
      return <NotificacionesApptuiMovil />;
    }

    if (pestanaMovil === 'actividades') {
      return <VistaHorarioArmado />;
    }

    // Por defecto: Dashboard de Novedades (Home)
    return (
      <InicioApptuiMovil
        alAbrirHorario={() => establecerPasoActual('HORARIO_ARMADO')}
        alAbrirComprobante={() => establecerPasoActual('COMPROBANTE_OFICIAL')}
      />
    );
  };

  const contenido = (
    <div className="bg-[#14151A] text-slate-100 min-h-full flex flex-col relative select-none">
      {/* El encabezado y la barra inferior solo se muestran una vez autenticado */}
      {pasoActual !== 'INICIO_PORTAL' && pasoActual !== 'INICIO_SESION_SSO' && (
        <>
          <EncabezadoSuperiorApptui
            alAbrirMenu={() => {
              establecerPerfilAbierto(false);
              establecerMenuAbierto(true);
            }}
            alAbrirPerfil={() => {
              establecerMenuAbierto(false);
              establecerPerfilAbierto(true);
            }}
          />
          <MenuLateralApptui
            estaAbierto={menuAbierto}
            alCerrar={() => establecerMenuAbierto(false)}
            alAbrirPerfil={() => establecerPerfilAbierto(true)}
          />
        </>
      )}

      {/* Contenedor principal con scroll independiente */}
      <main className="flex-1 overflow-y-auto">
        {renderizarCuerpo()}
      </main>

      {/* Barra de pestañas inferior de APPTUI */}
      {pasoActual !== 'INICIO_PORTAL' && pasoActual !== 'INICIO_SESION_SSO' && !perfilAbierto && (
        <BarraNavegacionInferiorApptui
          pestanaActiva={
            pasoActual === 'HORARIO_ARMADO'
              ? 'actividades'
              : pasoActual === 'PORTAL_ALUMNOS'
              ? pestanaMovil
              : 'novedades'
          }
          alCambiarPestana={manejarCambioPestana}
        />
      )}
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
          <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-3 pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 ring-1 ring-slate-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-blue-950/60 ring-1 ring-blue-900/40" />
          </div>

          {/* Área de Pantalla */}
          <div className="w-full h-full bg-[#14151A] rounded-[44px] overflow-hidden flex flex-col relative border border-[#2D323E]/50 shadow-inner">
            {contenido}

            {/* Barra indicadora inferior de inicio */}
            <div className="w-32 h-1 bg-slate-600 rounded-full mx-auto my-1.5 z-40 flex-shrink-0" />
          </div>
        </div>
      ) : (
        /* Vista de Contenedor sin marco */
        <div className="w-full max-w-md bg-[#14151A] rounded-2xl border border-[#2D323E] shadow-2xl overflow-hidden min-h-[750px]">
          {contenido}
        </div>
      )}
    </div>
  );
};
