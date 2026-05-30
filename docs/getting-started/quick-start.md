# Quick Start

Get from zero to a full compliance audit in under 5 minutes.

## Step 1 — Create a Test Project

We will create a deliberately vulnerable project so you can see GESF in action.

```bash
mkdir /tmp/gesf-demo && cd /tmp/gesf-demo
```

Create a minimal `package.json`:

```bash
echo '{"name":"gesf-demo","version":"1.0.0"}' > package.json
```

## Step 2 — Initialize GESF

```bash
ges init -n "Demo App" -t saas -f "GDPR,OWASP"
```

You should see:

```
  Green Engineering Standard Framework (GESF) v0.1.0
  ─────────────────────────────────────────────

  ✓ Project structure created
  ✓ Configuration files generated
  ✓ Compliance documents created
  ✓ Security documents created
  ✓ Control packs installed: gdpr, owasp, cis, nist
  ✓ GitHub Actions workflows generated

  GESF initialized for "Demo App" (saas)

  Next steps:
    1. Review generated compliance documents
    2. Run 'ges audit' to evaluate your project
    3. Run 'ges score' to see your compliance score
```

## Step 3 — Create Vulnerable Code

Now let's create some code with intentional security issues so the audit has something to find.

Create `src/config.js`:

```javascript title="src/config.js"
// Deliberately vulnerable — do NOT use in production
const DB_PASSWORD = "super-secret-password-123";
const API_KEY = "sk-abc123def456ghi789";
const dbUrl = "mongodb://admin:admin123@prod-db.example.com:27017/myapp";
```

Create `src/auth.js`:

```javascript title="src/auth.js"
const crypto = require('crypto');

function hashPassword(password) {
  // Vulnerable: uses MD5
  return crypto.createHash('md5').update(password).digest('hex');
}

function checkPassword(input, stored) {
  // Vulnerable: plaintext comparison
  return input === stored;
}
```

Create `src/routes.js`:

```javascript title="src/routes.js"
const express = require('express');
const app = express();

// Vulnerable: no auth middleware
app.get('/api/users', (req, res) => {
  const query = "SELECT * FROM users WHERE name = '" + req.query.name + "'";
  db.query(query);
});

// Vulnerable: XSS via innerHTML
app.get('/profile', (req, res) => {
  res.send(`<div>${req.query.name}</div>`);
});
```

Create `src/server.js`:

```javascript title="src/server.js"
const express = require('express');
const app = express();

app.listen(3000, () => console.log('Server running'));
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

## Step 5 — Fix the Issues

Now fix the vulnerabilities:

=== "Fix secrets"

    Replace `src/config.js` with:

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

    Replace `src/auth.js` with:

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

    Replace `src/routes.js` with:

    ```javascript title="src/routes.js"
    const express = require('express');
    const router = express.Router();

    // Fixed: parameterized query
    router.get('/api/users', authMiddleware, (req, res) => {
      const query = "SELECT * FROM users WHERE name = $1";
      db.query(query, [req.query.name]);
    });

    // Fixed: escaped output
    router.get('/profile', authMiddleware, (req, res) => {
      res.render('profile', { name: req.query.name });
    });
    ```

## Step 6 — Re-Audit

```bash
ges audit
```

Your findings count should drop significantly. Check your new score:

```bash
ges score
```

## Step 7 — Generate a Report

```bash
ges report --format markdown
ges report --format html
```

Check the output in `reports/`.

!!! example "Exercise: Beat 80% Compliance"

    1. After fixing the issues above, run `ges audit` again
    2. Run `ges score` to check your new score
    3. Add `helmet` and `express-rate-limit` to `src/server.js`
    4. Add `winston` logging
    5. Re-audit and try to get your score above 80%

    ```bash
    npm install helmet express-rate-limit winston
    ```

    ```javascript title="src/server.js"
    const express = require('express');
    const helmet = require('helmet');
    const rateLimit = require('express-rate-limit');
    const winston = require('winston');

    const logger = winston.createLogger({
      transports: [new winston.transports.Console()]
    });

    const app = express();
    app.use(helmet());
    app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

    app.listen(3000, () => logger.info('Server running'));
    ```

    Run `ges audit` and `ges score` again. Compare the before and after scores.
