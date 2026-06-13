import Link from 'next/link'
import LogoutButton from './clientes/logout-button'
import NavLinks from './nav-links'

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-6xl mx-auto p-6 md:p-8">
        <header className="flex justify-between items-center mb-8 pb-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2">
              <span className="text-xl font-bold text-orange-500">YAX</span>
              <span className="text-gray-500 text-sm hidden md:inline">Studio</span>
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