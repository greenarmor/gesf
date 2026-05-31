# Access Control Matrix - gesf

## Roles

| Role | Description |
|------|-------------|
| Admin | Full system access with audit trail |
| User | Standard user access |
| Auditor | Read-only access to audit data |
| System | Service account for automated processes |

## Permissions Matrix

| Resource | Admin | User | Auditor | System |
|----------|-------|------|---------|--------|
| User Management | CRUD | R (own) | R | R |
| Data Access | CRUD | CR (own) | R | CR |
| Audit Logs | R | - | R | W |
| Configuration | CRUD | - | R | R |
| Reports | CRUD | R (own) | R | CR |

## Principles

- **Least Privilege**: Users have minimum required access
- **Deny by Default**: Access denied unless explicitly granted
- **Separation of Duties**: Critical operations require multiple roles
