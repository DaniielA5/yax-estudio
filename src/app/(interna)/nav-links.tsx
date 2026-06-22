'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/cotizaciones', label: 'Cotizaciones' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/productos', label: 'Productos' },
  { href: '/tecnicas', label: 'Técnicas' },
]

export default function NavLinks() {
    const pathname = usePathname()

    return (
        <nav className="flex gap-1 text-sm">
            {LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
          <Link
            key={link.href}
            href={link.href}
            className="px-3 py-1.5 rounded-lg transition-colors"
            style={{
              backgroundColor: isActive ? 'var(--bg-subtle)' : 'transparent',
              color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: isActive ? 600 : 500,
            }}
          >
            {link.label}
          </Link>
        )
            })}
        </nav>
    )
}
