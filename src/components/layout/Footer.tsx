import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-background border-t border-border py-8 mt-auto">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} KI Tricks. Alle Rechte vorbehalten.
          </p>
          <div className="flex items-center gap-6">
            <Link 
              href="/datenschutz" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Datenschutz
            </Link>
            <Link 
              href="/impressum" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
            <Link 
              href="/kontakt" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Kontakt
            </Link>
            <Link 
              href="/tricks/einreichen" 
              className="text-sm text-foreground hover:text-primary font-medium transition-colors"
            >
              Community beitragen
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Mehr zum Thema KI findest du auf{' '}
            <a 
              href="https://www.produktiv.me" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-primary font-medium transition-colors"
            >
              produktiv.me
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}