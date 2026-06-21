# infra

Infrastructure for Zentro.

- `docker/` — Dockerfiles for services (added per app).
- Local dev stack lives in the repo-root `docker-compose.yml` (Postgres+PostGIS, Redis).
- Terraform (cloud: RDS, ElastiCache, etc.) added in a later phase.
