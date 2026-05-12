# eCash Mexico Sovereign Mining Infrastructure - Phase 1

## Overview

This repository defines the initial architecture for **eCash Mexico Sovereign Mining Infrastructure - Phase 1**. The purpose of this system is to provide sovereign mining coordination infrastructure for eCash (XEC) without introducing wallet custody or putting membership checks in the mining hot path.

Phase 1 is documentation-first and architecture-first. It does not yet implement a production mining pool, real Stratum mining logic, or a payout engine.

## System Model

The architecture separates the platform into two operational domains:

- **Control Plane**: wallet authentication, membership validation, session issuance, session revocation, dashboard state, and administrative controls.
- **Data Plane**: miner connections, session token acceptance, worker lifecycle, share intake, session-level enforcement, and pool connectivity.

This separation matters because membership validation is comparatively slow and stateful, while mining traffic is latency-sensitive and continuous. Membership validation must not happen in the mining hot path.

## High-Level Flow

```text
Wallet
  ↓
Membership Gateway
  ↓
Session Token
  ↓
ASIC Miner
  ↓
Stratum Gateway
  ↓
Pool Engine
  ↓
eCash Node + Chronik
  ↓
eCash Blockchain
```

## Control Plane vs Data Plane

### Control Plane

The Control Plane is responsible for verifying who is allowed to mine through the gateway.

Primary duties:

- accept wallet connections
- generate and verify signed authentication challenges
- check XEC membership status
- issue short-lived session tokens
- revoke sessions when needed
- expose operator and member-facing dashboard state

The Membership Gateway, PostgreSQL, and parts of Redis primarily live here.

### Data Plane

The Data Plane is responsible for handling active miner traffic once access has already been approved.

Primary duties:

- accept miner connections
- validate session tokens locally
- map workers to sessions
- receive and log shares
- emit operational metrics
- forward accepted work to the upstream pool engine

The Stratum Gateway is the primary Data Plane component.

## Component Overview

### Membership Gateway

The Membership Gateway is the authentication and session control entrypoint. It verifies signed wallet challenges, checks membership state, and issues revocable session tokens for miners. This is the boundary between wallet-based identity and mining access.

### Stratum Gateway

The Stratum Gateway accepts ASIC miner connections and validates access using previously issued session tokens. Its validation path should be local and deterministic, not dependent on per-share calls to Chronik or PostgreSQL.

### eCash Node + Chronik

The eCash node and Chronik provide blockchain state and indexing support for membership-related verification, operational reporting, and future ecosystem integrations. They are foundational dependencies for trustworthy chain-aware infrastructure, but they must not sit in the active share submission path.

### Redis

Redis is the intended low-latency cache and coordination layer.

Planned uses:

- session token validation cache
- revocation cache
- rate limiting
- short-lived worker/session state
- gateway coordination primitives

### PostgreSQL

PostgreSQL is the intended durable system of record.

Planned uses:

- wallet membership records
- challenge audit trail
- session issuance metadata
- revocation events
- operator reporting

### Dashboard

The Dashboard will provide visibility into the control plane and selected mining state.

Planned views:

- wallet membership status
- active sessions
- worker list
- gateway health
- campaign and infrastructure progress

## Hot Path Constraints

Mining performance depends on keeping the active connection and share flow simple.

Required Phase 1 principles:

- membership validation happens before mining access is granted
- session tokens are issued ahead of miner connection
- share submission must not trigger blockchain queries
- share submission must not call PostgreSQL
- token verification should use local signature checks and cached revocation state

This design reduces stale risk and isolates chain-aware logic to the control plane.

## Security Notes

- No private key custody: wallets sign challenges client-side; the platform does not hold user private keys.
- Session token expiration: session tokens should be short-lived and renewed intentionally.
- Revocation cache: revoked sessions should be pushed into a fast local cache so gateways can reject them without database round trips.
- No blockchain queries during share submission: chain queries belong outside the mining hot path.

## Phase 1 Scope Boundary

This repository currently documents the architecture and project skeleton only.

Explicitly out of scope for Phase 1:

- production payout engine
- full mining pool implementation
- full P2Pool-style sharechain
- complete Stratum V2 job negotiation stack

## Initial Repository Structure

- `docs/`: architecture, gateway, roadmap, and campaign documentation
- `backend/`: planned Membership Gateway backend services
- `frontend/`: planned membership portal and dashboard
- `infra/`: infrastructure and deployment documentation
