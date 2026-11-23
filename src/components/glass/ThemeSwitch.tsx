import { useEffect, useRef } from 'react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { site } from '../../config/site'
import {
  isTheme,
  themeColors,
  themeQuery,
  themes,
  themeStorageKey,
  type Theme,
} from '../../lib/theme'

export function ThemeSwitch() {
  const select = useRef<HTMLSelectElement>(null)
  const { label, ...labels } = site.ui.theme

  function apply(theme: Theme) {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
    if (select.current) select.current.value = theme
    const dark =
      theme === 'dark' || (theme === 'system' && matchMedia(themeQuery).matches)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', themeColors[dark ? 'dark' : 'light'])
  }

  useEffect(() => {
    const media = matchMedia(themeQuery)
    const sync = () => {
      const saved = document.documentElement.dataset.theme
      apply(saved && isTheme(saved) ? saved : 'system')
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== themeStorageKey && event.key !== null) return
      apply(
        event.newValue && isTheme(event.newValue) ? event.newValue : 'system',
      )
    }
    sync()
    media.addEventListener('change', sync)
    window.addEventListener('storage', onStorage)
    return () => {
      media.removeEventListener('change', sync)
      window.removeEventListener('storage', onStorage)
    }
  }, [])

  return (
    <span className="theme-switch">
      <Monitor className="theme-system" size={16} aria-hidden="true" />
      <Moon className="theme-dark" size={16} aria-hidden="true" />
      <Sun className="theme-light" size={16} aria-hidden="true" />
      <select
        ref={select}
        aria-label={label}
        title={label}
        defaultValue="system"
        onChange={(event) => {
          const theme = event.currentTarget.value
          if (!isTheme(theme)) return
          apply(theme)
          try {
            localStorage.setItem(themeStorageKey, theme)
          } catch {
            // Keep the current page usable if the browser blocks storage.
          }
        }}
      >
        {themes.map((theme) => (
          <option value={theme} key={theme}>
            {labels[theme]}
          </option>
        ))}
      </select>
    </span>
  )
}
