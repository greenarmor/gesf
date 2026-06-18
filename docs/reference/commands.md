# Command Reference

Complete reference for all `ges` commands.

## Global Commands

| Command | Description |
|---------|-------------|
| `ges --version` | Show GESF version |
| `ges --help` | Show all available commands |

---

## `ges init`

Initialize GESF in the current project directory. Works with any programming language.

```bash
ges init                              # Interactive prompts
ges init -n "My App"                  # Specify name
ges init -t saas                      # Specify type
ges init -f "GDPR,OWASP,NIST"        # Specify frameworks
ges init -n "My App" -t saas -f "GDPR,OWASP"  # All options
```

| Flag | Short | Description |
|------|-------|-------------|
| `--name <name>` | `-n` | Project name (default: directory name) |
| `--type <type>` | `-t` | Project type (see project types below) |
| `--frameworks <list>` | `-f` | Comma-separated framework list |

**Project type values:** `saas`, `ai-application`, `mcp-server`, `blockchain`, `wallet`, `government-system`, `healthcare-system`, `event-platform`, `photo-storage-platform`, `vulnerability-scanner`, `generic-web-application`, `api-backend`, `mobile-application`

---

## `ges audit`

Scan source code for security and compliance violations. Language-agnostic — scans 20+ file types.

```bash
ges audit                  # Full audit with findings
ges audit --ci             # Exit code 1 on critical findings
ges audit --json           # Machine-readable JSON output
```

| Flag | Description |
|------|-------------|
| `--ci` | Exit code 1 if critical findings exist (for CI/CD) |
| `--json` | Output findings and score as JSON |

---

## `ges score`

Display compliance score.

```bash
ges score                  # Human-readable score
ges score --ci             # JSON output for CI/CD
```

| Flag | Description |
|------|-------------|
| `--ci` | Output raw JSON score data |

---

## `ges report`

Generate compliance reports.

```bash
ges report                           # Markdown report
ges report --format html             # HTML report
ges report --format pdf              # PDF report
ges report --output ./my-report.md   # Custom output path
```

| Flag | Short | Description |
|------|-------|-------------|
| `--format <format>` | `-f` | `markdown`, `html`, or `pdf` |
| `--output <path>` | `-o` | Custom output file path |

---

## `ges badge`

Generate a compliance score badge (SVG) for your README or documentation.

```bash
ges badge                                        # Generate badge.svg + inject into README
ges badge -o ./docs/assets/images/badge.svg      # Custom output path
ges badge --readme ./docs/README.md               # Inject into a specific README
ges badge --no-readme                             # Generate SVG only, skip README injection
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--output <path>` | `-o` | Output path for the SVG badge | `badge.svg` |
| `--readme <path>` | | README file to inject badge and score summary into | `README.md` |
| `--no-readme` | | Skip README injection, generate SVG only | — |

The badge displays your overall compliance score and letter grade with color coding. When injected into a README, it also adds a per-framework score breakdown table. See the [Compliance Badge guide](../user-guide/compliance-badge.md) for full details.

---

## `ges scan`

Run external security scanner integrations. **Language-agnostic** — auto-detects your project's ecosystem and package manager from lockfiles, then runs the matching dependency auditor.

```bash
ges scan                  # Run all available scanners
ges scan --ci             # Exit with error code on failures
```

| Flag | Description |
|------|-------------|
| `--ci` | Exit code 1 if any scanner fails |

### How Ecosystem Detection Works

The scan automatically detects your project's language and runs the correct tools:

| Detected Ecosystem | Dependency Auditor | Language-Agnostic Scanners |
|-------------------|-------------------|---------------------------|
| Node.js (pnpm/npm/yarn/bun) | Matching `audit` command | Trivy, Gitleaks, Semgrep |
| Python (pip/poetry/uv) | `pip-audit` | Trivy, Gitleaks, Semgrep |
| Rust | `cargo audit` | Trivy, Gitleaks, Semgrep |
| Go | `govulncheck` | Trivy, Gitleaks, Semgrep |
| Ruby | `bundle-audit` | Trivy, Gitleaks, Semgrep |
| Java | OWASP Dependency-Check | Trivy, Gitleaks, Semgrep |
| PHP | `composer audit` | Trivy, Gitleaks, Semgrep |
| .NET | `dotnet list package --vulnerable` | Trivy, Gitleaks, Semgrep |

SBOM scanning (Syft, Trivy SBOM, Grype) also runs for all ecosystems.

Example output:

```
  Detected ecosystem: node (pnpm)
  Running security scans...

  Security Scan Results
  -------------------
  pnpm audit                     PASS
  Trivy                          N/A
  Gitleaks                       N/A
  Semgrep                        N/A
```

---

## `ges compliance`

Show compliance status per policy pack.

```bash
ges compliance
```

---

## `ges validate`

Validate GESF configuration against schemas.

```bash
ges validate
```

---

## `ges generate`

Regenerate documentation or CI/CD workflows.

```bash
ges generate --docs           # Regenerate compliance/security documents
ges generate --workflows      # Regenerate GitHub Actions workflows (5 workflows)
ges generate --all            # Regenerate everything
```

| Flag | Description |
|------|-------------|
| `--docs` | Regenerate compliance and security documents |
| `--workflows` | Regenerate GitHub Actions workflows |
| `--all` | Regenerate everything |

---

## `ges policy`

Manage policy packs.

```bash
ges policy list               # List all available packs
ges policy install ai         # Install the AI policy pack
ges policy remove blockchain  # Remove the blockchain pack
```

---

## `ges doctor`

Run configuration health diagnostics.

```bash
ges doctor
```

---

## `ges mcp`

MCP AI Compliance Assistant.

```bash
ges mcp start                 # Start MCP server (JSON-RPC over stdio)
ges mcp setup                 # Interactive client selection
ges mcp setup claude          # Configure Claude Desktop
ges mcp setup vscode          # Configure VS Code Copilot
ges mcp setup cursor          # Configure Cursor
ges mcp setup opencode        # Configure OpenCode
ges mcp setup crush           # Configure Crush
ges mcp setup windsurf        # Configure Windsurf
ges mcp setup all             # Configure all clients
```

---

## `ges update`

Check for GESF updates.

```bash
ges update
```

---

## `ges fix`

Automatically fix security and compliance findings detected by the audit engine. See the [Auto-Fix guide](../user-guide/auto-fix.md) for details.

```bash
ges fix                  # Apply all auto-fixable issues
ges fix --dry-run        # Preview without making changes
ges fix --rules CONFIG-001,SECRETS-001  # Fix only specific rules
ges fix --ci             # Exit non-zero if findings remain
```

| Flag | Short | Description |
|------|-------|-------------|
| `--dry-run` | `-d` | Show what would be fixed without modifying files |
| `--rules <ids>` | `-r` | Comma-separated rule IDs to fix |
| `--ci` | | Exit with code 1 if findings remain |

---

## `ges hooks`

Manage Git pre-commit hooks that enforce compliance checks before commits. See the [Git Hooks guide](../user-guide/git-hooks.md) for details.

```bash
ges hooks install       # Install the pre-commit hook
ges hooks uninstall     # Remove the pre-commit hook
```

The pre-commit hook runs `ges audit --ci` and blocks commits with critical findings.

---

## `ges dashboard`

Start a local web dashboard showing real-time compliance posture. See the [Web Dashboard guide](../user-guide/web-dashboard.md) for details.

```bash
ges dashboard                  # Default: http://localhost:3001
ges dashboard --port 8080      # Custom port
ges dashboard --host 0.0.0.0   # Allow network access
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--port <port>` | `-p` | Port number | `3001` |
| `--host <host>` | `-h` | Host to bind to | `localhost` |

---

## `ges control`

Manually mark a compliance control's status. Useful for controls that cannot be detected by source code scanning.

```bash
ges control GDPR-ART32-001 pass                           # Mark as passing
ges control GDPR-ART32-001 not-applicable -r "Not using AWS"  # Mark as not applicable
ges control OWASP-ASVS-003 fail -r "RBAC not yet implemented"  # Mark as failing
```

| Argument/Flag | Description |
|---------------|-------------|
| `<controlId>` | Control ID (e.g., `GDPR-ART32-001`) |
| `<status>` | `pass`, `fail`, `warning`, `not-applicable`, or `not-implemented` |
| `-r, --reason <reason>` | Reason for the override |

Overrides are saved to `.ges/control-overrides.json` and affect your compliance score on the next audit.

---

## `ges governance`

Manage governance provenance chains — linked records connecting system identity, risk assessment, policy basis, approval, evidence, review cycle, and compliance links. See the [Governance guide](../user-guide/governance.md) for full details.

```bash
ges governance add --name "API" --type api --risk high    # Create a record
ges governance list                                         # List all records
ges governance show <id>                                    # Show full provenance chain
ges governance verify <id>                                  # Verify completeness
ges governance approve <id> --approver "Jane" --role "CISO" --decision approved  # Record approval
ges governance evidence <id> --title "DPIA" --source jira --reference "DPIA-001"  # Add evidence
ges governance delete <id>                                  # Delete a record
```

### Subcommands

| Subcommand | Description |
|------------|-------------|
| `add` | Create a new governance record |
| `approve` | Record an approval decision |
| `evidence` | Add an evidence reference |
| `risk-assessment` | Link a risk assessment |
| `policy-basis` | Document the policy basis |
| `review-cycle` | Set up periodic review |
| `data-inventory` | Document data inventory |
| `committee` | Record committee approval |
| `compliance-links` | Map compliance frameworks |
| `list` | List all records |
| `show` | Show full provenance chain |
| `verify` | Verify completeness |
| `delete` | Delete a record |

### Common Flags

All subcommands accept:

| Flag | Description |
|------|-------------|
| `--actor <name>` | Name of person performing this action (for audit trail) |
| `--actor-role <role>` | Role of person performing this action |

---
