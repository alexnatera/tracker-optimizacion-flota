import React, { useState } from 'react';
import { MejoraContinua } from '../../tipos/database';
import { sugerirDesperdicioLean, calcularCapacidadProceso } from '../../lib/dmaic';
import { calcularLimitesControl, evaluarReglasNelson } from '../../lib/control';
import { obtenerBadgeEstado } from '../../lib/formato';
import { TrendingUp, AlertTriangle, Cpu, CheckCircle2, FileText, Sparkles, BarChart2 } from 'lucide-react';

interface ModuloMejoraProps {
  casosMejora: MejoraContinua[];
}

export const ModuloMejora: React.FC<ModuloMejoraProps> = ({ casosMejora }) => {
  const [casoSeleccionado, setCasoSeleccionado] = useState<MejoraContinua | null>(casosMejora[0] || null);
  const [textoPruebaTIMWOODS, setTextoPruebaTIMWOODS] = useState<string>('');

  const desperdicioSugerido = textoPruebaTIMWOODS ? sugerirDesperdicioLean(textoPruebaTIMWOODS) : null;

  // Ejemplo de datos I-MR para el caso activo
  const datosEjemploIMR = [10.2, 10.5, 9.8, 10.1, 10.4, 9.9, 10.3, 10.0, 10.2, 10.1, 10.6, 9.7];
  const limites = calcularLimitesControl(datosEjemploIMR);
  const violaciones = evaluarReglasNelson(datosEjemploIMR, limites.media, limites.sigma);

  const resCapacidad = calcularCapacidadProceso(datosEjemploIMR, casoSeleccionado?.lsl || 9.0, casoSeleccionado?.usl || 11.0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Lean Six Sigma */}
      <div className="glass-panel p-5 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-950/30 via-slate-900/60 to-cyan-950/30 flex items-center justify-between">
        <div>
          <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Asistente de Mejora Continua DMAIC (Lean Six Sigma)
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Definir → Medir → Analizar → Mejorar → Controlar | Gráficos SPC I-MR y Capacidad Cp/Cpk
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3">
          <div className="text-right">
            <span className="block text-[10px] text-slate-400 uppercase font-semibold">Casos Activos</span>
            <span className="text-xl font-extrabold text-purple-400">{casosMejora.length}</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Cases List & Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of CI-### cases */}
        <div className="glass-panel p-4 rounded-xl border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Incidentes & Casos CI-###</h4>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {casosMejora.map(c => {
              const badge = obtenerBadgeEstado(c.estado);
              const esSeleccionado = casoSeleccionado?.id === c.id;
              return (
                <div
                  key={c.id}
                  onClick={() => setCasoSeleccionado(c)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    esSeleccionado
                      ? 'bg-purple-950/40 border-purple-500/40 shadow-md shadow-purple-950/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-purple-400">{c.codigo}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.clase}`}>
                      {c.estado}
                    </span>
                  </div>
                  <h5 className="text-xs font-semibold text-slate-100 mt-1 truncate">{c.titulo}</h5>
                  <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                    <span>Desperdicio: <strong className="text-slate-300">{c.desperdicio_lean}</strong></span>
                    <span className="text-amber-400 font-semibold">{c.severidad}</span>
                  </div>
                </div>
              );
            })}

            {casosMejora.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No hay casos DMAIC registrados.</p>
            )}
          </div>

          {/* Classifier Helper Widget */}
          <div className="mt-4 p-3 bg-slate-950/80 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-purple-400" />
              Clasificador TIMWOODS IA
            </span>
            <input
              type="text"
              value={textoPruebaTIMWOODS}
              onChange={e => setTextoPruebaTIMWOODS(e.target.value)}
              placeholder="Describe un problema (ej: retraso en el reporte)..."
              className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500"
            />
            {desperdicioSugerido && (
              <div className="text-[11px] text-slate-300 pt-1">
                Sugerencia: <strong className="text-purple-400 font-semibold">{desperdicioSugerido}</strong>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Case Analysis & SPC Control Chart */}
        <div className="lg:col-span-2 space-y-4">
          {casoSeleccionado ? (
            <div className="glass-panel p-5 rounded-xl border border-slate-800 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono font-bold text-purple-400">{casoSeleccionado.codigo}</span>
                    <h3 className="text-base font-bold text-slate-100">{casoSeleccionado.titulo}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{casoSeleccionado.problema}</p>
                </div>
              </div>

              {/* DMAIC 5-Phases Pills */}
              <div className="grid grid-cols-5 gap-2">
                {['Definir', 'Medir', 'Analizar', 'Mejorar', 'Controlar'].map(fase => {
                  const esFaseActual = casoSeleccionado.estado === fase;
                  return (
                    <div
                      key={fase}
                      className={`p-2 rounded-lg text-center text-xs font-semibold border ${
                        esFaseActual
                          ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-950'
                          : 'bg-slate-900/60 text-slate-500 border-slate-800'
                      }`}
                    >
                      {fase}
                    </div>
                  );
                })}
              </div>

              {/* SPC Control Chart I-MR SVG Simulation */}
              <div className="p-4 bg-slate-950/90 rounded-lg border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    Gráfico de Control Estadístico I-MR (Individuos)
                  </span>
                  <div className="flex items-center gap-3 font-mono text-[10px]">
                    <span className="text-red-400">UCL: {limites.ucl.toFixed(2)}</span>
                    <span className="text-emerald-400">X-bar: {limites.media.toFixed(2)}</span>
                    <span className="text-red-400">LCL: {limites.lcl.toFixed(2)}</span>
                  </div>
                </div>

                {/* SVG Chart */}
                <div className="h-40 w-full relative flex items-center">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 400 120">
                    {/* Limits Lines */}
                    <line x1="0" y1="20" x2="400" y2="20" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1.5" />
                    <line x1="0" y1="60" x2="400" y2="60" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="0" y1="100" x2="400" y2="100" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1.5" />

                    {/* Data Points & Line */}
                    <polyline
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      points={datosEjemploIMR.map((val, i) => `${(i / (datosEjemploIMR.length - 1)) * 380 + 10},${100 - ((val - 9.0) / 2.0) * 80}`).join(' ')}
                    />
                    {datosEjemploIMR.map((val, i) => {
                      const cx = (i / (datosEjemploIMR.length - 1)) * 380 + 10;
                      const cy = 100 - ((val - 9.0) / 2.0) * 80;
                      return (
                        <circle key={i} cx={cx} cy={cy} r="4" fill="#06b6d4" className="hover:r-6 transition-all" />
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Process Capability Indices */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-900/80 rounded-lg border border-slate-800 text-center">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Índice Cp</span>
                  <span className="text-lg font-extrabold text-cyan-400">{resCapacidad.cp?.toFixed(2) || '1.33'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Índice Cpk</span>
                  <span className="text-lg font-extrabold text-emerald-400">{resCapacidad.cpk?.toFixed(2) || '1.25'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase">Nivel Sigma</span>
                  <span className="text-lg font-extrabold text-purple-400">σ {resCapacidad.sigmaLevel?.toFixed(1) || '4.2'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center text-slate-500 rounded-xl">
              Selecciona un caso DMAIC para ver su análisis detallado y gráfico de control.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
