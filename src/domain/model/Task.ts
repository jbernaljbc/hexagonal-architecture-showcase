import { TaskAlreadyCompletedError } from '../errors/DomainError.js'

import { TaskId } from './TaskId.js'
import { TaskStatus } from './TaskStatus.js'
import { TaskTitle } from './TaskTitle.js'

/**
 * Entidad raíz del dominio.
 *
 * Toda la lógica de negocio de una tarea vive aquí. La entidad no conoce
 * nada sobre persistencia, HTTP ni la consola: solo aplica sus invariantes.
 */
export interface TaskProps {
  id: TaskId
  title: TaskTitle
  status: TaskStatus
  createdAt: Date
  updatedAt: Date
}

export interface CreateTaskInput {
  title: string
  id?: TaskId
}

export interface TaskPrimitives {
  id: string
  title: string
  status: TaskStatus
  createdAt: string
  updatedAt: string
}

export class Task {
  private props: TaskProps

  private constructor(props: TaskProps) {
    this.props = props
  }

  static create(input: CreateTaskInput): Task {
    const now = new Date()

    return new Task({
      id: input.id ?? TaskId.generate(),
      title: TaskTitle.create(input.title),
      status: TaskStatus.Pending,
      createdAt: now,
      updatedAt: now,
    })
  }

  static fromPrimitives(props: TaskProps): Task {
    return new Task({ ...props })
  }

  get id(): TaskId {
    return this.props.id
  }

  get title(): TaskTitle {
    return this.props.title
  }

  get status(): TaskStatus {
    return this.props.status
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get updatedAt(): Date {
    return this.props.updatedAt
  }

  isCompleted(): boolean {
    return this.props.status === TaskStatus.Completed
  }

  rename(title: string): void {
    this.props.title = TaskTitle.create(title)
    this.touch()
  }

  complete(): void {
    if (this.isCompleted()) {
      throw new TaskAlreadyCompletedError(
        `Task "${this.id.toString()}" is already completed`,
      )
    }

    this.props.status = TaskStatus.Completed
    this.touch()
  }

  toPrimitives(): TaskPrimitives {
    return {
      id: this.props.id.toString(),
      title: this.props.title.toString(),
      status: this.props.status,
      createdAt: this.props.createdAt.toISOString(),
      updatedAt: this.props.updatedAt.toISOString(),
    }
  }

  private touch(): void {
    this.props.updatedAt = new Date()
  }
}
