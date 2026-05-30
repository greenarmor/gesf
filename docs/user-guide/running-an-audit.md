# Running an Audit

The `ges audit` command is the core of GESF. It scans your actual source code with 6 independent scanners and produces actionable findings linked to compliance controls.

## Basic Usage

```bash
ges audit
```

## What Happens During an Audit

1. Walks your project directory (skipping `node_modules`, `.git`, `dist`, `build`, `.ges`)
2. Reads source files (up to 1MB each, all text-based languages)
3. Runs 6 scanners:
    - **Secrets Scanner** — Hardcoded passwords, API keys, tokens, private keys
    - **Crypto Scanner** — MD5, SHA1, weak encryption, disabled TLS
    - **Code Security Scanner** — SQL injection, XSS, eval/code injection
    - **Auth Scanner** — Routes without auth, missing rate limiting, wildcard CORS
    - **Config Scanner** — Missing helmet/cors, .env secrets, Docker issues
    - **Database Scanner** — Missing audit columns, missing soft delete
4. Deduplicates findings
5. Maps findings to compliance control IDs (e.g., `GDPR-ART32-002`)
6. Updates your compliance score in `.ges/score.json`

## Example: Vulnerable Project

Given this source code:

```javascript title="src/config.js"
const DB_PASSWORD = "my-secret-password";
```

```javascript title="src/auth.js"
const crypto = require('crypto');
function hash(password) {
  return crypto.createHash('md5').update(password).digest('hex');
}
```

```javascript title="src/routes.js"
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users WHERE id = " + req.params.id);
});
```

Running `ges audit` produces:

```
  GESF Compliance Audit
  ────────────────────

  Scanning project files...
  Scanned 3 files

  ── Findings ─────────────────────

  Total findings: 4
  Critical: 3  High: 1  Medium: 0  Low: 0

  [SECRETS]
    [CRIT] Hardcoded password detected (src/config.js:1)
          DB_PASSWORD = "my-s..."

  [ENCRYPTION]
    [CRIT] MD5 hash algorithm detected (src/auth.js:3)

  [INJECTION]
    [CRIT] SQL injection via string concatenation (src/routes.js:2)

  [AUTHENTICATION]
    [HIGH] Route without auth middleware (src/routes.js:1)

  ── Compliance Score ──────────────
  GDPR ................ 42%
  OWASP ............... 55%
  Overall ............. 49%
```

## Example: Clean Project

After fixing all issues:

```javascript title="src/config.js" hl_lines="1"
const DB_PASSWORD = process.env.DB_PASSWORD;
```

```javascript title="src/auth.js" hl_lines="1-2"
const argon2 = require('argon2');
async function hash(password) {
  return argon2.hash(password);
}
```

```javascript title="src/routes.js" hl_lines="1 4"
app.get('/users', authenticate, (req, res) => {
  db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
});
```

Running `ges audit` again:

```
  GESF Compliance Audit
  ────────────────────

  Scanning project files...
  Scanned 3 files

  ── Findings ─────────────────────

  Total findings: 0
  Critical: 0  High: 0  Medium: 0  Low: 0

  ✓ No security or compliance issues found in source code.

  ── Compliance Score ──────────────
  GDPR ................ 72%
  OWASP ............... 65%
  Overall ............. 69%
```

## CI Mode

Use `--ci` for CI/CD pipelines. Exits with code **1** if critical findings exist:

```bash
ges audit --ci
echo $?  # 1 if critical findings, 0 if clean
```

## JSON Output

Use `--json` for machine-readable output:

```bash
ges audit --json
```

Returns a JSON object:

```json
{
  "findings": [
    {
      "ruleId": "secrets-hardcoded-password",
      "severity": "critical",
      "category": "secrets",
      "title": "Hardcoded password detected",
      "file": "src/config.js",
      "line": 1,
      "evidence": "password = \"***masked***\"",
      "controlIds": ["GDPR-ART32-002"],
      "fix": "Use environment variables or a secrets manager"
    }
  ],
  "score": {
    "overall": 49,
    "frameworks": { "GDPR": { "score": 42 }, "OWASP": { "score": 55 } }
  }
}
```

## Understanding Findings

Each finding contains:

| Field | Description |
|-------|-------------|
| `title` | Human-readable description of the issue |
| `severity` | `critical`, `high`, `medium`, or `low` |
| `category` | `secrets`, `encryption`, `injection`, `xss`, `authentication`, `config`, `database` |
| `file` | File path relative to project root |
| `line` | Line number where the issue was detected |
| `evidence` | The actual code snippet that triggered the finding (secrets are masked) |
| `controlIds` | Compliance control IDs this finding violates |
| `fix` | Suggested fix |

### Severity Levels

| Severity | Meaning | Required Action |
|----------|---------|----------------|
| **Critical** | Immediate security risk | Must fix before deployment |
| **High** | Significant compliance gap | Should fix in current sprint |
| **Medium** | Notable concern | Should fix soon |
| **Low** | Minor improvement | Fix when convenient |

!!! example "Exercise: Audit a Real Project"

    1. Go to one of your existing projects (or use the vulnerable demo from [Quick Start](../getting-started/quick-start.md))
    2. Run `ges audit`
    3. Count the number of findings by severity
    4. Pick the **top 3 critical** findings and fix them
    5. Re-run `ges audit` and compare the output

    !!! question "Questions to ask yourself"
        - Which scanner found the most issues?
        - Are there any findings you disagree with (false positives)?
        - Which finding would be the most dangerous if exploited?

!!! example "Exercise: Test Each Scanner Individually"

    Create a test file that triggers each scanner exactly once:

    ```bash
    mkdir /tmp/scanner-test && cd /tmp/scanner-test
    echo '{"name":"scanner-test"}' > package.json
    ges init -n "Scanner Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    === "Trigger Secrets Scanner"

        ```bash
        echo 'const apiKey = "sk-1234567890abcdef";' > src/secret.js
        ```

    === "Trigger Crypto Scanner"

        ```bash
        echo 'const hash = crypto.createHash("md5").update(data).digest("hex");' > src/crypto.js
        ```

    === "Trigger Code Security Scanner"

        ```bash
        echo 'db.query("SELECT * FROM users WHERE id = " + userId);' > src/sql.js
        ```

    === "Trigger Auth Scanner"

        ```bash
        echo 'app.get("/api/data", handler);' > src/route.js
        ```

    === "Trigger Config Scanner"

        ```bash
        # Don't add .env to .gitignore and don't install helmet
        echo 'DATABASE_URL=postgresql://admin:password@localhost/db' > .env
        ```

    === "Trigger Database Scanner"

        ```bash
        cat > src/model.js << 'EOF'
        // Missing audit columns
        const User = {
          id: { type: INTEGER, primaryKey: true },
          email: { type: STRING }
        };
        EOF
        ```

    Now run `ges audit` — you should see 6 findings, one from each scanner category.

!!! example "Exercise: Fix Findings and Track Score Improvement"

    1. Start with the vulnerable project from the [Quick Start](../getting-started/quick-start.md)
    2. Run `ges audit` and note your score (e.g., 49%)
    3. Fix **one category** at a time:
        - First, fix all **SECRETS** findings → re-audit → note new score
        - Then fix all **ENCRYPTION** findings → re-audit → note new score
        - Then fix all **INJECTION** findings → re-audit → note new score
    4. Plot your score improvement:

    | Fix Applied | Criticals Remaining | Score |
    |-------------|--------------------:|------:|
    | None (baseline) | 6 | 49% |
    | Secrets fixed | 3 | 55% |
    | Crypto fixed | 2 | 62% |
    | Injection fixed | 0 | 69% |
    | Auth + Config fixed | 0 | 78% |
