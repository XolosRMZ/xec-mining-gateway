# Prototype 3 - Stratum Token Validation Mock

## Purpose

Prototype 3 demonstrates how a mining worker could use a Membership Gateway session token as the password in a Stratum-like authorization flow.

The goal is to validate the architecture path:

Membership Portal -> session token -> worker authorization request -> local token validation -> accept or reject.

This is a TCP JSON-RPC mock for authorization only. It is not a production mining gateway.

## Why TCP JSON-RPC Mock Matters

The existing backend and frontend prototypes already show how a user can obtain and manage a session token. This prototype extends that flow into the mining access layer by simulating how a worker would present that token over a Stratum-like TCP connection.

That allows the project to validate:

- token reuse across the control plane and mining gateway
- worker authorization over TCP
- local accept/reject logic for member access
- early integration boundaries before real pool engine work begins

## Flow Diagram

```text
Membership Portal
  ↓
Session Token
  ↓
Mock Miner Client
  ↓
Stratum TCP Gateway
  ↓
Local JWT Validation
  ↓
Accept / Reject Worker
```

## Supported Mock Methods

- `mining.subscribe`
- `mining.authorize`

## Limitations

- no real Stratum job distribution
- no share difficulty
- no share submission
- no payout logic
- no worker accounting persistence
- no Chronik integration
- no real ASIC compatibility testing
- no shared revocation state

This prototype validates JWTs locally with the same secret as the Membership Gateway. Because backend revocations are currently stored only in backend memory, this mock cannot see revoked tokens. Production needs a shared revocation store or centralized validation layer.

## Future Production Requirements

- real Stratum V2 compatibility
- worker accounting
- shared Redis revocation cache
- session renewal strategy
- ASIC compatibility tests
- real share validation
- pool engine integration
