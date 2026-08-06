# Migracion a un proyecto con build real

Decidido el 2026-08-06: se hace, pero **no todavia**. Este documento existe
para que quien lo retome no tenga que reconstruir el razonamiento.

## Por que

`app.html` e `index.html` son un bundle de ~693 KB generado por Claude Design,
que ya no se usa. Hoy se editan a mano con scripts de reemplazo sobre un JSON
incrustado. Eso funciona — se hicieron 7 ediciones exitosas — pero:

- El lenguaje de plantillas (`<sc-if>`, `<sc-for>`, `sc-camel-on-click`) **no
  esta documentado**. Todo lo que sabemos salio de leer el archivo
- Agregar un modulo implica escribir su markup entero; no hay componentes
  reutilizables ni renderizador generico
- No hay forma de ejecutar tests unitarios sobre la logica: esta toda dentro
  de un string JSON dentro de un HTML
- El diff de un cambio de una linea es ilegible en un pull request
- Ya hubo dos bugs causados por la mecanica de edicion, no por la logica
  (ver `ARQUITECTURA.md`, seccion 3)

El disparador definitivo es el modulo DMAIC: calculadoras, graficos de control
y exportacion son varios miles de lineas. Escribirlas en un lenguaje de
plantillas no documentado, dentro de un JSON, sin poder testearlas, seria
multiplicar el problema.

## Que NO cambia

- **Supabase**: el esquema, las politicas RLS y las migraciones se quedan
  igual. La base es la parte solida del sistema
- **El modelo de dominio**: los 10 modulos, los codigos `OPT-###` / `TAR-###` /
  `RAD-###` / `VJ-###` / `CI-###`, los roles, el historial
- **La forma de publicar**: sigue siendo GitHub Pages. `release.mjs` se
  simplifica (la version pasa a estar en un solo lugar, `package.json`)

## Estructura propuesta

```
src/
  main.tsx
  supabase.ts            cliente y tipos generados
  rutas.tsx
  componentes/           Tabla, Ficha, CargaCSV, Selector, Grafico...
  modulos/
    resumen/ portafolio/ tareas/ radar/ contactos/
    visitas/ equipo/ historial/ ajustes/
    mejora/              charter, wizard DMAIC, calculo, graficos, informes
  lib/
    capacidad.ts         Cp, Cpk, Pp, Ppk, nivel sigma
    control.ts           limites, constantes d2/A2/D3/D4, reglas de Nelson
    formato.ts
tests/                   unitarios de lib/ + smoke de Playwright
```

Vite con salida estatica. Sin framework de servidor: la app sigue siendo
100% cliente contra Supabase, que es lo que la hace simple de operar.

Los tipos de la base se generan con
`supabase gen types typescript` — deja de haber nombres de columna escritos a
mano en 20 lugares.

## Orden de migracion

La regla: **la app publicada nunca se rompe**. Se migra modulo por modulo.

1. Andamiaje: Vite, TypeScript, cliente de Supabase, login y layout con el
   menu. Se publica en una ruta aparte (`/nueva/`) sin tocar la actual
2. `lib/capacidad.ts` y `lib/control.ts` **con tests unitarios primero** — son
   pura funcion, se prestan a TDD y son lo que mas caro sale equivocar
3. Los modulos simples, que son casi la misma tabla: contactos, radar, tareas,
   personas
4. Los complejos: portafolio, visitas, matriz, resumen
5. El modulo DMAIC completo, ya nativo y con todo lo de
   `roadmap-mejora-continua.md`
6. Historial y configuracion
7. Cambiar la raiz de Pages a la app nueva; dejar la vieja accesible unas
   semanas en `/legacy/`
8. Borrar el bundle

## Que aprovechar del bundle actual

No hay que reinventar. Del archivo actual se pueden extraer tal cual:

- Los paths SVG de los iconos (`ICONOS`) y la paleta (`COLORES`)
- Los textos: `VISTAS`, las guias, los mensajes de ayuda
- La logica de negocio: calculo de carga por persona, semaforo del radar,
  avance por fase, generacion de codigos, plantillas de CSV
- El diseno responsive: el corte en 860 px, las filas que se vuelven fichas
- La hoja de impresion (los `data-noprint` ya estan puestos)

Conviene extraerlos a JSON/TS **antes** de empezar, en un solo paso, para no
ir copiando a mano modulo por modulo.

## Riesgos

- **Regresiones invisibles**: la app tiene 10 modulos con muchas reglas
  chicas (el calculo de carga, el semaforo, los descartes). Mitigacion:
  ampliar el smoke test a pruebas funcionales por modulo *antes* de migrar,
  para tener una red que corra contra las dos versiones
- **Migracion a medias**: es el riesgo real de estos proyectos. Mitigacion:
  orden estricto por modulo, con la app vieja funcionando hasta el final
- **Perder conocimiento del bundle**: por eso existe `ARQUITECTURA.md`

## Antes de empezar

- [ ] Cargar los secrets `OPTRACKER_TEST_EMAIL` / `OPTRACKER_TEST_PASSWORD`
      para que el CI verifique con sesion iniciada
- [ ] Ampliar el smoke test a pruebas funcionales por modulo (crear, editar,
      borrar, exportar CSV) — es la red de seguridad de toda la migracion
- [ ] Confirmar que Supabase tiene backups y probar una restauracion
- [ ] Extraer iconos, colores y textos del bundle a archivos aparte
