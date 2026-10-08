import { describe, expect, it } from 'vitest'

import { TaskAlreadyCompletedError } from '../../../src/domain/errors/DomainError.js'
import { Task } from '../../../src/domain/model/Task.js'
import { TaskStatus } from '../../../src/domain/model/TaskStatus.js'

describe('Task (dominio)', () => {
  it('crea una tarea pendiente con identificador propio', () => {
    const task = Task.create({ title: 'Escribir tests' })

    expect(task.status).toBe(TaskStatus.Pending)
    expect(task.isCompleted()).toBe(false)
    expect(task.id.toString()).not.toHaveLength(0)
    expect(task.title.toString()).toBe('Escribir tests')
  })

  it('completa una tarea y actualiza el estado', () => {
    const task = Task.create({ title: 'Completar el showcase' })

    task.complete()

    expect(task.isCompleted()).toBe(true)
    expect(task.status).toBe(TaskStatus.Completed)
  })

  it('no permite completar dos veces la misma tarea', () => {
    const task = Task.create({ title: 'Solo una vez' })
    task.complete()

    expect(() => task.complete()).toThrow(TaskAlreadyCompletedError)
  })

  it('se serializa a primitivos', () => {
    const task = Task.create({ title: 'Serializar' })

    expect(task.toPrimitives()).toMatchObject({
      title: 'Serializar',
      status: TaskStatus.Pending,
    })
  })
})
