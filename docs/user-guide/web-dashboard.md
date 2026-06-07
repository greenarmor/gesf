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

The dashboard collects real-time data from your project:

| Section | Description |
|---------|-------------|
| **Project Info** | Project name, type, frameworks, GESF version |
| **Compliance Score** | Overall score with letter grade, per-framework breakdown |
| **Findings Summary** | Count by severity (critical, high, medium, low) |
| **Controls Status** | Pass/fail/warning/not-implemented counts |
| **Policy Packs** | All available packs with control counts |
| **Last Audit** | Timestamp of the last audit run |

The dashboard runs a fresh audit every time you load the page, so the data is always current.

## API Endpoints

The dashboard also serves machine-readable JSON:

### `GET /api/data`

Returns the full dashboard data as JSON:

```json
{
  "projectName": "My App",
  "projectType": "saas",
  "frameworks": ["GDPR", "OWASP"],
  "gesfVersion": "1.1.1",
  "score": {
    "overall": 72,
    "letter": "C",
    "frameworks": {
      "GDPR": { "score": 75 },
      "OWASP": { "score": 68 }
    }
  },
  "controls": [...],
  "findings": [...],
  "packs": [...],
  "lastAudit": "2026-06-07T10:30:00.000Z"
}
```

### `GET /health`

Health check endpoint for monitoring:

```json
{
  "status": "ok",
  "timestamp": "2026-06-07T10:30:00.000Z"
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

- **PASS** — Control is satisfied
- **FAIL** — Control is violated
- **WARNING** — Control is partially met
- **NOT IMPLEMENTED** — Control has not been addressed
- **NOT APPLICABLE** — Control does not apply (manually overridden via `ges control`)

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
    echo 'const DB_PASSWORD = "secret123";' > src/config.js
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
