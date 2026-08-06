# OPTRACKER

Portafolio de optimizacion, radar por pais, carga del equipo y planificacion de viajes.
Los datos viven en Supabase. La misma interfaz se adapta a escritorio y a telefono.

## Abrir la app

**En linea (recomendado):** https://alexnatera.github.io/tracker-optimizacion-flota/

**Instalar como aplicacion (PWA):**

- **Android / Chrome:** abre el enlace y elige *Instalar aplicacion* en el menu.
- **iPhone / Safari:** abre el enlace y usa *Compartir -> Anadir a pantalla de inicio*.
- **Windows / macOS / Chrome o Edge:** el icono de instalar aparece en la barra de direcciones.

Queda con su propio icono, sin barras del navegador, y sigue funcionando aunque la red
se caiga: la ultima version se guarda en el dispositivo y los datos se sincronizan al
volver la conexion.

**Archivo suelto:** descarga [app.html](app.html) y abrelo con doble clic. Necesita red
para el inicio de sesion y para leer y escribir los datos.

## Documentacion

Si vas a trabajar sobre este repositorio, arranca por
**[docs/ESTADO.md](docs/ESTADO.md)**: dice donde esta el proyecto, que se hizo
y por donde seguir.

| Documento | Para que |
| --- | --- |
| [ESTADO.md](docs/ESTADO.md) | Punto de entrada: estado actual y proximos pasos |
| [ARQUITECTURA.md](docs/ARQUITECTURA.md) | Como esta armada la app. **Obligatorio antes de tocar app.html o index.html** |
| [roadmap-mejora-continua.md](docs/roadmap-mejora-continua.md) | Especificacion del modulo DMAIC completo |
| [migracion-vite.md](docs/migracion-vite.md) | Plan de la reescritura a un proyecto con build real |
| [plan-profesionalizacion.md](docs/plan-profesionalizacion.md) | Plan Lean/Six Sigma por fases |
| [checklist-release.md](docs/checklist-release.md) | Que verificar antes de publicar |
| [runbook.md](docs/runbook.md) | Que hacer cuando algo se rompe |
| [supabase/README.md](supabase/README.md) | Reglas del esquema y seguridad |

> **Aviso**: la version vive en **cuatro** lugares (`version.json`, `sw.js`, y
> una constante dentro de `app.html` e `index.html`). Nunca las edites a mano:
> usa `node scripts/release.mjs bump patch`. Desincronizarlas deja la app en
> bucle de recarga infinito; ya paso una vez.

## Actualizaciones automaticas


No hace falta volver a descargar nada. La app consulta `version.json` al abrirse y, si hay
una version mas nueva, la descarga y la aplica. En **Configuracion -> Version y
actualizaciones** se puede forzar la busqueda o volver a la version original del archivo.
Solo se aplica una version estrictamente mas nueva, nunca una anterior.

Para publicar una version nueva:

1. Reemplaza `app.html` e `index.html` con el bundle nuevo.
2. Sube el numero en `version.json` y en la constante `VERSION` de `sw.js`.

## Modulos

| Modulo | Que resuelve |
| --- | --- |
| Resumen | Indicadores, alertas y datos por revisar |
| Matriz de actividades | Porcentaje de dedicacion por persona y mes, con calculo de carga |
| Portafolio | Iniciativas `OPT-###`, fases, metricas y avance |
| Tareas | Trabajo concreto `TAR-###` vinculado a cada iniciativa |
| Radar por pais | Senales `RAD-###` con umbral y semaforo automatico |
| Contactos por pais | Entry point de operaciones en cada filial |
| Calendario de visitas | Viajes `VJ-###`: planificador, calendario y etapas logisticas |
| Equipo y capacidad | Personas y horas disponibles por mes |
| Historial de cambios | Quien cambio que, cuando y con que valor anterior |
| Configuracion | Perfil, usuarios y roles, parametros, listas y conexion |
| [Mejora continua](mejora-continua.html) | Asistente Lean / Six Sigma: cada problema `CI-###` pasa por Definir, Medir, Analizar, Mejorar y Controlar antes de cerrarse |

## Mejora continua (Lean / Six Sigma)

`mejora-continua.html` es un modulo aparte que usa la misma base de Supabase (mismos
usuarios, mismos roles) pero vive en su propio archivo en vez de ir empaquetado dentro de
`app.html`. Es deliberado: `app.html`/`index.html` son un bundle grande y fragil de
sincronizar a mano (ver el historial de versiones), y este modulo se agrega y actualiza
sin tocar ese bundle ni arriesgar una regresion ahi.

Que hace:

- Cada problema reportado entra con estado `Definir` y un codigo `CI-###` automatico.
- Al guardar, un trigger en la base sugiere de que tipo de desperdicio Lean se trata
  (Defectos, Espera, Sobreproduccion, Sobreprocesamiento, Transporte, Inventario,
  Movimiento, Talento no utilizado) segun el texto del reporte. Es una sugerencia, no
  una clasificacion automatica definitiva: la persona la confirma o la corrige.
- La severidad fija una fecha objetivo sugerida (Critico +2 dias, Alto +7, Medio +15,
  Bajo +30) si no se define una a mano.
- No se puede avanzar a la fase Mejorar sin causa raiz documentada, ni cerrar el caso
  sin una accion de control — para que el registro quede como una mejora real y no
  como un "ya quedo" sin causa ni prevencion.
- Un panel de KPIs (abiertos, vencidos, % de reincidencia, ciclo promedio, % con causa
  raiz documentada) funciona como cuadro de control simple del propio proceso de
  mejora continua.
- Toda la clasificacion (severidad, tipo de desperdicio, metodo de analisis, modulos)
  se administra desde `config_listas`, igual que el resto de los modulos — no hace
  falta tocar codigo para agregar o renombrar una opcion.

## En el telefono

Por debajo de 860 px de ancho la interfaz cambia sola: menu inferior de pestanas, barra
superior con el titulo y el estado de conexion, las filas de tabla se vuelven fichas con
etiqueta por campo, y las fichas de detalle y los asistentes ocupan la pantalla completa.

## Permisos

Se aplican en la base de datos, no solo en la interfaz.

- **admin**: gestiona usuarios y roles, parametros, listas y la conexion.
- **editor**: edita todos los modulos.
- **lector**: consulta y exporta.

## Carga masiva

Cada modulo editable acepta carga por CSV. El boton *Cargar desde CSV* entrega la plantilla
del modulo con tres filas: los encabezados, una guia con los valores validos y un ejemplo.
Los identificadores se generan solos.

## Notes

La clave anonima de Supabase esta incluida en el archivo: esta disenada para vivin en el
navegador y el acceso real lo controla en el inicio de sesion y las politicas de seguridad
por fila. Las claves de servicio nunca se publican aqui.
