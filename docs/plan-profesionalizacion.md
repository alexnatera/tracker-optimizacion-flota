# Plan de profesionalización y escalabilidad — OPTRACKER

Repositorio: `alexnatera/tracker-optimizacion-flota`
Base: auditoría Lean/Six Sigma del 6 de agosto de 2026 + historial de 56 commits desde la creación del repo.

Principio general: no se toca el modelo de datos ni el alcance de módulos, que están bien
resueltos. Todo lo de este plan es proceso, seguridad y capacidad de crecer sin que la
velocidad actual siga generando regresiones como la de v1.5.4.

Cada punto marcado con **[CI-###]** ya quedó cargado como caso real en el módulo
**Mejora continua** de la propia app (`mejora-continua.html`), para no romper la regla que
le pusimos al asistente: ningún problema se resuelve sin pasar por Definir → Medir →
Analizar → Mejorar → Controlar.

---

## Fase 0 — Proceso de release (mayor impacto, menor esfuerzo)

Esta fase ataca la causa raíz real detrás de la regresión de v1.5.4: nada fuerza que los
cuatro archivos de una versión queden sincronizados, y nada verifica el resultado antes de
publicarlo.

1. **[CI-001] Build unificado.** Un script (`build.js` o similar) que genere `app.html`,
   `index.html`, `version.json` y la constante `VERSION` de `sw.js` a partir de una sola
   fuente, y falle si detecta que quedaron desincronizados. Reemplaza el ritual actual de
   4 commits manuales por versión.
2. **[CI-002] Smoke test antes de publicar.** Un script con Playwright (o similar) que
   abra la app, inicie sesión con una cuenta de prueba y confirme que los diez módulos
   renderizan sin error de consola. Se corre antes de cada deploy. Esto solo habría
   bastado para atrapar la pérdida del panel de notificaciones el mismo día que pasó, no
   al día siguiente.
3. **[CI-003] Sacar el arnés de preview del bundle de producción.** El HTML publicado
   arrastra el script de devtools/preview del editor con el que se generó (`omelette`,
   pantalla "Unpacking…", listener de `postMessage` con `eval`). No aporta nada al
   usuario final y pesa. Se limpia al armar el nuevo build script del punto 1.
4. **Pipeline en GitHub Actions.** Al hacer push a `main`: correr el build, correr el
   smoke test, y si todo pasa, publicar a GitHub Pages automáticamente. Saca a la persona
   del camino crítico de "acordarse de los 4 archivos".

## Fase 1 — Seguridad y gobierno de datos

5. **[CI-004] Versionar el esquema de Supabase como código.** Hoy las tablas, funciones y
   políticas RLS viven solo en el dashboard de Supabase — no son revisables ni quedan en
   el historial de git. Se propone una carpeta `supabase/migrations/` en el repo con el
   esquema actual como punto de partida, y de ahí en más todo cambio de esquema pasa por
   una migración versionada (ya se usó ese patrón al crear el módulo de Mejora continua).
6. **[CI-005] Resolver hallazgos pendientes del linter de seguridad de Supabase**
   (`get_advisors`): funciones anteriores a este plan sin `search_path` fijo
   (`set_codigo`, `tocar_updated_at`, `codigo_tarea`, `codigo_radar`, `codigo_viaje`,
   `set_codigo_portafolio`), la extensión `pg_net` instalada en el esquema `public` en vez
   de uno propio, y la protección de contraseñas filtradas (HaveIBeenPwned) desactivada en
   Auth. Ninguno es crítico hoy, pero son defectos de higiene baratos de cerrar.
7. **Checklist de RLS por tabla nueva.** Antes de publicar cualquier tabla nueva: RLS
   habilitado, política de `select`/`insert`/`update`/`delete` explícita, y una prueba con
   una cuenta `lector` confirmando que no puede escribir.
8. **Confirmar backups.** Verificar que el plan de Supabase tiene point-in-time recovery
   o backups automáticos activos, y probar una restauración al menos una vez para que no
   sea teórico.

## Fase 2 — Calidad y testing

9. Ampliar el smoke test de la Fase 0 a un set de pruebas funcionales por módulo: crear,
   editar, eliminar y exportar CSV en cada uno.
10. **Pruebas de RLS automatizadas**, no solo funcionales: confirmar con una cuenta de
    cada rol (admin/editor/lector) qué puede y qué no puede hacer cada uno, corriendo en
    CI y no solo verificado a mano una vez.
11. **[CI-006] Checklist de verificación en móvil real** (375–430px) antes de taggear una
    versión. El 5 de agosto salieron cuatro parches seguidos (v1.3.0 a v1.4.2) arreglando
    cosas que solo se notan en un teléfono.

## Fase 3 — Arquitectura y escalabilidad técnica

12. **Evaluar (no ejecutar todavía) migrar el bundle único a un proyecto con build real**
    (Vite u otro). No es urgente: el service worker cachea el archivo después de la
    primera carga y hoy funciona. Vale la pena medirlo cuando el archivo siga creciendo o
    cuando cueste más mantenerlo a mano que migrarlo.
13. **[CI-007] Plan de paginación/retención para tablas que van a crecer.**
    `historial` ya tiene 94 filas a los pocos días de uso real; sin paginación ni
    archivado, en un año puede ser un problema de performance y de ruido para encontrar
    algo. Portafolio, tareas y radar hoy son chicos pero conviene decidir el criterio
    (paginar, archivar por antigüedad, o ambos) antes de que sea necesario con urgencia.
14. **Revisar índices con `EXPLAIN ANALYZE`** en las consultas más frecuentes de cada
    módulo a medida que crece el volumen de datos (ya se agregaron índices para
    `mejora_continua`; el resto de las tablas no los necesita todavía con el volumen
    actual, pero conviene revisarlo cada tanto).

## Fase 4 — Observabilidad y soporte

15. **[CI-008] Logging de errores de cliente.** Hoy, si algo falla en el navegador de
    quien usa la app, nadie se entera salvo que esa persona lo reporte a mano. Conectar un
    log mínimo (a una tabla de Supabase o a un servicio externo) para errores no
    capturados de JS.
16. **Panel de salud simple**: último deploy, versión activa, usuarios conectados,
    errores recientes de las últimas 24h. Puede vivir como una vista más dentro de
    Configuración.
17. **Runbook de incidentes básico**: qué hacer si Supabase cae, si GitHub Pages no
    actualiza, y cómo volver a la versión anterior (`app.html` ya lo permite desde
    Configuración → Versión y actualizaciones; falta documentar el paso a paso).

## Fase 5 — Gobierno de cambios (ya operativo, falta consolidar el hábito)

18. Usar el módulo de Mejora continua como puerta de entrada obligatoria: ningún cambio o
    fix se publica sin un caso `CI-###` con causa raíz y acción de control documentadas.
19. Revisión mensual de los KPIs del propio módulo (vencidos, % de reincidencia, ciclo
    promedio) como ritual real de mejora continua, no como herramienta que existe pero no
    se mira.

---

## Cómo priorizar

| Fase | Esfuerzo | Impacto | Cuándo |
| --- | --- | --- | --- |
| 0 — Proceso de release | Bajo | Alto | Ya (evita la próxima regresión) |
| 1 — Seguridad y gobierno de datos | Bajo–medio | Alto | Ya / próximas 2 semanas |
| 2 — Calidad y testing | Medio | Alto | Después de la Fase 0 |
| 3 — Arquitectura y escalabilidad | Medio–alto | Medio | Cuando el volumen lo pida, no antes |
| 4 — Observabilidad | Bajo–medio | Medio | En paralelo con Fase 1–2 |
| 5 — Gobierno de cambios | Bajo (ya existe) | Alto a largo plazo | Continuo desde ahora |

La Fase 3 es la única que conviene posponer a propósito: es la más cara y la app no la
necesita todavía. Todo lo demás es barato y cierra huecos reales que ya se vieron en la
práctica (la regresión de v1.5.4, los cuatro hotfixes de mobile, las políticas RLS sin
versionar).
