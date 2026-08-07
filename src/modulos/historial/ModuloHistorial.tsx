import React from 'react';
import { HistorialLog } from '../../tipos/database';
import { formatearFecha } from '../../lib/formato';
import { History, User, FileText } from 'lucide-react';

interface ModuloHistorialProps {
  historial: HistorialLog[];
}

export const ModuloHistorial: React.FC<ModuloHistorialProps> = ({ historial }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass-panel rounded-xl overflow-hidden border border-slate-800">
        <div className="p-4 border-b border-slate-800 bg-slate-900/60 text-xs font-semibold text-slate-300">
          Registro de Auditoría Inmutable (Últimos 300 eventos)
        </div>
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="p-4">Fecha / Hora</th>
              <th className="p-4">Tabla</th>
              <th className="p-4">Campo Modificado</th>
              <th className="p-4">Valor Anterior</th>
              <th className="p-4">Valor Nuevo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {historial.map(h => (
              <tr key={h.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-slate-400">{formatearFecha(h.created_at)}</td>
                <td className="p-4 font-bold text-cyan-400">{h.tabla}</td>
                <td className="p-4 text-slate-200">{h.campo}</td>
                <td className="p-4 text-amber-400/80 truncate max-w-[150px]">{h.valor_anterior || '(vacío)'}</td>
                <td className="p-4 text-emerald-400 font-semibold truncate max-w-[150px]">{h.valor_nuevo || '(vacío)'}</td>
              </tr>
            ))}
            {historial.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-sans">
                  No hay registros de auditoría en el historial.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
