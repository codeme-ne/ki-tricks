import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TrickForm } from '../TrickForm'
import type { KITrick } from '@/lib/types/types'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Mock window.confirm
global.confirm = jest.fn(() => true)

describe('TrickForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    localStorageMock.clear()
    ;(global.confirm as jest.Mock).mockReturnValue(true)
  })

  afterEach(() => {
    localStorageMock.clear()
  })

  it('renders Step 1 by default', () => {
    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    expect(screen.getByText(/Schritt 1/i)).toBeInTheDocument()
    expect(screen.getByText(/Erzähl uns vom Kern deines Tricks/i)).toBeInTheDocument()
  })

  it('saves draft to localStorage on input change', async () => {
    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    const titleInput = screen.getByPlaceholderText(/z.B. "ChatGPT als persönlicher Schreibcoach"/i)
    fireEvent.change(titleInput, { target: { value: 'Test Trick Title' } })

    await waitFor(() => {
      const savedDraft = localStorageMock.getItem('ki-tricks-draft')
      expect(savedDraft).toBeTruthy()
      const parsed = JSON.parse(savedDraft!)
      expect(parsed.title).toBe('Test Trick Title')
    })
  })

  it('restores draft from localStorage on mount', () => {
    const draftData: Partial<KITrick> = {
      title: 'Restored Title',
      description: 'Restored Description',
      category: 'productivity'
    }
    localStorageMock.setItem('ki-tricks-draft', JSON.stringify(draftData))

    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    const titleInput = screen.getByPlaceholderText(/z.B. "ChatGPT als persönlicher Schreibcoach"/i) as HTMLInputElement
    expect(titleInput.value).toBe('Restored Title')
  })

  it('restores draft from localStorage on mount', () => {
    const draftData = {
      title: 'Restored Title',
      description: 'Restored Description',
      category: 'productivity'
    }
    localStorageMock.setItem('ki-tricks-draft', JSON.stringify(draftData))

    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    const titleInput = screen.getByPlaceholderText(/z.B. "ChatGPT als persönlicher Schreibcoach"/i) as HTMLInputElement
    expect(titleInput.value).toBe('Restored Title')
  })
})