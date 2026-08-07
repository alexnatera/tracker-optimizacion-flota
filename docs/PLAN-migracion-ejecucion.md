# PLAN DE MIGRACIÓN Y EJECUCIÓN: OPTRACKER (Vite + React + TS)

**Fecha:** 2026-08-06  
**Repositorio:** `alexnatera/tracker-optimizacion-flota`  
**Directorio de trabajo:** `/root/opttracker-work`  
**Meta:** Migración autónoma completa desde el monolito `app.html` (~693KB) a **Vite + React + TypeScript + Vitest + PWA**, desplegado en GitHub Pages y conectado a Supabase Cloud.

---

## 🎯 Estrategia General

1. **Arquitectura:** SPA basada en estado local (`useState` / React Context) sin cambio de ruta URL, garantizando 100% compatibilidad con GitHub Pages sin errores 404 al refrescar (F5).
2. **Base de Datos & Auth:** Cero cambios en Supabase PostgreSQL. Conexión segura usando `@supabase/supabase-js` con `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
3. **Calidad & Metodología:** 
   - TDD (Red-Green-Refactor) con **Vitest** en las librerías estadísticas, de capacidad y límites de control (`lib/`).
   - Verificación continua con `npm run typecheck`, `npm test` y `npm run build`.
   - CI/CD automatizado vía GitHub Actions (`deploy.yml`) inyectando secrets y generando `.nojekyll`.
4. **Ejecución por Fases:** Commits y push a `main` tras completar y verificar cada fase.

---

## 📋 FASES DE EJECUCIÓN

### FASE 1: Andamiaje de Proyecto Vite + React + TS + PWA + CI/CD
- [ ] Configurar `package.json` con Vite, React 18, TypeScript, Vitest, `@supabase/supabase-js`, `vite-plugin-pwa`, `lucide-react`, `terser`.
- [ ] Crear `vite.config.ts` con `base: '/tracker-optimizacion-flota/'`, alias `@/`, `VitePWA` manifest y workbox setup.
- [ ] Crear `tsconfig.json` y `tsconfig.node.json` para tipado estricto.
- [ ] Definir variables de entorno en `.env` (Supabase URL & Anon Key).
- [ ] Crear cliente Supabase en `src/lib/supabase.ts`.
- [ ] Definir interfaces TypeScript de todas las tablas (15 entidades) en `src/tipos/database.ts`.
- [ ] Configurar `.github/workflows/deploy.yml` con `.nojekyll` y secretos de Supabase.
- [ ] **Verificación Phase 1:** `npm run typecheck` + `npm run build`. Commit + Push.

### FASE 2: Motor de Dominio y Estadístico con TDD (Vitest)
- [ ] Escribir suite de pruebas `src/lib/__tests__/capacidad.test.ts` (cálculo de horas, participaciones, % dedicación y semáforos).
- [ ] Implementar `src/lib/capacidad.ts`.
- [ ] Escribir suite de pruebas `src/lib/__tests__/control.test.ts` (constantes d2/A2/D3/D4, límites de control I-MR, 8 reglas de Nelson).
- [ ] Implementar `src/lib/control.ts`.
- [ ] Escribir suite de pruebas `src/lib/__tests__/dmaic.test.ts` (cálculo de Cp, Cpk, Pp, Ppk, Nivel Sigma, clasificación TIMWOODS).
- [ ] Implementar `src/lib/dmaic.ts`.
- [ ] Implementar `src/lib/formato.ts` (monedas, fechas, badges, colores semáforo).
- [ ] **Verificación Phase 2:** `npm test` (100% pasando). Commit + Push.

### FASE 3: UI System, Layout & Módulos Funcionales
- [ ] Diseñar Design System CSS (`src/index.css`) con tema oscuro Glassmorphism premium, gradientes y animaciones.
- [ ] Crear componentes UI base: `Layout.tsx`, `Sidebar.tsx`, `Header.tsx`, `Modal.tsx`, `Tabla.tsx`, `Ficha.tsx`, `Notificaciones.tsx`.
- [ ] Migrar e integrar los 10 módulos funcionales:
  1. `Resumen` (Dashboard de flota, KPIs globales, tareas asignadas, alertas semáforo).
  2. `Portafolio` (Iniciativas `OPT-###`, fases, porcentaje avance, base/objetivo/actual).
  3. `Tareas` (Seguimiento `TAR-###`, responsable, vinculado a iniciativa).
  4. `Radar` (Indicadores por País `RAD-###`, umbrales amarillo/rojo, estado operativo).
  5. `Contactos` (Directorio operativo por filial).
  6. `Visitas` (Calendario `VJ-###`, logística de viajes, hoteles, vuelos, viáticos).
  7. `Equipo` (Matriz de dedicate por persona y mes, capacidad disponible).
  8. `Historial` (Log inmutable de auditoría con diff de campos).
  9. `Ajustes` (Perfiles, roles RLS, `config_listas` dinámicas).
  10. `Mejora DMAIC` (Incidentes `CI-###`, Project Charter, clasificador TIMWOODS, gráficos de control I-MR SVG, calculadora de capacidad Cp/Cpk).
- [ ] **Verificación Phase 3:** `npm run typecheck` + `npm run build`. Commit + Push.

### FASE 4: Verificación Integral, Smoke Test & Reporte Final
- [ ] Ejecutar `npm run typecheck` sin errores.
- [ ] Ejecutar `npm test` con todas las suites pasando.
- [ ] Ejecutar `npm run build` y validar carpeta `dist/` (incluyendo `.nojekyll`).
- [ ] Probar servidor local (`vite preview`) mediante smoke test.
- [ ] Crear informe final en `docs/REPORTE-migracion.md`.
- [ ] Commit final y Push a `main`.

---
*Plan de Ejecución listo para inicio inmediato.*
