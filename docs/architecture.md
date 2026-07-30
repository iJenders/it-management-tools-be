# Architecture Documentation: DDD Hexagonal Architecture with Vertical Slicing

This document outlines the architectural guidelines, layout, and constraints for the project.

The codebase implements **Domain-Driven Design (DDD)** using **Hexagonal Architecture (Ports & Adapters)**, structured into **Vertical Slices (Bounded Contexts)**.

---

## 1. Core Architectural Layers

```mermaid
graph TD
    subgraph Infrastructure Layer (Adapters)
        Controllers[HTTP Controllers]
        RepositoriesImpl[Repository Implementations]
    end

    subgraph Application Layer (Use Cases)
        UseCases[Use Cases]
    end

    subgraph Domain Layer (Pure Business Logic)
        Entities[Entities & Aggregate Roots]
        VO[Value Objects]
        Ports[Repository & Service Ports]
        Services[Domain Services]
    end

    Controllers --> UseCases
    UseCases --> Entities
    UseCases --> Ports
    UseCases --> Services
    RepositoriesImpl -.->|Implements| Ports
```

### Layer Definitions:

- **Domain Layer (Core)**: Pure business logic with **zero external dependencies**. Contains aggregate roots, entities, value objects, domain services, and repository port interfaces.
- **Application Layer**: Orchestrates execution flow. Contains use cases that call domain entities and repositories via ports. Framework-independent.
- **Infrastructure Layer**: Concrete implementations of ports (adapters) like database repositories, controllers, and NestJS modules.

---

## 2. Organization Context Structure

The `organization` context is a vertical slice (`src/contexts/organization/`) containing 3 aggregate roots:

### A. Employee Aggregate Root

- **Description**: Represents the identity, IT role, capabilities, and location of an employee.
- **Value Objects**:
  - `PersonalInformation`: Groups `firstName`, `lastName`, optional `Email`, and `Phone` array.
  - `Email`: Validates corporate format (requires domain extension like `@company.com` or `@corporate.com`).
  - `Phone`: Validates phone format.
- **Domain Invariants**:
  - Un empleado no puede crearse sin un email corporativo válido.
  - Un empleado activo debe estar asignado obligatoriamente a una gerencia (`managementId`), a menos que tenga el rol técnico de `CEO` o `CIO`.

### B. Management (Gerencia) Aggregate Root

- **Description**: Defines hierarchy, and approval ownership.
- **Value Objects**:
  - `ManagementName`: Minimum 3 characters.
- **Domain Invariants**:
  - Evitar ciclos jerárquicos: Una gerencia no puede reportar a sí misma ni a una gerencia que sea descendiente suya.

### C. OrganizationUnit Aggregate Root

- **Description**: Represents physical locations (offices, branches) and legal entities.
- **Value Objects**:
  - `GeographicLocation`: Coordinates physical location (`country`, `city`, `address`).
  - `TimeZone`: Runtime-validated timezone string (using `Intl`).
- **Domain Invariants**:
  - Una sede física (`Office`) debe tener asociada una zona horaria válida.
  - Evitar ciclos jerárquicos.

---

## 3. Directory Layout

The directory structure is organized as follows:

```
src/contexts/organization/
├── organization.module.ts         # NestJS Module configuring DI
├── domain/                        # Pure Domain Logic
│   ├── enums/                     # Domain enums (EmployeeStatus, OrganizationType)
│   ├── value-objects/             # Immutable Value Objects (Email, GeographicLocation, etc.)
│   ├── models/                    # Aggregate Roots (Employee, Management, OrganizationUnit, ITRole)
│   ├── ports/                     # Outbound Port Interfaces (Repository interfaces)
│   └── services/                  # Domain Services (HierarchyValidatorService)
├── application/                   # Pure Application Use Cases
│   └── use-cases/                 # CreateEmployee, CreateManagement, etc.
└── infrastructure/                # Infrastructure / Adapters
    ├── adapters/                  # InMemory repositories
    └── controllers/               # HTTP REST Controllers
```

---

## 4. Architectural Constraints & Rules

1. ❌ **No Framework imports in Domain/Application**: No NestJS decorators (`@Injectable()`, etc.) are allowed inside `domain/` and `application/` subfolders. Use NestJS module factories (`useFactory`) to inject dependencies.
2. ❌ **Aggregate Encapsulation**: Aggregates reference each other **only by ID**, never by reference to the full object (e.g., `Management` holds `managerId: string` and `organizationId: string`).
3. ❌ **Self-Contained Invariants**: Business logic invariants must be validated inside the constructor or methods of the Aggregate Root or Value Objects.
