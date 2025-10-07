# 🏡 Reservations API – NestJS

> API modular de **reservaciones y disponibilidad en tiempo real**, diseñada con **NestJS** bajo principios de **Clean Architecture** y preparada para evolucionar hacia un **microservicio SaaS multi-tenant**.

---

## 📋 Descripción general

La API permite:
- 📅 Manejo de fechas y zonas horarias (UTC + TZ locales)
- 🔄 Control de disponibilidad en tiempo real
- 👤 Gestión de usuarios y roles (admin, agent, viewer)
- 🧩 Estructura lista para microservicios (conexión futura vía NATS/RabbitMQ)
- 🧱 Arquitectura escalable con Postgres + Redis + Docker

---

## ⚙️ Tecnologías principales

| Tecnología | Uso |
|-------------|-----|
| [NestJS](https://nestjs.com) | Framework backend principal |
| [Prisma ORM](https://www.prisma.io/) | ORM para PostgreSQL |
| [PostgreSQL](https://www.postgresql.org/) | Base de datos relacional |
| [Redis](https://redis.io/) | Caché y bloqueo de disponibilidad |
| [Docker Compose](https://docs.docker.com/compose/) | Orquestación local |
| [JWT + Passport](https://docs.nestjs.com/security/authentication) | Autenticación segura |
| [Swagger](https://docs.nestjs.com/openapi/introduction) | Documentación de endpoints |
| [Jest](https://jestjs.io/) | Testing unitario y e2e |

---

## 🏗️ Estructura del proyecto

```bash
src/
  auth/              
  common/            
  config/            
  users/             
  properties/        
  units/             
  availability/      
  holds/             
  reservations/      
  tenants/           
  integrations/      
prisma/
  schema.prisma
```

---

## 🚀 Instalación y configuración local

### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/<tu-usuario>/<nombre-repo>.git
cd <nombre-repo>
```

### 2️⃣ Instalar dependencias
```bash
npm install
```

### 3️⃣ Configurar variables de entorno
Crea un archivo `.env` en la raíz con el siguiente contenido:

```bash
DATABASE_URL="postgresql://user:password@localhost:5432/reservations"
REDIS_URL="redis://localhost:6379"
JWT_SECRET="supersecretkey"
PORT=3000
```

### 4️⃣ Levantar entorno Docker
```bash
docker-compose up -d
```

Esto iniciará:
- PostgreSQL en el puerto `5432`
- Redis en el puerto `6379`

### 5️⃣ Ejecutar migraciones Prisma
```bash
npx prisma migrate dev --name init
```

### 6️⃣ Ejecutar el servidor
```bash
npm run start:dev
```

La API estará disponible en:  
👉 `http://localhost:3000`

Swagger UI:  
👉 `http://localhost:3000/api/docs`

---

## 🧠 Endpoints principales (MVP)

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/availability` | Consulta disponibilidad por rango de fechas |
| `POST` | `/holds` | Crea una reserva temporal |
| `POST` | `/reservations` | Confirma una reserva |
| `POST` | `/reservations/:id/cancel` | Cancela una reserva |
| `GET` | `/reservations` | Lista reservas por filtros |
| `POST` | `/auth/login` | Inicia sesión |
| `GET` | `/auth/me` | Obtiene perfil del usuario autenticado |

---

## 🔐 Roles y permisos

| Rol | Acceso |
|-----|---------|
| `admin` | CRUD completo (usuarios, propiedades, reservas) |
| `agent` | Crear / editar reservas |
| `viewer` | Solo lectura |

---

## 🧱 Roadmap técnico

- [ ] CRUD de `Property` y `Unit`
- [ ] Gestión de disponibilidad (`InventoryDate`)
- [ ] Servicio de `Holds` con TTL y Redis Lock
- [ ] Módulo de `Reservations` con transacciones atómicas
- [ ] Autenticación JWT + Roles Guard
- [ ] Tests e2e de flujo completo
- [ ] Multi-tenant por `tenant_id`
- [ ] Integración de pagos (Stripe / Mercado Pago)
- [ ] Notificaciones y Webhooks

---

## 🧩 Scripts útiles

| Script | Acción |
|--------|--------|
| `npm run start:dev` | Modo desarrollo |
| `npm run start:prod` | Modo producción |
| `npm run test` | Tests unitarios |
| `npm run lint` | Linter |
| `npm run format` | Formatea con Prettier |
| `npx prisma studio` | UI de base de datos local |

---

## 🤝 Guía para contribuidores

1. Crear una rama desde `main`:
   ```bash
   git checkout -b feat/<nombre-feature>
   ```
2. Realizar cambios siguiendo el estándar de commits (`feat:`, `fix:`, `chore:`).
3. Crear un Pull Request con descripción clara del cambio.

---

## ⚡️ Estilo de código

- Convenciones: **TypeScript + NestJS + Clean Architecture**
- Validaciones con `class-validator`
- Log con `pino`
- DTOs y entidades bien tipadas (`PartialType`, `OmitType`, etc.)
- Tests con **Jest** (unit y e2e)

---

## 🧑‍💻 Autores

**Ignacio Aroza**  
Senior Software Engineer & SaaS Architect  
📧 [ignacioaroza.ia@gmail.com](mailto:ignacioaroza.ia@gmail.com)

---

## 🛡️ Licencia
MIT © 2025 Ignacio Aroza
