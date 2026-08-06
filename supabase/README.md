# Esquema de la base (Supabase)

Estas migraciones son la fuente de verdad del esquema. Antes existia solo
en el dashboard de Supabase: no se podia revisar en un pull request, no
quedaba en el historial de git y un cambio accidental no dejaba rastro.

## Archivos

| Archivo | Que contiene |
| --- | --- |
| `0001_baseline.sql` | Linea base: 15 tablas, funciones, triggers y las 50 politicas RLS, tal como estaban el 2026-08-06 |
| `0002_mejora_continua.sql` | Logica del asistente Lean/Six Sigma: codigo `CI-###`, sugerencia de desperdicio, fecha objetivo por severidad, listas y vista de KPIs |
| `0003_search_path.sql` | Fija `search_path` en las funciones anteriores al versionado (CI-005) |

El baseline **no se ejecuta sobre la base actual**: ya esta aplicado. Sirve
para revisar seguridad en un PR y para levantar un entorno de pruebas desde
cero.

## Reglas

1. **Todo cambio de esquema va como una migracion nueva.** Nada de editar
   tablas o politicas a mano en el dashboard: se pierde el rastro.
2. **Numeracion correlativa**: `0004_`, `0005_`, etc. Nombre corto y
   descriptivo en snake_case.
3. **Cada migracion es idempotente donde se pueda** (`if not exists`,
   `create or replace`), para poder re-correrla sin romper nada.
4. **El orden dentro de un archivo importa.** `es_admin()` y
   `puede_editar()` son funciones SQL (no plpgsql): Postgres valida su
   cuerpo al crearlas, asi que la tabla `usuarios` tiene que existir
   antes. Este error se detecto al validar el baseline por primera vez.

## Checklist para una tabla nueva

Antes de dar por cerrada una migracion que agrega una tabla:

- [ ] `alter table ... enable row level security`
- [ ] Politica explicita de `select`, `insert`, `update` y `delete`
      (una tabla con RLS activo y sin politicas es inaccesible; eso es
      correcto solo si es intencional, como `secretos`)
- [ ] Trigger de `registrar_historial()` si es una tabla de datos que
      alguien va a editar
- [ ] Trigger de `tocar_updated_at()` si tiene columna `updated_at`
- [ ] Probado con una cuenta `lector`: puede leer y NO puede escribir
- [ ] `get_advisors` (linter de seguridad) sin hallazgos nuevos

## Como validar una migracion antes de aplicarla

El baseline se valido ejecutandolo completo contra un esquema descartable
y comparando el resultado con produccion:

```sql
create schema bl_test;
-- ... ejecutar la migracion con public. reemplazado por bl_test.
select
  (select count(*) from pg_tables   where schemaname='bl_test') as tablas,
  (select count(*) from pg_policies where schemaname='bl_test') as politicas;
drop schema bl_test cascade;
```

Ese ejercicio encontro un error real de ordenamiento que habria hecho
fallar la reconstruccion desde cero.

## Hallazgos de seguridad aceptados a proposito

El linter (`get_advisors`) reporta tres cosas que se decidio **no** cambiar,
con motivo:

- **`secretos` con RLS y sin politicas** (INFO). Es intencional: nada del
  cliente debe poder leer esa tabla. Una tabla con RLS activo y sin
  politicas es inaccesible por diseno.
- **`pg_net` instalado en el esquema `public`** (WARN). Lo instala y
  administra Supabase. Moverlo puede romper funcionalidad de la
  plataforma y el beneficio es cosmetico.
- **Funciones `SECURITY DEFINER` invocables por RPC** (WARN):
  `es_admin()`, `puede_editar()`, `registrar_historial()`,
  `crear_perfil()`, `proteger_rol()`. Las tres ultimas son funciones de
  trigger: llamarlas por RPC falla de inmediato porque no hay contexto de
  trigger. Las dos primeras solo revelan si *vos mismo* sos admin o
  editor. Revocar `EXECUTE` cerraria el aviso, pero el riesgo de romper
  los triggers en produccion es mayor que el beneficio. Se revisa si
  alguna vez se agrega una funcion `SECURITY DEFINER` que si exponga algo.

Pendiente de habilitar a mano en el dashboard (no se puede por migracion):
**proteccion de contrasenas filtradas** (HaveIBeenPwned) en Auth >
Passwords.
