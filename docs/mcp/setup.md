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

GESF can be configured at two levels in VS Code:

| Scope | Available in | Config file |
|-------|-------------|-------------|
| **Global** (recommended) | All projects | OS-specific user config (see below) |
| **Project** | Current project only | `.vscode/mcp.json` in project root |

#### Option 1 — Global setup (recommended)

This makes GESF available in **every** VS Code project without per-project configuration.

**Step 1:** Open the VS Code Command Palette:

- macOS: `Cmd+Shift+P`
- Windows/Linux: `Ctrl+Shift+P`

**Step 2:** Type **"MCP: Open User Configuration"** and press Enter. This opens the global `mcp.json` file.

**Step 3:** Add the GESF server config:

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

If the file already has content, merge the `gesf` entry into the existing `servers` object — do not overwrite other entries.

**Alternatively**, edit the global config file directly:

| OS | Global config path |
|----|--------------------|
| macOS | `~/Library/Application Support/Code/User/mcp.json` |
| Linux | `~/.config/Code/User/mcp.json` |
| Windows | `%APPDATA%\Code\User\mcp.json` |

#### Option 2 — Project-level setup

Run inside your project directory:

```bash
ges mcp setup vscode
```

This creates `.vscode/mcp.json` in the project root. GESF will only be available when that project is open.

#### Reload and verify

**Reload:** `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) → type **"Developer: Reload Window"** → press Enter.

**Verify:** Open Copilot Chat → switch to **Agent mode** → click the tools icon (🔨) → `gesf` should appear in the list.

!!! warning "VS Code requires `\"type\": \"stdio\"`"

    VS Code requires the `"type": "stdio"` field in server entries. Other clients (Claude Desktop, Cursor, Windsurf) do not use this field.

!!! warning "Not a VS Code extension"

    GESF is an **MCP server**, not a VS Code extension. You will **not** find it on the VS Code Marketplace. It connects through VS Code's built-in MCP protocol support in Copilot Chat (Agent mode).

!!! danger "Do not use `${input:...}` variables or `inputs` sections"

    VS Code's `mcp.json` does **not** support `${input:...}` variable substitution or `"inputs"` arrays. Those features only work in `launch.json` and `tasks.json`. Using them in `mcp.json` causes this error:

    > `CodeExpectedError: Variable 'cwd' must be defined in an 'inputs' section of the debug or task configuration.`

    **Invalid fields that must NOT appear in `mcp.json`:**

    | Field | Reason |
    |-------|--------|
    | `"cwd"` | MCP servers inherit the workspace directory automatically |
    | `"envFile"` | Not a valid MCP config field |
    | `"sandboxEnabled"` | Not a standard MCP field |
    | `"dev"` | Not a standard MCP field |
    | `"inputs"` array | Only valid in `launch.json`/`tasks.json` |

    If you see this error, delete the invalid fields and the `inputs` section from the config file, or re-run `ges mcp setup vscode` to regenerate a clean project-level config.

!!! danger "Do not use VS Code's NPM package installer"

    VS Code's built-in NPM package GUI (Command Palette → "Install NPM Package") is **not** the right way to install GESF. If you try to install `@greenarmor/ges-mcp-server` through it, you will get confusing prompts asking for a "name" and "working directory" — those are for the NPM package metadata, not MCP configuration.

    **Instead, follow Option 1 or Option 2 above** to add the server to your `mcp.json` config file.

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
      "args": ["-y", "@greenarmor/ges-mcp-server"],
      "type": "stdio"
    }
  }
}
```

**Reload:** Restart OpenCode.

**Verify:** Run `opencode` and check that GESF tools appear when prompting the AI.

---

### Crush

**Config file:** `~/.local/share/crush/crush.json` (global).

**Add to config:**

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

!!! warning "Crush uses a single config file"

    Crush stores all configuration (providers, models, MCP servers) in a single `crush.json`. Only add/modify the `mcp.gesf` key — **do not overwrite** the rest of the file.

**Reload:** Restart Crush.

**Verify:** Run `crush_info` to confirm the GESF MCP server is connected, or ask any compliance question in a session.

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
| Claude Desktop | OS-specific (see below) | `mcpServers` | No | Global |
| VS Code | `.vscode/mcp.json` or global user `mcp.json` | `servers` | Yes (`"stdio"`) | Project/Global |
| Cursor | `.cursor/mcp.json` | `mcpServers` | No | Project |
| OpenCode | `opencode.json` or `~/.config/opencode/opencode.json` | `mcp` | Yes (`"stdio"`) | Project/Global |
| Crush | `~/.local/share/crush/crush.json` | `mcp` | Yes (`"stdio"`) | Global |
| Windsurf | `.windsurf/mcp.json` | `mcpServers` | No | Project |

**VS Code global config paths:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Code/User/mcp.json` |
| Linux | `~/.config/Code/User/mcp.json` |
| Windows | `%APPDATA%\Code\User\mcp.json` |

Or open via Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P` → **"MCP: Open User Configuration"**.

!!! example "Exercise: Set Up GESF with Your Primary Editor"

    1. Identify which AI assistant you use most often
    2. Run the automatic setup command:

    ```bash
    ges mcp setup <your-client>
    ```

    3. Restart your editor/assistant
    4. Verify the server is connected (check settings → MCP or tools list)
    5. Ask it: "Check our GDPR compliance for a SaaS application"
    6. Confirm you get a compliance score back — this proves the MCP server is working

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

!!! example "Exercise: Verify MCP Server is Running"

    After setup, verify the server responds correctly before relying on it in your editor:

    ```bash
    # Test with a single tool call
    printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"check_compliance","arguments":{"project_type":"saas"}}}\n' | npx -y @greenarmor/ges-mcp-server
    ```

    You should see:
    - An `initialize` response with protocol version `2024-11-05`
    - A `tools/call` response with compliance scores for GDPR, OWASP, CIS, NIST

    !!! question "Questions"
        - What protocol version does the server report?
        - How many tools are available?
        - What happens if you send an invalid tool name?

!!! example "Exercise: Test with the Local Build"

    If you cloned the GESF repo:

    ```bash
    # Build the project
    cd /path/to/gesf && pnpm -r run build

    # Test the MCP server directly
    printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' | node packages/mcp-server/dist/server.js
    ```

    This is useful for debugging or developing new MCP tools.

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
| VS Code: `CodeExpectedError: Variable 'cwd' must be defined` | Invalid `${input:...}` variables or `inputs` section in `mcp.json` | Remove `cwd`, `envFile`, `sandboxEnabled`, `dev` fields and `inputs` section; or re-run `ges mcp setup vscode` to regenerate clean config |
| VS Code: can't find GESF on the Marketplace | GESF is an MCP server, not a VS Code extension | Follow the manual setup above — add the server entry to your global or project `mcp.json` |
| VS Code: NPM package installer asks for "name" and "working directory" | VS Code's built-in NPM package GUI is for installing NPM packages, not configuring MCP servers | Cancel the installer. Edit `mcp.json` directly (see Option 1 or 2 above) |
| VS Code: server not found after `ges mcp setup vscode` | Setup only creates project-level `.vscode/mcp.json` | For global availability, edit the global `mcp.json` instead (see Option 1 above) |
