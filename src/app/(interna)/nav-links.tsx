'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

const LINKS = [
  { href: '/dashboard', label: 'Inicio' },
  { href: '/cotizaciones', label: 'Cotizaciones' },
  { href: '/clientes', label: 'Clientes' },
  { href: '/productos', label: 'Productos' },
  { href: '/tecnicas', label: 'Técnicas' },
]

type Props = {
  onLinkClick?: () => void
  layout?: 'horizontal' | 'vertical'
}

export default function NavLinks({ onLinkClick, layout = 'horizontal' }: Props) {
  const pathname = usePathname()

  return (
    <nav className={layout === 'vertical' ? 'flex flex-col gap-1 text-body' : 'flex gap-1 text-body'}>
      {LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href)
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onLinkClick}
            className={`rounded-lg transition-colors ${
              layout === 'vertical' ? 'px-3 py-2.5' : 'px-3 py-1.5'
            }`}
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