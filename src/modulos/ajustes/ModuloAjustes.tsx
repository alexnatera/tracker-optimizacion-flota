import React from 'react';
import { ConfigLista, Usuario } from '../../tipos/database';

interface ModuloAjustesProps {
  configListas: ConfigLista[];
  usuarioActual: Usuario | null;
}

export const ModuloAjustes: React.FC<ModuloAjustesProps> = ({ usuarioActual }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '14px' }}>
        {/* Profile Card */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#22375c' }}>
            Perfil de Usuario y Permisos
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', font: "13px 'IBM Plex Sans'", color: '#3f4a5a' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef0f3' }}>
              <span style={{ color: '#6b7686' }}>Email de acceso:</span>
              <strong style={{ color: '#1b2536' }}>{usuarioActual?.email || 'alex@flota.org'}</strong>
            </div>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef0f3' }}>
              <span style={{ color: '#6b7686' }}>Rol asignado:</span>
              <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#eaf5ee', color: '#2f9e7a', font: "600 11px 'IBM Plex Sans'" }}>
                {usuarioActual?.rol || 'admin'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7686' }}>Estado de cuenta:</span>
              <span style={{ color: '#2f9e7a', fontWeight: 600 }}>Activo (En línea)</span>
            </div>
          </div>
        </div>

        {/* System Settings Card */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h2 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#22375c' }}>
            Configuración de la Plataforma
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', font: "13px 'IBM Plex Sans'", color: '#3f4a5a' }}>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef0f3' }}>
              <span style={{ color: '#6b7686' }}>Motor de cálculo:</span>
              <strong style={{ color: '#1b2536' }}>168 hrs / mes nominales</strong>
            </div>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0', borderBottom: '1px solid #eef0f3' }}>
              <span style={{ color: '#6b7686' }}>Base de datos:</span>
              <strong style={{ color: '#22375c' }}>Supabase PostgreSQL 15 Cloud</strong>
            </div>
            <div style={{ display: 'flex', justifyBetween: 'space-between', padding: '6px 0' }}>
              <span style={{ color: '#6b7686' }}>Plazo aviso RRHH viajes:</span>
              <strong style={{ color: '#c9973a' }}>5 días hábiles previo a vuelo</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
