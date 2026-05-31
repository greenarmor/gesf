# Data Retention Policy - gesf

## Retention Periods

| Data Category | Retention Period | Justification | Deletion Method |
|---------------|-----------------|---------------|-----------------|
| User accounts | Account lifetime + 30 days | Contract fulfillment | Automated deletion |
| Authentication logs | 90 days | Security monitoring | Automated rotation |
| Audit logs | 1 year | Legal obligation | Automated archival |
| Session data | Session duration | Operational | Automatic expiry |
| Backup data | 90 days | Disaster recovery | Automated rotation |

## Deletion Procedures

1. Automated deletion via scheduled jobs
2. Soft delete with scheduled hard delete
3. Anonymisation where deletion is not feasible
4. Backup exclusion for deleted records

## Review Schedule

- Monthly: Review deletion jobs
- Quarterly: Review retention periods
- Annually: Full retention policy review
