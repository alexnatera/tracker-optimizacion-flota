# Runbook de incidentes

Que hacer cuando algo se rompe. Cada seccion arranca por el sintoma que
vas a ver, no por la causa.

---

## "Publique y los usuarios siguen viendo la version vieja"

**Causa mas probable:** `version.json` y la constante `VERSION` de `sw.js`
quedaron desincronizados. El service worker sigue sirviendo desde el cache
viejo porque su nombre de cache no cambio. Es exactamente el mecanismo
detras de la regresion de la v1.5.4.

```bash
node scripts/release.mjs check
```

Si sale en rojo:

```bash
node scripts/release.mjs set <version-nueva>
git add version.json sw.js && git commit && git push
```

Si sale en verde, el problema es de cache de GitHub Pages: esperar unos
minutos y forzar recarga con Ctrl+Shift+R.

---

## "Publique una version rota y hay que volver atras"

**Opcion rapida (por usuario):** en la app, *Configuracion > Version y
actualizaciones > volver a la version original del archivo*.

**Opcion real (para todos):** revertir el commit y publicar. Ojo: la app
solo aplica versiones **estrictamente mas nuevas**, asi que no alcanza con
volver el numero atras: hay que subir uno nuevo con el contenido bueno.

```bash
git revert <sha-del-commit-malo>
node scripts/release.mjs bump patch    # ej. 1.6.1 con el contenido de 1.5.4
git push
```

- [ ] Abrir un caso `CI-###` en Mejora continua marcandolo como reincidencia
      si ya habia pasado antes

---

## "La app carga pero no muestra datos / no deja entrar"

Descartar de arriba hacia abajo:

1. **Supabase esta caido?** https://status.supabase.com
2. **El proyecto esta pausado?** Los proyectos del plan gratuito se pausan
   por inactividad. Dashboard de Supabase: el proyecto aparece como
   `PAUSED` y hay un boton para restaurarlo.
3. **Falla solo para una persona?** Probablemente su usuario esta
   `activo = false` o le falta el perfil en `public.usuarios`. Un admin lo
   revisa en Configuracion > Usuarios y roles.
4. **Falla para todos y Supabase esta bien?** Revisar la consola del
   navegador. Un error de RLS aparece como `new row violates row-level
   security policy` o devuelve listas vacias sin error.

---

## "Alguien no puede editar y deberia poder"

El permiso se aplica en la **base de datos**, no solo en la interfaz.

```sql
select id, email, nombre, rol, activo from usuarios where email = 'alguien@ejemplo.com';
```

- `rol` tiene que ser `admin` o `editor`
- `activo` tiene que ser `true`

Solo un admin puede cambiar el rol (lo impide el trigger `proteger_rol`).

---

## "GitHub Pages no actualiza"

1. Revisar la pestana **Actions** del repo: si el job `verificar` fallo,
   `publicar` no corre. Eso es intencional.
2. Si `verificar` fallo por el smoke test, descargar el artefacto
   `playwright-report` del run para ver la captura del fallo.
3. Si los dos jobs estan en verde y el sitio sigue viejo: Settings > Pages,
   confirmar que la fuente es GitHub Actions.

---

## "Se borraron datos por accidente"

1. **Ver que paso**: modulo Historial de cambios, o directamente:

   ```sql
   select * from historial
   where tabla = 'portafolio' and accion = 'elimino'
   order by ts desc limit 20;
   ```

   El historial guarda la fila completa en `antes` para los borrados
   (primeros 500 caracteres).

2. **Restaurar**: si es poco, se rehace a mano desde lo que guardo el
   historial. Si es mucho, usar point-in-time recovery de Supabase
   (Dashboard > Database > Backups).

> **Pendiente:** confirmar que el plan actual de Supabase tiene PITR
> habilitado y probar una restauracion una vez, para que no sea teorico.
> Esta en la Fase 1 del plan de profesionalizacion.

---

## "Hay que rotar la clave anonima de Supabase"

La clave anonima esta embebida en el HTML a proposito: esta disenada para
vivir en el navegador y el acceso real lo controlan el login y las
politicas RLS. Rotarla solo hace falta si se sospecha de un problema mayor.

1. Dashboard de Supabase > Settings > API > rotar
2. Reemplazar el valor en `app.html`, `index.html` y `mejora-continua.html`
3. `node scripts/release.mjs bump minor` y publicar

Las claves de servicio (`service_role`) **nunca** van en el repo.

---

## Contactos

| Que | Donde |
| --- | --- |
| Estado de Supabase | https://status.supabase.com |
| Estado de GitHub | https://www.githubstatus.com |
| Dashboard del proyecto | Supabase, proyecto "Tracker Optimizacion" |
| Sitio publicado | https://alexnatera.github.io/tracker-optimizacion-flota/ |
