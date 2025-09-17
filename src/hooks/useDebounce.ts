import { useState, useEffect } from 'react'

/**
 * Hook für Debouncing von Werten
 * @param value - Der zu debouncende Wert
 * @param delay - Verzögerung in Millisekunden
 * @returns Der gedebouncte Wert
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook für Debouncing von Callback-Funktionen
 * @param callback - Die zu debouncende Funktion
 * @param delay - Verzögerung in Millisekunden
 * @param deps - Abhängigkeiten für den Callback
 * @returns Die gedebouncte Funktion
 */
export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number,
  deps: React.DependencyList = []
): T {
  const [debouncedCallback, setDebouncedCallback] = useState<T>(() => callback)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCallback(() => callback)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [callback, delay, deps])

  return debouncedCallback
}