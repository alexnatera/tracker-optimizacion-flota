import React, { useState } from 'react';
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
  const [temaOscuro, setTemaOscuro] = useState<boolean>(false);
  const tareasPendientes = state.tareas.filter(t => t.estado === 'Pendiente' || t.estado === 'En Proceso').length;

  const toggleTema = () => {
    const nuevoTema = !temaOscuro;
    setTemaOscuro(nuevoTema);
    if (nuevoTema) {
      document.body.setAttribute('data-tema', 'oscuro');
    } else {
      document.body.removeAttribute('data-tema');
    }
  };

  return (
    <div data-appshell="1" style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        moduloActivo={moduloActivo}
        onSeleccionarModulo={onSeleccionarModulo}
        conteoPendientes={tareasPendientes}
        temaOscuro={temaOscuro}
        onToggleTema={toggleTema}
        usuarioEmail={state.usuarioActual?.email || 'alex@flota.org'}
        usuarioRol={state.usuarioActual?.rol || 'admin'}
      />
      <main data-mainpane="1" style={{ flex: 1, minWidth: 0, padding: '0 30px 60px' }}>
        <Header
          moduloActivo={moduloActivo}
          usuarioActual={state.usuarioActual}
          cargando={state.cargando}
          onRefrescar={onRefrescar}
          busqueda={busqueda}
          onBusquedaChange={onBusquedaChange}
        />
        {children}
      </main>
    </div>
  );
};
