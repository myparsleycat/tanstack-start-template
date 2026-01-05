import { Elysia } from 'elysia'

export const app = new Elysia({ prefix: '/api' })
    .get('/', 'Hello Elysia!')
