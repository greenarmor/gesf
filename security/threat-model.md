# Threat Model - gesf

## System Overview

- **Project**: gesf
- **Type**: vulnerability-scanner

## Assets

- User personal data
- Authentication credentials
- Session tokens
- API keys and secrets
- Application source code
- Infrastructure configuration

## Threat Categories (STRIDE)

### Spoofing
- Unauthorized access via stolen credentials
- Session hijacking

### Tampering
- Data modification by unauthorized users
- SQL injection / NoSQL injection
- Parameter tampering

### Repudiation
- Actions performed without audit trail
- Denial of data access

### Information Disclosure
- Data breach via API vulnerability
- Logging of sensitive data
- Error messages leaking information

### Denial of Service
- Rate limiting bypass
- Resource exhaustion

### Elevation of Privilege
- Role escalation via API
- IDOR vulnerabilities
- JWT manipulation

## Mitigations

| Threat | Mitigation | Status |
|--------|------------|--------|
| Stolen credentials | MFA, Argon2id hashing | [ ] |
| SQL injection | Parameterized queries, input validation | [ ] |
| XSS | Output encoding, CSP headers | [ ] |
| CSRF | CSRF tokens, SameSite cookies | [ ] |
| Data breach | Encryption at rest and in transit | [ ] |
| Insider threat | RBAC, audit logging, least privilege | [ ] |
