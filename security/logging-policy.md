# Logging Policy - gesf

## Must Log

- Authentication events (success and failure)
- Authorization decisions (access granted/denied)
- Data export operations
- Role and permission changes
- Administrative actions
- API access (method, path, status code)

## Must NOT Log

- Passwords (even hashed)
- Authentication tokens
- Private keys
- Sensitive personal data (SSN, health data, etc.)
- Full credit card numbers
- Session cookies

## Audit Trail Fields

Every audit log entry must include:
- `userId`: Who performed the action
- `action`: What action was performed
- `resource`: What resource was affected
- `timestamp`: When the action occurred (ISO 8601)
- `ipAddress`: Source IP address

## Log Retention

| Log Type | Retention Period |
|----------|-----------------|
| Audit logs | 1 year |
| Security logs | 90 days |
| Access logs | 30 days |
| Error logs | 30 days |

## Immutability

All audit logs must be append-only. No modification or deletion is permitted.
