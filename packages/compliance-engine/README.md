# @greenarmor/ges-compliance-engine

GDPR compliance controls, evaluation, and compliance checking for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

Evaluates GDPR controls based on Articles 5, 25, 30, 32, 33, and 34 — producing structured control objects with pass/fail/warning status.

## Install

```bash
npm install @greenarmor/ges-compliance-engine
```

## Exports

| Function | Description |
|----------|-------------|
| `createGDPRControls()` | Returns all GDPR controls across all articles |
| `createArticle5Controls()` | Controls for GDPR Article 5 — Principles relating to processing |
| `createArticle25Controls()` | Controls for Article 25 — Data protection by design and by default |
| `createArticle30Controls()` | Controls for Article 30 — Records of processing activities |
| `createArticle32Controls()` | Controls for Article 32 — Security of processing |
| `createArticle33Controls()` | Controls for Article 33 — Notification of data breach to supervisory authority |
| `createArticle34Controls()` | Controls for Article 34 — Communication of data breach to data subject |
| `evaluateControl(control)` | Evaluates a single control and returns its status |

## Usage

```typescript
import { createGDPRControls, evaluateControl, createArticle32Controls } from '@greenarmor/ges-compliance-engine';

const allControls = createGDPRControls();
const art32 = createArticle32Controls();

const evaluated = allControls.map(c => evaluateControl(c));
```

## Related Packages

- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types and constants
- [`@greenarmor/ges-scoring-engine`](https://www.npmjs.com/package/@greenarmor/ges-scoring-engine) — Scoring evaluated controls
- [`@greenarmor/ges-policy-engine`](https://www.npmjs.com/package/@greenarmor/ges-policy-engine) — Policy pack management

## License

MIT
