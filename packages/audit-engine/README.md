# @greenarmor/ges-audit-engine

Source code audit trails and compliance finding evaluation for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

Scans project source code for security and compliance issues — detecting hardcoded secrets, weak cryptography, SQL injection patterns, missing authentication, missing security headers, and more.

## Install

```bash
npm install @greenarmor/ges-audit-engine
```

## Exports

| Export | Description |
|--------|-------------|
| `Finding` | Type representing a security or compliance finding |
| `runAudit(root)` | Scans a project directory and returns findings |
| `deduplicateFindings(findings)` | Removes duplicate findings from scan results |

## Usage

```typescript
import { runAudit, deduplicateFindings } from '@greenarmor/ges-audit-engine';

const { findings, scannedFiles } = runAudit('/path/to/project');
const unique = deduplicateFindings(findings);

console.log(`Scanned ${scannedFiles} files, found ${unique.length} issues`);
```

## What It Detects

- Hardcoded secrets (passwords, API keys, connection strings, private keys)
- Weak cryptography (MD5, SHA1, DES, disabled TLS)
- SQL injection patterns (string concatenation in queries)
- XSS patterns (innerHTML, document.write, dangerouslySetInnerHTML)
- Missing authentication middleware
- Missing security headers (helmet, CORS, rate limiting)
- Missing database audit columns
- Configuration issues (secrets in .env without .gitignore, Docker running as root)

## Related Packages

- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types and constants
- [`@greenarmor/ges-report-generator`](https://www.npmjs.com/package/@greenarmor/ges-report-generator) — Generates reports from findings

## License

MIT
