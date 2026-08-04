# Architecture Documentation: DDD Hexagonal Architecture with Vertical Slicing

This document outlines the architectural guidelines, layout, and constraints for the project.

The codebase implements **Domain-Driven Design (DDD)** using **Hexagonal Architecture (Ports & Adapters)**, structured into **Vertical Slices (Bounded Contexts)**.

---

## Layer Definitions:

- **Domain Layer (Core)**: Pure business logic with zero external dependencies. Contains aggregate roots, entities, value objects, domain services, domain events, domain exceptions, and repository/service port interfaces.
- **Application Layer**: Orchestrates execution flow via Commands and Queries. Uses domain entities, value objects, and ports to execute application use cases. Can dispatch domain events or publish messages via Event Publisher ports.
- **Infrastructure Layer**: Concrete implementations of ports (adapters) like database repositories, controllers, event buses/message brokers (e.g. EventEmitter, RabbitMQ), NestJS modules, and external library integrations.

---

## Directory Layout

The codebase is organized by Bounded Contexts (Vertical Slices) under `src/contexts/<context_name>/` and shared cross-cutting modules under `src/shared/`:

```text
src/
├── contexts/
│   └── <context_name>/                   # Bounded Context / Vertical Slice
│       ├── <context_name>.module.ts      # NestJS Module configuring DI factories
│       ├── domain/                       # Pure Domain Layer
│       │   ├── enums/                    # Domain enums
│       │   ├── value-objects/            # Immutable Value Objects
│       │   ├── models/                   # Entities & Aggregate Roots
│       │   ├── ports/                    # Outbound Port Interfaces (Repositories, Services)
│       │   ├── events/                   # Domain Events
│       │   ├── exceptions/               # Domain Exceptions
│       │   └── services/                 # Pure Domain Services
│       ├── application/                  # Pure Application Layer (CQRS & Events)
│       │   ├── commands/                 # Command Use Cases
│       │   │   └── <command-name>/
│       │   │       ├── <command-name>.command.ts # Command DTO
│       │   │       ├── <command-name>.result.ts # Result DTO
│       │   │       └── <command-name>.handler.ts # Command Handler
│       │   ├── queries/                  # Query Use Cases
│       │   │   └── <query-name>/
│       │   │       ├── <query-name>.query.ts   # Query DTO
│       │   │       ├── <query-name>.readmodel.ts # Read Model DTO
│       │   │       └── <query-name>.handler.ts # Query Handler
│       │   └── event-handlers/           # Application Event Subscribers / Listeners
│       │       └── <event-handler-name>.handler.ts
│       └── infrastructure/               # Infrastructure / Adapters Layer
│           ├── adapters/                 # Concrete repository, service & event publisher adapters
│           ├── dtos/                     # Infrastructure DTOs
│           └── controllers/              # Infrastructure Controllers
└── shared/                               # Shared Kernel & Common Adapters
    ├── domain/                           # Shared Domain Abstractions & Ports
    └── infrastructure/                   # Shared Infrastructure Adapters & Modules
```

---

## Architectural Constraints

Hierarchical structure of constraints by layer and component:

### Domain Layer Constraints

- **Framework Independence**: Zero external library or framework imports (no NestJS decorators like `@Injectable()`, ORM decorators, etc.).
- **Zero I/O & Side Effects**: The domain layer must execute purely in memory. No database queries, file system operations, HTTP requests, or direct async I/O.
- **Async Signature Exception**: Method return types are permitted to use `Promise` only to align with port signatures, but internal logic must not execute asynchronous I/O operations.
- **Self-Contained Invariants**: Business logic invariants must be validated inside constructors or methods of Aggregate Roots, Entities, or Value Objects.
- **Aggregate Encapsulation**: Aggregates reference other aggregates exclusively by unique ID (`string`), never by direct object reference.
- **SOLID Principles**: Strict adherence to Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion.
- **Domain Events Definition**: Domain Events represent something significant that happened in the domain (past tense naming, e.g. `EmployeeCreatedEvent`). They are immutable classes located under `domain/events/`. Aggregate roots record domain events when their state mutates.
- **Layer Awareness**: The domain layer must be completely unaware of the Application and Infrastructure layers.

### Application Layer Constraints

- **Framework Independence**: Pure TypeScript logic with zero framework or library decorators. NestJS dependency injection is managed in Infrastructure modules via factory providers (`useFactory`).
- **CQRS Separation**: Use cases are strictly categorized into **Commands** (state modification) and **Queries** (data retrieval).
- **Command & Query Structure**: Every Command or Query must reside in its own directory with the name `<action>` containing:
  - `<action>.command.ts`: Data Transfer Object representing parameters for the command. (Only for Commands)
  - `<action>.result.ts`: Data Transfer Object representing the result of the command. (Only for Commands)
  - `<action>.query.ts`: Data Transfer Object representing parameters for the query. (Only for Queries)
  - `<action>.readmodel.ts`: Data Transfer Object representing the result of the query. (Only for Queries)
  - `<action>.handler.ts`: Use case execution handler.
- **Application DTOs definition**: An application DTOs are the following classes (not interfaces):
  - Commands DTOs: Objects that are passed as arguments to command handlers. (`<action>.command.ts`)
  - Queries DTOs: Objects that are passed as arguments to query handlers. (`<action>.query.ts`)
  - Read Models DTOs: Objects that are returned by query handlers. (`<action>.readmodel.ts`)
  - Result DTOs: Objects that are returned by command handlers. (`<action>.result.ts`)
- **Controlled I/O**: Application handlers can use async/await operations and I/O strictly through domain ports (repositories/adapters).
- **Layer Awareness**: The application layer uses the domain layer and ports, but must be completely unaware of the Infrastructure layer.
- **Use Cases (Commands, Queries) definition**: Use cases are the responsibles to orchestrate the application logic and can be invoked by any component that needs it (e.g. infrastructure layer through controllers or other use cases).
- **Use Cases (Commands, Queries) implementation**: Use cases (Commands, Queries) must be implemented as classes that receive injected ports through their constructors. Use cases (Commands, Queries) must have a method that accepts an instance of the command or query DTO and returns an instance of the result or read model DTO. To ensure sequential execution of use cases, use cases can use async/await operations and I/O strictly through domain ports (repositories/adapters). Command Handlers can trigger events or publish messages to an event bus or message queue, that will be processed by other use cases (Commands, Queries) even in another bounded contexts.
- **Event Publishing & Handling**: Command Handlers extract recorded domain events from Aggregate Roots after executing business operations and publish them via an Event Publisher port (`EventPublisherPort`). Event Handlers (Subscribers/Listeners) can react to domain events to trigger secondary application use-cases asynchronously or across bounded contexts.

### Infrastructure Layer Constraints

- **Dependency Direction**: Implements domain ports and invokes application command/query handlers. Infrastructure depends on Application and Domain, never the reverse.
- **Adapters & Controllers**: Controllers convert HTTP requests into Application Commands/Queries and map execution results to HTTP responses.
- **Event Bus / Broker Adapters**: Event Publishers and Event Listeners are concrete infrastructure adapters (e.g. NestJS `EventEmitter2`, RabbitMQ, Kafka) that implement domain/application event ports.
- **External Integration**: All external libraries, NestJS decorators, database ORMs, HTTP clients, and frameworks are restricted to this layer.

- **Application DTOs Implementation**: Application DTOs (Command, Query, Read Model, Result DTOs) are immutable and are implemented as classes. Application DTOs are not allowed to contain any framework or library specific types, such as TypeScript decorators, decorators from NestJS, classes from ORMs, etc. Application DTOs are meant to be used by the infrastructure layer to consume use-cases (Commands, Queries) and by the application layer to return results (Results, Read Models). Application DTOs are not meant to be used by the domain layer.
- **Infrastructure DTOs Implementation**: Infrastructure DTOs are the DTOs that are used by the infrastructure layer to receive and return data from/to external systems. Infrastructure DTOs are allowed to contain any framework or library specific types, such as TypeScript decorators, decorators from NestJS, classes from ORMs, etc. Infrastructure DTOs are not allowed to be used by the domain layer or the application layer. Infrastructure DTOs must be parsed to Application DTOs before being used by the application layer and parsed from Application DTOs before being returned by the infrastructure layer. In case of creating a new adapter (e.g. for a new external system or communication protocol).
- **Adapters Implementation**: All adapters (database repositories, HTTP clients, file system adapters, etc.) must be implemented as classes in the infrastructure layer. Adapters must implement domain ports and must be called by the application layer (Command/Query Handlers). Adapters must be created by the infrastructure module using factory providers (useFactory) and must be injected into the application layer using dependency injection.
