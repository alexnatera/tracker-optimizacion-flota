import React, { useState } from 'react';
import { Iniciativa } from '../../tipos/database';
import { formatearMontoUSD, formatearPorcentaje } from '../../lib/formato';

interface ModuloPortafolioProps {
  iniciativas: Iniciativa[];
  onGuardar: (iniciativa: Partial<Iniciativa>) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}

export const ModuloPortafolio: React.FC<ModuloPortafolioProps> = ({ iniciativas }) => {
  const [filtroPais, setFiltroPais] = useState<string>('Todos');
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  const paises = ['Todos', ...Array.from(new Set(iniciativas.map(i => i.pais))).filter(Boolean)];
  const estados = ['Todos', 'Planificación', 'En Ejecución', 'En Evaluación', 'Completado', 'Pausado'];

  const filtradas = iniciativas.filter(i => {
    if (filtroPais !== 'Todos' && i.pais !== filtroPais) return false;
    if (filtroEstado !== 'Todos' && i.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Header controls & Filters */}
      <div
        data-s="card"
        style={{
          background: '#fff',
          border: '1px solid #e4e7ec',
          borderRadius: '7px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', font: "13px 'IBM Plex Sans'", color: '#3f4a5a' }}>
            <span>País:</span>
            <select
              value={filtroPais}
              onChange={e => setFiltroPais(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #d6dae1', background: '#fff', font: "13px 'IBM Plex Sans'" }}
            >
              {paises.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', font: "13px 'IBM Plex Sans'", color: '#3f4a5a' }}>
            <span>Estado:</span>
            <select
              value={filtroEstado}
              onChange={e => setFiltroEstado(e.target.value)}
              style={{ padding: '5px 10px', borderRadius: '4px', border: '1px solid #d6dae1', background: '#fff', font: "13px 'IBM Plex Sans'" }}
            >
              {estados.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>

        <div style={{ font: "500 13px 'IBM Plex Sans'", color: '#6b7686' }}>
          Mostrando <strong style={{ color: '#22375c' }}>{filtradas.length}</strong> iniciativas
        </div>
      </div>

      {/* Main Table */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Portafolio de Optimizaciones (OPT-###)
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>CÓDIGO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>INICIATIVA / TÍTULO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>PAÍS</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>FASE</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ESTADO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>AVANCE</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>IMPACTO USD</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(ini => {
                const esCompletado = ini.estado === 'Completado';
                const chipBg = esCompletado ? '#eaf5ee' : '#f2f6fd';
                const chipFg = esCompletado ? '#2f9e7a' : '#3f6d96';
                return (
                  <tr key={ini.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{ini.codigo}</td>
                    <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{ini.titulo}</td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{ini.pais}</td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{ini.fase}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                        {ini.estado}
                      </span>
                    </td>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#2f9e7a' }}>{formatearPorcentaje(ini.avance)}</td>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{formatearMontoUSD(ini.impacto_estimado_usd)}</td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '24px', textAlign: 'center', color: '#6b7686' }}>
                    No hay iniciativas con los filtros seleccionados.
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
