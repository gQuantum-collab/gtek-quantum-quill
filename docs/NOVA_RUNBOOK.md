# NOVA Runbook

## What is NOVA?
A thin automation layer (bash + Python) to bootstrap, run, test, and verify the Admin Chat & Audit stack.

## Requirements
- Node 20+, pnpm 9+
- Docker Desktop / Engine
- Python 3.9+
- (optional) yq, jq

## Quickstart
```bash
chmod +x ./nova
./nova doctor
./nova init
./nova dev
```

### JWT for API calls

Register once:

```bash
curl -s http://localhost:4000/auth/register \
  -H 'content-type: application/json' \
  -d '{"orgName":"Acme","email":"you@example.com","name":"You","password":"password123"}' | jq -r .token
```

Export it:

```bash
export TOKEN=eyJhbGciOi...
```

Append/verify ledger:

```bash
./nova ledger-append
./nova ledger-verify
```

## Reports

```bash
./nova report  # writes AUDIT_REPORT.md
```

## Troubleshooting

* If `prisma migrate` fails, ensure Postgres is up: `docker ps`; view logs: `docker compose logs -f postgres`.
* Port conflicts: edit `nova.yaml` and change `ports.web/api`.