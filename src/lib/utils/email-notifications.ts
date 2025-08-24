// Import emailjs dynamically to support both client and server
let emailjs: any = null

// Dynamically import emailjs only in client-side environment
const getEmailJs = async () => {
  if (typeof window !== 'undefined' && !emailjs) {
    emailjs = (await import('@emailjs/browser')).default
  }
  return emailjs
}

interface AdminNotificationData {
  trickTitle: string
  trickDescription: string
  trickCategory: string
  trickDifficulty: string
  submissionTime: string
  adminUrl: string
}

interface EmailConfig {
  serviceId: string
  templateId: string
  publicKey: string
  adminEmail: string
}

class EmailNotificationService {
  private config: EmailConfig | null = null
  private isInitialized = false

  private initializeConfig(): EmailConfig | null {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID 
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'zangerl.luk@gmail.com'

    if (!serviceId || !templateId || !publicKey) {
      return null
    }

    return {
      serviceId,
      templateId,
      publicKey,
      adminEmail
    }
  }

  private async initialize(): Promise<boolean> {
    if (this.isInitialized) return this.config !== null

    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      this.isInitialized = true
      return false
    }

    this.config = this.initializeConfig()
    
    if (this.config) {
      try {
        const emailjsLib = await getEmailJs()
        if (emailjsLib) {
          emailjsLib.init(this.config.publicKey)
          this.isInitialized = true
          return true
        }
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error)
        this.config = null
      }
    }
    
    this.isInitialized = true
    return false
  }

  async sendAdminNotification(data: AdminNotificationData): Promise<boolean> {
    const initialized = await this.initialize()
    if (!initialized || !this.config) {
      return false
    }

    try {
      const emailjsLib = await getEmailJs()
      if (!emailjsLib) {
        return false
      }

      await emailjsLib.send(
        this.config.serviceId,
        this.config.templateId,
        {
          to_email: this.config.adminEmail,
          subject: `Neuer KI-Trick eingereicht: ${data.trickTitle}`,
          message: this.formatAdminNotification(data),
          from_name: 'KI-Tricks Platform',
          from_email: 'noreply@ki-tricks.de'
        }
      )

      return true
    } catch (error) {
      console.error('Failed to send admin notification:', error)
      return false
    }
  }

  private formatAdminNotification(data: AdminNotificationData): string {
    return `
Ein neuer KI-Trick wurde zur Moderation eingereicht:

📝 Titel: ${data.trickTitle}

📋 Beschreibung: 
${data.trickDescription}

🏷️ Kategorie: ${data.trickCategory}
📊 Schwierigkeit: ${data.trickDifficulty}
⏰ Eingereicht am: ${data.submissionTime}

👉 Zur Moderation: ${data.adminUrl}

Diese Nachricht wurde automatisch von der KI-Tricks Platform generiert.
    `.trim()
  }

  async testConnection(): Promise<boolean> {
    const initialized = await this.initialize()
    if (!initialized || !this.config) {
      return false
    }

    try {
      const emailjsLib = await getEmailJs()
      if (!emailjsLib) {
        return false
      }

      await emailjsLib.send(
        this.config.serviceId,
        this.config.templateId,
        {
          to_email: this.config.adminEmail,
          subject: 'Test: EmailJS Konfiguration',
          message: 'Dies ist eine Test-E-Mail um zu überprüfen, ob EmailJS korrekt konfiguriert ist.',
          from_name: 'KI-Tricks Platform Test',
          from_email: 'test@ki-tricks.de'
        }
      )
      return true
    } catch (error) {
      console.error('EmailJS test failed:', error)
      return false
    }
  }
}

// Singleton instance
export const emailNotificationService = new EmailNotificationService()

// Helper function for easy use in API routes
export async function sendNewTrickNotification(trickData: {
  title: string
  description: string
  category: string
}): Promise<boolean> {
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/tricks/pending`
  
  return await emailNotificationService.sendAdminNotification({
    trickTitle: trickData.title,
    trickDescription: trickData.description,
    trickCategory: trickData.category,
    submissionTime: new Date().toLocaleString('de-DE'),
    adminUrl
  })
}