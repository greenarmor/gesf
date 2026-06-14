# Compliance Score

After running an audit, your compliance score is saved to `.ges/score.json`. View it anytime:

```bash
ges score
```

## Example Output

```
  GDPR ................ 72%
  OWASP ............... 65%
  CIS ................. 80%
  NIST ................ 58%
  Overall ............. 69%

  Last evaluated: 2026-05-30T14:30:00.000Z
```

## How Scoring Works

- Each framework's score = **severity-weighted** percentage of controls that are **passing** or **not applicable** (see [Compliance Badge guide](compliance-badge.md#scoring-engine-details) for the full algorithm)
- Overall score = **control-count-weighted average** of all framework scores (frameworks with more controls carry more weight; frameworks with zero controls are excluded from the average)
- Controls default to **"not-implemented"** until positive evidence is detected or findings map them to **"fail"**

### Control Status Values

| Status | Meaning | Effect on Score |
|--------|---------|----------------|
| `pass` | Control requirements are met | Full credit (1.0x weight) |
| `fail` | Control requirements are violated | No credit (0x weight) |
| `warning` | Partial compliance | Half credit (0.5x weight) |
| `not-implemented` | No evidence found | No credit (0x weight) |
| `not-applicable` | Control does not apply to this project | Full credit (1.0x weight) |

### Score Calculation

```
Framework Score = round(Σ(control_weight × status_credit) / Σ(control_weight) × 100)
Overall Score = round(Σ(framework_score × total_controls) / Σ(total_controls))
```

Frameworks with zero controls are excluded from the overall calculation. See the [Compliance Badge guide](compliance-badge.md#scoring-engine-details) for severity weights, status credits, critical failure caps, and audit deduction details.

## CI Mode

Output raw JSON for CI/CD pipelines:

```bash
ges score --ci
```

Returns:

```json
{
  "overall": 69,
  "frameworks": {
    "GDPR": {
      "framework": "GDPR",
      "score": 72,
      "total_controls": 22,
      "passed_controls": 16,
      "failed_controls": 4,
      "warning_controls": 2,
      "not_applicable": 0,
      "evaluated_at": "2026-05-30T14:30:00.000Z"
    }
  },
  "evaluated_at": "2026-05-30T14:30:00.000Z"
}
```

## Viewing Full Compliance Status

For a combined view of score + installed packs with per-pack control counts:

```bash
ges compliance
```

Output:

```
  GDPR ................ 72%
  OWASP ............... 65%
  Overall ............. 69%

  Installed Policy Packs:
    gdpr            16/22 controls passed
    owasp           4/6 controls passed
```

!!! tip "Generate a Score Badge"

    You can embed your compliance score as an SVG badge in your README or documentation:

    ```bash
    ges badge
    ```

    This generates `badge.svg` and injects a score summary table into your README. See the [Compliance Badge guide](compliance-badge.md) for full details including embedding options, CI/CD automation, and how the scoring engine computes the grade.

---

!!! example "Exercise: Track Score Over Multiple Audits"

    1. Start with a fresh project and run `ges init`
    2. Create a deliberately vulnerable file (see [Quick Start](../getting-started/quick-start.md))
    3. Run `ges audit` and `ges score` — record the score
    4. Fix one issue at a time and re-run `ges audit && ges score` after each fix
    5. Record your progress:

    ```bash
    # After each fix, save the score
    ges score --ci >> /tmp/score-history.json
    ```

    6. Count how many fixes it takes to reach 80%

!!! example "Exercise: Compare Project Types"

    Different project types install different packs, which changes the scoring. Try this:

    ```bash
    # SaaS (4 packs: GDPR, OWASP, CIS, NIST = 56 controls)
    mkdir /tmp/type-saas && cd /tmp/type-saas && echo '{"name":"t"}' > package.json
    ges init -n "SaaS" -t saas -f "GDPR,OWASP,CIS,NIST"
    ges audit && ges score

    # API Backend (2 packs: GDPR, OWASP = 28 controls)
    mkdir /tmp/type-api && cd /tmp/type-api && echo '{"name":"t"}' > package.json
    ges init -n "API" -t api-backend -f "GDPR,OWASP"
    ges audit && ges score

    # AI Application (3 packs: GDPR, OWASP, AI = 34 controls)
    mkdir /tmp/type-ai && cd /tmp/type-ai && echo '{"name":"t"}' > package.json
    ges init -n "AI" -t ai-application -f "GDPR,OWASP"
    ges audit && ges score
    ```

    !!! question "Questions"
        - Which project type has the most controls to satisfy?
        - Does the same clean codebase score differently depending on project type?
