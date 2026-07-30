# IT Management Tools — Backend API

> A centralized platform for managing IT assets, personnel, and organizational structure in mid-to-large enterprises.
>
> #### Other languages:
>
> - [English](./README_EN.md)
> - [Español](./README_ES.md)

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

## Business Model

The system is built around three coordinated domains:

### 1. Context: Organization (`/organization`)

Models the **complete company structure** from three angles:

#### Organization Units (`OrganizationUnit`)

Represent the **physical and legal boundaries** of the company:

- `LegalEntity` — Parent company or holding (e.g. _IT Holdings Inc._)
- `Subsidiary` — Country or regional subsidiary (e.g. _IT Mexico LLC_)
- `Office` — Physical office or building (e.g. _Madrid HQ_)
- `Branch` — Operational branch (e.g. _Floor 3, North Tower_)

> Every physical office carries a **validated timezone**. This drives server maintenance windows, HelpDesk support hours, and on-call coordination across geographies.

#### Management Units (`Management`)

Represent the **functional and hierarchical structure** of IT:

- Each unit has an accountable manager (`managerId`).
- They support deep hierarchies (a Networks team can report to an Infrastructure department).
- The system **enforces cycle-free hierarchies**: a unit cannot report to itself or to any of its own descendants.

#### Employees (`Employee`)

Represent **IT personnel** with attributes relevant to the platform:

- They carry a configurable **IT role** (`ITRole`): DevOps Engineer, SysAdmin, HelpDesk L1, CIO, etc.
- They are linked to both a management unit (functional reporting line) and a physical office (`workingFromId`), answering "where does this person actually sit?"
- They hold a list of **certified skills** (e.g. AWS, Linux, SAP) for intelligent ticket routing.

**Key business invariants enforced by the domain:**

- An active employee **must have** a valid corporate email address.
- An active employee **must belong** to a management unit, unless their role is `CEO` or `CIO`.

#### IT Roles (`ITRole`)

Available roles are configured by the organization itself, providing flexibility to match any internal structure without changing code.

---

### 2. Context: Assets (`/assets`) _(built — pending integration)_

Will manage the inventory of technology assets:

- Hardware (laptops, servers, peripherals)
- Software licenses
- Cloud resources (instances, IPs, domains)

When an asset is **assigned to an employee**, the system emits a **domain event** that automatically updates the employee's profile. This guarantees traceability without tightly coupling both contexts.

---

### Cross-Context Communication: Domain Events

Contexts **never call each other directly**. They communicate by publishing events through a decoupled event bus:

```
[Assets Context]
  Asset.assignTo(employeeId)
       │
       └── publishes → AssetAssignedEvent
                              │
                              ▼
                 [Organization Context]
                   AssetAssignedListener
                          │
                          └── HandleAssetAssignedUseCase
                                  └── Employee.assignAsset(assetId)
```

This architecture allows the **internal bus** (currently `@nestjs/event-emitter`) to be swapped for an external messaging system like **RabbitMQ**, **Kafka**, or **AWS SNS/SQS** by changing only the adapter at `src/shared/infrastructure/event-bus/` — without touching a single line of business logic.

---

## Technical Architecture

The project implements **DDD (Domain-Driven Design)** with **Hexagonal Architecture (Ports & Adapters)** organized as **Vertical Slices** (one directory per business context).

```
src/
├── shared/                         # Shared kernel: DDD primitives and contracts
│   ├── domain/                     # AggregateRoot, ValueObject, EventBus port
│   └── infrastructure/             # NestEventBus adapter, DomainExceptionFilter
└── contexts/
    ├── organization/               # Active context
    │   ├── domain/                 # Entities, Value Objects, Ports, Domain Services
    │   ├── application/            # Use Cases (pure TypeScript, framework-free)
    │   └── infrastructure/         # Controllers, DTOs, InMemory Repositories
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
