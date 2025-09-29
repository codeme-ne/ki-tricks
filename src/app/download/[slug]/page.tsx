import { Metadata } from 'next'
import { Header, Footer } from '@/components/layout'
import { Button } from '@/components/ui/button'
import { BaseCard } from '@/components/atoms'
import { Download, CheckCircle, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const DOWNLOADS = {
  'ki-tricks-guide': {
    title: 'Die 50 besten KI-Tricks',
    description: 'Sofort anwendbare Workflows für mehr Produktivität',
    fileUrl: '/downloads/ki-tricks-guide.pdf',
    fileSize: '2.5 MB',
    pages: 50,
  },
  'productivity-hacks': {
    title: 'Produktivitäts-Hacks mit KI',
    description: 'Zeitsparer für deinen Arbeitsalltag',
    fileUrl: '/downloads/productivity-hacks.pdf',
    fileSize: '1.8 MB',
    pages: 25,
  },
}

type DownloadSlug = keyof typeof DOWNLOADS

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const download = DOWNLOADS[slug as DownloadSlug]

  if (!download) {
    return {
      title: 'Download nicht gefunden | KI Tricks',
    }
  }

  return {
    title: `${download.title} herunterladen | KI Tricks`,
    description: download.description,
  }
}

export default async function DownloadPage({ params }: PageProps) {
  const { slug } = await params
  const download = DOWNLOADS[slug as DownloadSlug]

  if (!download) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-16">
          <div className="container max-w-2xl text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Download nicht gefunden
            </h1>
            <p className="text-muted-foreground mb-8">
              Der angeforderte Download existiert nicht oder wurde entfernt.
            </p>
            <Link href="/tricks">
              <Button variant="primary" size="lg">
                Zu den Tricks
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 py-16">
        <div className="container max-w-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Danke für deine Anmeldung! 🎉
            </h1>
            <p className="text-lg text-muted-foreground">
              Dein Guide ist bereit zum Download
            </p>
          </div>

          <BaseCard className="mb-8">
            <div className="text-center p-6">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold text-foreground mb-2">
                {download.title}
              </h2>
              <p className="text-muted-foreground mb-6">
                {download.description}
              </p>

              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-8">
                <span>📄 {download.pages} Seiten</span>
                <span>•</span>
                <span>📦 {download.fileSize}</span>
                <span>•</span>
                <span>🇩🇪 Deutsch</span>
              </div>

              <a
                href={download.fileUrl}
                download
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
              >
                <Download className="w-5 h-5" />
                PDF herunterladen
              </a>

              <p className="text-xs text-muted-foreground mt-4">
                Der Download startet automatisch. Falls nicht, klicke erneut auf den Button.
              </p>
            </div>
          </BaseCard>

          <BaseCard className="bg-muted/50">
            <div className="p-6">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                Was kommt als Nächstes?
              </h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Prüfe deine E-Mails:</strong> Du erhältst eine Bestätigung mit allen Details
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Wöchentlicher Newsletter:</strong> Die neuesten KI-Tricks jeden Montag
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">
                    <strong className="text-foreground">Exklusive Inhalte:</strong> Tipps nur für Newsletter-Abonnenten
                  </span>
                </li>
              </ul>
            </div>
          </BaseCard>

          <div className="text-center mt-8">
            <Link href="/tricks">
              <Button variant="secondary" size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Entdecke alle KI-Tricks
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}