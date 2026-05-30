# @greenarmor/ges

Green Engineering Standard Framework - Compliance-as-Code CLI

## Install

```bash
npm install -g @greenarmor/ges
```

Or use without installing:

```bash
npx @greenarmor/ges init
```

## Quick Start

```bash
# Navigate to any project
cd my-project

# Initialize compliance framework
ges init

# Run security and compliance audit
ges audit

# View compliance score
ges score

# Generate reports
ges report

# Diagnose configuration
ges doctor
```

## Commands

| Command | Description |
|---------|-------------|
| `ges init` | Initialize GESF in the current project |
| `ges audit` | Scan source code for security and compliance issues |
| `ges score` | Calculate and display compliance score |
| `ges report` | Generate compliance reports (Markdown/HTML) |
| `ges doctor` | Diagnose GESF configuration and health |
| `ges scan` | Run external security scanners |
| `ges compliance` | Show compliance status and installed packs |
| `ges validate` | Validate GESF configuration |
| `ges generate` | Regenerate documentation and workflows |
| `ges policy list` | List available policy packs |
| `ges policy install <pack>` | Install a policy pack |
| `ges policy remove <pack>` | Remove a policy pack |
| `ges update` | Check for updates |

## What It Detects

- **Secrets**: Hardcoded passwords, API keys, connection strings, private keys, tokens
- **Weak Crypto**: MD5, SHA1, DES, AES-128, disabled TLS verification
- **SQL Injection**: String concatenation in SQL queries with user input
- **XSS**: innerHTML with user input, document.write, v-html, dangerouslySetInnerHTML
- **Missing Auth**: Routes without authentication middleware
- **Missing Security**: No helmet, no CORS config, no rate limiting, no MFA
- **Config Issues**: Secrets in .env without .gitignore, Docker as root, missing logging
- **Database Issues**: Missing audit columns, missing soft delete patterns

## Supported Project Types

SaaS, AI Application, MCP Server, Blockchain, Wallet, Government System, Healthcare System, Event Platform, Photo Storage Platform, Vulnerability Scanner, Generic Web Application, API Backend, Mobile Application

## Compliance Frameworks

GDPR, OWASP ASVS, CIS Controls, NIST CSF, ISO 27001, ISO 27701
