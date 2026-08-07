import React from 'react';
import { ModuloId } from './Sidebar';
import { Usuario } from '../tipos/database';

interface HeaderProps {
  moduloActivo: ModuloId;
  usuarioActual: Usuario | null;
  cargando: boolean;
  onRefrescar: () => void;
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  moduloActivo,
  usuarioActual,
  cargando,
  onRefrescar,
  busqueda,
  onBusquedaChange,
  onLogout
}) => {
  const iniciales = usuarioActual?.email
    ? usuarioActual.email.substring(0, 2).toUpperCase()
    : 'US';

  return (
    <div
      data-barraestado="1"
      data-noprint="1"
      data-s="sub"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        margin: '0 -30px 22px',
        padding: '11px 30px',
        background: '#fbfcfd',
        borderBottom: '1px solid #dfe5ec',
        boxShadow: '0 1px 0 rgba(13,35,64,.04)',
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        flexWrap: 'wrap'
      }}
    >
      {/* Connection Status Dot */}
      <span
        data-s="ink"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '7px',
          font: "500 12px 'IBM Plex Sans'",
          color: '#3f4a5a'
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: cargando ? '#c9973a' : '#2f9e7a',
            flex: '0 0 8px'
          }}
        ></span>
        {cargando ? 'Sincronizando...' : 'Base de datos conectada'}
      </span>

      {/* Sync text */}
      <span data-s="muted" data-synctexto="1" style={{ font: "400 12px 'IBM Plex Sans'", color: '#6b7686' }}>
        Todas las tablas cargadas
      </span>

      {/* Save status */}
      <span data-s="muted" data-guardadotexto="1" style={{ font: "400 12px 'IBM Plex Sans'", color: '#6b7686' }}>
        Sin cambios pendientes
      </span>

      {/* Search Input */}
      <div style={{ marginLeft: '12px', flex: '0 1 220px' }}>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          placeholder="Filtrar por término..."
          style={{
            width: '100%',
            padding: '5px 10px',
            fontSize: '12px',
            borderRadius: '4px',
            border: '1px solid #d6dae1',
            background: '#fff',
            outline: 'none'
          }}
        />
      </div>

      {/* Actions */}
      <div
        data-barraestado-acciones="1"
        style={{
          marginLeft: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap'
        }}
      >
        {/* User profile & email info */}
        <div
          id="whoami"
          title={usuarioActual?.email || 'Usuario Autenticado'}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <span
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: '#22375c',
              border: '2px solid #fff',
              color: '#fff',
              font: "600 11px/22px 'IBM Plex Sans'",
              textAlign: 'center',
              display: 'inline-block'
            }}
          >
            {iniciales}
          </span>
          {usuarioActual?.email && (
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
              <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#1b2536' }}>
                {usuarioActual.email}
              </span>
              <span style={{ font: "400 11px 'IBM Plex Sans'", color: '#6b7686', textTransform: 'capitalize' }}>
                Rol: {usuarioActual.rol}
              </span>
            </div>
          )}
        </div>

        {/* Sync Button */}
        <button
          data-s="btn"
          data-act="sincronizar"
          onClick={onRefrescar}
          disabled={cargando}
          style={{
            padding: '7px 11px',
            border: '1px solid #d6dae1',
            borderRadius: '5px',
            background: '#fff',
            color: '#3f4a5a',
            font: "500 12px 'IBM Plex Sans'",
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          {cargando ? 'Cargando...' : 'Sincronizar'}
        </button>

        {/* Logout Button */}
        {onLogout && (
          <button
            id="btnLogout"
            data-act="logout"
            onClick={onLogout}
            style={{
              padding: '7px 12px',
              border: '1px solid #e2b8b8',
              borderRadius: '5px',
              background: '#fff5f5',
              color: '#c0483f',
              font: "600 12px 'IBM Plex Sans'",
              whiteSpace: 'nowrap',
              cursor: 'pointer'
            }}
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );
};
