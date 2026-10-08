import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { Task } from '../../src/domain/model/Task.js'
import { FileTaskRepository } from '../../src/infrastructure/adapters/out/FileTaskRepository.js'

describe('FileTaskRepository (adaptador de salida JSON)', () => {
  let directory: string
  let repository: FileTaskRepository

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'tasks-'))
    repository = new FileTaskRepository(join(directory, 'tasks.json'))
  })

  afterEach(async () => {
    await rm(directory, { recursive: true, force: true })
  })

  it('persiste y recupera una tarea', async () => {
    const task = Task.create({ title: 'Persistirme' })
    await repository.save(task)

    const found = await repository.findById(task.id)

    expect(found).not.toBeNull()
    expect(found?.title.toString()).toBe('Persistirme')
  })

  it('devuelve una lista vacía si el fichero no existe', async () => {
    await expect(repository.findAll()).resolves.toEqual([])
  })

  it('los datos sobreviven a una nueva instancia del repositorio', async () => {
    await repository.save(Task.create({ title: 'Durable' }))

    const freshRepository = new FileTaskRepository(join(directory, 'tasks.json'))
    const tasks = await freshRepository.findAll()

    expect(tasks).toHaveLength(1)
    expect(tasks[0]?.title.toString()).toBe('Durable')
  })

  it('actualiza una tarea existente sin duplicarla', async () => {
    const task = Task.create({ title: 'Original' })
    await repository.save(task)

    task.rename('Renombrada')
    await repository.save(task)

    const tasks = await repository.findAll()

    expect(tasks).toHaveLength(1)
    expect(tasks[0]?.title.toString()).toBe('Renombrada')
  })
})
