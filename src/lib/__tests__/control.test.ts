import { describe, it, expect } from 'vitest';
import {
  calcularLimitesControl,
  evaluarReglasNelson,
  obtenerConstantesEstadisticas
} from '../control';

describe('Lógica de Control Estadístico de Procesos I-MR (TDD)', () => {
  const datosEstables = [10.2, 10.5, 9.8, 10.1, 10.4, 9.9, 10.3, 10.0, 10.2, 10.1];
  const datosConFueraDeControl = [10.2, 10.5, 9.8, 10.1, 15.8, 9.9, 10.3, 10.0];

  it('debe proporcionar constantes d2, A2, D3, D4 según el tamaño de subgrupo', () => {
    const const2 = obtenerConstantesEstadisticas(2);
    expect(const2.d2).toBeCloseTo(1.128, 3);
    expect(const2.A2).toBeCloseTo(1.88, 2);
    expect(const2.D4).toBeCloseTo(3.267, 3);
  });

  it('debe calcular la media, rango móvil medio y límites UCL/LCL para gráfico I-MR', () => {
    const limites = calcularLimitesControl(datosEstables);
    expect(limites.media).toBeCloseTo(10.15, 2);
    expect(limites.ucl).toBeGreaterThan(limites.media);
    expect(limites.lcl).toBeLessThan(limites.media);
    expect(limites.rangosMoviles.length).toBe(datosEstables.length - 1);
  });

  it('debe detectar violaciones a la Regla 1 de Nelson (punto fuera de 3 sigma)', () => {
    const media = 10.0;
    const sigma = 0.5;
    const datosConFueraDeControl = [10.2, 10.5, 9.8, 10.1, 15.8, 9.9, 10.3, 10.0];
    const violaciones = evaluarReglasNelson(datosConFueraDeControl, media, sigma);
    const tieneRegla1 = violaciones.some(v => v.regla === 1 && v.indice === 4);
    expect(tieneRegla1).toBe(true);
  });


  it('debe detectar la Regla 2 de Nelson (9 puntos seguidos del mismo lado de la media)', () => {
    const datosRegla2 = [10.5, 10.6, 10.4, 10.5, 10.7, 10.8, 10.5, 10.6, 10.7, 9.5]; // 9 puntos > media (10.0)
    const media = 10.0;
    const sigma = 0.5;
    const violaciones = evaluarReglasNelson(datosRegla2, media, sigma);
    const tieneRegla2 = violaciones.some(v => v.regla === 2);
    expect(tieneRegla2).toBe(true);
  });
});
