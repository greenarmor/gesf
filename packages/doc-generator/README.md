# @greenarmor/ges-doc-generator

Compliance and security document template generation for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

Generates structured Markdown documents, YAML configuration, and JSON metadata files for compliance directories including GDPR policies, security standards, threat models, and data inventories.

## Install

```bash
npm install @greenarmor/ges-doc-generator
```

## Exports

| Export | Description |
|--------|-------------|
| `GeneratedFile` | Interface for generated output (filePath + content) |
| `generateComplianceDocs(name, type)` | Generate all compliance documents (GDPR, retention, DPIA, etc.) |
| `generateSecurityDocs(name, type)` | Generate all security documents (threat model, encryption, IR, etc.) |
| `generateConfigYaml(config)` | Generate `.ges/config.yaml` |
| `generateMetadataJson(config)` | Generate `.ges/metadata.json` |
| `generateConfigJson(config)` | Generate `.ges/config.json` |
| `generateFrameworkVersionJson()` | Generate `.ges/framework-version.json` |
| `generateScoreJson()` | Generate initial `.ges/score.json` |

## Usage

```typescript
import {
  generateComplianceDocs,
  generateSecurityDocs,
  generateConfigYaml
} from '@greenarmor/ges-doc-generator';

const compliance = generateComplianceDocs('MyApp', 'saas');
const security = generateSecurityDocs('MyApp', 'saas');

// Write all files
[...compliance, ...security].forEach(file => {
  fs.writeFileSync(file.filePath, file.content);
});
```

## Generated Documents

**Compliance** (`compliance/`):
- GDPR policy, data inventory, retention policy, processing records, risk register, access control matrix, privacy impact assessment

**Security** (`security/`):
- Threat model, key management, logging policy, backup policy, incident response, disaster recovery, encryption standard

**Configuration** (`.ges/`):
- config.yaml, metadata.json, score.json, framework-version.json

## Related Packages

- [`@greenarmor/ges-core`](https://www.npmjs.com/package/@greenarmor/ges-core) — Types and constants
- [`@greenarmor/ges-cicd-generator`](https://www.npmjs.com/package/@greenarmor/ges-cicd-generator) — CI/CD workflow generation

## License

MIT
