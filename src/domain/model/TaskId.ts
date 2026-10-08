import { randomUUID } from 'node:crypto'

import { InvalidTaskIdError } from '../errors/DomainError.js'

/**
 * Value Object que representa el identificador de una tarea.
 *
 * Es inmutable y garantiza que nunca contenga un valor vacío.
 */
export class TaskId {
  private constructor(private readonly value: string) {}

  static create(value: string): TaskId {
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw new InvalidTaskIdError('TaskId cannot be empty')
    }

    return new TaskId(value.trim())
  }

  static generate(): TaskId {
    return new TaskId(randomUUID())
  }

  toString(): string {
    return this.value
  }

  equals(other: TaskId): boolean {
    return this.value === other.value
  }
}
