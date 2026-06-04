# Audit Scanners

GESF includes 6 built-in source code scanners that run during `ges audit`. No external dependencies required. The scanners are **language-agnostic** — they use pattern matching across 20+ file types.

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

**Example findings across languages:**

=== "JavaScript"

    ```javascript title="src/config.js" hl_lines="1"
    const DB_PASSWORD = "super-secret-123";
    ```

=== "Python"

    ```python title="src/config.py" hl_lines="1"
    DB_PASSWORD = "super-secret-123"
    ```

=== "Rust"

    ```rust title="src/config.rs" hl_lines="1"
    let db_password = "super-secret-123";
    ```

=== "Go"

    ```go title="src/config.go" hl_lines="1"
    const dbPassword = "super-secret-123"
    ```

---

## 2. Cryptographic Scanner

Detects weak or deprecated cryptographic algorithms across all languages.

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

**Example findings:**

=== "JavaScript"

    ```javascript title="src/hash.js" hl_lines="2"
    function hash(data) {
      return crypto.createHash('md5').update(data).digest('hex');
    }
    ```

=== "Python"

    ```python title="src/hash.py" hl_lines="2"
    def hash_data(data):
        return hashlib.md5(data.encode()).hexdigest()
    ```

=== "Go"

    ```go title="src/hash.go" hl_lines="2"
    func hashData(data []byte) []byte {
        h := md5.Sum(data)
        return h[:]
    }
    ```

---

## 3. Code Security Scanner

Detects injection vulnerabilities across all languages.

| Detection | Severity |
|-----------|----------|
| SQL injection via string concatenation | Critical |
| SQL injection via template literals | Critical |
| XSS via `innerHTML` | Critical |
| XSS via `document.write` | Critical |
| XSS via `v-html` / `dangerouslySetInnerHTML` | Critical |
| `eval()` with user input | Critical |
| `child_process` with user input | Critical |

**Example findings:**

=== "JavaScript"

    ```javascript title="src/routes.js" hl_lines="2"
    app.get('/users', (req, res) => {
      db.query("SELECT * FROM users WHERE id = " + req.params.id);
    });
    ```

=== "Python"

    ```python title="src/routes.py" hl_lines="2"
    @app.route('/users')
    def get_users():
        query = f"SELECT * FROM users WHERE id = {request.args.get('id')}"
        db.execute(query)
    ```

=== "Go"

    ```go title="src/routes.go" hl_lines="2"
    func getUsers(w http.ResponseWriter, r *http.Request) {
        query := "SELECT * FROM users WHERE id = " + r.URL.Query().Get("id")
        db.Execute(query)
    }
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

---

## Files Scanned

GESF scans all text-based source files in your project:

- **Languages:** `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.rb`, `.go`, `.java`, `.php`, `.cs`, `.rs`, `.swift`, `.kt`
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

    Create a single file that triggers all 6 scanners in any language:

    ```bash
    mkdir /tmp/all-scanners && cd /tmp/all-scanners
    ges init -n "Scanner Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    === "JavaScript"

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
        // Database: missing audit columns
        const User = { id: INTEGER, email: STRING };
        ```

    === "Python"

        ```python title="src/all_issues.py"
        # Secrets: hardcoded password
        DB_PASS = "admin123"

        # Crypto: MD5
        import hashlib
        h = hashlib.md5(data.encode()).hexdigest()

        # Code Security: SQL injection
        query = f"SELECT * FROM users WHERE id = {user_id}"

        # Auth: no auth decorator
        @app.route('/api/data')
        def get_data():
            pass
        ```

    Run `ges audit` and verify you see findings from all scanner categories.
