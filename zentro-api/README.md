# zentro-api

Backend for the Zentro platform — **Spring Boot 3 modular monolith** (Java 21, Gradle).

## Modules (`com.zentro.*`)

Package-by-feature; boundaries enforced by **Spring Modulith**.

| Module | Responsibility |
|--------|----------------|
| `common` | Security (JWT), config, error handling, shared base types |
| `identity` | Single-identity accounts, phone+OTP auth, customer/provider profiles |
| `catalog` | Service categories & per-category config |
| `provider` | Provider profiles, skills, rates, service area |
| `verification` | Admin verification & approval gate |
| `discovery` | Search + PostGIS location queries |
| `matching` | Zentro Score ranking engine + priority re-weighting |
| `booking` | Booking lifecycle state machine |
| `payment` | Razorpay + escrow, payout-on-approval |
| `chat` | Real-time WebSocket messaging |
| `review` | Two-way ratings + Trust Score |
| `notification` | Push / SMS / email routing |
| `ai` | Agentic AI comparison assistant |
| `admin` | Admin & ops APIs |

## Stack

Java 21 · Spring Boot 3.3 · Spring Security · Spring Data JPA · PostgreSQL + PostGIS
(Hibernate Spatial) · Flyway · Redis · Spring Modulith.

## Prerequisites

- **JDK 21** (current machine has 17 — install 21 before building)
- Postgres+PostGIS and Redis (use the root `docker-compose.yml`)

## Getting started

```bash
docker compose up -d            # from repo root: Postgres+PostGIS + Redis
gradle wrapper                  # generate the Gradle wrapper (one-time)
./gradlew bootRun
```

API base path: `http://localhost:8080/api`. Health: `/api/actuator/health`.
