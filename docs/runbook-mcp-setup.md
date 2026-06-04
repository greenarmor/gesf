# GESF MCP Server Setup Runbook

Install the GESF MCP AI Compliance Assistant into any MCP-compatible client.

---

## Prerequisites

- [ ] Node.js >= 20.0.0 installed (`node --version`)
- [ ] GESF installed globally (`npm install -g @greenarmor/ges`) **or** available via `npx`
- [ ] At least one MCP-compatible client installed (see below)

!!! info "Windows users"

    On Windows, `ges mcp setup` automatically writes **absolute paths** to `node.exe` and `npx.cmd` in the config. This avoids the common issue where VS Code can't find `npx` because it doesn't inherit your PowerShell PATH. No manual path lookup is needed when using `ges mcp setup`.

---

## Option A — Automatic Setup (Recommended)

The `ges mcp setup` command auto-configures supported clients.

### Install GESF

```bash
# Global install
npm install -g @greenarmor/ges

# Or use without installing
npx @greenarmor/ges mcp setup
```

### Configure a single client

```bash
ges mcp setup claude       # Claude Desktop
ges mcp setup vscode       # VS Code (Copilot)
ges mcp setup cursor       # Cursor
ges mcp setup opencode     # OpenCode
ges mcp setup crush        # Crush
ges mcp setup windsurf     # Windsurf
```

### Configure all clients at once

```bash
ges mcp setup all
```

### Interactive mode

```bash
ges mcp setup
# Prompts you to select a client from a list
```

After setup, restart the target client to load the server.

---

## Option B — Manual Setup (Per-Client)

If automatic setup is unavailable or you need custom configuration, follow the instructions for your client below.

### 1. Claude Desktop

**Config file location:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

**Add this to the config file:**

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

If the file already exists, merge the `gesf` entry into the existing `mcpServers` object. Do not overwrite other entries.

**Reload:** Quit and reopen Claude Desktop.

**Verify:** Open Claude Desktop settings → Developer → look for `gesf` in the MCP servers list.

---

### 2. VS Code (Copilot / GitHub Copilot Chat)

GESF can be configured at two levels in VS Code:

#### Option A — Global config (recommended, all projects)

**Step 1:** Open the VS Code Command Palette:

- macOS: `Cmd+Shift+P`
- Windows/Linux: `Ctrl+Shift+P`

**Step 2:** Type **"MCP: Open User Configuration"** and press Enter. This opens the global `mcp.json`.

**Step 3:** Add the server entry:

**macOS / Linux:**

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

**Windows:**

VS Code may not find `npx` in its process PATH. Use the absolute path to `npx.cmd`:

```powershell
# Find your npx path in PowerShell
where.exe npx
# Typical: C:\Program Files\nodejs\npx.cmd
```

```json
{
  "servers": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "@greenarmor/ges-mcp-server"],
      "type": "stdio"
    }
  }
}
```

!!! tip "Use `ges mcp setup vscode` on Windows"

    Running `ges mcp setup vscode` (or `npx @greenarmor/ges mcp setup vscode`) **automatically detects the absolute path** to `npx.cmd` or `node.exe` and writes it into the config. No manual path lookup needed.

If the file already has content, merge the `gesf` entry into the existing `servers` object.

**Or edit the file directly:**

| OS | Global config path |
|----|--------------------|
| macOS | `~/Library/Application Support/Code/User/mcp.json` |
| Linux | `~/.config/Code/User/mcp.json` |
| Windows | `%APPDATA%\Code\User\mcp.json` |

#### Option B — Project-level config (single project)

Run inside your project directory:

```bash
ges mcp setup vscode
```

This creates `.vscode/mcp.json` in the project root. GESF will only be available when that project is open.

**Config content (same for both global and project-level):**

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

If the file already exists, merge the `gesf` entry into the existing `servers` object.

!!! danger "Do not use `${input:...}` variables in `mcp.json`"

    VS Code's `mcp.json` does **not** support `${input:...}` variable substitution or `"inputs"` arrays — those only work in `launch.json` and `tasks.json`. Adding them causes this error on startup:

    > `CodeExpectedError: Variable 'cwd' must be defined in an 'inputs' section of the debug or task configuration.`

    **Do NOT add these fields to `mcp.json`:**

    - `"cwd"` — MCP servers inherit the workspace directory automatically
    - `"envFile"` — not a valid MCP config field
    - `"sandboxEnabled"` — not a standard MCP field
    - `"dev"` — not a standard MCP field
    - `"inputs"` array — only valid in `launch.json`/`tasks.json`

    If you encounter this error, remove the invalid fields or re-run `ges mcp setup vscode` to regenerate a clean project-level config.

!!! warning "Not a VS Code extension"

    GESF is an **MCP server**, not a VS Code extension. You will **not** find it on the VS Code Marketplace. Do not use VS Code's built-in NPM package installer (`Cmd+Shift+P` → "Install NPM Package") — it will ask for a "name" and "working directory" that are not related to MCP setup. Follow the steps above instead.

**Reload:** `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux) → `Developer: Reload Window`.

**Verify:** Open Copilot Chat, switch to Agent mode, click the tools icon (🔨) — `gesf` should appear in the available tools list.

---

### 3. Cursor

**Config file location:**

Project-level: `.cursor/mcp.json` in your project root.

**Add this to the config file:**

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

If the file already exists, merge the `gesf` entry into the existing `mcpServers` object.

**Reload:** Quit and reopen Cursor.

**Verify:** Open Cursor settings → MCP → look for `gesf` in the active servers list.

---

### 4. OpenCode

**Config file location:**

| Scope | Path |
|-------|------|
| Project-level | `opencode.json` in project root |
| Global | `~/.config/opencode/opencode.json` |

**Add this to the config file:**

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

If the file already exists, merge the `gesf` entry into the existing `mcp` object.

**Reload:** Restart OpenCode.

**Verify:** Run `opencode` and check that GESF tools appear when prompting the AI.

---

### 5. Crush

**Config file location:**

Global: `~/.local/share/crush/crush.json`

**Add this to the config file:**

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

**Important:** Crush stores all configuration (providers, models, MCP servers) in a single `crush.json` file. Only add or modify the `mcp.gesf` entry — do not overwrite the rest of the file. The `"type": "stdio"` field is required by Crush's MCP format.

**Reload:** Restart Crush.

**Verify:** Run `crush_info` to confirm the GESF MCP server is connected, or ask any compliance question in a session.

---

### 6. Windsurf

**Config file location:**

Project-level: `.windsurf/mcp.json` in your project root.

**Add this to the config file:**

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

If the file already exists, merge the `gesf` entry into the existing `mcpServers` object.

**Reload:** Quit and reopen Windsurf.

**Verify:** Open Windsurf settings → MCP → look for `gesf` in the active servers list.

---

## Windows Absolute Path Reference

When manually editing MCP config files on Windows, use absolute paths instead of bare `npx` or `node`. Find them in PowerShell:

```powershell
where.exe npx
where.exe node
```

| How Node was installed | `npx.cmd` path | `node.exe` path |
|------------------------|----------------|-----------------|
| Official installer | `C:\Program Files\nodejs\npx.cmd` | `C:\Program Files\nodejs\node.exe` |
| nvm-windows | `C:\Users\<user>\AppData\Roaming\nvm\v<version>\npx.cmd` | `C:\Users\<user>\AppData\Roaming\nvm\v<version>\node.exe` |
| fnm | `%LOCALAPPDATA%\fnm_multishells\<version>\npx.cmd` | `%LOCALAPPDATA%\fnm_multishells\<version>\node.exe` |

In JSON, double the backslashes:

```json
"command": "C:\\Program Files\\nodejs\\npx.cmd"
```

!!! tip "Skip the manual work"

    Running `ges mcp setup <client>` (or `npx @greenarmor/ges mcp setup <client>`) detects the absolute paths automatically. Use it instead of editing config files by hand.

---

## Advanced — Custom Server Path (Source Build)

If you are developing GESF locally or installed from source, replace the `npx` command with a direct path to the built server:

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

Or use the CLI command instead:

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

Adapt the JSON key (`mcpServers`, `servers`, or `mcp`) and `type` field for your specific client as shown in the per-client sections above.

---

## Available Tools (17 total)

Once configured, the GESF MCP server provides these tools to the AI assistant:

### Compliance Assessment

| Tool | Description | Parameters |
|------|-------------|------------|
| `check_compliance` | Check GDPR compliance status for a project | `project_type` (string) |
| `check_project_status` | Read `.ges/` for real-time project status | `project_path` (string) |
| `list_missing_controls` | Show missing compliance controls for a framework | `framework` (string) |
| `list_framework_controls` | List all controls for a framework with status | `framework` (string) |
| `run_audit` | Run a full 6-scanner source code audit | `project_path` (string) |
| `generate_compliance_report` | Generate a full compliance report | `project_type`, `project_name` |
| `generate_audit_report` | Combine real audit findings with scoring | `project_path`, `project_name` |

### Fix & Implement

| Tool | Description | Parameters |
|------|-------------|------------|
| `auto_fix` | Automatically fix security findings in source code | `project_path`, `dry_run?`, `rule_ids?` |
| `implement_control` | Generate implementation files for a control | `project_path`, `control_id` |
| `apply_control_override` | Mark a control as not-applicable or pass | `project_path`, `control_id`, `status`, `reason` |
| `fix_recommendation` | Get step-by-step remediation guidance | `control_id` or `finding_title` |

### Document Generation

| Tool | Description | Parameters |
|------|-------------|------------|
| `generate_retention_policy` | Generate a data retention policy | `project_name` |
| `generate_incident_response` | Generate an incident response plan | `project_name` |
| `generate_risk_assessment` | Generate a risk assessment | `project_name` |
| `generate_dpa` | Generate a Data Processing Agreement | `project_name` |
| `generate_data_inventory` | Generate a data inventory with classifications | `project_name`, `project_type` |
| `generate_processing_records` | Generate Article 30 ROPA | `project_name`, `controller_name` |

---

## Example Prompts

After installing the MCP server, try these prompts in your AI client:

- "Are we GDPR compliant?"
- "Show me missing GDPR controls."
- "Generate a retention policy for My SaaS App."
- "Generate an incident response plan for Project Alpha."
- "Generate a risk assessment for our healthcare platform."
- "Generate a Data Processing Agreement for Customer Portal."
- "Check compliance status for an AI application."

---

## Verify the Server Works (Manual Test)

**macOS / Linux:**

```bash
printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n{"jsonrpc":"2.0","id":3,"method":"ping"}\n' | npx -y @greenarmor/ges-mcp-server
```

**Windows (PowerShell):**

```powershell
$input = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' + "`n" + '{"jsonrpc":"2.0","method":"notifications/initialized"}' + "`n" + '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' + "`n"
$input | npx -y @greenarmor/ges-mcp-server
```

Expected: JSON responses for `initialize` and `tools/list` (17 tools listed). No output for the notification.

---

## Troubleshooting

| Problem | Cause | Fix |
|---------|-------|-----|
| Server not found in client | Config file wrong location or bad JSON | Verify config file path from the table above; validate JSON syntax |
| `npx` fails or hangs | Stale cache or no network | Run `npx clear-npx-cache` then retry; or use `npm install -g @greenarmor/ges-mcp-server` and change command to `ges-mcp-server` |
| Tools not appearing | Client not reloaded | Restart the client completely (quit, not just close window) |
| `EACCES` permission error | Config directory not writable | Create the directory first: `mkdir -p <config-dir>` |
| Server crashes on start | Node.js too old | Verify `node --version` is >= 20.0.0 |
| `Cannot find module` | Package not installed | Run `npm install -g @greenarmor/ges-mcp-server` or use `npx -y` |
| Multiple `gesf` entries | Re-ran setup | Manually edit config to keep only one `gesf` entry |
| Crush loses other config | Config overwritten | Only edit the `mcp.gesf` key, do not replace the entire file |
| Windows: `ges` not recognized after global install | npm global bin not in PATH | Run `npm config get prefix`, add that directory to PATH, or use `npx @greenarmor/ges` instead |
| Windows: `EBADENGINE` warning | Node.js < 20 | Upgrade to Node 20+ via `winget install OpenJS.NodeJS.LTS` |
| Windows: MCP server fails to start in VS Code | VS Code can't find `npx` in its process PATH | Use absolute path to `npx.cmd` (see Windows section above), or run `ges mcp setup vscode` which auto-detects the path |
| Windows: MCP server silently fails (no error, no tools) | `node.exe` or `npx.cmd` not in VS Code's inherited PATH | Use `where.exe npx` in PowerShell to find the absolute path, put it in the `"command"` field |
| VS Code: `CodeExpectedError: Variable 'cwd' must be defined` | Invalid `${input:...}` variables or `inputs` section in `mcp.json` | Remove `cwd`, `envFile`, `sandboxEnabled`, `dev` fields and `inputs` section; or re-run `ges mcp setup vscode` to regenerate clean config |
| VS Code: can't find GESF on the Marketplace | GESF is an MCP server, not a VS Code extension | Add the server entry to your global or project `mcp.json` (see VS Code section above) |
| VS Code: NPM installer asks for "name" and "working directory" | VS Code's NPM package GUI is for NPM packages, not MCP servers | Cancel the installer and edit `mcp.json` directly (see VS Code section above) |
| VS Code: server not found after `ges mcp setup vscode` | Setup only creates project-level `.vscode/mcp.json` | For global availability, edit the global `mcp.json` instead (see Option A above) |

---

## Client Quick Reference

| Client | Config File | JSON Key | Needs `type` Field | Scope |
|--------|------------|----------|--------------------|-------|
| Claude Desktop | `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS), `~/.config/Claude/claude_desktop_config.json` (Linux), `%APPDATA%\Claude\claude_desktop_config.json` (Windows) | `mcpServers` | No | Global |
| VS Code | `.vscode/mcp.json` (project) or global user `mcp.json` (see below) | `servers` | Yes (`"type": "stdio"`) | Project/Global |
| Cursor | `.cursor/mcp.json` | `mcpServers` | No | Project |
| OpenCode | `opencode.json` (project) or `~/.config/opencode/opencode.json` (global) | `mcp` | Yes (`"type": "stdio"`) | Project/Global |
| Crush | `~/.local/share/crush/crush.json` | `mcp` | Yes (`"type": "stdio"`) | Global |
| Windsurf | `.windsurf/mcp.json` | `mcpServers` | No | Project |

**VS Code global config paths:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Code/User/mcp.json` |
| Linux | `~/.config/Code/User/mcp.json` |
| Windows | `%APPDATA%\Code\User\mcp.json` |

Or open via Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P` → **"MCP: Open User Configuration"**.
