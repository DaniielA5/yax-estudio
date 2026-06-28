'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo + microcopy */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold" style={{ color: 'var(--accent)' }}>
            YAX Studio
          </h1>
          <p className="text-body mt-2" style={{ color: 'var(--text-secondary)' }}>
            Sistema interno de cotizaciones
          </p>
        </div>

        {/* Card de login */}
        <div
          className="rounded-xl p-6 space-y-4 border"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg text-body input-base"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg text-body input-base"
            />
          </div>

          {error && (
            <div
              className="p-3 rounded-lg border"
              style={{
                backgroundColor: 'var(--semantic-danger-bg)',
                borderColor: 'var(--semantic-danger)',
              }}
            >
              <p className="text-caption" style={{ color: 'var(--semantic-danger)' }}>
                {error}
              </p>
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full p-3 rounded-lg text-body font-semibold disabled:opacity-50 btn-primary"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </div>

        {/* Nota de pie */}
        <p
          className="text-caption text-center mt-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Acceso exclusivo — personal YAX Studio
        </p>
      </div>
    </main>
  )
}