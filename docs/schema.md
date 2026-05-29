# Schema de la base de datos — YAX Studio

## Tablas

### clientes
Información de contacto de cada cliente del negocio.

### productos
Catálogo de productos disponibles. El `costo_individual` y `costo_mayoreo` ya incluyen DTF estándar.
- `costo_individual`: precio 1-5 piezas
- `costo_mayoreo`: precio 6+ piezas

### tecnicas_impresion
Métodos de personalización. Actualmente solo DTF está activa.
Serigrafía está pre-cargada como `activo: false` para cuando se tenga equipo.

### cotizaciones
Cotización maestra, asociada a un cliente. Contiene estado y totales.
Estados posibles: cotizado, aprobado, en_produccion, entregado, cancelado.

### items_cotizacion
Detalle de cada producto cotizado. Una cotización tiene muchos items.

## Decisiones de diseño

- **DTF incluido en precio de producto**: simplifica el modelo. Cuando se agregue serigrafía, se migrará a costos separados.
- **Mayoreo a 6+ piezas**: definido por producto, lógica de aplicación en código.
- **Talla y color como texto**: no se modelaron como tablas separadas por simplicidad.
- **IDs como `bigint` autoincremental**: simple y consistente. Para URLs públicas de cotizaciones se agregará un campo `uuid` adicional en el Día 20.

## Foreign keys

- `cotizaciones.cliente_id` → `clientes.id` (RESTRICT)
- `items_cotizacion.cotizacion_id` → `cotizaciones.id` (CASCADE)
- `items_cotizacion.producto_id` → `productos.id` (RESTRICT)
- `items_cotizacion.tecnica_id` → `tecnicas_impresion.id` (RESTRICT)