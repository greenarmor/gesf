# Web Dashboard

The `ges dashboard` command starts a local web server that displays your project's compliance posture in a browser — live scores, findings, control status, and policy pack coverage.

## Starting the Dashboard

```bash
ges dashboard                  # Default: http://localhost:3001
ges dashboard --port 8080      # Custom port
ges dashboard --host 0.0.0.0   # Allow network access
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--port <port>` | `-p` | Port number | `3001` |
| `--host <host>` | `-h` | Host to bind to | `localhost` |

Output:

```
  GESF Web Dashboard
  ──────────────────

  Starting dashboard server...
  Project: /Users/you/my-project

  Dashboard running at: http://localhost:3001
  JSON API:             http://localhost:3001/api/data
  Health check:         http://localhost:3001/health

  Press Ctrl+C to stop.
```

Open `http://localhost:3001` in your browser to view the dashboard.

## What the Dashboard Shows

The dashboard has **five pages**, accessible via the navigation tabs at the top.

### Overview Page

The landing page with a high-level summary:

| Section | Description |
|---------|-------------|
| **Compliance Donut** | Visual percentage of passing controls (pass + not-applicable) |
| **Overall Score** | Weighted score with letter grade (A–F) |
| **Security Findings** | Count by severity (critical, high, medium, low) |
| **Framework Scores** | Per-framework score bars with grades |
| **Control Status Breakdown** | Pass / fail / warning / not-implemented / N/A counts |
| **Security Findings Detail** | Top 20 findings with rule, file, issue, and linked controls |
| **Missing Controls** | Controls not yet passing, sorted by severity |
| **Active Frameworks** | Framework tags configured for the project |

### Policy Packs Page

Lists all 10 available policy packs with drill-down detail:

- Each pack card shows score %, grade, pass/fail/warn/N-A counts, findings count, and installed status
- Packs configured in `.ges/config.json` frameworks are marked **Installed**
- Click any pack to drill down into:
  - Pack summary stats (controls, pass, findings, need-fix)
  - **Prioritized Fixes** — expandable cards with findings, fix guidance, and control checks
  - **Controls Table** — filterable by All / Failing / With Findings
  - Click any control to open a detail modal with checks, related findings, and implementation guidance

### Fixes Detail Page

Two tabs for tracking remediation:

| Tab | Description |
|-----|-------------|
| **Fix History** | Every `ges fix` (CLI) and `auto_fix` (MCP) action recorded in `.ges/fix-history.json`, with full compliance traceability: finding → fix action → controls → frameworks → severity resolved. Shows summary stats (total, applied, failed), severity breakdown, source (CLI/MCP), and expandable detail cards. |
| **Pending Fixes** | Current findings grouped by control, with fix guidance, evidence, and traceability — prioritized by severity. |

### Findings Page

Security findings from the live audit, filterable by severity:

- **All** / **Critical** / **High** / **Medium** / **Low** / **By Pack** tabs
- Each finding shows severity badge, rule ID, file:line, issue title, and fix guidance
- **By Pack** groups findings under their parent policy pack

### Traceability Page

End-to-end finding → fix → control → pack traceability:

| Tab | Description |
|-----|-------------|
| **Matrix** | Full table: Finding, Severity, File, Linked Controls, Policy Pack, Fix Guidance |
| **Prioritized Fixes** | Same detailed fix list as the Fixes page |
| **Control Coverage** | Per-pack table: total controls, pass/fail/warn/not-implemented, coverage %, findings count |

The dashboard runs a fresh audit every time you load the page, so the data is always current. Scores are recomputed live from current control statuses and findings.

## API Endpoints

The dashboard also serves machine-readable JSON:

### `GET /api/data`

Returns the full dashboard data as JSON:

```json
{
  "projectName": "My App",
  "projectType": "saas",
  "frameworks": ["GDPR", "OWASP", "CIS", "NIST"],
  "gesfVersion": "1.2.0",
  "score": {
    "overall": 98,
    "overall_grade": "A",
    "frameworks": {
      "GDPR": { "score": 100, "grade": "A", "total_controls": 22, "passed_controls": 22 },
      "OWASP": { "score": 100, "grade": "A", "total_controls": 6, "passed_controls": 6 }
    }
  },
  "controls": [...],
  "findings": [...],
  "packs": [...],
  "fixHistory": [...],
  "lastAudit": "2026-06-11T10:30:00.000Z"
}
```

### `GET /api/packs`

Returns all policy packs with summary data (score, grade, control counts, findings count, installed status).

### `GET /api/packs/:packId`

Returns detailed pack report: controls with checks, findings by control, severity/status breakdown, and prioritized fixes.

### `GET /api/packs/:packId/controls`

Returns just the controls for a specific pack.

### `GET /api/controls/:controlId`

Returns detailed control info: description, checks, status, severity, related findings, implementation guidance, and parent pack.

### `GET /api/findings/by-control/:controlId`

Returns findings linked to a specific control.

### `GET /api/fix-history`

Returns the fix history entries from `.ges/fix-history.json`.

### `GET /health`

Health check endpoint for monitoring:

```json
{
  "status": "ok",
  "timestamp": "2026-06-11T10:30:00.000Z"
}
```

### `GET /`

Renders the full HTML dashboard page.

## Reading the Dashboard

### Score Interpretation

| Letter Grade | Score Range | Status |
|-------------|------------|--------|
| A | 90-100 | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Needs improvement |
| D | 60-69 | Below standard |
| F | 0-59 | Critical risk |

### Findings by Severity

The findings panel shows how many issues were detected:

- **Critical** — Must fix before deployment (red)
- **High** — Fix in current sprint (orange)
- **Medium** — Fix soon (yellow)
- **Low** — Fix when convenient (blue)

### Control Status

The controls panel summarizes the state of all compliance controls:

- **PASS** — Control is satisfied (full credit toward score)
- **FAIL** — Control is violated (no credit)
- **WARNING** — Control is partially met (half credit)
- **NOT IMPLEMENTED** — Control has not been addressed (no credit)
- **NOT APPLICABLE** — Control does not apply (full credit, manually overridden via `ges control`)

## Using the Dashboard for Team Reviews

The dashboard is useful for:

- **Sprint planning** — Show the team current compliance posture
- **Stakeholder updates** — Visual summary for non-technical audiences
- **Audit preparation** — Quick view of what needs attention before a formal audit
- **Tracking progress** — Run the dashboard after fixing issues to see the score improve

## Stopping the Dashboard

Press `Ctrl+C` in the terminal to stop the server.

## Port Conflicts

If port 3001 is already in use:

```
  Error: Port 3001 is already in use.
  Try a different port: ges dashboard --port 3002
```

Use a different port with `--port`.

!!! tip "Network access"

    By default, the dashboard binds to `localhost` (only accessible from your machine). To allow access from other devices on your network, use `--host 0.0.0.0`. Ensure you are on a trusted network before doing this.

!!! example "Exercise: Monitor Compliance Live"

    1. Initialize a project:

    ```bash
    mkdir /tmp/dashboard-test && cd /tmp/dashboard-test
    echo '{"name":"dashboard-test","version":"1.0.0"}' > package.json
    ges init -n "Dashboard Test" -t saas -f "GDPR,OWASP"
    ```

    2. Add some security issues:

    ```bash
DB_PASSWORD: process.env.DB_PASSWORD
    echo 'const crypto = require("crypto");
    const hash = crypto.createHash("md5").update(data).digest("hex");' > src/auth.js
    ```

    3. Start the dashboard:

    ```bash
    ges dashboard
    ```

    4. Open `http://localhost:3001` in your browser

    5. Note the current score and findings count

    6. In another terminal, fix the issues:

    ```bash
    cd /tmp/dashboard-test
    echo 'const DB_PASSWORD = process.env.DB_PASSWORD;' > src/config.js
    rm src/auth.js
    ```

    7. Refresh the browser — the score should be higher and findings reduced

    8. Query the JSON API:

    ```bash
    curl http://localhost:3001/api/data | python3 -m json.tool | head -20
    ```

    9. Check the health endpoint:

    ```bash
    curl http://localhost:3001/health
    ```

    10. Press `Ctrl+C` to stop the dashboard

    !!! question "Questions"
        - How does the dashboard data change when you fix issues?
        - What is the difference between the HTML view and the JSON API?
        - When would you use the `/health` endpoint?
