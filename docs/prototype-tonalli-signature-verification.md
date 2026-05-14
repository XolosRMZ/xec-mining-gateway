# Prototype 4 - Tonalli Wallet Signature Verification

## Purpose

Prototype 4 extends the Membership Gateway backend so it can verify real Tonalli Wallet message signatures without removing the existing mock prototype flow.

This keeps Phase 1 compatible with the current control-plane demos while adding a concrete path for wallet-authenticated mining gateway sessions.

Tonalli Wallet is the Phase 1 identity wallet. RMZ is the required membership layer for gateway access.

## Why Phase 1 Targets Tonalli Wallet First

- Tonalli already exposes a `signMessage(message)` flow.
- Tonalli Connect returns the authentication payload needed by the gateway:
  - `address`
  - `publicKey`
  - `signature`
- This is enough to prototype real signed challenge verification before RMZ membership checks move to Chronik, billing is introduced, or production Stratum behavior is added.

## Canonical Message Format

The backend now generates one deterministic human-readable challenge message per request.

```text
eCash México Mining Gateway Authentication

domain: ecash.mx
wallet: <wallet>
challengeId: <challengeId>
nonce: <nonce>
issuedAt: <issuedAt>
expiresAt: <expiresAt>
purpose: mining-gateway-session
```

Rules:

- LF newlines only
- no trailing spaces
- the message returned by `POST /v1/auth/request-challenge` must be signed exactly as-is
- Tonalli verification succeeds only if the signature matches this exact message

## Backend Verification Flow

1. Client requests a challenge for a wallet.
2. Backend creates `challengeId`, `nonce`, `issuedAt`, `expiresAt`, and the canonical message.
3. Client signs the returned `message` with Tonalli Wallet.
4. Client submits:
   - `mode: "tonalli"`
   - `wallet`
   - `challengeId`
   - `publicKey`
   - `signature`
5. Backend loads the stored challenge and checks:
   - challenge exists
   - not expired
   - not already used
   - wallet matches the challenge wallet
6. Backend verifies the signature against the exact challenge message using `ecash-lib`.
7. Backend derives a P2PKH eCash wallet from the provided `publicKey` and compares it to the submitted wallet.
8. Backend checks RMZ membership state.
9. If RMZ membership is active, the backend consumes the challenge and issues a session token with the membership tier.

## Required Tonalli Payload

- `wallet`
- `publicKey`
- `signature`
- `challengeId`

The canonical `message` is not re-sent on verify because the backend already stores it with the challenge record.

## Security Properties

- Domain binding:
  The signed message binds authentication to `ecash.mx`.
- Nonce:
  Every challenge includes a unique nonce.
- Expiration:
  The challenge includes `issuedAt` and `expiresAt`, and expired challenges are rejected.
- Challenge ID:
  The signed message includes `challengeId`, tying the signature to a single stored challenge.
- Replay protection:
  Each challenge can only be consumed once.

## Current Limitations

- This is still a prototype and keeps an in-memory challenge store.
- Frontend Tonalli mode is manual; users paste `publicKey` and `signature`.
- No direct Tonalli Connect integration yet.
- Prototype 5 uses a mock membership registry after signature verification.
- No Chronik-based on-chain RMZ verification yet.
- No revocation cache beyond the current in-memory session/token behavior.
- No dedicated cryptographic fixture suite yet; manual verification steps are documented instead.

## Future Requirements

- direct Tonalli Connect integration
- address derivation hardening
- production-grade cryptographic tests
- Chronik RMZ membership verification
- Redis revocation cache
