# Compliance Score Badge

GESF generates a **compliance score badge** — an SVG image that displays your project's overall compliance score and letter grade. The badge is designed for embedding in your README, documentation site, or any markdown/html page. Alongside the badge, GESF produces a **score summary table** with per-framework breakdowns.

## How It Works

The badge is generated from your compliance score data stored in `.ges/score.json`. It is created by the scoring engine after you run `ges audit` and `ges score`. The badge reflects the **overall weighted score** across all installed policy packs, with an automatic letter grade and color indicator.

### Badge Anatomy

The generated SVG badge has two segments:

| Segment | Content | Description |
|---------|---------|-------------|
| Left (grey) | `compliance` | Static label identifying this as a GESF compliance badge |
| Right (colored) | `100% (A)` | Overall score percentage with letter grade |

The badge color changes based on the letter grade:

| Grade | Score Range | Color | Meaning |
|-------|-------------|------|---------|
| A | 90–100% | Green `#2ea44f` | Excellent — controls are well implemented |
| B | 80–89% | Blue `#84b6eb` | Good — minor gaps remain |
| C | 65–79% | Yellow `#e3b341` | Needs improvement |
| D | 50–64% | Orange `#d29922` | Significant gaps |
| F | 0–49% | Red `#cf222e` | Critical failures or missing controls |

On hover, the SVG `<title>` element shows a tooltip with the **per-framework score breakdown**:

```
Compliance Score: 92% (Grade A)
GDPR: 94% (A)
OWASP: 91% (B)
CIS: 88% (B)
NIST: 95% (A)
```

## Generating the Badge

### Step 1 — Run an Audit

The badge requires compliance score data. Run the audit first:

```bash
ges audit
```

This scans your source code, evaluates controls, and produces `.ges/score.json`.

### Step 2 — Generate the Badge

```bash
ges badge
```

This reads `.ges/score.json` and generates two outputs:

1. **`badge.svg`** — The SVG badge image in your project root
2. **Score summary** — Automatically injected into your `README.md` (if one exists)

Output:

```
  Badge generated: badge.svg
  Score: 92% (A)
  Badge injected into README.md
```

### Step 3 — Verify the Badge

Open `badge.svg` in a browser or check your README — the badge should appear at the top with the score summary table below it.

```bash
open badge.svg          # macOS
xdg-open badge.svg      # Linux
start badge.svg         # Windows
```

## Command Options

```bash
ges badge                                        # Default: badge.svg + README injection
ges badge -o ./docs/assets/images/badge.svg      # Custom output path
ges badge --readme ./docs/README.md               # Inject into a different README
ges badge --no-readme                             # Generate SVG only, skip README injection
```

| Flag | Short | Description | Default |
|------|-------|-------------|---------|
| `--output <path>` | `-o` | Output file path for the SVG badge | `badge.svg` |
| `--readme <path>` | | Path to README file for badge and score injection | `README.md` |
| `--no-readme` | | Skip README injection entirely | — |

## Score Summary Table

When the badge is injected into a README, GESF also adds a **score summary block** between `<!-- GESF-SCORE-START -->` and `<!-- GESF-SCORE-END -->` markers. This block contains:

- Overall score with grade
- Per-framework breakdown (score, grade, controls passed/total)
- Audit findings impact (if any findings exist)
- Last evaluation timestamp

Example of the injected block:

```markdown
<!-- GESF-SCORE-START -->
> **GESF Compliance Score: 92% (A)**
>
> | Framework | Score | Grade | Controls |
> |-----------|-------|-------|----------|
> | GDPR | 94% | A | 21/22 passed |
> | OWASP | 91% | B | 5/6 passed |
> | CIS | 88% | B | 4/5 passed |
> | NIST | 95% | A | 22/23 passed |
>
> Audit findings: 1 high, 2 medium (score deduction: -15%)
>
> _(Last evaluated: 2026-06-02)_
<!-- GESF-SCORE-END -->
```

### How Injection Works

The injection logic handles three scenarios:

1. **No existing badge** — Badge image and score summary are prepended after the first heading
2. **Existing badge, no summary** — Badge is replaced and summary is appended after it
3. **Existing badge and summary** — Both are updated in-place using the `GESF-SCORE-START/END` markers

The markers ensure that repeated `ges badge` calls **update the score** rather than creating duplicate blocks. Your custom README content outside the markers is never modified.

## Embedding the Badge

### In a README

After running `ges badge`, the README is automatically updated. If you prefer manual placement:

```markdown
![GESF Compliance](badge.svg)
```

### In MkDocs / GitHub Pages

Copy the badge SVG into your docs assets and reference it:

```bash
cp badge.svg docs/assets/images/badge.svg
```

Then in your Markdown page:

```markdown
![Compliance Score](assets/images/badge.svg)
```

### In HTML

```html
<img src="badge.svg" alt="Compliance Score: 92% (Grade A)" />
```

### In a CI/CD Pipeline

Generate the badge on every push so it stays current:

```yaml
# .github/workflows/compliance.yml
- name: GESF Compliance Badge
  run: |
    ges audit --ci
    ges badge --no-readme
```

Commit the updated `badge.svg` as part of the CI artifact or deploy it with your documentation.

## Scoring Engine Details

The badge score is calculated by the `@greenarmor/ges-scoring-engine` package using a **severity-weighted** algorithm. Understanding how the score is computed helps you prioritize fixes.

### Severity Weights

Controls are weighted by severity — failing a critical control impacts the score far more than failing a low-severity one:

| Severity | Weight | Score Impact |
|----------|--------|-------------|
| Critical | 10x | Maximum impact |
| High | 7x | High impact |
| Medium | 4x | Moderate impact |
| Low | 1x | Low impact |

### Control Status Credit

| Status | Credit | Effect |
|--------|--------|--------|
| `pass` | 1.0 (100%) | Full credit |
| `not-applicable` | 1.0 (100%) | Full credit (excluded from scoring) |
| `warning` | 0.5 (50%) | Partial credit |
| `fail` | 0.0 (0%) | No credit |
| `not-implemented` | 0.0 (0%) | No credit |

### Score Formula

```
Earned = Σ(control_weight × status_credit)
MaxPossible = Σ(control_weight)
Framework Score = round(Earned / MaxPossible × 100)
```

The overall score is a **control-count-weighted average** across all frameworks — frameworks with more controls contribute proportionally more to the overall score. Frameworks with zero controls are excluded from the average.

### Critical Failure Cap

If any **critical** controls fail, the score is capped:

```
Maximum Score = max(0, 75 - (critical_failures × 8))
```

This means a single critical failure caps the framework score at 67%, two at 59%, etc. This prevents a project from scoring well despite having fundamental security gaps.

### Audit Findings Deduction

After the control-based score is calculated, security findings from `ges audit` apply an additional deduction:

| Finding Severity | Deduction |
|-----------------|-----------|
| Critical | -12% each |
| High | -7% each |
| Medium | -4% each |
| Low | -1% each |

The deduction is subtracted from the overall score (clamped at 0%).

### Complete Calculation Example

A SaaS project with GDPR + OWASP + CIS + NIST packs (56 total controls):

1. **GDPR controls (22):** 16 pass, 2 warning, 2 fail, 2 not-implemented
2. **OWASP controls (6):** 5 pass, 1 warning
3. **CIS controls (5):** 5 pass
4. **NIST controls (23):** 20 pass, 1 fail, 2 not-applicable

After severity weighting and status credit calculation, the engine produces per-framework scores. The overall score is the weighted average. Then audit findings deduct additional points.

```
GDPR ............... 72%  (B)   16/22 passed · 2 critical · 3 high
OWASP .............. 91%  (A)   5/6 passed
CIS ................ 100% (A)   5/5 passed
NIST ............... 87%  (B)   20/23 passed
──────────────────────────────────────────────
Overall ............ 82%  (B)

Audit Findings Impact:
  Critical: 0  ·  High: 2  ·  Medium: 1  ·  Low: 0
  Score deduction: -18%

Final Score: 64% (D)
```

## Keeping the Badge Updated

The badge is a **snapshot** — it reflects the score at the time it was generated. To keep it current:

### Manual

```bash
ges audit && ges badge
```

### CI/CD Automation

Add to your GitHub Actions workflow to regenerate on every push to `main`:

```yaml
name: Compliance Badge
on:
  push:
    branches: [main]

jobs:
  badge:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm install -g @greenarmor/ges
      - run: ges audit
      - run: ges badge
      - uses: stefanzweifel/git-auto-commit-action@v5
        with:
          commit_message: "Update compliance badge"
          file_pattern: badge.svg README.md
```

### Pre-commit Hook

```bash
# .git/hooks/pre-commit
#!/bin/sh
ges audit && ges badge --no-readme
git add badge.svg
```

## Troubleshooting

### "No compliance score available"

The badge requires `.ges/score.json`. Run the full pipeline:

```bash
ges init    # If not initialized
ges audit   # Generate findings and control evaluations
ges badge   # Now the badge can be generated
```

### Badge shows unexpected score

Check the raw score data:

```bash
ges score --ci
```

This outputs the full JSON score including per-framework breakdown, severity weights, and audit impact. Look for:

- `critical_failures > 0` — triggers the critical cap
- `audit_impact.total_deduction` — audit finding deductions
- `not_implemented` controls — these count as 0 credit

### Badge not updating in README

The injection uses `<!-- GESF-SCORE-START -->` and `<!-- GESF-SCORE-END -->` markers. If you manually removed these markers, the injection will create a new block. Ensure the markers are present for in-place updates.

### Score decreased after fixing an issue

This can happen when:

- The fix resolved a finding but changed a control from `warning` to `fail` (partial to zero credit)
- The audit engine detected a new issue in the same run
- The project type or installed packs changed, altering the control set

Always review `ges score --ci` output to understand the exact change.

## File Reference

| File | Location | Purpose |
|------|----------|---------|
| Score data | `.ges/score.json` | Compliance score with per-framework breakdown |
| Badge image | `badge.svg` (project root) | SVG compliance badge |
| Score config | `.ges/config.json` | Project config (name, type, frameworks) |
| Control definitions | `controls/{gdpr,owasp}/controls.json` | Control packs with severity assignments |
