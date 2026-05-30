# Generating Reports

Generate detailed compliance and security reports for stakeholders, auditors, or management.

## Basic Usage

### Markdown Report

```bash
ges report
ges report --format markdown
ges report --output ./reports/q2-compliance.md
```

### HTML Report

```bash
ges report --format html
ges report --format html --output ./reports/compliance.html
```

## Options

| Flag | Description | Default |
|------|-------------|---------|
| `-f, --format <format>` | Report format: `markdown` or `html` | `markdown` |
| `-o, --output <path>` | Custom output file path | `reports/compliance-report.<ext>` |

## Report Sections

Each report includes:

### 1. Executive Summary

High-level compliance posture with overall score, total findings by severity, and risk assessment.

### 2. Security Findings

All findings grouped by category (secrets, encryption, injection, authentication, config, database) with:

- Severity level
- File path and line number
- Evidence snippet
- Suggested fix

### 3. Compliance Details

Per-framework status showing each control and its current state:

```
GDPR (22 controls)
  PASS  ART5-001  Lawfulness
  PASS  ART5-002  Purpose Limitation
  FAIL  ART32-002 Encryption at Rest
  WARN  ART32-005 Session Timeout
```

### 4. Risk Assessment

Failed controls with their risk implications and recommended remediation priority.

### 5. Security Controls

Summary table of all control statuses across all installed packs.

## Example: Generate and Review

```bash
# Make sure you have fresh audit data
ges audit

# Generate both formats
ges report --format markdown --output reports/compliance-2026-Q2.md
ges report --format html --output reports/compliance-2026-Q2.html

# Check what was generated
ls -la reports/
```

!!! tip "Always run `ges audit` before `ges report`"

    Reports use the latest audit findings. If you haven't audited recently, run `ges audit` first to get current data.

!!! example "Exercise: Generate Reports for Different Audiences"

    1. Run `ges audit` on a project with some findings
    2. Generate a Markdown report and read the Executive Summary section
    3. Generate an HTML report and open it in a browser

    ```bash
    ges report -f markdown -o reports/for-developers.md
    ges report -f html -o reports/for-management.html
    ```

    !!! question "Questions"
        - Which format is better for sharing with a technical team?
        - Which format is better for sharing with non-technical stakeholders?
        - What information in the report would a GDPR auditor want to see?

!!! example "Exercise: Create a Compliance Timeline"

    Run audits and generate reports at key milestones:

    ```bash
    # Before any fixes
    ges audit && ges report -f md -o reports/before-fixes.md

    # After fixing criticals
    ges audit && ges report -f md -o reports/after-criticals.md

    # After fixing all highs
    ges audit && ges report -f md -o reports/after-highs.md

    # Final — all issues resolved
    ges audit && ges report -f md -o reports/final.md
    ```

    Compare the four reports to see how the findings count and score changed over time.
