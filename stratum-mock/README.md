# Prototype 3 - Stratum Token Validation Mock

This prototype simulates a mining worker connecting to a Stratum-like TCP gateway and using the Membership Gateway session token as the worker password.

It demonstrates:

- worker subscribe
- worker authorize
- local JWT validation
- accept/reject logic

It does not implement:

- real Stratum mining
- jobs
- shares
- payouts
- ASIC compatibility
- Chronik
- revocation sync

## Install

```bash
npm install
```

## Run Server

```bash
cp .env.example .env
# paste SESSION_TOKEN into .env
npm run dev:server
```

## Run Client

In another terminal:

```bash
npm run dev:client
```

## Testing Flow

1. Start backend.
2. Start frontend.
3. Generate session token from Membership Portal UI.
4. Copy token into `stratum-mock/.env` as `SESSION_TOKEN`.
5. Start Stratum mock server.
6. Run mock miner client.
7. Confirm `mining.authorize` returns `true`.
8. Test invalid token by changing `SESSION_TOKEN` and confirm it returns `false`.

## Important Note

`SESSION_SECRET` in backend and `stratum-mock` must match for JWT validation.

The backend `.env.example` uses `change-this-local-development-secret`, but the backend code also has a local fallback secret of `local-development-only-membership-gateway-secret` in [backend/src/config.ts](/home/xolos-ramirez/xec-mining-gateway/backend/src/config.ts). If the backend is running on that fallback during local tests, set the same value in `stratum-mock/.env` so token verification succeeds.

This mock validates JWTs locally and does not have access to backend in-memory revocation state. Production needs shared Redis-backed revocation storage or another centralized validation cache.
