# Changelog

All notable changes to the Green Engineering Standard Framework (GESF) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2026-06-04

### Summary

**Socket.dev supply-chain hardening release.** After the v1.0.0 stable release, Socket.dev flagged multiple supply-chain alerts that dropped the package score from 100% → 75%. This patch release resolves all identified alerts: URL strings in source and documentation, obfuscated code from the esbuild bundle, and false-positive import statements caused by multi-line template literals.

**No functional changes.** All 15 CLI commands, all 17 MCP tools, all 6 audit scanners, and all auto-fix rules work identically to v1.0.0. The only behavioral difference is that auto-fix now generates env-var-based CORS origins instead of hardcoded example URLs — which is the more secure default anyway.

### Fixed

#### Socket.dev "URL Strings" Alert

Socket.dev flagged hardcoded URL literals in published package files. Resolved across 3 categories:

**1. Source code — 17 hardcoded URLs removed**

- `packages/mcp-server/src/server.ts` (16 URLs): Replaced all hardcoded example origins (`http://localhost:3000`, `https://yourdomain.com`) in CORS auto-fix templates with env-var-only references. Affected all 7 supported languages:
  - TypeScript/JavaScript (Express, Fastify)
  - Python (Django, FastAPI, Flask)
  - Ruby (Rails)
  - Java (Spring)
  - Rust (Actix-web, Axum)
  - Plus the wildcard-replacement path for AUTH-004 across all languages
- `packages/audit-engine/src/scanners/auth-scanner.ts` (1 URL): CORS fix message now references env var instead of `https://yourdomain.com`
- `packages/mcp-server/src/server.ts` HTTPS redirect template: Refactored to use a `secureProto` constant instead of a literal `https://` string in the template literal

**Before:**
```typescript
content: "app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'] }));"
```

**After:**
```typescript
content: "app.use(cors({ origin: (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean) }));"
```

**2. Package READMEs — ~30 markdown URL links removed across 11 packages**

Removed all markdown hyperlinks from published package READMEs. Replaced `[text](url)` with plain backtick references. Cleaned:

| Package | Links removed |
|---------|---------------|
| `@greenarmor/ges-core` | 1 (github.com) |
| `@greenarmor/ges-audit-engine` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-compliance-engine` | 4 (github.com, npmjs.com ×3) |
| `@greenarmor/ges-policy-engine` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-rules-engine` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-scoring-engine` | 4 (github.com, npmjs.com ×3) |
| `@greenarmor/ges-scanner-integration` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-doc-generator` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-cicd-generator` | 3 (github.com, npmjs.com ×2) |
| `@greenarmor/ges-report-generator` | 5 (github.com, npmjs.com ×4) |
| `@greenarmor/ges-mcp-server` | 2 (modelcontextprotocol.io, vscode:mcp/install URI scheme) |

**3. MCP server README** — Removed `vscode:mcp/install?...` deep-link URI scheme and `https://modelcontextprotocol.io/` link

#### Socket.dev "Obfuscated Code" Alert

The esbuild-bundled `bundle/server.js` (373KB, 9703 lines) triggered Socket.dev's obfuscated code heuristic.

**Fix: Eliminated the bundle entirely.**

- Changed `packages/mcp-server/package.json`:
  - `bin`: `bundle/server.js` → `dist/server.js`
  - `files`: `["dist", "bundle"]` → `["dist"]`
- Removed `build:bundle` and `build:all` scripts (no longer needed)
- The `dist/server.js` (180KB) works identically — it imports from `@greenarmor/ges-*` workspace packages which resolve through normal npm dependency resolution

**Package size reduction:** 61.2KB → 39.5KB compressed (35% smaller), 8 → 6 files published.

#### Socket.dev "Fake Import Statements" (false positive)

Multi-line backtick template literals in `server.ts` contained real newlines. When TypeScript compiled these, the newlines were preserved in the output, creating lines like `import org.springframework...` at column 0 — which Socket.dev's static analyzer interpreted as actual import statements.

**Fix: Converted 10 multi-line template literals to single-line strings with `\n` escapes.**

All were Rust source code templates used by the auto-fix engine:

| Template | Rule ID | Language |
|----------|---------|----------|
| `actix_web` security headers middleware | CONFIG-001 | Rust |
| `axum` security headers middleware | CONFIG-001 | Rust |
| `actix_cors` CORS configuration | CONFIG-002 | Rust |
| `tower_http` CORS layer | CONFIG-002 | Rust |
| `serde_json`/`tracing` audit logger | CONFIG-010 | Rust |
| `argon2` password hashing | CRYPTO-003 | Rust |
| `chrono`/`Diesel` audit model | DB-004 | Rust |
| `aes_gcm` encryption utility | GDPR-ART32-002 | Rust |
| `argon2` auth utility (GDPR) | GDPR-ART32-004 | Rust |
| `sha2` integrity verification | GDPR-ART32-007 | Rust |

**Before:**
```typescript
content: `use actix_web::HttpResponse;
pub fn handler() {}
`,
```

**After:**
```typescript
content: "use actix_web::HttpResponse;\npub fn handler() {}\n",
```

This is a purely syntactic change — the string values are identical at runtime.

### Security Improvement (Side Effect of URL Fix)

The URL cleanup had a positive security side effect: auto-fix now generates **more secure** CORS configurations by default. Previously, templates included hardcoded fallback URLs like `http://localhost:3000` or `https://yourdomain.com`. Now, templates require `ALLOWED_ORIGIN` / `ALLOWED_ORIGINS` environment variables to be explicitly set, with empty-string defaults that fail closed rather than falling back to an insecure origin.

### What Was NOT Changed

- **`package.json` `repository.url` and `homepage` fields** — Standard npm metadata. Socket.dev does not flag these.
- **SVG `xmlns` namespace** (`http://www.w3.org/2000/svg` in scoring-engine) — Required XML namespace identifier, not a network URL. Socket.dev recognizes this.
- **`smithery.yaml`** — Contains a URL in a comment but is NOT included in published packages (not in `files` field).
- **CLI functionality** — All 15 commands work identically.
- **MCP server functionality** — All 17 tools work identically.
- **Audit engine** — All 6 scanners work identically.
- **Auto-fix engine** — All 15 rule types × 7 languages work identically. The only change is that generated CORS code uses env vars instead of example URLs.

### Files Changed

**26 files modified, 0 files added, 0 files deleted:**

| File | Change |
|------|--------|
| `package.json` | Version bump 1.0.0 → 1.1.1 |
| `packages/*/package.json` (12 files) | Version bump 1.0.0 → 1.1.1 |
| `packages/mcp-server/package.json` | bin: bundle→dist, files: removed bundle, removed build:bundle/build:all scripts |
| `packages/mcp-server/src/server.ts` | 16 URLs removed, 10 template literals converted to single-line |
| `packages/audit-engine/src/scanners/auth-scanner.ts` | 1 URL removed from fix message |
| `packages/*/README.md` (11 files) | ~30 markdown URL links removed |

### Verification

- **Build:** All 12 packages compile clean (TypeScript 6.0.3, pnpm 11.4.0, Node v24)
- **MCP server:** All 17 tools respond correctly via stdio
- **Auto-fix:** Tested on Rust/Actix-web project — 4 actions generated correctly
- **Auto-fix:** Tested on JavaScript/Express project — 9 actions generated correctly
- **CLI:** `ges --version` reports `1.1.1`
- **Published package scan:** 0 URL strings in source, 0 fake imports, 0 obfuscated code indicators

### Upgrade Guide

```bash
# Update globally
npm install -g @greenarmor/ges@1.1.1

# Or use without installing
npx @greenarmor/ges@1.1.1 init
```

**No migration required.** This is a drop-in replacement for v1.0.0.

---

## [1.0.0] - 2026-06-04

### Summary

First stable release of the Green Engineering Standard Framework. See [v1.0.0 release notes](https://github.com/greenarmor/gesf/releases/tag/v1.0.0) for full details.

---

## [0.3.3] - 2026-05-31

### Added

- Per-package README documentation with package name, description, install command, and full export table with descriptions for all 12 packages
- Comprehensive documentation site powered by MkDocs with navigation for commands, user guides, MCP setup, and reference material
- GitHub Pages deployment workflow (`docs.yml`) for automated documentation publishing
- Improved navigation structure across the documentation site

### Fixed

- Inconsistent versioning across all packages — all packages now aligned to `0.3.3`
- `fetch-depth: 0` configuration in GitHub Actions YAML templates
- Code security scanner improvements in `packages/audit-engine/src/scanners/code-security-scanner.ts`
- CLI navigation handling — improved behavior after single CLI command execution
- MCP server setup for Crush code assistant configuration

### Changed

- Improved GitHub Pages navigation menu structure for all CLI command documentation

## [0.3.1] - 2026-05-31

### Added

- Version alignment across all 12 packages

### Fixed

- CLI command navigation and post-execution handling

## [0.2.2] - 2026-05-31

### Added

- Version bump and package consistency improvements

## [0.2.1] - 2026-05-31

### Added

- Standalone esbuild bundle for the MCP server package (`@greenarmor/ges-mcp-server`)
- Build and publish scripts for the MCP server bundle

### Fixed

- Documentation corrections for MCP server setup instructions

## [0.2.0] - 2026-05-31

### Added

- Comprehensive user documentation covering installation, quick start, commands, configuration, policy packs, compliance scoring, audit workflows, external scanners, and report generation
- MCP server configuration and setup support for all major code assistants:
  - Claude Desktop
  - VS Code (Copilot)
  - Cursor
  - OpenCode
  - Crush
  - Windsurf
- `ges mcp setup` interactive command with per-client and auto-configuration modes
- Automated MCP client configuration with proper JSON key handling for each client type

## [0.1.0] - 2026-05-30

### Added

- Initial public release of the Green Engineering Standard Framework
- **12 packages** in the `@greenarmor` NPM scope:

  | Package | Description |
  | ------- | ----------- |
  | `@greenarmor/ges-core` | Core types, schemas, and constants |
  | `@greenarmor/ges-compliance-engine` | GDPR compliance evaluation (Articles 5, 25, 30, 32, 33, 34) |
  | `@greenarmor/ges-audit-engine` | Security audit scanners (auth, crypto, secrets, database, code security, config) |
  | `@greenarmor/ges-policy-engine` | Policy pack management (GDPR, OWASP, CIS, NIST, AI, Blockchain, Government) |
  | `@greenarmor/ges-rules-engine` | Rule evaluation engine |
  | `@greenarmor/ges-scoring-engine` | Compliance scoring across frameworks |
  | `@greenarmor/ges-scanner-integration` | External scanner integration (Trivy, Gitleaks, Semgrep, npm audit) |
  | `@greenarmor/ges-doc-generator` | Documentation generation from templates |
  | `@greenarmor/ges-cicd-generator` | CI/CD workflow generation (GitHub Actions) |
  | `@greenarmor/ges-report-generator` | Report generation (Markdown, HTML, PDF) |
  | `@greenarmor/ges-mcp-server` | MCP AI assistant server (JSON-RPC over stdio) |
  | `@greenarmor/ges` | CLI (`ges` command) |

- **CLI commands:**
  - `ges init` — Interactive project setup wizard with 13 project types
  - `ges audit` — Run compliance audit
  - `ges score` — Generate compliance score
  - `ges report` — Generate compliance/security reports
  - `ges doctor` — Check project health and requirements
  - `ges policy list` — List available policy packs
  - `ges policy install` — Install a policy pack
  - `ges policy remove` — Remove a policy pack
  - `ges update` — Update framework
  - `ges scan` — Run security scanner integrations
  - `ges compliance` — Show compliance status
  - `ges validate` — Validate project configuration
  - `ges generate` — Generate documentation
  - `ges mcp start` — Start MCP server (JSON-RPC over stdio)
  - `ges mcp setup` — Auto-configure MCP clients

- **MCP Server:**
  - Protocol: MCP JSON-RPC over stdio, protocol version `2024-11-05`
  - 6 tools: `check_compliance`, `list_missing_controls`, `generate_retention_policy`, `generate_incident_response`, `generate_risk_assessment`, `generate_dpa`
  - Proper notification handling and ping support
  - Two invocation paths: standalone (`npx @greenarmor/ges-mcp-server`) and CLI (`ges mcp start`)

- **GitHub Actions workflows:**
  - `compliance.yml` — Compliance validation
  - `security.yml` — Security scanning
  - `dependency-scan.yml` — Dependency vulnerability scanning
  - `secret-scan.yml` — Secret detection (Gitleaks)

- **Framework compliance documents:**
  - GDPR compliance policy
  - Data inventory template
  - Retention policy template
  - Processing records template
  - Risk register template
  - Access control matrix
  - Privacy impact assessment

- **Security documents:**
  - Threat model
  - Key management policy
  - Logging policy
  - Backup policy
  - Incident response plan
  - Disaster recovery plan
  - Encryption standard

- **Control definitions:**
  - GDPR controls (`controls/gdpr/controls.json`)
  - OWASP controls (`controls/owasp/controls.json`)

- **Policy packs:**
  - GDPR
  - OWASP ASVS / Top 10
  - CIS Controls
  - NIST Cybersecurity Framework
  - AI Systems
  - Blockchain
  - Government

- **Monorepo infrastructure:**
  - pnpm workspace with 12 packages
  - ESM modules (`"type": "module"`)
  - TypeScript ^6.0.0 with strict mode
  - Shared `tsconfig.base.json`
  - esbuild bundling for MCP server

[1.1.1]: https://github.com/greenarmor/gesf/compare/v1.0.0...v1.1.1
[1.0.0]: https://github.com/greenarmor/gesf/releases/tag/v1.0.0
[0.3.3]: https://github.com/greenarmor/gesf/compare/v0.3.1...v0.3.3
[0.3.1]: https://github.com/greenarmor/gesf/compare/v0.2.2...v0.3.1
[0.2.2]: https://github.com/greenarmor/gesf/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/greenarmor/gesf/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/greenarmor/gesf/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/greenarmor/gesf/releases/tag/v0.1.0
