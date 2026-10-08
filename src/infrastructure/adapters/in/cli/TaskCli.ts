import type { TaskUseCases } from '../../../../application/ports/in/ForManagingTasks.js'

/**
 * Adaptador de ENTRADA de línea de comandos.
 *
 * Consume EXACTAMENTE los mismos casos de uso que el adaptador HTTP. Esta es
 * la prueba viva de que la aplicación es independiente del mecanismo de
 * entrega: solo cambia la forma de invocarla.
 */
export class TaskCli {
  constructor(private readonly useCases: TaskUseCases) {}

  async run(args: string[]): Promise<void> {
    const [command, ...rest] = args

    switch (command) {
      case 'create':
        return this.create(rest)
      case 'list':
        return this.list()
      case 'get':
        return this.get(rest)
      case 'complete':
        return this.complete(rest)
      case 'delete':
        return this.remove(rest)
      default:
        this.printUsage()
    }
  }

  private async create(args: string[]): Promise<void> {
    const title = args.join(' ').trim()

    if (title.length === 0) {
      console.error('Usage: npm run cli -- create "<title>"')
      process.exitCode = 1
      return
    }

    const task = await this.useCases.createTask.execute({ title })
    console.log(`Created task ${task.id}`)
    console.log(JSON.stringify(task, null, 2))
  }

  private async list(): Promise<void> {
    const tasks = await this.useCases.listTasks.execute()

    if (tasks.length === 0) {
      console.log('No tasks yet. Create one with: npm run cli -- create "My task"')
      return
    }

    for (const task of tasks) {
      const mark = task.status === 'completed' ? '[x]' : '[ ]'
      console.log(`${mark} ${task.id}  ${task.title}`)
    }
  }

  private async get(args: string[]): Promise<void> {
    const id = this.requireId(args, 'get')

    if (id === null) {
      return
    }

    const task = await this.useCases.getTask.execute(id)
    console.log(JSON.stringify(task, null, 2))
  }

  private async complete(args: string[]): Promise<void> {
    const id = this.requireId(args, 'complete')

    if (id === null) {
      return
    }

    const task = await this.useCases.completeTask.execute(id)
    console.log(`Completed: ${task.title}`)
  }

  private async remove(args: string[]): Promise<void> {
    const id = this.requireId(args, 'delete')

    if (id === null) {
      return
    }

    await this.useCases.deleteTask.execute(id)
    console.log(`Deleted task ${id}`)
  }

  private requireId(args: string[], command: string): string | null {
    const [id] = args

    if (!id) {
      console.error(`Usage: npm run cli -- ${command} <task-id>`)
      process.exitCode = 1
      return null
    }

    return id
  }

  private printUsage(): void {
    console.log(
      [
        'Task CLI - hexagonal architecture showcase',
        '',
        'Usage:',
        '  npm run cli -- list',
        '  npm run cli -- create "<title>"',
        '  npm run cli -- get <task-id>',
        '  npm run cli -- complete <task-id>',
        '  npm run cli -- delete <task-id>',
      ].join('\n'),
    )
  }
}
