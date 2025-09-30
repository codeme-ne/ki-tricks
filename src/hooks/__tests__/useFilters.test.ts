import { renderHook, act } from '@testing-library/react'
import { useFilters } from '../useFilters'

// Mock Next.js router
const mockPush = jest.fn()
const mockSearchParams = {
  get: jest.fn(() => null)
}

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  }),
  useSearchParams: () => mockSearchParams,
  usePathname: () => '/tricks'
}))

describe('useFilters', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams.get.mockReturnValue(null)
  })

  it('initializes with empty filters when no URL params', () => {
    const { result } = renderHook(() => useFilters())

    // Wait for loading to complete
    act(() => {
      // Trigger state update
    })

    expect(result.current.filters).toBeDefined()
    expect(result.current.filters.categories).toEqual([])
    expect(result.current.filters.search).toBe('')
  })

  it('provides update functions', () => {
    const { result } = renderHook(() => useFilters())

    expect(typeof result.current.updateFilters).toBe('function')
    expect(typeof result.current.toggleCategory).toBe('function')
    expect(typeof result.current.clearFilters).toBe('function')
  })

  it('has isLoading state', () => {
    const { result } = renderHook(() => useFilters())

    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('parses search param from URL', () => {
    mockSearchParams.get.mockImplementation((key: string) => {
      if (key === 'search') return 'test query'
      return null
    })

    const { result } = renderHook(() => useFilters())

    act(() => {
      // Wait for effect
    })

    expect(result.current.filters.search).toBe('test query')
  })
})