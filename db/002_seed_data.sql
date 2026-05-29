INSERT INTO public.tecnicas_impresion (nombre, costo_por_pieza, minimo_piezas, notas, activo) VALUES
  ('DTF estándar', 0, 1, 'Incluye estampado frente 10x10 y espalda 25x30. Costo ya incluido en precio del producto.', true),
  ('Serigrafía', 0, 20, 'Pendiente definir costo cuando tenga equipo.', false);


  INSERT INTO public.productos (nombre, costo_individual, costo_mayoreo, material) VALUES
  ('Playera cuello redondo manga corta algodón', 180, 150, 'algodón'),
  ('Playera cuello redondo manga larga algodón', 220, 200, 'algodón'),
  ('Polo manga corta 50/50', 269, 249, '50/50'),
  ('Sudadera con capucha', 375, 325, 'algodon'),
  ('Gorra básica', 85, 75, 'algodón');
