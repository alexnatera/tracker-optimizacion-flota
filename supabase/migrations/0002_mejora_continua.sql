-- =====================================================================
-- 0002 - Modulo "Mejora continua" (asistente Lean / Six Sigma)
-- Aplicado en produccion el 2026-08-06.
--
-- La tabla mejora_continua ya esta declarada en 0001_baseline.sql.
-- Esta migracion agrega la logica del asistente: codigo correlativo,
-- sugerencia de desperdicio Lean, fecha objetivo por severidad, cierre
-- automatico, listas de configuracion y la vista de KPIs.
-- =====================================================================

create index if not exists idx_mejora_continua_estado    on public.mejora_continua(estado);
create index if not exists idx_mejora_continua_severidad on public.mejora_continua(severidad);
create index if not exists idx_mejora_continua_modulo    on public.mejora_continua(modulo_origen);
create index if not exists idx_mejora_continua_vinculado on public.mejora_continua(vinculado_a);

comment on table public.mejora_continua is
  'Asistente Lean/Six Sigma: todo problema reportado pasa por DMAIC (campo estado) con desperdicio Lean sugerido automaticamente.';
comment on column public.mejora_continua.estado is
  'Fase DMAIC: Definir, Medir, Analizar, Mejorar, Controlar, Cerrado. Ver config_listas tipo=estado_mejora.';
comment on column public.mejora_continua.sugerencia_desperdicio is
  'Desperdicio Lean sugerido automaticamente por palabras clave. NO reemplaza el juicio humano: la persona confirma en tipo_desperdicio.';
comment on column public.mejora_continua.reincidente is
  'true si el problema ya habia ocurrido antes (ver vinculado_a). Metrica clave de control: tasa de reincidencia.';

-- Codigo correlativo CI-###
create or replace function public.codigo_mejora()
returns trigger language plpgsql set search_path = 'public' as $$
begin
  if new.codigo is null or new.codigo = '' then
    new.codigo := set_codigo('CI', 'mejora_continua');
  end if;
  return new;
end $$;

-- Asistente Lean: sugiere el desperdicio TIMWOODS segun palabras clave.
-- Escribe SOLO en sugerencia_desperdicio; nunca pisa tipo_desperdicio,
-- que es la clasificacion confirmada por una persona.
create or replace function public.sugerir_desperdicio()
returns trigger language plpgsql set search_path = 'public' as $$
declare texto text := lower(coalesce(new.titulo,'') || ' ' || coalesce(new.descripcion,''));
begin
  new.sugerencia_desperdicio :=
    case
      when texto ~ 'error|bug|falla|fallo|defecto|roto|no funciona|incorrect|regresi[oó]n|se perdi[oó]|dej[oó] de funcionar'
        then 'Defectos'
      when texto ~ 'lento|demora|tarda|espera|timeout|colgad|no responde|carga.*lent'
        then 'Espera'
      when texto ~ 'duplicad|repetid[oa] dos veces|copia igual|se hace dos veces'
        then 'Sobreproducción'
      when texto ~ 'manual|a mano|paso[s]? de m[aá]s|innecesari|redundante|repetitiv'
        then 'Sobreprocesamiento'
      when texto ~ 'sincroniz|migrar datos|exportar e importar|mover datos entre'
        then 'Transporte'
      when texto ~ 'versi[oó]n vieja|datos obsoletos|archivo sin usar|acumul|sin limpiar'
        then 'Inventario'
      when texto ~ 'muchos clics|demasiados pasos|hay que navegar|buscar en varios|ida y vuelta'
        then 'Movimiento'
      when texto ~ 'nadie revisa|sin automatizar|se hace a mano pudiendo|no se usa el rol|desaprovech'
        then 'Talento no utilizado'
      else null
    end;
  return new;
end $$;

-- Limite de control simple: vencimiento sugerido segun severidad
create or replace function public.sugerir_fecha_objetivo()
returns trigger language plpgsql set search_path = 'public' as $$
begin
  if new.fecha_objetivo is null then
    new.fecha_objetivo := (coalesce(new.fecha_reporte, now())::date) + case new.severidad
      when 'Crítico' then 2
      when 'Alto'    then 7
      when 'Medio'   then 15
      when 'Bajo'    then 30
      else 15
    end;
  end if;
  return new;
end $$;

create or replace function public.cerrar_mejora()
returns trigger language plpgsql set search_path = 'public' as $$
begin
  if new.estado = 'Cerrado' and (old.estado is distinct from 'Cerrado') and new.fecha_cierre is null then
    new.fecha_cierre := now()::date;
  end if;
  return new;
end $$;

create trigger trg_codigo_mejora before insert on public.mejora_continua
  for each row execute function public.codigo_mejora();
create trigger trg_sugerir_desperdicio before insert or update of titulo, descripcion on public.mejora_continua
  for each row execute function public.sugerir_desperdicio();
create trigger trg_sugerir_fecha_objetivo before insert on public.mejora_continua
  for each row execute function public.sugerir_fecha_objetivo();
create trigger trg_cerrar_mejora before update on public.mejora_continua
  for each row execute function public.cerrar_mejora();
create trigger trg_touch_mejora_continua before update on public.mejora_continua
  for each row execute function public.tocar_updated_at();
create trigger trg_hist_mejora_continua after insert or update or delete on public.mejora_continua
  for each row execute function public.registrar_historial();

-- Listas de configuracion (editables desde Configuracion -> Listas)
insert into public.config_listas (tipo, valor, orden, avance) values
  ('estado_mejora', 'Definir',   1, 0),
  ('estado_mejora', 'Medir',     2, 0.20),
  ('estado_mejora', 'Analizar',  3, 0.40),
  ('estado_mejora', 'Mejorar',   4, 0.70),
  ('estado_mejora', 'Controlar', 5, 0.90),
  ('estado_mejora', 'Cerrado',   6, 1.0);

insert into public.config_listas (tipo, valor, orden) values
  ('severidad_mejora', 'Crítico', 1),
  ('severidad_mejora', 'Alto',    2),
  ('severidad_mejora', 'Medio',   3),
  ('severidad_mejora', 'Bajo',    4);

insert into public.config_listas (tipo, valor, orden) values
  ('desperdicio_lean', 'Defectos', 1),
  ('desperdicio_lean', 'Espera', 2),
  ('desperdicio_lean', 'Sobreproducción', 3),
  ('desperdicio_lean', 'Sobreprocesamiento', 4),
  ('desperdicio_lean', 'Transporte', 5),
  ('desperdicio_lean', 'Inventario', 6),
  ('desperdicio_lean', 'Movimiento', 7),
  ('desperdicio_lean', 'Talento no utilizado', 8);

insert into public.config_listas (tipo, valor, orden) values
  ('metodo_raiz', '5 Porqués', 1),
  ('metodo_raiz', 'Espina de pescado (Ishikawa)', 2),
  ('metodo_raiz', 'Pareto', 3),
  ('metodo_raiz', 'Diagrama de flujo del proceso', 4),
  ('metodo_raiz', 'Otro', 5);

insert into public.config_listas (tipo, valor, orden) values
  ('modulo_app', 'Resumen', 1),
  ('modulo_app', 'Matriz de actividades', 2),
  ('modulo_app', 'Portafolio', 3),
  ('modulo_app', 'Tareas', 4),
  ('modulo_app', 'Radar por país', 5),
  ('modulo_app', 'Contactos por país', 6),
  ('modulo_app', 'Calendario de visitas', 7),
  ('modulo_app', 'Equipo y capacidad', 8),
  ('modulo_app', 'Historial de cambios', 9),
  ('modulo_app', 'Configuración', 10),
  ('modulo_app', 'Mejora continua', 11);

-- Cuadro de control del propio proceso de mejora continua.
-- security_invoker: la vista respeta el RLS de quien consulta, no el del
-- dueno de la vista.
create or replace view public.v_mejora_continua_kpis
with (security_invoker = true) as
select
  count(*) filter (where estado <> 'Cerrado') as abiertos,
  count(*) filter (where estado <> 'Cerrado' and fecha_objetivo < current_date) as vencidos,
  count(*) filter (where estado = 'Cerrado') as cerrados,
  count(*) filter (where reincidente) as reincidencias,
  round(count(*) filter (where reincidente)::numeric / nullif(count(*), 0) * 100, 1) as pct_reincidencia,
  round(avg(fecha_cierre - fecha_reporte::date) filter (where estado = 'Cerrado'), 1) as ciclo_promedio_dias,
  round(
    count(*) filter (where causa_raiz is not null and causa_raiz <> '')::numeric
    / nullif(count(*) filter (where estado in ('Mejorar','Controlar','Cerrado')), 0) * 100, 1
  ) as pct_con_causa_raiz
from public.mejora_continua;

grant select on public.v_mejora_continua_kpis to authenticated;
