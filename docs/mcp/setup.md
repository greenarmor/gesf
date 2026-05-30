# MCP Setup Guide

## Automatic Setup (Recommended)

The `ges mcp setup` command auto-configures your AI assistant by writing the correct configuration to the right file.

### Set Up a Single Client

```bash
ges mcp setup claude       # Claude Desktop
ges mcp setup vscode       # VS Code (Copilot)
ges mcp setup cursor       # Cursor
ges mcp setup opencode     # OpenCode
ges mcp setup crush        # Crush
ges mcp setup windsurf     # Windsurf
```

### Set Up All Clients

```bash
ges mcp setup all
```

### Interactive Mode

```bash
ges mcp setup
```

Shows a list of supported clients to pick from.

### After Setup

**Restart your AI assistant** after running the setup command. The server loads when the assistant starts.

---

## Manual Setup Per Client

If automatic setup doesn't work or you need custom configuration, follow the instructions for your client below.

### Claude Desktop

**Config file:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

**Add to config:**

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

**Reload:** Quit and reopen Claude Desktop.

**Verify:** Open Claude Desktop settings → Developer → look for `gesf` in the MCP servers list.

---

### VS Code (Copilot / GitHub Copilot Chat)

**Config file:** `.vscode/mcp.json` in your project root.

**Add to config:**

```json
{
  "servers": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"],
      "type": "stdio"
    }
  }
}
```

!!! warning "VS Code requires `\"type\": \"stdio\"`"

    VS Code is the only client that requires the `"type": "stdio"` field. Other clients do not use this field.

**Reload:** `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` → `Developer: Reload Window`.

**Verify:** Open Copilot Chat, switch to **Agent mode**, click the tools icon — `gesf` should appear.

---

### Cursor

**Config file:** `.cursor/mcp.json` in your project root.

**Add to config:**

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

**Reload:** Quit and reopen Cursor.

**Verify:** Open Cursor settings → MCP → look for `gesf` in the active servers list.

---

### OpenCode

**Config file:** `opencode.json` in project root (project-level) or `~/.config/opencode/opencode.json` (global).

**Add to config:**

```json
{
  "mcp": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

**Reload:** Restart OpenCode.

---

### Crush

**Config file:** `~/.local/share/crush/crush.json` (global).

**Add to config:**

```json
{
  "mcp": {
    "gesf": {
      "command": "npx",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

!!! warning "Crush uses a single config file"

    Crush stores all configuration (providers, models, MCP servers) in a single `crush.json`. Only add/modify the `mcp.gesf` key — **do not overwrite** the rest of the file.

**Reload:** Restart Crush.

---

### Windsurf

**Config file:** `.windsurf/mcp.json` in your project root.

**Add to config:**

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

**Reload:** Quit and reopen Windsurf.

---

## Using a Local Build (Source)

If you are developing GESF or installed from source:

```json
{
  "mcpServers": {
    "gesf": {
      "command": "node",
      "args": ["/absolute/path/to/gesf/packages/mcp-server/dist/server.js"]
    }
  }
}
```

Or via the CLI:

```json
{
  "mcpServers": {
    "gesf": {
      "command": "node",
      "args": ["/absolute/path/to/gesf/packages/cli/dist/cli.js", "mcp", "start"]
    }
  }
}
```

---

## Client Quick Reference

| Client | Config File | JSON Key | Needs `type` | Scope |
|--------|------------|----------|:------------:|-------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` | `mcpServers` | No | Global |
| VS Code | `.vscode/mcp.json` | `servers` | Yes | Project |
| Cursor | `.cursor/mcp.json` | `mcpServers` | No | Project |
| OpenCode | `opencode.json` | `mcp` | No | Project/Global |
| Crush | `~/.local/share/crush/crush.json` | `mcp` | No | Global |
| Windsurf | `.windsurf/mcp.json` | `mcpServers` | No | Project |

!!! example "Exercise: Set Up GESF with Your Primary Editor"

    1. Identify which AI assistant you use most often
    2. Run the automatic setup command:

    ```bash
    ges mcp setup <your-client>
    ```

    3. Restart your editor/assistant
    4. Verify the server is connected (check settings → MCP or tools list)
    5. Ask it: "Are we GDPR compliant?"

!!! example "Exercise: Set Up Multiple Clients"

    Configure GESF for all the assistants you use:

    ```bash
    # Configure all at once
    ges mcp setup all

    # Or one at a time
    ges mcp setup claude
    ges mcp setup vscode
    ges mcp setup cursor
    ```

    After each setup, restart the client and verify the `gesf` server appears in its MCP settings.

!!! example "Exercise: Manual vs Automatic Setup"

    1. Run `ges mcp setup claude` (automatic)
    2. Open the config file and look at what was added:

    ```bash
    # macOS
    cat ~/Library/Application\ Support/Claude/claude_desktop_config.json
    ```

    3. Understand the structure — the `gesf` entry under `mcpServers`
    4. Try removing the entry and adding it back manually
    5. Verify the server still works after your manual edit

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Server not found in client | Config file in wrong location or bad JSON | Verify the config file path for your OS; validate JSON syntax |
| `npx` hangs or fails | Stale cache or no network | Run `npx clear-npx-cache` then retry; or install globally and change command to `ges-mcp-server` |
| Tools not appearing | Client not reloaded | Restart the client completely (quit, not just close window) |
| `EACCES` permission error | Config directory not writable | Create the directory: `mkdir -p <config-dir>` |
| Server crashes on start | Node.js too old | Verify `node --version` is >= 22.0.0 |
| `Cannot find module` | Package not installed | Use `npx -y` to auto-install |
| Duplicate `gesf` entries | Ran setup twice | Manually edit config to keep only one `gesf` entry |
| Crush loses other config | Config file overwritten | Only edit the `mcp.gesf` key, do not replace the entire file |
