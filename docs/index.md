<center>
  <img src="assets/images/logo.png" alt="GESF Logo" width="200" />
</center>

# GESF — Green Engineering Standard Framework

<p class="tagline">GESF (pronounced <em>"Gessf"</em>) — the framework that helps you <em>"get safe."</em></p>

Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards in any software project — regardless of programming language.

## What GESF Does

- **Scans** your source code for security vulnerabilities and compliance violations using 6 built-in scanners (language-agnostic pattern matching)
- **Detects** your project's ecosystem automatically — Node.js, Python, Rust, Go, Ruby, Java, PHP, .NET — and runs the correct dependency auditor
- **Generates** compliance documentation — GDPR, data inventory, retention policies, risk assessments
- **Scores** your project against multiple compliance frameworks with severity-weighted grading
- **Creates** CI/CD pipelines (5 GitHub Actions workflows including SBOM scanning) that fail the build on critical issues
- **Provides** an AI compliance assistant via MCP for Claude, VS Code Copilot, Cursor, and more

## What GESF Does NOT Do

- It does not replace legal counsel for GDPR compliance.
- It does not automatically fix your code — it identifies issues and suggests fixes.
- It does not require a running server or database.

## Quick Start

=== "Homebrew (macOS)"

    ```bash
    brew tap greenarmor/gesf
    brew install ges
    cd your-project
    ges init
    ges audit
    ```

=== "Linux (.deb)"

    ```bash
    # Download from https://github.com/greenarmor/gesf/releases/latest
# then:
dpkg -i ges_*_amd64.deb
    cd your-project
    ges init
    ges audit
    ```

=== "npm"

    ```bash
    npm install -g @greenarmor/ges
    cd your-project
    ges init
    ges audit
    ```

=== "npx (no install)"

    ```bash
    cd your-project
    npx @greenarmor/ges init
    npx @greenarmor/ges audit
    ```

GESF scans **any** project — Python, Rust, Go, Java, Ruby, PHP, .NET, and more. The brew/apt binary installs require no Node.js.

## Key Features

| Feature | Description |
|---------|-------------|
| **6 Source Code Scanners** | Secrets, crypto, injection, auth, config, database — scans 20+ file types |
| **Language-Agnostic Scanning** | Auto-detects your ecosystem and runs the right dependency auditor |
| **8 Supported Ecosystems** | Node.js (npm/pnpm/yarn/bun), Python (pip/poetry/uv), Rust, Go, Ruby, Java, PHP, .NET |
| **7 Policy Packs** | GDPR (22 controls), OWASP, CIS, NIST, AI, Blockchain, Government |
| **13 Project Types** | SaaS, AI, MCP Server, Blockchain, Wallet, Government, Healthcare, and more |
| **MCP AI Assistant** | Works with Claude, VS Code Copilot, Cursor, OpenCode, Crush, Windsurf |
| **5 CI/CD Workflows** | Compliance, security, dependency scan, secret scan, SBOM scan (auto-generated) |
| **14 Document Templates** | Compliance docs, security policies, threat models |
| **Compliance Reports** | Markdown and HTML reports with executive summary |
| **Compliance Badge** | SVG badge with letter grade for your README |

## Architecture

```
packages/
├── cli/                    # CLI (@greenarmor/ges)
├── core/                   # Types, schemas, constants
├── audit-engine/           # Real source code scanning (6 scanners)
├── compliance-engine/      # GDPR Article 5/25/30/32/33/34 controls
├── policy-engine/          # 7 policy packs (56+ total controls)
├── rules-engine/           # Auth, encryption, secrets, logging standards
├── doc-generator/          # 14 compliance/security document templates
├── cicd-generator/         # 5 GitHub Actions workflow generation
├── scoring-engine/         # Multi-framework severity-weighted scoring
├── scanner-integration/    # External tool integration (Trivy, Gitleaks, Semgrep, SBOM)
├── report-generator/       # Markdown/HTML report generation
└── mcp-server/             # MCP AI compliance assistant (6 tools)
```

## Supported Ecosystems

GESF automatically detects your project's language and package manager from lockfiles:

| Ecosystem | Package Managers | Dependency Auditor |
|-----------|-----------------|-------------------|
| Node.js | pnpm, npm, yarn, bun | `pnpm audit`, `npm audit`, `yarn audit`, `bun audit` |
| Python | pip, poetry, pipenv, pdm, uv | `pip-audit`, `safety` |
| Rust | cargo | `cargo audit` |
| Go | go modules | `govulncheck` |
| Ruby | bundler | `bundle-audit` |
| Java | maven, gradle | `OWASP Dependency-Check` |
| PHP | composer | `composer audit` |
| .NET | nuget | `dotnet list package --vulnerable` |

Language-agnostic scanners (Trivy, Gitleaks, Semgrep, Syft, Grype) run regardless of ecosystem.
