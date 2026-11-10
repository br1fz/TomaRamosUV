import React, { useState } from 'react';
import { Key, Eye, EyeOff, LogIn, AlertTriangle, CheckCircle2, ShieldCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { usarTomaRamos } from '../../contextos/ContextoTomaRamos';

type PerfilUsuario = 'PREGRADO' | 'FUNCIONARIOS' | 'POSTGRADO' | 'ALUMNI';

export const PaginaEntradaPortalUV: React.FC = () => {
  const { iniciarSesionConCredenciales, seleccionarUsuarioPruebaDirecto, usuariosPrueba } = usarTomaRamos();

  const [perfilSeleccionado, setPerfilSeleccionado] = useState<PerfilUsuario>('PREGRADO');
  const [cuenta, setCuenta] = useState<string>('prueba1');
  const [password, setPassword] = useState<string>('PruebaUV.2026!');
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [cargando, setCargando] = useState<boolean>(false);
  const [errorLogin, setErrorLogin] = useState<string | null>(null);
  const [mostrarPanelAlpha, setMostrarPanelAlpha] = useState<boolean>(true);
  const [modalAyudaAbierto, setModalAyudaAbierto] = useState<boolean>(false);
  const [modalAccesibilidadAbierto, setModalAccesibilidadAbierto] = useState<boolean>(false);

  // Dominio de correo según el perfil seleccionado
  const obtenerDominio = () => {
    switch (perfilSeleccionado) {
      case 'PREGRADO':
        return '@estudiantes.uv.cl';
      case 'POSTGRADO':
        return '@postgrado.uv.cl';
      case 'FUNCIONARIOS':
        return '@uv.cl';
      case 'ALUMNI':
        return '@alumni.uv.cl';
      default:
        return '@estudiantes.uv.cl';
    }
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cuenta.trim()) return;

    setCargando(true);
    setErrorLogin(null);

    const identificador = cuenta.includes('@') ? cuenta.trim() : `${cuenta.trim()}${obtenerDominio()}`;
    const resultado = await iniciarSesionConCredenciales(identificador, password);
    setCargando(false);

    if (!resultado.exito) {
      setErrorLogin(resultado.mensajeError || 'Credenciales institucionales incorrectas');
    }
  };

  const seleccionarUsuarioRapido = (usuarioId: string) => {
    const usuario = usuariosPrueba.find((u) => u.id === usuarioId);
    if (usuario) {
      setPerfilSeleccionado('PREGRADO');
      setCuenta(usuario.correo.split('@')[0]);
      setPassword('PruebaUV.2026!');
      setErrorLogin(null);
    }
  };

  const enlacesInstitucionales = [
    { etiqueta: 'UV', url: 'https://www.uv.cl', titulo: 'Ingresa a la página de la UV' },
    { etiqueta: 'Correo UV', url: 'https://correo.uv.cl', titulo: 'Accede a tu correo institucional' },
    { etiqueta: 'Bibliotecas', url: 'https://bibliotecas.uv.cl', titulo: 'Dirección de Bibliotecas y Recursos para el Aprendizaje' },
    { etiqueta: 'Pago fácil UV', url: 'https://pagofacil.uv.cl', titulo: 'Sistema de pago para los alumnos de pregrado' },
    { etiqueta: 'Office 365', url: 'https://portal.office.com', titulo: 'Suite Office 365 Pro Plus gratis para alumnos, académicos y personal de la UV' },
    { etiqueta: 'Investigación', url: 'https://investigacion.uv.cl', titulo: 'Vicerrectoría de Investigación e Innovación' },
    { etiqueta: 'TUI UV', url: 'https://tui.uv.cl', titulo: 'Obtén tu Tarjeta Universitaria Inteligente (TUI)' },
    { etiqueta: 'DTIC', url: 'https://dtic.uv.cl', titulo: 'Dirección de Tecnologías de Información y Comunicación' },
    { etiqueta: 'DAE', url: 'https://dae.uv.cl', titulo: 'Dirección de Asuntos Estudiantiles' },
    { etiqueta: 'Aranceles', url: 'https://aranceles.uv.cl', titulo: 'Unidad de Aranceles y Cobranzas' },
    { etiqueta: 'VRA Desarrollo', url: 'https://vra.uv.cl', titulo: 'Departamento para el desarrollo Académico' },
    { etiqueta: 'Verifica documentos', url: 'https://validador.uv.cl', titulo: 'Verifica documentos emitidos por la UV' },
    { etiqueta: 'Pago Cursos', url: 'https://pagos.uv.cl', titulo: 'Pago Cursos' },
    { etiqueta: 'Revistas UV', url: 'https://revistas.uv.cl', titulo: 'Portal de revistas' },
  ];

  return (
    <div className="w-full min-h-[calc(100vh-42px)] bg-[#e9ecef] font-['Nunito',sans-serif] flex flex-col justify-between">
      {/* Contenedor Grid Principal idéntico a Angular PrimeNG */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-42px)] w-full m-0 p-0">
        
        {/* ========================================================
            COLUMNA IZQUIERDA: FONDO CAMPUS UV + TITULARES + ENLACES
            (Visible en pantallas lg: y xl:, oculto en móviles)
           ======================================================== */}
        <div
          className="hidden lg:flex lg:col-span-8 xl:col-span-9 p-8 relative flex-col justify-between overflow-hidden"
          style={{
            backgroundColor: '#013c58',
            backgroundImage: "url('https://repositorio.uv.cl/imagenes/login/principal.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          {/* Capa de Opacidad Oscura Oficial UV */}
          <div
            className="absolute inset-0 block pointer-events-none"
            style={{
              backgroundColor: '#181c21fc',
              opacity: 0.72,
            }}
          />

          {/* Espaciador superior */}
          <div className="relative z-10"></div>

          {/* Títulos Principales Oficiales */}
          <div className="relative z-10 my-auto text-white select-none">
            <h1
              className="text-white tracking-normal font-sans"
              style={{
                fontSize: '70px',
                fontWeight: 700,
                lineHeight: 1.1,
              }}
            >
              Portal UV
            </h1>
            <p
              className="text-white/95 font-sans mt-2"
              style={{
                fontSize: '30px',
                fontWeight: 400,
              }}
            >
              Acceso a sistemas institucionales
            </p>
          </div>

          {/* Barra de Enlaces Institucionales UV (Fondo Azul Marino #003c58) */}
          <div className="relative z-10 mt-auto">
            <div
              className="flex flex-wrap gap-1.5 p-2 rounded-[5px] shadow-lg backdrop-blur-sm"
              style={{ backgroundColor: '#003c58' }}
            >
              {enlacesInstitucionales.map((enlace, idx) => (
                <a
                  key={idx}
                  href={enlace.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={enlace.titulo}
                  className="px-2.5 py-1 text-xs text-white rounded transition-colors hover:underline hover:bg-white/10 select-none whitespace-nowrap"
                  style={{ textDecoration: 'none' }}
                >
                  {enlace.etiqueta}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================================
            COLUMNA DERECHA: FORMULARIO DE ACCESO INSTITUCIONAL
           ======================================================== */}
        <div className="col-span-1 lg:col-span-4 xl:col-span-3 bg-white p-6 sm:p-8 md:p-10 flex flex-col justify-between items-center relative shadow-2xl z-10">
          
          <div className="w-full max-w-sm mx-auto my-auto">
            {/* Logo UV con Acreditación Máxima (Desktop) */}
            <div className="hidden lg:block mb-6 text-center">
              <img
                src="/uv_acreditacion_azul.svg"
                alt="Universidad de Valparaíso"
                className="max-h-[80px] w-auto mx-auto object-contain"
              />
            </div>

            {/* Logo UV (Móvil) */}
            <div className="block lg:hidden text-center mb-4">
              <img
                src="/uv_acreditacion_azul.svg"
                alt="Universidad de Valparaíso"
                className="h-[60px] w-auto mx-auto object-contain"
              />
            </div>

            {/* Título en Versión Móvil */}
            <div className="block lg:hidden text-center text-[#003c58] mb-5">
              <h3 className="text-2xl font-bold">Portal UV</h3>
              <div className="text-sm font-medium text-slate-600">Acceso a sistemas institucionales</div>
            </div>

            {/* Selector de Perfiles (2x2 Grid) */}
            <div className="mb-5">
              <label
                htmlFor="login"
                className="block text-[#003c58] text-sm font-bold mb-2 select-none"
              >
                Selecciona un perfil *
              </label>

              <div className="grid grid-cols-2 gap-2">
                {/* 1. Estudiantes Pregrado */}
                <button
                  type="button"
                  onClick={() => setPerfilSeleccionado('PREGRADO')}
                  className={`w-full py-2.5 px-2 rounded-[4px] text-center text-xs font-bold leading-snug transition-all cursor-pointer shadow-sm ${
                    perfilSeleccionado === 'PREGRADO'
                      ? 'bg-[#003c58] text-white ring-2 ring-[#003c58] ring-offset-1'
                      : 'bg-[#6c757d] hover:bg-[#5a6268] text-white'
                  }`}
                >
                  Estudiantes<br />Pregrado
                </button>

                {/* 2. Académicos y Funcionarios */}
                <button
                  type="button"
                  onClick={() => setPerfilSeleccionado('FUNCIONARIOS')}
                  className={`w-full py-2.5 px-2 rounded-[4px] text-center text-xs font-bold leading-snug transition-all cursor-pointer shadow-sm ${
                    perfilSeleccionado === 'FUNCIONARIOS'
                      ? 'bg-[#003c58] text-white ring-2 ring-[#003c58] ring-offset-1'
                      : 'bg-[#6c757d] hover:bg-[#5a6268] text-white'
                  }`}
                >
                  Académicos y<br />Funcionarios
                </button>

                {/* 3. Estudiantes Postgrado */}
                <button
                  type="button"
                  onClick={() => setPerfilSeleccionado('POSTGRADO')}
                  className={`w-full py-2.5 px-2 rounded-[4px] text-center text-xs font-bold leading-snug transition-all cursor-pointer shadow-sm ${
                    perfilSeleccionado === 'POSTGRADO'
                      ? 'bg-[#003c58] text-white ring-2 ring-[#003c58] ring-offset-1'
                      : 'bg-[#6c757d] hover:bg-[#5a6268] text-white'
                  }`}
                >
                  Estudiantes<br />Postgrado
                </button>

                {/* 4. Alumni */}
                <button
                  type="button"
                  onClick={() => setPerfilSeleccionado('ALUMNI')}
                  className={`w-full py-2.5 px-2 rounded-[4px] text-center text-xs font-bold leading-snug transition-all cursor-pointer shadow-sm ${
                    perfilSeleccionado === 'ALUMNI'
                      ? 'bg-[#003c58] text-white ring-2 ring-[#003c58] ring-offset-1'
                      : 'bg-[#6c757d] hover:bg-[#5a6268] text-white'
                  }`}
                >
                  Alumni
                </button>
              </div>
            </div>

            {/* ========================================================
                FORMULARIO DE ACCESO CON PREFIJO Y SUFIJO PRIME-NG
               ======================================================== */}
            <form onSubmit={manejarEnvio} className="space-y-4">
              
              {/* Campo Cuenta */}
              <div>
                <label
                  htmlFor="user"
                  className="block text-[#003c58] text-sm font-bold mb-1 select-none"
                >
                  Cuenta
                </label>
                <div className="flex rounded-[4px] shadow-sm overflow-hidden border border-[#ced4da] focus-within:border-[#003c58] focus-within:ring-1 focus-within:ring-[#003c58] transition-all">
                  <input
                    id="user"
                    type="text"
                    required
                    value={cuenta}
                    onChange={(e) => setCuenta(e.target.value)}
                    placeholder="nombre.apellido"
                    className="flex-1 px-3 py-2 text-sm text-[#212529] bg-white outline-none font-sans"
                  />
                  <span className="bg-[#e9ecef] border-l border-[#ced4da] px-2.5 py-2 text-xs font-semibold text-[#6c757d] flex items-center select-none whitespace-nowrap">
                    {obtenerDominio()}
                  </span>
                </div>
              </div>

              {/* Campo Contraseña con Ojo Revelador */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-[#003c58] text-sm font-bold mb-1 select-none"
                >
                  Contraseña
                </label>
                <div className="relative rounded-[4px] shadow-sm border border-[#ced4da] focus-within:border-[#003c58] focus-within:ring-1 focus-within:ring-[#003c58] transition-all flex items-center bg-white">
                  <span className="pl-3 text-[#6c757d]">
                    <Key className="w-4 h-4 text-slate-400" />
                  </span>
                  <input
                    id="password"
                    type={mostrarPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full px-2.5 py-2 text-sm text-[#212529] bg-transparent outline-none font-sans pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarPassword(!mostrarPassword)}
                    className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    title={mostrarPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                  >
                    {mostrarPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Mensaje de Error de Autenticación */}
              {errorLogin && (
                <div className="p-2.5 rounded-[4px] border border-red-300 bg-red-50 text-red-800 text-xs flex items-start gap-2 animate-shake">
                  <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="font-medium">{errorLogin}</p>
                </div>
              )}

              {/* Panel de Usuarios de Prueba Alpha Testing (12 Testers) */}
              <div className="rounded-[4px] border border-sky-200 bg-sky-50/70 p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#003c58]">
                    <ShieldCheck className="w-4 h-4 text-sky-600" />
                    <span>Alpha Testers (12 Alumnos)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMostrarPanelAlpha(!mostrarPanelAlpha)}
                    className="text-[11px] text-sky-700 hover:text-sky-900 font-semibold flex items-center gap-0.5 cursor-pointer"
                  >
                    <span>{mostrarPanelAlpha ? 'Ocultar' : 'Ver todos'}</span>
                    {mostrarPanelAlpha ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {mostrarPanelAlpha && (
                  <div className="space-y-2 pt-1 border-t border-sky-100">
                    <p className="text-[10px] text-slate-600 leading-tight">
                      Contraseña bcrypt común: <strong className="text-slate-800 font-mono">PruebaUV.2026!</strong>. Haz clic para seleccionar o ingresar directo:
                    </p>
                    <div className="grid grid-cols-3 gap-1 max-h-36 overflow-y-auto pr-0.5">
                      {usuariosPrueba.map((u) => {
                        const usuarioNick = u.correo.split('@')[0];
                        const esSeleccionado = cuenta === usuarioNick;
                        return (
                          <div
                            key={u.id}
                            className={`p-1 rounded border text-[10px] text-center transition-all ${
                              esSeleccionado
                                ? 'bg-[#003c58] text-white border-[#003c58] font-bold shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-100 hover:border-sky-300'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => seleccionarUsuarioRapido(u.id)}
                              className="w-full text-center truncate block font-bold cursor-pointer"
                              title={`${u.nombre} - Semestre ${u.semestreActual} (${u.rut})`}
                            >
                              {usuarioNick}
                            </button>
                            <button
                              type="button"
                              onClick={() => seleccionarUsuarioPruebaDirecto(u)}
                              className={`w-full text-[9px] mt-0.5 px-1 py-0.5 rounded cursor-pointer ${
                                esSeleccionado ? 'bg-sky-400 text-slate-950 font-bold' : 'bg-slate-100 text-[#003c58] hover:bg-sky-200'
                              }`}
                              title="Ingresar directamente con este usuario"
                            >
                              Sem {u.semestreActual} ➔
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Banner Informativo de Concurrencia y Sesión Única */}
              <div className="p-2.5 rounded-[4px] border border-amber-300 bg-amber-50/90 text-amber-900 text-[11px] leading-tight flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Sesión Única UV:</strong> Su turno en la fila virtual está vinculado a su cuenta institucional. Acceder desde otro dispositivo transferirá la sesión automáticamente.
                </p>
              </div>

              {/* Fila de Acción: Olvidó contraseña + Botón Ingresar */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setModalAyudaAbierto(true)}
                  className="text-xs text-[#007bff] hover:text-[#0056b3] hover:underline cursor-pointer bg-transparent border-none p-0 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                <button
                  type="submit"
                  disabled={cargando}
                  className="bg-[#003c58] hover:bg-[#002f45] active:bg-[#002537] text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-[4px] flex items-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  {cargando ? (
                    <span className="inline-block animate-spin mr-1">⌛</span>
                  ) : (
                    <LogIn className="w-3.5 h-3.5" />
                  )}
                  <span>Ingresar</span>
                </button>
              </div>
            </form>
          </div>

          {/* ========================================================
              PIE DERECHO: VERSIÓN DTIC Y ACCESIBILIDAD
             ======================================================== */}
          <div className="w-full text-center mt-6 pt-4 border-t border-slate-100 flex flex-col items-center gap-3">
            
            {/* Botón otros sitios en versión móvil */}
            <div className="block lg:hidden">
              <a
                href="https://www.uv.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-[4px] transition-all"
              >
                Otros sitios UV
              </a>
            </div>

            {/* Versión DTIC Institucional */}
            <div className="text-xs text-[#003c58] font-bold leading-tight select-none">
              10.1.1<br />
              <span className="text-[11px] font-semibold text-slate-500">DTIC © 2026</span>
            </div>

            {/* Botón Circular Azul de Accesibilidad */}
            <button
              type="button"
              onClick={() => setModalAccesibilidadAbierto(true)}
              title="Accesibilidad"
              className="w-10 h-10 rounded-full bg-[#007bff] hover:bg-[#0069d9] text-white flex items-center justify-center shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer mt-1"
            >
              {/* Ícono Oficial FontAwesome Universal Access */}
              <svg
                className="w-5 h-5 fill-current"
                viewBox="0 0 512 512"
                aria-hidden="true"
                role="img"
              >
                <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm161.5-86.1c-12.2-5.2-26.3 .4-31.5 12.6s.4 26.3 12.6 31.5l11.9 5.1c17.3 7.4 35.2 12.9 53.6 16.3l0 50.1c0 4.3-.7 8.6-2.1 12.6l-28.7 86.1c-4.2 12.6 2.6 26.2 15.2 30.4s26.2-2.6 30.4-15.2l24.4-73.2c1.3-3.8 4.8-6.4 8.8-6.4s7.6 2.6 8.8 6.4l24.4 73.2c4.2 12.6 17.8 19.4 30.4 15.2s19.4-17.8 15.2-30.4l-28.7-86.1c-1.4-4.1-2.1-8.3-2.1-12.6l0-50.1c18.4-3.5 36.3-8.9 53.6-16.3l11.9-5.1c12.2-5.2 17.8-19.3 12.6-31.5s-19.3-17.8-31.5-12.6L338.7 175c-26.1 11.2-54.2 17-82.7 17s-56.5-5.8-82.7-17l-11.9-5.1zM256 160a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
              </svg>
            </button>
          </div>

          {/* Onda Decorativa en Móvil (wave.svg) */}
          <img
            src="/wave.svg"
            alt=""
            className="wave block lg:hidden fixed bottom-0 left-0 right-0 w-full pointer-events-none opacity-40 z-0"
          />
        </div>
      </div>

      {/* Modal Ayuda / Recuperación de Contraseña */}
      {modalAyudaAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-lg font-bold text-[#003c58] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-sky-600" />
              Recuperación de Contraseña UV
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Para recuperar o restablecer su clave de acceso al Portal UV, debe acudir al autoservicio institucional de contraseñas de la DTIC o solicitar asistencia en la mesa de ayuda:
            </p>
            <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-700 space-y-1 mb-4">
              <p><strong>Mesa de Ayuda DTIC:</strong> (32) 250 7000</p>
              <p><strong>Correo de soporte:</strong> soporte@uv.cl</p>
              <p><strong>Horario de atención:</strong> Lunes a Viernes de 08:30 a 18:00 hrs.</p>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalAyudaAbierto(false)}
                className="px-4 py-2 bg-[#003c58] text-white text-xs font-bold rounded hover:bg-[#002f45]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Accesibilidad */}
      {modalAccesibilidadAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-[#003c58] mb-3 flex items-center gap-2">
              <span>Opciones de Accesibilidad</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              El Portal UV cumple con los estándares de accesibilidad web WCAG 2.1 AA.
            </p>
            <div className="space-y-2 mb-4 text-xs font-semibold">
              <button
                type="button"
                onClick={() => document.documentElement.classList.toggle('invert')}
                className="w-full py-2 px-3 text-left border rounded hover:bg-slate-50 flex justify-between"
              >
                <span>Alternar Alto Contraste</span>
                <span>🌓</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const currentSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
                  document.documentElement.style.fontSize = `${currentSize === 16 ? 18 : 16}px`;
                }}
                className="w-full py-2 px-3 text-left border rounded hover:bg-slate-50 flex justify-between"
              >
                <span>Aumentar Tamaño de Fuente</span>
                <span>🔤</span>
              </button>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setModalAccesibilidadAbierto(false)}
                className="px-4 py-2 bg-[#003c58] text-white text-xs font-bold rounded"
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

