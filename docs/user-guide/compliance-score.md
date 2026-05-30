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

- Each framework's score = percentage of controls that are **passing** or **not applicable**
- Overall score = average of all framework scores, rounded to nearest integer
- Controls default to **"not-implemented"** until positive evidence is detected or findings map them to **"fail"**

### Control Status Values

| Status | Meaning | Effect on Score |
|--------|---------|----------------|
| `pass` | Control requirements are met | Counts toward score |
| `fail` | Control requirements are violated | Counts against score |
| `warning` | Partial compliance | Does not count as pass |
| `not-implemented` | No evidence found | Does not count as pass |
| `not-applicable` | Control does not apply to this project | Excluded from calculation |

### Score Calculation

```
Framework Score = (passed_controls + not_applicable_controls) / total_controls * 100
Overall Score = average of all framework scores
```

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
    # SaaS (4 packs: GDPR, OWASP, CIS, NIST = 39 controls)
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
