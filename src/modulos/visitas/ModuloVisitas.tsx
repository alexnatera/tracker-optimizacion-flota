import React from 'react';
import { Visita } from '../../tipos/database';
import { formatearFecha, formatearMontoUSD, obtenerBadgeEstado } from '../../lib/formato';
import { Plane, Calendar, MapPin, Hotel } from 'lucide-react';

interface ModuloVisitasProps {
  visitas: Visita[];
}

export const ModuloVisitas: React.FC<ModuloVisitasProps> = ({ visitas }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {visitas.map(v => {
          const badge = obtenerBadgeEstado(v.estado);
          return (
            <div key={v.id} className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {v.codigo}
                </span>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                  {badge.texto}
                </span>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-100">{v.titulo}</h3>
                <p className="text-xs text-cyan-400 font-medium flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {v.pais_destino} {v.ciudad ? `(${v.ciudad})` : ''}
                </p>
              </div>

              <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800/80 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    Fechas:
                  </span>
                  <span className="font-mono">{formatearFecha(v.fecha_inicio)} - {formatearFecha(v.fecha_fin)}</span>
                </div>
                {v.hotel && (
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Hotel className="w-3.5 h-3.5" />
                      Hotel:
                    </span>
                    <span className="truncate max-w-[140px]">{v.hotel}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-slate-300 pt-1 border-t border-slate-800">
                  <span className="text-slate-400">Costo Estimado:</span>
                  <span className="font-semibold text-emerald-400">{formatearMontoUSD(v.costo_estimado_usd)}</span>
                </div>
              </div>
            </div>
          );
        })}

        {visitas.length === 0 && (
          <div className="col-span-full glass-panel p-12 text-center text-slate-500 rounded-xl">
            No hay visitas ni viajes corporativos programados.
          </div>
        )}
      </div>
    </div>
  );
};
