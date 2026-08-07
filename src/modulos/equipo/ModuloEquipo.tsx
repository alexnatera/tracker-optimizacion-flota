import React from 'react';
import { Persona, Participacion, Actividad } from '../../tipos/database';
import { calcularHorasDedicadas, calcularHorasDisponibles, calcularPorcentajeDedicacion, obtenerSemaforoCapacidad } from '../../lib/capacidad';
import { Grid, User, Clock, CheckCircle } from 'lucide-react';

interface ModuloEquipoProps {
  personas: Persona[];
  participaciones: Participacion[];
  actividades: Actividad[];
}

export const ModuloEquipo: React.FC<ModuloEquipoProps> = ({ personas, participaciones, actividades }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {personas.map(p => {
          const partPersona = participaciones.filter(pt => pt.persona_id === p.id);
          const porcentajeTotal = calcularPorcentajeDedicacion(partPersona);
          const horasDedicadas = calcularHorasDedicadas(partPersona, p.horas_mes || 160);
          const horasDisponibles = calcularHorasDisponibles(p.horas_mes || 160, partPersona);
          const semaforo = obtenerSemaforoCapacidad(porcentajeTotal);

          return (
            <div key={p.id} className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-cyan-400">
                    {p.nombre ? p.nombre.substring(0, 2).toUpperCase() : 'PE'}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">{p.nombre}</h3>
                    <p className="text-[11px] text-slate-400">{p.rol_operativo || 'Miembro de Equipo'} | {p.pais}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold border ${semaforo.badge}`}>
                  {semaforo.estado}
                </span>
              </div>

              {/* Progress & Hours */}
              <div className="space-y-2 p-3 bg-slate-900/80 rounded-lg border border-slate-800/80">
                <div className="flex justify-between text-xs text-slate-300">
                  <span>Dedicación Total:</span>
                  <span className="font-mono font-bold text-cyan-300">{porcentajeTotal}%</span>
                </div>
                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      porcentajeTotal > 100 ? 'bg-red-500' : porcentajeTotal >= 80 ? 'bg-emerald-500' : 'bg-cyan-500'
                    }`}
                    style={{ width: `${Math.min(100, porcentajeTotal)}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Dedicadas: <strong className="text-slate-200">{horasDedicadas}h</strong></span>
                  <span>Disponibles: <strong className="text-emerald-400">{horasDisponibles}h</strong></span>
                </div>
              </div>
            </div>
          );
        })}

        {personas.length === 0 && (
          <div className="col-span-full glass-panel p-12 text-center text-slate-500 rounded-xl">
            No hay integrantes de equipo registrados.
          </div>
        )}
      </div>
    </div>
  );
};
