// Tabla de constantes estadísticas para SPC (d2, A2, D3, D4) por n
const TABLA_CONSTANTES: Record<number, { d2: number; A2: number; D3: number; D4: number }> = {
  2: { d2: 1.128, A2: 1.880, D3: 0, D4: 3.267 },
  3: { d2: 1.693, A2: 1.023, D3: 0, D4: 2.574 },
  4: { d2: 2.059, A2: 0.729, D3: 0, D4: 2.282 },
  5: { d2: 2.326, A2: 0.577, D3: 0, D4: 2.114 },
  6: { d2: 2.534, A2: 0.483, D3: 0, D4: 2.004 }
};

export function obtenerConstantesEstadisticas(n: number = 2) {
  return TABLA_CONSTANTES[n] || TABLA_CONSTANTES[2];
}

export interface LimitesControl {
  media: number;
  rangoMovilMedio: number;
  sigma: number;
  ucl: number;
  lcl: number;
  uclRango: number;
  lclRango: number;
  rangosMoviles: number[];
}

export function calcularLimitesControl(valores: number[]): LimitesControl {
  if (valores.length === 0) {
    return {
      media: 0,
      rangoMovilMedio: 0,
      sigma: 0,
      ucl: 0,
      lcl: 0,
      uclRango: 0,
      lclRango: 0,
      rangosMoviles: []
    };
  }

  const suma = valores.reduce((a, b) => a + b, 0);
  const media = suma / valores.length;

  const rangosMoviles: number[] = [];
  for (let i = 1; i < valores.length; i++) {
    rangosMoviles.push(Math.abs(valores[i] - valores[i - 1]));
  }

  const sumaRangos = rangosMoviles.reduce((a, b) => a + b, 0);
  const rangoMovilMedio = rangosMoviles.length > 0 ? sumaRangos / rangosMoviles.length : 0;

  const constantes = obtenerConstantesEstadisticas(2);
  const sigma = rangoMovilMedio / constantes.d2;

  // I-MR: UCL = Xbar + 2.66 * MRbar, LCL = Xbar - 2.66 * MRbar
  const ucl = media + 2.66 * rangoMovilMedio;
  const lcl = Math.max(0, media - 2.66 * rangoMovilMedio);

  const uclRango = constantes.D4 * rangoMovilMedio;
  const lclRango = constantes.D3 * rangoMovilMedio;

  return {
    media,
    rangoMovilMedio,
    sigma,
    ucl,
    lcl,
    uclRango,
    lclRango,
    rangosMoviles
  };
}

export interface ViolacionRegla {
  regla: number;
  descripcion: string;
  indice: number;
  valor: number;
}

export function evaluarReglasNelson(valores: number[], media: number, sigma: number): ViolacionRegla[] {
  const violaciones: ViolacionRegla[] = [];
  if (valores.length === 0 || sigma === 0) return violaciones;

  // Regla 1: 1 punto > 3 sigma de la media
  const ucl3 = media + 3 * sigma;
  const lcl3 = media - 3 * sigma;

  valores.forEach((val, idx) => {
    if (val > ucl3 || val < lcl3) {
      violaciones.push({
        regla: 1,
        descripcion: `Punto ${idx + 1} (${val}) está fuera de ±3σ (${lcl3.toFixed(2)} - ${ucl3.toFixed(2)})`,
        indice: idx,
        valor: val
      });
    }
  });

  // Regla 2: 9 puntos seguidos del mismo lado de la media
  for (let i = 8; i < valores.length; i++) {
    const tajada = valores.slice(i - 8, i + 1);
    const todosMayores = tajada.every(v => v > media);
    const todosMenores = tajada.every(v => v < media);

    if (todosMayores || todosMenores) {
      violaciones.push({
        regla: 2,
        descripcion: `9 puntos consecutivos del mismo lado de la media en el punto ${i + 1}`,
        indice: i,
        valor: valores[i]
      });
    }
  }

  // Regla 3: 6 puntos seguidos estrictamente crecientes o decrecientes
  for (let i = 5; i < valores.length; i++) {
    const tajada = valores.slice(i - 5, i + 1);
    let creciente = true;
    let decreciente = true;

    for (let j = 1; j < tajada.length; j++) {
      if (tajada[j] <= tajada[j - 1]) creciente = false;
      if (tajada[j] >= tajada[j - 1]) decreciente = false;
    }

    if (creciente || decreciente) {
      violaciones.push({
        regla: 3,
        descripcion: `6 puntos consecutivos en tendencia ${creciente ? 'creciente' : 'decreciente'} en el punto ${i + 1}`,
        indice: i,
        valor: valores[i]
      });
    }
  }

  return violaciones;
}
