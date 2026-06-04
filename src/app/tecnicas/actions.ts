'use server'

import { createSupabaseServerClient } from "@/lib/supabase-server"
import  { revalidatePath } from 'next/cache'

function parsearNumero(valor: FormDataEntryValue | null): number | null {
    if (!valor) return null
    const num = Number(valor)
    return isNaN(num )? null : num
} 


function parsearEntero(valor: FormDataEntryValue | null): number | null {
  if (!valor) return null
  const num = parseInt(valor as string, 10)
  return isNaN(num) ? null : num
}

export async function crearTecnica(formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const costo_por_pieza = parsearNumero(formData.get('costo_por_pieza'))
  const minimo_piezas = parsearEntero(formData.get('minimo_piezas'))
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) return { error: 'El nombre es obligatorio' }
  if (costo_por_pieza === null || costo_por_pieza < 0)
    return { error: 'El costo por pieza debe ser 0 o mayor' }
  if (minimo_piezas === null || minimo_piezas < 1)
    return { error: 'El mínimo de piezas debe ser al menos 1' }

  const { error } = await supabase.from('tecnicas_impresion').insert({
    nombre,
    costo_por_pieza,
    minimo_piezas,
    notas,
    activo: true,
  })

  if (error) return { error: error.message }

  revalidatePath('/tecnicas')
  return { success: true }
}

export async function actualizarTecnica(id: number, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const costo_por_pieza = parsearNumero(formData.get('costo_por_pieza'))
  const minimo_piezas = parsearEntero(formData.get('minimo_piezas'))
  const notas = (formData.get('notas') as string)?.trim() || null

  if (!nombre) return { error: 'El nombre es obligatorio' }
  if (costo_por_pieza === null || costo_por_pieza < 0)
    return { error: 'El costo por pieza debe ser 0 o mayor' }
  if (minimo_piezas === null || minimo_piezas < 1)
    return { error: 'El mínimo de piezas debe ser al menos 1' }

  const { error } = await supabase
    .from('tecnicas_impresion')
    .update({ nombre, costo_por_pieza, minimo_piezas, notas })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/tecnicas')
  return { success: true }
}

export async function toggleActivoTecnica(id: number, activoActual: boolean) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('tecnicas_impresion')
    .update({ activo: !activoActual })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/tecnicas')
  return { success: true }
}

