# Architecture Documentation: DDD Hexagonal Architecture with Vertical Slicing

This document outlines the architectural guidelines, layout, and constraints for the project. 

The codebase implements **Domain-Driven Design (DDD)** using **Hexagonal Architecture (Ports & Adapters)**, structured into **Vertical Slices (Bounded Contexts)**, and communicating asynchronously through **Events**.

---

## 1. Core Architectural Patterns

```mermaid
graph TD
    subgraph Infrastructure Layer (Adapters)
        Controllers[HTTP Controllers]
        Listeners[Event Listeners]
        RepositoriesImpl[Repository Implementations]
    end

    subgraph Application Layer (Use Cases / Handlers)
        UseCases[Use Cases]
    end

    subgraph Domain Layer (Pure Business Logic)
        Entities[Entities & Aggregate Roots]
        VO[Value Objects]
        Ports[Repository & Service Ports]
        Events[Domain Events]
    end

    Controllers --> UseCases
    Listeners --> UseCases
    UseCases --> Entities
    UseCases --> Ports
    RepositoriesImpl -.->|Implements| Ports
    UseCases -.->|Publishes via| Ports
```

### Hexagonal Architecture (Ports & Adapters)
- **Domain Layer (Core)**: The heart of the business logic. Contains entities, aggregate roots, value objects, domain events, and ports (interfaces). **It must have zero external library or framework dependencies** (no NestJS, no ORM, no HTTP dependencies).
- **Application Layer**: Contains use cases (application services) that orchestrate flow. It executes business logic by interacting with domain aggregates and calling outbound ports. It is also framework-independent.
- **Infrastructure Layer**: Contains concrete implementations of ports (adapters) like database repositories, event emitter bindings, controllers, and NestJS modules. It handles the outside world and wires the system together.

### Vertical Slicing
Instead of grouping files by technical layer at the root (all controllers, all services, etc.), the system is sliced by business capabilities (Bounded Contexts) inside `src/contexts/`. Each context contains its own Domain, Application, and Infrastructure layers.

### Context Communication via Events
Bounded Contexts must remain decoupled:
- **No direct references**: A context must not import another context's use cases or repositories.
- **Asynchronous Events**: Communication between contexts must happen via events. One context publishes a domain event to the `EventBus` port, and other contexts listen to this event using event listeners in their infrastructure layer.

---

## 2. Directory & File Structure

Each bounded context under `src/contexts/<context-name>/` is structured as follows:

```
src/contexts/<context-name>/
├── <context-name>.module.ts       # NestJS module wiring the context dependencies
├── domain/                         # Domain Layer (Pure TypeScript)
│   ├── models/                    # Aggregate roots, Entities, Value Objects
│   │   └── <entity>.ts
│   ├── events/                    # Domain Events specific to this context
│   │   └── <name>.event.ts
│   └── ports/                     # Outbound Port Interfaces (e.g. Repository interfaces)
│       └── <entity>-repository.interface.ts
├── application/                    # Application Layer (Pure TypeScript)
│   └── use-cases/                 # Coordinate business operations
│       └── <use-case>.use-case.ts
└── infrastructure/                 # Infrastructure Layer (NestJS / Framework)
    ├── adapters/                  # Outbound Adapters (DB repositories, third-party clients)
    │   └── in-memory-<entity>.repository.ts
    ├── controllers/               # Inbound HTTP Adapters (REST controllers)
    │   └── <entity>.controller.ts
    └── listeners/                 # Inbound Event Adapters (listening to other contexts)
        └── <name>.listener.ts
```

---

## 3. Detailed File Type Specifications

### Domain Layer Files

#### 1. Aggregate Roots / Entities (`domain/models/`)
Classes containing business attributes and rules. 
- *Rule*: Must extend `AggregateRoot` from the shared kernel if they emit domain events.
- *Rule*: State changes must happen through domain methods (e.g. `assignTo()`), not direct property setters.

#### 2. Domain Events (`domain/events/`)
Lightweight, immutable data transfer objects capturing a state change that happened in the domain.
- *Rule*: Must implement `DomainEvent`.
- *Rule*: Named in the past tense (e.g., `AssetAssignedEvent`).

#### 3. Ports (`domain/ports/`)
TypeScript interfaces defining outbound operations required by the domain/use-cases (e.g., querying/saving entities).
- *Rule*: Placed in `ports/` and implemented in the infrastructure layer.

### Application Layer Files

#### 4. Use Cases (`application/use-cases/`)
Perform use-case orchestration (fetch aggregate, perform action, save aggregate, publish events).
- *Rule*: Constructor injection of ports only.
- *Rule*: Completely decoupled from NestJS decorators (`@Injectable`, etc.). Wired in the Module using factories.

### Infrastructure Layer Files

#### 5. Repository Adapters (`infrastructure/adapters/`)
Implement the repository ports defined in the domain layer using database clients or in-memory tables.
- *Rule*: Decorated with `@Injectable()` from NestJS.

#### 6. Controllers (`infrastructure/controllers/`)
Map HTTP endpoints to application use cases.
- *Rule*: Inject use cases directly and extract HTTP payload/params.

#### 7. Event Listeners (`infrastructure/listeners/`)
Catch global events dispatched through the event bus and forward them to internal use cases.
- *Rule*: Use `@OnEvent('<event-name>')` to handle events emitted across contexts.

---

## 4. Shared Kernel (`src/shared/`)

Common primitives shared across all bounded contexts:
- `shared/domain/models/aggregate-root.ts`: Tracks and manages domain events.
- `shared/domain/models/value-object.ts`: Base class for structural equality.
- `shared/domain/events/domain-event.interface.ts`: Basic interface for events.
- `shared/domain/events/event-bus.interface.ts`: The Port for event publishing.
- `shared/infrastructure/event-bus/nest-event-bus.ts`: Adapter implementing the event bus port using NestJS `@nestjs/event-emitter`.

---

## 5. Architectural Violations Checklist

To ensure long-term maintainability, the following are strictly prohibited:
1. ❌ **Do not import NestJS modules, decorators, or classes in `domain` or `application` folders.** (Exceptions: basic type-safety library interfaces if absolutely needed).
2. ❌ **Do not import any class from `src/contexts/context-A` into `src/contexts/context-B`** (except event classes for type-safety inside listeners).
3. ❌ **Do not bypass the Use Case.** Controllers must invoke Use Cases, never domain entities or repositories directly.
4. ❌ **Do not query another context's database table directly.** Request info or coordinate via Events.
