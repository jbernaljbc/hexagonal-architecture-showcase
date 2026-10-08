import { InvalidTaskTitleError } from '../errors/DomainError.js'

/**
 * Value Object que representa el título de una tarea.
 *
 * Encapsula la invariante: no puede estar vacío ni superar la longitud máxima.
 */
export class TaskTitle {
  static readonly MAX_LENGTH = 120

  private constructor(readonly value: string) {}

  static create(value: string): TaskTitle {
    const trimmed = typeof value === 'string' ? value.trim() : ''

    if (trimmed.length === 0) {
      throw new InvalidTaskTitleError('Task title cannot be empty')
    }

    if (trimmed.length > TaskTitle.MAX_LENGTH) {
      throw new InvalidTaskTitleError(
        `Task title cannot exceed ${TaskTitle.MAX_LENGTH} characters`,
      )
    }

    return new TaskTitle(trimmed)
  }

  toString(): string {
    return this.value
  }
}
