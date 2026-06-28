'use client'

import { useState } from 'react'
import Link from 'next/link'
import LogoutButton from './clientes/logout-button'
import NavLinks from './nav-links'

export default function MobileMenuWrapper() {
  const [isOpen, setIsOpen] = useState(false)

  function cerrarMenu() {
    setIsOpen(false)
  }

  return (
    <header
       className="relative flex justify-between items-center mb-8 pb-6 border-b"
      style={{ borderColor: 'var(--border-subtle)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span
            className="text-2xl font-bold"
            style={{ color: 'var(--accent)' }}
          >
            YAX
          </span>
          <span
            className="text-body hidden sm:inline"
            style={{ color: 'var(--text-muted)' }}
          >
            Studio
          </span>
        </Link>
      </div>

      {/* Desktop: nav inline + logout (visible md y arriba) */}
      <div className="hidden md:flex items-center gap-4">
        <NavLinks />
        <LogoutButton />
      </div>

      {/* Mobile: botón hamburger (visible solo debajo de md) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden p-2 rounded-lg transition-colors"
        style={{
          backgroundColor: isOpen ? 'var(--bg-subtle)' : 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-subtle)',
        }}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
      >
        {/* Icono hamburger / X */}
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <>
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </>
          ) : (
            <>
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile: dropdown menu (visible solo cuando isOpen y debajo de md) */}
      {isOpen && (
        <div
          className="md:hidden absolute left-0 right-0 top-full mt-0 px-6 py-4 border-t z-50"
          style={{
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-subtle)',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
          }}
        >
          <div className="flex flex-col gap-1">
            <NavLinks onLinkClick={cerrarMenu} layout="vertical" />
            <div className="mt-2 pt-2 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
              <LogoutButton />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}