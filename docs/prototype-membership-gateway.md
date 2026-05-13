# Prototype Membership Gateway

## Prototype Purpose

This prototype demonstrates the Membership Gateway control-plane flow for the Teyolia campaign:

1. client requests a challenge
2. backend creates a nonce-backed challenge
3. client submits wallet, challenge ID, and mock signature
4. backend verifies the mock signature
5. backend issues a session token
6. client checks session status
7. client revokes the session

The goal is to keep the first implementation small, readable, and easy to extend.

## Current Mock Flow

### `POST /v1/auth/request-challenge`

Creates an in-memory challenge record bound to a wallet address.

### `POST /v1/auth/verify`

Verifies a temporary mock signature with this development-only format:

```text
mock-signature:<wallet>:<challengeId>
```

If valid, the backend issues a JWT session token with the `prototype` plan.

### `GET /v1/session/status`

Checks whether the presented bearer token is active and returns wallet, plan, and expiration time when valid.

### `POST /v1/session/revoke`

Marks the presented bearer token as revoked in an in-memory revocation set.

## API Endpoints

- `GET /`
- `GET /health`
- `POST /v1/auth/request-challenge`
- `POST /v1/auth/verify`
- `GET /v1/session/status`
- `POST /v1/session/revoke`

## Security Limitations

- mock signatures are not cryptographic signatures
- challenges are stored only in process memory
- revoked tokens are stored only in process memory
- JWT fallback secret exists for local development only
- there is no rate limiting
- there is no persistent audit trail
- there is no real membership verification

This prototype is not suitable for production use.

## Future Production Requirements

- real wallet signature verification
- Chronik membership verification
- Redis session storage
- PostgreSQL audit logs
- rate limiting
- Stratum Gateway integration
