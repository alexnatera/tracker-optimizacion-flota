import { describe, it, expect } from 'vitest';
import {
  sugerirDesperdicioLean,
  calcularCapacidadProceso
} from '../dmaic';

describe('Lógica DMAIC y Capacidad de Proceso (TDD)', () => {
  it('debe clasificar el desperdicio Lean (TIMWOODS) mediante patrones de texto', () => {
    expect(sugerirDesperdicioLean('El proceso está demasiado lento y hay demora')).toBe('Espera');
    expect(sugerirDesperdicioLean('Se detectó un error en la carga de datos')).toBe('Defectos');
    expect(sugerirDesperdicioLean('Paso manual repetido dos veces')).toBe('Sobreprocesamiento');
    expect(sugerirDesperdicioLean('Demasiado stock acumulado en almacén')).toBe('Inventario');
    expect(sugerirDesperdicioLean('Desplazamiento inútil entre muelles')).toBe('Transporte');
    expect(sugerirDesperdicioLean('Falta de capacitación del personal clave')).toBe('Talento');
    expect(sugerirDesperdicioLean('Incidente general en el motor')).toBe('Sin clasificar');
  });

  it('debe calcular los índices de capacidad de proceso Cp y Cpk', () => {
    const mediciones = [10.1, 10.2, 9.9, 10.0, 10.3, 10.1, 9.8, 10.2, 10.0, 10.1];
    const LSL = 9.0;
    const USL = 11.0;

    const res = calcularCapacidadProceso(mediciones, LSL, USL);

    expect(res.media).toBeCloseTo(10.07, 2);
    expect(res.cp).toBeGreaterThan(1.0);
    expect(res.cpk).toBeGreaterThan(1.0);
    expect(res.sigmaLevel).toBeGreaterThan(3.0);
  });
});
