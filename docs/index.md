# GESF — Green Engineering Standard Framework

Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards in any software project.

## What GESF Does

- **Scans** your source code for security vulnerabilities and compliance violations using 6 built-in scanners
- **Generates** compliance documentation — GDPR, data inventory, retention policies, risk assessments
- **Scores** your project against multiple compliance frameworks
- **Creates** CI/CD pipelines that fail the build on critical issues
- **Provides** an AI compliance assistant via MCP for Claude, VS Code Copilot, Cursor, and more

## What GESF Does NOT Do

- It does not replace legal counsel for GDPR compliance.
- It does not automatically fix your code — it identifies issues and suggests fixes.
- It does not require a running server or database.

## Quick Start

```bash
npm install -g @greenarmor/ges
cd your-project
ges init
ges audit
ges score
```

## Key Features

| Feature | Description |
|---------|-------------|
| **6 Source Code Scanners** | Secrets, crypto, injection, auth, config, database |
| **7 Policy Packs** | GDPR (22 controls), OWASP, CIS, NIST, AI, Blockchain, Government |
| **13 Project Types** | SaaS, AI, MCP Server, Blockchain, Wallet, Government, Healthcare, and more |
| **MCP AI Assistant** | Works with Claude, VS Code Copilot, Cursor, OpenCode, Crush, Windsurf |
| **CI/CD Workflows** | 4 GitHub Actions workflows auto-generated |
| **14 Document Templates** | Compliance docs, security policies, threat models |
| **Compliance Reports** | Markdown and HTML reports with executive summary |

## Architecture

```
packages/
├── cli/                    # CLI (@greenarmor/ges)
├── core/                   # Types, schemas, constants
├── audit-engine/           # Real source code scanning (6 scanners)
├── compliance-engine/      # GDPR Article 5/25/30/32/33/34 controls
├── policy-engine/          # 7 policy packs (56 total controls)
├── rules-engine/           # Auth, encryption, secrets, logging standards
├── doc-generator/          # 14 compliance/security document templates
├── cicd-generator/         # GitHub Actions workflow generation
├── scoring-engine/         # Multi-framework compliance scoring
├── scanner-integration/    # External tool integration (Trivy, Gitleaks, Semgrep)
├── report-generator/       # Markdown/HTML report generation
└── mcp-server/             # MCP AI compliance assistant
```
