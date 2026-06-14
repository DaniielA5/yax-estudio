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
                    className={
                        isActive
                        ? 'px-3 py-1.5 bg-gray-800 text-white rounded-lg'
                        : 'px-3 py-1.5 text-gray-400 hover:text-white rounded-lg transition-colors'

                    }
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}
