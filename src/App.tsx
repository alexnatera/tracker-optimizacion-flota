import React, { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import { AppState, Persona, Usuario, RolUsuario } from './tipos/database';
import { construirUsuarioAutenticado } from './lib/auth';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { ModuloId } from './components/Sidebar';

import { ModuloResumen } from './modulos/resumen/ModuloResumen';
import { ModuloPortafolio } from './modulos/portafolio/ModuloPortafolio';
import { ModuloTareas } from './modulos/tareas/ModuloTareas';
import { ModuloRadar } from './modulos/radar/ModuloRadar';
import { ModuloContactos } from './modulos/contactos/ModuloContactos';
import { ModuloVisitas } from './modulos/visitas/ModuloVisitas';
import { ModuloEquipo } from './modulos/equipo/ModuloEquipo';
import { ModuloHistorial } from './modulos/historial/ModuloHistorial';
import { ModuloAjustes } from './modulos/ajustes/ModuloAjustes';
import { ModuloMejora } from './modulos/mejora/ModuloMejora';

const STATE_INICIAL: AppState = {
  personas: [],
  usuarios: [],
  iniciativas: [
    { id: '1', codigo: 'OPT-001', titulo: 'Optimización de Consumo de Combustible en Tránsito', pais: 'Chile', fase: 'Ejecución', estado: 'En Ejecución', avance: 65, impacto_estimado_usd: 120000, responsable_id: '1' },
    { id: '2', codigo: 'OPT-002', titulo: 'Reducción de Tiempo de Permanencia en Puerto', pais: 'Perú', fase: 'Evaluación', estado: 'Planificación', avance: 30, impacto_estimado_usd: 85000, responsable_id: '2' }
  ],
  tareas: [
    { id: 't1', codigo: 'TAR-001', titulo: 'Instalación de caudalímetros analíticos', estado: 'En Proceso', prioridad: 'Alta', iniciativa_id: '1', responsable_id: '1' },
    { id: 't2', codigo: 'TAR-002', titulo: 'Revisión de checklists pre-embarque', estado: 'Pendiente', prioridad: 'Media', iniciativa_id: '2', responsable_id: '2' }
  ],
  radar: [
    { id: 'r1', codigo: 'RAD-001', pais: 'Chile', indicador: 'Disponibilidad de Flota', valor: 94.2, objetivo: 95.0, unidad: '%', estado: 'Amarillo', umbral_amarillo: 92, umbral_rojo: 88, tendencia: 'Estable' },
    { id: 'r2', codigo: 'RAD-002', pais: 'Perú', indicador: 'Tiempo Medio Entre Fallas (MTBF)', valor: 420, objetivo: 500, unidad: 'hrs', estado: 'Verde', umbral_amarillo: 400, umbral_rojo: 350, tendencia: 'Mejorando' }
  ],
  contactos: [
    { id: 'c1', pais: 'Chile', area: 'Operaciones', rol_operativo: 'Jefe de Puerto Valparaíso', nombre: 'Roberto Gómez', email: 'roberto@puertovalpo.cl', telefono: '+56 9 8765 4321', es_principal: true, notas: 'Contacto 24/7' }
  ],
  visitas: [
    { id: 'v1', codigo: 'VJ-001', titulo: 'Auditoría Técnica Base Antofagasta', pais_destino: 'Chile', ciudad: 'Antofagasta', fecha_inicio: '2026-08-15', fecha_fin: '2026-08-18', estado: 'Programada', hotel: 'Enjoy Antofagasta', costo_estimado_usd: 1500, responsable_id: '1' }
  ],
  actividades: [
    { id: 'a1', nombre: 'Inspección de Casco', categoria: 'Mantenimiento' },
    { id: 'a2', nombre: 'Análisis de Datos DMAIC', categoria: 'Mejora Continua' }
  ],
  participaciones: [],
  capacidad: [],
  mejora: [
    { id: 'ci1', codigo: 'CI-001', titulo: 'Demora excesiva en descarga de lubricantes', problema: 'Tiempos de espera superiores a 4 horas en muelle principal', desperdicio_lean: 'Espera', estado: 'Analizar', severidad: 'Alto', lsl: 1.0, usl: 3.0 }
  ],
  historial: [],
  configListas: [],
  notificaciones: [],
  usuarioActual: null,
  personaActual: null,
  cargando: false
};

export const App: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [authCargando, setAuthCargando] = useState<boolean>(true);
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('resumen');
  const [busqueda, setBusqueda] = useState<string>('');
  const [state, setState] = useState<AppState>(STATE_INICIAL);

  const cargarDatosYUsuario = async (user: User) => {
    setState(prev => ({ ...prev, cargando: true }));
    try {
      // 1. Perfil del usuario desde la tabla 'usuarios'
      let perfil: any = null;
      const { data: pId } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (pId) {
        perfil = pId;
      } else if (user.email) {
        const { data: pEmail } = await supabase
          .from('usuarios')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        if (pEmail) perfil = pEmail;
      }

      const usuarioAutenticado = construirUsuarioAutenticado(user.id, user.email, perfil);

      // 2. Persona asociada en tabla 'personas'
      let personaAutenticada: Persona | null = null;
      if (perfil?.persona_id) {
        const { data: p } = await supabase
          .from('personas')
          .select('*')
          .eq('id', perfil.persona_id)
          .maybeSingle();
        if (p) personaAutenticada = p;
      }
      if (!personaAutenticada && user.email) {
        const { data: p } = await supabase
          .from('personas')
          .select('*')
          .eq('email', user.email)
          .maybeSingle();
        if (p) personaAutenticada = p;
      }

      // 3. Cargar colecciones desde Supabase
      const [resIni, resTar, resRad, resCon, resVis, resMej, resHis, resPer, resPart] = await Promise.all([
        supabase.from('portafolio').select('*').limit(100),
        supabase.from('tareas').select('*').limit(100),
        supabase.from('radar_pais').select('*').limit(100),
        supabase.from('contactos').select('*').limit(100),
        supabase.from('calendario_visitas').select('*').limit(100),
        supabase.from('mejora_continua').select('*').limit(100),
        supabase.from('historial').select('*').order('created_at', { ascending: false }).limit(50),
        supabase.from('personas').select('*').limit(100),
        supabase.from('participaciones').select('*').limit(100)
      ]);

      setState(prev => ({
        ...prev,
        usuarioActual: usuarioAutenticado,
        personaActual: personaAutenticada,
        iniciativas: (resIni.data && resIni.data.length > 0) ? resIni.data : prev.iniciativas,
        tareas: (resTar.data && resTar.data.length > 0) ? resTar.data : prev.tareas,
        radar: (resRad.data && resRad.data.length > 0) ? resRad.data : prev.radar,
        contactos: (resCon.data && resCon.data.length > 0) ? resCon.data : prev.contactos,
        visitas: (resVis.data && resVis.data.length > 0) ? resVis.data : prev.visitas,
        mejora: (resMej.data && resMej.data.length > 0) ? resMej.data : prev.mejora,
        historial: (resHis.data && resHis.data.length > 0) ? resHis.data : prev.historial,
        personas: (resPer.data && resPer.data.length > 0) ? resPer.data : prev.personas,
        participaciones: (resPart.data && resPart.data.length > 0) ? resPart.data : prev.participaciones,
        cargando: false
      }));
    } catch (e) {
      console.warn('[OPTRACKER] Error en carga de Supabase:', e);
      setState(prev => ({ ...prev, cargando: false }));
    }
  };

  useEffect(() => {
    setAuthCargando(true);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        cargarDatosYUsuario(session.user);
      }
      setAuthCargando(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session?.user) {
        await cargarDatosYUsuario(session.user);
      } else {
        setState(STATE_INICIAL);
      }
      setAuthCargando(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setState(STATE_INICIAL);
  };

  if (authCargando) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b192c',
          color: '#ffffff',
          font: "500 15px 'IBM Plex Sans', sans-serif"
        }}
      >
        Cargando sesión...
      </div>
    );
  }

  if (!session) {
    return <Login />;
  }

  const renderModulo = () => {
    switch (moduloActivo) {
      case 'resumen':
        return <ModuloResumen state={state} onSeleccionarModulo={setModuloActivo} />;
      case 'portafolio':
        return <ModuloPortafolio iniciativas={state.iniciativas} onGuardar={async () => {}} onEliminar={async () => {}} />;
      case 'tareas':
        return <ModuloTareas tareas={state.tareas} onGuardar={async () => {}} />;
      case 'radar':
        return <ModuloRadar radar={state.radar} />;
      case 'contactos':
        return <ModuloContactos contactos={state.contactos} />;
      case 'visitas':
        return <ModuloVisitas visitas={state.visitas} />;
      case 'equipo':
        return <ModuloEquipo personas={state.personas} participaciones={state.participaciones} actividades={state.actividades} />;
      case 'historial':
        return <ModuloHistorial historial={state.historial} />;
      case 'ajustes':
        return <ModuloAjustes configListas={state.configListas} usuarioActual={state.usuarioActual} />;
      case 'mejora':
        return <ModuloMejora casosMejora={state.mejora} />;
      default:
        return <ModuloResumen state={state} onSeleccionarModulo={setModuloActivo} />;
    }
  };

  return (
    <Layout
      moduloActivo={moduloActivo}
      onSeleccionarModulo={setModuloActivo}
      state={state}
      onRefrescar={() => session?.user && cargarDatosYUsuario(session.user)}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
      onLogout={handleLogout}
    >
      {renderModulo()}
    </Layout>
  );
};
