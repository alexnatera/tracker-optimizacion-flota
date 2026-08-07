import React from 'react';
import { Contacto } from '../../tipos/database';
import { Users, Mail, Phone, MapPin } from 'lucide-react';

interface ModuloContactosProps {
  contactos: Contacto[];
}

export const ModuloContactos: React.FC<ModuloContactosProps> = ({ contactos }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contactos.map(c => (
          <div key={c.id} className="glass-panel glass-panel-hover p-5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded border border-slate-700/50 flex items-center gap-1.5">
                <MapPin className="w-3 h-3 text-cyan-400" />
                {c.pais}
              </span>
              {c.es_principal && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Principal
                </span>
              )}
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-100">{c.nombre}</h3>
              <p className="text-xs text-cyan-400 font-medium">{c.rol_operativo} ({c.area || 'Operaciones'})</p>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              {c.email && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <a href={`mailto:${c.email}`} className="hover:underline truncate">{c.email}</a>
                </div>
              )}
              {c.telefono && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{c.telefono}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        {contactos.length === 0 && (
          <div className="col-span-full glass-panel p-12 text-center text-slate-500 rounded-xl">
            No hay contactos registrados en el directorio.
          </div>
        )}
      </div>
    </div>
  );
};
