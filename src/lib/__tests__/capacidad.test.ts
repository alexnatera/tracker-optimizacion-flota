import { describe, it, expect } from 'vitest';
import {
  calcularHorasDedicadas,
  calcularHorasDisponibles,
  calcularPorcentajeDedicacion,
  obtenerSemaforoCapacidad
} from '../capacidad';
import { Participacion } from '../../tipos/database';

describe('Lógica de Capacidad del Equipo (TDD)', () => {
  const participacionesEjemplo: Participacion[] = [
    { id: '1', persona_id: 'p1', actividad_id: 'a1', porcentaje: 40 },
    { id: '2', persona_id: 'p1', actividad_id: 'a2', porcentaje: 35 },
    { id: '3', persona_id: 'p1', actividad_id: 'a3', porcentaje: 15 }
  ];

  it('debe calcular correctamente el porcentaje total de dedicación', () => {
    const porcentajeTotal = calcularPorcentajeDedicacion(participacionesEjemplo);
    expect(porcentajeTotal).toBe(90);
  });

  it('debe calcular correctamente las horas dedicadas según horas del mes', () => {
    const horasMes = 160;
    const horasDedicadas = calcularHorasDedicadas(participacionesEjemplo, horasMes);
    expect(horasDedicadas).toBe(144); // 90% de 160 = 144
  });

  it('debe calcular las horas disponibles restantes', () => {
    const horasMes = 160;
    const horasDisponibles = calcularHorasDisponibles(horasMes, participacionesEjemplo);
    expect(horasDisponibles).toBe(16); // 160 - 144 = 16
  });

  it('debe retornar semáforo y estado según el porcentaje de dedicación', () => {
    expect(obtenerSemaforoCapacidad(110)).toEqual({ estado: 'Sobrecargado', color: 'rojo', badge: 'bg-red-500/20 text-red-400 border-red-500/30' });
    expect(obtenerSemaforoCapacidad(90)).toEqual({ estado: 'Óptimo', color: 'verde', badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' });
    expect(obtenerSemaforoCapacidad(65)).toEqual({ estado: 'Bajo', color: 'amarillo', badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30' });
    expect(obtenerSemaforoCapacidad(30)).toEqual({ estado: 'Subutilizado', color: 'azul', badge: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' });
  });
});
