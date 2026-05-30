# 🔰 Green Engineering Standard Framework (GESF)

Compliance-as-Code framework that automatically enforces GDPR, OWASP, NIST, and CIS engineering standards.

## Install

```bash
npm install -g @greenarmor/ges
```

## Usage

```bash
cd any-project
ges init
ges audit
ges score
```

## Architecture

```
packages/
├── cli/                    # CLI (@greenarmor/ges)
├── core/                   # Types, schemas, constants
├── audit-engine/           # Real source code scanning (6 scanners)
├── compliance-engine/      # GDPR Article 5/25/30/32/33/34 controls
├── policy-engine/          # 7 policy packs (GDPR, OWASP, AI, Blockchain, Gov, CIS, NIST)
├── rules-engine/           # Auth, encryption, secrets, logging standards
├── doc-generator/          # 14 compliance/security document templates
├── cicd-generator/         # GitHub Actions workflow generation
├── scoring-engine/         # Multi-framework compliance scoring
├── scanner-integration/    # External tool integration (Trivy, Gitleaks, Semgrep)
├── report-generator/       # Markdown/HTML report generation
└── mcp-server/             # MCP AI compliance assistant
```

## License

MIT
