import React from 'react';
import { HistorialLog } from '../../tipos/database';
import { formatearFecha } from '../../lib/formato';

interface ModuloHistorialProps {
  historial: HistorialLog[];
}

export const ModuloHistorial: React.FC<ModuloHistorialProps> = ({ historial }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Historial Inmutable de Auditoría de Cambios
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>FECHA / HORA</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>TABLA</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>CAMPO MODIFICADO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>VALOR ANTERIOR</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>VALOR NUEVO</th>
              </tr>
            </thead>
            <tbody>
              {historial.map(h => (
                <tr key={h.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                  <td style={{ padding: '11px 12px', color: '#6b7686' }}>{formatearFecha(h.created_at)}</td>
                  <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{h.tabla}</td>
                  <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{h.campo}</td>
                  <td style={{ padding: '11px 12px', color: '#c9973a' }}>{h.valor_anterior || '(vacío)'}</td>
                  <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#2f9e7a' }}>{h.valor_nuevo || '(vacío)'}</td>
                </tr>
              ))}
              {historial.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6b7686' }}>
                    No hay eventos de auditoría registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
