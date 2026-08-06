-- =====================================================================
-- 0003 - Fija search_path en las funciones anteriores al versionado
-- Aplicado en produccion el 2026-08-06. (CI-005)
--
-- Sin search_path fijo, un esquema malicioso en el path del rol que
-- ejecuta podria resolver un nombre de tabla o funcion distinto al
-- esperado. Ninguna de estas funciones cambia de comportamiento: todas
-- ya operaban sobre el esquema public.
--
-- VERIFICADO tras aplicar: se insertaron una fila en portafolio y otra
-- en tareas, ambas generaron su codigo correlativo correctamente
-- (OPT-003 y TAR-003) y luego se eliminaron.
-- =====================================================================

alter function public.set_codigo(text, text)   set search_path = 'public';
alter function public.set_codigo_portafolio()  set search_path = 'public';
alter function public.tocar_updated_at()       set search_path = 'public';
alter function public.codigo_tarea()           set search_path = 'public';
alter function public.codigo_radar()           set search_path = 'public';
alter function public.codigo_viaje()           set search_path = 'public';
