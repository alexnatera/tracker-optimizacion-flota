import React, { useState } from 'react';
import { Tarea, EstadoTarea } from '../../tipos/database';
import { formatearFecha, obtenerBadgeEstado } from '../../lib/formato';
import { CheckSquare, Clock, AlertCircle, Plus, CheckCircle } from 'lucide-react';

interface ModuloTareasProps {
  tareas: Tarea[];
  onGuardar: (tarea: Partial<Tarea>) => Promise<void>;
}

export const ModuloTareas: React.FC<ModuloTareasProps> = ({ tareas, onGuardar }) => {
  const [filtroEstado, setFiltroEstado] = useState<string>('Todos');

  const filtradas = tareas.filter(t => {
    if (filtroEstado !== 'Todos' && t.estado !== filtroEstado) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between glass-panel p-4 rounded-xl">
        <div className="flex items-center gap-2">
          {['Todos', 'Pendiente', 'En Proceso', 'Completada', 'Bloqueada'].map(e => (
            <button
              key={e}
              onClick={() => setFiltroEstado(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filtroEstado === e
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Código</th>
              <th className="p-4">Título Tarea</th>
              <th className="p-4">Prioridad</th>
              <th className="p-4">Estado</th>
              <th className="p-4">Fecha Límite</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtradas.map(t => {
              const badge = obtenerBadgeEstado(t.estado);
              return (
                <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-cyan-400">{t.codigo}</td>
                  <td className="p-4 font-medium text-slate-100">{t.titulo}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      t.prioridad === 'Urgente' || t.prioridad === 'Alta' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                    }`}>
                      {t.prioridad || 'Media'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                      {badge.texto}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono">{formatearFecha(t.fecha_limite)}</td>
                </tr>
              );
            })}
            {filtradas.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500">
                  No hay tareas en el estado seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
