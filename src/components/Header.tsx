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
}

export const Header: React.FC<HeaderProps> = ({
  moduloActivo,
  usuarioActual,
  cargando,
  onRefrescar,
  busqueda,
  onBusquedaChange
}) => {
  const iniciales = usuarioActual?.email
    ? usuarioActual.email.substring(0, 2).toUpperCase()
    : 'AN';

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
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        {/* User initials bubble */}
        <div title={usuarioActual?.email || 'Alex Natera'} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
          <div style={{ display: 'flex' }}>
            <span
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#2f9e7a',
                border: '2px solid #fff',
                color: '#fff',
                font: "600 10px/20px 'IBM Plex Sans'",
                textAlign: 'center'
              }}
            >
              {iniciales}
            </span>
          </div>
          <span data-s="muted" style={{ font: "400 12px 'IBM Plex Sans'", color: '#6b7686' }}>
            1 de 1
          </span>
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

        {/* Save Button */}
        <button
          data-act="guardar"
          style={{
            padding: '7px 13px',
            border: 0,
            borderRadius: '5px',
            background: '#22375c',
            color: '#fff',
            font: "600 12px 'IBM Plex Sans'",
            whiteSpace: 'nowrap',
            cursor: 'pointer'
          }}
        >
          Guardar
        </button>
      </div>
    </div>
  );
};
