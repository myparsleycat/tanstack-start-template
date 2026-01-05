import { createFileRoute } from '@tanstack/react-router'
import { createIsomorphicFn } from '@tanstack/react-start'
import { treaty } from '@elysiajs/eden'
import { app } from '@/server'
import ky from 'ky'

const handle = ({ request }: { request: Request }) => app.fetch(request)

export const Route = createFileRoute('/api/$')({
    server: {
        handlers: {
            GET: handle,
            POST: handle
        }
    }
})

export const getTreaty = createIsomorphicFn()
    .server(() => treaty(app, { fetcher: ky }).api)
    .client(() => treaty<typeof app>('localhost:3000', { fetcher: ky }).api) 