# Complete Audit Workflow

The recommended end-to-end workflow for auditing a project from initialization to CI/CD integration. Works with **any programming language**.

## Step 1 — Initialize

```bash
cd your-project
ges init
```

Answer the prompts for project name, type, and frameworks. Or use flags:

```bash
ges init -n "My App" -t saas -f "GDPR,OWASP"
```

## Step 2 — First Audit

```bash
ges audit
```

Review the findings. Each one tells you the file, line number, severity, and suggested fix.

## Step 3 — Fix Critical Issues First

Prioritize by severity. Fix all **critical** findings before anything else:

| Issue | Fix |
|-------|-----|
| Hardcoded secrets | Move to environment variables or secrets manager |
| MD5/SHA1 hashing | Replace with Argon2id (passwords) or SHA-256+ (general) |
| SQL injection | Use parameterized queries |
| Disabled TLS | Remove `NODE_TLS_REJECT_UNAUTHORIZED=0` |
| Private keys in source | Remove from code, use secrets manager |

## Step 4 — Fix High Issues

| Issue | Fix |
|-------|-----|
| Routes without auth | Add authentication middleware to all routes |
| No rate limiting | Install rate limiting library for your framework |
| Missing security headers | Add helmet (Node.js) or equivalent for your framework |
| `.env` not in `.gitignore` | Add `.env` to `.gitignore` |
| No logging library | Install a logging library (winston, pino, structlog, logrus, etc.) |
| Wildcard CORS | Configure specific origins instead of `*` |

## Step 5 — Fix Medium/Low Issues

| Issue | Fix |
|-------|-----|
| Missing session timeout | Add session expiration configuration |
| Missing soft delete | Add `deleted_at` column to models |
| Missing audit columns | Add `created_by`, `updated_by` to models |

## Step 6 — Re-Audit and Track Score

```bash
ges audit
ges score
```

Track your progress. Aim for 80%+ overall before deploying.

## Step 7 — Run External Scanners

```bash
ges scan
```

GESF auto-detects your project's ecosystem (Node.js, Python, Rust, Go, etc.) and runs the matching dependency auditor plus language-agnostic tools (Trivy, Gitleaks, Semgrep, SBOM scanners).

Catch dependency vulnerabilities and git history secrets that the built-in scanners don't cover.

## Step 8 — Validate Configuration

```bash
ges validate
```

Ensure your GESF setup is healthy and all control files are intact.

## Step 9 — Generate Reports

```bash
ges report --format markdown
ges report --format html
```

Share with stakeholders, auditors, or attach to compliance records.

## Step 10 — Generate Compliance Badge

```bash
ges badge
```

This generates `badge.svg` in your project root and injects it into your README with a score summary table. The badge shows your overall score, letter grade, and per-framework breakdown. See the [Compliance Badge guide](compliance-badge.md) for embedding options and CI/CD automation.

## Step 11 — Integrate with CI/CD

Commit the generated `.github/workflows/` files to your repository:

```bash
git add .github/workflows/
git commit -m "Add GESF compliance workflows"
```

5 workflows are generated: compliance, security, dependency scan, secret scan, and SBOM scan. Future commits and PRs will automatically run compliance checks and fail the build on critical issues.

## Step 12 — Set Up MCP AI Assistant

Connect GESF to your code assistant for real-time compliance guidance:

```bash
ges mcp setup vscode    # for VS Code Copilot
ges mcp setup cursor    # for Cursor
ges mcp setup claude    # for Claude Desktop
# etc.
```

See the [MCP Integration guide](../mcp/overview.md) for full details.

---

## Quick Reference Card

```
ges init          → Set up compliance structure
ges audit         → Scan code for violations (any language)
ges score         → Check compliance score
ges badge         → Generate compliance badge (SVG)
ges report        → Generate compliance report
ges scan          → Run external scanners (auto-detects ecosystem)
ges validate      → Validate configuration
ges doctor        → Check GESF health
ges compliance    → View compliance status
ges policy list   → See available packs
ges mcp setup     → Connect to AI assistant
```

!!! example "Exercise: Full Workflow on a Real Project"

    Apply the complete workflow to one of your own projects:

    1. Run `ges init` and choose the appropriate type and frameworks
    2. Run `ges audit` and record: total findings, critical count, initial score
    3. Fix issues in order: criticals first, then highs, then mediums
    4. After each round of fixes, run `ges audit && ges score`
    5. Run `ges scan` and note the detected ecosystem
    6. Generate a final report with `ges report -f html`
    7. Generate a compliance badge with `ges badge`
    8. Commit the `.github/workflows/` files

    Fill in this tracker:

    | Metric | Before | After Criticals | After Highs | After Mediums |
    |--------|-------:|---------------:|------------:|--------------:|
    | Critical findings | | | | |
    | High findings | | | | |
    | Total findings | | | | |
    | Score | | | | |
    | Detected ecosystem | | | | |

!!! example "Exercise: Team Workflow Simulation"

    Simulate how a team would use GESF:

    1. **Tech lead** runs `ges init` and commits the generated files
    2. **Developer A** creates a feature branch with a hardcoded API key
    3. **CI/CD** runs `ges audit --ci` on the PR and **fails the build**
    4. **Developer A** fixes the issue, pushes, and the build passes
    5. **Compliance officer** runs `ges report -f html` for the quarterly review

    ```bash
    # Step 1 — Tech lead sets up
    ges init -n "Team Project" -t saas -f "GDPR,OWASP"
    git add .ges/ compliance/ security/ controls/ .github/
    git commit -m "Initialize GESF compliance framework"

    # Step 2 — Developer creates feature (with accidental secret)
    git checkout -b feature/new-api
    echo 'const apiKey = "sk-real-key-here";' > src/api.js

    # Step 3 — CI catches it (simulate locally)
    ges audit --ci
    echo "Exit code: $?"  # Should be 1

    # Step 4 — Developer fixes
    echo 'const apiKey = process.env.API_KEY;' > src/api.js
    ges audit --ci
    echo "Exit code: $?"  # Should be 0

    # Step 5 — Compliance generates report
    ges report -f html -o reports/quarterly-review.html
    ```

!!! example "Exercise: Multi-Language Project"

    GESF is language-agnostic. Try the full workflow on projects in different languages:

    ```bash
    # Python project
    mkdir /tmp/py-project && cd /tmp/py-project
    echo 'flask==2.0\nrequests==2.28' > requirements.txt
    ges init -n "Python App" -t api-backend -f "GDPR,OWASP"
    ges audit && ges scan

    # Rust project
    mkdir /tmp/rust-project && cd /tmp/rust-project
    echo '[package]\nname="app"\nversion="0.1.0"\nedition="2021"' > Cargo.toml
    ges init -n "Rust App" -t api-backend -f "GDPR,OWASP"
    ges audit && ges scan

    # Go project
    mkdir /tmp/go-project && cd /tmp/go-project
    echo 'module example.com/app\n\ngo 1.21' > go.mod
    ges init -n "Go App" -t api-backend -f "GDPR,OWASP"
    ges audit && ges scan
    ```

    Compare:
    - Which ecosystem was detected for each project?
    - Which dependency auditor ran for each?
    - Did the language-agnostic scanners (Trivy, Gitleaks, Semgrep) behave the same across all three?
