# Estado del proyecto y proximos pasos

Punto de entrada para retomar el trabajo. Ultima actualizacion: 2026-08-06,
app en **v1.6.1**.

> **Si sos una IA que retoma esto**, lee en este orden:
> 1. Este documento (donde estamos)
> 2. `ARQUITECTURA.md` (**obligatorio** antes de tocar `app.html`/`index.html`)
> 3. `roadmap-mejora-continua.md` o `migracion-vite.md`, segun que sigas

---

## En una frase

App de gestion de iniciativas de optimizacion de flota, funcionando en
produccion, con el proceso de publicacion ya profesionalizado. Falta convertir
el modulo de Mejora continua en un asistente DMAIC de verdad, y esta decidido
migrar la app a un proyecto con build real.

- **Sitio**: https://alexnatera.github.io/tracker-optimizacion-flota/
- **Base**: Supabase `wdflkqsiompjpyrihske`, plan gratuito

---

## Lo que se hizo (2026-08-06)

### Proceso de publicacion
- `scripts/release.mjs`: sincroniza la version en sus **cuatro** ubicaciones y
  corta el deploy si no coinciden. Probado con 11 casos
- `tests/smoke.spec.mjs`: smoke test de Playwright
- `.github/workflows/ci.yml`: `publicar` depende de `verificar`
- `package-lock.json`: dependencias fijadas, `npm ci` verificado

### Base de datos
- Esquema versionado en `supabase/migrations/`. El baseline se valido
  ejecutandolo contra un esquema descartable: reprodujo 15 tablas y 50
  politicas, identico a produccion
- `search_path` fijado en las 6 funciones que no lo tenian
- **Tabla `notificaciones` creada**: la app la consultaba desde la v1.2 y nunca
  habia existido. Por eso el panel siempre se veia vacio

### App
- Modulo Mejora continua con tablero DMAIC (hoy embebido con iframe)
- Iconos del menu a 18 px; rehechos Resumen, Contactos, Visitas, Configuracion
- `<title>OPTRACKER</title>` (venia vacio)

### Gobierno
- 9 casos `CI-###` cargados en el propio modulo, con causa raiz y accion de
  control documentadas

---

## Incidentes de esta jornada

**`CI-009` — bucle de recarga infinito (Critico).** Al publicar la v1.6.0 se
actualizo la version en 3 de sus 4 ubicaciones. La app compara `version.json`
contra su constante interna: como el bundle descargado seguia diciendo 1.5.4,
al recargar se volvia a ver desactualizado y repetia sin fin. Ventana de
impacto ~40 min. Marcado como **reincidencia de `CI-001`**, porque ese caso se
habia dado por controlado cubriendo solo 3 de las 4 copias.

Control aplicado: `release.mjs` ahora lee la constante de dentro del bundle y
falla si no coincide. Probado con los dos casos.

**Publicacion fantasma.** Los cambios del menu se aplicaron en memoria pero
nunca llegaron al archivo, porque el script codificaba el resultado antes de
terminar los reemplazos. La senal estaba a la vista (el archivo pesaba lo
mismo) y no se miro. Leccion: **verificar releyendo el archivo escrito**, no la
variable.

---

## Que sigue

### Ahora mismo, sin dependencias

- [ ] Cargar los secrets `OPTRACKER_TEST_EMAIL` / `OPTRACKER_TEST_PASSWORD`
      en Settings > Secrets and variables > Actions. La cuenta
      `smoke-test@optracker.local` ya existe con rol lector y esta verificada.
      **Sin esto el CI no prueba nada con sesion iniciada**
- [ ] Verificar a ojo que Mejora continua aparezca bien en el menu: se publico
      sin poder probarlo con sesion iniciada
- [ ] Confirmar que Supabase tiene backups y probar una restauracion

### Deuda del bundle (`ARQUITECTURA.md` seccion 6)

- [ ] Sacar el arnes de preview de Claude Design (caso `CI-003`)
- [ ] Agrupar el menu: TRABAJO / FILIALES / EQUIPO / SISTEMA
- [ ] Fusionar Matriz+Equipo y Radar+Contactos
- [ ] Agregar `mejora` a `MODULOS_REP` para poder exportarlo
- [ ] Paginacion o archivado de `historial` (caso `CI-007`)
- [ ] Registro de errores de cliente (caso `CI-008`)

### Las dos lineas grandes

**Modulo DMAIC completo** — `roadmap-mejora-continua.md`. Asistente guiado con
gating por fase, Project Charter, calculadoras de capacidad (Cp/Cpk/Pp/Ppk),
graficos de control con reglas de Nelson, y exportacion a informe DMAIC y A3.
Incluye el modelo de datos completo y las formulas.

**Migracion a Vite** — `migracion-vite.md`. Decidida, no empezada. Salir del
bundle generado hacia un proyecto con componentes, tipos y tests.

**Orden recomendado**: hacer la migracion primero y el modulo DMAIC despues,
para no escribir dos veces la misma vista. Si se necesita el DMAIC antes de
poder migrar, hacerlo en `mejora-continua.html` (que es un archivo normal y
facil de tocar) y portarlo despues.

---

## Como se trabaja aca

- Todo cambio entra por el modulo **Mejora continua** con un caso `CI-###`, con
  causa raiz y accion de control. No se cierra un caso sin decir que evita que
  vuelva a pasar
- Todo cambio de esquema va como migracion numerada en `supabase/migrations/`.
  Nada de editar en el dashboard
- Nada se publica sin verificar. Para el bundle, eso significa **abrirlo en un
  navegador de verdad** (receta en `ARQUITECTURA.md` seccion 5)
- Los reemplazos sobre el bundle van asertados: si el texto viejo no aparece
  las veces esperadas, el script aborta sin escribir

## Mapa de la documentacion

| Documento | Para que |
| --- | --- |
| `ARQUITECTURA.md` | Como esta armada la app y como editarla sin romperla |
| `roadmap-mejora-continua.md` | Especificacion del modulo DMAIC |
| `migracion-vite.md` | Plan de la reescritura |
| `plan-profesionalizacion.md` | Plan Lean/Six Sigma original, por fases |
| `checklist-release.md` | Que verificar antes de publicar |
| `runbook.md` | Que hacer cuando algo se rompe |
| `../supabase/README.md` | Reglas del esquema y hallazgos de seguridad |
