# Audit Scanners

GESF includes 6 built-in source code scanners that run during `ges audit`. No external dependencies required.

## Scanner Overview

| Scanner | Category | What It Detects |
|---------|----------|----------------|
| Secrets | `secrets` | Hardcoded passwords, API keys, tokens, private keys |
| Crypto | `encryption` | MD5, SHA1, weak encryption, disabled TLS |
| Code Security | `injection`, `xss` | SQL injection, XSS, eval/code injection |
| Auth | `authentication` | Routes without auth, missing rate limiting, wildcard CORS |
| Config | `config`, `security` | Missing helmet/cors, .env secrets, Docker issues |
| Database | `database` | Missing audit columns, missing soft delete |

---

## 1. Secrets Scanner

Detects hardcoded secrets and credentials across all source files.

| Detection | Example | Severity |
|-----------|---------|----------|
| Hardcoded passwords | `password = "..."` | Critical |
| API keys | `api_key = "..."` | Critical |
| Database connection strings | `mongodb://user:pass@...` | Critical |
| AWS Access Keys | `AKIA...` | Critical |
| GitHub tokens | `ghp_...`, `gho_...` | Critical |
| Slack tokens | `xoxb-...`, `xoxp-...` | Critical |
| GitLab tokens | `glpat-...` | Critical |
| JWT tokens | `eyJ...` | Critical |
| Private keys | `-----BEGIN RSA PRIVATE KEY-----` | Critical |
| OpenAI-style API keys | `sk-...` | Critical |
| Sensitive env vars | `DB_PASSWORD=admin` | Critical |

Secrets are **masked** in output (shows first 4 + last 4 characters).

**Example finding:**

```javascript title="src/config.js" hl_lines="1"
const DB_PASSWORD = "super-secret-123";
```

```
  [CRIT] Hardcoded password detected (src/config.js:1)
        DB_PASSWORD = "supe***t-123"
```

---

## 2. Cryptographic Scanner

Detects weak or deprecated cryptographic algorithms.

| Detection | Severity |
|-----------|----------|
| MD5 usage | Critical |
| SHA1 usage | Critical |
| DES / 3DES / Blowfish | High |
| AES-128 (should be AES-256) | High |
| ECB mode | High |
| Deprecated `createCipher` (Node.js) | High |
| Plaintext password comparison (`===`) | Critical |
| TLS verification disabled (`rejectUnauthorized: false`) | Critical |

**Example finding:**

```javascript title="src/hash.js" hl_lines="2"
function hash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}
```

```
  [CRIT] MD5 hash algorithm detected (src/hash.js:2)
```

---

## 3. Code Security Scanner

Detects injection vulnerabilities.

| Detection | Severity |
|-----------|----------|
| SQL injection via string concatenation | Critical |
| SQL injection via template literals | Critical |
| XSS via `innerHTML` | Critical |
| XSS via `document.write` | Critical |
| XSS via `v-html` / `dangerouslySetInnerHTML` | Critical |
| `eval()` with user input | Critical |
| `child_process` with user input | Critical |

**Example finding:**

```javascript title="src/routes.js" hl_lines="2"
app.get('/users', (req, res) => {
  db.query("SELECT * FROM users WHERE id = " + req.params.id);
});
```

```
  [CRIT] SQL injection via string concatenation (src/routes.js:2)
```

---

## 4. Authentication Scanner

Checks for missing authentication and session controls.

| Detection | Severity |
|-----------|----------|
| Routes without auth middleware | High |
| No rate limiting library | High |
| No session timeout | Medium |
| CORS set to wildcard (`*`) | High |
| No MFA implementation | High |

Recognizes: Passport.js, JWT, NextAuth, Auth0, Clerk, Supabase Auth, Firebase Auth.

**Example finding:**

```javascript title="src/api.js" hl_lines="1"
app.get('/api/admin', (req, res) => {   // No auth middleware
  res.json(adminData);
});
```

```
  [HIGH] Route without auth middleware (src/api.js:1)
```

---

## 5. Configuration Scanner

Checks project configuration for security issues.

| Detection | Severity |
|-----------|----------|
| Missing `helmet` | High |
| Missing CORS config | Medium |
| Secret values in `.env` file | Critical |
| Docker running as root | Medium |
| Secrets in Dockerfile ENV | Critical |
| `NODE_TLS_REJECT_UNAUTHORIZED=0` | Critical |
| Missing `.gitignore` | High |
| `.env` not in `.gitignore` | High |
| No logging library (winston/pino/morgan) | High |

---

## 6. Database Scanner

Checks database schemas for compliance patterns.

| Detection | Severity |
|-----------|----------|
| Missing `created_at` / `updated_at` | High |
| Missing `deleted_at` (soft delete) | Medium |
| Missing `created_by` / `updated_by` | Medium |

Works with: Prisma schemas, Sequelize models, raw SQL, TypeORM entities.

**Example — missing audit columns:**

```javascript title="src/models/user.js"
// Missing: created_at, updated_at, deleted_at, created_by, updated_by
const User = {
  id: { type: INTEGER, primaryKey: true },
  email: { type: STRING }
};
```

---

## Files Scanned

GESF scans all text-based source files in your project:

- **Languages:** `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.rb`, `.go`, `.java`, `.php`, `.cs`, `.rs`
- **Config:** `.json`, `.yaml`, `.yml`, `.toml`, `.env`, `.ini`
- **Web:** `.html`, `.css`, `.scss`
- **SQL:** `.sql`, `.prisma`
- **Docker:** `Dockerfile`, `docker-compose.yml`
- **Max file size:** 1MB per file

## Files Skipped

The following are automatically excluded:

- `node_modules/`
- `.git/`
- `dist/`, `build/`, `out/`
- `.ges/`
- Binary files (images, fonts, compiled files)

!!! example "Exercise: Trigger Each Scanner"

    Create a single file that triggers all 6 scanners:

    ```bash
    mkdir /tmp/all-scanners && cd /tmp/all-scanners
    echo '{"name":"test"}' > package.json
    ges init -n "Scanner Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    ```javascript title="src/all-issues.js"
    // Secrets: hardcoded password
    const DB_PASS = "admin123";

    // Crypto: MD5
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(data).digest('hex');

    // Code Security: SQL injection
    db.query("SELECT * FROM users WHERE id = " + userId);

    // Auth: route without middleware
    app.get('/api/data', handler);

    // Config: no helmet, no .gitignore with .env
    // (don't add helmet to package.json, don't create .gitignore)

    // Database: missing audit columns
    const User = { id: INTEGER, email: STRING };
    ```

    Run `ges audit` and verify you see findings from all 6 categories.
