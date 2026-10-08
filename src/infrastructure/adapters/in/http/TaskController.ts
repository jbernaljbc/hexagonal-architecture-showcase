import type { Request, Response } from 'express'

import { ApplicationError, TaskNotFoundError } from '../../../../application/errors/ApplicationError.js'
import { DomainError } from '../../../../domain/errors/DomainError.js'
import type { TaskUseCases } from '../../../../application/ports/in/ForManagingTasks.js'

/**
 * Adaptador de ENTRADA HTTP.
 *
 * Traduce peticiones HTTP a llamadas a los casos de uso y los resultados a
 * respuestas JSON. Solo conoce los puertos de entrada, nunca el dominio ni
 * la persistencia. Los handlers son *arrow functions* para conservar `this`.
 */
export class TaskController {
  constructor(private readonly useCases: TaskUseCases) {}

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.useCases.createTask.execute({
        title: req.body?.title,
      })

      res.status(201).json(task)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  list = async (_req: Request, res: Response): Promise<void> => {
    try {
      const tasks = await this.useCases.listTasks.execute()

      res.status(200).json(tasks)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.useCases.getTask.execute(String(req.params.id))

      res.status(200).json(task)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  complete = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.useCases.completeTask.execute(String(req.params.id))

      res.status(200).json(task)
    } catch (error) {
      this.handleError(error, res)
    }
  }

  remove = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.useCases.deleteTask.execute(String(req.params.id))

      res.status(204).send()
    } catch (error) {
      this.handleError(error, res)
    }
  }

  private handleError(error: unknown, res: Response): void {
    if (error instanceof TaskNotFoundError) {
      res.status(404).json({ error: error.name, message: error.message })
      return
    }

    if (error instanceof DomainError || error instanceof ApplicationError) {
      res.status(400).json({ error: error.name, message: error.message })
      return
    }

    console.error('Unexpected error handling request', error)
    res.status(500).json({
      error: 'InternalServerError',
      message: 'An unexpected error occurred',
    })
  }
}
