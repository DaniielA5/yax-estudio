'use client'

import { useState } from 'react'

type Props = {
  slug: string
  clienteNombre: string
  total: number
}

export default function CompartirButton({ slug, clienteNombre, total }: Props) {
  const [copiado, setCopiado] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // window , impor / crashea
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/c/${slug}`
      : `/c/${slug}`

  async function copiarLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  function abrirWhatsApp() {
    const mensaje = `Hola ${clienteNombre}, te comparto la cotización de YAX Studio por $${total.toFixed(
      2
    )}: ${url}`
    const urlWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`
    window.open(urlWhatsApp, '_blank')
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-gray-400 hover:text-white transition-colors"
      >
        Compartir →
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="text-xs text-gray-500 hover:text-gray-400 transition-colors mb-2 block"
      >
        ✕ Cerrar
      </button>
      <div className="space-y-2 min-w-[200px]">
        <button
          onClick={copiarLink}
          className={`w-full text-xs px-3 py-2 rounded-lg transition-colors text-left ${
            copiado
              ? 'bg-green-950 text-green-300 border border-green-900'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          }`}
        >
          {copiado ? '✓ Link copiado' : '📋 Copiar link'}
        </button>
        <button
          onClick={abrirWhatsApp}
          className="w-full text-xs px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors text-left"
        >
          💬 Abrir en WhatsApp
        </button>
      </div>
    </>
  )
}