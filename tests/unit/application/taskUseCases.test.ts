import { beforeEach, describe, expect, it } from 'vitest'

import { TaskNotFoundError } from '../../../src/application/errors/ApplicationError.js'
import { CompleteTaskUseCase } from '../../../src/application/usecases/CompleteTaskUseCase.js'
import { CreateTaskUseCase } from '../../../src/application/usecases/CreateTaskUseCase.js'
import { GetTaskUseCase } from '../../../src/application/usecases/GetTaskUseCase.js'
import { ListTasksUseCase } from '../../../src/application/usecases/ListTasksUseCase.js'
import { InMemoryTaskRepository } from '../../../src/infrastructure/adapters/out/InMemoryTaskRepository.js'

describe('Casos de uso de tareas (con repositorio in-memory)', () => {
  let repository: InMemoryTaskRepository
  let createTask: CreateTaskUseCase
  let listTasks: ListTasksUseCase
  let getTask: GetTaskUseCase
  let completeTask: CompleteTaskUseCase

  beforeEach(() => {
    repository = new InMemoryTaskRepository()
    createTask = new CreateTaskUseCase(repository)
    listTasks = new ListTasksUseCase(repository)
    getTask = new GetTaskUseCase(repository)
    completeTask = new CompleteTaskUseCase(repository)
  })

  it('crea y recupera una tarea', async () => {
    const created = await createTask.execute({ title: 'Aprender puertos y adaptadores' })

    const fetched = await getTask.execute(created.id)

    expect(fetched.id).toBe(created.id)
    expect(fetched.title).toBe('Aprender puertos y adaptadores')
    expect(fetched.status).toBe('pending')
  })

  it('lista las tareas creadas', async () => {
    await createTask.execute({ title: 'Primera' })
    await createTask.execute({ title: 'Segunda' })

    const tasks = await listTasks.execute()

    expect(tasks).toHaveLength(2)
  })

  it('completa una tarea existente', async () => {
    const created = await createTask.execute({ title: 'Completarme' })

    const completed = await completeTask.execute(created.id)

    expect(completed.status).toBe('completed')
  })

  it('lanza TaskNotFoundError si la tarea no existe', async () => {
    await expect(getTask.execute('id-inexistente')).rejects.toThrow(TaskNotFoundError)
  })
})
