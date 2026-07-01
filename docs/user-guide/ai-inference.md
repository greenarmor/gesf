# AI Inference Engine

The `ges infer` command runs AI-powered analysis on your project's compliance data — audit findings, score history, and activity logs — to surface patterns, root causes, anomalies, and trends that would take hours to find manually.

!!! tip "Zero dependencies, zero network calls"
    The inference engine is **pure math** — n-grams, cosine similarity, graph analysis, z-scores, and linear regression. It runs entirely on your machine with no external API calls. No data leaves your project.

---

## Why AI Inference?

After running audits over weeks or months, you accumulate data that tells a story:

- **Which files cause the most findings?** A single misconfigured middleware can trigger 8+ findings.
- **Are my scores trending up or down?** Subtle degradation is invisible in a single score snapshot.
- **Did that policy install actually help?** Scores drop naturally when you add controls — but by how much, and is it an anomaly?
- **Can I group these 47 findings into a few real problems?** Clustering reveals that most findings are variations of the same issue.

GESF's inference engine answers all four questions in one command.

---

## How It Works

The engine processes data from your `.ges/` directory:

```
.ges/last-audit.json   ──→  📊 Finding Clusterer    ──→  Patterns
.ges/score.json        ──→  🔍 Root Cause Analyzer  ──→  Root Causes
.ges/activity-log.json ──→  ⚠️  Score Anomaly        ──→  Anomalies
                               🔮 Trend Predictor      ──→  Projections
```

### The Four Analyzers

| Analyzer | Technique | What It Answers |
|----------|-----------|----------------|
| **Finding Clusterer** | N-gram TF-IDF + cosine similarity + union-find | "These 47 findings are really 3 problems — here are the fixes." |
| **Root Cause Analyzer** | Bipartite graph (findings↔files↔controls) with severity-weighted betweenness centrality | "`src/auth/middleware.ts` is connected to 8 of 14 findings — fix this one file." |
| **Score Anomaly Detector** | Z-score analysis on compliance score deltas + activity log correlation | "GDPR dropped 29% after the CIS policy install — that's anomalous." |
| **Trend Predictor** | Linear regression + R² on score-over-time + threshold projection | "At your current rate, overall score will drop below 80% in ~4 audit cycles." |

---

## Running Inference

### Basic Usage

```bash
# Run inference on current project
ges infer
```

### Example Output

```
╭─ AI Inference Engine ──────────────────────────────────╮
│ Findings:      15 total                                  │
│ Patterns:      3 distinct clusters (80% reduction)       │
│ Root Cause:    src/auth/middleware.ts                    │
│ Impact:        8 of 15 findings (53%)                    │
│ Overall Trend: ▼ declining                              │
│ Anomalies:     ⚠ Score anomalies detected               │
│ Insights:      4 actionable                              │
╰─────────────────────────────────────────────────────────╯

🔍 Root Cause Analysis

  Top Impact Nodes:
    📄 src/auth/middleware.ts
      Connected to 8 findings (53%)  ████████
    🎯 GDPR-ART32-001
      Connected to 6 findings (40%)  ██████

  Summary: src/auth/middleware.ts is the primary root cause,
  connected to 8 of 15 findings (53%).

🗂️  Finding Clustering

  15 findings → 3 clusters (80% reduction)

  CLUSTER-001  critical  SECRETS-001
    Pattern: Hardcoded secrets in source code
    Count:   8 findings in 5 file(s)

  CLUSTER-002  high  AUTH-002
    Pattern: Missing authentication middleware
    Count:   5 findings in 2 file(s)

⚠️  Score Anomalies

  GDPR  ▼ 29%  (94% → 65%)  z-score: 2.85
    Trigger: Policy pack installed: CIS Controls

🔮 Trend Predictions

  Overall:  ▼ declining  85% → 78% (R²=0.94)
  Threshold (80%): in ~3 audit cycles
```

### CI Mode (JSON)

```bash
# Machine-readable output for CI/CD pipelines
ges infer --ci
```

```json
{
  "generatedAt": "2026-07-01T10:00:00.000Z",
  "summary": {
    "totalFindings": 15,
    "distinctPatterns": 3,
    "reductionRatio": 80,
    "topRootCause": "src/auth/middleware.ts",
    "topRootCauseImpact": "8 of 15 findings (53%)",
    "hasScoreAnomalies": true,
    "overallTrend": "declining",
    "insightCount": 4
  },
  "clustering": { ... },
  "rootCause": { ... },
  "scoreAnomalies": { ... },
  "trends": { ... }
}
```

---

## MCP Integration

The inference engine is available as an MCP tool — ask any connected AI assistant:

```
Run AI inference on my project
```

!!! info "MCP Tool"
    Tool name: `run_inference`. Returns a structured Markdown report with clustering, root cause analysis, anomalies, and trend predictions. Accepts optional `project_path` argument.

---

## Dashboard: AI Insights Tab

The web dashboard includes an **"🤖 AI Insights"** tab (8th navigation tab).

1. Start the dashboard: `ges dashboard`
2. Navigate to the **🤖 AI Insights** tab
3. Click **▶ Run Inference**
4. Results render in four expandable sections:
   - **Summary cards**: findings, patterns, trend, insight count
   - **Root cause table**: top nodes with severity-weighted impact bars
   - **Finding clusters**: cards with rule ID, severity, and fix guidance
   - **Score anomalies & trends**: z-score badges and per-framework forecast tables

!!! note "Lazy-Loading"
    The inference runs on-demand — it's not part of the initial page load. This keeps the dashboard fast for projects with large audit histories.

---

## Understanding the Results

### Finding Clusters

Two findings are clustered together if they share the same `ruleId` OR have high text similarity (cosine similarity ≥ 0.55 on n-gram token vectors). The cluster's **severity** is the maximum of its members. The **representative fix** comes from the highest-severity finding.

A high `reductionRatio` (>50%) means your findings are repetitive — fix one pattern and many issues resolve simultaneously.

### Root Cause Analysis

The engine builds a **bipartite graph** where findings connect to files and controls. Each node is scored by:

- **Severity Score**: weighted sum of connected finding severities (critical=40, high=20, medium=8, low=2)
- **Betweenness**: fraction of all findings connected to this node

The top root cause is the node with the highest `severityScore × betweenness`. A file appearing as root cause means "fix this one file" — a control appearing means "this control is systematically failing."

### Score Anomalies

The engine computes the **mean and standard deviation** of score deltas for each framework across audit runs. The most recent delta is flagged as anomalous if:

- `|z-score| > 1.5` (statistically significant deviation from normal score changes)
- `|delta| > 5%` (meaningful magnitude — filters out noise)

When only 2 data points exist (one delta), large changes (>10%) are treated as anomalous without z-score calculation.

The engine also correlates anomalies with **activity log entries** within 12 hours — policy installs, audits, and auto-fixes are the most common triggers.

### Trend Predictions

**Linear regression** (ordinary least squares) on score-over-time for each framework and overall:

- **Slope**: rate of change per audit cycle (positive = improving, negative = declining)
- **R²**: fit quality — >0.7 is strong, 0.4–0.7 is moderate, <0.4 is weak
- **Projected Score**: one cycle ahead based on the regression line
- **Cycles to Threshold**: how many audit cycles until the score crosses the 80% threshold

A "stable" trend (|slope| < 1) means scores are holding steady — neither improving nor declining.

---

## When to Run Inference

| Scenario | What You'll Learn |
|----------|-------------------|
| **After each audit** | Clustering reveals new patterns; RCA identifies hot files |
| **After installing a policy pack** | Anomaly detector flags the score impact |
| **Before a release/audit** | Trend predictor shows if you're on track or at risk |
| **After auto-fix (`ges fix`)** | Verify the fix improved the RCA and trend direction |
| **Weekly/monthly review** | Score history accumulates → better anomaly detection and trend quality |

---

## Exercises

!!! example "Exercise 1: First Inference Run"

    Run inference on a fresh or existing GESF project and interpret the results.

    1. Initialize a test project with seeded code:

    ```bash
    mkdir /tmp/infer-exercise && cd /tmp/infer-exercise
    mkdir src
    echo "const API_KEY = 'sk-1234567890abcdef'" > src/secrets.ts
    echo "const DB_PASSWORD = 'admin123'" > src/config.ts
    echo "app.get('/admin', handler)" > src/routes.ts
    ges init -n "Inference Lab" -t saas -c EU --force
    ```

    2. Run the first audit:

    ```bash
    ges audit
    ```

    3. Run inference:

    ```bash
    ges infer
    ```

    4. Answer these questions:
       - How many findings were clustered? How many distinct patterns?
       - What is the root cause — a file or a control?
       - Is the reduction ratio > 50%? What does that tell you?
       - How many insights were generated?

    5. Run in JSON mode and inspect the full report:

    ```bash
    ges infer --ci | python3 -m json.tool | head -50
    ```

    !!! question "Questions"
        - What is the difference between `totalFindings` and `distinctPatterns`?
        - How does the `reductionRatio` help prioritize fixes?
        - Why might the trend be "unknown" after only one audit?

!!! example "Exercise 2: Multi-Audit Trend Detection"

    Simulate progressive improvement to observe trend direction.

    1. Continuing from Exercise 1, fix a finding and re-audit:

    ```bash
    ges fix
    ges audit
    ```

    2. Run inference again:

    ```bash
    ges infer
    ```

    3. Note the trend direction — has it changed?

    4. Run a third audit (no changes) to build more data points:

    ```bash
    ges audit
    ges infer
    ```

    5. Observe:
       - Has the R² value improved with more data points?
       - Does the trend predictor now show cycles to threshold?
       - Did the fix change the root cause ranking?

    !!! question "Questions"
        - Why does R² improve with more audit cycles?
        - What does a "stable" trend mean vs "declining"?
        - How would you use the `cyclesToThreshold` number in sprint planning?

!!! example "Exercise 3: Score Anomaly Detection"

    Trigger a score anomaly by installing a new policy pack.

    1. Note your current scores:

    ```bash
    ges score
    ```

    2. Install a new policy pack to increase the control count:

    ```bash
    ges policy install cis
    ges audit
    ```

    3. Run inference:

    ```bash
    ges infer
    ```

    4. Look at the **Score Anomalies** section:
       - Which frameworks show anomalies?
       - What is the z-score? Is it above 1.5?
       - What is the triggering event?

    5. Fix some of the new controls' findings:

    ```bash
    ges fix
    ges audit
    ges infer
    ```

    6. Observe whether the anomaly resolved itself.

    !!! question "Questions"
        - Why does installing a policy pack cause a score anomaly?
        - Is a score drop after a policy install always bad? Why or why not?
        - How does the activity log correlation help explain anomalies?

!!! example "Exercise 4: Dashboard AI Insights Tab"

    Use the web dashboard to visualize inference results.

    1. Start the dashboard:

    ```bash
    ges dashboard
    ```

    2. Open `http://localhost:3001` and navigate to the **🤖 AI Insights** tab.

    3. Click **▶ Run Inference**.

    4. Explore each section:
       - **Summary cards**: Verify counts match CLI output
       - **Root cause table**: Click through to related findings
       - **Finding clusters**: Compare the visual cards with CLI output
       - **Trend table**: Note the R² values and threshold projections

    5. Run another audit, then re-click **▶ Run Inference** — observe how the data updates.

    !!! question "Questions"
        - How does the dashboard visualization differ from CLI output?
        - When would you use the dashboard vs the CLI for inference?
        - What happens when you reload the page without re-running inference?

!!! example "Exercise 5: MCP Inference Integration"

    Use an AI assistant to interpret inference results.

    1. Ensure your MCP client is configured (see [MCP Setup Guide](../mcp/setup.md)).

    2. Ask your AI assistant:

    ```
    Run AI inference on /tmp/infer-exercise and explain the results.
    What are the top 3 actions I should take based on this report?
    ```

    3. Compare the assistant's interpretation with your own reading of `ges infer`.

    4. Try a follow-up question:

    ```
    Based on the trend predictions, will this project pass a compliance
    audit in 3 months if the current rate of fixes continues?
    ```

    !!! question "Questions"
        - How does the MCP tool output differ from the CLI?
        - What value does the AI assistant add beyond raw inference results?
        - In what scenarios would you use MCP vs CLI vs dashboard?

!!! example "Exercise 6: Full Inference Workflow"

    Simulate a real-world compliance improvement cycle using all tools.

    1. Create a realistic project:

    ```bash
    mkdir /tmp/infer-workflow && cd /tmp/infer-workflow
    mkdir -p src/routes src/middleware
    echo "const SECRET = 'prod-key-12345'" > src/config.ts
    echo "app.post('/login', handler)" > src/routes/auth.ts
    echo "app.get('/users', handler)" > src/routes/users.ts
    echo "const pw = md5(user.password)" > src/middleware/crypto.ts
    ges init -n "Workflow Test" -t api-backend -c EU --force
    ```

    2. Run the baseline:

    ```bash
    ges audit
    ges score
    ges infer --ci > baseline-report.json
    ```

    3. Fix the critical finding:

    ```bash
    rm src/config.ts
    echo "const pw = argon2.hash(user.password)" > src/middleware/crypto.ts
    ges audit
    ges infer --ci > after-fix-report.json
    ```

    4. Add more controls:

    ```bash
    ges policy install owasp
    ges policy install nist
    ges audit
    ges infer --ci > after-packs-report.json
    ```

    5. Fix all auto-fixable issues:

    ```bash
    ges fix
    ges audit
    ges infer --ci > final-report.json
    ```

    6. Compare the four reports:

    ```bash
    for f in baseline after-fix after-packs final; do
      echo "=== $f ==="
      python3 -c "import json; r=json.load(open('${f}-report.json')); print(f'  Score: {r[\"summary\"][\"overallTrend\"]}, Insights: {r[\"summary\"][\"insightCount\"]}, Clusters: {r[\"summary\"][\"distinctPatterns\"]}')"
    done
    ```

    !!! question "Questions"
        - How did the trend direction change across the four reports?
        - Did the root cause change after fixing `src/config.ts`?
        - At which stage was the reduction ratio highest? Why?
        - What would you present to a compliance auditor from this data?
