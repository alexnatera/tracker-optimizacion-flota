import React, { useState } from 'react';
import { Tarea } from '../../tipos/database';
import { formatearFecha } from '../../lib/formato';

interface ModuloTareasProps {
  tareas: Tarea[];
  onGuardar: (tarea: Partial<Tarea>) => Promise<void>;
}

export const ModuloTareas: React.FC<ModuloTareasProps> = ({ tareas }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  const filtradas = tareas.filter(t => {
    if (filtroEstado !== 'Todos' && t.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Filter Toolbar */}
      <div
        data-s="card"
        style={{
          background: '#fff',
          border: '1px solid #e4e7ec',
          borderRadius: '7px',
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexWrap: 'wrap'
        }}
      >
        {['Todos', 'Pendiente', 'En Proceso', 'Completado', 'Vencida'].map(e => (
          <button
            key={e}
            onClick={() => setFiltroEstado(e)}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: filtroEstado === e ? '1px solid #22375c' : '1px solid #d6dae1',
              background: filtroEstado === e ? '#22375c' : '#fff',
              color: filtroEstado === e ? '#fff' : '#3f4a5a',
              font: "600 12px 'IBM Plex Sans'",
              cursor: 'pointer'
            }}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Main Table Card */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Control y Seguimiento de Tareas (TAR-###)
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>CÓDIGO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>TÍTULO DE TAREA</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>PRIORIDAD</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ESTADO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>FECHA LÍMITE</th>
              </tr>
            </thead>
            <tbody>
              {filtradas.map(t => {
                const esCompletado = t.estado === 'Completada';
                const esVencida = t.estado === 'Bloqueada' || t.prioridad === 'Alta' || t.prioridad === 'Urgente';
                const chipBg = esCompletado ? '#eaf5ee' : esVencida ? '#fdeceb' : '#fdf6e6';
                const chipFg = esCompletado ? '#2f9e7a' : esVencida ? '#c0483f' : '#c9973a';
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{t.codigo}</td>
                    <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{t.titulo}</td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ padding: '2px 7px', borderRadius: '3px', background: '#f2f4f7', color: '#3f4a5a', font: "600 11px 'IBM Plex Sans'" }}>
                        {t.prioridad || 'Media'}
                      </span>
                    </td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                        {t.estado}
                      </span>
                    </td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{formatearFecha(t.fecha_limite)}</td>
                  </tr>
                );
              })}
              {filtradas.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: '#6b7686' }}>
                    No hay tareas en el estado seleccionado.
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
