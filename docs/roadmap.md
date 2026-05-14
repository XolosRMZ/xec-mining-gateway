# Roadmap

## Milestone 1 - XEC Membership Gateway

- Wallet-based authentication
- Signed challenge flow
- XEC base membership activation
- Session token issuance

## Prototype 1 - Membership Gateway Control Plane

Status: in progress / prototype

Scope:

- challenge generation
- mock signature verification
- session token issuance
- session status
- session revocation

Out of scope:

- real wallet cryptographic verification
- Chronik integration
- Stratum integration
- production membership billing

## Prototype 2 - Membership Portal UI

Status: prototype

Scope:

- wallet input
- challenge request
- mock signature generation
- session token display
- session status check
- session revocation

Out of scope:

- real wallet connection
- real signature verification
- Chronik integration
- Stratum integration
- production auth security

## Prototype 3 - Stratum Token Validation Mock

Status: prototype

Scope:

- TCP JSON-RPC mock server
- mining.subscribe mock
- mining.authorize mock
- session token validation
- worker accept/reject logic
- mock miner client

Out of scope:

- real mining jobs
- real share validation
- payouts
- production Stratum V2
- Chronik integration

## Prototype 4 - Tonalli Wallet Signature Verification

Status: prototype

Scope:

- canonical mining gateway challenge
- Tonalli signature verification mode
- publicKey + signature verification
- manual frontend Tonalli mode
- mock mode preserved for development

Out of scope:

- direct Tonalli Wallet connection
- Chronik membership verification
- Redis revocation
- production billing

## Milestone 2 - Stratum Gateway

- Operational miner access layer
- Token-based validation
- Worker management
- Share logging and session control

## Milestone 3 - Extended Membership Layer

- Optional RMZ-linked perks
- Premium tier logic
- Community integration with xolosArmy Network

## Milestone 4 - Production Hardening

- Monitoring
- Backups
- Reliability improvements
- Failover planning
- Production deployment

## During Teyolia Campaign

- publish repo
- publish architecture docs
- build Membership Gateway prototype
- build dashboard mockup
- publish weekly updates

## Delivery Philosophy

Phase 1 is intended to establish credible public architecture, membership-gated access design, and a clean path toward a serious mining coordination stack. It is not intended to rush a production mining pool before the control-plane and operational model are clear.
