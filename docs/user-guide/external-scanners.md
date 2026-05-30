# External Scanners

The `ges scan` command integrates with external security tools that must be installed on your system. Unlike `ges audit` (which uses built-in source code scanners), `ges scan` runs third-party tools.

## Basic Usage

```bash
ges scan
```

## Supported Scanners

| Scanner | What It Detects | Install |
|---------|----------------|---------|
| **npm audit** | Known vulnerabilities in npm dependencies | Built into npm |
| **pnpm audit** | Known vulnerabilities in pnpm dependencies | Built into pnpm |
| **Trivy** | Container and dependency vulnerabilities | `brew install trivy` |
| **Gitleaks** | Secrets committed to git history | `brew install gitleaks` |
| **Semgrep** | Code pattern matching for security issues | `pip install semgrep` |

Scanners that are not installed are reported as **"not-available"** (not a failure).

## CI Mode

```bash
ges scan --ci
```

Exits with code **1** if any scanner reports failures. Use this in CI/CD pipelines.

## Example Output

```
  Running security scans...

  ── npm audit ────────────────────
  [FAIL] 3 vulnerabilities found
    1 low, 1 moderate, 1 critical

  ── pnpm audit ───────────────────
  [NOT AVAILABLE] pnpm not detected

  ── Trivy ────────────────────────
  [PASS] No critical vulnerabilities

  ── Gitleaks ─────────────────────
  [PASS] No secrets detected in git history

  ── Semgrep ──────────────────────
  [NOT AVAILABLE] semgrep not installed
```

## How It Differs from `ges audit`

| Aspect | `ges audit` | `ges scan` |
|--------|------------|-----------|
| Scanners | 6 built-in (no install needed) | External tools (must be installed) |
| What it scans | Source code patterns | Dependencies, git history, container images |
| External deps | None | Trivy, Gitleaks, Semgrep (optional) |
| Finds | Code-level issues | Known CVEs, leaked secrets in git |

**Use both** for comprehensive coverage: `ges audit` catches code patterns, `ges scan` catches dependency and history issues.

!!! example "Exercise: Run All Scanners"

    1. Make sure you have at least `npm` installed (it comes with Node.js)
    2. In any GESF-initialized project, run:

    ```bash
    ges scan
    ```

    3. Install one additional scanner and re-run:

    ```bash
    # Install Gitleaks (macOS)
    brew install gitleaks

    # Re-run
    ges scan
    ```

    Notice how the Gitleaks result changes from `[NOT AVAILABLE]` to `[PASS]` or `[FAIL]`.

!!! example "Exercise: Compare audit vs scan"

    ```bash
    # Built-in code scanners — finds code patterns
    ges audit

    # External tools — finds dependency vulns and git secrets
    ges scan
    ```

    !!! question "Questions"
        - Do `ges audit` and `ges scan` find overlapping issues or different ones?
        - Which command catches hardcoded secrets in current files?
        - Which command catches secrets in git history (already committed)?
