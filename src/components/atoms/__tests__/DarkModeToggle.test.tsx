import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { DarkModeToggle } from '../DarkModeToggle'
import { DarkModeProvider } from '@/lib/context/DarkModeContext'

describe('DarkModeToggle', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('renders the toggle button', () => {
    render(
      <DarkModeProvider>
        <DarkModeToggle />
      </DarkModeProvider>
    )

    const button = screen.getByRole('button', { name: /theme/i })
    expect(button).toBeInTheDocument()
  })

  it('toggles dark mode on click', async () => {
    const user = userEvent.setup()

    render(
      <DarkModeProvider>
        <DarkModeToggle />
      </DarkModeProvider>
    )

    const button = screen.getByRole('button', { name: /theme/i })

    // Initially light mode
    expect(document.documentElement.classList.contains('dark')).toBe(false)

    // Click to enable dark mode
    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    // Click again to disable dark mode
    await user.click(button)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('saves theme preference to localStorage', async () => {
    const user = userEvent.setup()

    render(
      <DarkModeProvider>
        <DarkModeToggle />
      </DarkModeProvider>
    )

    const button = screen.getByRole('button', { name: /theme/i })

    // Enable dark mode
    await user.click(button)
    expect(localStorage.getItem('theme')).toBe('dark')

    // Disable dark mode
    await user.click(button)
    expect(localStorage.getItem('theme')).toBe('light')
  })

  it('loads theme from localStorage on mount', () => {
    localStorage.setItem('theme', 'dark')

    render(
      <DarkModeProvider>
        <DarkModeToggle />
      </DarkModeProvider>
    )

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })

  it('respects system preference when no localStorage value exists', () => {
    // Mock matchMedia for dark mode preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-color-scheme: dark)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })

    render(
      <DarkModeProvider>
        <DarkModeToggle />
      </DarkModeProvider>
    )

    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})