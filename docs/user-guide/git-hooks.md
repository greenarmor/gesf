# Git Hooks

The `ges hooks` command installs a Git pre-commit hook that automatically runs `ges audit` before every commit. If the audit finds critical issues, the commit is blocked — preventing security findings from reaching your repository.

## How It Works

1. `ges hooks install` creates `.git/hooks/pre-commit`
2. The hook runs `ges audit --ci` on every `git commit`
3. If critical findings exist, the commit is **blocked** (exit code 1)
4. If the audit passes, the commit proceeds normally

## Install the Pre-Commit Hook

```bash
ges hooks install
```

Output:

```
  [✓] Installed hook: pre-commit

  Pre-commit hook installed at: .git/hooks/pre-commit
  The hook will run 'ges audit' before allowing commits.
  To bypass: git commit --no-verify
  To remove: ges hooks uninstall
```

## Uninstall the Hook

```bash
ges hooks uninstall
```

Output:

```
  [✓] removed pre-commit

  Pre-commit hook removed.
```

## What the Hook Does

The installed pre-commit hook:

1. Locates the `ges` CLI (checks `node_modules/.bin/ges`, then global `ges`, then the package path)
2. Runs `ges audit --ci`
3. If the audit exits non-zero (critical findings), the commit is blocked
4. Prints guidance on how to fix or bypass

```
[GESF] Running compliance audit...

[GESF] Commit blocked: compliance audit found issues.
[GESF] Fix with: ges fix
[GESF] Or bypass with: git commit --no-verify
```

## Bypassing the Hook

Sometimes you need to commit work-in-progress that is not yet clean:

```bash
git commit --no-verify -m "WIP: work in progress"
```

!!! warning "Use --no-verify sparingly"

    Bypassing the hook means security findings skip review. Use it only for work-in-progress commits, never for code heading to a protected branch. Your CI/CD pipeline should also run `ges audit --ci` as a fallback.

## Requirements

- The project must be a Git repository (`.git/` directory must exist)
- GESF must be initialized (`ges init` must have been run)
- The `ges` CLI must be findable (installed locally or globally)

If the `ges` CLI cannot be found, the hook prints a warning and allows the commit:

```
[GESF] Warning: ges CLI not found. Skipping audit.
[GESF] Install with: npm install @greenarmor/ges
```

## Reinstalling or Updating

The hook is idempotent. If a GESF hook already exists, `ges hooks install` overwrites it with the latest version. If a non-GESF hook exists, it is skipped (not overwritten):

```
  [!] Skipped: pre-commit (already exists, not a GESF hook)
```

To replace a non-GESF hook, remove it manually first, then run `ges hooks install`.

## Integration with CI/CD

Git hooks are a **first line of defense** — they catch issues locally before code is pushed. But hooks can be bypassed, so your CI/CD pipeline should also enforce compliance:

```yaml title=".github/workflows/compliance.yml"
name: Compliance Check
on: [push, pull_request]
jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm install @greenarmor/ges
      - run: ges audit --ci
```

!!! example "Exercise: Set Up Pre-Commit Enforcement"

    1. Initialize a project with Git:

    ```bash
    mkdir /tmp/hook-test && cd /tmp/hook-test
    git init
    echo '{"name":"hook-test","version":"1.0.0"}' > package.json
    ges init -n "Hook Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    2. Install the pre-commit hook:

    ```bash
    ges hooks install
    ```

    3. Create a file with a security issue:

    ```bash
DB_PASSWORD: process.env.DB_PASSWORD
    git add .
    ```

    4. Try to commit — it should be blocked:

    ```bash
    git commit -m "Add config"
    # Expected: commit blocked by GESF audit
    ```

    5. Fix the issue:

    ```bash
    echo 'const DB_PASSWORD = process.env.DB_PASSWORD;' > src/config.js
    ```

    6. Commit again — it should succeed:

    ```bash
    git add .
    git commit -m "Add config with env var"
    # Expected: commit allowed
    ```

    7. Test bypassing:

    ```bash
    echo 'const PASSWORD = "temp";' > src/temp.js
    git add .
    git commit --no-verify -m "Temporary code"
    # Expected: commit allowed (bypassed)
    ```

    8. Clean up:

    ```bash
    ges hooks uninstall
    ```

    !!! question "Questions"
        - What happens when the hook blocks a commit?
        - When would bypassing with `--no-verify` be acceptable?
        - How does the hook find the `ges` CLI?
