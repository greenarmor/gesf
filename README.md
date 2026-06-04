# 🔰 Green Engineering Standard Framework (GESF)

![GESF Compliance](badge.svg)
<!-- GESF-SCORE-START -->
> **GESF Compliance Score: 100% (A)**
>
> | Framework | Score | Grade | Controls |
> |-----------|-------|-------|----------|
> | GDPR | 100% | A | 22/22 passed |
> | OWASP | 100% | A | 6/6 passed |
> | CIS | 100% | A | 5/5 passed |
> | NIST | 100% | A | 6/6 passed |
>
> _(Last evaluated: 2026-06-02)_
<!-- GESF-SCORE-END -->


Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards.

## Install

```bash
npm install -g @greenarmor/ges
```

Requires Node.js >= 20.

<details>
<summary>Windows troubleshooting</summary>

If `ges` is not recognized after install, the npm global bin directory is not in your PATH:

```powershell
# Check where npm installs globals
npm config get prefix

# Use npx as a quick alternative (no PATH needed)
npx @greenarmor/ges --version

# Or add npm's prefix to PATH permanently
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$npmPrefix = "$(npm config get prefix)"
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmPrefix", "User")
# Restart PowerShell, then:
ges --version
```

If you use nvm-windows, global packages don't carry over between Node versions — re-run `npm install -g @greenarmor/ges` after `nvm use`.

</details>

## Usage

```bash
cd any-project
ges init
ges audit
ges score
```

## MCP AI Assistant

GESF includes an MCP server that lets AI assistants (Claude, VS Code Copilot, Cursor, Crush, OpenCode, Windsurf) check compliance, list missing controls, and generate policies.

### One-Click Install

| Client | Install |
|--------|---------|
| VS Code | [Install in VS Code](vscode:mcp/install?%7B%22name%22%3A%22gesf%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40greenarmor%2Fges-mcp-server%22%5D%7D) |
| Smithery | `npx smithery add @greenarmor/ges-mcp-server` |

### Quick Setup (CLI)

```bash
ges mcp setup              # Interactive — pick your client
ges mcp setup claude       # Claude Desktop
ges mcp setup vscode       # VS Code Copilot
ges mcp setup cursor       # Cursor
ges mcp setup opencode     # OpenCode
ges mcp setup crush        # Crush
ges mcp setup windsurf     # Windsurf
ges mcp setup all          # Configure all clients
```

### Manual Configuration

Add this to your MCP client config:

```json
{
  "mcpServers": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

**VS Code:** Use `"servers"` instead of `"mcpServers"` and add `"type": "stdio"`. You can configure globally (all projects) via Command Palette → "MCP: Open User Configuration", or per-project in `.vscode/mcp.json`.

**OpenCode/Crush:** Use `"mcp"` instead of `"mcpServers"` and add `"type": "stdio"`.

> **Note:** GESF is an MCP server, not a VS Code extension. You won't find it on the VS Code Marketplace. Use the [one-click install link](vscode:mcp/install?%7B%22name%22%3A%22gesf%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40greenarmor%2Fges-mcp-server%22%5D%7D) above or the manual config steps.

### Available Tools (17 total)

#### Compliance Assessment

| Tool | Description |
|------|------------|
| `check_compliance` | Check GDPR compliance status for a project type |
| `check_project_status` | Read actual `.ges/` directory for real-time project status |
| `list_missing_controls` | Show compliance controls that are not passing |
| `list_framework_controls` | List all controls for a framework with status |
| `run_audit` | Run a full 6-scanner source code audit |
| `generate_compliance_report` | Generate a full compliance report with scoring |
| `generate_audit_report` | Combine real audit findings with compliance scoring |

#### Fix & Implement

| Tool | Description |
|------|------------|
| `auto_fix` | Automatically fix security findings in source code |
| `implement_control` | Generate implementation files for a specific control |
| `apply_control_override` | Mark a control as not-applicable or pass |
| `fix_recommendation` | Get step-by-step remediation guidance for a control |

#### Document Generation

| Tool | Description |
|------|------------|
| `generate_retention_policy` | Generate a data retention policy |
| `generate_incident_response` | Generate an incident response plan |
| `generate_risk_assessment` | Generate a risk assessment |
| `generate_dpa` | Generate a Data Processing Agreement |
| `generate_data_inventory` | Generate a data inventory with classifications |
| `generate_processing_records` | Generate Article 30 Records of Processing Activities |

### Supported Languages (7)

JavaScript/TypeScript, Python, Go, Java, Ruby, PHP, Rust — with framework-specific detection for Express, Django, Gin, Spring, Rails, Laravel, Actix-web, and more.

### Example Prompts

#### Compliance Checks

- "Are we GDPR compliant?"
- "Show missing controls for GDPR"
- "List all CIS controls and their status"
- "Check the real-time project status from .ges/"

#### Auto-Fix & Implementation

- "Scan my project at /path/to/project and auto-fix all security issues"
- "Run a dry-run auto-fix first — show me what would change"
- "Implement encryption at rest for GDPR-ART32-002"
- "Generate an audit logging module for my project"
- "Add rate limiting to my Express app automatically"
- "Fix all findings you can and tell me what needs manual review"
- "How do I fix CONFIG-001?"

#### Audit & Reports

- "Run a security audit on my project and generate a report"
- "Generate a full compliance report for my SaaS application"
- "Audit my codebase and show me all findings with severity levels"

#### Document Generation

- "Generate a retention policy for MyApp"
- "Generate an incident response plan"
- "Generate a risk assessment"
- "Generate a DPA for our vendor relationship"
- "Generate a data inventory for our AI application"
- "Generate Article 30 processing records"

#### Control Overrides

- "Mark GDPR-ART32-001 as not-applicable — we don't process EU data"
- "Mark OWASP-ASVS-003 as pass — we verified it manually"

#### Compound Workflows

- "Audit my project, auto-fix what you can, then generate a compliance report"
- "Check compliance, show missing GDPR controls, fix them, and generate a risk assessment"
- "Scan /path/to/project, apply auto-fix, and tell me what still needs manual review"

## Architecture

```
packages/
├── cli/                    # CLI (@greenarmor/ges)
├── core/                   # Types, schemas, constants
├── audit-engine/           # Real source code scanning (6 scanners)
├── compliance-engine/      # GDPR Article 5/25/30/32/33/34 controls
├── policy-engine/          # 7 policy packs (GDPR, OWASP, AI, Blockchain, Gov, CIS, NIST)
├── rules-engine/           # Auth, encryption, secrets, logging standards
├── doc-generator/          # 14 compliance/security document templates
├── cicd-generator/         # GitHub Actions workflow generation
├── scoring-engine/         # Multi-framework compliance scoring
├── scanner-integration/    # External tool integration (Trivy, Gitleaks, Semgrep)
├── report-generator/       # Markdown/HTML report generation
└── mcp-server/             # MCP AI compliance assistant
```

## License
MIT
