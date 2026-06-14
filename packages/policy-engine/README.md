# @greenarmor/ges-policy-engine

Policy pack management and enforcement for the Green Engineering Standard Framework (GESF).

Manages compliance policy packs for GDPR, OWASP, NIST, CIS, AI systems, blockchain, and government projects. Each policy pack defines the controls and standards applicable to a specific compliance domain.

## Install

```bash
npm install @greenarmor/ges-policy-engine
```

## Exports

| Function | Description |
|----------|-------------|
| `getAllPacks()` | Returns all available policy packs |
| `getPack(id)` | Get a specific policy pack by ID |
| `getPacksForProjectType(type)` | Get recommended packs for a project type |
| `listPackIds()` | List all available pack identifiers |
| `createGDPRPolicyPack()` | GDPR policy pack |
| `createOWASPPolicyPack()` | OWASP ASVS policy pack |
| `createAIPolicyPack()` | AI / LLM / MCP policy pack |
| `createBlockchainPolicyPack()` | Blockchain / Wallet policy pack |
| `createGovernmentPolicyPack()` | Government systems policy pack |
| `createCISPolicyPack()` | CIS Controls policy pack |
| `createNISTPolicyPack()` | NIST Cybersecurity Framework policy pack |

## Usage

```typescript
import { getAllPacks, getPacksForProjectType } from '@greenarmor/ges-policy-engine';

const allPacks = getAllPacks();
const aiPacks = getPacksForProjectType('ai-application');

allPacks.forEach(p => console.log(`${p.id}: ${p.name}`));
```

## Policy Packs

| Pack ID | Framework | Description |
|---------|-----------|-------------|
| `gdpr` | GDPR | EU General Data Protection Regulation controls |
| `owasp` | OWASP ASVS | Application Security Verification Standard |
| `cis` | CIS Controls | Center for Internet Security controls |
| `nist` | NIST CSF 2.0 | NIST Cybersecurity Framework 2.0 (23 controls / 145 checks) |
| `ai` | AI Policy | LLM, Agent, MCP, RAG security controls |
| `blockchain` | Blockchain | Cryptographic signatures, key rotation, on-chain rules |
| `government` | Government | Data sovereignty, chain of custody, tamper evidence |

## Related Packages

- `@greenarmor/ges-core` — Types and constants
- `@greenarmor/ges-compliance-engine` — Control evaluation

## License

MIT
