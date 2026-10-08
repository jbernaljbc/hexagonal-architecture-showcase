import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'

import { TaskController } from '../../src/infrastructure/adapters/in/http/TaskController.js'
import { createHttpServer } from '../../src/infrastructure/adapters/in/http/HttpServer.js'
import { buildContainer } from '../../src/infrastructure/config/container.js'

describe('Adaptador HTTP', () => {
  let app: ReturnType<typeof createHttpServer>

  beforeEach(() => {
    const { useCases } = buildContainer({ persistence: 'memory' })
    app = createHttpServer(new TaskController(useCases))
  })

  it('crea una tarea con 201', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Aprender arquitectura hexagonal' })

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      title: 'Aprender arquitectura hexagonal',
      status: 'pending',
    })
    expect(typeof response.body.id).toBe('string')
  })

  it('lista las tareas', async () => {
    await request(app).post('/tasks').send({ title: 'Una' })
    await request(app).post('/tasks').send({ title: 'Dos' })

    const response = await request(app).get('/tasks')

    expect(response.status).toBe(200)
    expect(response.body).toHaveLength(2)
  })

  it('completa una tarea', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Completar' })

    const response = await request(app).post(`/tasks/${created.body.id}/complete`)

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('completed')
  })

  it('devuelve 404 si la tarea no existe', async () => {
    const response = await request(app).get('/tasks/no-existe')

    expect(response.status).toBe(404)
    expect(response.body.error).toBe('TaskNotFoundError')
  })

  it('devuelve 400 si el título es inválido', async () => {
    const response = await request(app).post('/tasks').send({ title: '   ' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('InvalidTaskTitleError')
  })

  it('elimina una tarea con 204', async () => {
    const created = await request(app).post('/tasks').send({ title: 'Efímera' })

    const response = await request(app).delete(`/tasks/${created.body.id}`)

    expect(response.status).toBe(204)
  })
})
