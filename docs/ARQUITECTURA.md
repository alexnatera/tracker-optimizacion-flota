# Arquitectura de OPTRACKER

Documento de traspaso. Recoge lo que hay que saber para tocar esta app sin
romperla. Escrito el 2026-08-06, con la app en la v1.6.1.

> Si vas a modificar `app.html` o `index.html`, lee la seccion
> **"Editar el bundle sin romperlo"** completa antes de tocar nada. Hay al
> menos tres formas de romperlo que ya nos pasaron.

---

## 1. Que es cada archivo

| Archivo | Que es |
| --- | --- |
| `app.html`, `index.html` | La aplicacion entera. ~693 KB. Son el mismo contenido; `index.html` es el que sirve GitHub Pages, `app.html` el que se descarga suelto |
| `mejora-continua.html` | Modulo Lean/Six Sigma. Pagina aparte, 19 KB, escrita a mano. Hoy se embebe en la app con un iframe (ver seccion 6) |
| `version.json` | Version publicada. La app la consulta para autoactualizarse |
| `sw.js` | Service worker: cachea el shell, red-primero para la app |
| `manifest.webmanifest` | Manifiesto PWA |
| `scripts/release.mjs` | Sincroniza la version en sus **cuatro** ubicaciones y corta el deploy si no coinciden |
| `tests/smoke.spec.mjs` | Smoke test de Playwright |
| `supabase/migrations/` | Esquema de la base como codigo. Fuente de verdad |
| `.github/workflows/ci.yml` | Verifica y publica. `publicar` depende de `verificar` |

**`app.html`/`index.html` ya NO se regeneran.** Antes salian de Claude Design;
desde el 2026-08-06 el repositorio es la fuente de verdad y se editan aca.

---

## 2. Como esta armado el bundle

No es HTML plano. Es un contenedor que trae los assets embebidos y el HTML
real **codificado como JSON dentro de una etiqueta script**:

```
<script type="__bundler/manifest">    { uuid: {mime, data(base64, gzip)} }
<script type="__bundler/ext_resources">
<script type="__bundler/page_order">
<script type="__bundler/template">    "<!DOCTYPE html>\n<html>..."   <-- el HTML real, como string JSON
```

Al cargar, un script de arranque desempaqueta los assets a blobs, sustituye
los uuid en el template y reemplaza `document.documentElement`.

Dentro del template hay dos partes:

- `<x-dc>` — el markup, en el lenguaje de plantillas de Claude Design
  (`<sc-if>`, `<sc-for>`, `{{ variable }}`, `sc-camel-on-click`)
- `<script type="text/x-dc" data-dc-script>` — la logica: una clase con
  estado, metodos y un viewmodel que alimenta al markup

### El lenguaje de plantillas

Observado, no documentado:

```html
<sc-if value="{{ esPortafolio }}"> ... </sc-if>
<sc-for list="{{ notiLista }}" as="n"> {{ n.mensaje }} </sc-for>
<button data-act="notiIr" sc-camel-on-click="{{ onClick }}">
<sc-raw-table> <sc-raw-tr> <sc-raw-td>   <!-- tablas -->
```

Cada vista tiene su propio bloque de markup a medida. **No hay renderizador
generico**: agregar un modulo implica escribir su markup entero.

### Constantes clave (dentro del script x-dc)

| Constante | Para que |
| --- | --- |
| `MENU` | Entradas del menu: `{ id, label }` |
| `VISTAS` | Titulo y bajada de cada vista: `id: [titulo, descripcion]` |
| `ICONOS` | Path SVG por modulo (viewBox 24x24) |
| `COLORES` | Color de acento por modulo |
| `PRIMARIAS` | Los 4 modulos con pestana propia en movil; el resto va en "mas" |
| `CORTAS` | Etiqueta corta para la barra inferior |
| `TABLAS` | Modulo -> tabla de Supabase |
| `MODULOS_REP` | Modulos exportables como reporte |
| `VERSION` | **Version incrustada. Ver seccion 4** |

El viewmodel expone banderas `esX` por vista:

```js
esHistorial: v === "historial",
esMejora:    v === "mejora",
```

Y el markup las consume con `<sc-if value="{{ esMejora }}">`.

---

## 3. Editar el bundle sin romperlo

### Receta

```python
import re, json
s = open('index.html', encoding='utf-8').read()
m = re.search(r'(<script type="__bundler/template">)(.*?)(</script>)', s, re.S)
tpl = json.loads(m.group(2))          # HTML real

# ... modificar tpl con reemplazos EXACTOS y asertados ...

# CRITICO: json.dumps deja "</script>" literal y eso cierra la etiqueta
# antes de tiempo. El bundler original lo escapa. Hay que replicarlo:
codificado = json.dumps(tpl).replace('</', '<\\/')
nuevo = s[:m.start(2)] + codificado + s[m.end(2):]
open('index.html', 'w', encoding='utf-8').write(nuevo)
```

### Las tres formas de romperlo que ya nos pasaron

**1. No escapar `</`.** Si escribis el JSON sin convertir `</` en `<\/`, el
navegador cierra la etiqueta script al primer `</script>` que haya dentro del
template. Sintoma: `Error unpacking: Unterminated string in JSON`.

**2. Codificar antes de terminar los reemplazos.** Si la linea
`codificado = json.dumps(tpl)` queda *antes* de algun reemplazo, ese cambio se
aplica en memoria y nunca llega al archivo. Sintoma silencioso: el archivo
pesa lo mismo que antes. **Siempre verifica releyendo el archivo escrito**, no
la variable:

```python
leido = open('index.html', encoding='utf-8').read()
t2 = json.loads(re.search(r'<script type="__bundler/template">(.*?)</script>', leido, re.S).group(1))
assert 'lo que agregaste' in t2
```

**3. Olvidar la constante VERSION.** Ver seccion 4. Deja la app en bucle de
recarga infinito.

### Reglas

- Reemplazos **exactos y asertados**: verifica que el texto viejo aparezca
  exactamente N veces antes de sustituir, y aborta si no. Nunca escribas un
  archivo a medias.
- Comprueba que el manifiesto de assets quede intacto (comparalo antes/despues).
- Verifica en un navegador de verdad antes de publicar (seccion 5).

---

## 4. La version vive en CUATRO lugares

Esto causo una caida real el 2026-08-06 (caso `CI-009`):

1. `version.json` -> campo `version`
2. `sw.js` -> `const VERSION = '1.6.1'`
3. `app.html` -> `const VERSION = "1.6.1"` **dentro del template**
4. `index.html` -> idem

La app compara `version.json` contra su **constante interna**. Si la constante
queda atras: se ve desactualizada, aplica la version nueva, recarga, se vuelve
a ver desactualizada... y no para nunca.

Ojo: dentro del bundle la constante esta JSON-escapada, o sea que en el archivo
crudo se lee `const VERSION = \"1.6.1\"`. Cualquier regex tiene que contemplar
la barra invertida opcional.

**Usa siempre el script; no toques las versiones a mano:**

```bash
node scripts/release.mjs check       # falla si los 4 no coinciden
node scripts/release.mjs bump patch  # los actualiza los 4
```

---

## 5. Probar en un navegador de verdad

Sin esto no se publica. Detecto los dos bugs de arriba antes de que llegaran a
produccion.

```bash
mkdir -p /tmp/hz && cd /tmp/hz && npm init -y
npm i playwright && npx playwright install chromium
```

El verificador levanta un servidor estatico con el archivo, lo abre en
chromium headless y revisa:

- que el bundle se desempaquete (sin banner `__bundler_err`)
- que no haya errores de consola propios (filtrando el ruido de red: supabase,
  fuentes, sw.js, iconos)
- **cuantas veces navego el frame principal**: mas de 2 = bucle de recarga
- que `document.body.innerHTML` tenga un tamano razonable (~137 KB en el login)

El sandbox no llega a Supabase, asi que solo se verifica la pantalla de login.
**Con sesion iniciada no se pudo probar todavia** — es la principal laguna de
verificacion que queda.

---

## 6. Estado al 2026-08-06 (v1.6.1)

### Hecho

- Esquema de Supabase versionado en `supabase/migrations/` (baseline validado
  ejecutandolo contra un esquema descartable: 15 tablas, 50 politicas)
- `search_path` fijado en las 6 funciones que no lo tenian
- Tabla `notificaciones` creada: **la app la consultaba desde la v1.2 y nunca
  habia existido**, por eso el panel siempre se veia vacio
- Modulo Mejora continua con tablero DMAIC y los 9 casos `CI-###` cargados
- `release.mjs` + smoke test + CI en GitHub Actions
- Iconos del menu a 18 px; rehechos los de Resumen, Contactos, Visitas y
  Configuracion
- `<title>OPTRACKER</title>` (venia vacio)

### Deuda conocida

- **Mejora continua esta embebido con un iframe**, no es nativo. Fue una
  decision de riesgo cuando no habia forma de probar el bundle; hoy esa razon
  ya no aplica y hay que hacerlo nativo. Ver `roadmap-mejora-continua.md`
- El bundle arrastra el arnes de preview de Claude Design (script con
  `postMessage` y `eval`, pantalla "Unpacking...", titulo "Bundled Page").
  Peso muerto: ya no se regenera desde ahi. Caso `CI-003`
- Sin verificacion con sesion iniciada en CI (faltan cargar los secrets
  `OPTRACKER_TEST_EMAIL` / `OPTRACKER_TEST_PASSWORD`)
- `MODULOS_REP` no incluye `mejora`: no se puede exportar como reporte
- Menu plano de 11 entradas. Se propuso agrupar en TRABAJO / FILIALES /
  EQUIPO / SISTEMA y fusionar Matriz+Equipo y Radar+Contactos. Sin hacer

---

## 7. Supabase

Proyecto `wdflkqsiompjpyrihske` ("Tracker Optimizacion"), plan **gratuito**
(por eso no se puede activar la proteccion de contrasenas filtradas).

Patron de RLS en los modulos de datos:

```sql
select                -> cualquier autenticado (incluye rol lector)
insert/update/delete  -> puede_editar()   -- admin o editor
```

Excepciones: `config_listas` y `ajustes` solo escribe admin; `historial` es
solo lectura (lo escriben los triggers); `notificaciones` cada quien ve solo
las suyas; `secretos` tiene RLS sin politicas a proposito (inaccesible);
`mejora_continua` solo la borra un admin.

Todas las tablas de datos tienen trigger de `registrar_historial()` y las que
tienen `updated_at`, de `tocar_updated_at()`.

Ver `supabase/README.md` para el checklist de tabla nueva y los hallazgos de
seguridad aceptados a proposito.

---

## 8. Publicar

```bash
node scripts/release.mjs bump patch   # o minor / major
node scripts/release.mjs check        # tiene que salir en verde
# verificar en navegador (seccion 5)
git commit && git push                # el CI corre y publica
```

Si el archivo es muy grande para subirlo por la API en una sola llamada,
se puede hacer desde un sandbox con `run_composio_tool` y el contenido en
base64, sin que el archivo pase por el contexto.

Checklist completo en `checklist-release.md`. Incidentes en `runbook.md`.
