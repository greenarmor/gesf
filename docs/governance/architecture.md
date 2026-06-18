# Governance Provenance Chain Architecture

## The Problem

When an auditor, regulator, examiner, or compliance officer asks:

> *Who approved this system? Under which policy? When? Is it still valid? What risk assessment supported it? What evidence exists?*

...the answers are typically scattered across Jira, ServiceNow, Confluence, SharePoint, email threads, risk registers, and GRC platforms. No single system provides a **defensible, end-to-end answer**.

## The Solution

GESF's Governance Provenance Chain creates a **linked provenance record** that connects every dimension of system governance into a single, verifiable record. Rather than duplicating evidence from external systems, GESF stores **references** to evidence wherever it lives, providing a unified governance view while maintaining each system as the source of truth.

```
System → Risk Assessment → Policy Basis → Approval Decision → Evidence Chain → Review Cycle
```

## Applicability

This system applies to **any governed system type**, not limited to AI:

| System Type | Example Use Case |
|-------------|-----------------|
| `ai-system` | LLM chatbot approval, DPIA linkage |
| `application` | SaaS platform deployment, PCI-DSS approval |
| `data-process` | ETL pipeline with PII, ROPA linkage |
| `api` | Payment gateway, security review record |
| `model` | ML model card, validation evidence |
| `infrastructure` | IaC deployment, change advisory board |
| `third-party-service` | Vendor risk assessment, DPA evidence |

## Architecture

### Data Model

A single `GovernanceRecord` connects all governance dimensions:

| Dimension | Field | Type | Purpose |
|-----------|-------|------|---------|
| **System Identity** | `system_name`, `system_type`, `system_version` | string, enum | What is being governed |
| **Status** | `status` | enum | draft, pending-review, approved, rejected, conditional, expired, revoked |
| **Risk Level** | `risk_level` | enum | low, medium, high, critical |
| **Risk Assessment** | `risk_assessment` | `RiskAssessmentRef` | Assessor, methodology, score, residual risk, mitigations |
| **Policy Basis** | `policy_basis` | `PolicyBasisRef` | Policy ID, name, version, clauses, standard |
| **Approval Decision** | `approval` | `ApprovalDecision` | Approver, authority, decision, validity period, conditions |
| **Committee** | `committee` | `CommitteeApprovalRef` | Committee name, meeting, attendees, decision summary |
| **Evidence Chain** | `evidence[]` | `EvidenceRef[]` | References to Jira/Confluence/ServiceNow/etc |
| **Review Cycle** | `review_cycle` | `ReviewCycle` | Frequency, last/next review, history |
| **Data Inventory** | `data_inventory` | `GovernanceDataInventory` | PII categories, purposes, transfers, retention |
| **Compliance Links** | `compliance` | `GovernanceComplianceLinks` | Frameworks, controls satisfied, pack IDs |

### Evidence Reference Model

Evidence is **referenced, not duplicated**. Each `EvidenceRef` contains:

```typescript
{
  id: string;
  type: "document" | "ticket" | "meeting-record" | "email" | "report" | "certificate" | ...;
  title: string;
  source_system: "jira" | "servicenow" | "confluence" | "sharepoint" | "grc-platform" | ...;
  reference: string;           // Ticket ID, URL, document name — NOT the content
  location_description: string;
  added_by: string;
  added_at: string;
}
```

This means:
- Evidence stays in its source of truth (Jira ticket remains in Jira)
- GESF provides a **unified index** that links to all evidence
- No data duplication or synchronization issues
- The auditor sees WHERE to find evidence, not a copy of it

### Verification Logic

The `verifyGovernanceRecord()` function produces a `GovernanceVerificationResult` that checks:

1. **Approval exists** and is not expired
2. **Risk assessment** is linked
3. **Policy basis** is documented
4. **At least one evidence** reference is attached
5. **Review cycle** is defined (warning, not blocking)
6. **Data inventory** is complete (warning)
7. **Compliance links** are mapped (warning)
8. **Currently valid** (approval not expired + review current)

Returns:
- `valid: boolean` — true only if no blocking issues
- `issues: string[]` — blocking problems that prevent a defensible answer
- `warnings: string[]` — non-blocking concerns
- `approval_status` — valid, expired, pending, or none
- `days_until_expiry` — automatic expiry detection

## Implementation

### Storage

Governance records are stored in `.ges/governance-records.json`:

```json
[
  {
    "id": "gov-1234567890-1",
    "system_name": "Customer Support Chatbot",
    "system_type": "ai-system",
    "status": "approved",
    "risk_level": "high",
    "approval": { ... },
    "evidence": [ ... ],
    ...
  }
]
```

### CLI Commands

```bash
# Create a governance record
ges governance add --name "Payment Router" --type application --risk high

# Record an approval decision
ges governance approve <id> --approver "Jane Smith" --role "DPO" --decision approved --valid-until "2027-06-11"

# Add an evidence reference
ges governance evidence <id> --title "DPIA Report" --source confluence --reference "CONF-2026-DPIA-003"

# List all governance records
ges governance list

# Show full provenance chain
ges governance show <id>

# Verify record completeness
ges governance verify <id>

# Delete a record
ges governance delete <id>
```

### MCP Tools

| Tool | Purpose |
|------|---------|
| `create_governance_record` | Create a new governance record |
| `approve_governance_record` | Record an approval decision |
| `add_governance_evidence` | Add an evidence reference |
| `list_governance_records` | List all records with summaries |
| `get_governance_record` | Get full provenance chain |
| `verify_governance_record` | Verify completeness, return score |

### Dashboard — One-Stop Shop for Auditors

The web dashboard **Governance tab** (7th tab) is designed as a one-stop shop for examiners, auditors, and developers:

- Summary cards: total systems, approved, pending, expired/issues
- High-risk system alerts
- Expandable record cards showing the full provenance chain:
  - Verification checklist (✓/✕ for each dimension)
  - Approval decision details (approver, authority, validity, conditions)
  - Risk assessment summary
  - Policy basis
  - Evidence chain table
  - Review cycle status
  - Committee approval

### Downloadable Reports

The dashboard provides report download endpoints:

| Endpoint | Format | Audience |
|----------|--------|----------|
| `/api/report/compliance?format=markdown` | Markdown | Auditors, developers |
| `/api/report/compliance?format=html` | HTML | Auditors, executives |
| `/api/report/governance` | Markdown | Examiners, auditors |

The **Compliance Report** includes executive summary, framework scores, security findings, risk assessment, and recommendations.

The **Governance Provenance Report** includes all governance records with their full provenance chains, verification results, and evidence inventories — providing a single document that answers every auditor question.

### Actor Attribution

Activity logs and fix history entries now support optional `actor_name` and `actor_role` fields. When a developer, auditor, or examiner performs an action (audit, fix, governance change), their identity is recorded and displayed in the dashboard timeline:

- CLI commands accept `--actor` and `--role` flags
- MCP tools accept `actor_name` and `actor_role` parameters
- Dashboard Activity Log tab shows an **Actor** column with name and role
- Fix History detail cards show who applied each fix

### Controls Pack

The `governance` policy pack provides 12 controls (`GOVP-001` through `GOVP-012`) mapping GDPR articles to provenance requirements:

| Control | Article | Requirement |
|---------|---------|-------------|
| GOVP-001 | Art. 30 | System Registration |
| GOVP-002 | Art. 35 | Risk Assessment Requirement |
| GOVP-003 | Art. 5(2) | Policy Basis Documentation |
| GOVP-004 | Art. 32 | Approval Authority Chain |
| GOVP-005 | Art. 5(2) | Evidence Chain Completeness |
| GOVP-006 | Art. 35 | Committee Approval Record |
| GOVP-007 | Art. 32(1)(d) | Review Cycle Monitoring |
| GOVP-008 | Art. 25 | Approval Expiry Enforcement |
| GOVP-009 | Art. 30 | Data Inventory for Governance |
| GOVP-010 | Art. 5(2) | Compliance Framework Mapping |
| GOVP-011 | Art. 5(2) | Provenance Chain Verification |
| GOVP-012 | Art. 15 | Dashboard Auditor Access |

Install with:
```bash
ges policy install governance
```

## Auditor Workflow

1. **Open the dashboard** → Governance tab
2. **See all governed systems** with status/risk badges
3. **Click any system** to expand the provenance chain
4. **Verify completeness** via the automated checklist
5. **Trace the chain**: System → Risk → Policy → Approval → Evidence → Review
6. **Check validity**: approval not expired, review current
7. **Follow evidence references** to Jira/Confluence/ServiceNow for source documents
8. **Download reports** for offline review or regulatory submission

The auditor gets a **single defensible answer** without navigating multiple GRC platforms.
