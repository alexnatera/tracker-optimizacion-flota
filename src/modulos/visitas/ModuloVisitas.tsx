import React from 'react';
import { Visita } from '../../tipos/database';
import { formatearFecha, formatearMontoUSD } from '../../lib/formato';

interface ModuloVisitasProps {
  visitas: Visita[];
}

export const ModuloVisitas: React.FC<ModuloVisitasProps> = ({ visitas }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
        {visitas.map(v => (
          <div
            key={v.id}
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
              <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{v.codigo}</span>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#eaf5ee', color: '#2f9e7a', font: "600 11px 'IBM Plex Sans'" }}>
                {v.estado}
              </span>
            </div>

            <div>
              <h3 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#1b2536' }}>{v.titulo}</h3>
              <div style={{ marginTop: '4px', font: "500 12px 'IBM Plex Sans'", color: '#2e8ea6' }}>
                📍 {v.pais_destino} {v.ciudad ? `(${v.ciudad})` : ''}
              </div>
            </div>

            <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px', font: "12px 'IBM Plex Sans'" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5d6878' }}>
                <span>Fechas:</span>
                <strong style={{ color: '#22375c' }}>{formatearFecha(v.fecha_inicio)} - {formatearFecha(v.fecha_fin)}</strong>
              </div>
              {v.hotel && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5d6878' }}>
                  <span>Hotel:</span>
                  <span style={{ color: '#1b2536' }}>{v.hotel}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5d6878', paddingTop: '4px', borderTop: '1px dashed #cbd5e1' }}>
                <span>Costo Estimado:</span>
                <strong style={{ color: '#2f9e7a' }}>{formatearMontoUSD(v.costo_estimado_usd)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Visitas Table Card */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Calendario de Visitas y Logística de Viajes (VJ-###)
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>CÓDIGO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>MOTIVO / TÍTULO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>DESTINO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>INICIO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>FIN</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ESTADO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>VIÁTICOS USD</th>
              </tr>
            </thead>
            <tbody>
              {visitas.map(v => (
                <tr key={v.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                  <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{v.codigo}</td>
                  <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{v.titulo}</td>
                  <td style={{ padding: '11px 12px', color: '#5d6878' }}>{v.pais_destino} {v.ciudad ? `(${v.ciudad})` : ''}</td>
                  <td style={{ padding: '11px 12px', color: '#5d6878' }}>{formatearFecha(v.fecha_inicio)}</td>
                  <td style={{ padding: '11px 12px', color: '#5d6878' }}>{formatearFecha(v.fecha_fin)}</td>
                  <td style={{ padding: '11px 12px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#eaf5ee', color: '#2f9e7a', font: "600 11px 'IBM Plex Sans'" }}>
                      {v.estado}
                    </span>
                  </td>
                  <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{formatearMontoUSD(v.costo_estimado_usd)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
