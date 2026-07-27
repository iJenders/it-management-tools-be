# IT Management Tools — Backend API

> Plataforma centralizada para la gestión de activos, personas y estructura organizacional de TI en empresas medianas y grandes.
> #### Otros idiomas:
> * [English](./README_EN.md)
> * [Español](./README_ES.md)

---

## ¿Qué problema resuelve?

En la mayoría de las organizaciones, el departamento de TI opera **a ciegas**:

- ¿Quién tiene asignado el portátil con número de serie `SN-8821`?
- ¿Cuántas licencias de software están sin usar en la sede de Madrid?
- Cuando un empleado es dado de baja, ¿alguien sabe qué accesos, equipos y cuentas tenía asignados?
- ¿Quién debe aprobar la compra de un servidor para la filial de México?

**IT Management Tools** resuelve estas preguntas proporcionando un sistema de registro unificado donde la estructura de personas, gerencias, sedes y activos tecnológicos están conectados de forma coherente, auditable y escalable.

---

## Objetivo del Proyecto

Construir el **backend de una plataforma de gestión de TI empresarial** que sirva como fuente de verdad (`Single Source of Truth`) para:

| Dominio | Pregunta de negocio que responde |
|---|---|
| **Organización** | ¿Cómo está estructurada la empresa? ¿Quién es el responsable de cada área? |
| **Personas** | ¿Quiénes son los empleados de TI, cuáles son sus roles y desde dónde trabajan? |
| **Activos** | ¿Qué equipos, licencias y recursos tecnológicos existen y a quién están asignados? |
| **Accesos** | *(próximamente)* ¿Qué permisos, credenciales y sistemas puede usar cada persona? |
| **Soporte** | *(próximamente)* ¿Quién debe atender un ticket según el área, la sede y el horario? |

---

## Arquitectura Técnica

El proyecto implementa **DDD (Domain-Driven Design)** con **Arquitectura Hexagonal (Puertos y Adaptadores)** organizado en **Vertical Slices** (un directorio por contexto de negocio).

```
src/
├── shared/                         # Kernel compartido: primitivos DDD y contratos
│   ├── domain/                     # AggregateRoot, ValueObject, EventBus port
│   └── infrastructure/             # NestEventBus adapter, DomainExceptionFilter
└── contexts/
    ├── organization/               # Contexto activo
    │   ├── domain/                 # Entidades, VOs, Puertos, Servicios de Dominio
    │   ├── application/            # Casos de Uso (puro TypeScript, sin framework)
    │   └── infrastructure/         # Controllers, DTOs, Repositorios InMemory
    └── assets/                     # Contexto aislado (listo para integrar)
```

> Consulta [`docs/architecture.md`](./docs/architecture.md) para el detalle completo de cada tipo de archivo y las restricciones de dependencia entre capas.

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework HTTP | NestJS |
| Validación de entrada | `class-validator` + `class-transformer` |
| Documentación API | Swagger / OpenAPI 3.0 |
| Bus de eventos | `@nestjs/event-emitter` (reemplazable por RabbitMQ/Kafka) |
| Persistencia actual | In-Memory (adaptable a TypeORM, Prisma, MongoDB, etc.) |

---

## Inicio Rápido

```bash
# Instalar dependencias
npm install

# Modo desarrollo (hot-reload)
npm run start:dev

# Compilar y ejecutar en producción
npm run build && npm run start:prod
```

La documentación interactiva de la API estará disponible en:

```
http://localhost:3000/api
```

---

## Roadmap

- [x] Contexto `Organization` — Empleados, Gerencias, Unidades Organizativas, Roles de TI
- [x] Arquitectura Hexagonal + DDD + Vertical Slices
- [x] Eventos de dominio con bus desacoplado
- [x] Validación en dos capas (DTO + Dominio) con Swagger
- [ ] Integración del contexto `Assets` con eventos cruzados
- [ ] Persistencia real (TypeORM + PostgreSQL)
- [ ] Contexto `Access` — Gestión de accesos y permisos
- [ ] Contexto `Support` — Tickets de HelpDesk con asignación inteligente por zona horaria y skills
- [ ] Autenticación y autorización (JWT + RBAC)
