# Development Workflow Commands

## 🚀 Daily Commands

```bash
# Start your day
./nova doctor    # Check system health
./nova up        # Start databases
./nova dev       # Start development servers

# During development
./nova migrate   # After schema changes
./nova test      # Before committing
./nova build     # Before deployment

# End of day
./nova report    # Generate daily audit report
```

## 📋 VS Code Integration

Use **Command + Shift + P** and type "Tasks: Run Task" to access:

- **NOVA: init** - Full project initialization
- **NOVA: dev** - Start development mode
- **NOVA: report** - Generate audit report
- **NOVA: doctor** - System diagnostics
- **Build C++ Verifier** - Compile verification tool

## 🔄 Git Workflow

```bash
# Feature development
git checkout -b feat/new-feature
# ... make changes ...
./nova test
git add .
git commit -m "feat: add new feature"
git push origin feat/new-feature
```

## 🛠️ Troubleshooting

| Issue | Command | Solution |
|-------|---------|----------|
| Database not responding | `docker ps` | Check container status |
| Port conflicts | `./nova doctor` | Check port assignments |
| Dependencies out of sync | `pnpm install` | Reinstall packages |
| Build failures | `./nova build` | Check build logs |

## 🔐 Environment Variables

```bash
# Required for production
export DATABASE_URL="postgresql://..."
export JWT_SECRET="your-secret-key"
export WEB_ORIGIN="https://your-domain.com"

# Optional for development
export TOKEN="eyJhbGci..."  # For API testing
```