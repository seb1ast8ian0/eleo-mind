export interface Settings {
  initialStock: number
  minimumStock: number
}

const SETTINGS_KEY = "eleo_mind_settings"

const isBrowser = () => typeof window !== "undefined"

export function loadSettings(): Settings | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as Partial<Settings>
    const initialStock = Number(data.initialStock)
    const minimumStock = Number(data.minimumStock)
    if (
      Number.isFinite(initialStock) && initialStock >= 0 &&
      Number.isFinite(minimumStock) && minimumStock >= 0
    ) {
      return { initialStock, minimumStock }
    }
    return null
  } catch {
    return null
  }
}

export function saveSettings(settings: Settings): void {
  if (!isBrowser()) return
  const sanitized: Settings = {
    initialStock: Math.max(0, Math.floor(settings.initialStock)),
    minimumStock: Math.max(0, Math.floor(settings.minimumStock)),
  }
  window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(sanitized))
}

export function updateSettings(partial: Partial<Settings>): Settings {
  const current = loadSettings() ?? { initialStock: 0, minimumStock: 0 }
  const next: Settings = {
    initialStock: partial.initialStock ?? current.initialStock,
    minimumStock: partial.minimumStock ?? current.minimumStock,
  }
  saveSettings(next)
  return next
}

export function getInitialStock(): number | null {
  const s = loadSettings()
  return s ? s.initialStock : null
}

export function getMinimumStock(): number | null {
  const s = loadSettings()
  return s ? s.minimumStock : null
}

