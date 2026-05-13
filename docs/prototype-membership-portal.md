# Prototype Membership Portal

## Prototype Purpose

Prototype 2 provides a minimal frontend for visually testing the Membership Gateway control-plane flow. It is intended for local development and demonstrations, not production use.

## How The UI Connects To Backend

The frontend runs as a Vite React TypeScript app and sends HTTP requests to the backend using `VITE_API_BASE_URL`. The default local backend target is:

```text
http://localhost:3001
```

The UI depends on the existing backend prototype endpoints and does not implement real wallet connectivity.

## API Flow

1. The user enters a wallet address.
2. The UI calls `POST /v1/auth/request-challenge`.
3. The backend returns `challengeId`, `message`, and `expiresAt`.
4. The UI generates a mock signature using:

```text
mock-signature:<wallet>:<challengeId>
```

5. The UI calls `POST /v1/auth/verify`.
6. The backend returns a bearer session token.
7. The UI can call `GET /v1/session/status` with the bearer token.
8. The UI can call `POST /v1/session/revoke` with the bearer token.

## Limitations

- mock signatures only
- no real wallet connection
- no Chronik verification
- no membership proof logic
- no Stratum connectivity
- no persistent storage in frontend
- no secure session storage strategy

## Future Production Requirements

- real eCash wallet connection
- real signature verification
- Chronik membership checks
- Stratum Gateway integration
- secure session storage
- UX hardening
