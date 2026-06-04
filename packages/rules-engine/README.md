# @greenarmor/ges-rules-engine

Engineering standards enforcement rules for the Green Engineering Standard Framework (GESF).

Defines and validates security and compliance rules for data classification, authentication, encryption, secrets management, logging, database standards, API security, and storage.

## Install

```bash
npm install @greenarmor/ges-rules-engine
```

## Exports

| Export | Description |
|--------|-------------|
| `ClassificationRule` | Interface for data classification rules |
| `CLASSIFICATION_RULES` | Rules per classification level (Public → Restricted) |
| `AuthRule` | Interface for authentication rules |
| `APPROVED_AUTH_METHODS` | Approved methods (Argon2id, MFA, Passkeys) |
| `REJECTED_AUTH_METHODS` | Rejected methods (MD5, SHA1, plain text) |
| `EncryptionRule` | Interface for encryption rules |
| `APPROVED_ENCRYPTION` | Approved algorithms (AES-256-GCM, ChaCha20-Poly1305, TLS 1.3) |
| `SecretsRule` | Interface for secrets management rules |
| `SECRETS_RULES` | Rules for vault integration, no secrets in code |
| `LoggingRule` | Interface for logging rules |
| `LOGGING_RULES` | What to log and what to never log |
| `DBStandard` | Interface for database standards |
| `DB_STANDARDS` | Required audit columns, soft delete, primary keys |
| `APIStandard` | Interface for API security standards |
| `API_STANDARDS` | Input validation, auth, rate limiting, audit logging |
| `StorageRule` | Interface for storage rules |
| `STORAGE_RULES` | Private by default, encryption, signed URLs, versioning |

## Usage

```typescript
import {
  CLASSIFICATION_RULES,
  APPROVED_ENCRYPTION,
  REJECTED_AUTH_METHODS,
  LOGGING_RULES
} from '@greenarmor/ges-rules-engine';

const restrictedRules = CLASSIFICATION_RULES['restricted'];
console.log(restrictedRules.requiresEncryption); // true

const approved = APPROVED_ENCRYPTION.map(r => r.algorithm);
```

## Related Packages

- `@greenarmor/ges-core` — Types and constants
- `@greenarmor/ges-compliance-engine` — Control evaluation

## License

MIT
