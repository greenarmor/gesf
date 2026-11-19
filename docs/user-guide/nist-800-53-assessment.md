# NIST SP 800-53 Rev. 5 Control Assessment

GESF includes a complete NIST SP 800-53 Rev. 5 control assessment and GRC module: an authoritative control catalog, SP 800-53B baseline selection and tailoring, control assessments with SP 800-53A methods, evidence management, findings, a POA&M (Plan of Action and Milestones) tracker, risk recording, and assessment reports.

> **Positioning: NIST-aligned, not NIST-certified.** GESF is a NIST-aligned compliance and control assessment platform. GESF, the Green Armor team, and this module are **not** certified, accredited, endorsed, or approved by NIST. Assessment results recorded in GESF are organization-recorded conclusions; they do not constitute certification, accreditation, authorization (ATO), or a statement of compliance with NIST SP 800-53, FedRAMP, or any other scheme. Nothing produced by this module should be marketed as "NIST certified" or "NIST approved."

---

## Overview

The module implements the assessment concepts from:

- **NIST SP 800-53 Rev. 5** — Security and Privacy Controls (the control catalog)
- **NIST SP 800-53B** — Control Baselines (low / moderate / high impact)
- **NIST SP 800-53A Rev. 5** — Assessing Security and Privacy Controls (assessment objectives and methods)
- **NIST SP 800-37 Rev. 2** — Risk Management Framework (workflow concepts)
- **NIST SP 800-30 Rev. 1** — Risk assessments (organizational risk recording)

Two NIST surfaces exist in GESF and they remain distinct:

| Surface | What it is | Where |
|---|---|---|
| **NIST CSF 2.0 policy pack** (`nist`) | 23 scoring controls for the Compliance Score | `ges policy` |
| **SP 800-53 assessment module** (`ges nist`) | Full control catalog + assessment lifecycle described here | `ges nist` |

Installing the `nist-800-53` policy pack adds SP 800-53-derived controls to compliance **scoring**; the assessment module is independent and works with or without that pack.

## Control Catalog

The authoritative catalog is generated from NIST's official OSCAL content (no network connection needed at runtime) and ships as versioned data inside `@greenarmor/ges-policy-engine`.

Current snapshot (see `ges nist catalog` for live numbers and provenance):

- **20 control families** (AC through SR, including PM and PT)
- **324 base controls**
- **872 control enhancements**
- **1,196 total catalog entries**
- **2,256 assessment objectives** (SP 800-53A)
- **1,014 entries with SP 800-53A assessment methods**
- Catalog provenance: OSCAL schema 5.2.0, source `usnistgov/oscal-content`, with import date recorded in `packages/policy-engine/src/nist-catalog/data/metadata.ts`

Each catalog entry preserves the official identifier, statement, supplemental guidance, related controls, references, assessment objectives, and assessment methods where NIST publishes them. The generator (`packages/policy-engine/scripts/generate-nist-catalog.mjs`) is kept in the repository so the catalog can be regenerated when NIST publishes updates.

```bash
# Catalog statistics and provenance
ges nist catalog

# A family
ges nist catalog AC

# A control (official statement, guidance, objectives, methods)
ges nist catalog AC-2

# Enhancements accept dot or parenthesized notation
ges nist catalog ac-2.3   # -> AC-2(3)

# Free-text search
ges nist catalog -s "incident response"
```

The catalog is a **point-in-time snapshot**. It is not a live feed of NIST publications; regenerate and upgrade deliberately when NIST publishes a catalog update.

## Baseline Selection (SP 800-53B)

```bash
ges nist baseline show
ges nist baseline set moderate
ges nist baseline set low
ges nist baseline set high

# Tailored baseline from explicit control IDs
ges nist baseline set tailored --controls "AC-2,AC-3,AU-2,CA-7" --label "Org tailored"
```

Rules enforced by the module:

- **Selecting a baseline never marks controls implemented or assessed.** A baseline defines *scope*, not *status*.
- The **previous selection is preserved** in `previous_selections` — baseline changes are never silent or destructive.
- **Tailoring decisions carry over** when they still apply: exclusions, inherited controls, and compensating controls for controls still in the new baseline survive a baseline change.
- **Exclusions require documented justification**; the original NIST definition is always preserved.
- **Unknown control IDs are rejected**, never silently dropped.

```bash
ges nist baseline exclude AC-4 --justification "No physical access controls in scope for this SaaS."
ges nist baseline inherit AU-2 --from "Corporate SIEM" --description "Central audit platform"
ges nist baseline compensate CA-7 --alternative "Commercial CSPM" --description "Alternative monitoring stack"
```

## Assessment Lifecycle

The workflow follows the RMF-aligned states:

```
draft → in-progress → ready-for-assessment → under-assessment
      → assessment-completed → remediation-required → under-assessment (reassessment)
                              → closed
```

```bash
ges nist workflow          # show current state and transition history
ges nist workflow in-progress --scope "Production system boundary"
ges nist workflow under-assessment
```

Invalid transitions are rejected with the list of allowed states; every transition is recorded with actor attribution (`--actor`, `--actor-role`).

### Implementation status vs. assessment determination

These are **separate** concepts and the module never conflates them:

| Implementation status | Assessment determination |
|---|---|
| `not-implemented` | `not-assessed` |
| `planned` | `satisfied` |
| `partially-implemented` | `other-than-satisfied` |
| `implemented` | `not-applicable` |
| `alternative-implementation` | |
| `inherited` | |
| `not-applicable` | |

An implementation status of `implemented` is an **organization's claim**. A determination of `satisfied` is an **assessor's verified conclusion** that requires a rationale and at least one assessment method. GESF refuses to record `satisfied` when the implementation status is `not-implemented` or `planned`, and changing an implementation status alone can never set a determination.

### Recording assessments

```bash
# Record the implementation state (creates the assessment record)
ges nist assess AC-2 --status implemented --owner "identity-team" --assessor "Assessor A"

# Record a determination (requires --rationale and --methods)
ges nist assess AC-2 --determination satisfied \
  --rationale "Policy examined, configuration tested, admins interviewed." \
  --methods "examine,test"

# Machine-readable output
ges nist assess AC-2 --json
```

Assessment methods follow **SP 800-53A**: `examine`, `interview`, and `test` — multiple methods are encouraged. Per-objective determination results can be recorded against the catalog's assessment objectives.

## Evidence Management

```bash
ges nist evidence list
ges nist evidence add --title "Access control policy" --type policy --controls "AC-1,AC-2" \
  --url "https://wiki.example.test/ac-policy" --collected-by auditor --owner security \
  --classification internal --method export
ges nist evidence review <id> --status approved --by "lead assessor"
ges nist evidence hash <file>       # SHA-256 integrity digest
```

Rules enforced by the module:

- **Path traversal is rejected.** Local file references must resolve inside the project directory; absolute paths are refused.
- **Only http(s) URLs are accepted** (`file://` and other schemes are rejected). Evidence is never executed.
- **Approved evidence requires explicit authorization to delete** (`--force` with an `--authorized-by` record).
- **One evidence item can support multiple controls.**
- **Evidence existence is not evidence sufficiency** — sufficiency is an assessor judgment recorded in the determination rationale.
- Evidence has review status, confidentiality classification, retention, and expiry tracking (`ges nist status` surfaces items awaiting evidence; expiring items warn within a 30-day window).
- **SHA-256 hashes verify integrity against a known digest only.** A hash is not proof of authenticity or provenance.

Confidential/restricted evidence appears in reports and the dashboard **by identification metadata only** — URLs and file references are withheld.

## Findings and POA&M

```bash
# Findings
ges nist findings list
ges nist findings add --control AC-3 --title "Access enforcement gap" \
  --description "Policy not enforced on staging." --severity high

# A finding closes only after a verification assessment on the same control
# records a satisfied / not-applicable determination:
ges nist findings close <finding-id> --verification <assessment-id>
```

Fixing a source-code scanner finding **never** auto-resolves a NIST control deficiency — closure requires reassessment. Findings can reference GESF scanner finding keys (`--scanner-key`) for traceability without implying equivalence.

```bash
# POA&M
ges nist poam list
ges nist poam add --control AC-3 --title "Enforce access policy on staging" \
  --strategy "Route staging through the enforcement point." --owner platform --target 2026-09-30
ges nist poam milestone <id> --milestone-title "Ingress update" --due 2026-08-15
ges nist poam complete-milestone <id> --milestone-id <milestone-id>
ges nist poam status <id> --status in-progress
ges nist poam list --json
```

Overdue milestones and past-due target dates are detected automatically for active items and surfaced in `ges nist status`, the dashboard, and reports. POA&M statuses: `open`, `assigned`, `in-progress`, `pending-verification`, `completed`, `accepted-risk`, `closed`. Risk acceptance requires an authority and rationale; accepted risks are listed explicitly in reports.

## Risk Assessment

Risk is recorded with a **configurable organizational matrix** (default: 5×5 likelihood × impact). Scores are organizational decision aids, **not official NIST formulas** — reports label them as organizational risk decisions. A custom matrix is stored in `.ges/nist-risk-matrix.json`.

## Crosswalks

The module ships mappings between SP 800-53 catalog controls and:

- NIST CSF 2.0 outcomes (parsed from NIST's informative references in the CSF pack)
- Existing GESF policy pack controls

Mappings retain their source and are **informative references, not equivalence** — a mapping never proves compliance with another framework.

## Status and Dashboard

```bash
ges nist status
ges nist status --json
```

The web dashboard gains a **NIST** tab with:

- **Overview** — baseline, applicable/assessed/satisfied/other-than-satisfied/not-assessed counts, awaiting-evidence, open findings, open and overdue POA&M
- **Control Explorer** — filter by family, implementation status, determination, evidence, free-text search; paginated for the full catalog; per-control detail (statement, guidance, objectives, methods, evidence, findings, POA&M)
- **Evidence Explorer** — by type, classification, review status, expiry; confidential references withheld
- **POA&M view** — items with overdue highlighting and milestone progress
- **Workflow** — current state and transition history

The dashboard can select a baseline directly (`POST /api/nist/baseline/set` via the UI).

## Reports

```bash
ges nist report                    # markdown (default)
ges nist report -f html
ges nist report -f pdf
ges nist report -f json
ges nist report --assessor "Assessor A" --period-from 2026-06-01 --period-to 2026-06-30
```

Reports include: system name, scope, baseline, catalog version, assessment period, assessor, control coverage and determinations, the evidence register (sanitized), findings register, POA&M with milestones and accepted risks, and organizational risk decisions. Every report states that it reflects **recorded assessment data only** and is not a certification. Unassessed controls are listed explicitly and are never presented as satisfied.

## Data Storage

All assessment data lives in your project under version-controllable JSON:

| File | Contents |
|---|---|
| `.ges/nist-baseline.json` | Baseline selection, tailoring, previous selections |
| `.ges/nist-assessments.json` | Assessment records with full history |
| `.ges/nist-evidence.json` | Evidence register |
| `.ges/nist-findings.json` | Findings |
| `.ges/nist-poam.json` | POA&M items and milestones |
| `.ges/nist-assessment-workflow.json` | Campaign state and transition history |
| `.ges/nist-control-owners.json` | Control ownership assignments |
| `.ges/nist-risk-matrix.json` | Custom risk matrix (optional) |

Mutations are recorded in the GESF activity log with actor attribution; writes are atomic.

## Example Workflow

```bash
ges policy install nist-800-53     # optional: add SP 800-53 controls to scoring

ges nist baseline set moderate     # 1. select baseline
ges nist workflow in-progress      # 2. begin
ges nist assess AC-2 --status implemented --owner "identity-team"  # 3-4. record implementation
ges nist evidence add --title "AC policy" --type policy --controls AC-2 \
  --url "https://wiki.example.test/ac" --collected-by auditor --owner security \
  --classification internal --method export                      # 5. evidence
ges nist assess AC-2 --determination satisfied \
  --rationale "Policy examined and tested." --methods "examine,test"   # 6-7. determination
ges nist findings add --control AC-3 --title "Enforcement gap" \
  --description "Not enforced on staging." --severity high       # 8. deficiency
ges nist poam add --control AC-3 --title "Enforce on staging" \
  --strategy "Update ingress." --owner platform --target 2026-09-30    # 10-11. POA&M
ges nist assess AC-3 --status implemented --determination satisfied \
  --rationale "Remediation verified." --methods test             # 12. reassess
ges nist findings close <finding-id> --verification <assessment-id>    # 13. close
ges nist report                                                  # 14. report
```

## MCP Integration

Nine MCP tools expose the module to AI assistants: `nist_catalog_stats`, `nist_get_control`, `nist_baseline_get`, `nist_baseline_set`, `nist_assess`, `nist_status`, `nist_evidence_list`, `nist_poam_list`, and `nist_report`. Business rules (determination guards, verification requirements) live in the core module, so they cannot be bypassed by any client.

## Limitations and Assessment Responsibilities

- **The catalog is a point-in-time snapshot** of NIST OSCAL content, not a live feed. Track NIST publications and regenerate deliberately.
- **GESF does not produce passing assessments.** Determinations must be recorded by people, with rationale and methods, based on evidence they have reviewed.
- **Automated scores are not compliance statements.** A high GESF compliance score does not mean SP 800-53 compliance; unassessed is not satisfied; evidence existence is not sufficiency.
- **Crosswalks are informative.** Mapping SP 800-53 to CSF 2.0 or GESF packs does not demonstrate compliance with the mapped framework.
- **Independence requirements are yours to manage.** SP 800-53A assessor independence expectations are organizational policy, not tooling.
- **Risk scores are organizational.** The configurable matrix produces decision-support values, not official NIST risk ratings.
- **No certification claims.** GESF output must never be presented as NIST certification, accreditation, authorization, or endorsement.
