#!/usr/bin/env python3
import argparse, json, os, subprocess, sys
from pathlib import Path
try:
    import yaml  # type: ignore
except Exception:
    yaml = None

ROOT = Path(__file__).resolve().parents[1]
CONF_YAML = ROOT / 'nova.yaml'
CONF_JSON = ROOT / 'nova.json'

class Nova:
    def __init__(self):
        self.cfg = {}
        if CONF_YAML.exists() and yaml:
            self.cfg = yaml.safe_load(CONF_YAML.read_text())
        elif CONF_JSON.exists():
            self.cfg = json.loads(CONF_JSON.read_text())
        else:
            self.cfg = { 'ports': { 'api': 4000, 'web': 3000 } }

    def sh(self, *args, cwd=None):
        print('▶', ' '.join(args))
        return subprocess.run(args, cwd=cwd or ROOT, check=True)

    def init(self):
        self.sh('pnpm', 'i')
        self.sh('docker', 'compose', 'up', '-d')
        self.sh('pnpm', '--filter', 'adminchat-api', 'prisma:generate')
        self.sh('pnpm', '--filter', 'adminchat-api', 'prisma:migrate')
        self.sh('pnpm', '--filter', 'adminchat-api', 'prisma:seed')

    def report(self):
        self.sh('pnpm', 'report:sample')

    def dev(self):
        self.sh('pnpm', '-w', 'dev')

    def verify_ledger(self, token: str):
        import urllib.request, json as J
        port = self.cfg.get('ports', {}).get('api', 4000)
        req = urllib.request.Request(f'http://localhost:{port}/api/ledger/verify', headers={'authorization': f'Bearer {token}'})
        with urllib.request.urlopen(req) as r:
            print(J.loads(r.read().decode()))

if __name__ == '__main__':
    ap = argparse.ArgumentParser()
    ap.add_argument('cmd', choices=['init','dev','report','verify'])
    ap.add_argument('--token', help='JWT for verify')
    a = ap.parse_args()
    n = Nova()
    if a.cmd=='init': n.init()
    elif a.cmd=='dev': n.dev()
    elif a.cmd=='report': n.report()
    elif a.cmd=='verify':
        if not a.token: sys.exit('need --token')
        n.verify_ledger(a.token)