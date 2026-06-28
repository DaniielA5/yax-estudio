'use client'

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { crearCotizacion } from "../actions"

type Cliente = {
  id: number
  nombre: string
  empresa: string | null
}

type Producto = {
  id: number
  nombre: string
  costo_individual: number
  costo_mayoreo: number
  material: string | null
}

type Tecnica = {
  id: number
  nombre: string
  costo_por_pieza: number
  minimo_piezas: number
}

type ItemCotizacion = {
  producto_id: number | null
  tecnica_id: number | null
  cantidad: number
  talla: string
  color: string
}

type Props = {
  clientes: Cliente[]
  productos: Producto[]
  tecnicas: Tecnica[]
}

const ITEM_VACIO: ItemCotizacion = {
  producto_id: null,
  tecnica_id: null,
  cantidad: 1,
  talla: '',
  color: '',
}

const UMBRAL_MAYOREO = 6

export default function CotizacionForm({ clientes, productos, tecnicas }: Props) {
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [items, setItems] = useState<ItemCotizacion[]>([{ ...ITEM_VACIO }])
  const [notas, setNotas] = useState('')
  const router = useRouter()
  const [guardando, setGuardando] = useState(false)
  const [errorGuardar, setErrorGuardar] = useState('')

  function agregarItem() {
    setItems([...items, { ...ITEM_VACIO }])
  }

  function eliminarItem(index: number) {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  function actualizarItem<K extends keyof ItemCotizacion>(
    index: number,
    campo: K,
    valor: ItemCotizacion[K]
  ) {
    const nuevos = [...items]
    nuevos[index] = { ...nuevos[index], [campo]: valor }
    setItems(nuevos)
  }

  const itemsConPrecio = useMemo(() => {
    return items.map((item) => {
      const producto = productos.find((p) => p.id === item.producto_id)
      const tecnica = tecnicas.find((t) => t.id === item.tecnica_id)

      if (!producto) return { ...item, precio_unitario: 0, subtotal: 0, error: null }

      const precioProducto =
        item.cantidad >= UMBRAL_MAYOREO ? producto.costo_mayoreo : producto.costo_individual

      const precioTecnica = tecnica?.costo_por_pieza ?? 0
      const precio_unitario = precioProducto + precioTecnica
      const subtotal = precio_unitario * item.cantidad

      const error =
        tecnica && item.cantidad < tecnica.minimo_piezas
          ? `Mínimo ${tecnica.minimo_piezas} piezas para ${tecnica.nombre}`
          : null

      return { ...item, precio_unitario, subtotal, error }
    })
  }, [items, productos, tecnicas])

  const total = itemsConPrecio.reduce((sum, item) => sum + item.subtotal, 0)
  const hayErrores = itemsConPrecio.some((item) => item.error !== null)
  const itemsIncompletos = items.some((item) => !item.producto_id || !item.tecnica_id)

  return (
    <div className="space-y-6">
      {/* Selección de cliente */}
      <section
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <h2 className="text-label mb-3" style={{ color: 'var(--text-muted)' }}>
          Cliente
        </h2>
        <select
          value={clienteId || ''}
          onChange={(e) => setClienteId(e.target.value ? Number(e.target.value) : null)}
          className="w-full p-3 rounded-lg text-body input-base"
        >
          <option value="">Selecciona un cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nombre} {c.empresa ? `— ${c.empresa}` : ''}
            </option>
          ))}
        </select>
      </section>

      {/* Items */}
      <section
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-label" style={{ color: 'var(--text-muted)' }}>
            Items ({items.length})
          </h2>
          <button
            type="button"
            onClick={agregarItem}
            className="px-3 py-1.5 rounded-lg text-caption btn-secondary"
          >
            + Agregar item
          </button>
        </div>

        <div className="space-y-4">
          {itemsConPrecio.map((item, index) => (
            <ItemRow
              key={index}
              index={index}
              item={item}
              productos={productos}
              tecnicas={tecnicas}
              puedeEliminar={items.length > 1}
              onActualizar={actualizarItem}
              onEliminar={() => eliminarItem(index)}
            />
          ))}
        </div>
      </section>

      {/* Notas */}
      <section
        className="rounded-xl p-5 border"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-subtle)',
        }}
      >
        <h2 className="text-label mb-3" style={{ color: 'var(--text-muted)' }}>
          Notas internas (opcional)
        </h2>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="Información adicional sobre esta cotización"
          className="w-full p-3 rounded-lg text-body resize-none input-base"
        />
      </section>

      {/* Total y acción */}
      <section
        className="rounded-xl p-5 border sticky bottom-4"
        style={{
          backgroundColor: 'var(--accent-subtle)',
          borderColor: 'var(--accent)',
        }}
      >
        <div className="flex justify-between items-center mb-4">
          <span className="text-h2" style={{ color: 'var(--text-secondary)' }}>
            Total estimado
          </span>
          <span className="text-3xl font-bold" style={{ color: 'var(--accent-hover)' }}>
            ${total.toFixed(2)}
          </span>
        </div>

        {!clienteId && (
          <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
            Selecciona un cliente para continuar
          </p>
        )}
        {itemsIncompletos && (
          <p className="text-caption mb-3" style={{ color: 'var(--text-muted)' }}>
            Completa producto y técnica en todos los items
          </p>
        )}
        {hayErrores && (
          <p className="text-caption mb-3" style={{ color: 'var(--semantic-danger)' }}>
            Revisa los errores de mínimo de piezas
          </p>
        )}
        {errorGuardar && (
          <p className="text-caption mb-3" style={{ color: 'var(--semantic-danger)' }}>
            {errorGuardar}
          </p>
        )}

        <button
          type="button"
          disabled={!clienteId || itemsIncompletos || hayErrores || guardando}
          className="w-full p-3 rounded-lg text-body font-semibold disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
          onClick={async () => {
            if (!clienteId) return
            setGuardando(true)
            setErrorGuardar('')

            const itemsParaGuardar = itemsConPrecio.map((item) => ({
              producto_id: item.producto_id,
              tecnica_id: item.tecnica_id,
              cantidad: item.cantidad,
              talla: item.talla,
              color: item.color,
              precio_unitario: item.precio_unitario,
              subtotal: item.subtotal,
            }))

            const result = await crearCotizacion({
              cliente_id: clienteId,
              items: itemsParaGuardar,
              total,
              notas,
            })

            setGuardando(false)

            if (result.error) {
              setErrorGuardar(result.error)
              return
            }

            router.push('/cotizaciones')
          }}
        >
          {guardando ? 'Guardando...' : 'Guardar cotización'}
        </button>
      </section>
    </div>
  )
}

// ===== Componente fila de item =====

type ItemRowProps = {
  index: number
  item: ItemCotizacion & { precio_unitario: number; subtotal: number; error: string | null }
  productos: Producto[]
  tecnicas: Tecnica[]
  puedeEliminar: boolean
  onActualizar: <K extends keyof ItemCotizacion>(
    index: number,
    campo: K,
    valor: ItemCotizacion[K]
  ) => void
  onEliminar: () => void
}

function ItemRow({
  index,
  item,
  productos,
  tecnicas,
  puedeEliminar,
  onActualizar,
  onEliminar,
}: ItemRowProps) {
  const esMayoreo = item.cantidad >= UMBRAL_MAYOREO

  return (
    <div
      className="rounded-lg p-4 space-y-3 border"
      style={{
        backgroundColor: 'var(--bg-subtle)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="flex justify-between items-center">
        <span className="text-label" style={{ color: 'var(--text-muted)' }}>
          Item #{index + 1}
        </span>
        {puedeEliminar && (
          <button
            type="button"
            onClick={onEliminar}
            className="text-caption btn-ghost"
            style={{ color: 'var(--semantic-danger)' }}
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
            Producto
          </label>
          <select
            value={item.producto_id || ''}
            onChange={(e) =>
              onActualizar(index, 'producto_id', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2.5 rounded-lg text-body input-base"
          >
            <option value="">Selecciona producto</option>
            {productos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nombre}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
            Técnica
          </label>
          <select
            value={item.tecnica_id || ''}
            onChange={(e) =>
              onActualizar(index, 'tecnica_id', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2.5 rounded-lg text-body input-base"
          >
            <option value="">Selecciona técnica</option>
            {tecnicas.map((t) => (
              <option key={t.id} value={t.id}>
                {t.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
            Cantidad
          </label>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={(e) => onActualizar(index, 'cantidad', Math.max(1, Number(e.target.value)))}
            className="w-full p-2.5 rounded-lg text-body input-base"
          />
        </div>
        <div>
          <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
            Talla
          </label>
          <input
            type="text"
            value={item.talla}
            onChange={(e) => onActualizar(index, 'talla', e.target.value)}
            placeholder="M, L, XL..."
            className="w-full p-2.5 rounded-lg text-body input-base"
          />
        </div>
        <div>
          <label className="text-label block mb-1" style={{ color: 'var(--text-muted)' }}>
            Color
          </label>
          <input
            type="text"
            value={item.color}
            onChange={(e) => onActualizar(index, 'color', e.target.value)}
            placeholder="Blanco, negro..."
            className="w-full p-2.5 rounded-lg text-body input-base"
          />
        </div>
      </div>

      {/* Resumen del item */}
      {item.producto_id && item.tecnica_id && (
        <div
          className="pt-3 flex justify-between items-center border-t"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-caption" style={{ color: 'var(--text-muted)' }}>
              ${item.precio_unitario.toFixed(2)} × {item.cantidad}
            </span>
            {esMayoreo && (
              <span
                className="text-caption px-2 py-0.5 rounded-full border"
                style={{
                  backgroundColor: 'var(--accent-subtle)',
                  color: 'var(--accent)',
                  borderColor: 'var(--accent)',
                }}
              >
                Precio mayoreo
              </span>
            )}
          </div>
          <span className="text-body font-semibold" style={{ color: 'var(--text-primary)' }}>
            ${item.subtotal.toFixed(2)}
          </span>
        </div>
      )}

      {item.error && (
        <p className="text-caption" style={{ color: 'var(--semantic-danger)' }}>
          {item.error}
        </p>
      )}
    </div>
  )
}