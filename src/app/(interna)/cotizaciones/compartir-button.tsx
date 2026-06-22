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
        className="text-caption btn-ghost"
      >
        Compartir →
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(false)}
        className="text-caption btn-ghost mb-2 block"
        style={{ color: 'var(--text-muted)' }}
      >
        ✕ Cerrar
      </button>
      <div className="space-y-2 min-w-[200px]">
        <button
          onClick={copiarLink}
          className="w-full text-caption px-3 py-2 rounded-lg transition-colors text-left"
          style={{
            backgroundColor: copiado ? 'var(--semantic-success-bg)' : 'var(--bg-subtle)',
            color: copiado ? 'var(--semantic-success)' : 'var(--text-primary)',
            border: copiado ? '1px solid var(--semantic-success)' : '1px solid transparent',
          }}
        >
          {copiado ? '✓ Link copiado' : ' Copiar link'}
        </button>
        <button
          onClick={abrirWhatsApp}
          className="w-full text-caption px-3 py-2 rounded-lg text-left btn-secondary"
        >
          💬 Abrir en WhatsApp
        </button>
      </div>
    </>
  )
}