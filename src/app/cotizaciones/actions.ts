'use server'

import { createSupabaseServerClient } from '@/lib/supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

type ItemInput = {
  producto_id: number | null
  tecnica_id: number | null
  cantidad: number
  talla: string
  color: string
  precio_unitario: number
  subtotal: number
}

type CrearCotizacionInput = {
  cliente_id: number
  items: ItemInput[]
  total: number
  notas: string
}

export async function crearCotizacion(input: CrearCotizacionInput) {
  const supabase = await createSupabaseServerClient()

  if (!input.cliente_id) return {
     error: 'Cliente requerido' 
    }
  if (input.items.length === 0) return { 
    error: 'Debe haber al menos un item' 
    }

  for (const item of input.items) {
    if (!item.producto_id || !item.tecnica_id) {
      return {
         error: 'Todos los items deben tener producto y técnica' 
        }
    }
    if (item.cantidad < 1) {
      return { 
        error: 'La cantidad debe ser mayor a 0' 
    }
    }
  }
// rpc sig : remote procedure call
  const { data, error } = await supabase.rpc('crear_cotizacion_con_items', {
    p_cliente_id: input.cliente_id,
    p_total: input.total,
    p_notas: input.notas || null,
    p_items: input.items,
  })

  if (error) return { error: error.message }

  revalidatePath('/cotizaciones')
  return {
     success: true, cotizacionId: data as number 
    }
}

export async function cambiarEstadoCotizacion(
  cotizacionId: number,
  nuevoEstado: string
) {
  const supabase = await createSupabaseServerClient()

  const estadosValidos = ['cotizado', 'aprobado', 'en_produccion', 'entregado', 'cancelado']
  if (!estadosValidos.includes(nuevoEstado)) {
    return { error: 'Estado inválido' }
  }

  const { error } = await supabase
    .from('cotizaciones')
    .update({ estado: nuevoEstado })
    .eq('id', cotizacionId)

  if (error) return { error: error.message }

  revalidatePath('/cotizaciones')
  return { success: true }
}