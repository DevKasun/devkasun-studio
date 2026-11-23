export const themeStorageKey = 'devkasun-theme'
export const themeColors = { light: '#f3f1ec', dark: '#171719' } as const
export const themeQuery = '(prefers-color-scheme: dark)'
export const themes = ['system', 'light', 'dark'] as const

export type Theme = (typeof themes)[number]

export function isTheme(value: string): value is Theme {
  return themes.some((theme) => theme === value)
}

// This script runs before the stylesheet so a saved choice applies on first paint.
export const themeBootScript = `(() => {
  let choice;
  try { choice = localStorage.getItem('${themeStorageKey}'); } catch {}
  if (choice === 'dark' || choice === 'light') document.documentElement.dataset.theme = choice;
  const dark = choice === 'dark' || (choice !== 'light' && matchMedia('${themeQuery}').matches);
  document.querySelector('meta[name="theme-color"]').content = dark ? '${themeColors.dark}' : '${themeColors.light}';
})();`
