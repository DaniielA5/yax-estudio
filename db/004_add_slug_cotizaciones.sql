ALTER TABLE public.cotizaciones
  ADD COLUMN slug text UNIQUE;

UPDATE public.cotizaciones
  SET slug = substring(md5(random() :: text || id:: text), 1, 10)
  WHERE slug IS NULL;

ALTER TABLE public.cotizaciones
  ALTER COLUMN slug SET NOT NULL;
  