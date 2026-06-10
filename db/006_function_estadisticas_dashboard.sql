CREATE OR REPLACE FUNCTION obtener_estadisticas_dashboard()
RETURNS jsonb
LANGUAGE plpgsql
AS $$
DECLARE
  v_pendientes_cotizado integer;
  v_pendientes_urgentes integer;
  v_aprobadas_sin_producir integer;
  v_en_produccion_count integer;
  v_en_produccion_piezas integer;
  v_total_pendiente_cobrar numeric;
  v_entregado_30_dias numeric;
BEGIN
  SELECT COUNT(*) INTO v_pendientes_cotizado
  FROM public.cotizaciones
  WHERE estado = 'cotizado';

  SELECT COUNT(*) INTO v_pendientes_urgentes
  FROM public.cotizaciones
  WHERE estado = 'cotizado'
    AND created_at < NOW() - INTERVAL '5 days';

  SELECT COUNT(*) INTO v_aprobadas_sin_producir
  FROM public.cotizaciones
  WHERE estado = 'aprobado';

  SELECT COUNT(*) INTO v_en_produccion_count
  FROM public.cotizaciones
  WHERE estado = 'en_produccion';

  SELECT COALESCE(SUM(ic.cantidad), 0) INTO v_en_produccion_piezas
  FROM public.items_cotizacion ic
  JOIN public.cotizaciones c ON c.id = ic.cotizacion_id
  WHERE c.estado = 'en_produccion';

  SELECT COALESCE(SUM(total - anticipo), 0) INTO v_total_pendiente_cobrar
  FROM public.cotizaciones
  WHERE estado IN ('aprobado', 'en_produccion');

  SELECT COALESCE(SUM(total), 0) INTO v_entregado_30_dias
  FROM public.cotizaciones
  WHERE estado = 'entregado'
    AND created_at > NOW() - INTERVAL '30 days';

  RETURN jsonb_build_object(
    'pendientes_cotizado', v_pendientes_cotizado,
    'pendientes_urgentes', v_pendientes_urgentes,
    'aprobadas_sin_producir', v_aprobadas_sin_producir,
    'en_produccion_count', v_en_produccion_count,
    'en_produccion_piezas', v_en_produccion_piezas,
    'total_pendiente_cobrar', v_total_pendiente_cobrar,
    'entregado_30_dias', v_entregado_30_dias
  );
END;
$$;