import Link from 'next/link'
import LogoutButton from './clientes/logout-button'
import NavLinks from './nav-links'

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <header
          className="flex justify-between items-center mb-8 pb-6 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span
                className="text-xl font-bold"
                style={{ color: 'var(--accent)' }}
              >
                YAX
              </span>
              <span
                className="text-sm hidden md:inline"
                style={{ color: 'var(--text-muted)' }}
              >
                Studio
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <NavLinks />
            <LogoutButton />
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}