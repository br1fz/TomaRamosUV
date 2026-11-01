import React from 'react';
import { ExternalLink, Link2, Search } from 'lucide-react';

interface EnlaceInstitucional {
  titulo: string;
  subtitulo: string;
  icono: string;
  url: string;
}

export const EnlacesApptuiMovil: React.FC = () => {
  const enlaces: EnlaceInstitucional[] = [
    {
      titulo: 'Portal UV',
      subtitulo: 'Portal Institucional Central',
      icono: '/apptui_extracted/assets/images/enlaces/uv_icon_circle.png',
      url: 'https://uv.cl',
    },
    {
      titulo: 'Bibliotecas UV',
      subtitulo: 'Catálogo y préstamos',
      icono: '/apptui_extracted/assets/images/enlaces/bibliotecas.png',
      url: 'https://bibliotecas.uv.cl',
    },
    {
      titulo: 'Aranceles UV',
      subtitulo: 'Portal de pagos y cuotas',
      icono: '/apptui_extracted/assets/images/enlaces/aranceles.png',
      url: 'https://aranceles.uv.cl',
    },
    {
      titulo: 'DAE UV',
      subtitulo: 'Desarrollo Estudiantil',
      icono: '/apptui_extracted/assets/images/enlaces/dae.png',
      url: 'https://dae.uv.cl',
    },
    {
      titulo: 'División Académica',
      subtitulo: 'Trámites curriculares',
      icono: '/apptui_extracted/assets/images/enlaces/divacad.png',
      url: 'https://divacad.uv.cl',
    },
    {
      titulo: 'DTIC UV',
      subtitulo: 'Tecnologías y soporte',
      icono: '/apptui_extracted/assets/images/enlaces/dtic.png',
      url: 'https://dtic.uv.cl',
    },
    {
      titulo: 'Correo UV (Gmail)',
      subtitulo: 'Bandeja institucional',
      icono: '/apptui_extracted/assets/images/enlaces/gmail.png',
      url: 'https://mail.google.com',
    },
    {
      titulo: 'Microsoft 365',
      subtitulo: 'Office, Teams y OneDrive',
      icono: '/apptui_extracted/assets/images/enlaces/office.png',
      url: 'https://portal.office.com',
    },
    {
      titulo: 'FEUV Casa Central',
      subtitulo: 'Federación de Estudiantes',
      icono: '/apptui_extracted/assets/images/enlaces/feuv.png',
      url: 'https://feuv.cl',
    },
    {
      titulo: 'Investigación UV',
      subtitulo: 'Proyectos y publicaciones',
      icono: '/apptui_extracted/assets/images/enlaces/investigacion.png',
      url: 'https://investigacion.uv.cl',
    },
  ];

  return (
    <div className="p-4 space-y-4 animate-fadeIn text-slate-100 select-none">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link2 className="w-5 h-5 text-[#31C4D7]" />
          <h2 className="text-base font-extrabold text-white">Enlaces de Interés</h2>
        </div>
        <span className="text-[11px] font-bold text-slate-400">10 portales</span>
      </div>

      {/* Buscador */}
      <div className="relative">
        <input
          type="text"
          placeholder="Buscar enlace institucional..."
          className="w-full bg-[#20232A] border border-[#2D323E] rounded-2xl py-2.5 pl-9 pr-4 text-xs text-white placeholder-slate-400 outline-none focus:border-[#31C4D7]"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
      </div>

      {/* Cuadrícula de Enlaces */}
      <div className="grid grid-cols-2 gap-3">
        {enlaces.map((enlace, idx) => (
          <a
            key={idx}
            href={enlace.url}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#20232A] border border-[#2D323E] hover:border-[#31C4D7] rounded-2xl p-3 flex flex-col justify-between transition-all group active:scale-95"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="w-10 h-10 rounded-xl bg-[#14151A] p-1.5 flex items-center justify-center border border-[#2D323E]">
                <img
                  src={enlace.icono}
                  alt={enlace.titulo}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#31C4D7] transition-colors" />
            </div>

            <div>
              <h4 className="font-extrabold text-xs text-white group-hover:text-[#31C4D7] transition-colors leading-tight">
                {enlace.titulo}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                {enlace.subtitulo}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

