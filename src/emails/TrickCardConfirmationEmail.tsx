import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface TrickCardConfirmationEmailProps {
  email: string
  userName?: string
  trickTitle: string
  month: number
  year: number
  price: number
  dashboardLink?: string
}

export const TrickCardConfirmationEmail = ({
  email,
  userName,
  trickTitle,
  month,
  year,
  price = 100,
  dashboardLink = 'https://ki-tricks.com/dashboard',
}: TrickCardConfirmationEmailProps) => {
  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ]

  const monthName = monthNames[month - 1]
  const previewText = `Bestätigung: Trick-Karten Reservierung für ${monthName} ${year}`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={h1}>✅ Reservierung bestätigt!</Heading>
          </Section>

          {/* Greeting */}
          <Text style={paragraph}>
            Hallo {userName || email.split('@')[0]},
          </Text>

          <Text style={paragraph}>
            Vielen Dank für deine Trick-Karten Reservierung! Deine Werbeschaltung wurde erfolgreich gebucht.
          </Text>

          {/* Reservation Details */}
          <Section style={detailsSection}>
            <Heading as="h2" style={h2}>
              📋 Reservierungsdetails
            </Heading>

            <div style={detailRow}>
              <Text style={detailLabel}>Trick-Karte:</Text>
              <Text style={detailValue}>{trickTitle}</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Zeitraum:</Text>
              <Text style={detailValue}>{monthName} {year}</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Preis:</Text>
              <Text style={detailValue}>{price}€ / Monat</Text>
            </div>

            <div style={detailRow}>
              <Text style={detailLabel}>Status:</Text>
              <Text style={detailValueGreen}>✅ Aktiv</Text>
            </div>
          </Section>

          {/* What's Next */}
          <Section style={section}>
            <Heading as="h3" style={h3}>
              Wie geht es weiter?
            </Heading>
            <ul style={list}>
              <li style={listItem}>
                Deine Trick-Karte wird ab dem <strong>1. {monthName} {year}</strong> prominent auf der Platform angezeigt
              </li>
              <li style={listItem}>
                Du erhältst wöchentliche Performance-Reports per E-Mail
              </li>
              <li style={listItem}>
                Im Dashboard kannst du jederzeit Statistiken einsehen und Anpassungen vornehmen
              </li>
            </ul>

            <Button style={button} href={dashboardLink}>
              Zum Dashboard →
            </Button>
          </Section>

          {/* Tips Section */}
          <Section style={tipsSection}>
            <Heading as="h3" style={h3}>
              💡 Tipps für maximale Performance
            </Heading>
            <ul style={list}>
              <li style={listItem}>Halte deine Trick-Beschreibung aktuell und detailliert</li>
              <li style={listItem}>Füge konkrete Beispiele und Anwendungsfälle hinzu</li>
              <li style={listItem}>Nutze aussagekräftige Titel mit relevanten Keywords</li>
              <li style={listItem}>Reagiere auf User-Feedback in den Kommentaren</li>
            </ul>
          </Section>

          <Hr style={hr} />

          {/* Support */}
          <Section style={section}>
            <Text style={paragraph}>
              Hast du Fragen zu deiner Reservierung? Unser Support-Team hilft dir gerne:
            </Text>
            <Text style={centerText}>
              <Link href="mailto:support@ki-tricks.com" style={link}>
                support@ki-tricks.com
              </Link>
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Diese E-Mail wurde an {email} gesendet.
            </Text>
            <Text style={footerText}>
              <Link href={dashboardLink} style={link}>
                Dashboard
              </Link>
              {' • '}
              <Link href="https://ki-tricks.com/hilfe/trick-karten" style={link}>
                Hilfe
              </Link>
              {' • '}
              <Link href="https://ki-tricks.com/datenschutz" style={link}>
                Datenschutz
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

const detailsSection = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  margin: '20px',
  padding: '24px',
}

const tipsSection = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fcd34d',
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
  margin: '0 0 20px',
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

const centerText = {
  color: '#525252',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
  textAlign: 'center' as const,
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

const detailRow = {
  display: 'flex',
  justifyContent: 'space-between',
  borderBottom: '1px solid #e2e8f0',
  paddingBottom: '12px',
  marginBottom: '12px',
}

const detailLabel = {
  color: '#64748b',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
}

const detailValue = {
  color: '#1a1a1a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'right' as const,
}

const detailValueGreen = {
  color: '#16a34a',
  fontSize: '14px',
  fontWeight: '600',
  margin: '0',
  textAlign: 'right' as const,
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

export default TrickCardConfirmationEmail