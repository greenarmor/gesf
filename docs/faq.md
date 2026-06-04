# Frequently Asked Questions

## General

### Do I need to install GESF globally?

No. You can use `npx @greenarmor/ges` to run any command without a global install. However, a global install (`npm install -g @greenarmor/ges`) is more convenient if you use GESF frequently.

### Does GESF modify my source code?

No. GESF only **reads** your source code for scanning. It never modifies your application files. It creates its own files in `.ges/`, `compliance/`, `security/`, `controls/`, and `.github/workflows/`.

### Does GESF work with languages other than JavaScript/TypeScript?

Yes. GESF is **programming language agnostic**. It works with any project regardless of language:

- **Source code scanning** (`ges audit`) — Pattern-matching across 20+ file types covering JavaScript, TypeScript, Python, Ruby, Go, Java, PHP, C#, Rust, and more
- **Dependency auditing** (`ges scan`) — Auto-detects your ecosystem from lockfiles and runs the matching dependency auditor (pnpm audit, pip-audit, cargo audit, govulncheck, bundle-audit, composer audit, etc.)
- **Compliance scoring** — Framework evaluations (GDPR, OWASP, CIS, NIST) apply to any technology stack

### Does GESF automatically detect my programming language?

Yes. When you run `ges scan`, GESF scans your project root for lockfiles and marker files to automatically identify the ecosystem and package manager:

| Lockfile Found | Ecosystem Detected | Auditor Used |
|---------------|-------------------|--------------|
| `pnpm-lock.yaml` | Node.js (pnpm) | `pnpm audit` |
| `yarn.lock` | Node.js (yarn) | `yarn audit` |
| `package-lock.json` | Node.js (npm) | `npm audit` |
| `bun.lockb` | Node.js (bun) | `bun audit` |
| `requirements.txt` / `poetry.lock` / `uv.lock` | Python | `pip-audit` |
| `Cargo.lock` | Rust | `cargo audit` |
| `go.sum` | Go | `govulncheck` |
| `Gemfile.lock` | Ruby | `bundle-audit` |
| `pom.xml` / `build.gradle` | Java | `OWASP Dependency-Check` |
| `composer.lock` | PHP | `composer audit` |
| `packages.lock.json` | .NET | `dotnet list package --vulnerable` |

No configuration needed — it just works.

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

### Does my project need Node.js to be scanned?

No. GESF's CLI requires Node.js to **run**, but your project can be in any language. GESF scans source files, detects the ecosystem, and runs the appropriate tools — your project does not need Node.js installed. In CI/CD, the workflow uses a Node.js image to run the `ges` command, but it scans whatever files exist in your repository.

## Scanning

### What's the difference between `ges audit` and `ges scan`?

- **`ges audit`** — GESF's 6 built-in source code scanners (no external dependencies needed). Scans for patterns like hardcoded secrets, weak crypto, SQL injection, missing auth, etc.
- **`ges scan`** — External tool integration (Trivy, Gitleaks, Semgrep, SBOM tools, plus ecosystem-specific dependency auditors). Auto-detects your language and package manager.

Use both for comprehensive coverage.

### How often should I run audits?

| When | Command |
|------|---------|
| After making significant code changes | `ges audit` |
| Every push and pull request | Auto-configured via GitHub Actions |
| Weekly compliance review | GitHub Actions scheduled trigger |
| Before releases | `ges audit && ges scan && ges report` |

### What if my project uses multiple languages?

GESF detects the **primary** ecosystem based on lockfiles. If you have a polyglot project (e.g., a Python backend with a Node.js frontend), the ecosystem with the most prominent lockfile in the root is detected. Language-agnostic scanners (Trivy, Gitleaks, Semgrep) always run regardless of the detected ecosystem.

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

### `ges scan` detects the wrong ecosystem

Ecosystem detection is based on lockfiles in the project root. If you have an unexpected lockfile (e.g., a `package.json` in a Python project for tooling), GESF may detect the wrong ecosystem. Remove unused lockfiles or restructure so the primary project's lockfile takes precedence.
