# MCP Tools Reference

Once configured, the GESF MCP server provides **43 tools** to your AI assistant. This page documents every tool with exact prompts you can copy and paste into your AI assistant.

## Tool Overview

### Compliance Assessment

| Tool | Description | Parameters |
|------|-------------|------------|
| `check_compliance` | Check compliance status for a project type | `project_type` (string) |
| `check_project_status` | Read actual `.ges/` directory for real-time status | `project_path` (string) |
| `list_missing_controls` | Show controls that are not passing | `framework` (string) |
| `list_framework_controls` | List all controls for a framework | `framework` (string), `status_filter` (string) |
| `run_audit` | Run a full 6-scanner source code audit | `project_path` (string) |
| `generate_compliance_report` | Full compliance report with scoring | `project_name` (string), `project_type` (string), `frameworks` (string) |
| `generate_audit_report` | Audit findings + compliance scoring | `project_name` (string), `project_path` (string) |

### Fix & Implement

| Tool | Description | Parameters |
|------|-------------|------------|
| `auto_fix` | Automatically fix security findings | `project_path` (string), `dry_run` (string), `rule_ids` (string) |
| `implement_control` | Generate implementation files for a control | `control_id` (string), `project_path` (string) |
| `apply_control_override` | Mark a control as not-applicable or pass | `control_id` (string), `project_path` (string), `status` (string), `reason` (string) |
| `fix_recommendation` | Step-by-step remediation guidance | `control_id` (string), `finding_title` (string) |

### Document Generation

| Tool | Description | Parameters |
|------|-------------|------------|
| `generate_retention_policy` | Generate a data retention policy | `project_name` (string) |
| `generate_incident_response` | Generate an incident response plan | `project_name` (string) |
| `generate_risk_assessment` | Generate a risk assessment | `project_name` (string) |
| `generate_dpa` | Generate a Data Processing Agreement | `project_name` (string) |
| `generate_data_inventory` | Generate a data inventory | `project_name` (string), `project_type` (string) |
| `generate_processing_records` | Generate Article 30 ROPA | `project_name` (string), `controller_name` (string) |

### Governance Provenance

| Tool | Description | Parameters |
|------|-------------|------------|
| `create_governance_record` | Create a governance provenance record | `project_path` (string), `system_name` (string), `system_type` (string), `risk_level` (string) |
| `approve_governance_record` | Record an approval decision | `project_path` (string), `record_id` (string), `approver_name` (string), `decision` (string) |
| `add_governance_evidence` | Attach an evidence reference | `project_path` (string), `record_id` (string), `title` (string), `source_system` (string), `reference` (string) |
| `list_governance_records` | List all governance records | `project_path` (string) |
| `get_governance_record` | Get full provenance chain | `project_path` (string), `record_id` (string) |
| `verify_governance_record` | Verify provenance completeness | `project_path` (string), `record_id` (string) |
| `set_governance_risk_assessment` | Link a risk assessment | `project_path` (string), `record_id` (string), `assessor` (string), `methodology` (string), `risk_score` (string) |
| `set_governance_policy_basis` | Document policy basis | `project_path` (string), `record_id` (string), `policy_name` (string), `standard` (string) |
| `set_governance_review_cycle` | Set periodic review | `project_path` (string), `record_id` (string), `frequency` (string), `next_review` (string) |
| `set_governance_data_inventory` | Document data inventory | `project_path` (string), `record_id` (string) |
| `set_governance_committee` | Record committee approval | `project_path` (string), `record_id` (string) |
| `set_governance_compliance_links` | Map compliance frameworks | `project_path` (string), `record_id` (string), `frameworks` (string) |

See the [Governance guide](../user-guide/governance.md) for the full provenance chain workflow.

---

## `check_compliance`

Returns the compliance score for a given project type, showing which policy packs apply and their control status.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_type` | string | No | Project type (default: `saas`) |

**Valid `project_type` values:**

`saas`, `ai-application`, `mcp-server`, `blockchain`, `wallet`, `government-system`, `healthcare-system`, `event-platform`, `photo-storage-platform`, `vulnerability-scanner`, `generic-web-application`, `api-backend`, `mobile-application`

### Prompts to Try

=== "Basic Check"

    ```
    Are we GDPR compliant?
    ```

    The assistant calls `check_compliance` with `project_type: "saas"` (default).

=== "Specific Project Type"

    ```
    Check compliance status for a healthcare application.
    ```

    The assistant calls `check_compliance` with `project_type: "healthcare-system"`.

=== "AI Application"

    ```
    I'm building an AI application. What's our compliance posture?
    ```

    The assistant calls `check_compliance` with `project_type: "ai-application"`.

=== "Blockchain Project"

    ```
    We have a blockchain wallet project. Check our compliance.
    ```

    The assistant calls `check_compliance` with `project_type: "wallet"`.

**Example response:**

```
  GDPR ................ 72%
  OWASP ............... 65%
  CIS ................. 80%
  NIST ................ 58%
  Overall ............. 69%
```

---

## `list_missing_controls`

Shows compliance controls that are not in a passing state for a given framework.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `framework` | string | No | Framework name (default: `GDPR`) |

**Valid `framework` values:** `GDPR`, `OWASP`, `CIS`, `NIST`

### Prompts to Try

=== "GDPR Gaps"

    ```
    Show me missing GDPR controls.
    ```

    The assistant calls `list_missing_controls` with `framework: "GDPR"`.

=== "OWASP Gaps"

    ```
    What OWASP controls are we failing?
    ```

    The assistant calls `list_missing_controls` with `framework: "OWASP"`.

=== "CIS Controls"

    ```
    List missing CIS controls for our project.
    ```

    The assistant calls `list_missing_controls` with `framework: "CIS"`.

=== "NIST Posture"

    ```
    What NIST CSF controls do we need to implement?
    ```

    The assistant calls `list_missing_controls` with `framework: "NIST"`.

**Example response:**

```
- [CRITICAL] GDPR-ART32-002: Encryption at Rest
  Implement AES-256-GCM encryption for all stored personal data.

- [CRITICAL] GDPR-ART32-006: Audit Logging
  Implement audit trail for all access to personal data.

- [HIGH] GDPR-ART32-005: Automatic Session Timeout
  Configure automatic session expiration after 30 minutes of inactivity.

- [HIGH] GDPR-ART5-005: Storage Limitation
  Implement a data retention policy with defined retention periods.
```

---

## `generate_retention_policy`

Generates a data retention policy template with standard retention periods aligned to GDPR Article 5(1)(e) storage limitation principle.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a retention policy for My SaaS App.
    ```

=== "Contextual"

    ```
    We're building a SaaS platform called "CloudMetrics" that stores
    user data, billing records, and audit logs. Generate a retention
    policy that covers all these data categories.
    ```

=== "Post-Audit"

    ```
    Our GDPR compliance check showed we're missing a retention policy.
    Generate one for our project "DataVault".
    ```

**What the generated policy includes:**

- Purpose and scope
- Data categories with specific retention periods
- Disposal procedures
- Legal basis references
- Review schedule

---

## `generate_incident_response`

Generates an incident response plan template with severity levels, response procedures, and GDPR breach notification timelines (72-hour requirement from Article 33).

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate an incident response plan for Project Alpha.
    ```

=== "Contextual"

    ```
    Our healthcare platform "MedTrack" handles patient data.
    Create an incident response plan that covers GDPR breach
    notification requirements and HIPAA considerations.
    ```

=== "Emergency Preparation"

    ```
    We need to prepare for potential data breaches. Generate
    a comprehensive incident response plan for "SecurePay"
    that includes the 72-hour GDPR notification timeline.
    ```

**What the generated plan includes:**

- Severity classification (Critical, High, Medium, Low)
- Response team roles and responsibilities
- Detection and triage procedures
- Containment and eradication steps
- GDPR Article 33 notification timeline (72 hours)
- GDPR Article 34 data subject communication
- Post-incident review template

---

## `generate_risk_assessment`

Generates a risk assessment template with common risk categories, likelihood/impact ratings, and mitigation strategies.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a risk assessment for our healthcare platform.
    ```

=== "Contextual"

    ```
    We process payment card data and personal information in
    our e-commerce platform "ShopSecure". Generate a risk
    assessment covering data breach, unauthorized access, and
    compliance violation scenarios.
    ```

=== "Post-Compliance Check"

    ```
    Our compliance check showed several failing controls.
    Generate a risk assessment for "DataVault" that accounts
    for our current compliance gaps.
    ```

**What the generated assessment includes:**

- Risk register with categories (operational, technical, compliance, legal)
- Likelihood and impact ratings (1-5 scale)
- Risk score matrix
- Mitigation strategies per risk
- Residual risk acceptance
- Review schedule

---

## `generate_dpa`

Generates a Data Processing Agreement template based on GDPR Article 28 requirements. A DPA is the legally required contract between a data controller and data processor.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Your project name (default: `Project`) |

### Prompts to Try

=== "Simple"

    ```
    Generate a Data Processing Agreement for Customer Portal.
    ```

=== "Vendor Relationship"

    ```
    We're hiring a cloud provider to process customer data for
    "DataVault". Generate a DPA that covers Article 28 requirements
    including sub-processor management and data deletion obligations.
    ```

=== "Multi-Party"

    ```
    Generate a DPA for our platform "CloudMetrics" where we act
    as both a data controller (for our own users) and a data
    processor (for our enterprise customers' data).
    ```

**What the generated DPA includes:**

- Parties and roles (controller, processor, sub-processor)
- Processing scope and purposes
- Data subject rights handling
- Security measures (Article 32)
- Breach notification obligations
- Sub-processor management
- Data deletion and return
- Audit rights
- Liability and indemnification

---

## `check_project_status`

Reads the actual `.ges/` directory in your project to report real-time compliance status, scores, configuration, and overrides. Unlike `check_compliance` (which uses templates), this tool reads your project's actual files.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_path` | string | Yes | Absolute path to the project root |

### Prompts to Try

=== "Basic Check"

    ```
    What's the current compliance status of my project?
    ```

    The assistant calls `check_project_status` with `project_path` set to your project directory.

=== "After Audit"

    ```
    I just ran ges audit. Show me the updated project status.
    ```

=== "Score Check"

    ```
    What's our current compliance score from the .ges directory?
    ```

**What the response includes:**

- Project name, type, and configured frameworks
- Current compliance scores from `.ges/score.json`
- Active control overrides from `.ges/control-overrides.json`
- Framework version

---

## `list_framework_controls`

Lists all controls for a given framework with their status, severity, category, and implementation guidance.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `framework` | string | Yes | Framework name: `GDPR`, `OWASP`, `CIS`, `NIST` |
| `status_filter` | string | No | Filter by status: `pass`, `fail`, `warning`, `not-implemented`, `not-applicable` |

### Prompts to Try

=== "All GDPR Controls"

    ```
    List all GDPR controls with their status.
    ```

=== "Failed Controls Only"

    ```
    Show me only the failing OWASP controls.
    ```

    The assistant calls `list_framework_controls` with `framework: "OWASP"` and `status_filter: "fail"`.

=== "NIST Overview"

    ```
    Give me a full breakdown of all NIST controls.
    ```

---

## `run_audit`

Runs a full source code audit using 6 scanners (secrets, crypto, code security, authentication, configuration, database) against your project. Returns findings with severity, file locations, evidence, and fix suggestions.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_path` | string | Yes | Absolute path to the project root |

### Prompts to Try

=== "Full Audit"

    ```
    Run a security audit on /path/to/my/project.
    ```

=== "What's Wrong"

    ```
    Scan my project for security issues and compliance problems.
    ```

=== "Pre-Deploy Check"

    ```
    Audit /path/to/my/project before we deploy. Show me all critical
    and high severity findings.
    ```

**What the audit checks:**

| Scanner | What It Detects |
|---------|----------------|
| Secrets Scanner | Hardcoded passwords, API keys, connection strings, private keys, JWTs |
| Cryptographic Scanner | MD5, SHA1, weak AES, disabled TLS verification |
| Code Security Scanner | SQL injection, XSS, eval/code injection |
| Authentication Scanner | Routes without auth, missing rate limiting, no session timeout, wildcard CORS, no MFA |
| Configuration Scanner | Missing helmet/CORS, secrets in .env, Docker as root, missing .gitignore, no logging |
| Database Scanner | Missing timestamps, soft delete, user audit columns, no audit model |

---

## `generate_compliance_report`

Generates a comprehensive compliance report with executive summary, framework scores, risk assessment, and recommendations — without scanning source code.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Project name for the report title |
| `project_type` | string | No | Project type (default: `generic-web-application`) |
| `frameworks` | string | No | Comma-separated framework names (default: `GDPR,OWASP,CIS,NIST`) |

### Prompts to Try

=== "Full Report"

    ```
    Generate a full compliance report for my SaaS application "CloudMetrics"
    covering GDPR, OWASP, CIS, and NIST.
    ```

=== "GDPR Only"

    ```
    Generate a GDPR compliance report for our healthcare platform "MedTrack".
    ```

=== "Executive Summary"

    ```
    Create an executive compliance summary for our blockchain wallet project.
    ```

---

## `generate_audit_report`

Combines real source code audit findings with compliance scoring into a single report. This is the most comprehensive report — it both scans your code and evaluates compliance.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Project name for the report |
| `project_path` | string | Yes | Absolute path to the project root |

### Prompts to Try

=== "Full Audit Report"

    ```
    Audit /path/to/my/project and generate a complete audit report
    with findings and compliance scoring.
    ```

=== "Pre-Audit Preparation"

    ```
    We have a GDPR audit next week. Run a full audit on /path/to/project
    and generate an audit report we can present.
    ```

---

## `auto_fix`

Scans your project for security findings and automatically applies fixes to source code files. Supports dry-run mode to preview changes before applying them. Covers 15 rule types across 7 programming languages.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_path` | string | Yes | Absolute path to the project root |
| `dry_run` | string | No | `"true"` to preview changes without applying (recommended first) |
| `rule_ids` | string | No | Comma-separated rule IDs to fix (e.g., `CONFIG-001,AUTH-002`). Omit to fix all. |

### What Auto-Fix Can Fix (15 Rule Types)

| Rule | Fix Applied |
|------|------------|
| `CONFIG-001` | Security headers middleware (helmet/django-csp/tracing) |
| `CONFIG-002` | CORS configuration with environment-based origins |
| `CONFIG-004` | Add `.env` to `.gitignore` |
| `CONFIG-005` | Add non-root `USER` to Dockerfile |
| `CONFIG-007` | Re-enable TLS verification |
| `CONFIG-008` | Create `.gitignore` with security entries |
| `CONFIG-009` | Add missing entries to `.gitignore` |
| `CONFIG-010` | Create logger with structured audit logging |
| `SECRETS-001` | Extract hardcoded secrets to `.env`, replace with env vars |
| `CRYPTO-001` | Replace MD5/SHA1 with SHA-256 |
| `CRYPTO-003` | Create Argon2id password hashing utility |
| `AUTH-002` | Add rate limiting middleware |
| `AUTH-003` | Add session timeout configuration |
| `AUTH-004` | Replace CORS wildcard with environment-configured origins |
| `DB-001/002/003` | Add audit columns (timestamps, soft delete, user audit) |
| `DB-004` | Add Audit model/table |

### Supported Languages

| Language | Frameworks |
|----------|-----------|
| JavaScript/TypeScript | Express, Fastify, Koa, Hono, Next, NestJS, SvelteKit |
| Python | Django, Flask, FastAPI, Sanic |
| Go | Gin, Fiber, Echo, Chi, Gorilla, net/http |
| Java | Spring, Ktor, Quarkus, Micronaut |
| Ruby | Rails, Sinatra |
| PHP | Laravel, Symfony, Slim, Lumen |
| Rust | Actix-web, Axum, Rocket, Warp |

### Prompts to Try

=== "Preview Changes (Recommended First)"

    ```
    Run a dry-run auto-fix on /path/to/my/project. Show me what
    would change without actually modifying anything.
    ```

    The assistant calls `auto_fix` with `dry_run: "true"`.

=== "Apply All Fixes"

    ```
    Scan /path/to/my/project and auto-fix all security issues
    you can fix automatically.
    ```

=== "Fix Specific Rules"

    ```
    Fix only the secrets and rate limiting issues in /path/to/my/project.
    ```

    The assistant calls `auto_fix` with `rule_ids: "SECRETS-001,AUTH-002"`.

=== "Express App"

    ```
    My Express.js app at /path/to/app has no security headers,
    no CORS config, and hardcoded secrets. Auto-fix everything.
    ```

=== "Rust Project"

    ```
    Scan my Actix-web project at /path/to/rust-app and auto-fix
    what you can.
    ```

=== "Preview Then Apply"

    ```
    First, dry-run auto-fix on /path/to/my/project. Then, if it
    looks safe, apply the fixes.
    ```

    The assistant calls `auto_fix` twice — first with `dry_run: "true"`, then without.

**What the response includes:**

- Total findings before fix
- Auto-fixable findings count
- Actions applied (file modifications, new files created)
- Manual review items (issues that cannot be auto-fixed)
- npm/cargo/pip install guidance for new dependencies

---

## `implement_control`

Generates production-ready implementation files for a specific compliance control. Detects your project's language and framework, then generates appropriate code.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `control_id` | string | Yes | Control ID (e.g., `GDPR-ART32-002`, `GDPR-ART32-004`) |
| `project_path` | string | Yes | Absolute path to the project root |

### Supported Controls

| Control | What Gets Generated |
|---------|-------------------|
| `GDPR-ART32-002` (Encryption at Rest) | AES-256-GCM encrypt/decrypt utility |
| `GDPR-ART32-003` (Encryption in Transit) | TLS/HTTPS redirect middleware |
| `GDPR-ART32-004` (User Identification) | Argon2id password hashing utility |
| `GDPR-ART32-005` (Session Timeout) | Session expiration configuration |
| `GDPR-ART32-006` (Audit Logging) | Structured audit logger |
| `GDPR-ART32-007` (Integrity Controls) | SHA-256 integrity verification |
| `GDPR-ART32-008` (Backup & Recovery) | Encrypted backup script |
| `GDPR-ART32-009` (Security Testing) | CI/CD security scan workflow |

### Prompts to Try

=== "Encryption"

    ```
    Implement encryption at rest for GDPR-ART32-002 in /path/to/my/project.
    ```

=== "Auth Module"

    ```
    Generate a password hashing module for GDPR-ART32-004
    in /path/to/my/project.
    ```

=== "Audit Logger"

    ```
    Create an audit logging module for my project at /path/to/my/project
    to satisfy GDPR-ART32-006.
    ```

=== "Security Testing CI"

    ```
    Implement security testing for GDPR-ART32-009 — generate
    a CI/CD workflow for /path/to/my/project.
    ```

=== "All Controls"

    ```
    Implement GDPR-ART32-002, GDPR-ART32-004, and GDPR-ART32-006
    for /path/to/my/project.
    ```

---

## `apply_control_override`

Marks a compliance control as `not-applicable` or `pass` in `.ges/control-overrides.json`. This is useful when a control doesn't apply to your project or has been manually verified.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `control_id` | string | Yes | Control ID (e.g., `GDPR-ART32-001`) |
| `project_path` | string | Yes | Absolute path to the project root |
| `status` | string | Yes | New status: `not-applicable` or `pass` |
| `reason` | string | No | Reason for the override |

### Prompts to Try

=== "Not Applicable"

    ```
    Mark GDPR-ART32-001 as not-applicable for /path/to/my/project
    because we don't pseudonymize data — we don't store personal data at all.
    ```

=== "Manually Verified"

    ```
    Mark OWASP-ASVS-003 as pass for /path/to/my/project —
    we manually verified our authentication implementation.
    ```

=== "Bulk Override"

    ```
    Mark GDPR-ART33-001 and GDPR-ART33-002 as not-applicable
    for /path/to/my/project — we're an internal tool with no data subjects.
    ```

---

## `fix_recommendation`

Provides step-by-step remediation guidance for a specific compliance control or finding. Gives implementation steps, code examples, and verification procedures.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `control_id` | string | No | Control ID (e.g., `GDPR-ART32-002`, `OWASP-AUTH-001`) |
| `finding_title` | string | No | Title of a specific audit finding to get fix guidance for |

### Prompts to Try

=== "Control Guidance"

    ```
    How do I fix GDPR-ART32-002 (encryption at rest)?
    ```

=== "Finding Guidance"

    ```
    I have a finding about hardcoded API keys. How do I fix it?
    ```

=== "Step by Step"

    ```
    Give me step-by-step guidance to implement CIS-002
    (software inventory / SBOM).
    ```

---

## `generate_data_inventory`

Generates a data inventory document listing data categories, classifications, retention periods, and legal basis. Required for GDPR Article 30 compliance.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Project name |
| `project_type` | string | No | Project type (affects data categories) |

### Prompts to Try

=== "Basic"

    ```
    Generate a data inventory for our SaaS application "CloudMetrics".
    ```

=== "AI Application"

    ```
    We're building an AI application that processes user prompts and
    generates content. Generate a data inventory covering all data
    categories including training data and model outputs.
    ```

=== "Healthcare"

    ```
    Generate a data inventory for our healthcare platform "MedTrack"
    that includes patient data, medical records, and appointment data.
    ```

---

## `generate_processing_records`

Generates Article 30 Records of Processing Activities (ROPA). Documents all processing activities, purposes, data categories, recipients, and retention periods.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_name` | string | No | Project name |
| `controller_name` | string | No | Data controller organization name |

### Prompts to Try

=== "Basic"

    ```
    Generate processing records (ROPA) for "CloudMetrics" with
    controller "CloudMetrics Inc."
    ```

=== "Multi-Processor"

    ```
    Generate Article 30 processing records for our platform "DataVault"
    where we use AWS for hosting, Stripe for payments, and SendGrid
    for emails. Controller is "DataVault GmbH".
    ```

---

## Combining Tools — Real-World Prompt Patterns

AI assistants can call multiple tools in sequence. Here are compound prompts that chain tools together for real-world compliance workflows:

### Pattern 1: New Project Compliance Kickoff

```
I'm starting a new SaaS platform called "CloudMetrics" that will
process EU user data. Check our compliance status, show what's
missing for GDPR, and generate a risk assessment.
```

The assistant will:
1. Call `check_compliance` with `project_type: "saas"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `generate_risk_assessment` with `project_name: "CloudMetrics"`

### Pattern 2: Pre-Audit Document Package

```
We have an upcoming GDPR audit for "DataVault". Generate all
the documents we'll need: retention policy, incident response
plan, risk assessment, and a DPA template.
```

The assistant will call all 4 generation tools with `project_name: "DataVault"`.

### Pattern 3: Gap Analysis and Remediation Plan

```
Check compliance for our healthcare application. Then show me
what's missing for both GDPR and NIST frameworks, and generate
a risk assessment that accounts for those gaps.
```

The assistant will:
1. Call `check_compliance` with `project_type: "healthcare-system"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `list_missing_controls` with `framework: "NIST"`
4. Call `generate_risk_assessment` with `project_name: "MedTrack"`

### Pattern 4: Vendor Onboarding

```
We're onboarding a new payment processor for "ShopSecure".
Check our compliance, generate a DPA, and create a risk
assessment for the vendor relationship.
```

### Pattern 5: Incident Preparation

```
We had a near-miss security incident today. Check our current
compliance posture, generate an incident response plan, and
create a risk assessment for our platform "SecurePay".
```

### Pattern 6: Auto-Fix Dry Run + Apply

```
Run a dry-run auto-fix on /path/to/my/project. Review the
proposed changes, then apply them. After that, generate an
audit report.
```

The assistant will:
1. Call `auto_fix` with `dry_run: "true"`
2. Call `auto_fix` without dry_run (applies fixes)
3. Call `generate_audit_report` to show the improved state

### Pattern 7: Full Remediation Workflow

```
Audit /path/to/my/project, auto-fix everything you can,
implement the remaining GDPR encryption controls, then
generate a compliance report.
```

The assistant will:
1. Call `run_audit` to scan the project
2. Call `auto_fix` to fix what's auto-fixable
3. Call `implement_control` for controls that need manual implementation
4. Call `generate_compliance_report` to show the updated posture

### Pattern 8: Gap Analysis + Fix + Override

```
Check compliance for our SaaS platform, show missing GDPR
controls, auto-fix the code issues, implement the encryption
control, and mark the pseudonymisation control as
not-applicable since we don't store raw personal data.
```

The assistant will:
1. Call `check_compliance` with `project_type: "saas"`
2. Call `list_missing_controls` with `framework: "GDPR"`
3. Call `auto_fix` on the project
4. Call `implement_control` for encryption
5. Call `apply_control_override` for pseudonymisation

### Pattern 9: Pre-Deploy Security Gate

```
We're about to deploy /path/to/my/project. Run a full audit,
dry-run auto-fix to see what can be improved, show me the
critical findings that MUST be fixed before deploy, and
generate an audit report.
```

### Pattern 10: New Project Full Setup

```
We're starting a new SaaS platform called "CloudMetrics".
Check our initial compliance status, show all missing controls
across GDPR, OWASP, CIS, and NIST, generate all policy
documents, and auto-fix our codebase for security issues.
```

---

## Prompt Writing Tips

### Good Prompts

| Prompt | Why It Works |
|--------|-------------|
| "Check compliance for a SaaS application" | Specific project type triggers accurate results |
| "Show missing GDPR controls" | Explicit framework name avoids ambiguity |
| "Generate a DPA for DataVault" | Project name personalizes the document |
| "Check compliance, show missing OWASP controls, and generate a risk assessment for CloudMetrics" | Compound prompt chains multiple tools |

### Bad Prompts

| Prompt | Why It Fails |
|--------|-------------|
| "Is everything ok?" | Too vague — no compliance context |
| "Tell me about security" | No specific question for a tool to answer |
| "Fix my code" | Too vague — specify the project path and whether you want `auto_fix` or `implement_control` |

### Getting the Best Results

1. **Always name your project** — Generated documents use the project name
2. **Specify the project type** — "SaaS", "healthcare", "blockchain" — for accurate compliance checks
3. **Name the framework** — "GDPR", "OWASP", "CIS", "NIST" — for targeted control analysis
4. **Chain requests** — Ask for compliance check + gap analysis + document generation in one prompt
5. **Be specific about context** — "We process healthcare data" produces better risk assessments than "generate a risk assessment"

!!! example "Exercise: Test Every Tool Individually"

    In your AI assistant, try each tool one at a time. Record the response:

    | # | Prompt Used | Tool Called | Response Quality (1-5) |
    |---|-------------|------------|----------------------|
    | 1 | "Are we GDPR compliant?" | | |
    | 2 | "Show missing OWASP controls" | | |
    | 3 | "Show missing NIST controls" | | |
    | 4 | "Show missing CIS controls" | | |
    | 5 | "Generate a retention policy for MyApp" | | |
    | 6 | "Generate an incident response plan for MyApp" | | |
    | 7 | "Generate a risk assessment for MyApp" | | |
    | 8 | "Generate a DPA for MyApp" | | |
    | 9 | "Generate a data inventory for MyApp" | | |
    | 10 | "Generate processing records for MyApp" | | |
    | 11 | "List all GDPR controls with status" | | |
    | 12 | "Run an audit on /path/to/project" | | |
    | 13 | "Generate a compliance report for MyApp" | | |
    | 14 | "Dry-run auto-fix on /path/to/project" | | |
    | 15 | "Implement GDPR-ART32-002 for /path/to/project" | | |
    | 16 | "Mark GDPR-ART32-001 as not-applicable" | | |
    | 17 | "How do I fix CONFIG-001?" | | |

    !!! question "Questions"
        - Which tool produces the most detailed response?
        - Which tool would be most useful during a real audit?
        - Did the assistant always call the correct tool, or did it sometimes answer without using a tool?

!!! example "Exercise: Compound Prompt Progression"

    Start with a simple prompt, then add complexity. See how the assistant handles each:

    **Round 1 — Single tool:**
    ```
    Check compliance for a SaaS application.
    ```

    **Round 2 — Two tools:**
    ```
    Check compliance for a SaaS application called "CloudMetrics"
    and show missing GDPR controls.
    ```

    **Round 3 — Three tools:**
    ```
    Check compliance for a SaaS application called "CloudMetrics",
    show missing GDPR controls, and generate a risk assessment.
    ```

    **Round 4 — Full workflow:**
    ```
    I'm building a SaaS platform called "CloudMetrics".
    Check our compliance, show missing controls for GDPR,
    OWASP, and NIST, then generate a retention policy,
    incident response plan, and DPA.
    ```

    Observe:
    - How many tool calls does the assistant make in each round?
    - Does the assistant maintain context between calls?
    - Does the compound prompt produce better results than individual calls?

!!! example "Exercise: Multi-Tool Workflow"

    Ask your AI assistant to perform a complete compliance check with a single prompt:

    ```
    I'm building a healthcare application called "MedTrack".
    Check compliance for healthcare-system type, list all
    missing GDPR controls, and generate both a risk assessment
    and a data processing agreement.
    ```

    Observe how the assistant chains multiple tool calls together.

!!! example "Exercise: Prompt Engineering Challenge"

    Try to trigger all 17 tools with a single prompt:

    ```
    We're launching "SecureBank", a financial SaaS platform at
    /path/to/project. We need a full compliance review: check our
    status, show every missing control across all frameworks, run
    a source code audit, dry-run auto-fix, generate all policy
    documents (retention, incident response, risk assessment, DPA,
    data inventory, processing records), and generate a full
    audit report.
    ```

    Count:
    - How many tool calls did the assistant make?
    - Were all 17 tools called?
    - Which tools were missed, if any?

!!! example "Exercise: Wrong Project Type Experiment"

    Try checking compliance with different project types and compare:

    ```
    Check compliance for a blockchain wallet project.
    ```

    vs

    ```
    Check compliance for a government system.
    ```

    vs

    ```
    Check compliance for a SaaS application.
    ```

    !!! question "Questions"
        - How do the policy packs differ between project types?
        - Which project type has the most controls to satisfy?
        - Which controls are common across all project types?

!!! example "Exercise: Document Quality Comparison"

    Generate the same document twice with different context:

    **Without context:**
    ```
    Generate a risk assessment for MyApp.
    ```

    **With context:**
    ```
    We run "MyApp", a photo storage platform that processes
    biometric data (face detection), stores images in S3, uses
    AI for image tagging, and serves EU customers. Generate
    a risk assessment covering all these specific areas.
    ```

    Compare the two outputs — does context improve the quality?

!!! example "Exercise: Auto-Fix Workflow"

    This exercise tests the full audit → fix → verify workflow:

    **Step 1 — Audit:**
    ```
    Run an audit on /path/to/my/project and show me all findings.
    ```

    **Step 2 — Preview fixes:**
    ```
    Dry-run auto-fix on /path/to/my/project. Show me exactly what
    would change without modifying anything.
    ```

    **Step 3 — Apply fixes:**
    ```
    Apply auto-fix to /path/to/my/project. Fix only CONFIG-001,
    CONFIG-002, AUTH-002, and SECRETS-001.
    ```

    **Step 4 — Implement remaining controls:**
    ```
    Implement GDPR-ART32-002 (encryption), GDPR-ART32-006 (audit
    logging), and GDPR-ART32-004 (user identification) for
    /path/to/my/project.
    ```

    **Step 5 — Verify:**
    ```
    Run a new audit on /path/to/my/project and generate an audit
    report to see how the compliance score improved.
    ```

    !!! question "Questions"
        - How many findings were there before vs after auto-fix?
        - Which findings required manual review vs were auto-fixed?
        - Did the compliance score improve after the fixes?
        - Which controls still need manual implementation?

### `run_inference`

Run AI-powered inference on GESF compliance data. Analyzes audit findings (clustering + deduplication), identifies root causes via graph analysis, detects score anomalies, and predicts compliance trends.

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `project_path` | string | No | Project root path (defaults to CWD) |

**Returns:** Structured report with four sections — Finding Clustering, Root Cause Analysis, Score Anomalies, and Trend Predictions.

**Example prompt:**

```
Run AI inference on my project and tell me:
1. What is the root cause of most findings?
2. Are my compliance scores trending up or down?
3. Should I be concerned about any anomalies?
```

**Example exercise:**

```
For /path/to/my/project, run AI inference and interpret the results.
Which 3 actions would have the biggest impact on our compliance score?
```

See the [AI Inference guide](../user-guide/ai-inference.md) for full documentation with output examples and interactive exercises.

!!! example "Exercise: Control Override Workflow"

    Practice marking controls that don't apply or have been manually verified:

    ```
    For /path/to/my/project, mark these controls as not-applicable:
    - GDPR-ART33-001 (breach notification to authority) — internal tool
    - GDPR-ART34-001 (breach communication to subjects) — no data subjects
    - GDPR-ART30-002 (processor records) — we are the sole processor

    And mark GDPR-ART32-003 as pass — we enforce TLS 1.3 everywhere.
    ```

    Then verify:
    ```
    Check the real-time project status for /path/to/my/project
    and show me which controls have overrides.
    ```
