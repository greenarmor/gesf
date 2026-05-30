# MCP Integration Overview

GESF includes an MCP (Model Context Protocol) server that lets AI code assistants interact with your compliance data directly. Instead of running CLI commands manually, you can ask your AI assistant to check compliance, list missing controls, and generate policy documents — all from within your editor.

## What Is MCP?

MCP (Model Context Protocol) is a standard protocol that allows AI applications to communicate with external tools. When you configure GESF as an MCP server, your code assistant can:

- Check your project's GDPR compliance status
- List missing compliance controls for any framework
- Generate retention policies, incident response plans, risk assessments, and DPAs
- Get real-time compliance guidance while writing code

## Supported AI Assistants

| Client | Setup Command | Scope |
|--------|--------------|-------|
| Claude Desktop | `ges mcp setup claude` | Global |
| VS Code (Copilot) | `ges mcp setup vscode` | Project |
| Cursor | `ges mcp setup cursor` | Project |
| OpenCode | `ges mcp setup opencode` | Project or Global |
| Crush | `ges mcp setup crush` | Global |
| Windsurf | `ges mcp setup windsurf` | Project |

## How It Works

```
┌─────────────────┐     MCP (JSON-RPC)     ┌──────────────────┐
│  AI Assistant   │ ◄──────────────────────► │  GESF MCP Server │
│  (Claude, etc.) │    stdin / stdout        │  (6 tools)       │
└─────────────────┘                          └──────────────────┘
```

1. You configure GESF as an MCP server in your AI assistant's settings
2. When you ask a compliance question, the assistant calls GESF tools
3. GESF returns compliance data, generated documents, or control lists
4. The assistant presents the results in natural language

## Quick Setup

```bash
# Automatic (recommended)
ges mcp setup claude

# Or interactive — pick from a list
ges mcp setup

# Or configure all clients at once
ges mcp setup all
```

**Restart your AI assistant** after setup. The server loads when the assistant starts.

!!! example "Exercise: Test the MCP Server Manually"

    Before connecting to an AI assistant, verify the server works by sending test requests:

    ```bash
    printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"check_compliance","arguments":{"project_type":"saas"}}}\n' | npx -y @greenarmor/ges-mcp-server
    ```

    You should see JSON responses for:
    - `initialize` — server capabilities and protocol version
    - `tools/list` — 6 tool definitions
    - `tools/call` — compliance status for a SaaS project

    !!! question "Questions"
        - How many tools are listed in the `tools/list` response?
        - What does the `check_compliance` response look like?
