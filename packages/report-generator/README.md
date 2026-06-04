# @greenarmor/ges-report-generator

Compliance and security report generation for the Green Engineering Standard Framework (GESF).

Produces formatted compliance reports in Markdown and HTML, combining framework scores, evaluated controls, and audit findings into professional documents.

## Install

```bash
npm install @greenarmor/ges-report-generator
```

## Exports

| Function | Description |
|----------|-------------|
| `generateMarkdownReport(options, score, controls, findings?)` | Generate a full compliance report in Markdown |
| `generateHtmlReport(options, score, controls, findings?)` | Generate a full compliance report in HTML |

## Usage

```typescript
import { generateMarkdownReport, generateHtmlReport } from '@greenarmor/ges-report-generator';
import { generateScoreFile } from '@greenarmor/ges-scoring-engine';
import { createGDPRControls } from '@greenarmor/ges-compliance-engine';

const controls = createGDPRControls();
const score = generateScoreFile(controls, ['GDPR', 'OWASP', 'NIST', 'CIS']);

const markdown = generateMarkdownReport(
  { projectName: 'MyApp', format: 'markdown', frameworks: ['GDPR', 'OWASP'] },
  score,
  controls
);

const html = generateHtmlReport(
  { projectName: 'MyApp', format: 'html', frameworks: ['GDPR', 'OWASP'] },
  score,
  controls
);
```

## Report Contents

- Executive summary with overall compliance score
- Per-framework breakdown with pass/fail/warning counts
- Individual control details with status and remediation guidance
- Audit findings from source code scans (when provided)
- Recommendations and next steps

## Related Packages

- `@greenarmor/ges-core` — Types and constants
- `@greenarmor/ges-scoring-engine` — Score generation
- `@greenarmor/ges-audit-engine` — Source code audit findings
- `@greenarmor/ges-compliance-engine` — Control evaluation

## License

MIT
