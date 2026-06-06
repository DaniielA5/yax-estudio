
CREATE OR REPLACE FUNCTION crear_cotizacion_con_items(
  p_cliente_id bigint,
  p_total numeric, 
  p_notas text,
  p_items jsonb
)

RETURNS bigint
LANGUAGE plpgsql
AS $$
DECLARE
  v_cotizacion_id bigint;
  v_item jsonb;
BEGIN

INSERT INTO public.cotizaciones (cliente_id, notas, estado, anticipio)
VALUES (p_cliente_id, p_total, p_notas, 'cotizacion', 0)
RETURNING id INTO v_cotizacion_id;

FOR v_item IN SELECT *  FROM jsonb_array_elements(p_items)
LOOP
  INSERT INTO public.items_cotizacion(
    cotizacion_id, 
    producto_id,
    tecnica_id,
    cantidad,
    talla,
    color,
    precio_unitario,
    subtotal
    ) VALUES (
      v_cotizacion_id,
      (v_item->>'producto_id')::bigint,
      (v_item->>'tecnica_id')::bigint,
      (v_item->>'cantidad')::integer,
      v_item->>'talla',
      v_item->>'color',
      (v_item->>'precio_unitario')::numeric,
      (v_item->>'subtotal')::numeric
    );
  END LOOP;

  RETURN v_cotizacion_id;
END;
$$;