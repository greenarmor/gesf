# @greenarmor/ges-scanner-integration

Security scanner integrations for the Green Engineering Standard Framework (GESF).

Wraps industry-standard security scanners — Trivy, Gitleaks, Semgrep, npm audit, and pnpm audit — into a unified interface with structured results.

## Install

```bash
npm install @greenarmor/ges-scanner-integration
```

## Exports

| Export | Description |
|--------|-------------|
| `ScanResult` | Interface for scanner output (scanner name, status, findings, raw output) |
| `runNpmAudit()` | Run `npm audit` and parse results |
| `runPnpmAudit()` | Run `pnpm audit` and parse results |
| `runTrivy()` | Run Trivy container/filesystem scan |
| `runGitleaks()` | Run Gitleaks secret detection |
| `runSemgrep()` | Run Semgrep static analysis |
| `runAllScans()` | Run all available scanners and collect results |
| `formatScanResults(results)` | Format scan results as a human-readable summary |

## Usage

```typescript
import { runAllScans, formatScanResults } from '@greenarmor/ges-scanner-integration';

const results = runAllScans();
console.log(formatScanResults(results));

// Or run individual scanners
import { runGitleaks } from '@greenarmor/ges-scanner-integration';
const secrets = runGitleaks();
if (secrets.status === 'found') {
  console.log(`Found ${secrets.findings.length} secrets`);
}
```

## Supported Scanners

| Scanner | Purpose | Requirement |
|---------|---------|-------------|
| npm audit | Dependency vulnerabilities | npm projects |
| pnpm audit | Dependency vulnerabilities | pnpm projects |
| Trivy | Container and filesystem scanning | Trivy installed |
| Gitleaks | Secret detection in Git history | Gitleaks installed |
| Semgrep | Static analysis for security patterns | Semgrep installed |

Scanners that are not installed are gracefully skipped with a `not_available` status.

## Related Packages

- `@greenarmor/ges-core` — Types and constants
- `@greenarmor/ges-cicd-generator` — CI/CD workflow generation

## License

MIT
