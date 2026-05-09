# Gemini CLI Context: rpow2

This project is a modern recreation of Hal Finney's Reusable Proofs of Work (RPOW). It features a TypeScript/Fastify server, a React/Vite web client, and a standalone Rust CLI client.

## Project Overview

- **Architecture:** Monorepo using npm workspaces for TypeScript/Node.js and a Cargo workspace for Rust.
- **Backend:** Node.js 22, Fastify, Postgres (via `pg` and `tsx` for development), Resend/Postmark for magic-link authentication.
- **Frontend:** React, Vite, TypeScript, Vanilla CSS.
- **CLI:** Rust (2021 edition), Clap for CLI parsing, Reqwest for API interactions.
- **Shared Library:** `@rpow/shared` contains protocol types and PoW helpers used by both the server and web client.

## Repository Layout

- `apps/server`: Fastify API server.
- `apps/web`: React/Vite web client.
- `apps/cli`: Rust CLI client.
- `packages/shared`: Shared protocol types and PoW helpers (TypeScript).
- `docs/`: Documentation, including `RUNBOOK.md` for operations.
- `ops/`: Production maintenance and deployment scripts.

## Building and Running

### Prerequisites
- Node.js >= 22
- Docker (for local Postgres)
- Rust/Cargo (for CLI)

### TypeScript/Node.js Stack
1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Start Local Database:**
    ```bash
    docker run --rm -d --name rpow-pg -e POSTGRES_PASSWORD=p -p 55432:5432 postgres:16
    ```
3.  **Build Shared Package:**
    ```bash
    npm run build --workspace @rpow/shared
    ```
4.  **Run Development Servers:**
    - Server: `npm run dev:server` (requires environment variables, see `apps/server/.env.example`)
    - Web: `npm run dev:web`

### Rust CLI
- **Debug Build:** `cargo build -p rpow-cli`
- **Release Build:** `cargo build --release -p rpow-cli`
- **Run Help:** `cargo run -p rpow-cli --bin rpow -- --help`
- **Parallel Mining:** `npm run mine:parallel` (runs multiple CLI instances in parallel; configure via `ops/parallel-miner.sh`)

## Testing

- **All TypeScript Tests:** `npm test`
- **Server Tests:** `npm --workspace apps/server test` (uses Vitest)
- **Web Tests:** `npm --workspace apps/web test` (uses Vitest)
- **E2E Tests:** `npm --workspace apps/web run e2e` (uses Playwright)
- **Shared Package Tests:** `npm --workspace packages/shared test`

## Development Conventions

- **Code Style:** Indent size 2 (spaces), LF line endings (defined in `.editorconfig`).
- **TypeScript:** Strict mode enabled; composite builds used for workspaces.
- **Environment Variables:**
  - `DATABASE_URL`: Postgres connection string.
  - `RPOW_SIGNING_PRIVATE_KEY_HEX` / `RPOW_SIGNING_PUBLIC_KEY_HEX`: Ed25519 keys for token signing.
  - `RPOW_TEST_INBOX=true`: Enables local testing without real email; magic links are printed to the console.
- **CLI Auth Precedence:**
  1. `RPOW_SESSION_COOKIE` environment variable.
  2. Locally saved session file (usually in `~/.config/rpow/session.json` or similar, depending on OS).

## Operations & Deployment

Refer to `docs/RUNBOOK.md` for detailed operator instructions.
- **Server:** Deployed on OVH VPS via Fly.io.
- **Web:** Deployed on Netlify.
- **Database:** Postgres 17 (self-hosted on VPS).
- **Backups:** Restic to Backblaze B2.
- **Monitoring:** Health checks probe `/health` every 90s.
