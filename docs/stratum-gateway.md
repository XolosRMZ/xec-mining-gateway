# Stratum Gateway

## Purpose

The Stratum Gateway is the mining access layer for approved members. It accepts ASIC miner connections, validates miner access using session tokens, manages worker sessions, and forwards traffic toward the upstream pool engine.

It is a Data Plane component and must stay fast, predictable, and independent from slow control-plane checks.

## Access Validation Model

The gateway validates miner access using session tokens issued by the Membership Gateway.

Required design rule:

- validate locally without Chronik/PostgreSQL calls during active mining

That means the gateway should rely on local token verification, expiration checks, and revocation state cached in Redis or equivalent memory-backed infrastructure. Active mining should not depend on blockchain queries or relational database round trips.

## Worker Credential Concept

Initial worker credential mapping:

- `username`: wallet or worker id
- `password`: session token

Example patterns:

- `username = ecash:qpm2...`
- `username = ecash:qpm2....worker-a`
- `password = <session-token>`

This keeps miner configuration simple while preserving a clean boundary between human identity and machine access.

## Initial Scope

Phase 1 gateway scope:

- accept or reject connection based on token
- worker management
- share logging
- metrics

The first implementation target is an operational access layer, not a full production pool stack.

## Expected Runtime Responsibilities

- parse incoming miner credentials
- verify token signature and expiration
- check revocation cache
- bind connection to worker identity
- track active sessions
- log share-related events
- export health and throughput metrics
- forward accepted traffic to the pool engine

## Out of Scope for Phase 1

- full P2Pool-style sharechain
- production payout engine
- complete Stratum V2 Job Negotiation

These items require separate protocol, economics, and reliability work beyond the initial campaign scope.

## Future Direction

Planned research and expansion areas:

- Stratum V2 compatibility
- non-custodial payout research
- sharechain research

The long-term direction is to support sovereign hashrate coordination on XEC without drifting into custodial pool control patterns.

## Operational Notes

- Membership checks happen before miner access is granted.
- Token acceptance should be deterministic and local.
- Revocation propagation should be fast enough to terminate invalid sessions quickly.
- Share submission should not depend on Chronik, PostgreSQL, or direct blockchain queries.
