# ⚙️ GitHub Copilot Developer Setup

> Guía para configurar **GitHub Copilot** y sus agentes de asistencia dentro del proyecto **Reservations API (NestJS)**

---

## 🎯 Objetivo

Este archivo sirve como **instrucción de contexto** para Copilot y los agentes de IA que colaboren en el proyecto.  
Debe ayudar a generar código **alineado con la arquitectura, estilo y convenciones del proyecto**.

---

## 🧩 Contexto general

- Proyecto: `Reservations API`
- Framework: `NestJS`
- Lenguaje: `TypeScript`
- Paradigma: `Clean Architecture` + `SOLID`
- ORM: `Prisma`
- DB: `PostgreSQL`
- Cache / Locks: `Redis`
- Seguridad: `JWT + RBAC`
- Infraestructura: `Docker Compose`
- Tests: `Jest`
- Documentación: `Swagger`

---

## 🧱 Estilo y convenciones

- Usar **nombres descriptivos y consistentes**
- Evitar lógica de negocio en controladores → derivar a `services`
- Validar todos los DTOs con `class-validator`
- Manejar errores mediante excepciones Nest (`BadRequestException`, `ConflictException`, etc.)
- Estructurar módulos según `feature-based folders`
- Respetar principios SOLID
- Tipar todo (sin `any`)
- Retornar respuestas uniformes:
  ```ts
  {
    success: boolean;
    message?: string;
    data?: any;
  }
  ```
- Prefijar endpoints REST según convención:
  - `/auth`, `/users`, `/properties`, `/units`, `/reservations`, `/holds`, `/availability`

---

## 🧠 Reglas para agentes Copilot

1. Respetar el dominio del negocio.
2. No generar código genérico, sino adaptado al proyecto.
3. Documentar endpoints con Swagger.
4. Usar dependencias internas (`PrismaService`, `RedisService`, `ConfigService`).
5. Nomenclatura de commits: `feat()`, `fix()`, etc.
6. Priorizar consistencia antes que performance prematura.
7. Incluir tests unitarios o e2e.

---

## 🧭 Ejemplo de flujo correcto

> Crear un endpoint para generar un Hold (reserva temporal)

1. DTO: validar fechas, unitId, tenantId.
2. Service:
   - Lock en Redis.
   - Verificar disponibilidad.
   - Guardar Hold en DB con TTL.
3. Controller:
   - `@Post('/holds')`
   - Retornar `{ success: true, holdId, expiresAt }`.
4. Test e2e con rango válido y solapado.

---

## 🧰 Dependencias esenciales

- `@nestjs/common`, `@nestjs/core`, `@nestjs/config`
- `@nestjs/swagger`
- `@nestjs/jwt`, `passport`, `passport-jwt`
- `@nestjs/throttler`
- `@prisma/client`, `prisma`
- `ioredis`
- `class-validator`, `class-transformer`
- `pino`, `pino-pretty`
- `jest`, `supertest`

---

## 🧑‍💻 Ejemplo de prompt para Copilot

> “Crea un DTO CreateReservationDto con validaciones usando class-validator y define los campos: unitId, checkIn, checkOut, guestName, guestEmail. checkOut debe ser mayor que checkIn.”

---

## ✅ Resultado esperado

El código generado por Copilot debe:
- Ser coherente con el resto del proyecto.
- Mantener buenas prácticas de arquitectura.
- Evitar repetición innecesaria.
- Estar listo para testing y mantenimiento.
