import express, { type Express } from 'express'

import type { TaskController } from './TaskController.js'
import { createTaskRouter } from './routes.js'

/** Construye y devuelve la aplicación Express (sin levantarla). */
export function createHttpServer(controller: TaskController): Express {
  const app = express()

  app.use(express.json())
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' })
  })
  app.use(createTaskRouter(controller))

  return app
}
