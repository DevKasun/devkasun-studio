import { useEffect, useState } from 'react'
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

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'system') delete root.dataset.theme
  else root.dataset.theme = theme
  const dark =
    theme === 'dark' || (theme === 'system' && matchMedia(themeQuery).matches)
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', themeColors[dark ? 'dark' : 'light'])
}

export function ThemeSwitch() {
  const [current, setCurrent] = useState<Theme>('system')
  const next = themes[(themes.indexOf(current) + 1) % themes.length]
  const labels = site.ui.theme
  const label = labels.label(labels[current], labels[next])

  useEffect(() => {
    const media = matchMedia(themeQuery)
    const sync = () => {
      const saved = document.documentElement.dataset.theme
      const theme = saved && isTheme(saved) ? saved : 'system'
      applyTheme(theme)
      setCurrent(theme)
    }
    const onStorage = (event: StorageEvent) => {
      if (event.key !== themeStorageKey && event.key !== null) return
      const theme =
        event.newValue && isTheme(event.newValue) ? event.newValue : 'system'
      applyTheme(theme)
      setCurrent(theme)
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
    <button
      type="button"
      className="theme-switch"
      aria-label={label}
      title={label}
      onClick={() => {
        applyTheme(next)
        setCurrent(next)
        try {
          localStorage.setItem(themeStorageKey, next)
        } catch {
          // Keep the current page usable if the browser blocks storage.
        }
      }}
    >
      <Monitor className="theme-system" size={16} aria-hidden="true" />
      <Moon className="theme-dark" size={16} aria-hidden="true" />
      <Sun className="theme-light" size={16} aria-hidden="true" />
    </button>
  )
}
