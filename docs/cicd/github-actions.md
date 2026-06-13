# GitHub Actions (Auto-Generated)

When you run `ges init`, 5 GitHub Actions workflows are generated in `.github/workflows/`:

## Generated Workflows

### `compliance.yml` — Compliance Check

Runs `ges audit --ci` on every push to `main`, pull requests, and weekly on schedule. Also generates a compliance badge.

**Fails build if:** Critical findings exist.

### `security.yml` — Security Scan

Runs Semgrep and `ges scan --ci` on pushes and PRs.

**Fails build if:** Scanner failures found.

### `dependency-scan.yml` — Dependency Scan

Runs Trivy and the ecosystem-specific dependency auditor on pushes to `main` and weekly on schedule.

**Fails build if:** Known vulnerabilities in dependencies.

### `secret-scan.yml` — Secret Detection

Runs Gitleaks on all pushes and pull requests.

**Fails build if:** Secrets detected in git history.

### `sbom-scan.yml` — SBOM Generation and Scan

Generates a Software Bill of Materials (SBOM) in CycloneDX format using Syft, scans it for vulnerabilities using Grype, and generates a second SBOM via Trivy. Artifacts are uploaded with 90-day retention.

**Fails build if:** High or critical vulnerabilities found in SBOM.

## Enabling the Workflows

Simply commit the generated files:

```bash
git add .github/workflows/
git commit -m "Add GESF compliance workflows"
git push
```

The workflows will run automatically on your next push.

## Exit Codes

| Code | Meaning |
|------|---------|
| 0 | Audit passed — no critical findings |
| 1 | Audit failed — critical findings exist |

## Viewing Results

After a workflow runs:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Click on the latest workflow run
4. Expand the job output to see findings

!!! example "Exercise: Trigger a Compliance Workflow"

    1. Initialize GESF in a Git repository:

    ```bash
    cd your-git-project
    ges init -n "My App" -t saas -f "GDPR,OWASP"
    git add .github/workflows/
    git commit -m "Add compliance workflows"
    git push
    ```

    2. Create a PR with a deliberate vulnerability:

    ```bash
    git checkout -b test/compliance
apiKey: process.env.apiKey
    git add src/test.js
    git commit -m "Test: add vulnerable code"
    git push -u origin test/compliance
    ```

    3. Open a pull request on GitHub
    4. Watch the compliance workflow run and fail
    5. Fix the issue, push, and watch the workflow pass

!!! example "Exercise: Customize Workflow Triggers"

    Open `.github/workflows/compliance.yml` and modify the trigger schedule:

    ```yaml
    on:
      push:
        branches: [main, develop]
      pull_request:
        branches: [main]
      schedule:
        - cron: '0 6 * * 1'  # Every Monday at 6 AM UTC
    ```

    This adds:
    - Scanning on the `develop` branch
    - Weekly schedule changed to Monday at 6 AM UTC
