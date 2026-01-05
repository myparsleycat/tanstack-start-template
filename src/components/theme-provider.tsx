import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "@tanstack/react-router"
import { setThemeServerFn, type Theme } from "@/lib/theme"
import { isNil } from "es-toolkit"

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined)

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: React.ReactNode
  initialTheme: Theme
}) {
  const [theme, setThemeState] = useState<Theme>(initialTheme)
  const router = useRouter()

  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = () => {
      root.classList.remove("light", "dark")

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        root.classList.add(systemTheme)
        root.style.colorScheme = systemTheme
        return
      }

      root.classList.add(theme)
      root.style.colorScheme = theme
    }

    applyTheme()

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => applyTheme()
      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])

  const setTheme = async (nextTheme: Theme) => {
    setThemeState(nextTheme)
    await setThemeServerFn({ data: nextTheme })
    router.invalidate()
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (isNil(context)) throw new Error("useTheme must be used within a ThemeProvider")
  return context
}