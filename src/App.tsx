import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { AppState, Iniciativa, Tarea, IndicadorRadar, Contacto, Visita, Persona, Participacion, HistorialLog, ConfigLista, MejoraContinua } from './tipos/database';
import { Layout } from './components/Layout';
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

// Datos iniciales de demostración si la conexión aún no ha traído filas
const DATOS_INICIALES_DEMO: AppState = {
  personas: [
    { id: '1', nombre: 'Alex Natera', email: 'alex@flota.org', pais: 'Chile', rol_operativo: 'Líder de Flota', horas_mes: 160, activo: true },
    { id: '2', nombre: 'Carlos Silva', email: 'carlos@flota.org', pais: 'Perú', rol_operativo: 'Ingeniero Operativo', horas_mes: 160, activo: true }
  ],
  usuarios: [
    { id: 'u1', email: 'alex@flota.org', rol: 'admin', persona_id: '1', activo: true }
  ],
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
  participaciones: [
    { id: 'p1', persona_id: '1', actividad_id: 'a1', porcentaje: 50 },
    { id: 'p2', persona_id: '1', actividad_id: 'a2', porcentaje: 40 }
  ],
  capacidad: [
    { id: 'cap1', persona_id: '1', mes: '2026-08', horas_disponibles: 160 }
  ],
  mejora: [
    { id: 'ci1', codigo: 'CI-001', titulo: 'Demora excesiva en descarga de lubricantes', problema: 'Tiempos de espera superiores a 4 horas en muelle principal', desperdicio_lean: 'Espera', estado: 'Analizar', severidad: 'Alto', lsl: 1.0, usl: 3.0 }
  ],
  historial: [
    { id: 'h1', tabla: 'iniciativas', fila_id: '1', campo: 'avance', valor_anterior: '50', valor_nuevo: '65', usuario_id: 'u1', created_at: new Date().toISOString() }
  ],
  configListas: [],
  notificaciones: [],
  usuarioActual: { id: 'u1', email: 'alex@flota.org', rol: 'admin', persona_id: '1', activo: true },
  personaActual: { id: '1', nombre: 'Alex Natera', email: 'alex@flota.org', pais: 'Chile', rol_operativo: 'Líder de Flota', horas_mes: 160, activo: true },
  cargando: false
};

export const App: React.FC = () => {
  const [moduloActivo, setModuloActivo] = useState<ModuloId>('resumen');
  const [busqueda, setBusqueda] = useState<string>('');
  const [state, setState] = useState<AppState>(DATOS_INICIALES_DEMO);

  const cargarDatosSupabase = async () => {
    setState(prev => ({ ...prev, cargando: true }));
    try {
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
      console.warn('[OPTRACKER] Usando datos locales demo (fallback):', e);
      setState(prev => ({ ...prev, cargando: false }));
    }
  };

  useEffect(() => {
    cargarDatosSupabase();
  }, []);

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
      onRefrescar={cargarDatosSupabase}
      busqueda={busqueda}
      onBusquedaChange={setBusqueda}
    >
      {renderModulo()}
    </Layout>
  );
};
