import React from 'react';
import { Search, Bell, UserCheck, RefreshCw, ShieldCheck } from 'lucide-react';
import { ModuloId } from './Sidebar';
import { Usuario } from '../tipos/database';

interface HeaderProps {
  moduloActivo: ModuloId;
  usuarioActual: Usuario | null;
  cargando: boolean;
  onRefrescar: () => void;
  busqueda: string;
  onBusquedaChange: (val: string) => void;
}

const TITULOS_MODULOS: Record<ModuloId, { titulo: string; subtitulo: string }> = {
  resumen: { titulo: 'Resumen Ejecutivo de Flota', subtitulo: 'Indicadores globales, semáforos de desempeño y tareas críticas' },
  portafolio: { titulo: 'Portafolio de Optimizaciones (OPT-###)', subtitulo: 'Iniciativas de mejora operacional por país y avance' },
  tareas: { titulo: 'Control y Seguimiento de Tareas (TAR-###)', subtitulo: 'Entregables operativos vinculados e independientes' },
  radar: { titulo: 'Radar de Desempeño Operacional por País (RAD-###)', subtitulo: 'Monitoreo de métricas clave con umbrales configurables' },
  contactos: { titulo: 'Directorio de Contactos Operativos', subtitulo: 'Directorio de responsables por filial y área' },
  visitas: { titulo: 'Calendario de Visitas y Logística (VJ-###)', subtitulo: 'Planificación de viajes corporativos, vuelos y viáticos' },
  equipo: { titulo: 'Matriz de Dedicación y Capacidad del Equipo', subtitulo: 'Asignación porcentual por persona/mes y horas disponibles' },
  mejora: { titulo: 'Mejora Continua Lean / Six Sigma DMAIC (CI-###)', subtitulo: 'Asistente de causas raíz, clasificador TIMWOODS e I-MR' },
  historial: { titulo: 'Historial Inmutable de Auditoría', subtitulo: 'Registro de trazabilidad de cambios por usuario y campo' },
  ajustes: { titulo: 'Configuración y Listas del Sistema', subtitulo: 'Administración de perfiles, roles RLS y opciones dinámicas' }
};

export const Header: React.FC<HeaderProps> = ({
  moduloActivo,
  usuarioActual,
  cargando,
  onRefrescar,
  busqueda,
  onBusquedaChange
}) => {
  const infoModulo = TITULOS_MODULOS[moduloActivo] || { titulo: 'OPTRACKER', subtitulo: 'Gestión de Flota' };

  return (
    <header className="glass-panel border-b border-slate-800/80 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h2 className="text-xl font-bold text-slate-100">{infoModulo.titulo}</h2>
        <p className="text-xs text-slate-400 font-normal">{infoModulo.subtitulo}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={busqueda}
            onChange={(e) => onBusquedaChange(e.target.value)}
            placeholder="Buscar por código, título, país..."
            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefrescar}
          disabled={cargando}
          className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all disabled:opacity-50"
          title="Refrescar datos de Supabase"
        >
          <RefreshCw className={`w-4 h-4 ${cargando ? 'animate-spin text-cyan-400' : ''}`} />
        </button>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 font-bold text-xs">
            {usuarioActual?.email ? usuarioActual.email.substring(0, 2).toUpperCase() : 'OP'}
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-200 truncate max-w-[140px]">
              {usuarioActual?.email || 'Usuario Operativo'}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Rol: {usuarioActual?.rol || 'admin'}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
