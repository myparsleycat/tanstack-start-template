import { createServerFn } from "@tanstack/react-start"
import { getCookie, setCookie } from "@tanstack/react-start/server"
import * as z from "zod"

const themeValidator = z.union([
    z.literal("light"),
    z.literal("dark"),
    z.literal("system")
])
export type Theme = z.infer<typeof themeValidator>
const storageKey = "_preferred-theme"

export const getThemeServerFn = createServerFn().handler(async () => {
    const cookieValue = getCookie(storageKey)
    return (cookieValue || "system") as Theme
})

export const setThemeServerFn = createServerFn({ method: "POST" })
    .inputValidator(themeValidator)
    .handler(async ({ data }) => {
        setCookie(storageKey, data, {
            path: "/",
            maxAge: 31536000,
        })
    })