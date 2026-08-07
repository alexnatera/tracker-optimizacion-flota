import React, { useState } from 'react';
import { Iniciativa, EstadoIniciativa } from '../../tipos/database';
import { formatearMontoUSD, formatearPorcentaje, obtenerBadgeEstado } from '../../lib/formato';
import { Plus, Search, Filter, Briefcase, Trash2, Edit } from 'lucide-react';

interface ModuloPortafolioProps {
  iniciativas: Iniciativa[];
  onGuardar: (iniciativa: Partial<Iniciativa>) => Promise<void>;
  onEliminar: (id: string) => Promise<void>;
}

export const ModuloPortafolio: React.FC<ModuloPortafolioProps> = ({ iniciativas, onGuardar, onEliminar }) => {
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
    <div className="space-y-6 animate-fade-in">
      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">País:</span>
            <select 
              value={filtroPais} 
              onChange={e => setFiltroPais(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              {paises.map(p => <option key={p} value={p} className="bg-slate-900">{p}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Estado:</span>
            <select 
              value={filtroEstado} 
              onChange={e => setFiltroEstado(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none"
            >
              {estados.map(e => <option key={e} value={e} className="bg-slate-900">{e}</option>)}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-400">
          Mostrando <span className="font-bold text-cyan-400">{filtradas.length}</span> iniciativas
        </div>
      </div>

      {/* Grid of Initiative Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtradas.map(ini => {
          const badge = obtenerBadgeEstado(ini.estado);
          return (
            <div key={ini.id} className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                    {ini.codigo}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                    {badge.texto}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{ini.titulo}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{ini.descripcion || 'Sin descripción detallada.'}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                {/* Progress bar */}
                <div>
                  <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                    <span>Avance de Fase</span>
                    <span className="font-mono text-cyan-300 font-bold">{formatearPorcentaje(ini.avance)}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                      style={{ width: `${Math.min(100, Math.max(0, ini.avance || 0))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                  <div>
                    <span className="block text-slate-500">País / Filial</span>
                    <span className="font-medium text-slate-300">{ini.pais}</span>
                  </div>
                  <div>
                    <span className="block text-slate-500">Impacto Estimado</span>
                    <span className="font-semibold text-emerald-400">{formatearMontoUSD(ini.impacto_estimado_usd)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {filtradas.length === 0 && (
          <div className="col-span-full glass-panel p-12 text-center text-slate-500 rounded-xl">
            No se encontraron iniciativas de optimización con los filtros seleccionados.
          </div>
        )}
      </div>
    </div>
  );
};
