# Project Structure

After running `ges init`, the following structure is created in your project:

```
your-project/
├── .ges/
│   ├── config.yaml              # Human-readable project configuration
│   ├── config.json              # Machine-readable project configuration
│   ├── metadata.json            # Project metadata and timestamps
│   ├── score.json               # Compliance scores (updated by ges audit)
│   └── framework-version.json   # Policy pack version tracking
│
├── compliance/
│   ├── gdpr.md                  # GDPR compliance tracker
│   ├── data-inventory.md        # Data inventory template
│   ├── retention-policy.md      # Data retention policy
│   ├── processing-records.md    # Article 30 processing records
│   ├── risk-register.md         # Risk register template
│   ├── access-control-matrix.md # RBAC matrix
│   └── privacy-impact-assessment.md  # Privacy impact assessment
│
├── security/
│   ├── threat-model.md          # STRIDE threat model
│   ├── key-management.md        # Key management policy
│   ├── logging-policy.md        # Logging standards
│   ├── backup-policy.md         # Backup procedures
│   ├── incident-response.md     # Incident response plan
│   ├── disaster-recovery.md     # Disaster recovery plan
│   └── encryption-standard.md   # Approved encryption algorithms
│
├── controls/
│   ├── gdpr/controls.json       # GDPR control definitions
│   ├── owasp/controls.json      # OWASP control definitions
│   ├── cis/controls.json        # CIS control definitions
│   └── nist/controls.json       # NIST control definitions
│
├── policies/                    # Policy definitions
├── checklists/                  # Compliance checklists
├── docs/                        # Additional documentation
├── reports/                     # Generated reports (output directory)
│
└── .github/
    └── workflows/
        ├── compliance.yml       # Compliance check workflow
        ├── security.yml         # Security scan workflow
        ├── dependency-scan.yml  # Dependency vulnerability scan
        └── secret-scan.yml      # Secret detection workflow
```

## Directory Purposes

| Directory | Created by | Updated by | Git Track |
|-----------|-----------|------------|:---------:|
| `.ges/` | `ges init` | `ges audit`, `ges score` | Optional |
| `compliance/` | `ges init` | `ges generate --docs` | Yes |
| `security/` | `ges init` | `ges generate --docs` | Yes |
| `controls/` | `ges init` | `ges policy install/remove` | Yes |
| `policies/` | `ges init` | Manual | Yes |
| `checklists/` | `ges init` | Manual | Yes |
| `docs/` | `ges init` | Manual | Yes |
| `reports/` | `ges report` | `ges report` | No |
| `.github/workflows/` | `ges init` | `ges generate --workflows` | Yes |

## What to Commit

**Always commit:**

- `compliance/` — Compliance documents for audit trail
- `security/` — Security policies
- `controls/` — Control definitions
- `.github/workflows/` — CI/CD enforcement

**Optional:**

- `.ges/` — Commit if you want score history in git; add to `.gitignore` if you want local-only scores

**Never commit:**

- `reports/` — Generated output, add to `.gitignore`
