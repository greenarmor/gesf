# Auto-Fix Findings

The `ges fix` command automatically fixes security and compliance findings detected by the audit engine. It can add `.gitignore` entries, insert security middleware, create missing compliance documents, and tell you exactly which npm packages to install — all without manual editing.

## How It Works

1. Runs a full audit on your project
2. Builds an auto-fix plan from the findings
3. Applies each fix (or shows a dry-run preview)
4. Reports which npm packages you need to install
5. Lists any findings that require manual review

## Basic Usage

```bash
ges fix                  # Apply all auto-fixable issues
ges fix --dry-run        # Preview without making changes
ges fix --rules CONFIG-001,SECRETS-001  # Fix only specific rules
ges fix --ci             # Exit non-zero if findings remain
```

| Flag | Short | Description |
|------|-------|-------------|
| `--dry-run` | `-d` | Show what would be fixed without modifying files |
| `--rules <ids>` | `-r` | Comma-separated rule IDs to fix (e.g., `CONFIG-001,SECRETS-001`) |
| `--ci` | | Exit with code 1 if findings remain after fix attempt |

## Dry Run Mode

Always start with a dry run to preview changes:

```bash
ges fix --dry-run
```

Example output:

```
  GESF Auto-Fix Engine
  ────────────────────

  Scanning project files...
  Scanned 12 files
  Found 5 findings

  DRY RUN — 4 fixes planned (no changes applied):

    [gitignore] .gitignore
        Add .env to .gitignore  [CONFIG-001]
    [gitignore] .gitignore
        Add *.pem to .gitignore  [SECRETS-001]
    [file-create] compliance/retention-policy.md
        Create missing retention policy document  [CONFIG-003]
    [file-create] security/incident-response.md
        Create missing incident response plan  [CONFIG-004]

  Fixes planned: 4

  npm packages to install:
    npm install helmet express-rate-limit

  Manual review required:
    [SECRETS-001] Hardcoded password in src/config.js:2 — requires manual replacement with env var
```

## Applying Fixes

Once you are satisfied with the dry run, apply the fixes:

```bash
ges fix
```

After applying:

1. **Install recommended npm packages** — the output tells you exactly what to run
2. **Review changes** — use `git diff` to inspect every modification
3. **Re-audit** — run `ges audit` to see your improved score

```bash
npm install helmet express-rate-limit
git diff
ges audit
```

## Filtering by Rule ID

Fix only specific categories of issues:

```bash
# Fix only configuration issues
ges fix --rules CONFIG-001,CONFIG-002,CONFIG-003

# Fix only secret-related findings
ges fix --rules SECRETS-001

# Fix config and secrets together
ges fix --rules CONFIG-001,SECRETS-001
```

## What Can Be Auto-Fixed

| Rule ID | Fix Type | What It Does |
|---------|----------|-------------|
| `CONFIG-001` | gitignore | Adds `.env` to `.gitignore` |
| `CONFIG-002` | gitignore | Adds missing `.gitignore` file |
| `SECRETS-001` | gitignore | Adds secret file patterns (`*.pem`, `*.key`) to `.gitignore` |
| `CONFIG-003` | file-create | Creates `compliance/retention-policy.md` |
| `CONFIG-004` | file-create | Creates `security/incident-response.md` |
| `CONFIG-005` | file-create | Creates `security/encryption-standard.md` |
| `CONFIG-006` | file-create | Creates `security/logging-policy.md` |
| `CONFIG-007` | file-create | Creates `compliance/data-inventory.md` |
| `AUTH-001` | npm-install | Recommends installing `helmet` |
| `AUTH-002` | npm-install | Recommends installing `express-rate-limit` |

Findings that always require manual review include hardcoded secrets, SQL injection vulnerabilities, weak crypto usage, and database schema changes.

## CI/CD Integration

Use `--ci` in pipelines to fail builds when findings remain:

```yaml title=".github/workflows/security.yml"
- name: Auto-fix and verify
  run: |
    ges fix
    ges audit --ci
```

!!! tip "Combine fix + audit in CI"

    The `--ci` flag on `ges fix` exits non-zero if findings remain after the fix attempt. For stricter enforcement, run `ges fix` first, then `ges audit --ci` to catch anything that could not be auto-fixed.

!!! example "Exercise: Fix a Vulnerable Project"

    1. Create a vulnerable project:

    ```bash
    mkdir /tmp/fix-test && cd /tmp/fix-test
    echo '{"name":"fix-test","version":"1.0.0"}' > package.json
    ges init -n "Fix Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    2. Add issues that auto-fix can handle:

    ```bash
    # Missing .gitignore with .env
    echo 'SECRET_KEY=super-secret' > .env

    # Missing compliance documents (delete some)
    rm -f compliance/retention-policy.md security/incident-response.md
    ```

    3. Run the audit to see findings:

    ```bash
    ges audit
    ```

    4. Preview the fixes:

    ```bash
    ges fix --dry-run
    ```

    5. Apply the fixes:

    ```bash
    ges fix
    ```

    6. Verify the changes:

    ```bash
    git diff
    ls compliance/ security/
    ```

    7. Re-run the audit and check your score improved:

    ```bash
    ges audit
    ges score
    ```

    !!! question "Questions"
        - How many findings were auto-fixable vs requiring manual review?
        - Did the `.gitignore` changes protect your `.env` file?
        - What npm packages were recommended and why?
