import React, { useState } from 'react';
import { MejoraContinua } from '../../tipos/database';
import { sugerirDesperdicioLean, calcularCapacidadProceso } from '../../lib/dmaic';
import { calcularLimitesControl } from '../../lib/control';

interface ModuloMejoraProps {
  casosMejora: MejoraContinua[];
}

export const ModuloMejora: React.FC<ModuloMejoraProps> = ({ casosMejora }) => {
  const [casoSeleccionado, setCasoSeleccionado] = useState<MejoraContinua | null>(casosMejora[0] || null);
  const [textoPruebaTIMWOODS, setTextoPruebaTIMWOODS] = useState<string>('');

  const desperdicioSugerido = textoPruebaTIMWOODS ? sugerirDesperdicioLean(textoPruebaTIMWOODS) : null;

  // Ejemplo I-MR
  const datosEjemploIMR = [10.2, 10.5, 9.8, 10.1, 10.4, 9.9, 10.3, 10.0, 10.2, 10.1, 10.6, 9.7];
  const limites = calcularLimitesControl(datosEjemploIMR);
  const resCapacidad = calcularCapacidadProceso(datosEjemploIMR, casoSeleccionado?.lsl || 9.0, casoSeleccionado?.usl || 11.0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* Top Banner Card */}
      <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{ margin: 0, font: "600 16px 'IBM Plex Sans'", color: '#22375c' }}>
            Mejora Continua Lean Six Sigma / DMAIC (CI-###)
          </h2>
          <p data-s="muted" style={{ margin: '4px 0 0', font: "400 13px 'IBM Plex Sans'", color: '#6b7686' }}>
            Asistente de causas raíz, clasificador TIMWOODS, gráficos de control I-MR e índices Cp/Cpk.
          </p>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '14px' }}>
        {/* Left Column: Cases List */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <h3 style={{ margin: 0, font: "600 14px 'IBM Plex Sans'", color: '#22375c' }}>
            Oportunidades & Casos CI-###
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {casosMejora.map(c => {
              const esSel = casoSeleccionado?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCasoSeleccionado(c)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '5px',
                    border: esSel ? '1px solid #b0872b' : '1px solid #e4e7ec',
                    background: esSel ? '#fdf6e6' : '#f8fafc',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>
                    <span>{c.codigo}</span>
                    <span style={{ color: '#b0872b' }}>{c.estado}</span>
                  </div>
                  <div style={{ font: "500 13px 'IBM Plex Sans'", color: '#1b2536', marginTop: '4px' }}>{c.titulo}</div>
                  <div style={{ font: "400 11px 'IBM Plex Sans'", color: '#6b7686', marginTop: '4px' }}>
                    Desperdicio: <strong>{c.desperdicio_lean}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* TIMWOODS Assistant */}
          <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #eef0f3' }}>
            <label style={{ display: 'block', font: "600 12px 'IBM Plex Sans'", color: '#22375c', marginBottom: '6px' }}>
              Clasificador TIMWOODS IA:
            </label>
            <input
              type="text"
              value={textoPruebaTIMWOODS}
              onChange={e => setTextoPruebaTIMWOODS(e.target.value)}
              placeholder="Describe un problema (ej: demoras en carga)..."
              style={{ width: '100%', padding: '6px 10px', fontSize: '12px', borderRadius: '4px', border: '1px solid #d6dae1', outline: 'none' }}
            />
            {desperdicioSugerido && (
              <div style={{ marginTop: '6px', font: "500 12px 'IBM Plex Sans'", color: '#2f9e7a' }}>
                Sugerencia desperdicio: <strong>{desperdicioSugerido}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Analysis */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          {casoSeleccionado ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <span style={{ font: "600 12px 'IBM Plex Sans'", color: '#b0872b' }}>{casoSeleccionado.codigo}</span>
                <h3 style={{ margin: '4px 0 0', font: "600 16px 'IBM Plex Sans'", color: '#1b2536' }}>{casoSeleccionado.titulo}</h3>
                <p style={{ margin: '4px 0 0', font: "400 13px 'IBM Plex Sans'", color: '#5d6878' }}>{casoSeleccionado.problema}</p>
              </div>

              {/* SPC Simulation */}
              <div style={{ padding: '14px', borderRadius: '6px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <div style={{ font: "600 13px 'IBM Plex Sans'", color: '#22375c', marginBottom: '8px' }}>
                  Gráfico de Control Estadístico I-MR
                </div>
                <div style={{ height: '100px', width: '100%', position: 'relative' }}>
                  <svg viewBox="0 0 400 100" style={{ width: '100%', height: '100%' }}>
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#c0483f" strokeDasharray="3 3" strokeWidth="1.5" />
                    <line x1="0" y1="50" x2="400" y2="50" stroke="#2f9e7a" strokeWidth="1.5" />
                    <line x1="0" y1="80" x2="400" y2="80" stroke="#c0483f" strokeDasharray="3 3" strokeWidth="1.5" />
                    <polyline
                      fill="none"
                      stroke="#22375c"
                      strokeWidth="2"
                      points={datosEjemploIMR.map((v, i) => `${(i / (datosEjemploIMR.length - 1)) * 380 + 10},${80 - ((v - 9.0) / 2.0) * 60}`).join(' ')}
                    />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', font: "500 11px 'IBM Plex Sans'", color: '#6b7686', marginTop: '6px' }}>
                  <span>UCL: {limites.ucl.toFixed(2)}</span>
                  <span>Media: {limites.media.toFixed(2)}</span>
                  <span>LCL: {limites.lcl.toFixed(2)}</span>
                </div>
              </div>

              {/* Cp/Cpk Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div style={{ padding: '10px', background: '#f2f6fd', borderRadius: '5px' }}>
                  <span style={{ display: 'block', font: "500 10px 'IBM Plex Sans'", color: '#6b7686' }}>Cp</span>
                  <strong style={{ font: "700 18px 'IBM Plex Sans'", color: '#22375c' }}>{resCapacidad.cp?.toFixed(2) || '1.33'}</strong>
                </div>
                <div style={{ padding: '10px', background: '#eaf5ee', borderRadius: '5px' }}>
                  <span style={{ display: 'block', font: "500 10px 'IBM Plex Sans'", color: '#6b7686' }}>Cpk</span>
                  <strong style={{ font: "700 18px 'IBM Plex Sans'", color: '#2f9e7a' }}>{resCapacidad.cpk?.toFixed(2) || '1.25'}</strong>
                </div>
                <div style={{ padding: '10px', background: '#fdf6e6', borderRadius: '5px' }}>
                  <span style={{ display: 'block', font: "500 10px 'IBM Plex Sans'", color: '#6b7686' }}>Sigma Level</span>
                  <strong style={{ font: "700 18px 'IBM Plex Sans'", color: '#b0872b' }}>σ {resCapacidad.sigmaLevel?.toFixed(1) || '4.2'}</strong>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '30px', textAlign: 'center', color: '#6b7686' }}>
              Selecciona un caso DMAIC para ver su análisis.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
