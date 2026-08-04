# IT Management Tools — Backend API

> A centralized platform for managing IT assets, personnel, and organizational structure in mid-to-large enterprises.
>
> #### Other languages:
>
> - [English](./docs/README/README_EN.md)
> - [Español](./docs/README/README_ES.md)

---

## What Problem Does It Solve?

In most organizations, the IT department operates **in the dark**:

- Who has laptop `SN-8821` assigned to them right now?
- How many software licenses are sitting unused at the Madrid office?
- When an employee is offboarded, does anyone know which devices, accounts, and accesses they had?
- Who needs to approve a server purchase for the Mexico subsidiary?

**IT Management Tools** answers these questions by providing a unified system of record where people, departments, physical locations, and technology assets are connected in a coherent, auditable, and scalable way.

---

## Project Goal

Build the **backend for an enterprise IT management platform** that serves as the **Single Source of Truth** for:

| Domain           | Business question it answers                                                   |
| ---------------- | ------------------------------------------------------------------------------ |
| **Organization** | How is the company structured? Who is accountable for each area?               |
| **People**       | Who are the IT staff, what are their roles, and where do they work from?       |
| **Assets**       | What equipment, licenses, and tech resources exist, and who has them?          |
| **Access**       | _(upcoming)_ What permissions, credentials, and systems can each person use?   |
| **Support**      | _(upcoming)_ Who should handle a ticket based on area, location, and schedule? |

---

## Technical Architecture

The project implements **DDD (Domain-Driven Design)** with **Hexagonal Architecture (Ports & Adapters)** organized as **Vertical Slices** (one directory per business context).

```
src/
├── shared/                         # Shared Kernel: primitives DDD and contracts
│   ├── domain/                     # AggregateRoot, ValueObject, EventBus port
│   └── infrastructure/             # NestEventBus adapter, DomainExceptionFilter
└── contexts/
    ├── organization/               # Active context
    │   ├── domain/                 # Domain Layer
    │   │   ├── enums/              # Domain Enums
    │   │   ├── models/             # Entities and Value Objects
    │   │   ├── ports/              # Output ports (interfaces)
    │   │   ├── services/           # Domain Services
    │   │   └── value-objects/      # Value Objects
    │   ├── application/            # Application Layer
    │   │   └── use-cases/          # Use Cases
    │   │   ├── commands (WIP)
    │   │   └── queries (WIP)
    │   └── infrastructure/         # Infrastructure Layer
    │       ├── adapters/           # Repositories (e.g.: InMemoryRepository)
    │       ├── controllers/        # Controllers HTTP (e.g.: EmployeesController)
    │       └── dtos/               # Input DTOs (e.g.: CreateEmployeeDto)
    └── assets/                     # Isolated context (ready to integrate)
```

> See [`docs/architecture.md`](./docs/architecture.md) for the full breakdown of every file type and inter-layer dependency rules.

---

## Tech Stack

| Layer             | Technology                                                |
| ----------------- | --------------------------------------------------------- |
| Runtime           | Node.js + TypeScript                                      |
| HTTP Framework    | NestJS                                                    |
| Input Validation  | `class-validator` + `class-transformer`                   |
| API Documentation | Swagger / OpenAPI 3.0                                     |
| Event Bus         | `@nestjs/event-emitter` (swappable for RabbitMQ / Kafka)  |
| Persistence       | In-Memory (pluggable with TypeORM, Prisma, MongoDB, etc.) |

---

## Quick Start

```bash
# Install dependencies
npm install

# Development mode (hot-reload)
npm run start:dev

# Build and run in production
npm run build && npm run start:prod
```

The interactive API documentation will be available at:

```
http://localhost:3000/api
```

---

## Roadmap

- [x] `Organization` context — Employees, Management Units, Organization Units, IT Roles
- [x] Hexagonal Architecture + DDD + Vertical Slices
- [x] Decoupled domain event bus
- [x] Two-layer validation (DTO + Domain) with Swagger
- [ ] `Assets` context integration with cross-context events
- [ ] Real persistence layer (TypeORM + PostgreSQL)
- [ ] `Access` context — Permissions and credential management
- [ ] `Support` context — HelpDesk ticketing with timezone-aware and skills-based assignment
- [ ] Authentication & Authorization (JWT + RBAC)
