import React from 'react';
import { ConfigLista, Usuario } from '../../tipos/database';
import { Settings, Shield, Sliders, Database } from 'lucide-react';

interface ModuloAjustesProps {
  configListas: ConfigLista[];
  usuarioActual: Usuario | null;
}

export const ModuloAjustes: React.FC<ModuloAjustesProps> = ({ configListas, usuarioActual }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Shield className="w-4 h-4 text-cyan-400" />
            Perfil de Usuario y Permisos RLS
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Email:</span>
              <span className="font-semibold text-slate-200">{usuarioActual?.email || 'dev@optracker.local'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Rol RLS Asignado:</span>
              <span className="font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                {usuarioActual?.rol || 'admin'}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Estado Cuenta:</span>
              <span className="text-emerald-400 font-semibold">Activo</span>
            </div>
          </div>
        </div>

        {/* System info */}
        <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-slate-800 pb-3">
            <Database className="w-4 h-4 text-purple-400" />
            Información del Sistema
          </h3>
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Frontend Stack:</span>
              <span className="font-mono text-slate-200">Vite + React + TypeScript + PWA</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Base de Datos:</span>
              <span className="font-mono text-slate-200">Supabase Cloud (PostgreSQL 15)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Despliegue:</span>
              <span className="font-mono text-slate-200">GitHub Pages (Estático)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
