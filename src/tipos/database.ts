// Tipos TypeScript para Supabase / OPTRACKER

export type RolUsuario = 'admin' | 'editor' | 'lector';

export interface Persona {
  id: string;
  nombre: string;
  email?: string | null;
  pais: string;
  rol_operativo?: string | null;
  horas_mes?: number;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Usuario {
  id: string;
  email: string;
  rol: RolUsuario;
  persona_id?: string | null;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

export type EstadoIniciativa = 'Planificación' | 'En Ejecución' | 'En Evaluación' | 'Completado' | 'Cancelado' | 'Pausado';

export interface Iniciativa {
  id: string;
  codigo: string; // OPT-###
  titulo: string;
  descripcion?: string | null;
  pais: string;
  fase: string;
  estado: EstadoIniciativa;
  responsable_id?: string | null;
  avance: number; // 0..100
  metricas_base?: string | null;
  metricas_objetivo?: string | null;
  metricas_actual?: string | null;
  impacto_estimado_usd?: number | null;
  fecha_inicio?: string | null;
  fecha_fin_estimada?: string | null;
  fecha_fin_real?: string | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EstadoTarea = 'Pendiente' | 'En Proceso' | 'Completada' | 'Bloqueada';
export type PrioridadTarea = 'Alta' | 'Media' | 'Baja' | 'Urgente';

export interface Tarea {
  id: string;
  codigo: string; // TAR-###
  iniciativa_id?: string | null;
  titulo: string;
  descripcion?: string | null;
  responsable_id?: string | null;
  estado: EstadoTarea;
  prioridad: PrioridadTarea;
  fecha_limite?: string | null;
  fecha_completada?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EstadoRadar = 'Verde' | 'Amarillo' | 'Rojo' | 'Sin Datos';

export interface IndicadorRadar {
  id: string;
  codigo: string; // RAD-###
  pais: string;
  indicador: string;
  categoria?: string | null;
  valor: number;
  objetivo: number;
  unidad: string;
  estado: EstadoRadar;
  umbral_amarillo?: number | null;
  umbral_rojo?: number | null;
  tendencia?: 'Mejorando' | 'Estable' | 'Empeorando' | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Contacto {
  id: string;
  pais: string;
  area?: string;
  rol_operativo: string;
  nombre: string;
  email?: string | null;
  telefono?: string | null;
  es_principal?: boolean;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type EstadoVisita = 'Programada' | 'En Curso' | 'Completada' | 'Cancelada';

export interface Visita {
  id: string;
  codigo: string; // VJ-###
  titulo: string;
  pais_destino: string;
  ciudad?: string | null;
  responsable_id?: string | null;
  fecha_inicio: string;
  fecha_fin: string;
  objetivo?: string | null;
  estado: EstadoVisita;
  hotel?: string | null;
  vuelo_info?: string | null;
  costo_estimado_usd?: number | null;
  notas?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Actividad {
  id: string;
  nombre: string;
  categoria: string;
  descripcion?: string | null;
  created_at?: string;
}

export interface Participacion {
  id: string;
  persona_id: string;
  actividad_id: string;
  porcentaje: number;
  mes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CapacidadMensual {
  id: string;
  persona_id: string;
  mes: string; // YYYY-MM
  horas_disponibles: number;
  created_at?: string;
  updated_at?: string;
}

export type SeveridadMejora = 'Crítico' | 'Alto' | 'Medio' | 'Bajo';
export type DesperdicioLean = 'Talento' | 'Inventario' | 'Movimiento' | 'Espera' | 'Transporte' | 'Sobreproducción' | 'Sobreprocesamiento' | 'Defectos' | 'Sin clasificar';
export type EstadoMejora = 'Definir' | 'Medir' | 'Analizar' | 'Mejorar' | 'Controlar' | 'Cerrado';

export interface MejoraContinua {
  id: string;
  codigo: string; // CI-###
  titulo: string;
  problema: string;
  modulo_app?: string | null;
  pais?: string | null;
  severidad: SeveridadMejora;
  desperdicio_lean: DesperdicioLean;
  estado: EstadoMejora;
  reportado_por_id?: string | null;
  responsable_id?: string | null;
  metodo_raiz?: string | null;
  causa_raiz?: string | null;
  acciones_control?: string | null;
  reincidencia_de_id?: string | null;
  indicador_y?: string | null;
  usl?: number | null;
  lsl?: number | null;
  target_val?: number | null;
  cp?: number | null;
  cpk?: number | null;
  sigma_level?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface HistorialLog {
  id: string;
  tabla: string;
  fila_id: string;
  campo: string;
  valor_anterior?: string | null;
  valor_nuevo?: string | null;
  usuario_id?: string | null;
  usuario_email?: string | null;
  created_at: string;
}

export interface ConfigLista {
  id: string;
  categoria: string;
  clave: string;
  valor: string;
  orden: number;
  activo: boolean;
}

export interface Notificacion {
  id: string;
  destinatario_id: string;
  titulo: string;
  mensaje: string;
  leido: boolean;
  enlace?: string | null;
  created_at: string;
}

export interface AppState {
  personas: Persona[];
  usuarios: Usuario[];
  iniciativas: Iniciativa[];
  tareas: Tarea[];
  radar: IndicadorRadar[];
  contactos: Contacto[];
  visitas: Visita[];
  actividades: Actividad[];
  participaciones: Participacion[];
  capacidad: CapacidadMensual[];
  mejora: MejoraContinua[];
  historial: HistorialLog[];
  configListas: ConfigLista[];
  notificaciones: Notificacion[];
  usuarioActual: Usuario | null;
  personaActual: Persona | null;
  cargando: boolean;
}
