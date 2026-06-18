# Governance Provenance Chain

The `ges governance` command creates linked approval records that connect every dimension of system approval — from risk assessment to evidence to review cycles — into a single defensible chain. Designed for auditors, examiners, and developers who need to answer: **"Who approved this system? Under which authority? Is it still valid? What evidence supports the decision?"**

---

## Why Governance Provenance?

In modern organizations, approval information is scattered across Jira tickets, Confluence pages, meeting minutes, emails, and spreadsheets. When an auditor asks *"Can you prove this system was properly approved?"*, the answer requires assembling fragments from dozens of sources.

GESF solves this by creating a **single record per governed system** that links to evidence wherever it lives — without duplicating the content.

```
System Identity → Risk Assessment → Policy Basis → Approval Decision
                                                       ↓
    Review Cycle ← Evidence Chain ← Committee ← Data Inventory
                                                       ↓
                                            Compliance Links
```

The result: one command (`ges governance verify <id>`) gives you a complete, auditable answer.

---

## The Provenance Chain

Each governance record connects **9 dimensions**:

| # | Dimension | What It Captures | Required? |
|---|-----------|-----------------|-----------|
| 1 | **System Identity** | Name, type, version, description, risk level | Always |
| 2 | **Risk Assessment** | Assessor, methodology, risk score, residual risk, mitigations | Blocking if missing |
| 3 | **Policy Basis** | Policy ID, name, version, standard reference, clauses | Blocking if missing |
| 4 | **Approval Decision** | Approver, role, authority, decision, validity period, conditions | Blocking if missing |
| 5 | **Evidence Chain** | References to Jira, Confluence, ServiceNow, etc. | Blocking if empty |
| 6 | **Committee Approval** | Committee name, meeting reference, attendees, summary | Optional |
| 7 | **Review Cycle** | Frequency, next review date, review history | Warning if missing |
| 8 | **Data Inventory** | Data categories, purposes, subjects, transfers, retention | Warning if missing |
| 9 | **Compliance Links** | Frameworks, controls satisfied, pack IDs | Warning if missing |

Dimensions 1–5 are **blocking** — if any is missing, `verify` reports issues. Dimensions 6–9 are recommended; missing them produces warnings but not blocking issues.

---

## Getting Started

### Step 1 — Install the Governance Pack

```bash
ges policy install governance
```

Output:

```
  ✓ Installed policy pack: governance (12 controls)
  ✓ Dashboard will now reflect this pack's controls
```

This creates `controls/governance/controls.json` with 12 GOVP controls.

### Step 2 — Create Your First Record

```bash
ges governance add --name "Payment API" --type api --risk high
```

Output:

```
  [✓] Governance record created
      ID: gov-1718100000000-1
  ○ gov-1718100000000-1  Payment API
     Type: api  |  Risk: HIGH  |  Status: draft
     Approval: NOT RECORDED
     Evidence: 0 reference(s)
```

The record starts in `draft` status with no linked dimensions. The system assigns a unique ID — you'll use this ID for all subsequent commands.

### Step 3 — Verify (Before Enrichment)

```bash
ges governance verify gov-1718100000000-1
```

Output:

```
  ═══════════════════════════════════════════════════
  VERIFICATION: Payment API
  ═══════════════════════════════════════════════════

  Overall: ✕ ISSUES FOUND
  Approval Status: PENDING
  Evidence Count: 0

  Completeness Checklist:
    ✕ Approval Decision
    ✕ Risk Assessment
    ✕ Policy Basis
    ✕ Evidence Chain
    △ Review Cycle
    △ Data Inventory
    △ Compliance Links

  BLOCKING ISSUES:
    ✕ No approval decision recorded
    ✕ No risk assessment linked
    ✕ No policy basis documented
    ✕ No evidence references attached
```

This is expected — we haven't enriched the record yet. Let's fix that.

---

## Enriching the Provenance Chain

### Risk Assessment

Link a risk assessment to document what risks were identified and how they're mitigated:

```bash
ges governance risk-assessment gov-1718100000000-1 \
  --assessor "John Doe" \
  --methodology "NIST RMF" \
  --score "7/10" \
  --residual "medium" \
  --actor "John Doe" \
  --actor-role "Risk Analyst"
```

Output:

```
  [✓] Risk assessment linked to Payment API
      Assessor: John Doe  |  Score: 7/10  |  Residual: medium
```

### Policy Basis

Document the policy or standard under which the system is approved:

```bash
ges governance policy-basis gov-1718100000000-1 \
  --policy-name "Information Security Policy" \
  --policy-id "ISP-2024" \
  --pv "2.1" \
  --standard "ISO 27001" \
  --actor "Jane Smith" \
  --actor-role "Compliance Officer"
```

Output:

```
  [✓] Policy basis documented for Payment API
      Information Security Policy (ISP-2024 v2.1) — ISO 27001
```

!!! note "The `--pv` flag"
    The flag for policy version is `--pv` (short for "policy version"), not `--version`. This avoids a conflict with commander.js's built-in `--version` flag that prints the CLI version.

### Approval Decision

Record who approved the system, under what authority, and for how long:

```bash
ges governance approve gov-1718100000000-1 \
  --approver "Jane Smith" \
  --role "CISO" \
  --email "jane@company.com" \
  --authority "Executive Board" \
  --decision approved \
  --valid-until "2027-06-01" \
  --rationale "All critical controls verified. Risk accepted." \
  --actor "Jane Smith" \
  --actor-role "CISO"
```

Output:

```
  [✓] Approval recorded for Payment API
      Decision: APPROVED
      Approver: Jane Smith (CISO)
      Valid: 2026-06-11 → 2027-06-01
```

!!! warning "Approval Expiry"
    Always set a `--valid-until` date. The audit engine flags expired approvals as **critical** severity findings. Approvals expiring within 30 days generate a **medium** warning.

### Evidence References

Attach evidence from external systems. Evidence is **referenced, not duplicated** — you point to where the evidence lives:

```bash
ges governance evidence gov-1718100000000-1 \
  --title "DPIA Report Q2 2026" \
  --source jira \
  --reference "DPIA-2026-0042" \
  --actor "John Doe" \
  --actor-role "Risk Analyst"
```

Output:

```
  [✓] Evidence added to Payment API
      DPIA Report Q2 2026
      Source: jira  |  Ref: DPIA-2026-0042
      Total evidence: 1 reference(s)
```

You can attach multiple evidence references — each points to a different source:

=== "Jira Ticket"

    ```bash
    ges governance evidence gov-1718100000000-1 \
      --title "Security Review Ticket" \
      --source jira \
      --reference "SEC-1234"
    ```

=== "Confluence Page"

    ```bash
    ges governance evidence gov-1718100000000-1 \
      --title "Architecture Decision Record" \
      --source confluence \
      --reference "SPACE:ADR-001"
    ```

=== "ServiceNow Record"

    ```bash
    ges governance evidence gov-1718100000000-1 \
      --title "Change Advisory Board Approval" \
      --source servicenow \
      --reference "CHG0004521"
    ```

=== "External URL"

    ```bash
    ges governance evidence gov-1718100000000-1 \
      --title "Penetration Test Report" \
      --source url \
      --reference "https://security.company.com/reports/pen-test-2026"
    ```

### Review Cycle

Define how often the approval must be re-reviewed:

```bash
ges governance review-cycle gov-1718100000000-1 \
  --frequency annual \
  --next-review 2027-06-01 \
  --actor "Jane Smith" \
  --actor-role "CISO"
```

Output:

```
  [✓] Review cycle set for Payment API
      Frequency: annual  |  Next review: 2027-06-01
```

Available frequencies: `quarterly`, `semi-annual`, `annual`, `biennial`.

### Data Inventory

Document what personal data the system processes:

```bash
ges governance data-inventory gov-1718100000000-1 \
  --categories "emails,IP addresses,payment data" \
  --purposes "payment processing,analytics" \
  --retention "2 years after transaction" \
  --actor "John Doe" \
  --actor-role "Data Protection Officer"
```

This step is critical for GDPR alignment — it documents what data flows through the system and how long it's kept.

### Committee Approval

For systems requiring committee review (e.g., AI Ethics Board, Data Protection Committee):

```bash
ges governance committee gov-1718100000000-1 \
  --committee "AI Ethics Board" \
  --meeting-ref "MIN-2026-003" \
  --meeting-date "2026-05-15" \
  --actor "Board Secretary" \
  --actor-role "Secretary"
```

Interactive prompts will also ask for attendees and a decision summary.

### Compliance Links

Map the governance record to compliance frameworks:

```bash
ges governance compliance-links gov-1718100000000-1 \
  --frameworks "GDPR,OWASP,ISO 27001" \
  --controls "GDPR-ART32-001,GDPR-ART32-002,OWASP-ASVS-001" \
  --actor "Jane Smith" \
  --actor-role "Compliance Officer"
```

---

## Verifying the Complete Chain

After enriching all dimensions, verify the record:

```bash
ges governance verify gov-1718100000000-1
```

Output:

```
  ═══════════════════════════════════════════════════
  VERIFICATION: Payment API
  ═══════════════════════════════════════════════════

  Overall: ✓ VALID
  Approval Status: VALID
  Expiry: 355 days remaining
  Evidence Count: 1

  Completeness Checklist:
    ✓ Approval Decision
    ✓ Risk Assessment
    ✓ Policy Basis
    ✓ Evidence Chain
    ✓ Review Cycle
    ✓ Data Inventory
    ✓ Compliance Links
    ✓ Currently Valid
```

All dimensions green. This is the **single defensible answer** for auditors.

---

## Viewing the Full Record

To see every dimension in detail:

```bash
ges governance show gov-1718100000000-1
```

This displays the complete record including system identity, risk assessment details, policy basis, approval decision, committee, evidence chain, review cycle, data inventory, and compliance links.

---

## Listing All Records

```bash
ges governance list
```

Output:

```
  Governance Records (3):

  ● gov-001  Payment API
     Type: api  |  Risk: HIGH  |  Status: approved
     Approved by: Jane Smith (CISO)
     Valid: 2026-06-11 → 2027-06-01
     Evidence: 3 reference(s)

  ◐ gov-002  ML Recommendation Engine
     Type: ai-system  |  Risk: HIGH  |  Status: pending-review
     Approval: NOT RECORDED
     Evidence: 1 reference(s)

  ○ gov-003  Analytics Dashboard
     Type: application  |  Risk: MEDIUM  |  Status: draft
     Approval: NOT RECORDED
     Evidence: 0 reference(s)
```

Status badges: `●` approved, `◐` pending-review, `○` draft, `✕` rejected/revoked, `⚠` expired.

---

## Audit Engine Integration

When the governance pack is installed, `ges audit` automatically validates GOVP controls. The audit engine checks each governance record for missing dimensions, expired approvals, and verification failures.

```bash
ges audit
```

Findings you might see:

```
  GOVP-002 [MEDIUM]  Missing risk assessment: Analytics Dashboard
  GOVP-004 [HIGH]    Missing approval decision: ML Recommendation Engine
  GOVP-005 [HIGH]    No evidence references: Analytics Dashboard
  GOVP-008 [CRITICAL] Expired approval: Legacy Auth Service
  GOVP-011 [HIGH]    Verification failed: ML Recommendation Engine
```

**Zero governance findings** are produced when all records have complete provenance chains with valid approvals.

### GOVP Control Reference

| Control | Severity | What It Checks |
|---------|----------|----------------|
| GOVP-001 | High | At least one governance record exists |
| GOVP-002 | Medium | Risk assessment linked to each record |
| GOVP-003 | Medium | Policy basis documented for each record |
| GOVP-004 | High | Approval decision recorded for each record |
| GOVP-005 | High | At least one evidence reference attached |
| GOVP-006 | — | Committee approval (when required) |
| GOVP-007 | Low | Review cycle defined for each record |
| GOVP-008 | Critical | Approval not expired (or expiring within 30 days) |
| GOVP-009 | Low | Data inventory documented |
| GOVP-010 | Low | Compliance frameworks mapped |
| GOVP-011 | High | Verification returns no blocking issues |
| GOVP-012 | — | Dashboard governance tab accessible |

---

## Doctor Health Checks

`ges doctor` includes governance health reporting:

```bash
ges doctor
```

Output:

```
  [✓] Governance records - 3 record(s), 2 approved, 0 with blocking issues
  [!] Governance review cycles - 1 record(s) without review cycle
```

Checks performed:

- Total record count
- How many records are approved
- Records with blocking verification issues
- Expired approvals
- Records without review cycles

---

## Actor Attribution

Every governance command accepts `--actor <name>` and `--actor-role <role>` flags. These are recorded in the activity log, providing an audit trail of who performed each action:

```bash
ges governance approve gov-001 \
  --approver "Jane Smith" \
  --role "CISO" \
  --decision approved \
  --actor "Jane Smith" \
  --actor-role "CISO"
```

The activity log entry will show:

```json
{
  "action": "control_override",
  "title": "Governance approval: Payment API → approved",
  "actor_name": "Jane Smith",
  "actor_role": "CISO",
  "timestamp": "2026-06-11T14:30:00Z"
}
```

Actor attribution is **optional** — commands work without it, but existing entries are displayed in the dashboard Activity Log table.

---

## Dashboard Integration

The web dashboard includes a **Governance tab** (7th tab) that provides an auditor-facing view:

```bash
ges dashboard
```

Features:

- **Summary cards** — Total records, approved, pending, blocked
- **High-risk alerts** — Records with high/critical risk levels
- **Provenance chain cards** — Expandable cards showing the full chain for each record
- **Verification checklist** — Visual ✓/✕ for each dimension
- **Report downloads** — Compliance and governance reports in Markdown/HTML

API endpoints:

| Endpoint | Method | Returns |
|----------|--------|---------|
| `/api/governance` | GET | All governance records with summaries |
| `/api/governance/:id` | GET | Full provenance chain for a record |
| `/api/report/compliance` | GET | Compliance report (Markdown or HTML) |
| `/api/report/governance` | GET | Governance provenance report |

---

## MCP Tools

AI assistants can manage governance records through 12 MCP tools:

### Core Tools

| Tool | Description |
|------|-------------|
| `create_governance_record` | Create a new governance record |
| `approve_governance_record` | Record an approval decision |
| `add_governance_evidence` | Attach an evidence reference |
| `list_governance_records` | List all records |
| `get_governance_record` | Get full provenance chain |
| `verify_governance_record` | Verify provenance completeness |

### Enrichment Tools

| Tool | Description |
|------|-------------|
| `set_governance_risk_assessment` | Link a risk assessment |
| `set_governance_policy_basis` | Document policy basis |
| `set_governance_review_cycle` | Set up periodic review |
| `set_governance_data_inventory` | Document data inventory |
| `set_governance_committee` | Record committee approval |
| `set_governance_compliance_links` | Map compliance frameworks |

**Example prompt for AI assistants:**

> "Create a governance record for our Customer Support Chatbot. It's an AI system with high risk. Then link a risk assessment using ISO 31000 methodology, score it 6/10 with medium residual risk. Record approval from the CTO. Attach evidence from Jira ticket AI-REVIEW-001."

---

## Deleting Records

```bash
ges governance delete gov-001
```

Output:

```
  [✓] Deleted governance record: Payment API (gov-001)
```

!!! danger "Irreversible"
    Deletion is permanent. The record and all its linked dimensions are removed from `.ges/governance-records.json`. Consider keeping records for historical audit trails rather than deleting them.

---

## Storage

Governance records are stored in a single JSON file:

```
.ges/governance-records.json
```

Each record is a self-contained JSON object with all 9 dimensions. The file is an array of records — you can version-control it alongside your project.

---

## Complete Workflow Example

Here's a realistic scenario: a team deploying a new AI-powered customer support chatbot that processes personal data.

```bash
# 1. Initialize project and install governance pack
ges init --name "SupportAI" --type ai-application --frameworks GDPR,OWASP
ges policy install governance

# 2. Create governance record for the chatbot
ges governance add \
  --name "Customer Support Chatbot" \
  --type ai-system \
  --risk high \
  --desc "LLM-powered chatbot handling customer PII"

# 3. Link risk assessment (performed by security team)
ges governance risk-assessment <id> \
  --assessor "Security Team" \
  --methodology "NIST AI RMF" \
  --score "8/10" \
  --residual "medium"

# 4. Document policy basis
ges governance policy-basis <id> \
  --policy-name "AI Systems Governance Policy" \
  --policy-id "AIGOV-2024" \
  --pv "1.0" \
  --standard "GDPR Article 35"

# 5. Record approval from Data Protection Committee
ges governance approve <id> \
  --approver "Dr. Sarah Chen" \
  --role "DPO" \
  --authority "Data Protection Committee" \
  --decision conditional \
  --valid-until "2026-12-31" \
  --conditions "quarterly bias audit,human review of escalations" \
  --rationale "Approved with conditions pending first bias audit"

# 6. Attach evidence
ges governance evidence <id> \
  --title "DPIA — Customer Support Chatbot" \
  --source confluence \
  --reference "SECURITY:DPIA-CHATBOT-2026"

ges governance evidence <id> \
  --title "Bias Audit Results Q1" \
  --source jira \
  --reference "AI-AUDIT-001"

# 7. Set review cycle
ges governance review-cycle <id> \
  --frequency quarterly \
  --next-review 2026-09-30

# 8. Document data inventory
ges governance data-inventory <id> \
  --categories "names,emails,phone numbers,chat transcripts" \
  --purposes "customer support,AI training" \
  --retention "90 days for transcripts, 2 years for training data"

# 9. Map compliance frameworks
ges governance compliance-links <id> \
  --frameworks "GDPR,OWASP,AI" \
  --controls "GDPR-ART35-001,AI-001,AI-002"

# 10. Verify the complete chain
ges governance verify <id>
```

---

## Exercises

!!! example "Exercise 1: Create and Verify a Record"

    Set up a governance record for a system you work with.

    1. Initialize a test project:

    ```bash
    mkdir /tmp/gov-101 && cd /tmp/gov-101
    ges init --name "GovExercise" --type saas --frameworks GDPR,OWASP
    ges policy install governance
    ```

    2. Create a governance record:

    ```bash
    ges governance add --name "My API" --type api --risk medium
    ```

    3. Verify the record (it should have blocking issues):

    ```bash
    ges governance verify <id>
    ```

    4. How many blocking issues are there? How many warnings?

    !!! question "Questions"
        - Which 4 dimensions are blocking?
        - Which 3 dimensions produce warnings?
        - What is the record's status before any approval?

!!! example "Exercise 2: Complete the Provenance Chain"

    Using the record from Exercise 1, enrich all dimensions to achieve a valid verification.

    1. Link a risk assessment:

    ```bash
    ges governance risk-assessment <id> \
      --assessor "Your Name" \
      --methodology "ISO 31000" \
      --score "5/10" \
      --residual "low"
    ```

    2. Document a policy basis:

    ```bash
    ges governance policy-basis <id> \
      --policy-name "Security Policy" \
      --standard "ISO 27001" \
      --pv "1.0"
    ```

    3. Record an approval:

    ```bash
    ges governance approve <id> \
      --approver "Your Manager" \
      --role "CTO" \
      --authority "Engineering Leadership" \
      --decision approved \
      --valid-until "2027-12-31"
    ```

    4. Attach evidence:

    ```bash
    ges governance evidence <id> \
      --title "Code Review Record" \
      --source git \
      --reference "PR #142 — Security review"
    ```

    5. Set a review cycle:

    ```bash
    ges governance review-cycle <id> \
      --frequency annual \
      --next-review 2027-06-01
    ```

    6. Document data inventory:

    ```bash
    ges governance data-inventory <id> \
      --categories "emails,user IDs" \
      --purposes "authentication" \
      --retention "1 year"
    ```

    7. Map compliance links:

    ```bash
    ges governance compliance-links <id> \
      --frameworks "GDPR,OWASP"
    ```

    8. Verify:

    ```bash
    ges governance verify <id>
    ```

    !!! question "Questions"
        - Did verification return ✓ VALID?
        - How many days until the approval expires?
        - What happens if you run `ges audit` now — are there governance findings?

!!! example "Exercise 3: Test Approval Expiry Detection"

    Test what happens when an approval expires.

    1. Create a new record and approve it with a **past** expiry date:

    ```bash
    ges governance add --name "Legacy System" --type application --risk low
    ges governance approve <id> \
      --approver "Old Admin" \
      --role "Manager" \
      --authority "IT" \
      --decision approved \
      --valid-until "2020-01-01"
    ```

    2. Complete the other required dimensions (risk assessment, policy basis, evidence).

    3. Verify the record:

    ```bash
    ges governance verify <id>
    ```

    4. Run an audit:

    ```bash
    ges audit
    ```

    !!! question "Questions"
        - What severity does the audit engine assign to an expired approval?
        - Does verification report the approval as "expired" or "valid"?
        - What does `ges doctor` show for this record?

!!! example "Exercise 4: Audit a Multi-System Project"

    Simulate a realistic project with multiple systems at different stages.

    1. Create 3 governance records:

    ```bash
    # System A: Fully approved
    ges governance add --name "Core API" --type api --risk high
    # System B: In review, no approval yet
    ges governance add --name "ML Pipeline" --type ai-system --risk high
    # System C: Draft, nothing filled in
    ges governance add --name "Internal Wiki" --type application --risk low
    ```

    2. Fully enrich System A (complete all dimensions, approve with future date).

    3. Add risk assessment and evidence to System B, but **don't** approve it.

    4. Leave System C as a draft.

    5. Run the audit and review the governance findings:

    ```bash
    ges audit
    ```

    6. Run doctor:

    ```bash
    ges doctor
    ```

    !!! question "Questions"
        - How many governance findings did the audit produce?
        - Which GOVP rules fired for System B vs System C?
        - What does doctor report for each system?
        - Can you get the audit to show **zero** governance findings by completing all chains?

!!! example "Exercise 5: Actor Attribution Audit Trail"

    Test the actor attribution system and verify it appears in the activity log.

    1. Create a record with actor attribution:

    ```bash
    ges governance add \
      --name "Attribution Test" \
      --type api \
      --risk medium \
      --actor "Alice Anderson" \
      --actor-role "Security Engineer"
    ```

    2. Approve with a different actor:

    ```bash
    ges governance approve <id> \
      --approver "Bob Brown" \
      --role "VP Engineering" \
      --authority "Leadership" \
      --decision approved \
      --valid-until "2027-01-01" \
      --actor "Bob Brown" \
      --actor-role "VP Engineering"
    ```

    3. Check the activity log:

    ```bash
    cat .ges/activity-log.json | python3 -m json.tool
    ```

    !!! question "Questions"
        - Does the activity log show `actor_name` and `actor_role` for each action?
        - Can you see both Alice (who created) and Bob (who approved)?
        - What happens if you run a command **without** `--actor` — is the field absent or null?

!!! example "Exercise 6: Dashboard Governance View"

    Explore the governance dashboard.

    1. Start the dashboard in a project with governance records:

    ```bash
    ges dashboard --port 13580
    ```

    2. Open `http://localhost:13580` in your browser.

    3. Navigate to the **Governance** tab (7th tab).

    4. Click on a record to see its provenance chain.

    5. Try downloading a governance report.

    !!! question "Questions"
        - Does the provenance chain visualization match the CLI `show` output?
        - Can you see the verification checklist (✓/✕) for each dimension?
        - Does the activity log table show the Actor column?
