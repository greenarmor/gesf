# Command Reference

Complete reference for all `ges` commands.

## Global Commands

| Command | Description |
|---------|-------------|
| `ges --version` | Show GESF version |
| `ges --help` | Show all available commands |

---

## `ges init`

Initialize GESF in the current project directory.

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

Scan source code for security and compliance violations.

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
ges report --output ./my-report.md   # Custom output path
```

| Flag | Short | Description |
|------|-------|-------------|
| `--format <format>` | `-f` | `markdown` or `html` |
| `--output <path>` | `-o` | Custom output file path |

---

## `ges scan`

Run external security scanner integrations.

```bash
ges scan                  # Run all available scanners
ges scan --ci             # Exit with error code on failures
```

| Flag | Description |
|------|-------------|
| `--ci` | Exit code 1 if any scanner fails |

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
ges generate --workflows      # Regenerate GitHub Actions workflows
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
