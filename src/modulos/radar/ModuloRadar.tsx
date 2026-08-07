import React from 'react';
import { IndicadorRadar } from '../../tipos/database';

interface ModuloRadarProps {
  radar: IndicadorRadar[];
}

export const ModuloRadar: React.FC<ModuloRadarProps> = ({ radar }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
        {radar.map(rad => {
          const esRojo = rad.estado === 'Rojo';
          const esAmbar = rad.estado === 'Amarillo';
          const chipBg = esRojo ? '#fdeceb' : esAmbar ? '#fdf6e6' : '#eaf5ee';
          const chipFg = esRojo ? '#c0483f' : esAmbar ? '#c9973a' : '#2f9e7a';
          return (
            <div
              key={rad.id}
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
                <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{rad.codigo}</span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                  {rad.estado}
                </span>
              </div>

              <div>
                <h3 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#1b2536' }}>{rad.indicador}</h3>
                <div style={{ marginTop: '4px', font: "400 12px 'IBM Plex Sans'", color: '#6b7686' }}>
                  País: <strong style={{ color: '#22375c' }}>{rad.pais}</strong>
                </div>
              </div>

              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <span style={{ display: 'block', font: "500 10px 'IBM Plex Sans'", color: '#6b7686', textTransform: 'uppercase' }}>
                    VALOR ACTUAL
                  </span>
                  <span style={{ font: "700 20px 'IBM Plex Sans'", color: chipFg }}>
                    {rad.valor} <small style={{ fontSize: '12px', fontWeight: 400 }}>{rad.unidad}</small>
                  </span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ display: 'block', font: "500 10px 'IBM Plex Sans'", color: '#6b7686', textTransform: 'uppercase' }}>
                    OBJETIVO
                  </span>
                  <span style={{ font: "600 14px 'IBM Plex Sans'", color: '#22375c' }}>
                    {rad.objetivo} {rad.unidad}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Radar Table */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Radar de Desempeño Operacional por País (RAD-###)
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>CÓDIGO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>PAÍS</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>INDICADOR</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>VALOR ACTUAL</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>META OBJETIVO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ESTADO SEMÁFORO</th>
              </tr>
            </thead>
            <tbody>
              {radar.map(rad => {
                const esRojo = rad.estado === 'Rojo';
                const esAmbar = rad.estado === 'Amarillo';
                const chipBg = esRojo ? '#fdeceb' : esAmbar ? '#fdf6e6' : '#eaf5ee';
                const chipFg = esRojo ? '#c0483f' : esAmbar ? '#c9973a' : '#2f9e7a';
                return (
                  <tr key={rad.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{rad.codigo}</td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{rad.pais}</td>
                    <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{rad.indicador}</td>
                    <td style={{ padding: '11px 12px', font: "600 13px 'IBM Plex Sans'", color: chipFg }}>{rad.valor} {rad.unidad}</td>
                    <td style={{ padding: '11px 12px', color: '#6b7686' }}>{rad.objetivo} {rad.unidad}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                        {rad.estado}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
