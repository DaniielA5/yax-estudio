'use client'

import React, { useState, useRef } from "react"
import { subirImagenProducto, eliminarImagenProducto } from "./actions"

type Props = {
    productoId: number
    imagenUrl: string | null
}

export default function ImagenUpload({ productoId, imagenUrl}: Props){
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const inputRef =useRef<HTMLInputElement>(null)

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const archivo =e.target.files?.[0]
        if(!archivo) return 
        
        setLoading(true)
        setError('')

        const formData = new FormData()
        formData.append('imagen', archivo)

        const result = await subirImagenProducto(productoId, formData)

        setLoading(false)

        if(result.error) { 
            setError(result.error)
            if(inputRef.current) inputRef.current.value= ''
            return
        }
    }

    async function handleDelete() {
        if(!confirm('Eliminar imagen del producto?')) return

        setLoading(true)
        setError('')
        await eliminarImagenProducto(productoId)
        setLoading(false)
    }

  if (imagenUrl) {
    return (
      <div className="relative group/img">
        <img
          src={imagenUrl}
          alt="Producto"
          className="w-16 h-16 rounded-lg object-cover border border-gray-700"
        />
        <button
          onClick={handleDelete}
          disabled={loading}
          className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 hover:bg-red-500 text-white text-xs rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity disabled:opacity-50"
          title="Eliminar imagen"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <div>
      <label className="cursor-pointer">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={loading}
          className="hidden"
        />
        <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-700 hover:border-orange-500 transition-colors flex items-center justify-center text-gray-500 hover:text-orange-400 text-xs">
          {loading ? '...' : '+ Foto'}
        </div>
      </label>
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  )
}