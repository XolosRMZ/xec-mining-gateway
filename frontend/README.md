# Membership Portal Prototype

This frontend is Prototype 2 for the Membership Gateway flow. It provides a small visual demo for:

- entering a wallet address
- requesting a challenge from the backend
- generating the required mock signature automatically
- verifying the challenge in mock or Tonalli mode
- receiving a session token
- checking session status
- revoking the session

## What This Prototype Does Not Do

- real eCash wallet connection
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
3. choose Mock or Tonalli mode
4. receive session token
5. check status
6. revoke session

## Mock Mode

- enter a wallet address
- request a challenge
- keep the default `Mock Prototype` mode
- the UI generates `mock-signature:<wallet>:<challengeId>` automatically
- verify and receive a session token

## Tonalli Mode

- enter a wallet address
- request a challenge
- switch to `Tonalli Signature`
- sign the exact challenge message shown by the UI in Tonalli Wallet
- paste the returned `publicKey`
- paste the returned `signature`
- submit the verify request

Tonalli mode expects a real signature produced by Tonalli Wallet over the exact challenge message shown by the frontend.
