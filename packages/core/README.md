# @greenarmor/ges-core

Core types, Zod schemas, and constants for the [Green Engineering Standard Framework (GESF)](https://github.com/greenarmor/gesf).

This is the foundation package that all other GESF packages depend on. It provides shared TypeScript interfaces, runtime validation schemas, and compliance-related constants used across the framework.

## Install

```bash
npm install @greenarmor/ges-core
```

## Exports

### Types

| Type | Description |
|------|-------------|
| `ProjectType` | Supported project types (SaaS, AI, MCP Server, Blockchain, etc.) |
| `FrameworkName` | Compliance framework identifiers (GDPR, OWASP, NIST, CIS) |
| `DataClassification` | Data sensitivity levels (Public, Internal, Confidential, Restricted) |
| `ControlStatus` | Control evaluation states (pass, fail, warning, not_applicable) |
| `ReportFormat` | Output formats (markdown, html, pdf) |
| `ProjectConfig` | Project configuration interface |
| `Requirements` | Compliance requirements configuration |
| `Control` | Individual compliance control |
| `ControlCheck` | Control evaluation result |
| `ComplianceScore` | Per-framework scoring result |
| `ScoreFile` | Overall score file structure |
| `AuditEntry` | Audit trail entry |
| `PolicyPack` | Policy pack definition |
| `ReportOptions` | Report generation options |

### Constants

| Constant | Description |
|----------|-------------|
| `GESF_VERSION` | Framework version string |
| `PROJECT_TYPES` | All supported project types with labels |
| `FRAMEWORKS` | Supported compliance frameworks |
| `DEFAULT_FRAMEWORKS` | Default frameworks for new projects |
| `PROJECT_TYPE_PACKS` | Mapping of project types to policy packs |
| `DATA_CLASSIFICATIONS` | Data classification levels |
| `APPROVED_ENCRYPTION` | Approved encryption algorithms |
| `APPROVED_HASHING` | Approved hashing algorithms (Argon2id, bcrypt) |
| `REJECTED_HASHING` | Rejected hashing algorithms (MD5, SHA1) |
| `AUDIT_LOG_FIELDS` | Required fields for audit log entries |
| `MUST_LOG_EVENTS` | Events that must be logged |
| `MUST_NOT_LOG` | Data that must never appear in logs |
| `DB_AUDIT_COLUMNS` | Required database audit columns |

### Schemas (Zod)

Runtime validation schemas for all types: `ProjectConfigSchema`, `ControlSchema`, `AuditEntrySchema`, `ReportOptionsSchema`, and more.

## Usage

```typescript
import { ControlSchema, APPROVED_ENCRYPTION, GESF_VERSION } from '@greenarmor/ges-core';

const control = ControlSchema.parse({
  id: 'enc-001',
  name: 'Encryption at Rest',
  framework: 'GDPR',
  status: 'pass',
});

console.log(APPROVED_ENCRYPTION); // ['AES-256-GCM', 'ChaCha20-Poly1305', ...]
```

## License

MIT
