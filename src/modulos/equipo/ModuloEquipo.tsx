import React from 'react';
import { Persona, Participacion, Actividad } from '../../tipos/database';
import { calcularHorasDedicadas, calcularHorasDisponibles, calcularPorcentajeDedicacion, obtenerSemaforoCapacidad } from '../../lib/capacidad';

interface ModuloEquipoProps {
  personas: Persona[];
  participaciones: Participacion[];
  actividades: Actividad[];
}

export const ModuloEquipo: React.FC<ModuloEquipoProps> = ({ personas, participaciones }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Team Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: '14px' }}>
        {personas.map(p => {
          const partPersona = participaciones.filter(pt => pt.persona_id === p.id);
          const porcentajeTotal = calcularPorcentajeDedicacion(partPersona);
          const horasDedicadas = calcularHorasDedicadas(partPersona, p.horas_mes || 160);
          const horasDisponibles = calcularHorasDisponibles(p.horas_mes || 160, partPersona);
          const semaforo = obtenerSemaforoCapacidad(porcentajeTotal);

          const esSobrecarga = porcentajeTotal > 100;
          const esAtencion = porcentajeTotal >= 85 && porcentajeTotal <= 100;
          const chipBg = esSobrecarga ? '#fdeceb' : esAtencion ? '#fdf6e6' : '#eaf5ee';
          const chipFg = esSobrecarga ? '#c0483f' : esAtencion ? '#c9973a' : '#2f9e7a';

          return (
            <div
              key={p.id}
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
                <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{p.pais}</span>
                <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                  {semaforo.estado}
                </span>
              </div>

              <div>
                <h3 style={{ margin: 0, font: "600 15px 'IBM Plex Sans'", color: '#1b2536' }}>{p.nombre}</h3>
                <div style={{ marginTop: '4px', font: "400 12px 'IBM Plex Sans'", color: '#6b7686' }}>
                  {p.rol_operativo || 'Líder Operativo'}
                </div>
              </div>

              <div style={{ padding: '10px 14px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '6px', font: "12px 'IBM Plex Sans'" }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5d6878' }}>
                  <span>Dedicación %:</span>
                  <strong style={{ color: chipFg }}>{porcentajeTotal}%</strong>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: '#eef0f4', overflow: 'hidden' }}>
                  <div style={{ height: '8px', background: chipFg, width: `${Math.min(100, porcentajeTotal)}%` }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#5d6878', paddingTop: '4px' }}>
                  <span>Dedicadas: <strong style={{ color: '#22375c' }}>{horasDedicadas}h</strong></span>
                  <span>Disponibles: <strong style={{ color: '#2f9e7a' }}>{horasDisponibles}h</strong></span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Team Capacity Table Card */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 style={{ margin: '0 0 14px', font: "600 15px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Matriz de Dedicación y Capacidad del Equipo
        </h2>
        <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
          <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
            <thead>
              <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>NOMBRE INTEGRANTE</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ROL OPERATIVO</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>PAÍS</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>HORAS MES</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>DEDICACIÓN %</th>
                <th style={{ padding: '10px 12px', font: "600 12px 'IBM Plex Sans'" }}>ESTADO CARGA</th>
              </tr>
            </thead>
            <tbody>
              {personas.map(p => {
                const partPersona = participaciones.filter(pt => pt.persona_id === p.id);
                const pct = calcularPorcentajeDedicacion(partPersona);
                const esSobrecarga = pct > 100;
                const esAtencion = pct >= 85 && pct <= 100;
                const chipBg = esSobrecarga ? '#fdeceb' : esAtencion ? '#fdf6e6' : '#eaf5ee';
                const chipFg = esSobrecarga ? '#c0483f' : esAtencion ? '#c9973a' : '#2f9e7a';
                const estadoTxt = esSobrecarga ? 'Sobrecarga' : esAtencion ? 'Atención' : 'Holgura';
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{p.nombre}</td>
                    <td style={{ padding: '11px 12px', color: '#1b2536', font: "500 13px 'IBM Plex Sans'" }}>{p.rol_operativo || 'Miembro Equipo'}</td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{p.pais}</td>
                    <td style={{ padding: '11px 12px', color: '#5d6878' }}>{p.horas_mes || 160} hrs</td>
                    <td style={{ padding: '11px 12px', font: "600 12px 'IBM Plex Sans'", color: chipFg }}>{pct}%</td>
                    <td style={{ padding: '11px 12px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
                        {estadoTxt}
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
