# Engineering Standards

GESF enforces specific engineering standards across authentication, encryption, secrets management, logging, databases, and storage.

## Authentication

| Approved | Rejected |
|----------|----------|
| Argon2id for password hashing | MD5 |
| Multi-Factor Authentication (MFA) | SHA1 |
| Passkeys (WebAuthn) | Plain text passwords |
| Session expiration | Hardcoded credentials |
| Rate limiting | |

## Encryption

| Approved | Rejected |
|----------|----------|
| AES-256-GCM | DES |
| ChaCha20-Poly1305 | 3DES |
| TLS 1.3 | Blowfish |
| TLS 1.2 (minimum) | AES-128 |
| | ECB mode |

## Secrets Management

| Forbidden | Supported Solutions |
|-----------|-------------------|
| Passwords in source code | HashiCorp Vault |
| Private keys in git | AWS KMS |
| API keys in repositories | Azure Key Vault |
| | GCP Secret Manager |
| | Encrypted environment files |

## Logging

**Must log:**

- Authentication events (login, logout, failed attempts)
- Authorization events (access granted, denied)
- Data exports
- Role changes
- Administrative actions

**Must NOT log:**

- Passwords
- Tokens (JWT, API keys, session tokens)
- Private keys
- Sensitive personal data

## Database

Every database table must include:

| Column | Type | Purpose |
|--------|------|---------|
| `created_at` | Timestamp | When the record was created |
| `updated_at` | Timestamp | When the record was last updated |
| `deleted_at` | Timestamp (nullable) | Soft delete — when the record was "deleted" |
| `created_by` | String/User ID | Who created the record |
| `updated_by` | String/User ID | Who last modified the record |

## API Security

All API endpoints must enforce:

| Standard | Description |
|----------|-------------|
| Input validation | Validate and sanitize all user input |
| Output encoding | Encode output to prevent injection |
| Authentication | Verify identity on every request |
| Authorization | Check permissions for the requested action |
| Rate limiting | Prevent abuse and brute force attacks |
| Audit logging | Log all API access for compliance |

## Storage

For object storage (S3, MinIO, Azure Blob, Google Storage):

| Rule | Description |
|------|-------------|
| Private by default | New objects should not be publicly accessible |
| Signed URLs | Use time-limited signed URLs for temporary access |
| Encryption enabled | Encrypt all stored objects |
| Versioning enabled | Keep object versions for recovery and audit |

## Data Classification

| Level | Encryption | Access Controls | Audit Logging |
|-------|-----------|----------------|---------------|
| **Public** | Not required | Open | Not required |
| **Internal** | Not required | Required | Not required |
| **Confidential** | Required | Required | Required |
| **Restricted** | Required | Required | Required |

**Restricted** data triggers the highest level of controls across all categories.

!!! example "Exercise: Audit Against Each Standard"

    For each engineering standard, create a test file that violates it, then fix it:

    === "Authentication"

        ```javascript
        // BAD
        function checkPassword(input, stored) { return input === stored; }

        // GOOD
        async function checkPassword(input, stored) { return argon2.verify(stored, input); }
        ```

    === "Encryption"

        ```javascript
        // BAD
        crypto.createHash('md5').update(data).digest('hex');

        // GOOD
        crypto.createHash('sha256').update(data).digest('hex');
        ```

    === "Secrets"

        ```javascript
        // BAD
        const apiKey = "sk-abc123";

        // GOOD
        const apiKey = process.env.API_KEY;
        ```

    === "Database"

        ```javascript
        // BAD — missing audit columns
        const User = { id: INTEGER, name: STRING };

        // GOOD — with audit columns
        const User = {
          id: INTEGER, name: STRING,
          created_at: DATE, updated_at: DATE,
          deleted_at: DATE, created_by: STRING, updated_by: STRING
        };
        ```

    Run `ges audit` before and after each fix to see the finding appear and disappear.
