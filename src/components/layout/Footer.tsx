import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-800 py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-neutral-400">
            © {new Date().getFullYear()} KI Tricks. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/datenschutz" 
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Datenschutz
            </Link>
            <Link 
              href="/impressum" 
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Impressum
            </Link>
            <Link 
              href="/kontakt" 
              className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              Kontakt
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-neutral-800 text-center">
          <p className="text-sm text-neutral-400">
            Mehr zum Thema KI findest du auf{' '}
            <a 
              href="https://www.produktiv.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
            >
              produktiv.me
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}