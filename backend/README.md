# Membership Gateway Prototype Backend

This backend is the first minimal prototype for the Membership Gateway control plane:

- wallet submits a challenge request
- server creates a nonce-backed challenge
- client submits wallet, challenge ID, and a mock signature
- server performs mock verification
- server issues a session token
- client checks session status
- client revokes the session

## What This Prototype Does

- runs a minimal Express + TypeScript API
- stores challenges in memory
- issues JWT session tokens
- supports session status and session revocation
- uses a mock signature format to demonstrate the flow end to end

## What This Prototype Does Not Do Yet

- real eCash wallet cryptographic verification
- Chronik membership verification
- Stratum mining or gateway logic
- RMZ logic
- Redis or PostgreSQL persistence
- production hardening such as rate limiting or durable audit logs

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

The server defaults to `http://localhost:3001`.

## Test Health

```bash
curl http://localhost:3001/health
```

## Example Flow

Use a wallet placeholder:

```bash
export WALLET="ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a"
```

### 1. Request Challenge

```bash
curl -X POST http://localhost:3001/v1/auth/request-challenge \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"$WALLET\"}"
```

Example response:

```json
{
  "challengeId": "7e3b5c5f-6a1c-44ea-9b71-2db943a3fc7a",
  "wallet": "ecash:qpm2qsznhks23z7629mms6s4cwef74vcwvy22gdx6a",
  "message": "eCash México Mining Gateway authentication challenge: 0d23...",
  "expiresAt": "2026-05-13T12:00:00.000Z"
}
```

### 2. Build Mock Signature

The current temporary signature format is:

```text
mock-signature:<wallet>:<challengeId>
```

Example:

```bash
export CHALLENGE_ID="<challengeId from previous response>"
export SIGNATURE="mock-signature:$WALLET:$CHALLENGE_ID"
```

### 3. Verify and Receive Session Token

```bash
curl -X POST http://localhost:3001/v1/auth/verify \
  -H "Content-Type: application/json" \
  -d "{\"wallet\":\"$WALLET\",\"challengeId\":\"$CHALLENGE_ID\",\"signature\":\"$SIGNATURE\"}"
```

Example response:

```json
{
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 86400,
  "plan": "prototype"
}
```

### 4. Check Session Status

```bash
export SESSION_TOKEN="<sessionToken from verify response>"

curl http://localhost:3001/v1/session/status \
  -H "Authorization: Bearer $SESSION_TOKEN"
```

### 5. Revoke Session

```bash
curl -X POST http://localhost:3001/v1/session/revoke \
  -H "Authorization: Bearer $SESSION_TOKEN"
```

## Configuration

Copy `.env.example` to `.env` if you want to override defaults:

```bash
PORT=3001
SESSION_SECRET=change-this-local-development-secret
SESSION_TTL_SECONDS=86400
CHALLENGE_TTL_SECONDS=300
```

The fallback session secret in code is for local development only.
