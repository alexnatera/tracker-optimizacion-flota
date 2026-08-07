import React from 'react';
import { Sidebar, ModuloId } from './Sidebar';
import { Header } from './Header';
import { AppState } from '../tipos/database';

interface LayoutProps {
  moduloActivo: ModuloId;
  onSeleccionarModulo: (id: ModuloId) => void;
  state: AppState;
  onRefrescar: () => void;
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  moduloActivo,
  onSeleccionarModulo,
  state,
  onRefrescar,
  busqueda,
  onBusquedaChange,
  children
}) => {
  const tareasPendientes = state.tareas.filter(t => t.estado === 'Pendiente' || t.estado === 'En Proceso').length;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar
        moduloActivo={moduloActivo}
        onSeleccionarModulo={onSeleccionarModulo}
        conteoPendientes={tareasPendientes}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          moduloActivo={moduloActivo}
          usuarioActual={state.usuarioActual}
          cargando={state.cargando}
          onRefrescar={onRefrescar}
          busqueda={busqueda}
          onBusquedaChange={onBusquedaChange}
        />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
