# GESF - Installation & Setup Guide

Complete technical guide for installing and using the Green Engineering Standard Framework on any system, for both new and existing projects.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Option 1: Install Globally (Recommended)](#option-1-install-globally-recommended)
  - [Option 2: Use Without Installing (npx)](#option-2-use-without-installing-npx)
  - [Option 3: Install from Source (Contributors)](#option-3-install-from-source-contributors)
- [Verify Installation](#verify-installation)
- [Quick Start: New Project](#quick-start-new-project)
- [Quick Start: Existing Project](#quick-start-existing-project)
- [Command Reference](#command-reference)
- [What the Audit Detects](#what-the-audit-detects)
- [Project Types](#project-types)
- [Compliance Frameworks](#compliance-frameworks)
- [Generated Project Structure](#generated-project-structure)
- [CI/CD Integration](#cicd-integration)
- [Configuration File Reference](#configuration-file-reference)
- [Troubleshooting](#troubleshooting)
- [Uninstall](#uninstall)

---

## Prerequisites

| Requirement | Minimum Version | Check Command |
|-------------|----------------|---------------|
| Node.js | 20.0.0 or higher | `node --version` |
| npm | 10.0.0 or higher | `npm --version` |
| pnpm (contributors only) | 11.0.0 or higher | `pnpm --version` |

Install Node.js if you don't have it:

```bash
# Using nvm (recommended)
nvm install 22
nvm use 22

# Using Homebrew (macOS)
brew install node

# Using apt (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs

# Using winget (Windows)
winget install OpenJS.NodeJS.LTS

# Using fnm (Windows/macOS/Linux — fast alternative to nvm)
fnm install 22
fnm use 22
```

---

## Installation

### Option 1: Install Globally (Recommended)

Best for teams and individuals who want `ges` available everywhere.

```bash
npm install -g @greenarmor/ges
```

Or with pnpm:

```bash
pnpm add -g @greenarmor/ges
```

Or with yarn:

```bash
yarn global add @greenarmor/ges
```

After installation, the `ges` command is available system-wide.

### Option 2: Use Without Installing (npx)

Run directly without a global install. Downloads and executes on demand.

```bash
npx @greenarmor/ges init
npx @greenarmor/ges audit
npx @greenarmor/ges score
```

Or with pnpm:

```bash
pnpm dlx @greenarmor/ges init
```

### Option 3: Install from Source (Contributors)

For developers contributing to GESF or building from source.

```bash
# Clone the repository
git clone https://github.com/greenarmor/gesf.git
cd gesf

# Install pnpm if not available
npm install -g pnpm

# Install all dependencies
pnpm install

# Build all packages
pnpm -r run build

# Link the CLI globally
cd packages/cli
npm link
```

After linking, `ges` is available system-wide pointing to your local build.

---

## Verify Installation

Run these commands to confirm everything works:

```bash
# Check version
ges --version
# Output: 0.1.0

# Check available commands
ges --help
# Output: list of all commands

# Run diagnostics on a test directory
mkdir /tmp/test-project && cd /tmp/test-project
echo '{"name":"test"}' > package.json
ges init --name "Test" --type "generic-web-application" --frameworks "GDPR,OWASP"
ges audit
ges doctor
```

---

## Quick Start: New Project

For brand new projects that haven't been built yet.

```bash
# 1. Create your project (any framework)
create-next-app my-saas-app
cd my-saas-app

# 2. Initialize GESF
ges init

# 3. Answer the prompts:
#    - Project name: My SaaS App
#    - Project type: SaaS (select from list)
#    - Frameworks: GDPR, OWASP, CIS, NIST (select with space)

# Or skip prompts with flags:
ges init --name "My SaaS App" --type saas --frameworks "GDPR,OWASP,CIS,NIST"
```

This generates:

- `.ges/` — Configuration, metadata, and scoring
- `compliance/` — 7 GDPR/compliance documents
- `security/` — 7 security policy documents
- `controls/` — Policy pack controls (JSON)
- `policies/` — Policy definitions
- `checklists/` — Compliance checklists
- `docs/` — Additional documentation
- `reports/` — Generated reports
- `.github/workflows/` — 4 CI/CD security workflows

```bash
# 4. As you build your project, audit regularly
ges audit

# 5. Check your compliance score
ges score

# 6. Generate a compliance report
ges report --format markdown
```

---

## Quick Start: Existing Project

For projects that already exist and need compliance auditing.

```bash
# 1. Navigate to your existing project
cd /path/to/existing-project

# 2. Initialize GESF
ges init --name "Existing App" --type "api-backend" --frameworks "GDPR,OWASP"

# 3. Immediately audit the codebase
ges audit
```

The audit scans your actual source code and reports:

- Secrets hardcoded in source files
- Weak cryptographic algorithms (MD5, SHA1)
- SQL injection vulnerabilities
- Missing authentication on routes
- Missing security headers and middleware
- Configuration issues (.env handling, .gitignore)
- Missing logging and audit trails

```bash
# 4. Review findings and fix issues
# The audit output shows file paths, line numbers, and fix suggestions

# 5. Re-audit after fixes
ges audit

# 6. Track your score improvement
ges score
```

---

## Command Reference

### `ges init`

Initialize GESF in the current project directory.

```bash
ges init                              # Interactive prompts
ges init -n "My App"                  # Specify name
ges init -t saas                      # Specify type
ges init -f "GDPR,OWASP,NIST"        # Specify frameworks
ges init -n "My App" -t saas -f "GDPR,OWASP"  # All options
```

Options:
- `-n, --name <name>` — Project name (default: directory name)
- `-t, --type <type>` — Project type (see [Project Types](#project-types))
- `-f, --frameworks <list>` — Comma-separated framework list

### `ges audit`

Scan the project source code for security and compliance violations.

```bash
ges audit                  # Full audit with findings
ges audit --ci             # CI mode (exits with error code on critical findings)
ges audit --json           # Output findings as JSON
```

Options:
- `--ci` — Exit code 1 if critical findings exist (for CI/CD pipelines)
- `--json` — Machine-readable JSON output

### `ges score`

Display the current compliance score.

```bash
ges score                  # Human-readable score
ges score --ci             # JSON output for CI/CD
```

Example output:

```
  GDPR ................ 72%
  OWASP ............... 65%
  CIS ................. 80%
  NIST ................ 58%
  Overall ............. 69%
```

### `ges report`

Generate a detailed compliance report.

```bash
ges report                           # Markdown report
ges report --format html             # HTML report
ges report --format markdown         # Markdown report
ges report --output ./my-report.md   # Custom output path
```

Options:
- `-f, --format <format>` — `markdown` or `html`
- `-o, --output <path>` — Custom output file path

### `ges doctor`

Diagnose GESF setup and configuration health.

```bash
ges doctor
```

Checks: initialization status, config files, directories, workflows, score data.

### `ges scan`

Run external security scanner integrations.

```bash
ges scan                  # Run all available scanners
ges scan --ci             # Exit with error code on failures
```

Integrates: Trivy, Gitleaks, Semgrep, npm audit (if installed on the system).

### `ges compliance`

Show detailed compliance status per policy pack.

```bash
ges compliance
```

### `ges validate`

Validate the GESF configuration against Zod schemas.

```bash
ges validate
```

### `ges generate`

Regenerate documentation or CI/CD workflows.

```bash
ges generate --docs           # Regenerate compliance/security documents
ges generate --workflows      # Regenerate GitHub Actions workflows
ges generate --all            # Regenerate everything
```

### `ges policy`

Manage policy packs.

```bash
ges policy list               # List all available packs
ges policy install ai         # Install the AI policy pack
ges policy remove blockchain  # Remove the blockchain pack
```

### `ges update`

Check for GESF updates.

```bash
ges update
```

---

## What the Audit Detects

The `ges audit` command runs 6 independent scanners against your source code:

### 1. Secrets Scanner

Detects hardcoded secrets and credentials in source files and .env files.

| Detection | Severity |
|-----------|----------|
| Hardcoded passwords (`password = "..."`) | Critical |
| Hardcoded API keys (`api_key = "..."`) | Critical |
| Database connection strings with credentials | Critical |
| AWS Access Key IDs (`AKIA...`) | Critical |
| GitHub tokens (`ghp_...`, `gho_...`) | Critical |
| Slack tokens (`xoxb-...`, `xoxp-...`) | Critical |
| JWT tokens in source (`eyJ...`) | Critical |
| Private keys (`-----BEGIN RSA PRIVATE KEY-----`) | Critical |
| OpenAI-style API keys (`sk-...`) | Critical |
| GitLab tokens (`glpat-...`) | Critical |

Scans: `.ts`, `.tsx`, `.js`, `.jsx`, `.py`, `.rb`, `.go`, `.java`, `.php`, `.cs`, `.env`, config files, and more.

### 2. Cryptographic Scanner

Detects weak or insecure cryptographic usage.

| Detection | Severity |
|-----------|----------|
| MD5 usage | Critical |
| SHA1 usage | Critical |
| DES / 3DES / Blowfish | High |
| AES-128 (should be AES-256) | High |
| Deprecated `createCipher` (Node.js) | High |
| AES ECB mode | High |
| Plaintext password comparison (`===`) | Critical |
| TLS verification disabled | Critical |

### 3. Code Security Scanner

Detects injection vulnerabilities.

| Detection | Severity |
|-----------|----------|
| SQL injection via string concatenation | Critical |
| SQL injection via template literals | Critical |
| XSS via `innerHTML` with user input | Critical |
| XSS via `document.write` with user input | Critical |
| XSS via `v-html` / `dangerouslySetInnerHTML` | Critical |
| `eval()` with user input | Critical |
| `child_process` with user input | Critical |

### 4. Authentication Scanner

Detects missing authentication and session controls.

| Detection | Severity |
|-----------|----------|
| Routes without auth middleware | High |
| No rate limiting library found | High |
| No session timeout configuration | Medium |
| CORS set to wildcard (`*`) | High |
| No MFA implementation detected | High |

Recognizes auth frameworks: Passport.js, JWT, NextAuth, Auth0, Clerk, Supabase Auth, Firebase Auth.

### 5. Configuration Scanner

Detects infrastructure and dependency issues.

| Detection | Severity |
|-----------|----------|
| Missing `helmet` (Express/Fastify) | High |
| Missing CORS configuration | Medium |
| Secret values in `.env` file | Critical |
| Docker running as root | Medium |
| Secrets in Dockerfile ENV | Critical |
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | Critical |
| Missing `.gitignore` | High |
| `.env` not in `.gitignore` | High |
| No logging library (winston/pino/morgan) | High |

### 6. Database Scanner

Detects missing audit and compliance patterns in database schemas.

| Detection | Severity |
|-----------|----------|
| Missing `created_at` / `updated_at` columns | High |
| Missing `deleted_at` (soft delete) | Medium |
| Missing `created_by` / `updated_by` columns | Medium |
| No Audit model in Prisma schema | Medium |

Works with: Prisma schemas, Sequelize models, raw SQL, TypeORM entities.

---

## Project Types

When running `ges init`, select the project type that best matches your application:

| Type | Flag Value | Additional Policy Packs |
|------|-----------|------------------------|
| SaaS | `saas` | GDPR, OWASP, CIS, NIST |
| AI Application | `ai-application` | GDPR, OWASP, AI Pack |
| MCP Server | `mcp-server` | GDPR, AI Pack |
| Blockchain | `blockchain` | GDPR, Blockchain Pack |
| Wallet | `wallet` | GDPR, Blockchain Pack |
| Government System | `government-system` | GDPR, Government Pack |
| Healthcare System | `healthcare-system` | GDPR, OWASP, CIS |
| Event Platform | `event-platform` | GDPR, OWASP |
| Photo Storage Platform | `photo-storage-platform` | GDPR, OWASP |
| Vulnerability Scanner | `vulnerability-scanner` | GDPR, OWASP |
| Generic Web Application | `generic-web-application` | GDPR, OWASP, CIS |
| API Backend | `api-backend` | GDPR, OWASP |
| Mobile Application | `mobile-application` | GDPR, OWASP |

---

## Compliance Frameworks

| Framework | Controls | Articles Covered |
|-----------|----------|-----------------|
| GDPR | 22 controls | Articles 5, 25, 30, 32, 33, 34 |
| OWASP ASVS | 6 controls | Input validation, auth, secrets, encryption |
| CIS Controls | 5 controls | Asset management, configuration, vulnerability mgmt |
| NIST CSF | 6 controls | Identify, Protect, Detect, Respond, Recover |
| AI System Pack | 6 controls | Prompt logging, PII detection, output validation |
| Blockchain Pack | 6 controls | Signatures, key rotation, on-chain data rules |
| Government Pack | 5 controls | Data sovereignty, chain of custody, tamper evidence |

---

## Generated Project Structure

After running `ges init`, the following structure is created in your project:

```
your-project/
├── .ges/
│   ├── config.yaml              # Project configuration
│   ├── config.json              # Machine-readable config
│   ├── metadata.json            # Project metadata
│   ├── score.json               # Compliance scores
│   └── framework-version.json   # Pack versions
│
├── compliance/
│   ├── gdpr.md                  # GDPR compliance tracker
│   ├── data-inventory.md        # Data inventory template
│   ├── retention-policy.md      # Data retention policy
│   ├── processing-records.md    # Article 30 records
│   ├── risk-register.md         # Risk register template
│   ├── access-control-matrix.md # RBAC matrix
│   └── privacy-impact-assessment.md  # PIA template
│
├── security/
│   ├── threat-model.md          # Threat model (STRIDE)
│   ├── key-management.md        # Key management policy
│   ├── logging-policy.md        # Logging standard
│   ├── backup-policy.md         # Backup procedures
│   ├── incident-response.md     # Incident response plan
│   ├── disaster-recovery.md     # DR plan
│   └── encryption-standard.md   # Approved algorithms
│
├── controls/
│   ├── gdpr/controls.json       # GDPR control pack
│   ├── owasp/controls.json      # OWASP control pack
│   ├── cis/controls.json        # CIS control pack
│   └── nist/controls.json       # NIST control pack
│
├── policies/
├── checklists/
├── docs/
├── reports/
│
└── .github/
    └── workflows/
        ├── compliance.yml       # Compliance check workflow
        ├── security.yml         # Security scan workflow
        ├── dependency-scan.yml  # Dependency vulnerability scan
        └── secret-scan.yml      # Secret detection workflow
```

---

## CI/CD Integration

### GitHub Actions (Auto-generated)

Running `ges init` creates 4 GitHub Actions workflows:

1. **compliance.yml** — Runs `ges audit --ci` on push/PR/weekly
2. **security.yml** — Runs Semgrep + `ges scan --ci`
3. **dependency-scan.yml** — Runs Trivy + `npm audit`
4. **secret-scan.yml** — Runs Gitleaks on all commits

These workflows will **fail the build** if critical issues are found.

### Manual CI/CD Integration

For other CI/CD systems (GitLab, Jenkins, CircleCI, etc.):

```yaml
# GitLab CI example
compliance:
  stage: test
  image: node:22
  before_script:
    - npm install -g @greenarmor/ges
  script:
    - ges audit --ci
    - ges score --ci
  artifacts:
    paths:
      - reports/
```

```yaml
# CircleCI example
jobs:
  compliance:
    docker:
      - image: cimg/node:22
    steps:
      - checkout
      - run: npm install -g @greenarmor/ges
      - run: ges audit --ci
      - run: ges report --format markdown --output reports/compliance.md
      - store_artifacts:
          path: reports
```

### Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Audit passed (no critical findings) |
| 1 | Audit failed (critical findings exist) |

Use `--ci` flag in CI/CD pipelines to get proper exit codes.

---

## Configuration File Reference

### `.ges/config.yaml`

```yaml
project_name: My SaaS App
project_type: saas
version: 0.1.0
created_at: "2025-01-15T10:00:00.000Z"

frameworks:
  - GDPR
  - OWASP
  - CIS
  - NIST

requirements:
  encryption:
    required: true
    level: mandatory
  mfa:
    required: true
    level: mandatory
  audit_logs:
    required: true
    level: mandatory
  backups:
    required: true
    level: mandatory
  retention_policy:
    required: true
    level: mandatory
  vulnerability_scanning:
    required: true
    level: mandatory
  authentication:
    required: true
    level: mandatory
  authorization:
    required: true
    level: mandatory
  secrets_management:
    required: true
    level: mandatory
  logging:
    required: true
    level: mandatory
  monitoring:
    required: true
    level: recommended
  data_classification:
    required: true
    level: mandatory
  disaster_recovery:
    required: true
    level: mandatory
  incident_response:
    required: true
    level: mandatory
  privacy_controls:
    required: true
    level: mandatory
```

### `.ges/score.json`

```json
{
  "overall": 72,
  "frameworks": {
    "GDPR": {
      "framework": "GDPR",
      "score": 72,
      "total_controls": 22,
      "passed_controls": 16,
      "failed_controls": 4,
      "warning_controls": 2,
      "not_applicable": 0,
      "evaluated_at": "2025-01-15T10:30:00.000Z"
    }
  },
  "evaluated_at": "2025-01-15T10:30:00.000Z"
}
```

---

## Troubleshooting

### `ges: command not found`

The CLI is not installed or not in your PATH.

**macOS / Linux:**

```bash
# Reinstall globally
npm install -g @greenarmor/ges

# Verify it's in your PATH
which ges

# If using nvm, make sure you're on the right version
nvm use default
npm install -g @greenarmor/ges
```

**Windows (PowerShell):**

The npm global bin directory may not be in your PATH. This is the most common issue on Windows.

```powershell
# Check where npm installs global packages
npm config get prefix

# The command lives in the npm prefix directory
# Usually: C:\Users\<your-user>\AppData\Roaming\npm
# Verify the file exists
dir "$(npm config get prefix)\ges.cmd"

# If the file exists but ges isn't found, add npm's prefix to your PATH:
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$npmPrefix = "$(npm config get prefix)"
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmPrefix", "User")

# Then restart PowerShell and test:
ges --version
```

**Windows alternative — use npx (no PATH setup needed):**

```powershell
npx @greenarmor/ges --version
npx @greenarmor/ges init
npx @greenarmor/ges audit
```

!!! warning "Windows + nvm-windows"

    If you use [nvm-windows](https://github.com/coreybutler/nvm-windows), switching Node versions does **not** carry over globally installed packages. After `nvm use 22`, you must re-run `npm install -g @greenarmor/ges`. Alternatively, use `npx @greenarmor/ges` which works regardless of which Node version is active.

!!! tip "Windows + fnm (recommended)"

    [fnm](https://github.com/Schniz/fnm) is a faster alternative to nvm-windows that **does** carry over global packages. Install with `winget install Schniz.fnm`, then:
    ```powershell
    fnm install 22
    fnm use 22
    fnm env --use-on-cd | Out-String | Invoke-Expression
    npm install -g @greenarmor/ges
    ges --version
    ```

### `EBADENGINE` warning during install

GESF requires Node.js >= 20.0.0. The install succeeds (it's a warning, not an error), but some features may not work on older versions.

```bash
# Check your version
node --version

# Upgrade using nvm
nvm install 22
nvm use 22

# Or using winget (Windows)
winget install OpenJS.NodeJS.LTS
```

### `Error: Cannot find module '@greenarmor/ges-core'`

Workspace dependencies not resolved. This happens when running from source without building.

```bash
cd /path/to/gesf
pnpm install
pnpm -r run build
cd packages/cli && npm link
```

### `Error: GESF not initialized. Run 'ges init' first.`

You're running a command that requires an initialized project. Run `ges init` in the project directory first.

### Audit shows 0 findings on a project with known issues

The audit skips these directories: `node_modules`, `.git`, `dist`, `build`, `.next`, `coverage`, `vendor`, `__pycache__`, `.venv`.

If your source code is inside one of these, move it out. Also verify the files have recognizable extensions (`.ts`, `.js`, `.py`, `.go`, `.java`, etc.).

### `ges init` says "GESF is already initialized"

Remove the `.ges/` directory to reinitialize:

```bash
rm -rf .ges
ges init
```

### `npm link` doesn't make `ges` available

```bash
# Verify the link
ls -la $(which ges)

# Re-link
cd /path/to/gesf/packages/cli
npm unlink -g @greenarmor/ges
npm link

# Check prefix
npm config get prefix
# The bin directory under this prefix must be in your PATH
```

### Permission denied on global install

**macOS / Linux:**

```bash
# Don't use sudo with npm. Use nvm instead:
nvm install 22
nvm use 22
npm install -g @greenarmor/ges

# Or fix npm permissions:
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH
npm install -g @greenarmor/ges
```

**Windows:**

Permission errors on Windows usually mean the npm global directory is not writable. Run PowerShell as Administrator and reinstall:

```powershell
npm install -g @greenarmor/ges
```

Or change npm's default prefix to a user-writable location:

```powershell
npm config set prefix "$env:APPDATA\npm"
npm install -g @greenarmor/ges
```

---

## Uninstall

```bash
# Remove global installation
npm uninstall -g @greenarmor/ges

# If linked from source
cd /path/to/gesf/packages/cli
npm unlink -g @greenarmor/ges

# Remove GESF from a project (deletes all generated files)
rm -rf .ges compliance security controls policies checklists reports docs
rm -rf .github/workflows/compliance.yml .github/workflows/security.yml
rm -rf .github/workflows/dependency-scan.yml .github/workflows/secret-scan.yml
```

---

## System Compatibility

| OS | Node.js | Status |
|----|---------|--------|
| macOS (Intel) | 20+ | Supported |
| macOS (Apple Silicon) | 20+ | Supported |
| Ubuntu / Debian | 20+ | Supported |
| Fedora / RHEL | 20+ | Supported |
| Windows 10/11 | 20+ | Supported |
| Windows (WSL2) | 20+ | Supported |
| Alpine Linux | 20+ | Supported |
| FreeBSD | 20+ | Community |

---

## Version

Current version: **0.1.0**

Check your version:

```bash
ges --version
```
