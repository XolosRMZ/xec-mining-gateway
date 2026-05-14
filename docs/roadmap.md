# Roadmap

## Phase 1 Prototype Status

- ✅ Prototype 1 — Membership Gateway Backend
- ✅ Prototype 2 — Membership Portal UI
- ✅ Prototype 3 — Stratum Token Validation Mock
- ✅ Prototype 4 — Tonalli Wallet Signature Verification
- 🎯 Prototype 5 — RMZ Membership Verification Mock
- ⏳ Prototype 6 — Shared Redis Revocation Cache
- ⏳ Prototype 7 — Chronik Integration / On-chain RMZ Checks

## Prototype 5 — RMZ Membership Verification Mock

Status: prototype

Scope:

- mock RMZ membership service
- membership tier lookup
- session token includes RMZ membership tier
- verification flow requires active RMZ membership before token issuance

Out of scope:

- Chronik RMZ token checks
- on-chain membership verification
- billing
- token locking/burning
- NFT pass validation

## Strategic Direction

- Membership access is powered by RMZ through Tonalli Wallet.
- RMZ is the required membership layer for gateway access.
- Tonalli Wallet provides identity; RMZ provides membership.
- eCash México builds the infrastructure for the XEC ecosystem.
- Chronik-based on-chain RMZ verification remains future work.

## During Teyolia Campaign

- publish repo
- publish architecture docs
- build Membership Gateway prototype
- build dashboard mockup
- publish weekly updates

## Delivery Philosophy

Phase 1 is intended to establish credible public architecture, membership-gated access design, and a clean path toward a serious mining coordination stack. It is not intended to rush a production mining pool before the control-plane and operational model are clear.
