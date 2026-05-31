# @greenarmor/ges-scoring-engine

Compliance scoring across frameworks for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

Calculates per-framework and overall compliance scores based on evaluated controls. Produces structured score files for display and reporting.

## Install

```bash
npm install @greenarmor/ges-scoring-engine
```

## Exports

| Function | Description |
|----------|-------------|
| `scoreControls(controls)` | Calculate a 0–100 score from evaluated controls |
| `scoreByFramework(controls, frameworks)` | Score controls grouped by framework |
| `computeOverallScore(frameworkScores)` | Weighted overall compliance score |
| `generateScoreFile(controls, frameworks)` | Generate a complete `ScoreFile` structure |
| `formatScoreOutput(score)` | Format score file as a human-readable string |

## Usage

```typescript
import { generateScoreFile, formatScoreOutput } from '@greenarmor/ges-scoring-engine';
import { createGDPRControls } from '@greenarmor/ges-compliance-engine';

const controls = createGDPRControls();
const score = generateScoreFile(controls, ['GDPR', 'OWASP', 'NIST', 'CIS']);

console.log(formatScoreOutput(score));
// GDPR ............. 94%
// OWASP ............ 91%
// NIST ............. 89%
// CIS .............. 92%
// Overall .......... 92%
```

## Score Output

Scores are stored in `.ges/score.json` and include:

- Per-framework percentages
- Pass/fail/warning counts per framework
- Weighted overall score
- Timestamp

## Related Packages

- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types and constants
- [`@greenarmor/ges-compliance-engine`](https://www.npmjs.com/package/@greenarmor/ges-compliance-engine) — Control evaluation
- [`@greenarmor/ges-report-generator`](https://www.npmjs.com/package/@greenarmor/ges-report-generator) — Report generation from scores

## License

MIT
