# MCP Setup Guide

GESF ships with an MCP (Model Context Protocol) server that lets AI assistants check compliance, audit source code, auto-fix vulnerabilities, and generate policies — all through natural language.

This guide covers installation and configuration on **macOS**, **Linux**, and **Windows**.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Automatic Setup](#automatic-setup-recommended)
- [Manual Setup Per Client](#manual-setup-per-client)
  - [Claude Desktop](#claude-desktop)
  - [VS Code (Copilot)](#vs-code-copilot--github-copilot-chat)
  - [Cursor](#cursor)
  - [OpenCode](#opencode)
  - [Crush](#crush)
  - [Windsurf](#windsurf)
- [Using a Local Build (Source)](#using-a-local-build-source)
- [Client Quick Reference](#client-quick-reference)
- [Exercises](#exercises)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

| Requirement | Minimum | Check Command |
|-------------|---------|---------------|
| Node.js | 20.0.0 | `node --version` |
| npm | 10.0.0 | `npm --version` |

GESF must be installed before setting up the MCP server:

```bash
npm install -g @greenarmor/ges
```

If you don't want to install globally, you can use `npx` instead — all commands below work with `npx @greenarmor/ges` as a prefix.

---

## Automatic Setup (Recommended)

The `ges mcp setup` command auto-configures your AI assistant. It detects the absolute path to `node` and `npx` on your system, so it works on all platforms without PATH issues.

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

!!! info "What `ges mcp setup` writes"

    The setup command writes the **absolute path** to `node` or `npx` into your config file. This is important on Windows, where VS Code and other clients may not inherit your terminal's PATH. For example, instead of `"command": "npx"`, it writes:

    | OS | What gets written |
    |----|--------------------|
    | macOS | `"/Users/you/.nvm/versions/node/v22/bin/node"` |
    | Linux | `"/usr/local/bin/node"` or `"/home/you/.nvm/versions/node/v22/bin/node"` |
    | Windows | `"C:\\Program Files\\nodejs\\npx.cmd"` or `"C:\\Users\\you\\AppData\\Roaming\\nvm\\v20.18.0\\node.exe"` |

---

## Manual Setup Per Client

If automatic setup doesn't work or you need custom configuration, follow the instructions for your client below.

### Claude Desktop

**Config file location:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

**macOS / Linux:**

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

**Windows:**

Claude Desktop on Windows may not find `npx` in its PATH. Use the absolute path:

```powershell
# Find your npx path in PowerShell
where.exe npx
# Typical: C:\Program Files\nodejs\npx.cmd
```

```json
{
  "mcpServers": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

If the file already exists, merge the `gesf` entry into the existing `mcpServers` object — do not overwrite other entries.

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

| OS | Shortcut |
|----|----------|
| macOS | `Cmd+Shift+P` |
| Windows / Linux | `Ctrl+Shift+P` |

**Step 2:** Type **"MCP: Open User Configuration"** and press Enter. This opens the global `mcp.json` file.

**Step 3:** Add the GESF server config.

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

On Windows, VS Code launches MCP servers as child processes that may not inherit your PowerShell PATH. Use the **absolute path** to `npx.cmd` instead:

```powershell
# Find your npx path in PowerShell
where.exe npx
# Typical output: C:\Program Files\nodejs\npx.cmd
```

Then use that path in the config:

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

    Running `ges mcp setup vscode` (or `npx @greenarmor/ges mcp setup vscode`) **automatically detects the absolute path** to `npx.cmd` or `node.exe` on your system and writes it into the config. This is the recommended approach on Windows — no manual path lookup needed.

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

**Reload:**

| OS | Shortcut | Command |
|----|----------|---------|
| macOS | `Cmd+Shift+P` | `Developer: Reload Window` |
| Windows / Linux | `Ctrl+Shift+P` | `Developer: Reload Window` |

**Verify:** Open Copilot Chat → switch to **Agent mode** → click the tools icon (🔨) → `gesf` should appear in the list.

!!! warning "VS Code requires `\"type\": \"stdio\"`"

    VS Code requires the `"type": "stdio"` field in server entries. Other clients (Claude Desktop, Cursor, Windsurf) do not use this field.

!!! warning "Not a VS Code extension"

    GESF is an **MCP server**, not a VS Code extension. You will **not** find it on the VS Code Marketplace. It connects through VS Code's built-in MCP protocol support in Copilot Chat (Agent mode).

    Do **not** use VS Code's built-in NPM package installer (Command Palette → "Install NPM Package"). It will ask confusing questions about "name" and "working directory" — those are for NPM package metadata, not MCP configuration. Follow Option 1 or 2 above instead.

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

    If you see this error, delete the invalid fields and the `inputs` section from the config file, or re-run `ges mcp setup vscode` to regenerate a clean config.

---

### Cursor

**Config file:** `.cursor/mcp.json` in your project root.

**macOS / Linux:**

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

**Windows:**

```json
{
  "mcpServers": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

**Reload:** Quit and reopen Cursor.

**Verify:** Open Cursor settings → MCP → look for `gesf` in the active servers list.

---

### OpenCode

**Config file location:**

| Scope | Path |
|-------|------|
| Project-level | `opencode.json` in project root |
| Global | `~/.config/opencode/opencode.json` (Linux/macOS) or `%USERPROFILE%\.config\opencode\opencode.json` (Windows) |

**macOS / Linux:**

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

**Windows:**

```json
{
  "mcp": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
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

**macOS / Linux:**

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

**Windows:**

```json
{
  "mcp": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
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

**macOS / Linux:**

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

**Windows:**

```json
{
  "mcpServers": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\npx.cmd",
      "args": ["-y", "@greenarmor/ges-mcp-server"]
    }
  }
}
```

**Reload:** Quit and reopen Windsurf.

---

## Using a Local Build (Source)

If you are developing GESF or installed from source, replace `npx` with a direct path to the built server:

**macOS / Linux:**

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

**Windows:**

```json
{
  "mcpServers": {
    "gesf": {
      "command": "C:\\Program Files\\nodejs\\node.exe",
      "args": ["C:\\path\\to\\gesf\\packages\\mcp-server\\dist\\server.js"]
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

## Client Quick Reference

| Client | JSON Key | Needs `type` | Scope | Setup Command |
|--------|----------|:------------:|-------|----------------|
| Claude Desktop | `mcpServers` | No | Global | `ges mcp setup claude` |
| VS Code | `servers` | Yes (`"stdio"`) | Project or Global | `ges mcp setup vscode` |
| Cursor | `mcpServers` | No | Project | `ges mcp setup cursor` |
| OpenCode | `mcp` | Yes (`"stdio"`) | Project or Global | `ges mcp setup opencode` |
| Crush | `mcp` | Yes (`"stdio"`) | Global | `ges mcp setup crush` |
| Windsurf | `mcpServers` | No | Project | `ges mcp setup windsurf` |

### Config File Paths by OS

**Claude Desktop:**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
| Linux | `~/.config/Claude/claude_desktop_config.json` |
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

**VS Code (global):**

| OS | Path |
|----|------|
| macOS | `~/Library/Application Support/Code/User/mcp.json` |
| Linux | `~/.config/Code/User/mcp.json` |
| Windows | `%APPDATA%\Code\User\mcp.json` |

Or open via Command Palette: `Cmd+Shift+P` / `Ctrl+Shift+P` → **"MCP: Open User Configuration"**.

**VS Code (project-level):** `.vscode/mcp.json` in your project root (all OS).

**Windows absolute paths for `npx` and `node`:**

| How Node was installed | `npx.cmd` path | `node.exe` path |
|------------------------|----------------|-----------------|
| Official installer | `C:\Program Files\nodejs\npx.cmd` | `C:\Program Files\nodejs\node.exe` |
| nvm-windows | `C:\Users\<user>\AppData\Roaming\nvm\v<version>\npx.cmd` | `C:\Users\<user>\AppData\Roaming\nvm\v<version>\node.exe` |
| fnm | `%LOCALAPPDATA%\fnm_multishells\<version>\npx.cmd` | `%LOCALAPPDATA%\fnm_multishells\<version>\node.exe` |

Find your paths in PowerShell:

```powershell
where.exe npx
where.exe node
```

---

## Exercises

!!! example "Exercise 1: Set Up GESF with Your Primary Editor"

    **Goal:** Get the GESF MCP server running in the AI assistant you use daily.

    1. Identify which AI assistant you use most often
    2. Install GESF globally:

    ```bash
    npm install -g @greenarmor/ges
    ```

    3. Run the automatic setup command:

    ```bash
    ges mcp setup <your-client>
    ```

    4. Restart your editor/assistant
    5. Verify the server is connected — check settings → MCP or tools list
    6. Ask it: *"Check our GDPR compliance for a SaaS application"*
    7. Confirm you get a compliance score back — this proves the MCP server is working

    !!! question "Check your understanding"
        - What command would you run to set up GESF for Cursor?
        - After setup, what must you do before the server becomes available?
        - Where does the config file live on your OS?

!!! example "Exercise 2: Set Up Multiple Clients"

    **Goal:** Configure GESF for all the AI assistants you use.

    ```bash
    # Configure all at once
    ges mcp setup all

    # Or one at a time
    ges mcp setup claude
    ges mcp setup vscode
    ges mcp setup cursor
    ```

    After each setup, restart the client and verify the `gesf` server appears in its MCP settings.

    !!! question "Check your understanding"
        - Which clients configure globally vs per-project?
        - What happens if you run `ges mcp setup all` twice?
        - How would you remove the `gesf` entry from a specific client?

!!! example "Exercise 3: Manual vs Automatic Setup"

    **Goal:** Understand what `ges mcp setup` writes to your config file.

    1. Run `ges mcp setup claude` (automatic)
    2. Open the config file and look at what was added:

    ```bash
    # macOS
    cat ~/Library/Application\ Support/Claude/claude_desktop_config.json

    # Linux
    cat ~/.config/Claude/claude_desktop_config.json
    ```

    ```powershell
    # Windows (PowerShell)
    Get-Content "$env:APPDATA\Claude\claude_desktop_config.json"
    ```

    3. Understand the structure — the `gesf` entry under `mcpServers`
    4. Notice the `"command"` field — it should be an **absolute path** to `node` or `npx`, not just `"npx"`
    5. Try removing the entry and adding it back manually
    6. Verify the server still works after your manual edit

    !!! question "Check your understanding"
        - Why does `ges mcp setup` write an absolute path instead of just `"npx"`?
        - What would happen on Windows if the config used bare `"npx"` and VS Code didn't have it in PATH?

!!! example "Exercise 4: VS Code Global vs Project Setup"

    **Goal:** Understand the two configuration scopes in VS Code.

    **Part A — Project-level:**

    1. Open a project folder in VS Code
    2. Open a terminal in that project
    3. Run:

    ```bash
    ges mcp setup vscode
    ```

    4. Choose "Project" when prompted
    5. Reload the VS Code window (`Cmd+Shift+P` / `Ctrl+Shift+P` → `Developer: Reload Window`)
    6. Open Copilot Chat → Agent mode → verify `gesf` appears in the tools list
    7. Open a **different** project folder — notice `gesf` is NOT available there

    **Part B — Global:**

    1. Run `ges mcp setup vscode` again
    2. Choose "Global" when prompted
    3. Reload VS Code
    4. Open any project — `gesf` should now be available everywhere

    !!! question "Check your understanding"
        - When would you choose project-level over global?
        - Where is the global config file on your OS?
        - If you have both global and project configs, which takes precedence?

!!! example "Exercise 5: Windows Path Troubleshooting"

    **Goal:** Understand and resolve the most common Windows MCP issue.

    **Scenario:** You installed GESF on Windows with `npm install -g @greenarmor/ges`. The MCP server works in Claude Desktop but **not** in VS Code. No error appears — the `gesf` tools simply don't show up.

    1. Open PowerShell and check:

    ```powershell
    # Verify ges works in PowerShell
    ges --version

    # If ges isn't found, the npm global bin isn't in PATH
    npm config get prefix
    # Add that directory to your PATH

    # Check where npx lives
    where.exe npx
    ```

    2. Open the VS Code global config:

    ```powershell
    Get-Content "$env:APPDATA\Code\User\mcp.json"
    ```

    3. If the `"command"` field is just `"npx"` (not an absolute path), that's the problem. Fix it:

    ```powershell
    # Let ges mcp setup fix it automatically
    ges mcp setup vscode
    # Choose "Global"
    ```

    4. Or fix it manually — replace `"npx"` with the absolute path from `where.exe npx`:

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

    5. Reload VS Code (`Ctrl+Shift+P` → `Developer: Reload Window`)
    6. Open Copilot Chat → Agent mode → `gesf` should now appear

    !!! question "Check your understanding"
        - Why can't VS Code find `npx` even though PowerShell can?
        - What does `ges mcp setup vscode` do differently on Windows vs macOS?
        - If you use nvm-windows, what happens to `ges` when you switch Node versions?

!!! example "Exercise 6: Verify MCP Server is Running"

    **Goal:** Test the MCP server directly, without going through an AI client.

    **macOS / Linux:**

    ```bash
    # Test with a single tool call
    printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"check_compliance","arguments":{"project_type":"saas"}}}\n' | npx -y @greenarmor/ges-mcp-server
    ```

    **Windows (PowerShell):**

    ```powershell
    # Test using the absolute path to npx
    $npx = (Get-Command npx).Source
    $input = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}' + "`n" + '{"jsonrpc":"2.0","method":"notifications/initialized"}' + "`n" + '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"check_compliance","arguments":{"project_type":"saas"}}}'
    $input | & $npx -y @greenarmor/ges-mcp-server
    ```

    You should see:
    - An `initialize` response with protocol version `2024-11-05`
    - A `tools/call` response with compliance scores for GDPR, OWASP, CIS, NIST

    !!! question "Check your understanding"
        - What protocol version does the server report?
        - How many tools are available? (Hint: check `tools/list` instead of `tools/call`)
        - What happens if you send an invalid tool name?

!!! example "Exercise 7: Test with the Local Build"

    **Goal:** Test the MCP server from a local GESF source checkout (for contributors).

    ```bash
    # Build the project
    cd /path/to/gesf && pnpm -r run build

    # Test the MCP server directly
    printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n{"jsonrpc":"2.0","method":"notifications/initialized"}\n{"jsonrpc":"2.0","id":2,"method":"tools/list"}\n' | node packages/mcp-server/dist/server.js
    ```

    This is useful for debugging or developing new MCP tools.

---

## Troubleshooting

### General Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| Server not found in client | Config file in wrong location or bad JSON | Verify the config file path for your OS (see [Quick Reference](#client-quick-reference)); validate JSON syntax |
| `npx` hangs or fails | Stale cache or no network | Run `npx clear-npx-cache` then retry; or install globally and change command to `ges-mcp-server` |
| Tools not appearing | Client not reloaded | Restart the client completely (quit, not just close window) |
| `EACCES` permission error | Config directory not writable | Create the directory: `mkdir -p <config-dir>` (macOS/Linux) or run as Administrator (Windows) |
| Server crashes on start | Node.js too old | Verify `node --version` is >= 20.0.0 |
| `Cannot find module` | Package not installed | Use `npx -y` to auto-install, or run `npm install -g @greenarmor/ges` |
| Duplicate `gesf` entries | Ran setup twice | Manually edit config to keep only one `gesf` entry |
| Crush loses other config | Config file overwritten | Only edit the `mcp.gesf` key, do not replace the entire file |

### Windows-Specific Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| `ges` not recognized after `npm install -g` | npm global bin directory not in PATH | See [Windows PATH fix](#windows-path-fix) below |
| `EBADENGINE` warning during install | Node.js < 20 | Upgrade: `winget install OpenJS.NodeJS.LTS` |
| MCP server fails to start in VS Code | VS Code can't find `npx` in its process PATH | Use absolute path to `npx.cmd` (see below), or run `ges mcp setup vscode` which auto-detects it |
| MCP server silently fails (no error, no tools) | `node.exe` or `npx.cmd` not in VS Code's inherited PATH | Use `where.exe npx` in PowerShell to find the path, put it in the `"command"` field |
| `ges` disappears after switching Node version | Using nvm-windows — global packages don't carry over | Re-run `npm install -g @greenarmor/ges` after `nvm use`, or use `npx @greenarmor/ges` |

#### Windows PATH Fix

On Windows, `npm install -g` places the `ges.cmd` shim in the npm global bin directory. If that directory isn't in your system PATH, PowerShell can't find `ges`.

```powershell
# 1. Check where npm installs globals
npm config get prefix
# Typical: C:\Users\green\AppData\Roaming\npm

# 2. Quick alternative — use npx (no PATH needed)
npx @greenarmor/ges --version
npx @greenarmor/ges init
npx @greenarmor/ges audit

# 3. Permanent fix — add npm's prefix to your user PATH
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
$npmPrefix = "$(npm config get prefix)"
[Environment]::SetEnvironmentVariable("PATH", "$currentPath;$npmPrefix", "User")

# 4. Restart PowerShell, then test
ges --version
```

!!! tip "Windows: use fnm instead of nvm-windows"

    [fnm](https://github.com/Schniz/fnm) is a fast Node version manager that **carries over global packages** when switching versions. Install it:

    ```powershell
    winget install Schniz.fnm
    fnm install 22
    fnm use 22
    fnm env --use-on-cd | Out-String | Invoke-Expression
    npm install -g @greenarmor/ges
    ges --version
    ```

#### Windows: Finding Absolute Paths for MCP Config

If `ges mcp setup` is unavailable and you need to write the config manually on Windows:

```powershell
# Find npx
where.exe npx
# Output: C:\Program Files\nodejs\npx.cmd

# Find node
where.exe node
# Output: C:\Program Files\nodejs\node.exe
```

Use the full path in the `"command"` field of your MCP config. JSON requires backslashes to be doubled:

```json
"command": "C:\\Program Files\\nodejs\\npx.cmd"
```

### VS Code-Specific Issues

| Problem | Cause | Fix |
|---------|-------|-----|
| `CodeExpectedError: Variable 'cwd' must be defined` | Invalid `${input:...}` variables or `inputs` section in `mcp.json` | Remove `cwd`, `envFile`, `sandboxEnabled`, `dev` fields and `inputs` section; or re-run `ges mcp setup vscode` |
| Can't find GESF on the VS Code Marketplace | GESF is an MCP server, not a VS Code extension | Add the server entry to your `mcp.json` (see [VS Code section](#vs-code-copilot--github-copilot-chat)) |
| NPM package installer asks for "name" and "working directory" | VS Code's NPM package GUI is for NPM packages, not MCP servers | Cancel the installer. Edit `mcp.json` directly or run `ges mcp setup vscode` |
| Server not found after `ges mcp setup vscode` | Setup only creates project-level `.vscode/mcp.json` | For global availability, choose "Global" when prompted, or edit the global `mcp.json` manually |
