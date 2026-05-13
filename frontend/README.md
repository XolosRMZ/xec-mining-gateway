# Membership Portal Prototype

This frontend is Prototype 2 for the Membership Gateway flow. It provides a small visual demo for:

- entering a wallet address
- requesting a challenge from the backend
- generating the required mock signature automatically
- verifying the challenge
- receiving a session token
- checking session status
- revoking the session

## What This Prototype Does Not Do

- real eCash wallet connection
- real signature verification
- Chronik membership checks
- Stratum Gateway logic
- production authentication security

## Prerequisite

The backend prototype must be running on port `3001`.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Expected Flow

1. enter wallet
2. request challenge
3. verify mock signature
4. receive session token
5. check status
6. revoke session

This frontend uses mock signatures and is only for testing the control-plane flow.
