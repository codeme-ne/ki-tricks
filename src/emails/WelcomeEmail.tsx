import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface WelcomeEmailProps {
  email: string
  leadMagnet?: string
  downloadLink?: string
}

export const WelcomeEmail = ({
  email,
  leadMagnet = 'Die 50 besten KI-Tricks',
  downloadLink = 'https://ki-tricks.com/download/guide',
}: WelcomeEmailProps) => {
  const previewText = `Willkommen bei KI Tricks, ${email}! Dein Guide wartet auf dich.`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>🎉 Willkommen bei KI Tricks!</Heading>
          </Section>

          {/* Welcome Message */}
          <Text style={paragraph}>
            Hallo {email.split('@')[0]},
          </Text>

          <Text style={paragraph}>
            Vielen Dank für deine Anmeldung bei KI Tricks! Wir freuen uns, dich in unserer Community zu begrüßen.
          </Text>

          {/* Download Section */}
          <Section style={downloadSection}>
            <Heading as="h2" style={h2}>
              📚 {leadMagnet}
            </Heading>
            <Text style={paragraph}>
              Wie versprochen, hier ist dein exklusiver Guide mit den besten KI-Tricks:
            </Text>
            <Button
              style={button}
              href={downloadLink}
            >
              Guide herunterladen →
            </Button>
          </Section>

          {/* What to Expect */}
          <Section style={section}>
            <Heading as="h3" style={h3}>
              Was dich erwartet:
            </Heading>
            <ul style={list}>
              <li style={listItem}>✅ Wöchentliche neue KI-Tricks direkt in dein Postfach</li>
              <li style={listItem}>✅ Praxiserprobte Workflows von Profis</li>
              <li style={listItem}>✅ Exklusive Tipps für Newsletter-Abonnenten</li>
              <li style={listItem}>✅ Keine Werbung, 100% Mehrwert</li>
            </ul>
          </Section>

          {/* Quick Start */}
          <Section style={section}>
            <Heading as="h3" style={h3}>
              Schnellstart:
            </Heading>
            <Text style={paragraph}>
              Entdecke sofort die beliebtesten KI-Tricks auf unserer Platform:
            </Text>
            <div style={linkGrid}>
              <Link href="https://ki-tricks.com/tricks?category=productivity" style={categoryLink}>
                🚀 Produktivität
              </Link>
              <Link href="https://ki-tricks.com/tricks?category=content-creation" style={categoryLink}>
                ✍️ Content-Creation
              </Link>
              <Link href="https://ki-tricks.com/tricks?category=programming" style={categoryLink}>
                💻 Programmierung
              </Link>
              <Link href="https://ki-tricks.com/tricks?category=business" style={categoryLink}>
                📊 Business
              </Link>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Du erhältst diese E-Mail, weil du dich auf{' '}
              <Link href="https://ki-tricks.com" style={link}>
                ki-tricks.com
              </Link>{' '}
              angemeldet hast.
            </Text>
            <Text style={footerText}>
              <Link href="https://ki-tricks.com/unsubscribe?email={email}" style={link}>
                Newsletter abbestellen
              </Link>
              {' • '}
              <Link href="https://ki-tricks.com/datenschutz" style={link}>
                Datenschutz
              </Link>
              {' • '}
              <Link href="https://ki-tricks.com/impressum" style={link}>
                Impressum
              </Link>
            </Text>
            <Text style={footerText}>
              © 2025 KI Tricks Platform. Alle Rechte vorbehalten.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '32px 20px 0',
}

const section = {
  padding: '0 20px',
}

const downloadSection = {
  backgroundColor: '#f4f4f5',
  borderRadius: '8px',
  margin: '20px',
  padding: '24px',
}

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#1a1a1a',
  fontSize: '24px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 16px',
}

const h3 = {
  color: '#1a1a1a',
  fontSize: '20px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '24px 0 16px',
}

const paragraph = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const button = {
  backgroundColor: '#2563eb',
  borderRadius: '8px',
  color: '#fff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '600',
  lineHeight: '1',
  padding: '16px 24px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  margin: '16px 0',
}

const list = {
  paddingLeft: '20px',
  margin: '16px 0',
}

const listItem = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '28px',
  margin: '8px 0',
}

const linkGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  margin: '20px 0',
}

const categoryLink = {
  backgroundColor: '#f4f4f5',
  borderRadius: '6px',
  color: '#1a1a1a',
  display: 'block',
  fontSize: '14px',
  padding: '12px 16px',
  textDecoration: 'none',
  textAlign: 'center' as const,
}

const hr = {
  borderColor: '#e5e5e5',
  margin: '42px 0 26px',
}

const link = {
  color: '#2563eb',
  textDecoration: 'underline',
}

const footer = {
  padding: '0 20px',
}

const footerText = {
  color: '#a3a3a3',
  fontSize: '14px',
  lineHeight: '20px',
  textAlign: 'center' as const,
  margin: '8px 0',
}

export default WelcomeEmail