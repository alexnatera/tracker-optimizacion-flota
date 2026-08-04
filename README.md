# Tracker de Optimizacion de Flota

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

## Notas

La clave anonima de Supabase esta incluida en el archivo: esta disenada para vivir en el
navegador y el acceso real lo controlan el inicio de sesion y las politicas de seguridad
por fila. Las claves de servicio nunca se publican aqui.
