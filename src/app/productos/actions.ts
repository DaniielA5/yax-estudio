'use server'

import { createSupabaseServerClient } from "@/lib/supabase-server"
import { error } from "console"
import { access } from "fs"
import { revalidatePath } from "next/cache"

function parsearNumero(valor: FormDataEntryValue | null): number | null {
    if(!valor) 
        return null
    const num = Number(valor)
    return isNaN(num) ?  null : num
}

export async function crearProducto(formData:FormData) {
    const supabase = await createSupabaseServerClient()
    const nombre = (formData.get('nombre') as string)?.trim()
    const costo_individual = parsearNumero(formData.get('costo_individual'))
    const costo_mayoreo = parsearNumero(formData.get('costo_mayoreo'))
    const material = (formData.get('material') as string)?.trim() || null

    if (!nombre) return { errror: 'El nombre es obligatorio'}
    if(costo_individual === null || costo_individual <=0 )
        return { error: 'El costo individual debe ser un numero mayor a 0'}
    if (costo_mayoreo === null || costo_mayoreo <= 0 )
        return { error : 'El costo mayoreo debe ser un numero mayor a  0'}
    if(costo_mayoreo  >costo_individual)
        return {error: 'El costo de mayoreo no puede ser mayor al individual '}

    const { error } = await supabase.from('productos').insert ({
        nombre,
        costo_individual,
        costo_mayoreo,
        material,
        activo:  true,
    })
    if(error) return { error: error.message}

    revalidatePath('/productos')
    return { success: true }
}

export async function actualizarProducto(id: number, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const nombre = (formData.get('nombre') as string)?.trim()
  const costo_individual = parsearNumero(formData.get('costo_individual'))
  const costo_mayoreo = parsearNumero(formData.get('costo_mayoreo'))
  const material = (formData.get('material') as string)?.trim() || null

  if (!nombre) return { error: 'El nombre es obligatorio' }
  if (costo_individual === null || costo_individual <= 0)
    return { error: 'El costo individual debe ser un número mayor a 0' }
  if (costo_mayoreo === null || costo_mayoreo <= 0)
    return { error: 'El costo mayoreo debe ser un número mayor a 0' }
  if (costo_mayoreo > costo_individual)
    return { error: 'El costo de mayoreo no puede ser mayor al individual' }

  const { error } = await supabase
    .from('productos')
    .update({ nombre, costo_individual, costo_mayoreo, material })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/productos')
  return { success: true }
}

export async function toggleActivoProducto(id: number, activoActual: boolean) {
  const supabase = await createSupabaseServerClient()

  const { error } = await supabase
    .from('productos')
    .update({ activo: !activoActual })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/productos')
  return { success: true }
}

