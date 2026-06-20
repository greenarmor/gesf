# Fix Assignments & Provenance Tracking

The `ges assign` command links pending audit findings to governance provenance records, creating full traceability from **fix → assignee → governance record → approval → policy → evidence**. Every fix becomes accountable: who is responsible, under whose authority, and how it was resolved.

---

## Why Fix Assignments?

When `ges audit` produces a list of pending fixes, you need to know:

- **Who** is responsible for fixing each finding?
- **Which governance record** does this fix belong to?
- **Who approved** the system this fix is part of?
- **Has the fix been verified** and by whom?
- **How** was it resolved (auto-fix, manual, not-applicable)?

Without fix assignments, findings are just a list. With assignments, every finding has a **chain of accountability** that an auditor can trace.

```
Audit Finding (SECRETS-001)
    ↓
Fix Assignment (assigned to Bob Smith)
    ↓
Governance Record (Payment Processing API)
    ↓
Approval (Jane Smith, CISO, AI Ethics Board)
    ↓
Policy (InfoSec Policy v2.1, ISO 27001)
    ↓
Evidence (DPIA Report, Pen Test Report)
```

---

## Prerequisites

Before using `ges assign`, you need:

1. **An initialized project** — `ges init`
2. **Audit findings** — `ges audit` (creates `.ges/last-audit.json`)
3. **At least one governance record** — `ges governance add`

---

## Workflow

### Step 1: Run an Audit

```bash
ges audit
```

This produces findings and saves them to `.ges/last-audit.json`.

### Step 2: Create a Governance Record

```bash
ges governance add --name "Payment Processing API" --type api --risk high \
    --actor "Jane Smith" --actor-role "Tech Lead"
```

Enrich the record with approval, risk assessment, policy, and evidence (see the [Governance guide](governance.md) for full details).

### Step 3: Assign a Finding

**Interactive mode** (recommended for first-time use):

```bash
ges assign
```

GESF will prompt you to:

1. Select a finding from the audit results
2. Select a governance record
3. Enter the assignee name and role
4. Add optional notes
5. Enter your name for the audit trail

**CLI mode** (for scripts and automation):

```bash
ges assign \
    --finding "SECRETS-001:src/auth.ts:1" \
    --record gov-123 \
    --assignee "Bob Smith" \
    --assignee-role "Security Engineer" \
    --notes "Urgent — production key exposure" \
    --actor "Jane Smith" --actor-role "Tech Lead"
```

### Step 4: List Assignments

```bash
ges assign --list
```

Output:

```
  ╔══════════════════════════════════════════╗
  ║          Fix Assignments                  ║
  ║  Pending fixes linked to governance       ║
  ║  provenance records                       ║
  ╚══════════════════════════════════════════╝

  ○ SECRETS-001 — Hardcoded API Key
    Finding Key:        SECRETS-001:src/auth.ts:1
    Location:           src/auth.ts:1
    Governance Record:  Payment Processing API
    Assignee:           Bob Smith (Security Engineer)
    Status:             assigned
    Assigned By:        Jane Smith
    Assigned At:        6/20/2026, 12:00:00 PM
    Notes:              Urgent — production key exposure

  ────────────────────────────────────────────
  Total assignments: 1
```

### Step 5: Resolve a Fix

When the assignee completes the fix:

```bash
ges assign --resolve "SECRETS-001:src/auth.ts:1" \
    --by "Bob Smith" \
    --by-role "Security Engineer" \
    --method manual \
    --resolution-notes "Replaced with process.env, added dotenv"
```

Resolution methods:

| Method | When to use |
|--------|-------------|
| `auto-fix` | Resolved via `ges fix` |
| `manual` | Fixed manually by the assignee |
| `not-applicable` | Finding is a false positive or no longer relevant |

---

## Finding Keys

Each finding has a deterministic key in the format `ruleId:file:line`. This key is stable across re-audits, so assignments persist even when you run `ges audit` again.

**Examples:**

| Finding Key | Meaning |
|-------------|---------|
| `SECRETS-001:src/auth.ts:1` | Hardcoded API key at line 1 |
| `SQLI-001:src/auth.ts:5` | SQL injection at line 5 |
| `CONFIG-009:.gitignore:0` | Missing .env in .gitignore |

To find finding keys, run `ges assign` in interactive mode — it lists all unassigned findings with their keys.

---

## Data Storage

Assignments are stored in `.ges/fix-assignments.json`:

```json
[
  {
    "finding_key": "SECRETS-001:src/auth.ts:1",
    "finding_rule_id": "SECRETS-001",
    "finding_title": "Hardcoded API Key",
    "finding_file": "src/auth.ts",
    "finding_line": 1,
    "finding_severity": "critical",
    "finding_control_ids": ["GDPR-ART32-002", "OWASP-AUTH-001"],
    "governance_record_id": "gov-123",
    "governance_system_name": "Payment Processing API",
    "assignee": "Bob Smith",
    "assignee_role": "Security Engineer",
    "assigned_by": "Jane Smith",
    "assigned_at": "2026-06-20T12:00:00.000Z",
    "status": "assigned",
    "notes": "Urgent — production key exposure",
    "resolution": null
  }
]
```

After resolution, the `resolution` field is populated:

```json
{
  "resolution": {
    "resolved_by": "Bob Smith",
    "resolved_by_role": "Security Engineer",
    "method": "manual",
    "resolution_notes": "Replaced with process.env, added dotenv",
    "resolved_at": "2026-06-20T14:30:00.000Z"
  },
  "status": "fixed"
}
```

---

## Dashboard Integration

The web dashboard shows fix assignments inline with compliance fix cards:

1. Run `ges dashboard`
2. Navigate to the **Fixes Detail** page
3. Each fix card shows:
   - Finding details (rule, severity, file, line)
   - Assignee and assigner
   - Linked governance record with inline provenance chain
   - Status badge (assigned, in-progress, fixed, verified)
   - Resolution details (when resolved)

The provenance chain is displayed inline — no need to switch to the Governance tab:

```
  ┌──────────────────────────────────────────────────┐
  │ SECRETS-001 — Hardcoded API Key    [ASSIGNED]    │
  │ src/auth.ts:1                                    │
  │                                                   │
  │ Assignee: Bob Smith (Security Engineer)          │
  │ Assigned by: Jane Smith (Tech Lead)              │
  │                                                   │
  │ PROVENANCE CHAIN:                                 │
  │   System:    Payment Processing API (HIGH risk)   │
  │   Approval:  APPROVED by Jane Smith (CISO)        │
  │   Authority: AI Ethics Board                      │
  │   Policy:    InfoSec Policy v2.1 (ISO 27001)      │
  │   Evidence:  DPIA Report Q4 (Jira: DPIA-2026-001) │
  └──────────────────────────────────────────────────┘
```

---

## MCP Server Integration

The MCP server provides three tools for fix assignment management:

| Tool | Equivalent CLI | Description |
|------|---------------|-------------|
| `assign_fix_to_governance` | `ges assign` | Assign a finding to a governance record |
| `list_fix_assignments` | `ges assign --list` | List all fix assignments |
| `resolve_fix_assignment` | `ges assign --resolve` | Resolve a fix assignment |

AI agents (Claude, Cursor, VS Code Copilot) can call these tools to manage fix assignments programmatically. See the [MCP Tools Reference](../mcp/tools-reference.md) for details.

---

## Activity Logging

Every assignment and resolution is recorded in `.ges/activity-log.json` with full actor attribution:

```json
{
  "timestamp": "2026-06-20T12:00:00.000Z",
  "source": "cli",
  "action": "fix_assign",
  "title": "Fix assigned: SECRETS-001 → Payment Processing API",
  "description": "Assigned SECRETS-001 (Hardcoded API Key) to Bob Smith (Security Engineer), linked to governance record Payment Processing API.",
  "details": {
    "finding_key": "SECRETS-001:src/auth.ts:1",
    "governance_record_id": "gov-123",
    "assignee": "Bob Smith",
    "governance_system_name": "Payment Processing API"
  },
  "actor_name": "Jane Smith",
  "actor_role": "Tech Lead"
}
```

---

## Exercises

!!! example "Exercise 1: Assign Your First Fix"

    Set up a complete fix assignment with provenance tracking.

    1. Initialize a test project with a deliberate vulnerability:

    ```bash
    mkdir /tmp/assign-101 && cd /tmp/assign-101
    ges init --name "AssignExercise" --type saas --frameworks GDPR,OWASP
    echo 'const API_KEY = "sk-test123";' > src/auth.ts
    ```

    2. Run an audit to generate findings:

    ```bash
    ges audit
    ```

    3. Create a governance record:

    ```bash
    ges governance add --name "Test API" --type api --risk high
    ```

    4. Assign the finding interactively:

    ```bash
    ges assign
    ```

    5. Verify the assignment was created:

    ```bash
    ges assign --list
    ```

    !!! question "Questions"
        - What is the finding key for the hardcoded API key?
        - What status does the assignment have?
        - Where is the assignment stored?

!!! example "Exercise 2: Build the Full Provenance Chain"

    Using the record from Exercise 1, enrich the governance record to create a valid provenance chain.

    1. Add a risk assessment:

    ```bash
    ges governance risk-assessment <id> \
        --assessor "Your Name" \
        --methodology "NIST RMF" \
        --score "6/10" \
        --residual "medium"
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
        --approver "Jane Smith" \
        --role "CISO" \
        --decision approved \
        --authority "Security Committee" \
        --valid-until "2027-01-01"
    ```

    4. Add evidence:

    ```bash
    ges governance evidence <id> \
        --title "Security Review" \
        --source jira \
        --reference "SEC-001"
    ```

    5. Verify the chain is complete:

    ```bash
    ges governance verify <id>
    ```

    6. View the assignment — it now shows the full provenance chain:

    ```bash
    ges assign --list
    ```

    !!! question "Questions"
        - Does the provenance chain show in the assignment output?
        - What changed after the approval was recorded?
        - Can you trace: finding → assignee → record → approver → policy?

!!! example "Exercise 3: Resolve and Track"

    Resolve a fix assignment and verify the resolution is tracked.

    1. Using the assignment from Exercise 1, resolve it:

    ```bash
    ges assign --resolve "SECRETS-001:src/auth.ts:1" \
        --by "Bob Smith" \
        --by-role "Security Engineer" \
        --method manual \
        --resolution-notes "Replaced with process.env"
    ```

    2. List assignments to see the resolution:

    ```bash
    ges assign --list
    ```

    3. Check the activity log:

    ```bash
    cat .ges/activity-log.json | grep fix_resolve
    ```

    !!! question "Questions"
        - What status does the assignment have after resolution?
        - What resolution method was recorded?
        - Is the resolver's name in the activity log?

!!! example "Exercise 4: Dashboard View"

    Visualize fix assignments in the web dashboard.

    1. Start the dashboard:

    ```bash
    ges dashboard
    ```

    2. Open `http://localhost:3001` in your browser

    3. Navigate to **Fixes Detail** → **Pending Fixes**

    4. Click on a fix card to expand it

    !!! question "Questions"
        - Does the inline provenance chain appear in the fix card?
        - Can you see the assignee and assigner?
        - Is there an "Assign" button on unassigned controls?

!!! example "Exercise 5: Multi-Finding Assignment"

    Assign multiple findings to different governance records.

    1. Create a second vulnerability:

    ```bash
    echo 'db.query("SELECT * FROM users WHERE id=" + userId);' > src/db.ts
    ges audit
    ```

    2. Create a second governance record for a different system:

    ```bash
    ges governance add --name "Database Service" --type data-process --risk critical
    ```

    3. Assign the SQL injection to the new record:

    ```bash
    ges assign \
        --finding "SQLI-001:src/db.ts:1" \
        --record <new-record-id> \
        --assignee "Alice Chen" \
        --assignee-role "Backend Developer" \
        --actor "Jane Smith" --actor-role "Tech Lead"
    ```

    4. List all assignments:

    ```bash
    ges assign --list
    ```

    !!! question "Questions"
        - Are both assignments visible?
        - Do they link to different governance records?
        - Can you see different assignees for different findings?
