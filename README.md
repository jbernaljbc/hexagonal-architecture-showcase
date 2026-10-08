# Hexagonal Architecture Showcase (TypeScript)

Proyecto didáctico que demuestra la **Arquitectura Hexagonal** (también
conocida como *Puertos y Adaptadores*) con un caso de uso sencillo: la gestión
de tareas (*Todo*).

La idea central es simple: **la lógica de negocio no debe depender de la
tecnología**. El dominio vive en el centro y todo lo demás (HTTP, CLI, base de
datos, sistema de ficheros) se conecta a través de **puertos** y **adaptadores**
intercambiables.

---

## El hexágono

```
                        ┌───────────────────────────────────────────┐
                        │              APLICACIÓN                    │
   ADAPTADORES          │  (casos de uso + puertos)                  │     ADAPTADORES
   DE ENTRADA           │                                           │     DE SALIDA
                        │   ┌───────────────────────────────────┐   │
 ┌───────────┐  puerto  │   │            DOMINIO                │   │  puerto   ┌───────────┐
 │   HTTP    │──────────┼──▶│  Task · TaskId · TaskTitle        │◀──┼──────────▶│ In-Memory │
 │  (Express)│  entrada │   │  TaskStatus · reglas de negocio   │   │  salida   │ Repository│
 └───────────┘          │   └───────────────────────────────────┘   │           └───────────┘
                        │                                           │
 ┌───────────┐  puerto  │                                           │  puerto   ┌───────────┐
 │   CLI     │──────────┼───────────────────────────────────────────┼──────────▶│   File    │
 │ (terminal)│  entrada │                                           │  salida   │ Repository│
 └───────────┘          └───────────────────────────────────────────┘           └───────────┘
```

- **Dominio** (`src/domain`): entidades y *value objects*. No importa nada externo.
- **Aplicación** (`src/application`): casos de uso y **puertos** (interfaces).
- **Infraestructura** (`src/infrastructure`): **adaptadores** que implementan los puertos y el *composition root*.

### Regla de dependencia

Las flechas de dependencia **siempre apuntan hacia dentro**:

```
infrastructure  ──▶  application  ──▶  domain
```

El dominio no conoce la aplicación; la aplicación no conoce la infraestructura.
La inversión se logra mediante interfaces (los puertos).

---

## Estructura del proyecto

```
src/
├── domain/                          # Núcleo: sin dependencias
│   ├── model/
│   │   ├── Task.ts                  # Entidad raíz con sus invariantes
│   │   ├── TaskId.ts                # Value Object
│   │   ├── TaskTitle.ts             # Value Object
│   │   └── TaskStatus.ts
│   └── errors/
│       └── DomainError.ts
│
├── application/                     # Contratos y orquestación
│   ├── ports/
│   │   ├── in/ForManagingTasks.ts   # Puertos de ENTRADA (driving)
│   │   └── out/ForPersistingTasks.ts# Puerto de SALIDA (driven)
│   ├── dto/                         # Objetos de salida serializables
│   ├── errors/ApplicationError.ts
│   └── usecases/                    # Implementación de los casos de uso
│       ├── CreateTaskUseCase.ts
│       ├── ListTasksUseCase.ts
│       ├── GetTaskUseCase.ts
│       ├── CompleteTaskUseCase.ts
│       └── DeleteTaskUseCase.ts
│
├── infrastructure/                  # Adaptadores (detalles reemplazables)
│   ├── adapters/
│   │   ├── in/
│   │   │   ├── http/                # Adaptador de entrada HTTP
│   │   │   └── cli/                 # Adaptador de entrada CLI
│   │   └── out/
│   │       ├── InMemoryTaskRepository.ts
│   │       └── FileTaskRepository.ts
│   └── config/container.ts          # Composition root
│
└── main.ts                          # Selecciona el adaptador de entrada
```

---

## Requisitos

- Node.js >= 20
- npm

## Instalación

```bash
npm install
```

## Scripts

| Script | Descripción |
|---|---|
| `npm run dev` | Arranca el adaptador HTTP con recarga automática |
| `npm start` | Arranca el adaptador HTTP (una vez) |
| `npm run cli -- <cmd>` | Ejecuta el adaptador CLI |
| `npm test` | Ejecuta todos los tests |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Tests con cobertura |
| `npm run typecheck` | Comprueba tipos sin emitir |
| `npm run build` | Compila a `dist/` |

---

## Uso: adaptador HTTP

```bash
npm run dev
```

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Comprobación de salud |
| `POST` | `/tasks` | Crea una tarea (`{ "title": "..." }`) |
| `GET` | `/tasks` | Lista tareas |
| `GET` | `/tasks/:id` | Obtiene una tarea |
| `POST` | `/tasks/:id/complete` | Marca como completada |
| `DELETE` | `/tasks/:id` | Elimina una tarea |

Ejemplo con `curl`:

```bash
curl -s -X POST localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Aprender arquitectura hexagonal"}'

curl -s localhost:3000/tasks
curl -s -X POST localhost:3000/tasks/<id>/complete
```

## Uso: adaptador CLI

```bash
npm run cli -- list
npm run cli -- create "Aprender puertos y adaptadores"
npm run cli -- get <task-id>
npm run cli -- complete <task-id>
npm run cli -- delete <task-id>
```

> El CLI y la API HTTP consumen **los mismos casos de uso**. Esa es la prueba
> de que la lógica de negocio está desacoplada del mecanismo de entrada.

---

## Persistencia intercambiable

El puerto de salida `ForPersistingTasks` tiene dos implementaciones:

- `InMemoryTaskRepository` (por defecto).
- `FileTaskRepository` (JSON en disco).

Elige el adaptador **sin tocar el dominio ni los casos de uso**, mediante la
variable de entorno `PERSISTENCE`:

```bash
# Persistencia en memoria (por defecto)
npm run dev

# Persistencia en fichero JSON
PERSISTENCE=file npm run dev

# Personaliza la ruta del fichero
PERSISTENCE=file TASKS_FILE=./data/tasks.json npm run cli -- list
```

Todo el cableado ocurre en `src/infrastructure/config/container.ts`
(el *composition root*).

---

## Principios demostrados

- **Dominio puro**: `Task` no importa Express, `fs` ni nada de infraestructura.
- **Puertos**: interfaces que definen *qué* se necesita, no *cómo* se hace.
- **Adaptadores intercambiables**: HTTP/CLI por un lado, memoria/fichero por otro.
- **Inversión de dependencias**: la infraestructura depende de la aplicación.
- **Testabilidad**: los casos de uso se prueban con un repositorio in-memory,
  sin levantar servidores ni bases de datos.
