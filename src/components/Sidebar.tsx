import React from 'react';
import {
  LayoutDashboard,
  Briefcase,
  CheckSquare,
  Radio,
  Users,
  Plane,
  Grid,
  History,
  Settings,
  TrendingUp,
  Ship
} from 'lucide-react';

export type ModuloId =
  | 'resumen'
  | 'portafolio'
  | 'tareas'
  | 'radar'
  | 'contactos'
  | 'visitas'
  | 'equipo'
  | 'historial'
  | 'ajustes'
  | 'mejora';

interface SidebarProps {
  moduloActivo: ModuloId;
  onSeleccionarModulo: (id: ModuloId) => void;
  conteoPendientes?: number;
  conteoDemandas?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  moduloActivo,
  onSeleccionarModulo,
  conteoPendientes = 0
}) => {
  const modulos = [
    { id: 'resumen' as ModuloId, label: 'Resumen Global', icon: LayoutDashboard },
    { id: 'portafolio' as ModuloId, label: 'Portafolio OPT', icon: Briefcase },
    { id: 'tareas' as ModuloId, label: 'Tareas TAR', icon: CheckSquare, badge: conteoPendientes },
    { id: 'radar' as ModuloId, label: 'Radar por País RAD', icon: Radio },
    { id: 'contactos' as ModuloId, label: 'Directorio Contactos', icon: Users },
    { id: 'visitas' as ModuloId, label: 'Visitas y Vuelos VJ', icon: Plane },
    { id: 'equipo' as ModuloId, label: 'Equipo y Capacidad', icon: Grid },
    { id: 'mejora' as ModuloId, label: 'Mejora DMAIC CI', icon: TrendingUp, highlight: true },
    { id: 'historial' as ModuloId, label: 'Historial Auditoría', icon: History },
    { id: 'ajustes' as ModuloId, label: 'Ajustes y Listas', icon: Settings }
  ];

  return (
    <aside className="w-64 glass-panel border-r border-slate-800/80 flex flex-col h-screen sticky top-0 z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Ship className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-200 to-cyan-400 bg-clip-text text-transparent">
            OPTRACKER
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">Gestión de Flota v2.0</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
          Módulos Operativos
        </div>
        {modulos.map((item) => {
          const Icon = item.icon;
          const esActivo = moduloActivo === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSeleccionarModulo(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                esActivo
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 border border-cyan-500/30 shadow-md shadow-cyan-950/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              } ${item.highlight ? 'hover:border-purple-500/30' : ''}`}
            >
              <Icon className={`w-4 h-4 ${esActivo ? 'text-cyan-400' : item.highlight ? 'text-purple-400' : 'text-slate-400'}`} />
              <span className="flex-1 text-left truncate">{item.label}</span>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <span>Vite + Supabase</span>
        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
          Online
        </span>
      </div>
    </aside>
  );
};
