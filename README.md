# GTEK Quantum Quill - NOVA Automation Kit

[![CI](https://github.com/gQuantum-collab/gtek-quantum-quill/workflows/nova-ci/badge.svg)](https://github.com/gQuantum-collab/gtek-quantum-quill/actions)

Turn-key automation to wire up the whole full-stack (Next.js + Express + Prisma + Postgres) with one entrypoint script named **`nova`**.

## ✅ Status: Ready to Use

The NOVA Automation Kit has been successfully installed and tested in this workspace! All core components are functional:

- ✅ **`nova`** - Main automation shell with 13 subcommands
- ✅ **Environment** - All required tools detected (Node, pnpm, Docker, Python, etc.)
- ✅ **Database** - PostgreSQL and Redis containers running
- ✅ **C++ Verifier** - Built and functional
- ✅ **VS Code Integration** - Tasks, settings, and recommended extensions configured

## 🚀 Quick Start

```bash
# Check environment
./nova doctor

# Initialize project (already done!)
./nova init

# Generate a sample report
./nova report

# View all available commands
./nova help
```

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `./nova init` | Install deps, copy env, generate prisma, seed |
| `./nova up` | Start docker compose (db etc.) |
| `./nova migrate` | Run prisma migrate dev |
| `./nova seed` | Run prisma seed |
| `./nova dev` | Start turbo dev (web + api) |
| `./nova test` | Run all tests |
| `./nova build` | Build all packages |
| `./nova report` | Generate sample audit report |
| `./nova ledger-append` | Append sample ledger event (needs JWT) |
| `./nova ledger-verify` | Verify ledger chain |
| `./nova openapi` | Open Swagger UI in browser |
| `./nova gcp:print-env` | Show required GCP environment variables |
| `./nova doctor` | Environment diagnostics |

## 📁 Project Structure

```
gtek-quantum-quill/
├── nova                    # Main automation shell script
├── nova.yaml              # Human-readable configuration
├── nova.json              # Machine-readable configuration
├── apps/
│   ├── api/               # Express API server
│   └── web/               # Next.js web application  
├── scripts/
│   └── nova.py           # Python orchestration script
├── tools/
│   └── nova_verify.cpp   # C++ ledger verification utility
├── docs/
│   └── NOVA_RUNBOOK.md   # Comprehensive usage documentation
├── .vscode/              # VS Code configuration
│   ├── settings.json     # Editor settings
│   ├── tasks.json        # Automation tasks
│   └── extensions.json   # Recommended extensions
└── .github/workflows/    # CI/CD automation
```

## 🎯 Next Steps: 10-Point Development Plan

Ready to build the full-stack application? Follow this structured development plan:

### Phase 1: Foundation (Week 1)
1. **Environment Setup** ✅ (Complete!)
2. **Auth System** - Implement JWT authentication
3. **Database Schema** - Design Prisma models
4. **Core CRUD** - Projects, Tasks, Templates

### Phase 2: Features (Week 2)  
5. **Ledger System** - Audit trail implementation
6. **Report Generation** - Automated audit reports
7. **Developer Studio** - In-app development tools
8. **API Documentation** - OpenAPI/Swagger integration

### Phase 3: Production (Week 3)
9. **Security & Testing** - E2E tests, security hardening
10. **GCP Deployment** - Cloud Run or GKE setup

## 🔧 Configuration

Edit `nova.yaml` to customize:
- **Ports**: Web (3000), API (4000), Database (5432)
- **Environment**: Database URL, JWT secrets, origins
- **Features**: Toggle devStudio, pdfExport, workflows
- **Cloud**: GCP project settings

## 🧪 Development Workflow

```bash
# Daily workflow
./nova up          # Start infrastructure
./nova dev         # Start development servers
./nova test        # Run tests before committing

# Database changes
./nova migrate     # Apply schema changes
./nova seed        # Populate with sample data

# Audit & Verification
./nova report      # Generate audit report
./nova ledger-verify  # Verify audit trail integrity
```

## 🔐 API Authentication

For ledger operations, you'll need a JWT token:

```bash
# Register (when API is implemented)
curl -s http://localhost:4000/auth/register \
  -H 'content-type: application/json' \
  -d '{"orgName":"Acme","email":"you@example.com","name":"You","password":"password123"}' | jq -r .token

# Export token  
export TOKEN=eyJhbGciOi...

# Use with ledger commands
./nova ledger-append
./nova ledger-verify
```

## 🐛 Troubleshooting

- **Port conflicts**: Edit ports in `nova.yaml`
- **Database issues**: Check with `docker ps` and `docker compose logs postgres`
- **Missing tools**: Run `./nova doctor` for diagnostics

## 📚 Documentation

- [NOVA Runbook](docs/NOVA_RUNBOOK.md) - Detailed usage guide
- [VS Code Tasks](Command+Shift+P → "Tasks: Run Task") - Integrated automation
- [GitHub Actions](.github/workflows/nova-ci.yml) - CI/CD pipeline

---

**Ready to build something amazing?** The NOVA kit provides everything you need for rapid full-stack development with built-in audit capabilities. Start with `./nova init` and follow the 10-point plan!
