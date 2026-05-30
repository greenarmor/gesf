# Configuration Reference

## `.ges/config.yaml`

The human-readable project configuration:

```yaml
project_name: My SaaS App
project_type: saas
version: 0.1.0
created_at: "2026-05-30T10:00:00.000Z"

frameworks:
  - GDPR
  - OWASP
  - CIS
  - NIST

requirements:
  encryption:
    required: true
    level: mandatory
  mfa:
    required: true
    level: mandatory
  audit_logs:
    required: true
    level: mandatory
  backups:
    required: true
    level: mandatory
  retention_policy:
    required: true
    level: mandatory
  vulnerability_scanning:
    required: true
    level: mandatory
  authentication:
    required: true
    level: mandatory
  authorization:
    required: true
    level: mandatory
  secrets_management:
    required: true
    level: mandatory
  logging:
    required: true
    level: mandatory
  monitoring:
    required: true
    level: recommended
  data_classification:
    required: true
    level: mandatory
  disaster_recovery:
    required: true
    level: mandatory
  incident_response:
    required: true
    level: mandatory
  privacy_controls:
    required: true
    level: mandatory
```

## `.ges/config.json`

Machine-readable version of the same configuration. Used by CLI commands internally.

## `.ges/metadata.json`

```json
{
  "project_name": "My SaaS App",
  "project_type": "saas",
  "initialized_at": "2026-05-30T10:00:00.000Z",
  "gesf_version": "0.1.0",
  "last_audit": "2026-05-30T14:30:00.000Z",
  "last_score": "2026-05-30T14:30:00.000Z"
}
```

## `.ges/score.json`

Updated by `ges audit` with the latest compliance scores:

```json
{
  "overall": 72,
  "frameworks": {
    "GDPR": {
      "framework": "GDPR",
      "score": 72,
      "total_controls": 22,
      "passed_controls": 16,
      "failed_controls": 4,
      "warning_controls": 2,
      "not_applicable": 0,
      "evaluated_at": "2026-05-30T14:30:00.000Z"
    },
    "OWASP": {
      "framework": "OWASP",
      "score": 65,
      "total_controls": 6,
      "passed_controls": 4,
      "failed_controls": 1,
      "warning_controls": 1,
      "not_applicable": 0,
      "evaluated_at": "2026-05-30T14:30:00.000Z"
    }
  },
  "evaluated_at": "2026-05-30T14:30:00.000Z"
}
```

## `.ges/framework-version.json`

Tracks which policy pack versions are installed:

```json
{
  "gesf_version": "0.1.0",
  "packs": {
    "gdpr": "0.1.0",
    "owasp": "0.1.0",
    "cis": "0.1.0",
    "nist": "0.1.0"
  }
}
```

## Requirement Levels

Each requirement has a level that indicates how strictly it is enforced:

| Level | Meaning |
|-------|---------|
| `mandatory` | Must be implemented — failures are flagged as critical or high |
| `recommended` | Should be implemented — failures are flagged as medium |
| `optional` | Nice to have — failures are flagged as low |

!!! example "Exercise: Modify Your Configuration"

    1. Open `.ges/config.yaml` in your project
    2. Change `monitoring` from `recommended` to `mandatory`
    3. Add a new framework to the `frameworks` list
    4. Run `ges validate` to check the config is still valid
    5. Run `ges generate --all` to regenerate documents with the new settings
