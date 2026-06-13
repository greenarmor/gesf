# ESLint Plugin

The `@greenarmor/eslint-plugin-ges` package provides real-time linting rules that catch security issues directly in your editor — before you even run `ges audit`. It enforces the same security standards as the audit engine, but as ESLint rules.

## Installation

```bash
npm install --save-dev @greenarmor/eslint-plugin-ges
```

Or with pnpm:

```bash
pnpm add -D @greenarmor/eslint-plugin-ges
```

## Configuration

### Flat Config (ESLint 9+)

```javascript title="eslint.config.js"
import gesPlugin from "@greenarmor/eslint-plugin-ges";

export default [
  {
    plugins: {
      "@greenarmor/ges": gesPlugin,
    },
    rules: {
      "@greenarmor/ges/no-hardcoded-secrets": "error",
      "@greenarmor/ges/no-weak-crypto": "error",
      "@greenarmor/ges/no-injection": "error",
    },
  },
];
```

### Legacy Config (.eslintrc)

```json title=".eslintrc.json"
{
  "plugins": ["@greenarmor/ges"],
  "rules": {
    "@greenarmor/ges/no-hardcoded-secrets": "error",
    "@greenarmor/ges/no-weak-crypto": "error",
    "@greenarmor/ges/no-injection": "error"
  }
}
```

### Recommended Preset

Use the recommended config to enable all rules at once:

```json title=".eslintrc.json"
{
  "extends": ["plugin:@greenarmor/ges/recommended"]
}
```

This enables all three rules with `"error"` severity.

## Rules

### `no-hardcoded-secrets`

**Type:** Problem  
**Category:** Security

Detects hardcoded passwords, API keys, tokens, and private keys in source code.

**Detected patterns:**

| Pattern | Example |
|---------|---------|
password: process.env.password
| Hardcoded API keys | `apiKey = "abc123def456"` |
| Hardcoded secrets/tokens | `authToken = "very-long-token"` |
| OpenAI-style API keys | `sk-abcdef1234567890...` |
| AWS Access Key IDs | `AKIAIOSFODNN7EXAMPLE` |
| Private keys | `-----BEGIN RSA PRIVATE KEY-----` |
| GitHub tokens | `ghp_1234567890abcdef...` |

Example:

```javascript title="src/config.js"
// ✗ Error: Hardcoded password detected. Move to environment variable.
const DB_PASSWORD = "super-secret-123";

// ✗ Error: AWS Access Key ID detected in source.
const AWS_KEY = "AKIAIOSFODNN7EXAMPLE";

// ✓ OK: Reading from environment
const DB_PASSWORD = process.env.DB_PASSWORD;
```

---

### `no-weak-crypto`

**Type:** Problem  
**Category:** Security

Detects usage of weak or deprecated cryptographic algorithms.

**Detected patterns:**

| Pattern | Severity |
|---------|----------|
| `createHash('md5')` | Error |
| `createHash('sha1')` | Error |
| `md5()` function calls | Error |
| `sha1()` function calls | Error |
| DES / 3DES / Blowfish | Error |
| AES-128 (should be 256) | Error |
| ECB cipher mode | Error |
| Deprecated `createCipher` | Error |

Example:

```javascript title="src/auth.js"
const crypto = require("crypto");

// ✗ Error: MD5 hash algorithm detected
function hashPassword(pw) {
  return crypto.createHash("md5").update(pw).digest("hex");
}

// ✓ OK: Use a strong hashing algorithm
const argon2 = require("argon2");
async function hashPassword(pw) {
  return argon2.hash(pw);
}
```

---

### `no-injection`

**Type:** Problem  
**Category:** Security

Detects SQL injection and command injection vulnerabilities.

**Detected patterns:**

| Pattern | Example |
|---------|---------|
| SQL via string concatenation | `db.query("SELECT * FROM users WHERE id = " + userId)` |
| SQL via template literals | `` db.query(`SELECT * FROM users WHERE id = ${userId}`) `` |
| `eval()` usage | `eval(userInput)` |
| `child_process.exec` with input | `exec("ls " + userInput)` |

Example:

```javascript title="src/routes.js"
// ✗ Error: SQL injection via string concatenation
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users WHERE id = " + req.params.id);
});

// ✓ OK: Parameterized query
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users WHERE id = $1", [req.params.id]);
});
```

## Rule Severity

Adjust severity to fit your workflow:

```json title=".eslintrc.json"
{
  "rules": {
    "@greenarmor/ges/no-hardcoded-secrets": "error",
    "@greenarmor/ges/no-weak-crypto": "error",
    "@greenarmor/ges/no-injection": "warn"
  }
}
```

| Severity | Behavior |
|----------|----------|
| `"error"` | Fails the lint check, shows red squiggly in editor |
| `"warn"` | Shows warning, does not fail lint check |
| `"off"` | Disables the rule |

## Editor Integration

Once configured, the ESLint plugin provides real-time feedback in any ESLint-aware editor:

=== "VS Code"

    Install the **ESLint** extension (`dbaeumer.vscode-eslint`). Security issues appear as red squiggly underlines as you type.

=== "JetBrains (WebStorm, IntelliJ)"

    ESLint integration is built in. Enable it in `Settings > Languages & Frameworks > JavaScript > Code Quality Tools > ESLint`.

=== "Neovim"

    Use `nvim-lspconfig` with the `eslint` server to get diagnostics in your editor.

=== "Sublime Text"

    Install `SublimeLinter-eslint` via Package Control.

## CI/CD Integration

Add the ESLint plugin to your CI pipeline for early detection:

```yaml title=".github/workflows/lint.yml"
name: Lint
on: [push, pull_request]
jobs:
  eslint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npx eslint .
```

## Relationship to `ges audit`

| Feature | ESLint Plugin | `ges audit` |
|---------|--------------|-------------|
| When it runs | As you type, on save | On demand or in CI |
| Speed | Instant (per-file) | Seconds (full project) |
| Languages | JavaScript/TypeScript | 20+ file types |
| Scope | 3 core rules | 8 scanners, 50+ rules |
| IaC scanning | No | Yes (Terraform, CloudFormation) |
| Compliance mapping | No | Yes (GDPR, OWASP, HIPAA, etc.) |

Use the ESLint plugin for **instant developer feedback** and `ges audit` for **comprehensive compliance scanning**.

!!! example "Exercise: Add ESLint Security Rules to a Project"

    1. Create a project:

    ```bash
    mkdir /tmp/eslint-test && cd /tmp/eslint-test
    npm init -y
    npm install --save-dev eslint @greenarmor/eslint-plugin-ges
    ```

    2. Create the ESLint config:

    ```json title=".eslintrc.json"
    {
      "plugins": ["@greenarmor/ges"],
      "rules": {
        "@greenarmor/ges/no-hardcoded-secrets": "error",
        "@greenarmor/ges/no-weak-crypto": "error",
        "@greenarmor/ges/no-injection": "error"
      }
    }
    ```

    3. Create a file with security issues:

    ```javascript title="src/bad.js"
    const password = "hardcoded-secret";
    const crypto = require("crypto");
    const hash = crypto.createHash("md5").update(password).digest("hex");
    const query = "SELECT * FROM users WHERE id = " + userId;
    ```

    4. Run ESLint:

    ```bash
    npx eslint src/bad.js
    ```

    5. Observe the 3 errors (one per rule)

    6. Fix each issue:

    ```javascript title="src/good.js"
    const password = process.env.PASSWORD;
    const argon2 = require("argon2");
    const query = "SELECT * FROM users WHERE id = $1";
    db.query(query, [userId]);
    ```

    7. Run ESLint again — no errors

    !!! question "Questions"
        - How does the ESLint plugin compare to running `ges audit`?
        - Which gives faster feedback during development?
        - Can you use both together? Why would you?
