# Prototype 5 - RMZ Membership Verification Mock

## Purpose

Prototype 5 adds an RMZ membership gate to the Membership Gateway before session token issuance.

## Why RMZ Is Now the Membership Layer

Membership access is powered by RMZ through Tonalli Wallet. RMZ is the required membership layer for gateway access, and Prototype 5 models that rule with a mock membership registry.

## Why Tonalli Wallet Is the Identity Layer

Tonalli Wallet is the Phase 1 identity wallet. It proves wallet control through signed challenges, while RMZ determines whether that wallet has gateway membership.

## Current Mock Flow

```text
Wallet / Tonalli identity
  ↓
Signature verification
  ↓
RMZ membership mock lookup
  ↓
Session token with membership tier
  ↓
Stratum token validation
```

## Approved Test Wallet

`ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a`

## API Behavior

- Signature verification still supports both `mock` and `tonalli` modes.
- After signature verification, the backend performs a mock RMZ membership lookup.
- If membership is inactive, the backend returns `403` with `RMZ membership required`.
- If membership is active, the backend issues a session token with the RMZ membership tier in `plan`.

## Example Success Response

```json
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "plan": "founding-miner",
  "membership": {
    "active": true,
    "tier": "founding-miner",
    "source": "mock"
  }
}
```

## Example 403 Failure Response

```json
{
  "error": "RMZ membership required"
}
```

## Limitations

- Prototype 5 uses a hardcoded mock membership registry.
- No Chronik RMZ token checks yet.
- No on-chain membership verification yet.
- No billing or membership pass logic yet.
- No Redis-backed revocation cache yet.

## Future Production Requirements

- Chronik RMZ token balance checks
- RMZ membership passes
- token locking or burning logic
- expiration rules
- Redis-backed session revocation
- audit logs
