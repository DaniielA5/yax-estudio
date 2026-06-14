'use server'

import { createSupabaseServerClient } from "@/lib/supabase-server"
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

    if (!nombre) return { error: 'El nombre es obligatorio'}
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

export async function subirImagenProducto(productoId: number, formData: FormData) {
  const supabase = await createSupabaseServerClient()

  const archivo = formData.get('imagen') as File
  if (!archivo || archivo.size === 0) {
    return { error: 'Selecciona una imagen' }
  }

  if (!archivo.type.startsWith('image/')) {
    return { error: 'El archivo debe ser una imagen' }
  }

  if (archivo.size > 5 * 1024 * 1024) {
    return { error: 'La imagen no puede pesar más de 5 MB' }
  }
  const extension = archivo.name.split('.').pop()
  const nombreArchivo = `${productoId}_${Date.now()}.${extension}`

  const { error: errorUpload } = await supabase.storage
    .from('productos')
    .upload(nombreArchivo, archivo, {
      cacheControl: '3600',
      upsert: false,
    })

  if (errorUpload) {
    return { error: errorUpload.message }
  }

  const { data: urlData } = supabase.storage
    .from('productos')
    .getPublicUrl(nombreArchivo)

  const { error: errorUpdate } = await supabase
    .from('productos')
    .update({ imagen_url: urlData.publicUrl })
    .eq('id', productoId)

  if (errorUpdate) return { error: errorUpdate.message }

  revalidatePath('/productos')
  return { success: true }
}

export async function eliminarImagenProducto(productoId: number) {
  const supabase = await createSupabaseServerClient()

  const { data: producto } = await supabase
    .from('productos')
    .select('imagen_url')
    .eq('id', productoId)
    .single()

  if (producto?.imagen_url) {
    const nombreArchivo = producto.imagen_url.split('/').pop()
    if (nombreArchivo) {
      await supabase.storage.from('productos').remove([nombreArchivo])
    }
  }

  const { error } = await supabase
    .from('productos')
    .update({ imagen_url: null })
    .eq('id', productoId)

  if (error) return { error: error.message }

  revalidatePath('/productos')
  return { success: true }
}