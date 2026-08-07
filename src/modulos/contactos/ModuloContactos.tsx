import React from 'react';
import { Contacto } from '../../tipos/database';

interface ModuloContactosProps {
  contactos: Contacto[];
}

export const ModuloContactos: React.FC<ModuloContactosProps> = ({ contactos }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
        {contactos.map(c => (
          <div
            key={c.id}
            data-s="card"
            style={{
              background: '#fff',
              border: '1px solid #e4e7ec',
              borderRadius: '7px',
              padding: '18px 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{c.pais}</span>
              {c.es_principal && (
                <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#eaf5ee', color: '#2f9e7a', font: "600 11px 'IBM Plex Sans'" }}>
                  Principal 24/7
                </span>
              )}
            </div>

            <div>
              <h3 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#1b2536' }}>{c.nombre}</h3>
              <div style={{ marginTop: '4px', font: "500 12px 'IBM Plex Sans'", color: '#7a5cb0' }}>
                {c.rol_operativo} ({c.area || 'Operaciones'})
              </div>
            </div>

            <div style={{ paddingTop: '10px', borderTop: '1px solid #eef0f3', font: "13px 'IBM Plex Sans'", color: '#3f4a5a', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {c.email && <div>✉️ <a href={`mailto:${c.email}`} style={{ color: '#22375c', textDecoration: 'none' }}>{c.email}</a></div>}
              {c.telefono && <div>📞 {c.telefono}</div>}
            </div>
          </div>
        ))}
      </div>

      {/* Directory Table Card */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Directorio de Contactos Operativos por País
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>PAÍS</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>NOMBRE CONTACTO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ROL OPERATIVO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ÁREA</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>EMAIL / TELÉFONO</th>
              </tr>
            </thead>
            <tbody>
              {contactos.map(c => (
                <tr key={c.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                  <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{c.pais}</td>
                  <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{c.nombre}</td>
                  <td style={{ padding: '11px 12px', color: '#5d6878' }}>{c.rol_operativo}</td>
                  <td style={{ padding: '11px 12px', color: '#5d6878' }}>{c.area || 'Operaciones'}</td>
                  <td style={{ padding: '11px 12px', color: '#22375c' }}>{c.email || c.telefono}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
