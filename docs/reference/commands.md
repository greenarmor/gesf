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
ges init -c GB                        # Country: United Kingdom (installs UK-GDPR pack)
ges init -n "My App" -t saas -f "GDPR,OWASP"  # All options
ges init --force                      # Re-initialize existing project
```

| Flag | Short | Description |
|------|-------|-------------|
| `--name <name>` | `-n` | Project name (default: directory name) |
| `--type <type>` | `-t` | Project type (see project types below) |
| `--frameworks <list>` | `-f` | Comma-separated framework list |
| `--country <code>` | `-c` | Country of origin (e.g., `BR`, `CA`, `US-CA`, `GB`, `SG`, `PH`, `JP`, `EU`) — installs matching privacy pack |
| `--force` | | Re-initialize even if GESF is already set up |

**Project type values:** `saas`, `ai-application`, `mcp-server`, `blockchain`, `wallet`, `government-system`, `healthcare-system`, `event-platform`, `photo-storage-platform`, `vulnerability-scanner`, `generic-web-application`, `api-backend`, `mobile-application`

---

## `ges audit`

Scan source code for security and compliance violations. Language-agnostic — scans 20+ file types.

```bash
ges audit                  # Full audit with findings
ges audit --ci             # Exit code 1 on critical findings
ges audit --json           # Machine-readable JSON output
ges audit --incremental    # Only rescan changed files since last audit
```

| Flag | Description |
|------|-------------|
| `--ci` | Exit code 1 if critical findings exist (for CI/CD) |
| `--json` | Output findings and score as JSON |
| `--incremental` | Only rescan files changed since last audit (faster for large projects) |
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

#### `governance add`

Create a new governance record.

```bash
ges governance add --name "Payment API" --type api --risk high
ges governance add -n "Chatbot" --type ai-system --risk medium --desc "Customer support AI"
```

| Flag | Short | Description |
|------|-------|-------------|
| `--name <name>` | `-n` | System name |
| `--type <type>` | | System type: `ai-system`, `application`, `data-process`, `api`, `model`, `infrastructure`, `third-party-service` |
| `--risk <level>` | | Risk level: `low`, `medium`, `high`, `critical` |
| `--desc <description>` | | System description |
| `--actor <name>` | | Name of person performing this action |
| `--actor-role <role>` | | Role of person performing this action |

#### `governance approve`

Record an approval decision for a governance record.

```bash
ges governance approve gov-123 --approver "Jane Smith" --role "CISO" \
    --decision approved --authority "AI Ethics Board" --valid-until "2027-01-01"
```

| Flag | Description |
|------|-------------|
| `--approver <name>` | Approver full name |
| `--role <role>` | Approver role/title |
| `--email <email>` | Approver email |
| `--authority <authority>` | Approval authority (e.g., "AI Ethics Board") |
| `--decision <decision>` | `approved`, `rejected`, or `conditional` |
| `--valid-from <date>` | Validity start date (YYYY-MM-DD) |
| `--valid-until <date>` | Validity end date (YYYY-MM-DD) |
| `--conditions <conditions>` | Conditions (comma-separated) |
| `--rationale <text>` | Rationale for the decision |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance evidence`

Add an evidence reference to a governance record. Evidence is **referenced, not duplicated** — each entry points to the source system.

```bash
ges governance evidence gov-123 --title "DPIA Report Q4" --source jira --reference "DPIA-2026-001"
```

| Flag | Description |
|------|-------------|
| `--title <title>` | Evidence title |
| `--source <system>` | Source system: `jira`, `confluence`, `servicenow`, `sharepoint`, `grc-platform`, `email`, `git`, `file`, `url`, `other` |
| `--reference <ref>` | Reference (ticket ID, URL, document name, or path) |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance risk-assessment`

Link a risk assessment to a governance record.

```bash
ges governance risk-assessment gov-123 --assessor "John Doe" --methodology "NIST RMF" \
    --score "7.5/10" --residual medium --identified-risks "data breach,key compromise"
```

| Flag | Description |
|------|-------------|
| `--assessor <name>` | Risk assessor name |
| `--methodology <text>` | Assessment methodology (e.g., `NIST RMF`, `ISO 27005`) |
| `--score <score>` | Risk score (e.g., `7.5/10`, `High`) |
| `--residual <level>` | Residual risk level after mitigations |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance policy-basis`

Document the policy basis for a governance record.

```bash
ges governance policy-basis gov-123 --policy-name "InfoSec Policy" --standard "ISO 27001" --pv "2.1"
```

| Flag | Description |
|------|-------------|
| `--policy-id <id>` | Policy identifier |
| `--policy-name <name>` | Policy name |
| `--pv <version>` | Policy version |
| `--standard <std>` | Standard reference (e.g., `GDPR`, `ISO 27001`) |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance review-cycle`

Set up a periodic review cycle for a governance record.

```bash
ges governance review-cycle gov-123 --frequency annual --next-review 2027-01-01
```

| Flag | Description |
|------|-------------|
| `--frequency <freq>` | `quarterly`, `semi-annual`, `annual`, or `biennial` |
| `--next-review <date>` | Next review date (YYYY-MM-DD) |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance data-inventory`

Document the data inventory for a governance record.

```bash
ges governance data-inventory gov-123 --categories "names,emails,ip addresses" \
    --purposes "user authentication,analytics" --retention "2 years"
```

| Flag | Description |
|------|-------------|
| `--categories <cats>` | Personal data categories (comma-separated) |
| `--purposes <purp>` | Processing purposes (comma-separated) |
| `--retention <period>` | Retention period |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance committee`

Record committee approval for a governance record.

```bash
ges governance committee gov-123 --committee "AI Ethics Board" \
    --meeting-ref "MIN-2026-001" --meeting-date 2026-01-15
```

| Flag | Description |
|------|-------------|
| `--committee <name>` | Committee name |
| `--meeting-ref <ref>` | Meeting reference or minutes ID |
| `--meeting-date <date>` | Meeting date (YYYY-MM-DD) |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### `governance compliance-links`

Map compliance frameworks and controls to a governance record.

```bash
ges governance compliance-links gov-123 --frameworks "GDPR,OWASP" --controls "GDPR-ART32-002,OWASP-AUTH-001"
```

| Flag | Description |
|------|-------------|
| `--frameworks <fw>` | Frameworks (comma-separated, e.g., `GDPR,OWASP`) |
| `--controls <ctrls>` | Controls satisfied (comma-separated) |
| `--actor <name>` | Name of person performing this action |
| `--actor-role <role>` | Role of person performing this action |

#### Query subcommands

| Subcommand | Description |
|------------|-------------|
| `list` | List all governance records (summary view) |
| `show <id>` | Show full provenance chain for a record |
| `verify <id>` | Verify completeness of the provenance chain (8-dimension check) |
| `delete <id>` | Delete a governance record |

### Common Flags

All subcommands accept:

| Flag | Description |
|------|-------------|
| `--actor <name>` | Name of person performing this action (for audit trail) |
| `--actor-role <role>` | Role of person performing this action |

---

## `ges assign`

Assign pending audit findings to governance provenance records, creating full traceability from fix → assignee → governance record → approval → policy → evidence. See the [Fix Assignments guide](../user-guide/fix-assignments.md) for details.

### Assign a finding

```bash
# Interactive mode (prompts for finding, record, assignee)
ges assign

# Full CLI mode
ges assign \
    --finding "SECRETS-001:src/auth.ts:1" \
    --record gov-123 \
    --assignee "Bob Smith" \
    --assignee-role "Security Engineer" \
    --notes "Urgent — production key exposure" \
    --actor "Jane Smith" --actor-role "Tech Lead"
```

### List all assignments

```bash
ges assign --list
```

### Resolve a fix

```bash
ges assign --resolve "SECRETS-001:src/auth.ts:1" \
    --by "Bob Smith" \
    --by-role "Security Engineer" \
    --method manual \
    --resolution-notes "Replaced with process.env, added dotenv"
```

### Flags

| Flag | Description |
|------|-------------|
| `--finding <key>` | Finding key (`ruleId:file:line`) to assign |
| `--record <id>` | Governance record ID or system name |
| `--assignee <name>` | Person assigned to fix this |
| `--assignee-role <role>` | Role of the assignee |
| `--notes <notes>` | Notes for this assignment |
| `--actor <name>` | Your name (for audit trail) |
| `--actor-role <role>` | Your role (for audit trail) |
| `--list` | List all fix assignments |
| `--resolve <key>` | Resolve a fix assignment by finding key |
| `--by <name>` | Who resolved the fix (for `--resolve`) |
| `--by-role <role>` | Role of resolver (for `--resolve`) |
| `--method <method>` | Resolution method: `auto-fix`, `manual`, `not-applicable` |
| `--resolution-notes <notes>` | Notes about the resolution |

Assignments are stored in `.ges/fix-assignments.json` and visible in the dashboard's Fix Detail page with inline provenance chain display.

---
