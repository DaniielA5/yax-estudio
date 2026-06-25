'use client'

import { useState } from "react"
import { toggleActivoTecnica } from "./actions"

type Props = {
  tecnicaId: number
  activo: boolean
}

export default function ToggleActivoButton({ tecnicaId, activo }: Props) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    setLoading(true)
    await toggleActivoTecnica(tecnicaId, activo)
    setLoading(false)
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-3 py-1.5 rounded-lg text-caption disabled:opacity-50 ${
        activo ? 'btn-destructive' : 'btn-secondary'
      }`}
    >
      {loading ? '...' : activo ? 'Desactivar' : 'Activar'}
    </button>
  )
}