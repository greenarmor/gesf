# Quick Start

Get from zero to a full compliance audit in under 5 minutes. Works with **any** programming language.

## Step 1 — Create a Test Project

We will create a deliberately vulnerable project so you can see GESF in action.

```bash
mkdir /tmp/gesf-demo && cd /tmp/gesf-demo
```

Create a minimal `package.json` (only needed so `ges init` has a project context — GESF works with any language):

```bash
echo '{"name":"gesf-demo","version":"1.0.0"}' > package.json
```

## Step 2 — Initialize GESF

```bash
ges init -n "Demo App" -t saas -f "GDPR,OWASP"
```

You should see:

```
  Green Engineering Standard Framework (GESF) v0.6.0
  ─────────────────────────────────────────────

  ✓ Project structure created
  ✓ Configuration files generated
  ✓ Compliance documents created
  ✓ Security documents created
  ✓ Control packs installed: gdpr, owasp, cis, nist
  ✓ GitHub Actions workflows generated (5 workflows)

  GESF initialized for "Demo App" (saas)

  Next steps:
    1. Review generated compliance documents
    2. Run 'ges audit' to evaluate your project
    3. Run 'ges score' to see your compliance score
```

## Step 3 — Create Vulnerable Code

Now let's create some code with intentional security issues so the audit has something to find. You can use **any language** — here are examples in multiple languages:

=== "JavaScript"

    Create `src/config.js`:

    ```javascript title="src/config.js"
    const DB_PASSWORD = "super-secret-password-123";
    const API_KEY = "sk-abc123def456ghi789";
    const dbUrl = "mongodb://admin:admin123@prod-db.example.com:27017/myapp";
    ```

    Create `src/auth.js`:

    ```javascript title="src/auth.js"
    const crypto = require('crypto');

    function hashPassword(password) {
      return crypto.createHash('md5').update(password).digest('hex');
    }
    ```

    Create `src/routes.js`:

    ```javascript title="src/routes.js"
    const express = require('express');
    const app = express();

    app.get('/api/users', (req, res) => {
      const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
      db.query(query);
    });
    ```

=== "Python"

    Create `src/config.py`:

    ```python title="src/config.py"
    DB_PASSWORD = "super-secret-password-123"
    API_KEY = "sk-abc123def456ghi789"
    DB_URL = "postgresql://admin:admin123@prod-db:5432/myapp"
    ```

    Create `src/auth.py`:

    ```python title="src/auth.py"
    import hashlib

    def hash_password(password):
        return hashlib.md5(password.encode()).hexdigest()
    ```

    Create `src/routes.py`:

    ```python title="src/routes.py"
    from flask import Flask, request
    app = Flask(__name__)

    @app.route('/api/users')
    def get_users():
        name = request.args.get('name', '')
        query = f"SELECT * FROM users WHERE name = '{name}'"
        db.execute(query)
    ```

=== "Rust"

    Create `src/config.rs`:

    ```rust title="src/config.rs"
    let db_password = "super-secret-password-123";
    let api_key = "sk-abc123def456ghi789";
    ```

    Create `src/routes.rs`:

    ```rust title="src/routes.rs"
    fn get_users(name: &str) {
        let query = format!("SELECT * FROM users WHERE name = '{}'", name);
        db.execute(&query);
    }
    ```

=== "Go"

    Create `src/config.go`:

    ```go title="src/config.go"
    const dbPassword = "super-secret-password-123"
    const apiKey = "sk-abc123def456ghi789"
    ```

    Create `src/routes.go`:

    ```go title="src/routes.go"
    func getUsers(name string) {
        query := "SELECT * FROM users WHERE name = '" + name + "'"
        db.Execute(query)
    }
    ```

Create `.env`:

```bash title=".env"
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
STRIPE_API_KEY=sk_test_1234567890abcdef
```

## Step 4 — Run the Audit

```bash
ges audit
```

You should see findings like:

```
  GESF Compliance Audit
  ────────────────────

  Scanning project files...
  Scanned 5 files

  ── Findings ─────────────────────

  Total findings: 10
  Critical: 6  High: 3  Medium: 1  Low: 0

  [SECRETS]
    [CRIT] Hardcoded password detected (src/config.js:2)
    [CRIT] API key detected (src/config.js:3)
    [CRIT] Database connection string with credentials (src/config.js:4)
    [CRIT] AWS Secret Access Key detected (.env:2)
    [CRIT] OpenAI-style API key detected (.env:3)

  [ENCRYPTION]
    [CRIT] MD5 hash algorithm detected (src/auth.js:5)

  [INJECTION]
    [CRIT] SQL injection via string concatenation (src/routes.js:6)

  [AUTHENTICATION]
    [HIGH] Route without auth middleware (src/routes.js:5)
    [HIGH] Route without auth middleware (src/routes.js:11)
    [HIGH] No rate limiting library found

  ── Compliance Score ──────────────
  GDPR ................ 42%
  OWASP ............... 55%
  Overall ............. 49%
```

## Step 5 — Run External Scanners

```bash
ges scan
```

GESF auto-detects your project's ecosystem:

```
  Detected ecosystem: node (npm)
  Running security scans...
```

## Step 6 — Fix the Issues

Now fix the vulnerabilities. You can fix them manually or use `ges fix`:

### Option A: Auto-Fix

Preview what can be auto-fixed:

```bash
ges fix --dry-run
```

Apply the fixes:

```bash
ges fix
```

### Option B: Manual Fix

=== "Fix secrets"

    Replace hardcoded values with environment variables:

    ```javascript title="src/config.js"
    const DB_PASSWORD = process.env.DB_PASSWORD;
    const API_KEY = process.env.API_KEY;
    const dbUrl = process.env.DATABASE_URL;
    ```

    Add `.env` to `.gitignore`:

    ```bash title=".gitignore"
    .env
    node_modules/
    ```

=== "Fix crypto"

    Replace MD5 with a strong hashing algorithm:

    ```javascript title="src/auth.js"
    const argon2 = require('argon2');

    async function hashPassword(password) {
      return argon2.hash(password);
    }

    async function checkPassword(input, stored) {
      return argon2.verify(stored, input);
    }
    ```

=== "Fix injection"

    Replace string concatenation with parameterized queries:

    ```javascript title="src/routes.js"
    const express = require('express');
    const router = express.Router();

    router.get('/api/users', authMiddleware, (req, res) => {
      const query = "SELECT * FROM users WHERE name = $1";
      db.query(query, [req.query.name]);
    });

    router.get('/profile', authMiddleware, (req, res) => {
      res.render('profile', { name: req.query.name });
    });
    ```

## Step 7 — Re-Audit

```bash
ges audit
```

Your findings count should drop significantly. Check your new score:

```bash
ges score
```

## Step 8 — Generate a Report

```bash
ges report --format markdown
ges report --format html
```

Check the output in `reports/`.

## Step 9 — Generate Compliance Badge

```bash
ges badge
```

This creates `badge.svg` with your score and letter grade, and injects a score summary into your README.

## Step 10 — Set Up Git Hooks (Optional)

Install a pre-commit hook that blocks commits with security findings:

```bash
ges hooks install
```

Now every `git commit` will run `ges audit` automatically. If critical findings exist, the commit is blocked. See the [Git Hooks guide](../user-guide/git-hooks.md) for details.

## Step 11 — Launch the Web Dashboard (Optional)

View your compliance posture in a browser:

```bash
ges dashboard
```

Open `http://localhost:3001` to see live scores, findings, and control status. See the [Web Dashboard guide](../user-guide/web-dashboard.md) for details.

!!! example "Exercise: Beat 80% Compliance"

    1. After fixing the issues above, run `ges audit` again
    2. Run `ges score` to check your new score
    3. Add security libraries and re-audit
    4. Try to get your score above 80%

    Run `ges audit` and `ges score` again. Compare the before and after scores.
