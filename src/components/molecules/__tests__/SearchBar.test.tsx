import { render, screen, fireEvent } from '@testing-library/react'
import { SearchBar } from '../SearchBar'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
  useReducedMotion: () => false
}))

describe('SearchBar', () => {
  const mockOnChange = jest.fn()
  const mockOnDebouncedChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Default Variant', () => {
    it('renders with default placeholder', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      expect(screen.getByPlaceholderText(/Suche nach Tricks, Tools.../i)).toBeInTheDocument()
    })

    it('renders with custom placeholder', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
          placeholder="Custom placeholder"
        />
      )

      expect(screen.getByPlaceholderText('Custom placeholder')).toBeInTheDocument()
    })

    it('calls onChange when typing', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      fireEvent.change(input, { target: { value: 'test query' } })

      expect(mockOnChange).toHaveBeenCalledWith('test query')
    })

    it('triggers immediate search on Enter key press', () => {
      render(
        <SearchBar
          value="test search"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockOnDebouncedChange).toHaveBeenCalledWith('test search')
    })

    it('shows clear button when value is not empty', () => {
      render(
        <SearchBar
          value="test"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const clearButton = screen.getByLabelText(/Suche löschen/i)
      expect(clearButton).toBeInTheDocument()
    })

    it('does not show clear button when value is empty', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const clearButton = screen.queryByLabelText(/Suche löschen/i)
      expect(clearButton).not.toBeInTheDocument()
    })

    it('clears input when clear button is clicked', () => {
      render(
        <SearchBar
          value="test"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const clearButton = screen.getByLabelText(/Suche löschen/i)
      fireEvent.click(clearButton)

      expect(mockOnChange).toHaveBeenCalledWith('')
    })
  })

  describe('Glowing Variant', () => {
    it('renders glowing variant correctly', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
          variant="glowing"
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toBeInTheDocument()
    })

    it('applies Enter key handler in glowing variant', () => {
      render(
        <SearchBar
          value="glowing test"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
          variant="glowing"
        />
      )

      const input = screen.getByRole('textbox')
      fireEvent.keyDown(input, { key: 'Enter' })

      expect(mockOnDebouncedChange).toHaveBeenCalledWith('glowing test')
    })

    it('shows clear button in glowing variant', () => {
      render(
        <SearchBar
          value="test"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
          variant="glowing"
        />
      )

      const clearButton = screen.getByLabelText(/Suche löschen/i)
      expect(clearButton).toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA label for screen readers', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const label = screen.getByLabelText(/Suche nach KI-Tricks/i)
      expect(label).toBeInTheDocument()
    })

    it('has aria-describedby for help text', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-describedby')
    })

    it('has live region for search results', () => {
      render(
        <SearchBar
          value="test"
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const liveRegion = screen.getByText(/Suche nach "test"/i)
      expect(liveRegion).toBeInTheDocument()
    })

    it('has proper autocomplete and spellcheck attributes', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('autocomplete', 'off')
      expect(input).toHaveAttribute('spellcheck', 'false')
    })
  })

  describe('Edge Cases', () => {
    it('handles empty string value', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox') as HTMLInputElement
      expect(input.value).toBe('')
    })

    it('handles undefined onChange callback', () => {
      render(
        <SearchBar
          value=""
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      expect(() => fireEvent.change(input, { target: { value: 'test' } })).not.toThrow()
    })

    it('handles undefined onDebouncedChange callback', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
        />
      )

      const input = screen.getByRole('textbox')
      expect(() => fireEvent.keyDown(input, { key: 'Enter' })).not.toThrow()
    })

    it('handles special characters in search', () => {
      render(
        <SearchBar
          value=""
          onChange={mockOnChange}
          onDebouncedChange={mockOnDebouncedChange}
        />
      )

      const input = screen.getByRole('textbox')
      const specialChars = '@#$%^&*()[]{}|'

      fireEvent.change(input, { target: { value: specialChars } })
      expect(mockOnChange).toHaveBeenCalledWith(specialChars)
    })
  })
})