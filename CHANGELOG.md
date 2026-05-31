# Changelog

All notable changes to the Green Engineering Standard Framework (GESF) will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[0.3.3]: https://github.com/greenarmor/gesf/compare/v0.3.1...v0.3.3
[0.3.1]: https://github.com/greenarmor/gesf/compare/v0.2.2...v0.3.1
[0.2.2]: https://github.com/greenarmor/gesf/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/greenarmor/gesf/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/greenarmor/gesf/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/greenarmor/gesf/releases/tag/v0.1.0
