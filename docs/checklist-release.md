# Checklist de publicacion

Antes de publicar una version nueva. La mayoria ya la verifica el CI
automaticamente; lo que queda a mano es lo que una maquina no puede juzgar.

## 1. Antes de tocar nada

- [ ] El cambio tiene un caso `CI-###` abierto en **Mejora continua**
- [ ] Ese caso tiene causa raiz documentada (no solo el sintoma)
- [ ] Esta claro que accion de control evita que vuelva a pasar

## 2. Subir la version

```bash
node scripts/release.mjs bump patch    # o minor / major
# reemplazar app.html e index.html con el bundle nuevo
node scripts/release.mjs check         # tiene que salir en verde
```

- [ ] `version.json` y la constante `VERSION` de `sw.js` coinciden
- [ ] `app.html` e `index.html` son el bundle nuevo, no el anterior
- [ ] Las notas de `version.json` describen el cambio en una frase

## 3. Verificacion automatica

- [ ] `npm run check` pasa
- [ ] `npm run smoke` pasa (o el CI esta en verde en el PR)

## 4. Verificacion a mano: movil real

Esto es lo que el CI **no** puede juzgar por vos. El 5 de agosto salieron
cuatro parches seguidos (v1.3.0 a v1.4.2) por cosas que solo se ven en un
telefono de verdad.

Abrir la app en un telefono real (no solo el emulador del navegador) y
verificar en un ancho de 375-430 px:

- [ ] No hay scroll horizontal en ninguna pestana
- [ ] El menu inferior de pestanas se ve completo, sin cortarse
- [ ] La barra superior con el titulo y el estado de conexion entra en una linea
- [ ] Las filas de tabla se ven como fichas con etiqueta por campo
- [ ] Las fichas de detalle y los asistentes ocupan la pantalla completa
- [ ] La pantalla de carga no se superpone con el contenido
- [ ] El modo oscuro del sistema no rompe los colores (Chrome/Android fuerza oscuro)
- [ ] Los porcentajes de la matriz de actividades se leen enteros

## 5. Verificacion funcional minima

Con una cuenta **editor**:

- [ ] Crear y borrar un registro de prueba en un modulo
- [ ] Exportar un CSV

Con una cuenta **lector**:

- [ ] Puede ver los modulos
- [ ] **No** puede editar ni crear (los botones estan deshabilitados y,
      si se fuerza, la base lo rechaza)

## 6. Despues de publicar

- [ ] Abrir la app publicada y confirmar que ofrece la actualizacion
- [ ] Aceptar la actualizacion y confirmar que la version nueva carga
- [ ] Mover el caso `CI-###` a **Controlar** o **Cerrado** con la accion
      de control completada

## Si algo salio mal

Ver [runbook.md](runbook.md).
