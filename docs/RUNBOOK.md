# Operator Runbook

## Deploys
- Pushing to `main` triggers GitHub Actions: tests → Fly deploy.
- Manual server deploy: `flyctl deploy --app rpow2-server`.
- Web deploys automatically on Cloudflare Pages.

## Secrets (Fly)
- `flyctl secrets list --app rpow2-server`
- Required: `DATABASE_URL`, `RESEND_API_KEY`, `EMAIL_FROM`, `SESSION_SECRET`, `RPOW_SIGNING_PRIVATE_KEY_HEX`, `RPOW_SIGNING_PUBLIC_KEY_HEX`, `DIFFICULTY_BITS`, `DIFFICULTY_FLOOR`.

## Difficulty changes
- Bump `DIFFICULTY_BITS` via `flyctl secrets set DIFFICULTY_BITS=30 --app rpow2-server`.
- Floor: `DIFFICULTY_FLOOR` is the absolute minimum the server will ever issue.

## Rotating the signing key
1. Generate new keypair; store new private key.
2. Add second public key to a future `JWKS`-style endpoint (not in v1 — currently single key).
3. Restart Fly machine.
4. Old tokens remain verifiable until you remove the old key.

## Database
- `flyctl ssh console --app rpow2-server` then `psql $DATABASE_URL` for read-only inspection.
- Backups: nightly `pg_dump` to R2 (set up separately; not in v1 plan).

## Common tasks
- Reset a user's account (testing): `DELETE FROM tokens WHERE owner_email='X'; DELETE FROM transfers WHERE sender_email='X' OR recipient_email='X'; DELETE FROM users WHERE email='X';`
