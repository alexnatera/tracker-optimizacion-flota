# Tracker de Optimizacion de Flota

Aplicacion HTML de una sola pieza para el portafolio de optimizacion, el radar por pais,
la carga del equipo y la planificacion de viajes. Los datos viven en Supabase.

## Como se usa

Descarga **[app.html](app.html)** y abrelo con doble clic. Necesita conexion de red
para el inicio de sesion y para leer y escribir los datos.

## Actualizaciones automaticas

No hace falta volver a descargar el archivo. Al abrirse consulta `version.json` en
este repositorio: si hay una version mas nueva la descarga, la guarda en el navegador
y la aplica. En **Configuracion -> Version y actualizaciones** se puede forzar la
busqueda o volver a la version original del archivo.

Para publicar una version nueva:

1. Reemplaza `app.html`.
2. Sube el numero en `version.json` y describe el cambio en `notas`.

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

## Permisos

Se aplican en la base de datos, no solo en la interfaz.

- **admin**: gestiona usuarios y roles, parametros, listas y la conexion.
- **editor**: edita todos los modulos.
- **lector**: consulta y exporta.

## Carga masiva

Cada modulo editable acepta carga por CSV. El boton *Cargar desde CSV* entrega la
plantilla del modulo con tres filas: los encabezados, una guia con los valores validos
y un ejemplo. Los identificadores se generan solos.

## Notas

La clave anonima de Supabase esta incluida en el archivo: esta disenada para vivir
en el navegador y el acceso real lo controlan el inicio de sesion y las politicas de
seguridad por fila. Las claves de servicio nunca se publican aqui.
