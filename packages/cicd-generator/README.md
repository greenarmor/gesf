# @greenarmor/ges-cicd-generator

GitHub Actions workflow generation for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

Generates ready-to-use CI/CD workflow files for compliance checking, security scanning, dependency auditing, and secret detection — configured to run on pull requests and pushes.

## Install

```bash
npm install @greenarmor/ges-cicd-generator
```

## Exports

| Export | Description |
|--------|-------------|
| `WorkflowFile` | Interface for generated output (filePath + content) |
| `generateComplianceWorkflow(config)` | Generate `.github/workflows/compliance.yml` |
| `generateSecurityWorkflow(config)` | Generate `.github/workflows/security.yml` |
| `generateDependencyScanWorkflow(config)` | Generate `.github/workflows/dependency-scan.yml` |
| `generateSecretScanWorkflow(config)` | Generate `.github/workflows/secret-scan.yml` |
| `generateAllWorkflows(config)` | Generate all four workflow files |

## Usage

```typescript
import { generateAllWorkflows } from '@greenarmor/ges-cicd-generator';
import type { ProjectConfig } from '@greenarmor/ges-core';

const config: ProjectConfig = {
  projectName: 'MyApp',
  projectType: 'saas',
  frameworks: ['GDPR', 'OWASP'],
  requirements: { encryption: { required: true }, mfa: { required: true } },
};

const workflows = generateAllWorkflows(config);
workflows.forEach(w => {
  fs.writeFileSync(w.filePath, w.content);
});
```

## Generated Workflows

| Workflow | Triggers | Scans |
|----------|----------|-------|
| `compliance.yml` | push, PR | GESF compliance audit and scoring |
| `security.yml` | push, PR | Semgrep static analysis |
| `dependency-scan.yml` | push, PR (weekly) | npm/pnpm audit, Trivy |
| `secret-scan.yml` | push, PR | Gitleaks secret detection |

## Related Packages

- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types and constants
- [`@greenarmor/ges-scanner-integration`](https://www.npmjs.com/package/@greenarmor/ges-scanner-integration) — Scanner execution

## License

MIT
