'use client'

import { useState, useMemo } from "react"

type Cliente = {
    id: number
    nombre:string
    empresa: string | null
}

type Producto = {
    id:number
    nombre: string
    costo_individual: number
    costo_mayoreo: number
    material : string | null
}

type Tecnica = {
    id:number
    nombre : string
    costo_por_pieza: number
    minimo_piezas: number
}

type ItemCotizacion = {
    producto_id: number | null
    tecnica_id  : number | null
    cantidad: number
    talla: string
    color: string
}

type Props = {
    clientes: Cliente[]
    productos: Producto[]
    tecnicas: Tecnica[]
}

const ITEM_VACIO :ItemCotizacion = {
    producto_id: null,
    tecnica_id: null,
    cantidad : 1,
    talla: '',
    color: '',
}

const UMBRAL_MAYOREO = 6

export default function CotizacionForm({ clientes, productos, tecnicas }: Props) {
  const [clienteId, setClienteId] = useState<number | null>(null)
  const [items, setItems] = useState<ItemCotizacion[]>([{ ...ITEM_VACIO }])
  const [notas, setNotas] = useState('')


    function agregarItem(){
        setItems([...items, { ...ITEM_VACIO}])
    }

    function eliminarItem(index: number){
        if(items.length === 1) return
        setItems(items.filter((_, i) => i !== index))
    }


    function actualizarItem<K extends keyof ItemCotizacion>(
        index: number,
        campo: K,
        valor: ItemCotizacion[K]

    ){
        const nuevos = [...items]
        nuevos[index] = { ...nuevos[index], [campo]: valor}
        setItems(nuevos)
    }

    const itemsConPrecio = useMemo(() => {
        return items.map((item) => { 
            const producto = productos.find((p) => p.id === item.producto_id)
            const tecnica = tecnicas.find((t) => t.id === item.tecnica_id)
        
            if(!producto) return { ...item, precio_unitario: 0, subtotal: 0 , error:null}

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
}, [items, productos,tecnicas])

const total = itemsConPrecio.reduce((sum,item) => sum + item.subtotal, 0)
const hayErrores = itemsConPrecio.some((item) => item.error !== null)
const itemsIncompletos =items.some((item) => !item.producto_id || !item.tecnica_id)


  return (
    <div className="space-y-6">
      {/* Selección de cliente */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Cliente
        </h2>
        <select
          value={clienteId || ''}
          onChange={(e) => setClienteId(e.target.value ? Number(e.target.value) : null)}
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors"
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
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Items ({items.length})
          </h2>
          <button
            type="button"
            onClick={agregarItem}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
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
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Notas internas (opcional)
        </h2>
        <textarea
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          rows={3}
          placeholder="Información adicional sobre esta cotización"
          className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors resize-none"
        />
      </section>

      {/* Total y acción */}
      <section className="bg-gray-900 border border-gray-800 rounded-xl p-5 sticky bottom-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-400">Total estimado</span>
          <span className="text-3xl font-bold text-orange-400">
            ${total.toFixed(2)}
          </span>
        </div>

        {!clienteId && (
          <p className="text-sm text-gray-500 mb-3">Selecciona un cliente para continuar</p>
        )}
        {itemsIncompletos && (
          <p className="text-sm text-gray-500 mb-3">Completa producto y técnica en todos los items</p>
        )}
        {hayErrores && (
          <p className="text-sm text-red-400 mb-3">Revisa los errores de mínimo de piezas</p>
        )}

        <button
          type="button"
          disabled={!clienteId || itemsIncompletos || hayErrores}
          className="w-full p-3 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          onClick={() => {
            // Mañana lo conectamos al backend
            console.log({ clienteId, items: itemsConPrecio, total, notas })
            alert('Mañana implementamos el guardado. Por ahora revisa la consola del navegador (F12)')
          }}
        >
          Guardar cotización
        </button>
      </section>
    </div>
  )
}

// Componente fila de item
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
    <div className="bg-gray-950 border border-gray-800 rounded-lg p-4 space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          Item #{index + 1}
        </span>
        {puedeEliminar && (
          <button
            type="button"
            onClick={onEliminar}
            className="text-xs text-red-400 hover:text-red-300 transition-colors"
          >
            Eliminar
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Producto</label>
          <select
            value={item.producto_id || ''}
            onChange={(e) =>
              onActualizar(index, 'producto_id', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
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
          <label className="block text-xs text-gray-400 mb-1">Técnica</label>
          <select
            value={item.tecnica_id || ''}
            onChange={(e) =>
              onActualizar(index, 'tecnica_id', e.target.value ? Number(e.target.value) : null)
            }
            className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
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
          <label className="block text-xs text-gray-400 mb-1">Cantidad</label>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={(e) => onActualizar(index, 'cantidad', Math.max(1, Number(e.target.value)))}
            className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Talla</label>
          <input
            type="text"
            value={item.talla}
            onChange={(e) => onActualizar(index, 'talla', e.target.value)}
            placeholder="M, L, XL..."
            className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">Color</label>
          <input
            type="text"
            value={item.color}
            onChange={(e) => onActualizar(index, 'color', e.target.value)}
            placeholder="Blanco, negro..."
            className="w-full p-2.5 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-orange-500 transition-colors text-sm"
          />
        </div>
      </div>

      {/* Resumen del item */}
      {item.producto_id && item.tecnica_id && (
        <div className="pt-3 border-t border-gray-800 flex justify-between items-center text-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              ${item.precio_unitario.toFixed(2)} × {item.cantidad}
            </span>
            {esMayoreo && (
              <span className="text-xs px-2 py-0.5 bg-orange-950 text-orange-300 rounded-full border border-orange-900">
                Precio mayoreo
              </span>
            )}
          </div>
          <span className="font-semibold text-white">
            ${item.subtotal.toFixed(2)}
          </span>
        </div>
      )}

      {item.error && (
        <p className="text-red-400 text-xs">{item.error}</p>
      )}
    </div>
  )
}