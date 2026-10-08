import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import type { ForPersistingTasks } from '../../../application/ports/out/ForPersistingTasks.js'
import { Task } from '../../../domain/model/Task.js'
import { TaskId } from '../../../domain/model/TaskId.js'
import type { TaskStatus } from '../../../domain/model/TaskStatus.js'
import { TaskTitle } from '../../../domain/model/TaskTitle.js'

interface StoredTask {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

/**
 * Adaptador de SALIDA basado en un fichero JSON.
 *
 * Implementa el MISMO puerto que el repositorio en memoria. Cambiar de uno a
 * otro es transparente para el dominio y los casos de uso: basta con
 * instanciar el adaptador deseado en el *composition root*.
 */
export class FileTaskRepository implements ForPersistingTasks {
  private readonly filePath: string

  constructor(filePath: string) {
    this.filePath = resolve(filePath)
  }

  async save(task: Task): Promise<void> {
    const tasks = await this.readAll()
    const primitives = task.toPrimitives()
    const index = tasks.findIndex((stored) => stored.id === primitives.id)

    if (index >= 0) {
      tasks[index] = primitives
    } else {
      tasks.push(primitives)
    }

    await this.writeAll(tasks)
  }

  async findById(id: TaskId): Promise<Task | null> {
    const tasks = await this.readAll()
    const found = tasks.find((stored) => stored.id === id.toString())

    return found ? this.toDomain(found) : null
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.readAll()

    return tasks.map((stored) => this.toDomain(stored))
  }

  async delete(id: TaskId): Promise<void> {
    const tasks = await this.readAll()
    const remaining = tasks.filter((stored) => stored.id !== id.toString())

    await this.writeAll(remaining)
  }

  private async readAll(): Promise<StoredTask[]> {
    try {
      const content = await readFile(this.filePath, 'utf8')

      if (content.trim().length === 0) {
        return []
      }

      return JSON.parse(content) as StoredTask[]
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        return []
      }

      throw error
    }
  }

  private async writeAll(tasks: StoredTask[]): Promise<void> {
    await mkdir(dirname(this.filePath), { recursive: true })
    await writeFile(this.filePath, `${JSON.stringify(tasks, null, 2)}\n`, 'utf8')
  }

  private toDomain(stored: StoredTask): Task {
    return Task.fromPrimitives({
      id: TaskId.create(stored.id),
      title: TaskTitle.create(stored.title),
      status: stored.status,
      createdAt: new Date(stored.createdAt),
      updatedAt: new Date(stored.updatedAt),
    })
  }
}
