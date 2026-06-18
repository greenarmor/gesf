# Audit Scanners

GESF includes 9 built-in scanners that run during `ges audit`. No external dependencies required. The scanners are **language-agnostic** — they use pattern matching across 20+ file types.

## Scanner Overview

| Scanner | Category | What It Detects |
|---------|----------|----------------|
| Secrets | `secrets` | Hardcoded passwords, API keys, tokens, private keys |
| Crypto | `encryption` | MD5, SHA1, weak encryption, disabled TLS |
| Code Security | `injection`, `xss` | SQL injection, XSS, eval/code injection |
| Auth | `authentication` | Routes without auth, missing rate limiting, wildcard CORS |
| Config | `config`, `security` | Missing helmet/cors, .env secrets, Docker issues |
| Database | `database` | Missing audit columns, missing soft delete |
| IaC | `infrastructure` | Terraform/CloudFormation misconfigurations, open ports, public S3 |
| Dependency | `dependency` | Vulnerabilities, deprecated packages, license issues |
| Governance | `governance` | Missing provenance dimensions, expired approvals, verification failures (only when governance pack is installed) |

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

The crypto scanner detects patterns across **5 languages**:

| Language | Patterns Detected |
|----------|------------------|
| Node.js | `createHash('md5')`, `createHash('sha1')`, `createCipher`, `rejectUnauthorized: false` |
| Python | `hashlib.md5()`, `hashlib.sha1()`, `Crypto.Cipher.DES`, `verify_mode = ssl.CERT_NONE` |
| Go | `md5.New()`, `sha1.New()`, `crypto/des.NewCipher()`, `InsecureSkipVerify: true` |
| Java | `MessageDigest.getInstance("MD5")`, `Cipher.getInstance("DES")`, `TrustAllCerts` |
| Rust | `md5::compute()`, `sha1::Sha1`, `des::new()`, `danger_accept_invalid_certs(true)` |

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
| SQL injection via Python f-strings | Critical |
| SQL injection via Go `fmt.Sprintf` | Critical |
| Command injection via `child_process` | Critical |
| Command injection via Rust `Command::new` | Critical |
| XSS via `innerHTML` | Critical |
| XSS via `document.write` | Critical |
| XSS via `v-html` / `dangerouslySetInnerHTML` | Critical |
| `eval()` with user input | Critical |

The injection scanner detects SQL injection patterns in **5 languages**:

| Language | Pattern Example |
|----------|----------------|
| JavaScript | `db.query("SELECT * FROM users WHERE id = " + req.params.id)` |
| JavaScript | `` db.query(`SELECT * FROM users WHERE id = ${req.params.id}`) `` |
| Python | `cursor.execute(f"SELECT * FROM users WHERE id = {request.args['id']}")` |
| Go | `db.Query(fmt.Sprintf("SELECT * FROM users WHERE id = %s", r.URL.Query().Get("id")))` |
| Rust | `Command::new("sh").arg("-c").arg(user_input)` |

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

## 7. Infrastructure-as-Code Scanner

Scans Terraform (`.tf`), CloudFormation (`.yaml`/`.yml`/`.json`), and Docker files for infrastructure security misconfigurations. See the [IaC Scanner reference](iac-scanner.md) for the full 15-rule catalog.

| Detection | Severity |
|-----------|----------|
| S3 bucket public-read ACL | Critical |
| S3 bucket without encryption | High |
| S3 bucket without versioning | Medium |
| Security group open to 0.0.0.0/0 | Critical |
| SSH (port 22) open to internet | Critical |
| Database ports (3306, 5432) open to internet | Critical |
| RDS publicly accessible | Critical |
| RDS without encryption at rest | High |
| RDS without deletion protection | Medium |
| IAM policy with wildcard action (`*`) | High |
| IAM policy with wildcard resource (`*`) | Medium |
| KMS key without rotation | Medium |
| `force_destroy = true` on S3 | Medium |
| SSL/TLS disabled | High |

Example finding:

```hcl title="main.tf" hl_lines="3"
resource "aws_s3_bucket" "data" {
  bucket = "sensitive-data"
  acl    = "public-read"
}
```

---

## 8. Dependency Analysis

Analyzes project dependencies for vulnerabilities, deprecated packages, license issues, and outdated versions. See the [Dependency Analysis reference](dependency-analysis.md) for details.

| Detection | Type | Severity |
|-----------|------|----------|
| Known vulnerability in dependency | `vulnerability` | Varies (from advisory) |
| Deprecated package | `deprecated` | Medium |
| Copyleft license (GPL, AGPL) | `license` | Medium |
| Package behind latest version | `outdated` | Low |

Supports: **Node.js** (`npm audit`), **Python** (`pip-audit`), **Rust** (`cargo audit`), **Go** (`govulncheck`).

---

## 9. Governance Scanner

Validates governance provenance records when the `governance` policy pack is installed (`controls/governance/` directory exists). Checks each governance record against 10 GOVP controls.

This scanner only activates when the governance pack is installed — it has no effect on projects without governance controls.

| Rule ID | Severity | What It Checks |
|---------|----------|----------------|
| GOVP-001 | High | Pack installed but no governance records exist |
| GOVP-002 | Medium | Record missing risk assessment |
| GOVP-003 | Medium | Record missing policy basis |
| GOVP-004 | High | Record missing approval decision |
| GOVP-005 | High | Record has no evidence references |
| GOVP-007 | Low | Record missing review cycle |
| GOVP-008 | Critical | Record approval expired (or Medium if expiring ≤30 days) |
| GOVP-009 | Low | Record missing data inventory |
| GOVP-010 | Low | Record missing compliance framework links |
| GOVP-011 | High | Record verification has blocking issues |

**Zero findings** are produced when all governance records have complete provenance chains with valid, non-expired approvals.

See the [Governance guide](../user-guide/governance.md) for details on creating and enriching records.

---

## Files Scanned

GESF scans all text-based source files in your project:

- **Languages:** `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.rb`, `.go`, `.java`, `.php`, `.cs`, `.rs`, `.swift`, `.kt`
- **Config:** `.json`, `.yaml`, `.yml`, `.toml`, `.env`, `.ini`
- **Web:** `.html`, `.css`, `.scss`
- **SQL:** `.sql`, `.prisma`
- **Infrastructure:** `.tf`, `.tfvars`, `Dockerfile`, `docker-compose.yml`
- **Max file size:** 1MB per file

## Files Skipped

The following are automatically excluded:

- `node_modules/`
- `.git/`
- `dist/`, `build/`, `out/`
- `.ges/`
- Binary files (images, fonts, compiled files)

!!! example "Exercise: Trigger Each Scanner"

    Create a single file that triggers all 8 scanners in any language:

    ```bash
    mkdir /tmp/all-scanners && cd /tmp/all-scanners
    ges init -n "Scanner Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    === "JavaScript"

        ```javascript title="src/all-issues.js"
        // 1. Secrets: hardcoded password
        const DB_PASS = "admin123";

        // 2. Crypto: MD5
        const crypto = require('crypto');
        const hash = crypto.createHash('md5').update(data).digest('hex');

        // 3. Code Security: SQL injection
        db.query("SELECT * FROM users WHERE id = " + userId);

        // 4. Auth: route without middleware
        app.get('/api/data', handler);

        // 5. Config: no helmet, no .gitignore with .env
        // 6. Database: missing audit columns
        const User = { id: INTEGER, email: STRING };
        ```

        ```hcl title="main.tf"
        # 7. IaC: public S3 bucket without encryption
        resource "aws_s3_bucket" "data" {
          bucket = "sensitive"
          acl    = "public-read"
        }
        ```

        ```bash
        # 8. Dependency: install a vulnerable package
        npm install lodash@4.17.20
        ```

    === "Python"

        ```python title="src/all_issues.py"
        # 1. Secrets: hardcoded password
        DB_PASS = "admin123"

        # 2. Crypto: MD5
        import hashlib
        h = hashlib.md5(data.encode()).hexdigest()

        # 3. Code Security: SQL injection
        query = f"SELECT * FROM users WHERE id = {user_id}"

        # 4. Auth: no auth decorator
        @app.route('/api/data')
        def get_data():
            pass
        ```

    Run `ges audit` and verify you see findings from all scanner categories. Then run `ges scan` to trigger the dependency analysis.
