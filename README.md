# Hexagonal Architecture Showcase (TypeScript)

An educational project that demonstrates **Hexagonal Architecture** (also
known as *Ports & Adapters*) through a simple use case: task management
(Todo).

The core idea is simple: **business logic should not depend on technology**.
The domain lives at the center, and everything else (HTTP, CLI, database,
filesystem) connects to it through **ports** and interchangeable **adapters**.

---

## The hexagon

```
                        ┌───────────────────────────────────────────┐
                        │               APPLICATION                  │
   INPUT                │  (use cases + ports)                       │     OUTPUT
   ADAPTERS             │                                            │     ADAPTERS
                        │   ┌───────────────────────────────────┐   │
 ┌───────────┐  input   │   │              DOMAIN               │   │  output   ┌───────────┐
 │   HTTP    │──────────┼──▶│  Task · TaskId · TaskTitle        │◀──┼──────────▶│ In-Memory │
 │  (Express)│  port    │   │  TaskStatus · business rules      │   │  port     │ Repository│
 └───────────┘          │   └───────────────────────────────────┘   │           └───────────┘
                        │                                            │
 ┌───────────┐  input   │                                            │  output   ┌───────────┐
 │   CLI     │──────────┼────────────────────────────────────────────┼──────────▶│   File    │
 │ (terminal)│  port    │                                            │  port     │ Repository│
 └───────────┘          └───────────────────────────────────────────┘            └───────────┘
```

- **Domain** (`src/domain`): entities and *value objects*. Imports nothing external.
- **Application** (`src/application`): use cases and **ports** (interfaces).
- **Infrastructure** (`src/infrastructure`): **adapters** that implement the ports, plus the *composition root*.

### Dependency rule

Dependencies **always point inward**:

```
infrastructure  ──▶  application  ──▶  domain
```

The domain knows nothing about the application; the application knows nothing
about the infrastructure. The inversion is achieved through interfaces (ports).

---

## Project structure

```
src/
├── domain/                          # Core: no dependencies
│   ├── model/
│   │   ├── Task.ts                  # Root entity with its invariants
│   │   ├── TaskId.ts                # Value Object
│   │   ├── TaskTitle.ts             # Value Object
│   │   └── TaskStatus.ts
│   └── errors/
│       └── DomainError.ts
│
├── application/                     # Contracts and orchestration
│   ├── ports/
│   │   ├── in/ForManagingTasks.ts   # INPUT ports (driving)
│   │   └── out/ForPersistingTasks.ts# OUTPUT port (driven)
│   ├── dto/                         # Serializable output objects
│   ├── errors/ApplicationError.ts
│   └── usecases/                    # Use case implementations
│       ├── CreateTaskUseCase.ts
│       ├── ListTasksUseCase.ts
│       ├── GetTaskUseCase.ts
│       ├── CompleteTaskUseCase.ts
│       └── DeleteTaskUseCase.ts
│
├── infrastructure/                  # Adapters (replaceable details)
│   ├── adapters/
│   │   ├── in/
│   │   │   ├── http/                # HTTP input adapter
│   │   │   └── cli/                 # CLI input adapter
│   │   └── out/
│   │       ├── InMemoryTaskRepository.ts
│   │       └── FileTaskRepository.ts
│   └── config/container.ts          # Composition root
│
└── main.ts                          # Selects the input adapter
```

---

## Requirements

- Node.js >= 20
- npm

## Installation

```bash
npm install
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Starts the HTTP adapter with auto-reload |
| `npm start` | Starts the HTTP adapter (once) |
| `npm run cli -- <cmd>` | Runs the CLI adapter |
| `npm test` | Runs all tests |
| `npm run test:watch` | Tests in watch mode |
| `npm run test:coverage` | Tests with coverage |
| `npm run typecheck` | Type-checks without emitting |
| `npm run build` | Compiles to `dist/` |

---

## Usage: HTTP adapter

```bash
npm run dev
```

| Method | Route | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `POST` | `/tasks` | Creates a task (`{ "title": "..." }`) |
| `GET` | `/tasks` | Lists tasks |
| `GET` | `/tasks/:id` | Gets a task |
| `POST` | `/tasks/:id/complete` | Marks a task as completed |
| `DELETE` | `/tasks/:id` | Deletes a task |

Example with `curl`:

```bash
curl -s -X POST localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Learn hexagonal architecture"}'

curl -s localhost:3000/tasks
curl -s -X POST localhost:3000/tasks/<id>/complete
```

## Usage: CLI adapter

```bash
npm run cli -- list
npm run cli -- create "Learn ports and adapters"
npm run cli -- get <task-id>
npm run cli -- complete <task-id>
npm run cli -- delete <task-id>
```

> The CLI and the HTTP API consume **the same use cases**. That is the proof
> that the business logic is decoupled from the delivery mechanism.

---

## Swappable persistence

The output port `ForPersistingTasks` has two implementations:

- `InMemoryTaskRepository` (default).
- `FileTaskRepository` (JSON on disk).

Pick the adapter **without touching the domain or the use cases**, via the
`PERSISTENCE` environment variable:

```bash
# In-memory persistence (default)
npm run dev

# JSON file persistence
PERSISTENCE=file npm run dev

# Customize the file path
PERSISTENCE=file TASKS_FILE=./data/tasks.json npm run cli -- list
```

All the wiring happens in `src/infrastructure/config/container.ts`
(the *composition root*).

---

## Principles demonstrated

- **Pure domain**: `Task` imports neither Express, `fs`, nor anything from infrastructure.
- **Ports**: interfaces that define *what* is needed, not *how* it is done.
- **Interchangeable adapters**: HTTP/CLI on one side, memory/file on the other.
- **Dependency inversion**: infrastructure depends on the application.
- **Testability**: use cases are tested with an in-memory repository,
  without spinning up servers or databases.
