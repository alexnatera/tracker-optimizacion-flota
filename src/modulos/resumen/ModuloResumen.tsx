import React from 'react';
import { AppState } from '../../tipos/database';
import { formatearMontoUSD, formatearPorcentaje } from '../../lib/formato';

interface ModuloResumenProps {
  state: AppState;
  onSeleccionarModulo: (mod: any) => void;
}

export const ModuloResumen: React.FC<ModuloResumenProps> = ({ state, onSeleccionarModulo }) => {
  const totalIniciativas = state.iniciativas.length;
  const enEjecucion = state.iniciativas.filter(i => i.estado === 'En Ejecución' || i.fase === 'Ejecución').length;
  const completadas = state.iniciativas.filter(i => i.estado === 'Completado').length;
  
  const totalTareas = state.tareas.length;
  const tareasPendientes = state.tareas.filter(t => t.estado === 'Pendiente' || t.estado === 'En Proceso').length;
  const tareasVencidas = state.tareas.filter(t => t.estado === 'Vencida' || t.estado === 'Atrasada').length;
  
  const radarRojo = state.radar.filter(r => r.estado === 'Rojo' || r.estado === 'Amarillo').length;
  const incidentesAbiertos = state.mejora.filter(m => m.estado !== 'Cerrado').length;
  const impactoTotalUSD = state.iniciativas.reduce((acc, i) => acc + (i.impacto_estimado_usd || 0), 0);
  const avancePromedio = totalIniciativas > 0
    ? Math.round(state.iniciativas.reduce((acc, i) => acc + (i.avance || 0), 0) / totalIniciativas)
    : 0;

  // KPIs grid array
  const kpis = [
    { label: 'Portafolio Iniciativas', valor: totalIniciativas, color: '#3f6d96', modulo: 'portafolio' },
    { label: 'En Ejecución', valor: enEjecucion, color: '#2f9e7a', modulo: 'portafolio' },
    { label: 'Tareas Pendientes', valor: tareasPendientes, color: '#d17a3f', modulo: 'tareas' },
    { label: 'Tareas Vencidas', valor: tareasVencidas, color: '#c0483f', modulo: 'tareas' },
    { label: 'Alertas Radar', valor: radarRojo, color: '#c0483f', modulo: 'radar' },
    { label: 'Casos DMAIC', valor: incidentesAbiertos, color: '#b0872b', modulo: 'mejora' },
    { label: 'Completadas', valor: completadas, color: '#2f9e7a', modulo: 'portafolio' },
    { label: 'Impacto Total USD', valor: formatearMontoUSD(impactoTotalUSD), color: '#22375c', modulo: 'portafolio' }
  ];

  // Generar Alertas
  const alertas = [
    ...(radarRojo > 0 ? [{
      texto: `${radarRojo} indicadores del Radar se encuentran en nivel crítico o amarillo`,
      bg: '#fdeceb',
      borde: '#f9cfcc',
      punto: '#c0483f'
    }] : []),
    ...(tareasVencidas > 0 ? [{
      texto: `${tareasVencidas} tareas operativas han superado su fecha límite de entrega`,
      bg: '#fdf6e6',
      borde: '#eddfba',
      punto: '#c9973a'
    }] : []),
    ...(incidentesAbiertos > 0 ? [{
      texto: `${incidentesAbiertos} oportunidades de mejora Lean Six Sigma activas`,
      bg: '#f2f6fd',
      borde: '#cfdcf2',
      punto: '#3f6d96'
    }] : [])
  ];

  // Agrupar iniciativas por país
  const porPaisMap: Record<string, number> = {};
  state.iniciativas.forEach(i => {
    const p = i.pais || 'Otros';
    porPaisMap[p] = (porPaisMap[p] || 0) + 1;
  });
  const porPaisList = Object.entries(porPaisMap).map(([label, n]) => ({
    label,
    n,
    ancho: totalIniciativas > 0 ? `${Math.round((n / totalIniciativas) * 100)}%` : '0%'
  }));

  // Agrupar tareas por estado
  const tareasEstadoMap: Record<string, number> = {
    'Completado': state.tareas.filter(t => t.estado === 'Completado').length,
    'En Proceso': state.tareas.filter(t => t.estado === 'En Proceso').length,
    'Pendiente': state.tareas.filter(t => t.estado === 'Pendiente').length
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      {/* Top Stat KPI Cards Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(190px,1fr))', gap: '12px' }}>
        {kpis.map((k, idx) => (
          <div
            key={idx}
            data-s="card"
            onClick={() => onSeleccionarModulo(k.modulo)}
            style={{
              background: '#fff',
              border: '1px solid #e4e7ec',
              borderRadius: '7px',
              padding: '15px 16px',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
          >
            <div
              data-s="muted"
              style={{
                font: "500 11px/1.3 'IBM Plex Sans'",
                letterSpacing: '.02em',
                textTransform: 'uppercase',
                color: '#6b7686'
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                marginTop: '8px',
                font: "700 26px/1 'IBM Plex Sans'",
                fontVariantNumeric: 'tabular-nums',
                color: k.color
              }}
            >
              {k.valor}
            </div>
          </div>
        ))}
      </section>

      {/* Alertas Card */}
      <section data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
        <h2 data-s="navy" style={{ margin: '0 0 14px', font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
          Alertas Operativas y Notificaciones
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {alertas.map((a, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '5px',
                background: a.bg,
                border: `1px solid ${a.borde}`
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.punto, flex: '0 0 8px' }}></span>
              <span data-s="ink" style={{ font: "500 13px/1.4 'IBM Plex Sans'", color: '#2b3849' }}>
                {a.texto}
              </span>
            </div>
          ))}
          {alertas.length === 0 && (
            <div data-s="muted" style={{ font: "400 13px 'IBM Plex Sans'", color: '#5d6878' }}>
              Sin alertas activas en la flota. Todos los sistemas operan normalmente.
            </div>
          )}
        </div>
      </section>

      {/* Main Grid: Avance, Países & Tareas */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '14px' }}>
        {/* Avance promedio del portafolio */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          <h2 style={{ margin: '0 0 4px', font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
            Avance promedio del portafolio
          </h2>
          <p data-s="muted" style={{ margin: '0 0 14px', font: "400 12px/1.5 'IBM Plex Sans'", color: '#6b7686' }}>
            Promedio global del porcentaje de cumplimiento de las iniciativas activas.
          </p>
          <div style={{ font: "700 40px/1 'IBM Plex Sans'", fontVariantNumeric: 'tabular-nums', color: '#22375c' }}>
            {avancePromedio}%
          </div>
          <div
            data-s="pista"
            style={{ marginTop: '12px', height: '10px', borderRadius: '5px', background: '#eef0f4', overflow: 'hidden' }}
          >
            <span style={{ display: 'block', height: '10px', background: '#2f9e7a', width: `${avancePromedio}%` }}></span>
          </div>

          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div data-s="muted" style={{ font: "500 11px/1 'IBM Plex Sans'", letterSpacing: '.04em', textTransform: 'uppercase', color: '#6b7686' }}>
              Estado del Portafolio
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <span data-s="ink" style={{ display: 'flex', alignItems: 'center', gap: '6px', font: "400 11.5px 'IBM Plex Sans'", color: '#3f4a5a' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#2f9e7a' }}></span>
                Ejecución · {enEjecucion}
              </span>
              <span data-s="ink" style={{ display: 'flex', alignItems: 'center', gap: '6px', font: "400 11.5px 'IBM Plex Sans'", color: '#3f6d96' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#3f6d96' }}></span>
                Completadas · {completadas}
              </span>
            </div>
          </div>
        </div>

        {/* Iniciativas por país */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          <h2 style={{ margin: '0 0 14px', font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
            Iniciativas por país
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {porPaisList.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span data-s="ink" style={{ flex: '0 0 120px', font: "400 12px 'IBM Plex Sans'", color: '#3f4a5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p.label}
                </span>
                <span data-s="pista" style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#eef0f4', overflow: 'hidden' }}>
                  <span style={{ display: 'block', height: '8px', background: '#22375c', width: p.ancho }}></span>
                </span>
                <span style={{ flex: '0 0 26px', textAlign: 'right', font: "600 12px 'IBM Plex Sans'", fontVariantNumeric: 'tabular-nums', color: '#22375c' }}>
                  {p.n}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '18px', display: 'flex', flexDirection: 'column', gap: '7px' }}>
            <div data-s="muted" style={{ font: "500 11px/1 'IBM Plex Sans'", letterSpacing: '.04em', textTransform: 'uppercase', color: '#6b7686' }}>
              Tareas por estado
            </div>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <span data-s="ink" style={{ display: 'flex', alignItems: 'center', gap: '6px', font: "400 11.5px 'IBM Plex Sans'", color: '#3f4a5a' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#2f9e7a' }}></span>
                Completadas · {tareasEstadoMap['Completado']}
              </span>
              <span data-s="ink" style={{ display: 'flex', alignItems: 'center', gap: '6px', font: "400 11.5px 'IBM Plex Sans'", color: '#3f4a5a' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#d17a3f' }}></span>
                En Proceso · {tareasEstadoMap['En Proceso']}
              </span>
              <span data-s="ink" style={{ display: 'flex', alignItems: 'center', gap: '6px', font: "400 11.5px 'IBM Plex Sans'", color: '#3f4a5a' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '2px', background: '#c0483f' }}></span>
                Pendiente · {tareasEstadoMap['Pendiente']}
              </span>
            </div>
          </div>
        </div>

        {/* Tareas abiertas por responsable */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          <h2 style={{ margin: '0 0 4px', font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
            Tareas abiertas por responsable
          </h2>
          <p data-s="muted" style={{ margin: '0 0 14px', font: "400 12px/1.5 'IBM Plex Sans'", color: '#6b7686' }}>
            Asignación de carga por integrante del equipo.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
            {state.personas.map((per) => {
              const count = state.tareas.filter(t => t.responsable_id === per.id).length;
              const barWidth = totalTareas > 0 ? `${Math.round((count / totalTareas) * 100)}%` : '0%';
              return (
                <div key={per.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span data-s="ink" style={{ flex: '0 0 130px', font: "400 12px 'IBM Plex Sans'", color: '#3f4a5a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {per.nombre}
                  </span>
                  <span data-s="pista" style={{ flex: 1, height: '8px', borderRadius: '4px', background: '#eef0f4', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '8px', background: '#22375c', width: barWidth }}></span>
                  </span>
                  <span style={{ flex: '0 0 26px', textAlign: 'right', font: "600 12px 'IBM Plex Sans'", fontVariantNumeric: 'tabular-nums', color: '#22375c' }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tables Preview Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(340px,1fr))', gap: '14px' }}>
        {/* Recientes Portafolio */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
              Portafolio (Iniciativas Recientes)
            </h2>
            <button
              onClick={() => onSeleccionarModulo('portafolio')}
              style={{ border: 0, background: 'transparent', color: '#22375c', font: "600 12px 'IBM Plex Sans'", cursor: 'pointer' }}
            >
              Ver todo →
            </button>
          </div>
          <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
            <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
              <thead>
                <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>CÓDIGO</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>TÍTULO</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>PAÍS</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>AVANCE</th>
                </tr>
              </thead>
              <tbody>
                {state.iniciativas.slice(0, 4).map((ini) => (
                  <tr key={ini.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                    <td style={{ padding: '8px 10px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{ini.codigo}</td>
                    <td style={{ padding: '8px 10px', color: '#2b3849' }}>{ini.titulo}</td>
                    <td style={{ padding: '8px 10px', color: '#6b7686' }}>{ini.pais}</td>
                    <td style={{ padding: '8px 10px', font: "600 12px 'IBM Plex Sans'", color: '#2f9e7a' }}>{formatearPorcentaje(ini.avance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Radar por País */}
        <div data-s="card" style={{ background: '#fff', border: '1px solid #e4e7ec', borderRadius: '7px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <h2 style={{ margin: 0, font: "600 14px/1 'IBM Plex Sans'", color: '#22375c' }}>
              Radar Operacional por País
            </h2>
            <button
              onClick={() => onSeleccionarModulo('radar')}
              style={{ border: 0, background: 'transparent', color: '#c0483f', font: "600 12px 'IBM Plex Sans'", cursor: 'pointer' }}
            >
              Ver radar →
            </button>
          </div>
          <div data-tablawrap="1" style={{ overflowX: 'auto' }}>
            <table data-tabla="1" style={{ width: '100%', borderCollapse: 'collapse', font: "13px 'IBM Plex Sans'" }}>
              <thead>
                <tr style={{ background: '#0d2340', color: '#fff', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>PAÍS</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>INDICADOR</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>VALOR</th>
                  <th style={{ padding: '8px 10px', font: "600 11px 'IBM Plex Sans'" }}>ESTADO</th>
                </tr>
              </thead>
              <tbody>
                {state.radar.slice(0, 4).map((rad) => {
                  const esRojo = rad.estado === 'Rojo';
                  const esAmbar = rad.estado === 'Amarillo';
                  const chipBg = esRojo ? '#fdeceb' : esAmbar ? '#fdf6e6' : '#eaf5ee';
                  const chipFg = esRojo ? '#c0483f' : esAmbar ? '#c9973a' : '#2f9e7a';
                  return (
                    <tr key={rad.id} style={{ borderBottom: '1px solid #eef0f3' }}>
                      <td style={{ padding: '8px 10px', font: "600 12px 'IBM Plex Sans'", color: '#22375c' }}>{rad.pais}</td>
                      <td style={{ padding: '8px 10px', color: '#2b3849' }}>{rad.indicador}</td>
                      <td style={{ padding: '8px 10px', font: "600 12px 'IBM Plex Sans'" }}>{rad.valor} {rad.unidad}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: chipBg, color: chipFg, font: "600 11px 'IBM Plex Sans'" }}>
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
      </section>
    </div>
  );
};
