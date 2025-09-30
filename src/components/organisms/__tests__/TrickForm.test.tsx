import { render, screen } from '@testing-library/react'
import { TrickForm } from '../TrickForm'

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

  it('renders form inputs', () => {
    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    const titleInput = screen.getByPlaceholderText(/ChatGPT schreibt perfekte Meeting-Notizen/i)
    expect(titleInput).toBeInTheDocument()

    const descriptionInput = screen.getByPlaceholderText(/Mit diesem Trick erstellt ChatGPT/i)
    expect(descriptionInput).toBeInTheDocument()
  })

  it('restores draft from localStorage on mount', () => {
    const draftData = {
      title: 'Restored Title',
      description: 'Restored Description',
      category: 'productivity'
    }
    localStorageMock.setItem('ki-tricks-draft', JSON.stringify(draftData))

    render(<TrickForm onSubmit={mockOnSubmit} isSubmitting={false} />)

    const titleInput = screen.getByPlaceholderText(/ChatGPT schreibt perfekte Meeting-Notizen/i) as HTMLInputElement
    expect(titleInput.value).toBe('Restored Title')
  })
})