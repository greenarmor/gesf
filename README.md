# 🔰 Green Engineering Standard Framework (GESF)

![GESF Compliance](.ges/badge.svg)

Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards.

## Install

```bash
npm install -g @greenarmor/ges
```

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

For VS Code, use `"servers"` instead of `"mcpServers"` and add `"type": "stdio"`.
For OpenCode/Crush, use `"mcp"` instead of `"mcpServers"` and add `"type": "stdio"`.

### Available Tools

| Tool | Description |
|------|-------------|
| `check_compliance` | Check GDPR compliance status for a project |
| `list_missing_controls` | Show missing compliance controls |
| `generate_retention_policy` | Generate a data retention policy template |
| `generate_incident_response` | Generate an incident response plan template |
| `generate_risk_assessment` | Generate a risk assessment template |
| `generate_dpa` | Generate a Data Processing Agreement template |

### Example Prompts

- "Are we GDPR compliant?"
- "Show missing controls for GDPR"
- "Generate a retention policy for MyApp"
- "Generate an incident response plan"
- "Generate a risk assessment"

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
