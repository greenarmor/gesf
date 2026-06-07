# VS Code Extension

The GESF VS Code extension provides real-time compliance warnings, inline diagnostics, and one-click access to audit and report commands — directly in your editor.

## Features

| Feature | Description |
|---------|-------------|
| **Real-time diagnostics** | Inline warnings for security issues as you code |
| **Status bar score** | Live compliance score in the VS Code status bar |
| **Run Audit command** | Execute `ges audit` from the command palette |
| **Show Score command** | Display detailed compliance score breakdown |
| **Generate Report command** | Create compliance reports without leaving the editor |
| **Config validation** | JSON schema validation for `.ges/config.json` |

## Installation

### From VSIX

```bash
code --install-extension gesf-vscode-1.1.1.vsix
```

### From Source

```bash
cd packages/vscode-extension
npm install
npm run build
# Press F5 in VS Code to launch an Extension Development Host
```

### Prerequisites

- VS Code 1.80.0 or later
- A project initialized with `ges init` (the extension activates when `.ges/config.json` is present)
- The `ges` CLI installed and accessible

## How It Works

The extension activates automatically when you open a workspace containing `.ges/config.json`. It then:

1. **Detects compliance warnings** by scanning your project files
2. **Shows diagnostics** inline in the editor (red squiggles for critical, yellow for high)
3. **Updates the status bar** with your current compliance score
4. **Re-checks on save** — diagnostics refresh every time you save a file

## Diagnostics

The extension reports these compliance warnings:

| Warning | Severity | Trigger |
|---------|----------|---------|
| Hardcoded secrets | Error | `password = "..."`, API keys, tokens |
| Weak cryptography | Error | `md5`, `sha1`, DES, ECB mode |
| SQL injection | Error | String concatenation in queries |
| Missing `.gitignore` | Warning | No `.gitignore` file in project root |
| `.env` not in `.gitignore` | Warning | `.env` exists but `.gitignore` does not include it |
| Missing rate limiting | Warning | No rate limiting library detected |
| Missing security headers | Warning | No `helmet` or equivalent middleware |
| Missing logging library | Information | No `winston`, `pino`, or `morgan` detected |
| Missing MFA | Warning | No multi-factor authentication implementation detected |
| Missing compliance docs | Information | Required compliance documents not generated |

Diagnostics appear in:

- The **Problems panel** (`Ctrl+Shift+M` / `Cmd+Shift+M`)
- Inline in the editor as colored squiggles
- The status bar count badge

## Status Bar

The extension adds a status bar item showing your compliance score:

```
 ✓ GESF: 85% (B)
```

Click the status bar item to run the **Show Score** command for a detailed breakdown.

## Commands

Access these via the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`):

| Command | Description |
|---------|-------------|
| `GESF: Run Compliance Audit` | Runs `ges audit` and displays findings |
| `GESF: Show Compliance Score` | Shows the current score with framework breakdown |
| `GESF: Generate Report` | Generates a compliance report |

## Configuration Validation

The extension provides JSON schema validation for `.ges/config.json`. As you edit the config file, VS Code will:

- Validate required fields
- Suggest valid project types and frameworks
- Highlight invalid values
- Provide autocompletion

## Workflow Integration

The recommended workflow with the VS Code extension:

1. **Write code** — the extension shows real-time warnings
2. **Save the file** — diagnostics refresh automatically
3. **Check the status bar** — see your live compliance score
4. **Run a full audit** — use the command palette for comprehensive scanning
5. **Generate a report** — create compliance reports for stakeholders

## Relationship to `ges audit`

The VS Code extension provides a **subset** of the full audit for instant feedback. For comprehensive scanning (IaC, dependency analysis, database patterns, all 8 scanners), use `ges audit` or the **Run Compliance Audit** command.

| Feature | VS Code Extension | `ges audit` |
|---------|------------------|-------------|
| When it runs | On save, on file switch | On demand |
| Speed | Instant | Seconds |
| Scanners | Core patterns (secrets, crypto, injection, config) | All 8 scanners |
| IaC scanning | No | Yes |
| Compliance scoring | Yes (from cached score) | Yes (fresh calculation) |
| Report generation | No (use command) | Yes |

## Troubleshooting

### Extension does not activate

The extension only activates when `.ges/config.json` exists in your workspace root. Run `ges init` first:

```bash
ges init -n "My App" -t saas -f "GDPR,OWASP"
```

Then reload VS Code (`Cmd+Shift+P` > "Developer: Reload Window").

### Status bar not showing

If the status bar item is hidden:

1. Check that `.ges/config.json` exists in the workspace root
2. Check that `.ges/score.json` exists (run `ges score` to generate it)
3. Reload the VS Code window

### Commands not working

The VS Code commands require the `ges` CLI to be installed and accessible:

```bash
# Verify the CLI is installed
ges --version

# Install if needed
npm install -g @greenarmor/ges
```

!!! example "Exercise: Use the VS Code Extension"

    1. Initialize a project:

    ```bash
    mkdir /tmp/vscode-test && cd /tmp/vscode-test
    echo '{"name":"vscode-test","version":"1.0.0"}' > package.json
    ges init -n "VS Code Test" -t saas -f "GDPR,OWASP"
    ```

    2. Open the project in VS Code:

    ```bash
    code /tmp/vscode-test
    ```

    3. Create a file with security issues:

    ```javascript title="src/config.js"
    const DB_PASSWORD = "hardcoded-secret";
    ```

    4. Save the file — you should see a red squiggle under the hardcoded password

    5. Check the **Problems panel** (`Cmd+Shift+M`) for the full list

    6. Open the Command Palette (`Cmd+Shift+P`) and run:
        - `GESF: Run Compliance Audit`
        - `GESF: Show Compliance Score`

    7. Fix the issue and save:

    ```javascript title="src/config.js"
    const DB_PASSWORD = process.env.DB_PASSWORD;
    ```

    8. The diagnostic should disappear

    !!! question "Questions"
        - How quickly does the extension detect issues compared to running `ges audit`?
        - What types of issues does the extension catch that you might miss otherwise?
        - When would you use the extension commands vs. the terminal CLI?
