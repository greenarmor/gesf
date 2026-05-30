# @greenarmor/ges-mcp-server

GESF MCP Server — AI Compliance Assistant for GDPR, OWASP, NIST, and CIS frameworks.

An [MCP (Model Context Protocol)](https://modelcontextprotocol.io/) server that provides compliance checking, policy generation, and risk assessment tools to any MCP-compatible AI code assistant.

## Tools

| Tool | Description |
|------|-------------|
| `check_compliance` | Check GDPR/OWASP compliance status for a project type |
| `list_missing_controls` | Show missing compliance controls for a framework |
| `generate_retention_policy` | Generate a data retention policy template |
| `generate_incident_response` | Generate an incident response plan template |
| `generate_risk_assessment` | Generate a risk assessment template |
| `generate_dpa` | Generate a Data Processing Agreement template |

## Installation

### VS Code / Copilot

Add to `.vscode/mcp.json` in your project:

```json
{
  "servers": {
    "gesf": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

Or use the one-click install link:

[Install in VS Code](vscode:mcp/install?%7B%22name%22%3A%22gesf%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40greenarmor%2Fges-mcp-server%22%5D%7D)

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

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

### Cursor

Add to `.cursor/mcp.json`:

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

### Windsurf

Add to `.windsurf/mcp.json`:

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

### OpenCode

Add to `opencode.json`:

```json
{
  "mcp": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"],
      "type": "stdio"
    }
  }
}
```

### Crush

Add to `~/.local/share/crush/crush.json`:

```json
{
  "mcp": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"],
      "type": "stdio"
    }
  }
}
```

### Smithery

```bash
npx smithery add @greenarmor/ges-mcp-server
```

### Global Install

```bash
npm install -g @greenarmor/ges-mcp-server
ges-mcp
```

## Example Prompts

Once connected, ask your AI assistant:

- "Are we GDPR compliant?"
- "Show missing OWASP controls"
- "Generate a retention policy for MyApp"
- "Generate an incident response plan"
- "Generate a risk assessment"
- "Generate a Data Processing Agreement"

## Requirements

- Node.js >= 22.0.0

## License

MIT
