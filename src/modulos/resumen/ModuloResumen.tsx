import React from 'react';
import { AppState, Iniciativa, Tarea, IndicadorRadar, MejoraContinua } from '../../tipos/database';
import { formatearMontoUSD, formatearPorcentaje, obtenerBadgeEstado } from '../../lib/formato';
import { Briefcase, CheckSquare, Radio, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ModuloResumenProps {
  state: AppState;
  onSeleccionarModulo: (mod: any) => void;
}

export const ModuloResumen: React.FC<ModuloResumenProps> = ({ state, onSeleccionarModulo }) => {
  const totalIniciativas = state.iniciativas.length;
  const enEjecucion = state.iniciativas.filter(i => i.estado === 'En Ejecución').length;
  const completadas = state.iniciativas.filter(i => i.estado === 'Completado').length;
  
  const totalTareas = state.tareas.length;
  const tareasPendientes = state.tareas.filter(t => t.estado === 'Pendiente' || t.estado === 'En Proceso').length;
  
  const indicadoresAlertados = state.radar.filter(r => r.estado === 'Rojo' || r.estado === 'Amarillo').length;
  const incidentesAbiertos = state.mejora.filter(m => m.estado !== 'Cerrado').length;

  const impactoTotalUSD = state.iniciativas.reduce((acc, i) => acc + (i.impacto_estimado_usd || 0), 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Iniciativas */}
        <div 
          onClick={() => onSeleccionarModulo('portafolio')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Iniciativas OPT</span>
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{totalIniciativas}</span>
            <span className="text-xs text-emerald-400 font-medium">{enEjecucion} en ejecución</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Impacto total: <span className="font-semibold text-slate-200">{formatearMontoUSD(impactoTotalUSD)}</span></p>
        </div>

        {/* Card 2: Tareas Pendientes */}
        <div 
          onClick={() => onSeleccionarModulo('tareas')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tareas Pendientes</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <CheckSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{tareasPendientes}</span>
            <span className="text-xs text-slate-400 font-medium">de {totalTareas} totales</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{totalTareas - tareasPendientes} tareas completadas</p>
        </div>

        {/* Card 3: Radar de Alertas */}
        <div 
          onClick={() => onSeleccionarModulo('radar')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Alertas Radar</span>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400">{indicadoresAlertados}</span>
            <span className="text-xs text-slate-400 font-medium">indicadores fuera de meta</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">{state.radar.length} indicadores monitoreados</p>
        </div>

        {/* Card 4: Incidentes DMAIC */}
        <div 
          onClick={() => onSeleccionarModulo('mejora')}
          className="glass-panel glass-panel-hover p-5 rounded-xl cursor-pointer border border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mejora DMAIC</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-100">{incidentesAbiertos}</span>
            <span className="text-xs text-purple-400 font-medium">casos en progreso</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Análisis Lean Six Sigma activo</p>
        </div>
      </div>

      {/* Main Grid: Recent Portafolio & Critical Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Portafolio Initiatives */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              Iniciativas Recientes (`OPT-###`)
            </h3>
            <button 
              onClick={() => onSeleccionarModulo('portafolio')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
            >
              Ver todas →
            </button>
          </div>

          <div className="space-y-3">
            {state.iniciativas.slice(0, 4).map((ini) => {
              const badge = obtenerBadgeEstado(ini.estado);
              return (
                <div key={ini.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">{ini.codigo}</span>
                      <span className="text-xs font-semibold text-slate-200">{ini.titulo}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      País: {ini.pais} | Fase: {ini.fase}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                      {badge.texto}
                    </span>
                    <div className="text-xs font-mono text-slate-300">{formatearPorcentaje(ini.avance)}</div>
                  </div>
                </div>
              );
            })}
            {state.iniciativas.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">No hay iniciativas registradas.</p>
            )}
          </div>
        </div>

        {/* Radar Country Indicators */}
        <div className="glass-panel p-5 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400" />
              Radar Operacional por País (`RAD-###`)
            </h3>
            <button 
              onClick={() => onSeleccionarModulo('radar')}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium"
            >
              Ver radar completo →
            </button>
          </div>

          <div className="space-y-3">
            {state.radar.slice(0, 4).map((rad) => {
              const badge = obtenerBadgeEstado(rad.estado);
              return (
                <div key={rad.id} className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">{rad.codigo}</span>
                      <span className="text-xs font-semibold text-slate-200">{rad.indicador}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      País: <span className="text-slate-300 font-medium">{rad.pais}</span> | Categoría: {rad.categoria || 'Operación'}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                      {rad.valor} {rad.unidad} (Obj: {rad.objetivo})
                    </span>
                  </div>
                </div>
              );
            })}
            {state.radar.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">No hay indicadores configurados en el radar.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
