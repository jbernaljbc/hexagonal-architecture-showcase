import { Router } from 'express'

import type { TaskController } from './TaskController.js'

/** Define las rutas HTTP y las conecta con el controlador. */
export function createTaskRouter(controller: TaskController): Router {
  const router = Router()

  router.post('/tasks', controller.create)
  router.get('/tasks', controller.list)
  router.get('/tasks/:id', controller.getById)
  router.post('/tasks/:id/complete', controller.complete)
  router.delete('/tasks/:id', controller.remove)

  return router
}
