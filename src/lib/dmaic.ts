import { DesperdicioLean } from '../tipos/database';

export function sugerirDesperdicioLean(texto: string): DesperdicioLean {
  const t = (texto || '').toLowerCase();

  if (/lento|espera|demora|retraso|cuello de botella|parada/i.test(t)) return 'Espera';
  if (/error|falla|defect|equivocad|mala calidad|rechaz/i.test(t)) return 'Defectos';
  if (/manual|duplicad|retrabajo|re-proces|doble/i.test(t)) return 'Sobreprocesamiento';
  if (/stock|inventario|exceso|almacen|sobrante/i.test(t)) return 'Inventario';
  if (/transporte|flete|desplazamiento|traslado|viaje/i.test(t)) return 'Transporte';
  if (/movimiento|caminata|ergonom/i.test(t)) return 'Movimiento';
  if (/sobreprodu|demasiado|anticipad/i.test(t)) return 'Sobreproducción';
  if (/talento|capacita|conocimiento|habilidad|personal/i.test(t)) return 'Talento';

  return 'Sin clasificar';
}

export interface ResultadoCapacidadProceso {
  media: number;
  desviacionEstandar: number;
  cp: number | null;
  cpk: number | null;
  pp: number | null;
  ppk: number | null;
  sigmaLevel: number | null;
  rangoTotal: number;
  totalMediciones: number;
}

export function calcularCapacidadProceso(
  mediciones: number[],
  lsl?: number | null,
  usl?: number | null
): ResultadoCapacidadProceso {
  if (!mediciones || mediciones.length === 0) {
    return {
      media: 0,
      desviacionEstandar: 0,
      cp: null,
      cpk: null,
      pp: null,
      ppk: null,
      sigmaLevel: null,
      rangoTotal: 0,
      totalMediciones: 0
    };
  }

  const n = mediciones.length;
  const media = mediciones.reduce((a, b) => a + b, 0) / n;

  // Desviación estándar muestral (s)
  const varianza = mediciones.reduce((acc, val) => acc + Math.pow(val - media, 2), 0) / (n > 1 ? n - 1 : 1);
  const s = Math.sqrt(varianza);

  const minVal = Math.min(...mediciones);
  const maxVal = Math.max(...mediciones);
  const rangoTotal = maxVal - minVal;

  let cp: number | null = null;
  let cpk: number | null = null;
  let sigmaLevel: number | null = null;

  if (s > 0) {
    if (lsl != null && usl != null && usl > lsl) {
      cp = (usl - lsl) / (6 * s);
      const cpu = (usl - media) / (3 * s);
      const cpl = (media - lsl) / (3 * s);
      cpk = Math.min(cpu, cpl);
    } else if (usl != null) {
      cpk = (usl - media) / (3 * s);
    } else if (lsl != null) {
      cpk = (media - lsl) / (3 * s);
    }

    if (cpk != null) {
      sigmaLevel = Math.max(0, cpk * 3 + 1.5);
    }
  }

  return {
    media,
    desviacionEstandar: s,
    cp,
    cpk,
    pp: cp, // Estimador largo plazo simplificado
    ppk: cpk,
    sigmaLevel,
    rangoTotal,
    totalMediciones: n
  };
}
