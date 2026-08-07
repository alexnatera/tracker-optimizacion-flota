import React from 'react';

export type ModuloId =
  | 'resumen'
  | 'portafolio'
  | 'tareas'
  | 'radar'
  | 'contactos'
  | 'visitas'
  | 'equipo'
  | 'historial'
  | 'ajustes'
  | 'mejora';

interface SidebarProps {
  moduloActivo: ModuloId;
  onSeleccionarModulo: (id: ModuloId) => void;
  conteoPendientes?: number;
  temaOscuro?: boolean;
  onToggleTema?: () => void;
  usuarioEmail?: string;
  usuarioRol?: string;
}

interface ItemMenu {
  id: ModuloId;
  label: string;
  corto: string;
  icono: string;
  color: string;
  badge?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  moduloActivo,
  onSeleccionarModulo,
  conteoPendientes = 0,
  temaOscuro = false,
  onToggleTema,
  usuarioEmail = '',
  usuarioRol = 'lector'
}) => {
  const modulos: ItemMenu[] = [
    {
      id: 'resumen',
      label: 'Resumen',
      corto: 'Resumen',
      icono: 'M4 4h16v16H4zM8 15v-3M12 15V9M16 15v-5',
      color: '#3f6d96'
    },
    {
      id: 'portafolio',
      label: 'Portafolio',
      corto: 'Portafolio',
      icono: 'M4 8h16v11H4zM9 8V6h6v2M4 13h16',
      color: '#2f9e7a'
    },
    {
      id: 'tareas',
      label: 'Tareas',
      corto: 'Tareas',
      icono: 'M5 7l2 2 4-4M5 15l2 2 4-4M13 7h6M13 17h6',
      color: '#d17a3f',
      badge: conteoPendientes
    },
    {
      id: 'radar',
      label: 'Radar por país',
      corto: 'Radar',
      icono: 'M12 12l6-4M12 21a9 9 0 100-18 9 9 0 000 18zM12 16a4 4 0 100-8 4 4 0 000 8z',
      color: '#c0483f'
    },
    {
      id: 'contactos',
      label: 'Contactos por país',
      corto: 'Contactos',
      icono: 'M7 3h12v18H7zM7 8H4M7 12H4M7 16H4M13 11.5a2 2 0 100-4 2 2 0 000 4M10 17c0-2 1.4-3 3-3s3 1 3 3',
      color: '#7a5cb0'
    },
    {
      id: 'visitas',
      label: 'Calendario de visitas',
      corto: 'Visitas',
      icono: 'M10.5 3.2a1.5 1.5 0 013 0V9l7.5 4.4v2.2l-7.5-2.3v4.4l2.6 1.9v1.7L12 20.4l-4.1 1.1v-1.7l2.6-1.9v-4.4L3 15.6v-2.2L10.5 9z',
      color: '#2e8ea6'
    },
    {
      id: 'equipo',
      label: 'Equipo y capacidad',
      corto: 'Equipo',
      icono: 'M9 10.5a2.8 2.8 0 100-5.6 2.8 2.8 0 000 5.6zM17 11a2.3 2.3 0 100-4.6 2.3 2.3 0 000 4.6M3 19c0-3.2 2.7-5 6-5s6 1.8 6 5M15.5 19c0-2 .8-3.4 2.2-4',
      color: '#8a5a3f'
    },
    {
      id: 'mejora',
      label: 'Mejora continua DMAIC',
      corto: 'Mejora',
      icono: 'M4 19V5M4 19h16M8 19v-5.5M12 19V9.5M16 19v-8M7.5 7.5l3-3 3 3 4-4',
      color: '#b0872b'
    },
    {
      id: 'historial',
      label: 'Historial de cambios',
      corto: 'Historial',
      icono: 'M12 21a9 9 0 10-8.6-11.6M3 4v5h5M12 8v4.5l3.5 2',
      color: '#6b7280'
    },
    {
      id: 'ajustes',
      label: 'Configuración',
      corto: 'Ajustes',
      icono: 'M12 15.2a3.2 3.2 0 100-6.4 3.2 3.2 0 000 6.4zM12 2.8v2.6M12 18.6v2.6M4.05 7.4l2.25 1.3M17.7 15.3l2.25 1.3M4.05 16.6l2.25-1.3M17.7 8.7l2.25-1.3',
      color: '#55617a'
    }
  ];

  return (
    <aside
      data-nav="1"
      data-noprint="1"
      style={{
        width: '246px',
        flex: '0 0 246px',
        background: 'linear-gradient(180deg,#0d2340 0%,#16324f 62%,#1b3d5c 100%)',
        color: '#fff',
        padding: '22px 0',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}
    >
      {/* Brand Header */}
      <div data-navbrand="1" style={{ padding: '0 22px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="#b0872b"
            strokeWidth="1.6"
            strokeLinecap="round"
          >
            <circle cx="12" cy="9" r="1.8"></circle>
            <path d="M12 11v9"></path>
            <path d="M7.5 14.5H16.5"></path>
            <path d="M4.5 15c0 4 3.6 6 7.5 6s7.5-2 7.5-6"></path>
          </svg>
          <div
            style={{
              font: "600 10px/1 'IBM Plex Sans'",
              letterSpacing: '.16em',
              textTransform: 'uppercase',
              color: '#b0872b'
            }}
          >
            OPTIMIZACIÓN DE FLOTA
          </div>
        </div>
        <div style={{ marginTop: '8px', font: "600 17px/1.3 'IBM Plex Sans'", letterSpacing: '-.01em' }}>
          OPTRACKER
        </div>
        <div
          style={{
            marginTop: '10px',
            height: '1px',
            background: 'linear-gradient(90deg,rgba(176,135,43,.75),rgba(176,135,43,0))'
          }}
        ></div>
      </div>

      {/* Navigation list */}
      <nav data-navlist="1" style={{ display: 'flex', flexDirection: 'column', gap: '2px', padding: '0 10px' }}>
        {modulos.map((m) => {
          const esActivo = moduloActivo === m.id;
          return (
            <button
              key={m.id}
              data-act="nav"
              data-view={m.id}
              onClick={() => onSeleccionarModulo(m.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textAlign: 'left',
                padding: '7px 12px',
                border: 0,
                borderLeft: esActivo ? '2px solid #b0872b' : '2px solid transparent',
                borderRadius: '0 5px 5px 0',
                cursor: 'pointer',
                font: esActivo ? "600 13px 'IBM Plex Sans'" : "400 13px 'IBM Plex Sans'",
                background: esActivo ? 'rgba(255,255,255,.13)' : 'transparent',
                color: esActivo ? '#fff' : '#c3cdde',
                transition: 'background-color .18s ease,color .18s ease'
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '30px',
                  height: '30px',
                  borderRadius: '9px',
                  flex: '0 0 30px',
                  transition: 'background-color .18s ease',
                  background: esActivo ? `${m.color}2e` : 'rgba(255,255,255,.06)'
                }}
              >
                <svg
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="none"
                  stroke={m.color}
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={m.icono}></path>
                </svg>
              </span>
              <span data-navfull="1" style={{ flex: 1 }}>{m.label}</span>
              <span data-navshort="1" style={{ display: 'none' }}>{m.corto}</span>
              {m.badge && m.badge > 0 ? (
                <span
                  style={{
                    padding: '2px 7px',
                    borderRadius: '10px',
                    background: '#d17a3f',
                    color: '#fff',
                    font: "600 10.5px 'IBM Plex Sans'"
                  }}
                >
                  {m.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Decorative Wave SVG */}
      <svg
        data-navwave="1"
        viewBox="0 0 246 90"
        preserveAspectRatio="none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '96px',
          width: '100%',
          height: '90px',
          opacity: 0.16,
          pointerEvents: 'none'
        }}
      >
        <path d="M0 52c30-16 52 14 82 0s52-22 82-6 52 10 82-4v48H0z" fill="#7fb3d5"></path>
        <path d="M0 68c34-14 50 12 84-2s50-18 78-4 54 8 84-6v34H0z" fill="#4f7fa8"></path>
      </svg>

      {/* Footer Info */}
      <div
        data-navfoot="1"
        style={{
          marginTop: 'auto',
          padding: '18px 22px 0',
          borderTop: '1px solid rgba(255,255,255,.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ font: "400 11.5px 'IBM Plex Sans'", color: '#8fa2bd' }}>
            {usuarioEmail}
          </div>
          {onToggleTema && (
            <button
              onClick={onToggleTema}
              title="Cambiar tema"
              style={{
                border: 0,
                background: 'rgba(255,255,255,.1)',
                color: '#fff',
                padding: '4px 8px',
                borderRadius: '4px',
                font: "600 11px 'IBM Plex Sans'",
                cursor: 'pointer'
              }}
            >
              {temaOscuro ? '☀️ Clard' : '🌙 Oscuro'}
            </button>
          )}
        </div>
        <div style={{ font: "400 10.5px 'IBM Plex Sans'", color: '#6c7e96', textTransform: 'capitalize' }}>
          Rol: {usuarioRol}
        </div>
      </div>
    </aside>
  );
};
