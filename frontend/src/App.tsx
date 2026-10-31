import React from 'react';
import { ProveedorTomaRamos, usarTomaRamos } from './contextos/ContextoTomaRamos';
import { BarraControlDesarrollador } from './componentes/desarrollo/BarraControlDesarrollador';
import { EncabezadoPortalWeb } from './componentes/escritorio_web/EncabezadoPortalWeb';
import { BarraLateralEstudianteWeb } from './componentes/escritorio_web/BarraLateralEstudianteWeb';
import { PaginaEntradaPortalUV } from './componentes/escritorio_web/PaginaEntradaPortalUV';
import { InicioPortalAlumnosWeb } from './componentes/escritorio_web/InicioPortalAlumnosWeb';
import { InicioSesionSSOWeb } from './componentes/escritorio_web/InicioSesionSSOWeb';
import { TarjetaFilaVirtualWeb } from './componentes/escritorio_web/TarjetaFilaVirtualWeb';
import { SelectorAsignaturasWeb } from './componentes/escritorio_web/SelectorAsignaturasWeb';
import { MallaHorariaSemanalWeb } from './componentes/escritorio_web/MallaHorariaSemanalWeb';
import { CarcasaTelefonoMovil } from './componentes/movil_apptui/CarcasaTelefonoMovil';
import { VistaHorarioArmado } from './componentes/comunes/VistaHorarioArmado';
import { ComprobanteOficialInscripcion } from './componentes/comunes/ComprobanteOficialInscripcion';
import { CelebracionLlegadaTurno } from './componentes/comunes/CelebracionLlegadaTurno';
import { ModalSesionDuplicada } from './componentes/comunes/ModalSesionDuplicada';
import { ModalTopeHorario } from './componentes/comunes/ModalTopeHorario';

const ContenidoPrincipalAplicacion: React.FC = () => {
  const { modoVisualizacion, pasoActual, mostrarCelebracionTurno, cerrarCelebracionTurno } = usarTomaRamos();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-[#004A77] selection:text-white">
      {/* Barra de Desarrollo y Simulación (Siempre visible en la parte superior) */}
      <BarraControlDesarrollador />

      {/* Contenido Principal condicionado por modoVisualizacion */}
      {modoVisualizacion === 'MOVIL_APPTUI' ? (
        /* Vista Móvil APPTUI UV */
        <main className="flex-1 bg-slate-900 flex items-center justify-center p-2 sm:p-4">
          <CarcasaTelefonoMovil />
        </main>
      ) : (
        /* Vista de Escritorio Portal UV */
        <div className="flex-1 flex flex-col">
          {pasoActual === 'INICIO_PORTAL' ? (
            /* Página de Entrada Oficial Portal UV (portal.uv.cl/loginInstitucional) */
            <PaginaEntradaPortalUV />
          ) : pasoActual === 'PORTAL_ALUMNOS' ? (
            /* Portal Académico de Alumnos Oficial con el nuevo botón de Toma de Ramos */
            <InicioPortalAlumnosWeb />
          ) : (
            <>
              <EncabezadoPortalWeb />

              <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
                {pasoActual === 'INICIO_SESION_SSO' && <InicioSesionSSOWeb />}

                {pasoActual === 'FILA_VIRTUAL' && <TarjetaFilaVirtualWeb />}

                {pasoActual === 'SELECCION_RAMOS' && (
                  <div className="flex flex-col lg:flex-row gap-6 items-start">
                    {/* Columna Izquierda: Perfil y Cuenta Regresiva */}
                    <BarraLateralEstudianteWeb />

                    {/* Columna Derecha: Selector de Asignaturas y Malla Horaria Interactiva */}
                    <div className="flex-1 w-full space-y-6">
                      <SelectorAsignaturasWeb />
                      <MallaHorariaSemanalWeb />
                    </div>
                  </div>
                )}

                {pasoActual === 'HORARIO_ARMADO' && <VistaHorarioArmado />}

                {pasoActual === 'COMPROBANTE_OFICIAL' && <ComprobanteOficialInscripcion />}
              </main>

              {/* Pie Institucional de Escritorio */}
              <footer className="bg-white border-t border-slate-200 mt-auto py-6 px-4 text-center text-xs text-slate-500 print:hidden">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src="/uv_azul.svg" alt="UV" className="h-7 w-auto" />
                    <span className="font-semibold text-slate-700">
                      Universidad de Valparaíso • Sistema de Toma de Ramos
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Dirección General de Pregrado • Mesa de Ayuda: (32) 250 7000 • contacto@uv.cl
                  </p>
                </div>
              </footer>
            </>
          )}
        </div>
      )}

      {/* Momento Celebratorio de Llegada de Turno: "¡Uy! ¡Al fin me toca!" */}
      <CelebracionLlegadaTurno
        estaAbierto={mostrarCelebracionTurno}
        alContinuar={cerrarCelebracionTurno}
      />

      {/* Modales Globales Compartidos */}
      <ModalSesionDuplicada />
      <ModalTopeHorario />
    </div>
  );
};

export default function App() {
  return (
    <ProveedorTomaRamos>
      <ContenidoPrincipalAplicacion />
    </ProveedorTomaRamos>
  );
}
