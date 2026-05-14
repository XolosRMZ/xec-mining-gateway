# Prototype 7 — Shared Redis Revocation Cache

## Purpose

Prototype 7 adds shared session revocation state between the Membership Gateway control plane and the Stratum Gateway mock data plane.

## Why Redis Is Needed

Before this prototype, the backend revoked tokens using local in-memory state. That let the control plane mark a session inactive, but the Stratum mock could still accept the same JWT because it only validated the token locally with `SESSION_SECRET`.

Redis provides a shared cache both services can read and write during local development.

## Control Plane vs Data Plane Revocation Flow

1. A user completes identity verification through Tonalli mode or mock mode.
2. The Membership Gateway verifies RMZ membership and issues a session token.
3. The Stratum Gateway mock validates the JWT and checks Redis for a revocation entry.
4. The user revokes the session through the backend or frontend.
5. The Membership Gateway writes the revoked token state to Redis.
6. The Stratum Gateway mock checks Redis on the next authorize request and rejects the token.

## Redis Key Format

Revocation keys use the format:

`revoked:<sha256(token)>`

The raw JWT is not stored as a Redis key. The token is hashed with SHA-256 first and stored as:

`revoked:<sha256_hex>`

## Local Development Requirement

Redis must be running locally at:

`redis://localhost:6379`

Set:

`REDIS_URL=redis://localhost:6379`

in both `backend/.env` and `stratum-mock/.env`.

## Test Flow

1. Generate a session token.
2. Confirm Stratum `mining.authorize` returns `true`.
3. Revoke the session through the backend or frontend.
4. Confirm Stratum `mining.authorize` returns `false`.

## Failure Behavior

- If Redis is unavailable, the backend revoke endpoint returns a clear error instead of pretending revocation succeeded.
- If Redis is unavailable, the Stratum Gateway mock fails closed and treats the token as invalid.

## Limitations

- local Redis only
- no Redis auth/TLS yet
- no distributed Redis cluster
- no disconnect of already-connected workers yet

## Future

- Redis auth/TLS
- managed Redis
- worker disconnect on revocation
- session renewal strategy
- audit logs
