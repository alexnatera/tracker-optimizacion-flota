export function formatearMontoUSD(valor?: number | null): string {
  if (valor == null || isNaN(valor)) return '$0 USD';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(valor);
}

export function formatearFecha(isoString?: string | null): string {
  if (!isoString) return '-';
  try {
    const fecha = new Date(isoString);
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(fecha);
  } catch {
    return isoString;
  }
}

export function formatearPorcentaje(valor?: number | null): string {
  if (valor == null || isNaN(valor)) return '0%';
  return `${Math.round(valor)}%`;
}

export function obtenerBadgeEstado(estado: string): { texto: string; clase: string } {
  switch (estado) {
    case 'Completado':
    case 'Completada':
    case 'Verde':
    case 'Óptimo':
    case 'Controlar':
    case 'Cerrado':
      return { texto: estado, clase: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' };

    case 'En Ejecución':
    case 'En Proceso':
    case 'En Curso':
    case 'Programada':
    case 'Medir':
    case 'Mejorar':
      return { texto: estado, clase: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };

    case 'Planificación':
    case 'En Evaluación':
    case 'Amarillo':
    case 'Bajo':
    case 'Definir':
    case 'Analizar':
    case 'Pendiente':
      return { texto: estado, clase: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };

    case 'Cancelado':
    case 'Cancelada':
    case 'Rojo':
    case 'Sobrecargado':
    case 'Bloqueada':
    case 'Crítico':
      return { texto: estado, clase: 'bg-red-500/10 text-red-400 border-red-500/20' };

    default:
      return { texto: estado || 'N/A', clase: 'bg-slate-700/30 text-slate-300 border-slate-700/50' };
  }
}
