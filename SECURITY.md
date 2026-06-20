# Security Policy

## Overview

The Green Engineering Standard Framework (GESF) treats security as a foundational engineering concern, not an afterthought. This policy applies to the GESF monorepo itself — our development practices, dependency management, vulnerability response, and secure coding standards — as well as the security capabilities GESF provides to downstream projects.

## Supported Versions

| Version | Supported |
| ------- | --------- |
| 0.3.x   | Active development |
| < 0.3   | Unsupported |

GESF is currently in pre-1.0 active development. Breaking changes may occur between minor versions. Once 1.0 is released, we will maintain a formal LTS support schedule.

## Reporting a Vulnerability

### Security Contact

**Do not report security vulnerabilities through public GitHub issues.**

Report security vulnerabilities to:

- **Email:** security@coremates.dev
- **GitHub Security Advisories:** [github.com/greenarmor/gesf/security/advisories/new](https://github.com/greenarmor/gesf/security/advisories/new)

### What to Include

When reporting a vulnerability, please provide:

1. **Description** — A clear description of the vulnerability
2. **Affected component(s)** — Which package(s) or file(s) are affected (e.g., `@greenarmor/ges-cli`, `@greenarmor/ges-mcp-server`)
3. **Impact** — What an attacker could achieve (e.g., privilege escalation, data exposure, code execution)
4. **Reproduction steps** — Step-by-step instructions to reproduce the issue
5. **Proof of concept** — If available, a minimal proof of concept
6. **Environment** — Node.js version, OS, package manager version
7. **Suggested fix** — If you have one

### Response Timeline

| Stage | Target Time |
| ----- | ----------- |
| Acknowledgment | Within 48 hours |
| Initial assessment | Within 5 business days |
| Status update | Every 7 days until resolved |
| Patch release | Within 30 days (critical), 90 days (non-critical) |

### Disclosure Policy

- We follow **coordinated disclosure**.
- We ask that you give us 90 days to address the vulnerability before public disclosure.
- We will credit researchers in our security advisories unless anonymity is requested.
- We will not pursue legal action against good-faith security research.

## Security Architecture

### Monorepo Security

This repository is a pnpm monorepo containing 12 published packages under the `@greenarmor` NPM scope:

| Package | Purpose |
| ------- | ------- |
| `@greenarmor/ges-core` | Core types, schemas, constants |
| `@greenarmor/ges-compliance-engine` | GDPR compliance evaluation |
| `@greenarmor/ges-audit-engine` | Security audit scanners |
| `@greenarmor/ges-policy-engine` | Policy pack management |
| `@greenarmor/ges-rules-engine` | Rule evaluation |
| `@greenarmor/ges-scoring-engine` | Compliance scoring |
| `@greenarmor/ges-scanner-integration` | External scanner integration |
| `@greenarmor/ges-doc-generator` | Documentation generation |
| `@greenarmor/ges-cicd-generator` | CI/CD workflow generation |
| `@greenarmor/ges-report-generator` | Report generation (MD/HTML/PDF) |
| `@greenarmor/ges-mcp-server` | MCP AI assistant server |
| `@greenarmor/ges` | CLI (`ges` command) |

### Supply Chain Security

#### Dependency Management

- All dependencies are pinned to exact versions in `package.json`.
- `pnpm` lockfile (`pnpm-lock.yaml`) is committed and version-controlled.
- Dependency updates are reviewed manually before merging.

#### Automated Scanning

We run the following automated security scans via GitHub Actions:

| Scanner | Frequency | Workflow |
| ------- | --------- | -------- |
| **Gitleaks** | Every push and PR | `.github/workflows/secret-scan.yml` |
| **Trivy** | Every push and PR | `.github/workflows/dependency-scan.yml` |
| **npm audit** | Every push and PR | `.github/workflows/security.yml` |
| **OWASP Dependency Check** | Every push and PR | `.github/workflows/security.yml` |
| **Compliance validation** | Every push and PR | `.github/workflows/compliance.yml` |

#### Secret Management

- **Never commit secrets, API keys, private keys, or credentials to this repository.**
- Gitleaks runs as a pre-commit safeguard and in CI.
- If a secret is accidentally committed, rotate it immediately and contact security@greenarmor.dev.

### Secure Coding Standards

#### TypeScript/Node.js

- All packages use **ESM modules** (`"type": "module"`).
- All inputs are validated at package boundaries.
- No use of `eval()`, `new Function()`, or dynamic code execution.
- No use of `any` type without explicit justification.
- All external process execution is sandboxed and validated.

#### Encryption

- **Approved:** AES-256-GCM, ChaCha20-Poly1305, TLS 1.3, TLS 1.2 minimum.
- **Prohibited:** MD5, SHA-1 (for security purposes), DES, RC4, any ECB mode.

#### Authentication Standards

- **Password hashing:** Argon2id (mandatory).
- **Prohibited:** MD5, SHA-1, bcrypt for new implementations, plain text passwords.

#### Logging Standards

**Must log:**
- Authentication events (success and failure)
- Authorization decisions (denials)
- Data export operations
- Role/permission changes
- Administrative actions

**Must never log:**
- Passwords or password hashes
- API keys, tokens, or secrets
- Private keys or certificates
- Sensitive personal data (PII)

#### MCP Server Security

The MCP server (`@greenarmor/ges-mcp-server`) communicates via JSON-RPC over stdio:

- No network listener — stdio-only transport.
- No file system write access — read-only compliance evaluation.
- No outbound network requests.
- Input validation on all JSON-RPC messages.
- Proper error codes for malformed requests.

## Vulnerability Classes of Interest

Given the nature of this framework, we are particularly interested in:

| Category | Examples |
| -------- | -------- |
| **Supply chain attacks** | Dependency confusion, typosquatting, malicious post-install scripts |
| **Code injection** | Template injection in doc/report generators, YAML/JSON parsing |
| **Path traversal** | File reads in MCP server or CLI generators |
| **Privilege escalation** | Configuration override, policy bypass |
| **Sensitive data exposure** | Logging secrets, exposing PII in reports |
| **Denial of service** | ReDoS in compliance rules, unbounded recursion in scanners |
| **Insecure defaults** | Missing encryption, missing authentication requirements |

## Security Headers and Configurations

### For Downstream Projects

GESF enforces the following security requirements on projects that use it:

1. **Encryption at rest** — Required for all Restricted and Confidential data.
2. **Encryption in transit** — TLS 1.2 minimum, TLS 1.3 recommended.
3. **Multi-factor authentication** — Required for all administrative access.
4. **Audit logging** — Required for all authentication, authorization, and data operations.
5. **Data retention** — Mandatory retention policy with automated enforcement.
6. **Vulnerability scanning** — Required in CI/CD pipelines.
7. **Secret scanning** — Required in CI/CD pipelines.
8. **Access control** — RBAC with least-privilege, deny-by-default.

## Security Testing

### Pre-merge Requirements

All pull requests must pass:

1. **Secret scan** — Gitleaks detects leaked credentials.
2. **Dependency scan** — Trivy identifies vulnerable dependencies.
3. **Security scan** — npm audit and OWASP Dependency Check.
4. **Compliance scan** — GESF's own compliance validation.
5. **Build verification** — All 12 packages must build cleanly.

### Manual Security Reviews

Changes to the following components require manual security review:

- `packages/mcp-server/` — Input validation, protocol handling.
- `packages/audit-engine/src/scanners/` — Scanner logic correctness.
- `packages/compliance-engine/` — GDPR control evaluation accuracy.
- `packages/core/src/schemas/` — Schema validation completeness.
- `packages/cicd-generator/` — Generated workflow security.
- `packages/report-generator/` — Template injection prevention.

## Incident Response

### For This Repository

1. **Detection** — Automated via CI scanners or manual report.
2. **Triage** — Maintainer assesses severity and assigns CVE if applicable.
3. **Fix** — Patch developed in a private fork or branch.
4. **Advisory** — GitHub Security Advisory published with CVE.
5. **Release** — Patch version released with advisory reference.
6. **Disclosure** — Full disclosure after patch is available.

### Severity Classification

| Severity | Criteria | Response Target |
| -------- | -------- | --------------- |
| **Critical** | Remote code execution, data exposure, auth bypass | 48 hours |
| **High** | Privilege escalation, significant logic flaw | 7 days |
| **Medium** | Misconfiguration leading to reduced security | 30 days |
| **Low** | Informational, hardening recommendations | 90 days |

## Security Configuration for Contributors

### Required Tools

Contributors should have the following tools configured:

```bash
# Install gitleaks (pre-commit secret detection)
brew install gitleaks

# Run pre-commit hooks
gitleaks protect --staged
```

### Development Environment

- Node.js >= 22.0.0
- pnpm >= 11.0.0
- TypeScript ^6.0.0
- All dev dependencies installed via `pnpm install`

### Build and Test

```bash
# Build all packages
pnpm -r run build

# Run linting
pnpm run lint

# Run tests
pnpm run test
```

## Security Hall of Fame

We gratefully acknowledge security researchers who have responsibly disclosed vulnerabilities. Names will be listed here with permission.

## Supply Chain Review

GESF is monitored by [Socket.dev](https://socket.dev) for supply chain threats. This section documents the review of packages that triggered Socket.dev alerts and were determined to be acceptable or false positives.

**Last reviewed:** 2026-06-20
**Reviewer:** greenarmor

### SBOM (Software Bill of Materials)

GESF generates a CycloneDX SBOM on demand:

```bash
./scripts/generate-sbom.sh
# Output: sbom/sbom.json (CycloneDX 1.6, ~335 components)
```

The SBOM covers the full dependency tree of `@greenarmor/ges` (the published CLI package), including all optional dependencies.

### Alert 1: `fast-string-width@3.0.2` — Possible Typosquat (FALSE POSITIVE)

| Field | Value |
|-------|-------|
| **Package** | `fast-string-width@3.0.2` |
| **Socket alert** | Possible typosquat of `string-width` |
| **Dependency type** | Transitive (via `fast-wrap-ansi` ← `@inquirer/core` ← `@inquirer/*`) |
| **Direct dependency** | No — pulled in by `@inquirer/core`, an **optional** dependency |
| **Maintainer** | Fabio Spampinato ([fabiospampinato](https://github.com/fabiospampinato)) — prolific OSS author (100+ npm packages, author of Notable, Tyme) |
| **Repository** | [github.com/fabiospampinato/fast-string-width](https://github.com/fabiospampinato/fast-string-width) |
| **Purpose** | Performance-optimized string width calculation for ANSI-aware terminal rendering |
| **Replacement evaluated** | `string-width` — not viable: `@inquirer/core` pins `fast-wrap-ansi` which depends on `fast-string-width`; replacing requires forking `@inquirer/core` |
| **Verdict** | **False positive.** Legitimate, distinct package with a clear purpose. Not a typosquat — the name accurately describes a faster alternative to `string-width`. Maintained by a well-known developer. |
| **Risk** | None — package is optional (readline fallback exists) |

### Alert 2: `fast-wrap-ansi@0.2.2` — Unpopular Package (ACCEPTED)

| Field | Value |
|-------|-------|
| **Package** | `fast-wrap-ansi@0.2.2` |
| **Socket alert** | Unpopular package |
| **Dependency type** | Transitive (via `@inquirer/core`) |
| **Direct dependency** | No — pulled in by `@inquirer/core`, an **optional** dependency |
| **Maintainer** | James Garbutt ([43081j](https://github.com/43081j)) — Node.js contributor, maintains packages in the Vite/Nx ecosystem |
| **Repository** | [github.com/43081j/fast-wrap-ansi](https://github.com/43081j/fast-wrap-ansi) |
| **Purpose** | Performance-optimized ANSI-aware text wrapping for terminal prompts |
| **Replacement evaluated** | `wrap-ansi` — not viable: `@inquirer/core@11.2.1` (latest) pins `fast-wrap-ansi@^0.2.0` as a direct dependency |
| **Verdict** | **Accepted.** Low download count does not indicate malice — this is a specialized performance package explicitly chosen by the Inquirer.js team (maintained by Simon Epstein at npm/GitHub). The maintainer is a verified, active contributor to the JavaScript ecosystem. |
| **Risk** | Low — optional dependency with readline fallback |

### Alert 3: URL Strings in `@greenarmor/ges-doc-generator` (FALSE POSITIVE)

| Field | Value |
|-------|-------|
| **Socket alert** | URL strings detected |
| **Files flagged** | `gdpr.md`, `retention-policy.md`, `threat-model.md`, `privacy-impact-assessment.md`, `disaster-recovery.md`, `encryption-standard.md` |
| **Actual content** | These are **local filenames**, not URLs. They are passed to `path.join()` to generate compliance documentation files on disk. |
| **Network access** | Zero — `@greenarmor/ges-doc-generator` makes no HTTP/fetch/network calls |
| **Verification** | `grep -rnE "https?://" packages/doc-generator/src/` returns zero results |
| **Verdict** | **False positive.** Socket.dev's heuristic flagged path-like strings that resemble URLs. These are documentation template filenames used for local file generation only. |

### Alert 4: `signal-exit@4.1.0` — AI Detected Code Anomaly (ACCEPTED)

| Field | Value |
|-------|-------|
| **Package** | `signal-exit@4.1.0` |
| **Socket alert** | AI detected code anomaly (modifies process exit behavior) |
| **Dependency type** | Transitive (via `@inquirer/core`) |
| **Direct dependency** | No |
| **Maintainer** | Ben Coe ([bcoe](https://github.com/bcoe)) — maintainer of `yargs`, `nyc`, `istanbul`. Also co-maintained by Isaac Schlueter ([isaacs](https://github.com/isaacs)) — creator of Node.js and former npm CEO. |
| **Repository** | [github.com/tapjs/signal-exit](https://github.com/tapjs/signal-exit) |
| **Purpose** | Standard library for intercepting process termination signals (SIGINT, SIGTERM). Used by `@inquirer/core` to restore terminal state on Ctrl+C. |
| **Usage scope** | Only for process lifecycle handling (cleanup TTY state on exit). No file system, network, or environment variable access. |
| **Verdict** | **Accepted.** Extremely widely used package (38M+ weekly downloads across its dependents). Maintained by two of the most trusted names in the Node.js ecosystem. The "anomaly" is its legitimate purpose — intercepting signals — which is exactly what a terminal prompt library needs. |

### Alert 5: `@inquirer/core@11.2.1` — Environment Variable Access (FALSE POSITIVE)

| Field | Value |
|-------|-------|
| **Package** | `@inquirer/core@11.2.1` |
| **Socket alert** | Environment variable access (`INQUIRER_KEYBINDINGS`) |
| **Variable** | `INQUIRER_KEYBINDINGS` |
| **Purpose** | Allows users to customize keyboard shortcuts in interactive prompts (e.g., remap arrow keys). Terminal UI configuration only. |
| **Secrets accessed** | None — the variable holds keybinding JSON, not credentials |
| **Verdict** | **False positive.** The environment variable is a documented, benign configuration option for terminal UX customization. No secrets, tokens, or sensitive data are accessed. |

### Dependency Provenance and Integrity

All published `@greenarmor/*` packages:

1. **Include provenance** — npm publish with `--provenance` flag (GitHub Actions OIDC)
2. **Lockfile** — `pnpm-lock.yaml` is committed and validated on every install
3. **Integrity hashes** — `pnpm` verifies SHA-512 integrity hashes for all packages

### Optional Dependency Strategy

GESF's `@inquirer/*` packages are declared as `optionalDependencies` in `packages/cli/package.json`. This means:

- **Socket.dev consumers** can exclude them entirely by running `npm install --omit=optional`
- **The GESF CLI** automatically falls back to readline-based numbered menus if `@inquirer/*` is not installed
- **Zero hard dependency** — the CLI is fully functional without any Inquirer packages

```json
// packages/cli/package.json
{
  "optionalDependencies": {
    "@inquirer/checkbox": "^5.2.1",
    "@inquirer/confirm": "^6.1.1",
    "@inquirer/input": "^5.1.2",
    "@inquirer/select": "^5.2.1"
  }
}
```

### Supply Chain Review Log

| Date | Package | Alert | Verdict | Action |
|------|---------|-------|---------|--------|
| 2026-06-20 | `fast-string-width@3.0.2` | Typosquat | False positive | Documented |
| 2026-06-20 | `fast-wrap-ansi@0.2.2` | Unpopular | Accepted risk | Documented |
| 2026-06-20 | URL strings in doc-generator | URL strings | False positive | Documented |
| 2026-06-20 | `signal-exit@4.1.0` | Code anomaly | Accepted | Documented |
| 2026-06-20 | `@inquirer/core@11.2.1` | env var access | False positive | Documented |

## Policy Updates

This security policy is maintained alongside the codebase. Significant policy changes require maintainer approval and will be communicated via:

- GitHub release notes
- Security advisory (if applicable)
- README update

## Contact

- **Security issues:** security@coremates.dev
- **General questions:** GitHub Discussions or Issues
- **Maintainer:** [@greenarmor](https://github.com/greenarmor)

## License

This security policy is part of the Green Engineering Standard Framework and is released under the [MIT License](LICENSE).
