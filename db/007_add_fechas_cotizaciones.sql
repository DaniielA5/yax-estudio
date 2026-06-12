ALTER TABLE public.cotizaciones
  ADD COLUMN fecha_aprobado timestamptz,
  ADD COLUMN fecha_produccion timestamptz,
  ADD COLUMN fecha_entrega_prometida date,
  ADD COLUMN fecha_entregado timestamptz;