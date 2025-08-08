import Link from 'next/link'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-neutral-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-neutral-700 mb-4">
            Seite nicht gefunden
          </h2>
          <p className="text-neutral-600 mb-8">
            Die gewünschte Seite konnte leider nicht gefunden werden.
          </p>
          <Link 
            href="/" 
            className="btn-primary"
          >
            Zurück zur Startseite
          </Link>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}