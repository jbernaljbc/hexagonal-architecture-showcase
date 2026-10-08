import { TaskCli } from './infrastructure/adapters/in/cli/TaskCli.js'
import { createHttpServer } from './infrastructure/adapters/in/http/HttpServer.js'
import { TaskController } from './infrastructure/adapters/in/http/TaskController.js'
import { buildContainer } from './infrastructure/config/container.js'

/**
 * Punto de entrada.
 *
 * Decide qué adaptador de entrada arrancar. Ambos comparten el mismo
 * contenedor de casos de uso, construido una sola vez.
 *
 *   npm run dev                     -> adaptador HTTP
 *   npm run cli -- <comando> ...    -> adaptador CLI
 */
async function main(): Promise<void> {
  const [, , mode, ...rest] = process.argv
  const { useCases } = buildContainer()

  if (mode === 'cli') {
    await new TaskCli(useCases).run(rest)
    return
  }

  const app = createHttpServer(new TaskController(useCases))
  const port = Number(process.env.PORT ?? 3000)

  app.listen(port, () => {
    console.log(`HTTP adapter listening on http://localhost:${port}`)
    console.log('Try: curl http://localhost:' + port + '/tasks')
  })
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error)
  console.error(`Error: ${message}`)
  process.exitCode = 1
})
