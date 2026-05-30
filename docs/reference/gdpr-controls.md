# GDPR Controls

GESF implements 22 GDPR controls across 6 articles. Each control has check items, severity, and implementation guidance.

## Article 5 — Principles Relating to Processing (6 controls)

| ID | Control | Description |
|----|---------|-------------|
| ART5-001 | Lawfulness, Fairness, Transparency | Processing must have a legal basis and be transparent to data subjects |
| ART5-002 | Purpose Limitation | Data collected for specified, explicit, and legitimate purposes only |
| ART5-003 | Data Minimisation | Collect only data that is adequate, relevant, and necessary |
| ART5-004 | Accuracy | Personal data must be accurate and kept up to date |
| ART5-005 | Storage Limitation | Data kept only as long as necessary for the processing purpose |
| ART5-006 | Integrity and Confidentiality | Appropriate security measures to protect personal data |

## Article 25 — Data Protection by Design and by Default (2 controls)

| ID | Control | Description |
|----|---------|-------------|
| ART25-001 | Privacy by Design | Implement data protection principles at the design stage of systems |
| ART25-002 | Privacy by Default | Only process data necessary for each specific purpose by default |

## Article 30 — Records of Processing Activities (2 controls)

| ID | Control | Description |
|----|---------|-------------|
| ART30-001 | Processing Records | Maintain records of all processing activities (controller) |
| ART30-002 | Processor Records | Maintain records of all processing activities (processor) |

## Article 32 — Security of Processing (9 controls)

| ID | Control | Description |
|----|---------|-------------|
| ART32-001 | Pseudonymisation | Process personal data so it cannot be attributed to a specific individual without additional info |
| ART32-002 | Encryption at Rest | Encrypt personal data stored in databases, files, and backups |
| ART32-003 | Encryption in Transit | Encrypt all data transmitted over networks (TLS 1.2+) |
| ART32-004 | Unique User Identification | Ensure each user has a unique identifier for access control and auditing |
| ART32-005 | Automatic Session Timeout | Terminate idle sessions after a defined period |
| ART32-006 | Audit Logging | Log all access to and modifications of personal data |
| ART32-007 | Integrity Controls | Ensure data has not been altered in an unauthorized manner |
| ART32-008 | Backup and Recovery | Maintain encrypted backups with tested restore procedures |
| ART32-009 | Regular Security Testing | Conduct periodic security assessments and penetration tests |

## Article 33 — Notification of Breach to Supervisory Authority (2 controls)

| ID | Control | Description |
|----|---------|-------------|
| ART33-001 | Breach Notification to Authority | Notify the supervisory authority within 72 hours of becoming aware of a breach |
| ART33-002 | Breach Documentation | Document all breaches, including facts, effects, and remedial actions |

## Article 34 — Communication of Breach to Data Subject (1 control)

| ID | Control | Description |
|----|---------|-------------|
| ART34-001 | Breach Communication to Data Subjects | Notify affected data subjects when a breach is likely to result in high risk |

---

## How Controls Are Evaluated

1. **`ges audit`** scans your source code for patterns that indicate compliance or violations
2. Findings are mapped to control IDs (e.g., MD5 usage → `ART32-002` fail)
3. Controls with no findings against them remain "not-implemented"
4. Controls with critical/high findings are marked "fail"
5. Controls with medium findings are marked "warning"
6. The score is calculated based on passing vs total controls

## How to Satisfy Each Control

| Control | What the Scanner Looks For |
|---------|---------------------------|
| ART32-002 Encryption at Rest | No MD5/SHA1, no weak encryption, no plaintext passwords |
| ART32-003 Encryption in Transit | No `rejectUnauthorized: false`, no disabled TLS |
| ART32-004 Unique User ID | Auth library present (Passport, JWT, NextAuth, etc.) |
| ART32-005 Session Timeout | Session expiration configuration in code |
| ART32-006 Audit Logging | Logging library present (winston, pino, morgan) |
| ART32-008 Backup and Recovery | Backup configuration or procedures documented |
| ART5-005 Storage Limitation | Retention policy exists |

!!! example "Exercise: Map Findings to Controls"

    1. Run `ges audit` on a project with findings
    2. For each finding, note which control ID it maps to
    3. Look up the control in `controls/gdpr/controls.json`
    4. Read the implementation guidance for each failing control

    ```bash
    # View control details
    cat controls/gdpr/controls.json | python3 -m json.tool | less
    ```

!!! example "Exercise: Create a Control Satisfaction Plan"

    For a SaaS project with 22 GDPR controls:

    1. Run `ges audit` and `ges compliance` to see which controls are failing
    2. Create a spreadsheet with columns: Control ID, Status, Priority, Estimated Effort
    3. Sort by: criticals first, then highs, then warnings
    4. Estimate the development effort to satisfy each failing control
    5. Create a sprint plan to address them

    | Control | Status | Priority | Effort | Sprint |
    |---------|--------|----------|--------|--------|
    | ART32-002 | FAIL | Critical | 2 days | Sprint 1 |
    | ART32-006 | FAIL | Critical | 1 day | Sprint 1 |
    | ART32-005 | WARN | High | 0.5 day | Sprint 2 |
    | ART5-005 | WARN | High | 1 day | Sprint 2 |
