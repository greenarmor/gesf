# GESF VS Code Extension

Real-time GDPR, security, and compliance warnings for projects using the Green Engineering Standard Framework (GESF).

## Features

- **Real-time warnings** for missing security headers (helmet), missing CORS config, missing .gitignore, .env not in .gitignore
- **Compliance checks** for missing MFA implementation, missing encryption, missing retention policy documents
- **Status bar** showing live compliance score from `ges audit`
- **Commands** to run audit, show score, and generate reports directly from VS Code

## Requirements

- [GESF CLI](https://www.npmjs.com/package/@greenarmor/ges) installed globally: `npm install -g @greenarmor/ges`
- Run `ges init` in your project to initialize compliance controls

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

## License

MIT
