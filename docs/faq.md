# Frequently Asked Questions

## General

### Do I need to install GESF globally?

No. You can use `npx @greenarmor/ges` to run any command without a global install. However, a global install (`npm install -g @greenarmor/ges`) is more convenient if you use GESF frequently.

### Does GESF modify my source code?

No. GESF only **reads** your source code for scanning. It never modifies your application files. It creates its own files in `.ges/`, `compliance/`, `security/`, `controls/`, and `.github/workflows/`.

### Does GESF work with languages other than JavaScript/TypeScript?

Yes. The scanners detect patterns across multiple languages including Python, Ruby, Go, Java, PHP, and C#. However, the deepest pattern coverage is for JavaScript/TypeScript and Node.js ecosystems.

### Can I use GESF in an existing project?

Yes. Run `ges init` in your existing project directory. GESF creates its structure alongside your existing files without modifying them. Then run `ges audit` to scan your existing code.

### Can I exclude files from scanning?

GESF automatically skips `node_modules`, `.git`, `dist`, `build`, and `.ges`. Additional exclusion patterns via a `.gesignore` file are planned for a future release.

### How do I add GESF to my team's workflow?

1. Run `ges init` and commit the generated files
2. Add `.ges/` to `.gitignore` if you want local-only scoring (or commit it to track scores in git)
3. Commit the `.github/workflows/` files to enforce compliance in CI/CD
4. Have team members run `ges audit` locally before pushing

### Does GESF replace a DPO (Data Protection Officer)?

No. GESF is an engineering tool that helps enforce technical and organizational measures required by GDPR. It does not replace legal counsel or a DPO.

## Scanning

### What's the difference between `ges audit` and `ges scan`?

- **`ges audit`** — GESF's 6 built-in source code scanners (no external dependencies needed)
- **`ges scan`** — External tool integration (Trivy, Gitleaks, Semgrep, npm audit — requires those tools installed)

Use both for comprehensive coverage.

### How often should I run audits?

| When | Command |
|------|---------|
| After making significant code changes | `ges audit` |
| Every push and pull request | Auto-configured via GitHub Actions |
| Weekly compliance review | GitHub Actions scheduled trigger |
| Before releases | `ges audit && ges scan && ges report` |

## MCP

### Can I use the MCP server without the CLI?

Yes. The MCP server is a standalone package:

```bash
npx -y @greenarmor/ges-mcp-server
```

### Which AI assistants are supported?

| Client | Setup Command |
|--------|--------------|
| Claude Desktop | `ges mcp setup claude` |
| VS Code (Copilot) | `ges mcp setup vscode` |
| Cursor | `ges mcp setup cursor` |
| OpenCode | `ges mcp setup opencode` |
| Crush | `ges mcp setup crush` |
| Windsurf | `ges mcp setup windsurf` |

Any MCP-compatible client can connect to GESF manually using the npx command.

### The MCP server isn't showing up in my assistant. What do I do?

1. Make sure you restarted your assistant after running `ges mcp setup`
2. Verify the config file exists at the correct path for your OS
3. Check that the JSON is valid (no syntax errors)
4. Try the manual test: `printf '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}\n' | npx -y @greenarmor/ges-mcp-server`

## Troubleshooting

### `ges: command not found`

The CLI is not installed or not in your PATH.

```bash
npm install -g @greenarmor/ges
```

### `ges init` says "GESF is already initialized"

You already have a `.ges/` directory in your project. To reinitialize:

```bash
rm -rf .ges/
ges init
```

### Score shows 0% even though code is clean

This is a known issue. Controls default to "not-implemented" when no positive evidence is detected. The audit maps findings to "fail" but has no mechanism to confirm a control is satisfied when no finding exists. This will be improved in a future version.

### `ges audit` finds issues in generated files

The audit skips `.ges/` but may scan files in `compliance/` and `security/` if they contain patterns that match (e.g., the word "password" in a template). This is expected and those findings can be ignored.
