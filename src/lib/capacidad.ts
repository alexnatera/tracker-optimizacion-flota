import { Participacion } from '../tipos/database';

export interface SemaforoCapacidad {
  estado: 'Sobrecargado' | 'Óptimo' | 'Bajo' | 'Subutilizado';
  color: 'rojo' | 'verde' | 'amarillo' | 'azul';
  badge: string;
}

export function calcularPorcentajeDedicacion(participaciones: Participacion[]): number {
  return participaciones.reduce((acc, p) => acc + (p.porcentaje || 0), 0);
}

export function calcularHorasDedicadas(participaciones: Participacion[], horasMes: number): number {
  const porcentaje = calcularPorcentajeDedicacion(participaciones);
  return Math.round((horasMes * porcentaje) / 100);
}

export function calcularHorasDisponibles(horasMes: number, participaciones: Participacion[]): number {
  const dedicadas = calcularHorasDedicadas(participaciones, horasMes);
  return Math.max(0, horasMes - dedicadas);
}

export function obtenerSemaforoCapacidad(porcentaje: number): SemaforoCapacidad {
  if (porcentaje > 100) {
    return {
      estado: 'Sobrecargado',
      color: 'rojo',
      badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    };
  }
  if (porcentaje >= 80) {
    return {
      estado: 'Óptimo',
      color: 'verde',
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    };
  }
  if (porcentaje >= 50) {
    return {
      estado: 'Bajo',
      color: 'amarillo',
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    };
  }
  return {
    estado: 'Subutilizado',
    color: 'azul',
    badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
  };
}
