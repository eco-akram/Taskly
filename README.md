# ⚡ Taskly — Task Management REST API

![.NET](https://img.shields.io/badge/.NET-10.0-512BD4?style=flat-square&logo=dotnet)
![ASP.NET Core](https://img.shields.io/badge/ASP.NET_Core-Web_API-512BD4?style=flat-square)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-EF_Core-4169E1?style=flat-square&logo=postgresql)
![Architecture](https://img.shields.io/badge/Architecture-Clean-6c63ff?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

A production-quality REST API for managing projects and tasks, built to demonstrate **Clean Architecture**, **CQRS**, **JWT authentication**, and **Entity Framework Core** with .NET 10.

---

## Architecture

```
Taskly/
├── src/
│   ├── Taskly.Domain/          # Entities, enums — no dependencies
│   ├── Taskly.Application/     # CQRS handlers, interfaces, DTOs
│   ├── Taskly.Infrastructure/  # EF Core, JWT, PostgreSQL
│   └── Taskly.API/             # Controllers, middleware, Swagger
└── landing/                    # Branded landing page
```

Dependencies flow **inward only**: API → Application → Domain. Infrastructure implements Application interfaces via dependency inversion.

---

## Features

- **Clean Architecture** — strict layer separation, testable by design
- **CQRS with MediatR** — commands and queries fully separated
- **JWT Authentication** — signed tokens, 7-day expiry, BCrypt password hashing
- **EF Core + PostgreSQL** — Fluent entity configurations, migrations-ready
- **Global error handling** — typed exceptions map to correct HTTP status codes
- **Branded Swagger UI** — dark theme, Bearer auth support, live try-it-out

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ❌ | Register a new user |
| POST | `/api/auth/login` | ❌ | Login and receive JWT |
| GET | `/api/projects` | ✅ | List your projects |
| GET | `/api/projects/{id}` | ✅ | Get a project by ID |
| POST | `/api/projects` | ✅ | Create a project |
| PUT | `/api/projects/{id}` | ✅ | Update a project |
| DELETE | `/api/projects/{id}` | ✅ | Delete a project |
| GET | `/api/projects/{id}/tasks` | ✅ | List tasks in a project |
| POST | `/api/projects/{id}/tasks` | ✅ | Create a task |
| PATCH | `/api/projects/{id}/tasks/{taskId}/status` | ✅ | Update task status |
| DELETE | `/api/projects/{id}/tasks/{taskId}` | ✅ | Delete a task |

---

## Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- PostgreSQL running locally

### 1. Configure the database

Edit `src/Taskly.API/appsettings.json`:
```json
"ConnectionStrings": {
  "Default": "Host=localhost;Port=5432;Database=taskly;Username=postgres;Password=yourpassword"
}
```

### 2. Run migrations

```bash
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate --project src/Taskly.Infrastructure --startup-project src/Taskly.API
dotnet ef database update --project src/Taskly.Infrastructure --startup-project src/Taskly.API
```

### 3. Run the API

```bash
dotnet run --project src/Taskly.API
```

Open Swagger UI: **http://localhost:5000/swagger**

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | ASP.NET Core 10 |
| ORM | Entity Framework Core |
| Database | PostgreSQL (Npgsql) |
| Messaging | MediatR 14 |
| Auth | JWT Bearer + BCrypt |
| Docs | Swashbuckle / OpenAPI |
| Validation | FluentValidation |

---

## License

MIT — free to use, fork, and build on.
