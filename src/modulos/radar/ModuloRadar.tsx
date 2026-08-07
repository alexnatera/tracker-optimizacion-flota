import React from 'react';
import { IndicadorRadar } from '../../tipos/database';
import { obtenerBadgeEstado } from '../../lib/formato';
import { Radio, AlertTriangle, TrendingUp, CheckCircle } from 'lucide-react';

interface ModuloRadarProps {
  radar: IndicadorRadar[];
}

export const ModuloRadar: React.FC<ModuloRadarProps> = ({ radar }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {radar.map(rad => {
          const badge = obtenerBadgeEstado(rad.estado);
          const porcentajeRelativo = rad.objetivo ? Math.round((rad.valor / rad.objetivo) * 100) : 0;
          return (
            <div key={rad.id} className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  {rad.codigo}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                  {badge.texto}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{rad.indicador}</h3>
                <p className="text-xs text-slate-400">País: <span className="text-slate-200 font-medium">{rad.pais}</span></p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] text-slate-500 uppercase">Valor Actual</span>
                  <span className="text-xl font-extrabold text-slate-100">{rad.valor} <span className="text-xs font-normal text-slate-400">{rad.unidad}</span></span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] text-slate-500 uppercase">Objetivo Meta</span>
                  <span className="text-sm font-bold text-slate-300">{rad.objetivo} {rad.unidad}</span>
                </div>
              </div>

              {rad.notas && (
                <p className="text-[11px] text-slate-400 italic">"{rad.notas}"</p>
              )}
            </div>
          );
        })}

        {radar.length === 0 && (
          <div className="col-span-full glass-panel p-12 text-center text-slate-500 rounded-xl">
            No hay indicadores configurados en el radar por país.
          </div>
        )}
      </div>
    </div>
  );
};
