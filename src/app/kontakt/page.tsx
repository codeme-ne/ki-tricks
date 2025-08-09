'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { PageContainer } from '@/components/layout'
import { Button, BackButton } from '@/components/atoms'
import { Send, Mail, Github, CheckCircle } from 'lucide-react'
import emailjs from '@emailjs/browser'

// Metadata wird bei Client Components nicht direkt unterstützt
// Wir müssen dies in eine separate Server Component auslagern oder anders lösen

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // EmailJS initialisieren falls nicht schon geschehen
      if (process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY) {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
      }
      
      // Email senden
      if (process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID && 
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID) {
        await emailjs.send(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_email: 'zangerl.luk@gmail.com'
          }
        )
        
        setIsSubmitted(true)
        // Reset form nach 3 Sekunden
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: '', email: '', subject: '', message: '' })
        }, 3000)
      } else {
        // Fallback wenn EmailJS nicht konfiguriert
        alert('Das Kontaktformular ist noch nicht konfiguriert. Bitte sende eine E-Mail an zangerl.luk@gmail.com')
      }
    } catch (error) {
      console.error('Fehler beim Senden der E-Mail:', error)
      alert('Fehler beim Senden der Nachricht. Bitte versuche es später erneut.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <BackButton />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">Kontakt</h1>
        <p className="text-lg text-neutral-600 mb-8">
          Hast du Fragen, Feedback oder möchtest einen neuen KI-Trick vorschlagen? Ich freue mich von dir zu hören!
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Kontaktformular */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Nachricht senden</h2>
            
            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <p className="text-green-800 font-medium">Vielen Dank für deine Nachricht!</p>
                <p className="text-green-600 text-sm mt-1">Ich melde mich so schnell wie möglich bei dir.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Dein Name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                    E-Mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="deine@email.de"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                    Betreff *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    placeholder="Worum geht es?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                    Nachricht *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors resize-none"
                    placeholder="Deine Nachricht..."
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Wird gesendet...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Nachricht senden
                    </>
                  )}
                </Button>

                <p className="text-xs text-neutral-500 mt-4">
                  * Pflichtfelder. Deine Daten werden vertraulich behandelt und nur zur Bearbeitung deiner Anfrage verwendet.
                </p>
              </form>
            )}
          </div>

          {/* Direkte Kontaktinformationen */}
          <div>
            <h2 className="text-xl font-semibold mb-6 text-center">Direkter Kontakt</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <Mail className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">E-Mail</h3>
                <a 
                  href="mailto:zangerl.luk@gmail.com" 
                  className="text-primary-600 hover:underline"
                >
                  zangerl.luk@gmail.com
                </a>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-3">
                  <Github className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="font-medium text-neutral-900 mb-2">GitHub</h3>
                <a 
                  href="https://github.com/codeme-ne" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline"
                >
                  @codeme-ne
                </a>
              </div>
            </div>

            <div className="mt-8 p-6 bg-neutral-50 rounded-lg">
              <h3 className="font-medium text-neutral-900 mb-2">Feedback & Vorschläge</h3>
              <p className="text-sm text-neutral-600">
                Du hast einen tollen KI-Trick entdeckt oder Verbesserungsvorschläge für die Plattform? 
                Ich freue mich über jedes Feedback! Gemeinsam machen wir die KI Tricks Platform zur 
                besten Ressource für praktische KI-Anwendungen.
              </p>
            </div>

            <div className="mt-6 p-6 bg-primary-50 border border-primary-200 rounded-lg">
              <h3 className="font-medium text-primary-900 mb-2">Zusammenarbeit</h3>
              <p className="text-sm text-primary-700">
                Interessiert an einer Zusammenarbeit? Ob Content-Partnerschaften, technische 
                Integrationen oder gemeinsame Projekte - lass uns darüber sprechen, wie wir die 
                KI-Community gemeinsam voranbringen können.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}