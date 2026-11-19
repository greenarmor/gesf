# GESF: Green Engineering Standard Framework

Real-time privacy, security, and compliance warnings for projects using GESF.

GESF is not GDPR-only. It ships compliance controls for **GDPR and 15 country/region privacy laws**, plus **OWASP, NIST, ISO 27001/27701, CIS, HIPAA, PCI DSS, SOC 2**, and more. The selected country and frameworks determine which policy packs are installed.

## Features

- **Real-time warnings** for missing security headers (helmet), missing CORS config, missing `.gitignore`, `.env` not in `.gitignore`
- **Compliance checks** for missing MFA, missing encryption, and missing retention policy documents
- **Status bar** showing the live compliance score from `ges audit`
- **Commands** to run an audit, show the score, and generate reports from VS Code
- **NIST SP 800-53 Rev. 5 assessment** available through the GESF CLI and dashboard: authoritative catalog, SP 800-53B baselines, assessment determinations, evidence, findings, and POA&M
- **JSON schema validation** for `.ges/config.json`, bundled with the extension and available offline
- **Built-in MCP server** bundled with the extension and registered automatically with VS Code, giving AI assistants all 56 GESF tools with no separate install

## MCP Server for AI Assistants

The extension ships the complete GESF MCP server (56 tools) and registers it with VS Code automatically when the extension activates. This lets assistants such as GitHub Copilot use GESF tools directly:

- Check compliance, project status, missing controls, and scores
- Run audits and security scans
- Browse the NIST SP 800-53 catalog, select baselines, record assessments, and list POA&M items
- Generate compliance reports, policies, and governance records

Requirements for automatic registration: VS Code 1.102 or newer. No global npm install is needed for the MCP server because it is bundled; the CLI is still required for the extension's audit, score, and report commands.

For manual setups or other MCP clients, run `GESF: Configure MCP Server for This Workspace` from the Command Palette, or use the CLI:

```bash
ges mcp setup vscode
```

## Global Privacy Coverage

GESF installs a global privacy baseline plus the pack for your country or region:

| Region | Privacy packs |
|---|---|
| Global | `privacy-core` baseline |
| Europe | EU GDPR, UK GDPR, Swiss FADP |
| Asia-Pacific | Singapore PDPA, Philippines DPA, Japan APPI, South Korea PIPA, China PIPL, India DPDPA |
| Americas | Brazil LGPD, Canada PIPEDA, California CPRA |
| Africa and Middle East | South Africa POPIA, UAE PDPL, Saudi Arabia PDPL |

## Framework Coverage

| Area | Packs |
|---|---|
| Privacy | GDPR, privacy-core, 15 country/region packs |
| Application security | OWASP ASVS, OWASP MASVS, OWASP LLM Top 10 |
| NIST | NIST CSF 2.0, NIST SP 800-53 Rev. 5 (scoring pack plus full assessment module) |
| Management systems | ISO 27001, ISO 27701 |
| Industry and infrastructure | HIPAA, PCI DSS, SOC 2, CIS Controls, CIS Docker, CIS Kubernetes, NIST 800-207 Zero Trust |
| Specialized | AI systems, blockchain, government systems, governance provenance |

Run `ges policy list` to see every available pack and `ges policy install <id>` to add one.

## Requirements

- [GESF CLI](https://www.npmjs.com/package/@greenarmor/ges) v1.7.0 or newer: `npm install -g @greenarmor/ges`
- Run `ges init` in your project to initialize compliance controls and select your country and frameworks

## Commands

| Command | Description |
|---------|-------------|
| `GESF: Run Compliance Audit` | Runs `ges audit` in a terminal |
| `GESF: Show Compliance Score` | Runs `ges score` in a terminal |
| `GESF: Generate Report` | Generates a compliance report (markdown/html/pdf) |

## Warnings Detected

| Warning | Severity |
|---------|----------|
| Missing helmet middleware | High |
| Missing CORS package | Medium |
| No .gitignore file | High |
| .env not in .gitignore | Critical |
| MFA required but not implemented | High |
| Encryption required but not detected | Critical |
| Retention policy document missing | Medium |
| GESF not initialized | High |

## Compliance Note

GESF is a compliance engineering framework, not a certification service or legal adviser. Extension diagnostics are development aids and do not constitute an audit, certification, or legal advice. Compliance assessment results are organization-recorded conclusions.

## License

MIT
