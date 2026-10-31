import React, { useState, useEffect } from 'react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';
import './PortalAlumnosUV.css';

interface ModuloPortal {
  id: string;
  titulo: string;
  descripcion?: string;
  categoria: 'ADMINISTRATIVAS' | 'ACADÉMICAS' | 'INFORMACIONES' | 'OTROS' | 'POSTULACIONES' | 'DOCENCIA';
  esPrioritario?: boolean;
  icono: string;
  tipoBoton: 'warning' | 'secondary' | 'success';
  accion?: () => void;
  destacado?: boolean;
}

export const InicioPortalAlumnosWeb: React.FC = () => {
  const {
    estudiante,
    entrarAFilaVirtual,
    cerrarSesion,
    establecerPasoActual,
    estaInscripcionCompletada,
    asignaturasInscritas,
  } = usarTomaRamos();

  // Estados interactivos
  const [tabFicha, setTabFicha] = useState<'FICHA' | 'ASIGNATURAS'>('FICHA');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('TODOS');
  const [busqueda, setBusqueda] = useState<string>('');
  const [indiceBanner, setIndiceBanner] = useState<number>(0);
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState<boolean>(false);
  const [modalAbierto, setModalAbierto] = useState<'REGLAMENTO' | 'PUNTOS' | 'AYUDA' | 'SISTEMAS' | null>(null);

  // Banners oficiales del Portal Alumnos UV
  const banners = [
    { src: '/portal_alumnos_files/canales_uv.png', alt: 'Canales de Comunicación UV' },
    { src: '/portal_alumnos_files/estudiantes_ia.png', alt: 'Estudiantes IA UV' },
    { src: '/portal_alumnos_files/canales_dae.png', alt: 'Canales DAE UV' },
    { src: '/portal_alumnos_files/experiencia_uv_2026.png', alt: 'Experiencia UV 2026' },
    { src: '/portal_alumnos_files/fusa.png', alt: 'FUSA - Fondo Único Solidario' },
    { src: '/portal_alumnos_files/votacion_decanos_2026.png', alt: 'Votación Decanos y Directores 2026' },
  ];

  // Auto-avance del carrusel de banners
  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceBanner((anterior) => (anterior + 1) % banners.length);
    }, 5000);
    return () => clearInterval(intervalo);
  }, [banners.length]);

  const siguienteBanner = () => {
    setIndiceBanner((anterior) => (anterior + 1) % banners.length);
  };

  const anteriorBanner = () => {
    setIndiceBanner((anterior) => (anterior - 1 + banners.length) % banners.length);
  };

  // Módulos del Portal Académico de Alumnos UV
  const modulos: ModuloPortal[] = [
    // -------------------------------------------------------------------------
    // NUEVO BOTÓN: TOMA DE RAMOS (Respeta formato, diseño institucional y estilizado)
    // -------------------------------------------------------------------------
    {
      id: 'toma-ramos',
      titulo: 'Toma de Ramos 2026-1',
      descripcion: 'Acceso a Sala de Espera Virtual e Inscripción Curricular',
      categoria: 'ACADÉMICAS',
      esPrioritario: true,
      icono: '/portal_alumnos_files/tomaramos_icon.svg',
      tipoBoton: estaInscripcionCompletada ? 'success' : 'warning',
      accion: () => {
        if (estaInscripcionCompletada) {
          establecerPasoActual('HORARIO_ARMADO');
        } else {
          entrarAFilaVirtual();
        }
      },
      destacado: true,
    },
    // Módulos prioritarios existentes en el HTML oficial
    {
      id: 'postulacion-mentorias',
      titulo: 'Postulación a Mentorías',
      categoria: 'POSTULACIONES',
      esPrioritario: true,
      icono: '/portal_alumnos_files/postulacionmentoriasalumnos.png',
      tipoBoton: 'warning',
    },
    {
      id: 'transferencia-interna',
      titulo: 'Postulación transferencia interna UV',
      categoria: 'POSTULACIONES',
      esPrioritario: true,
      icono: '/portal_alumnos_files/formularioTransferencia.png',
      tipoBoton: 'warning',
    },
    // Módulos estándar
    {
      id: 'gestion-mentorias',
      titulo: 'Gestión Mentorías',
      categoria: 'ACADÉMICAS',
      icono: '/portal_alumnos_files/satmentorias.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'mis-asignaturas',
      titulo: 'Mis asignaturas',
      descripcion: 'Revisa tus asignaturas inscritas, notas, asistencia y horarios',
      categoria: 'ACADÉMICAS',
      icono: '/portal_alumnos_files/misasignaturas.png',
      tipoBoton: 'secondary',
      accion: () => setTabFicha('ASIGNATURAS'),
    },
    {
      id: 'simulador-academico',
      titulo: 'Simulador académico',
      descripcion: 'Visualiza tu avance académico y realidad curricular',
      categoria: 'ACADÉMICAS',
      icono: '/portal_alumnos_files/simulador.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'situacion-arancelaria',
      titulo: 'Situación arancelaria',
      descripcion: 'Revisa tu situación de aranceles y pagos',
      categoria: 'ADMINISTRATIVAS',
      icono: '/portal_alumnos_files/aranceles.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'mis-datos',
      titulo: 'Mis Datos',
      categoria: 'ADMINISTRATIVAS',
      icono: '/portal_alumnos_files/mis_datos.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'convenio-pagare',
      titulo: 'Convenio Pagaré',
      categoria: 'ADMINISTRATIVAS',
      icono: '/portal_alumnos_files/documentosFichaAcademica.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'aula-virtual-formacion',
      titulo: 'Aula Virtual Formación',
      categoria: 'DOCENCIA',
      icono: '/portal_alumnos_files/aulavirtualformacion.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'consulta-tu-voto',
      titulo: 'Consulta tu voto',
      categoria: 'INFORMACIONES',
      icono: '/portal_alumnos_files/consultatuvoto.png.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'menus-casinos',
      titulo: 'Menús casinos',
      descripcion: 'Entérate de los menús que ofrecen nuestros casinos semanalmente',
      categoria: 'INFORMACIONES',
      icono: '/portal_alumnos_files/menu.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'movilidad-internacional',
      titulo: 'Movilidad Internacional',
      descripcion: 'Postula a movilidad outgoing hacia universidades del mundo',
      categoria: 'OTROS',
      icono: '/portal_alumnos_files/movilidad.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'calendario-actividades',
      titulo: 'Calendario de actividades',
      categoria: 'INFORMACIONES',
      icono: '/portal_alumnos_files/calendarioEventos.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'mis-certificados',
      titulo: 'Mis Certificados',
      descripcion: 'Descarga certificados de alumno regular y de notas',
      categoria: 'ADMINISTRATIVAS',
      icono: '/portal_alumnos_files/certificado.png',
      tipoBoton: 'secondary',
      accion: () => estaInscripcionCompletada && establecerPasoActual('COMPROBANTE_OFICIAL'),
    },
    {
      id: 'movilidad-nacional',
      titulo: 'Movilidad nacional',
      descripcion: 'Postula a movilidad en universidades chilenas',
      categoria: 'OTROS',
      icono: '/portal_alumnos_files/movilidad_nacional.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'nombre-social',
      titulo: 'Nombre social',
      categoria: 'ADMINISTRATIVAS',
      icono: '/portal_alumnos_files/nombreSocial-icon.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'aula-virtual-pregrado',
      titulo: 'Aula Virtual Pregrado',
      categoria: 'DOCENCIA',
      icono: '/portal_alumnos_files/aulapre2020.png',
      tipoBoton: 'secondary',
    },
    {
      id: 'capacitaciones-sistemas',
      titulo: 'Capacitaciones Sistemas',
      descripcion: 'Capacitaciones de sistemas de DGMTD',
      categoria: 'DOCENCIA',
      icono: '/portal_alumnos_files/capacitacionesdgmtd.png',
      tipoBoton: 'secondary',
    },
  ];

  // Filtrado de módulos
  const modulosFiltrados = modulos.filter((m) => {
    const coincideCategoria =
      categoriaSeleccionada === 'TODOS' ||
      m.categoria === categoriaSeleccionada ||
      (categoriaSeleccionada === 'POSTULACIONES' && m.categoria === 'POSTULACIONES');

    const coincideBusqueda =
      busqueda.trim() === '' ||
      m.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      (m.descripcion && m.descripcion.toLowerCase().includes(busqueda.toLowerCase()));

    return coincideCategoria && coincideBusqueda;
  });

  const modulosPrioritarios = modulosFiltrados.filter((m) => m.esPrioritario);
  const modulosRegulares = modulosFiltrados.filter((m) => !m.esPrioritario);

  const categorias = [
    'TODOS',
    'ADMINISTRATIVAS',
    'ACADÉMICAS',
    'INFORMACIONES',
    'OTROS',
    'POSTULACIONES',
    'DOCENCIA',
  ];

  return (
    <div className="portal-alumnos-root selection:bg-[#004A77] selection:text-white">
      {/* ====================================================================
          TOOLBAR SUPERIOR INSTITUCIONAL
          ==================================================================== */}
      <header className="main-toolbar">
        <div className="flex items-center gap-3">
          <span className="sitename">PORTAL ACADÉMICO DE ALUMNOS</span>
        </div>

        <div className="flex items-center gap-2 relative">
          {/* Accesibilidad */}
          <button
            type="button"
            className="button-header"
            title="Accesibilidad"
            aria-label="Accesibilidad"
            onClick={() => alert('Modo de Alto Contraste y Accesibilidad UV activo')}
          >
            <i className="fa-solid fa-universal-access" style={{ fontSize: '1.2rem' }}></i>
          </button>

          {/* Ayuda */}
          <button
            type="button"
            className="button-header"
            title="Ayuda"
            aria-label="Boton ver ayuda"
            onClick={() => setModalAbierto('AYUDA')}
          >
            <i className="pi pi-question-circle" style={{ fontSize: '1.2rem' }}></i>
          </button>

          {/* Mis sistemas */}
          <button
            type="button"
            className="button-header"
            title="Mis sistemas"
            aria-label="Boton ver mis sistemas"
            onClick={() => setModalAbierto('SISTEMAS')}
          >
            <i className="pi pi-th-large" style={{ fontSize: '1.2rem' }}></i>
          </button>

          {/* Avatar de Usuario */}
          <div
            className="mi-cuenta-foto"
            title="Mi cuenta - Bruno Díaz"
            onClick={() => setMenuUsuarioAbierto(!menuUsuarioAbierto)}
          >
            <img
              src="/portal_alumnos_files/avatar_bruno_diaz.jpg"
              alt="Bruno Díaz"
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback si la imagen no carga
                (e.target as HTMLImageElement).src = '/portal_alumnos_files/mis_datos.png';
              }}
            />
          </div>

          {/* Dropdown flotante de Mi Cuenta */}
          {menuUsuarioAbierto && (
            <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-3 px-4 z-50 animate-fadeIn text-slate-800">
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src="/portal_alumnos_files/avatar_bruno_diaz.jpg"
                  alt="Bruno Díaz"
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-[#003c58] leading-tight">Bruno Díaz</h4>
                  <p className="text-[11px] text-slate-500 font-mono">19926640-3</p>
                  <p className="text-[10px] text-slate-400">bruno.diazf@estudiantes.uv.cl</p>
                </div>
              </div>

              <div className="pt-2.5 space-y-1 text-xs">
                <button
                  onClick={() => {
                    setTabFicha('FICHA');
                    setMenuUsuarioAbierto(false);
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-slate-100 font-semibold text-slate-700 flex items-center gap-2"
                >
                  <i className="pi pi-user text-[#003c58]"></i>
                  <span>Ver Ficha Académica</span>
                </button>
                <button
                  onClick={() => {
                    setMenuUsuarioAbierto(false);
                    cerrarSesion();
                  }}
                  className="w-full text-left py-1.5 px-2 rounded hover:bg-red-50 text-red-600 font-semibold flex items-center gap-2"
                >
                  <i className="pi pi-sign-out text-red-600"></i>
                  <span>Cerrar sesión</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ====================================================================
          CUERPO PRINCIPAL (Layout idéntico a Angular PrimeNG)
          ==================================================================== */}
      <main className="main-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* ----------------------------------------------------------------
              COLUMNA IZQUIERDA: Carousel Banners + Enlaces + Ficha (5 / 12)
              ---------------------------------------------------------------- */}
          <div className="lg:col-span-5 space-y-4">
            {/* 1. Carrusel de Banners Institucionales */}
            <div className="p-card overflow-hidden relative group">
              <div className="relative aspect-[16/7] w-full overflow-hidden bg-slate-100">
                <img
                  src={banners[indiceBanner].src}
                  alt={banners[indiceBanner].alt}
                  className="w-full h-full object-cover transition-all duration-500"
                />

                {/* Flecha Anterior */}
                <button
                  type="button"
                  onClick={anteriorBanner}
                  aria-label="Banner anterior"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#003c58] shadow flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <i className="pi pi-chevron-left text-xs font-bold"></i>
                </button>

                {/* Flecha Siguiente */}
                <button
                  type="button"
                  onClick={siguienteBanner}
                  aria-label="Siguiente banner"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-[#003c58] shadow flex items-center justify-center transition-all opacity-80 hover:opacity-100"
                >
                  <i className="pi pi-chevron-right text-xs font-bold"></i>
                </button>

                {/* Indicadores de diapositivas */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 px-2 py-0.5 rounded-full">
                  {banners.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIndiceBanner(i)}
                      aria-label={`Ir al banner ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all ${
                        indiceBanner === i ? 'w-4 bg-white' : 'w-1.5 bg-white/60'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Botones de Enlaces Principales (3 en fila) */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                className="button-enlace-principal"
                onClick={() => setModalAbierto('REGLAMENTO')}
              >
                <i className="pi pi-book text-[#003c58]"></i>
                <span className="truncate">Reglamento UV</span>
              </button>

              <a
                href="https://outlook.office365.com/"
                target="_blank"
                rel="noreferrer"
                className="button-enlace-principal"
              >
                <i className="pi pi-envelope text-[#003c58]"></i>
                <span className="truncate">Mi correo UV</span>
              </a>

              <button
                type="button"
                className="button-enlace-principal"
                onClick={() => setModalAbierto('PUNTOS')}
              >
                <i className="pi pi-map-marker text-[#003c58]"></i>
                <span className="truncate">Puntos de interés</span>
              </button>
            </div>

            {/* 3. Ficha Académica del Alumno */}
            <div className="p-card">
              <div className="p-card-body space-y-4">
                {/* Cabecera del Estudiante con Avatar */}
                <div className="flex items-center gap-4">
                  <img
                    src="/portal_alumnos_files/avatar_bruno_diaz.jpg"
                    alt="Bruno Díaz"
                    className="foto-usuario"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/portal_alumnos_files/mis_datos.png';
                    }}
                  />
                  <div>
                    <h3 className="font-bold text-[#003c58] text-base leading-tight">
                      {estudiante.nombre}
                    </h3>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">{estudiante.rut}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{estudiante.correo}</p>
                  </div>
                </div>

                {/* TabMenu: Ficha académica vs Mis asignaturas */}
                <div className="p-tabmenu">
                  <ul className="p-tabmenu-nav">
                    <li
                      className={`p-tabmenuitem ${tabFicha === 'FICHA' ? 'p-highlight' : ''}`}
                      onClick={() => setTabFicha('FICHA')}
                    >
                      <button
                        type="button"
                        className={`p-menuitem-link ${tabFicha === 'FICHA' ? 'active' : ''}`}
                      >
                        <i className="pi pi-user"></i>
                        <span>Ficha académica</span>
                      </button>
                    </li>
                    <li
                      className={`p-tabmenuitem ${tabFicha === 'ASIGNATURAS' ? 'p-highlight' : ''}`}
                      onClick={() => setTabFicha('ASIGNATURAS')}
                    >
                      <button
                        type="button"
                        className={`p-menuitem-link ${tabFicha === 'ASIGNATURAS' ? 'active' : ''}`}
                      >
                        <i className="pi pi-book"></i>
                        <span>Mis asignaturas</span>
                      </button>
                    </li>
                  </ul>
                </div>

                {/* Contenido según pestaña */}
                {tabFicha === 'FICHA' ? (
                  <div className="overflow-x-auto">
                    <table className="table-bootstrap">
                      <tbody>
                        <tr>
                          <td className="font-bold text-slate-700 w-1/4">Carrera</td>
                          <td className="text-right text-slate-800 font-medium">
                            19085 - INGENIERIA CIVIL EN INFORMATICA - CASA CENTRAL - Dec Res.Ex.N°5329
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-700">Estado</td>
                          <td className="text-right font-extrabold text-emerald-700">
                            ALUMNO REGULAR
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-700">Sede / Campus</td>
                          <td className="text-right text-slate-800">
                            Casa Central • Valparaíso
                          </td>
                        </tr>
                        <tr>
                          <td className="font-bold text-slate-700">Plan de Estudios</td>
                          <td className="text-right text-slate-800">
                            Malla 5125 (Innovada SCT)
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-[#003c58] pb-1 border-b">
                      <span>Cátedras Período 2026-1</span>
                      <span className="text-[11px] text-slate-500">
                        {asignaturasInscritas.length > 0
                          ? `${asignaturasInscritas.length} Inscritas`
                          : 'Proceso Pendiente'}
                      </span>
                    </div>

                    {asignaturasInscritas.length > 0 ? (
                      <div className="space-y-1.5 max-h-56 overflow-y-auto">
                        {asignaturasInscritas.map((item) => (
                          <div
                            key={item.asignatura.codigo}
                            className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between text-xs"
                          >
                            <div>
                              <div className="font-bold text-[#003c58]">
                                {item.asignatura.codigo} - {item.asignatura.nombre}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                Sección {item.seccion.numeroSeccion} • {item.seccion.profesor}
                              </div>
                            </div>
                            <span className="font-bold text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              {item.asignatura.creditosSCT} SCT
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 px-4 bg-amber-50 rounded-lg border border-amber-200 text-amber-900">
                        <i className="pi pi-info-circle text-amber-600 text-xl mb-1"></i>
                        <p className="text-xs font-bold">Sin asignaturas inscritas para 2026-1</p>
                        <p className="text-[11px] text-amber-800/90 mt-1">
                          Accede al módulo prioritario <strong>Toma de Ramos 2026-1</strong> en la
                          derecha para inscribir tu horario curricular.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              COLUMNA DERECHA: Módulos del Portal Académico (7 / 12)
              ---------------------------------------------------------------- */}
          <div className="lg:col-span-7">
            <div className="p-card">
              <div className="p-card-body space-y-4">
                {/* 1. Categorías de Filtro */}
                <div className="flex flex-wrap gap-1.5">
                  {categorias.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategoriaSeleccionada(cat)}
                      className={`filtro-btn ${
                        categoriaSeleccionada === cat ? 'activo' : 'inactivo'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* 2. Barra de Búsqueda y Tag PRIORITARIOS */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                  <div className="relative flex-1">
                    <i className="pi pi-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                    <input
                      type="text"
                      placeholder="Buscar módulo..."
                      value={busqueda}
                      onChange={(e) => setBusqueda(e.target.value)}
                      className="w-full pl-8 pr-8 py-1.5 bg-white border border-[#ced4da] rounded text-xs text-slate-800 focus:outline-none focus:border-[#003c58] focus:ring-1 focus:ring-[#003c58] transition-all"
                    />
                    {busqueda && (
                      <button
                        type="button"
                        onClick={() => setBusqueda('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        title="Limpiar búsqueda"
                      >
                        <i className="pi pi-times text-xs"></i>
                      </button>
                    )}
                  </div>

                  {modulosPrioritarios.length > 0 && (
                    <div className="flex items-center">
                      <span className="tag-modulos-prioritario">
                        <i className="pi pi-star-fill mr-1 text-[10px]"></i>
                        PRIORITARIOS
                      </span>
                    </div>
                  )}
                </div>

                {/* 3. SECCIÓN PRIORITARIOS (Incluye el nuevo botón de Toma de Ramos) */}
                {modulosPrioritarios.length > 0 && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {modulosPrioritarios.map((modulo) => {
                        const esTomaRamos = modulo.id === 'toma-ramos';
                        const claseBoton =
                          modulo.tipoBoton === 'warning'
                            ? 'modulo p-button-warning'
                            : modulo.tipoBoton === 'success'
                            ? 'modulo p-button-success'
                            : 'modulo p-button-secondary p-button-outlined';

                        return (
                          <div key={modulo.id} className="w-full h-full">
                            <button
                              type="button"
                              className={claseBoton}
                              title={modulo.descripcion || modulo.titulo}
                              onClick={modulo.accion}
                              data-modulo-id={modulo.id}
                            >
                              <div className="modulo-button">
                                <div className="icono relative">
                                  <img
                                    src={modulo.icono}
                                    alt={modulo.titulo}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src =
                                        '/portal_alumnos_files/misasignaturas.png';
                                    }}
                                  />
                                  {esTomaRamos && !estaInscripcionCompletada && (
                                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                                    </span>
                                  )}
                                </div>
                                <div className="nombre">
                                  <span>{modulo.titulo}</span>
                                  {esTomaRamos && (
                                    <span
                                      className={`block text-[10px] font-bold mt-0.5 ${
                                        estaInscripcionCompletada
                                          ? 'text-emerald-900'
                                          : 'text-amber-900'
                                      }`}
                                    >
                                      {estaInscripcionCompletada
                                        ? '✓ INSCRIPCIÓN LISTA'
                                        : '• PROCESO ACTIVO'}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. SECCIÓN DE MÓDULOS REGULARES */}
                <div className="space-y-2 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {modulosRegulares.map((modulo) => (
                      <div key={modulo.id} className="w-full h-full">
                        <button
                          type="button"
                          className="modulo p-button-secondary p-button-outlined"
                          title={modulo.descripcion || modulo.titulo}
                          onClick={
                            modulo.accion ||
                            (() =>
                              alert(
                                `Módulo institucional: ${modulo.titulo}\nDirección General de Pregrado UV.`
                              ))
                          }
                        >
                          <div className="modulo-button">
                            <div className="icono">
                              <img
                                src={modulo.icono}
                                alt={modulo.titulo}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    '/portal_alumnos_files/misasignaturas.png';
                                }}
                              />
                            </div>
                            <div className="nombre">
                              <span>{modulo.titulo}</span>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>

                  {modulosFiltrados.length === 0 && (
                    <div className="text-center py-10 text-slate-500 text-xs">
                      <i className="pi pi-filter-slash text-2xl mb-2 text-slate-400"></i>
                      <p>No se encontraron módulos con el criterio de búsqueda.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setCategoriaSeleccionada('TODOS');
                          setBusqueda('');
                        }}
                        className="mt-2 text-[#003c58] font-bold hover:underline"
                      >
                        Restablecer filtros
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ----------------------------------------------------------------
              ENLACES INFERIORES INSTITUCIONALES (Ancho Completo 12 / 12)
              ---------------------------------------------------------------- */}
          <div className="lg:col-span-12 mt-2">
            <div className="p-card">
              <div className="p-card-body">
                <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-center">
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="https://outlook.office365.com/"
                  >
                    Mi correo
                  </a>
                  <a className="enlace" target="_blank" rel="noreferrer" href="http://dae.uv.cl/">
                    DAE
                  </a>
                  <a className="enlace" target="_blank" rel="noreferrer" href="http://www.uv.cl/">
                    Noticias UV
                  </a>
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="http://bibliotecas.uv.cl/"
                  >
                    Bibliotecas
                  </a>
                  <a className="enlace" target="_blank" rel="noreferrer" href="http://sitios.uv.cl/">
                    Sitios Internos
                  </a>
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="http://aranceles.uv.cl/"
                  >
                    Aranceles
                  </a>
                  <a className="enlace" target="_blank" rel="noreferrer" href="http://dtic.uv.cl/">
                    DTIC
                  </a>
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="http://extension.uv.cl/"
                  >
                    Extensión
                  </a>
                  <a className="enlace" target="_blank" rel="noreferrer" href="http://www.feuv.cl/">
                    FEUV
                  </a>
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="https://desarrolloacademico.uv.cl/"
                  >
                    Departamento para el desarrollo Académico
                  </a>
                  <a
                    className="enlace"
                    target="_blank"
                    rel="noreferrer"
                    href="https://revistas.uv.cl/"
                  >
                    Revistas UV
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ====================================================================
          FOOTER INSTITUCIONAL OFICIAL
          ==================================================================== */}
      <footer className="footer mt-auto">
        <div className="flex items-center justify-center gap-3">
          <div className="hidden sm:inline pr-2">
            <img
              alt="logo uv footer"
              height="50"
              className="h-12 w-auto"
              src="/portal_alumnos_files/uv_azul.svg"
            />
          </div>
          <div className="flex flex-col items-center sm:items-start text-xs">
            <span className="font-bold text-[#003c58]">PORTAL ACADÉMICO DE ALUMNOS</span>
            <div>
              <a
                target="_blank"
                rel="noreferrer"
                className="link-footer"
                href="https://uv.cl/"
              >
                Universidad de Valparaíso
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          MODALES DE APOYO INSTITUCIONAL
          ==================================================================== */}
      {modalAbierto === 'REGLAMENTO' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-[#003c58] text-base flex items-center gap-2">
                <i className="pi pi-book text-[#003c58]"></i>
                Reglamento General de Estudios UV
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700 leading-relaxed max-h-80 overflow-y-auto">
              <p>
                <strong>Artículo 15.° - Carga Académica Semestral:</strong> El alumno regular
                podrá inscribir un máximo de hasta 32 créditos SCT por semestre regular, requiriendo
                autorización expresa de Jefatura de Carrera para sobrecarga académica.
              </p>
              <p>
                <strong>Artículo 22.° - Fila Virtual e Inscripción:</strong> El orden de atención
                durante el período de inscripción se rige por grupos de prioridad académica
                ponderada. El turno asignado concede una ventana de 10 minutos protegidos para
                confirmar la selección sin interrupciones.
              </p>
              <p>
                <strong>Artículo 31.° - Topes de Horario:</strong> El sistema informático
                impedirá la confirmación de cátedras o laboratorios con conflicto horario total o
                parcial en los mismos bloques lectivos.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="px-4 py-1.5 bg-[#003c58] text-white font-bold text-xs rounded hover:bg-[#002f45]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto === 'PUNTOS' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-[#003c58] text-base flex items-center gap-2">
                <i className="pi pi-map-marker text-[#003c58]"></i>
                Puntos de Interés • Casa Central y Campus
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="py-4 space-y-2 text-xs text-slate-700">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong className="text-[#003c58]">Facultad de Ingeniería</strong>
                <p className="text-[11px] text-slate-500">
                  General Cruz 222, Valparaíso • Escuela de Informática
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong className="text-[#003c58]">Dirección de Asuntos Estudiantiles (DAE)</strong>
                <p className="text-[11px] text-slate-500">
                  Blanco 951, Valparaíso • Beneficios, Becas y Apoyo al Alumno
                </p>
              </div>
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                <strong className="text-[#003c58]">DTIC - Soporte Tecnológico</strong>
                <p className="text-[11px] text-slate-500">
                  Av. El Parque 570, Playa Ancha, Valparaíso • Mesa de Ayuda
                </p>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="px-4 py-1.5 bg-[#003c58] text-white font-bold text-xs rounded hover:bg-[#002f45]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto === 'AYUDA' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-[#003c58] text-base flex items-center gap-2">
                <i className="pi pi-question-circle text-[#003c58]"></i>
                Mesa de Ayuda Portal UV
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="py-4 space-y-3 text-xs text-slate-700">
              <p>
                Para consultas sobre tu inscripción curricular, claves institucionales o problemas
                de acceso, puedes contactar a los canales oficiales:
              </p>
              <div className="space-y-1.5 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <strong>Teléfono Mesa de Ayuda:</strong> (32) 250 7000
                </div>
                <div>
                  <strong>Correo de Soporte:</strong> mesa.ayuda@uv.cl
                </div>
                <div>
                  <strong>Horario de Atención:</strong> Lunes a Viernes de 08:30 a 18:00 hrs.
                </div>
              </div>
            </div>
            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="px-4 py-1.5 bg-[#003c58] text-white font-bold text-xs rounded hover:bg-[#002f45]"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAbierto === 'SISTEMAS' && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-[#003c58] text-base flex items-center gap-2">
                <i className="pi pi-th-large text-[#003c58]"></i>
                Mis Sistemas Universitarios UV
              </h3>
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="pi pi-times"></i>
              </button>
            </div>
            <div className="py-4 grid grid-cols-2 gap-2 text-xs">
              <a
                href="https://aulavirtual.uv.cl"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex flex-col items-center text-center gap-1 text-[#003c58] font-bold"
              >
                <i className="pi pi-desktop text-lg"></i>
                <span>Aula Virtual</span>
              </a>
              <a
                href="https://portal.office.com"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex flex-col items-center text-center gap-1 text-[#003c58] font-bold"
              >
                <i className="pi pi-microsoft text-lg"></i>
                <span>Office 365</span>
              </a>
              <a
                href="https://bibliotecas.uv.cl"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex flex-col items-center text-center gap-1 text-[#003c58] font-bold"
              >
                <i className="pi pi-bookmark text-lg"></i>
                <span>Bibliotecas UV</span>
              </a>
              <a
                href="https://pagofacil.uv.cl"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-slate-50 hover:bg-slate-100 rounded border border-slate-200 flex flex-col items-center text-center gap-1 text-[#003c58] font-bold"
              >
                <i className="pi pi-credit-card text-lg"></i>
                <span>Pago Fácil</span>
              </a>
            </div>
            <div className="pt-3 border-t border-slate-200 text-right">
              <button
                type="button"
                onClick={() => setModalAbierto(null)}
                className="px-4 py-1.5 bg-[#003c58] text-white font-bold text-xs rounded hover:bg-[#002f45]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
