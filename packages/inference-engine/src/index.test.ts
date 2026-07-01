import { describe, it, expect } from "vitest";
import { clusterFindings } from "./analyzers/finding-clusterer.js";
import { analyzeRootCause } from "./analyzers/root-cause.js";
import { detectScoreAnomalies } from "./analyzers/score-anomaly.js";
import { predictTrends } from "./analyzers/trend-predictor.js";
import { runInferenceFromInput } from "./index.js";
import type {
  InferenceFinding,
  ScoreDataPoint,
  ActivityEntry,
  InferenceInput,
} from "./types.js";

// ============================================================
// Finding Clusterer Tests
// ============================================================

describe("finding-clusterer", () => {
  it("returns empty result for empty findings", () => {
    const result = clusterFindings([]);
    expect(result.totalFindings).toBe(0);
    expect(result.clusterCount).toBe(0);
    expect(result.clusters).toEqual([]);
    expect(result.reductionRatio).toBe(0);
  });

  it("clusters findings with the same ruleId together", () => {
    const findings: InferenceFinding[] = [
      makeFinding("SECRETS-001", "hardcoded secret in .env", "src/.env", 1),
      makeFinding("SECRETS-001", "hardcoded secret in config.ts", "src/config.ts", 42),
      makeFinding("AUTH-001", "missing auth middleware", "src/routes.ts", 10),
    ];

    const result = clusterFindings(findings);
    expect(result.totalFindings).toBe(3);
    expect(result.clusters.length).toBeLessThan(3);

    // SECRETS-001 findings should be in same cluster
    const secretsCluster = result.clusters.find((c) => c.ruleId === "SECRETS-001");
    expect(secretsCluster).toBeDefined();
    expect(secretsCluster!.findingCount).toBe(2);
    expect(secretsCluster!.files).toContain("src/.env");
    expect(secretsCluster!.files).toContain("src/config.ts");
  });

  it("clusters similar findings based on text similarity", () => {
    const findings: InferenceFinding[] = [
      makeFinding("AUTH-001", "missing authentication middleware on protected routes", "src/routes.ts", 10),
      makeFinding("AUTH-002", "missing authentication middleware on admin endpoints", "src/admin.ts", 5),
      makeFinding("CRYPTO-001", "weak encryption algorithm detected", "src/crypto.ts", 30),
    ];

    const result = clusterFindings(findings);
    expect(result.totalFindings).toBe(3);
    // AUTH-001 and AUTH-002 should cluster together (high text similarity)
    expect(result.clusters.length).toBeLessThan(3);
  });

  it("picks highest severity as cluster representative", () => {
    const findings: InferenceFinding[] = [
      { ...makeFinding("RULE-001", "low severity issue", "src/a.ts", 1), severity: "low" },
      { ...makeFinding("RULE-001", "critical severity issue", "src/b.ts", 1), severity: "critical" },
      { ...makeFinding("RULE-001", "medium severity issue", "src/c.ts", 1), severity: "medium" },
    ];

    const result = clusterFindings(findings);
    expect(result.clusters.length).toBe(1);
    expect(result.clusters[0].severity).toBe("critical");
    expect(result.clusters[0].findingCount).toBe(3);
  });

  it("computes reduction ratio correctly", () => {
    const findings: InferenceFinding[] = [];
    for (let i = 0; i < 10; i++) {
      findings.push({
        ...makeFinding("SECRETS-001", `hardcoded AWS secret key found`, `src/secrets_${i}.ts`, i),
        description: "A hardcoded secret or API key was found in the source code. This exposes credentials in version control.",
        evidence: "aws_secret_access_key = AKIAIOSFODNN7EXAMPLE at line 42",
        fix: "Remove the hardcoded secret and use a secrets manager or environment variable instead.",
      });
    }
    for (let i = 0; i < 5; i++) {
      findings.push({
        ...makeFinding("AUTH-001", `missing authentication middleware on protected route`, `src/auth_${i}.ts`, i),
        description: "The authentication middleware is missing on a route that requires authorization. Unauthorized requests may access protected resources.",
        evidence: "app.get('/admin', handler) — no auth middleware before handler",
        fix: "Add authentication middleware to the route handler chain.",
      });
    }

    const result = clusterFindings(findings);
    expect(result.totalFindings).toBe(15);
    expect(result.clusters.length).toBe(2);
    expect(result.reductionRatio).toBeCloseTo(86.7, 0); // (1 - 2/15) * 100 ≈ 86.7
  });
});

// ============================================================
// Root Cause Analyzer Tests
// ============================================================

describe("root-cause", () => {
  it("returns empty result for empty findings", () => {
    const result = analyzeRootCause([]);
    expect(result.nodes).toEqual([]);
    expect(result.topCause).toBeNull();
    expect(result.totalFindingsTraced).toBe(0);
  });

  it("identifies the file with most connections as root cause", () => {
    const findings: InferenceFinding[] = [
      makeFinding("AUTH-001", "missing auth in endpoint", "src/routes.ts", 10),
      makeFinding("CONFIG-001", "weak CSP header", "src/routes.ts", 15),
      makeFinding("CONFIG-002", "missing rate limiting", "src/routes.ts", 20),
      makeFinding("SECRETS-001", "hardcoded key", "src/config.ts", 5),
      makeFinding("SECRETS-001", "another hardcoded key", "src/other.ts", 1),
    ];

    const result = analyzeRootCause(findings);
    expect(result.topCause).not.toBeNull();
    expect(result.topCause!.identifier).toBe("src/routes.ts");
    expect(result.topCause!.connectedFindings).toHaveLength(3);
    expect(result.topCause!.betweenness).toBe(3 / 5);
  });

  it("includes control nodes in the graph", () => {
    const findings: InferenceFinding[] = [
      { ...makeFinding("AUTH-001", "auth issue", "src/a.ts", 1), controlIds: ["GDPR-ART32-001", "OWASP-AUTH-001"] },
      { ...makeFinding("CRYPTO-001", "crypto issue", "src/b.ts", 1), controlIds: ["GDPR-ART32-002", "GDPR-ART32-001"] },
    ];

    const result = analyzeRootCause(findings);
    const controlNodes = result.nodes.filter((n) => n.type === "control");
    expect(controlNodes.length).toBeGreaterThan(0);

    // GDPR-ART32-001 appears in both findings → connectedFindings should be 2
    const gdprNode = controlNodes.find((n) => n.identifier === "GDPR-ART32-001");
    expect(gdprNode).toBeDefined();
    expect(gdprNode!.connectedFindings).toHaveLength(2);
  });

  it("sorts nodes by impact (severityScore × betweenness)", () => {
    const findings: InferenceFinding[] = [
      { ...makeFinding("AUTH-001", "auth", "src/routes.ts", 1), severity: "critical" },
      { ...makeFinding("AUTH-001", "auth2", "src/routes.ts", 2), severity: "critical" },
      { ...makeFinding("CONFIG-001", "config", "src/utils.ts", 1), severity: "low" },
    ];

    const result = analyzeRootCause(findings);
    expect(result.nodes[0].identifier).toBe("src/routes.ts");
    expect(result.nodes[0].severityScore).toBeGreaterThan(result.nodes[result.nodes.length - 1].severityScore);
  });
});

// ============================================================
// Score Anomaly Detection Tests
// ============================================================

describe("score-anomaly", () => {
  it("returns empty result for insufficient data", () => {
    const result = detectScoreAnomalies([], []);
    expect(result.anomalies).toEqual([]);
    expect(result.hasAnomalies).toBe(false);
    expect(result.dataPointCount).toBe(0);
  });

  it("returns empty anomalies for single data point", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94, OWASP: 96 }),
    ];
    const result = detectScoreAnomalies(history, []);
    expect(result.dataPointCount).toBe(1);
    expect(result.hasAnomalies).toBe(false);
  });

  it("detects anomalous score drop", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94, OWASP: 96 }),
      makeScorePoint("2026-01-02T00:00:00Z", 90, { GDPR: 90, OWASP: 96 }),
      makeScorePoint("2026-01-03T00:00:00Z", 72, { GDPR: 65, OWASP: 90 }),
    ];

    const result = detectScoreAnomalies(history, []);
    expect(result.dataPointCount).toBe(3);

    const gdprAnomaly = result.anomalies.find((a) => a.framework === "GDPR");
    expect(gdprAnomaly).toBeDefined();
    // GDPR dropped from 90 to 65 — significant drop
    expect(gdprAnomaly!.delta).toBe(-25);
  });

  it("does not flag small changes as anomalous", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
      makeScorePoint("2026-01-02T00:00:00Z", 94, { GDPR: 93 }),
      makeScorePoint("2026-01-03T00:00:00Z", 93, { GDPR: 92 }),
    ];

    const result = detectScoreAnomalies(history, []);
    // Small changes within normal range
    expect(result.anomalies.every((a) => !a.isAnomalous)).toBe(true);
  });

  it("correlates with activity log for triggering events", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
      makeScorePoint("2026-01-02T06:00:00Z", 72, { GDPR: 65 }),
    ];

    const activity: ActivityEntry[] = [
      makeActivityEntry("2026-01-02T05:00:00Z", "policy_install", "New policy installed", {
        frameworks_added: ["GDPR"],
      }),
    ];

    const result = detectScoreAnomalies(history, activity);
    expect(result.hasAnomalies).toBe(true);

    const gdprAnomaly = result.anomalies.find((a) => a.framework === "GDPR");
    expect(gdprAnomaly?.triggeringEvent).toBe("Policy pack installed: New policy installed");
  });
});

// ============================================================
// Trend Predictor Tests
// ============================================================

describe("trend-predictor", () => {
  it("returns empty result for insufficient data", () => {
    const result = predictTrends([]);
    expect(result.predictions).toEqual([]);
    expect(result.overall).toBeNull();
    expect(result.dataPointCount).toBe(0);
  });

  it("identifies declining trend", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
      makeScorePoint("2026-01-02T00:00:00Z", 90, { GDPR: 88 }),
      makeScorePoint("2026-01-03T00:00:00Z", 85, { GDPR: 82 }),
    ];

    const result = predictTrends(history);
    expect(result.overall).not.toBeNull();
    expect(result.overall!.trendDirection).toBe("declining");
    expect(result.overall!.currentScore).toBe(85);
    expect(result.overall!.projectedScore).toBeLessThan(85);
  });

  it("identifies improving trend", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 70, { GDPR: 68 }),
      makeScorePoint("2026-01-02T00:00:00Z", 75, { GDPR: 73 }),
      makeScorePoint("2026-01-03T00:00:00Z", 82, { GDPR: 80 }),
    ];

    const result = predictTrends(history);
    expect(result.overall!.trendDirection).toBe("improving");
    expect(result.overall!.projectedScore).toBeGreaterThan(82);
  });

  it("identifies stable trend for small changes", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 92, { GDPR: 91 }),
      makeScorePoint("2026-01-02T00:00:00Z", 93, { GDPR: 90 }),
      makeScorePoint("2026-01-03T00:00:00Z", 92, { GDPR: 91 }),
    ];

    const result = predictTrends(history);
    expect(result.overall!.trendDirection).toBe("stable");
  });

  it("computes cycles to threshold for declining trends", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
      makeScorePoint("2026-01-02T00:00:00Z", 90, { GDPR: 89 }),
      makeScorePoint("2026-01-03T00:00:00Z", 85, { GDPR: 84 }),
    ];

    const result = predictTrends(history);
    expect(result.overall!.cyclesToThreshold).not.toBeNull();
    expect(result.overall!.cyclesToThreshold).toBeGreaterThan(0);
  });

  it("computes predictions per framework", () => {
    const history: ScoreDataPoint[] = [
      makeScorePoint("2026-01-01T00:00:00Z", 90, { GDPR: 95, OWASP: 85 }),
      makeScorePoint("2026-01-02T00:00:00Z", 88, { GDPR: 92, OWASP: 84 }),
      makeScorePoint("2026-01-03T00:00:00Z", 85, { GDPR: 88, OWASP: 83 }),
    ];

    const result = predictTrends(history);
    expect(result.predictions.length).toBeGreaterThanOrEqual(2);
    expect(result.overall).not.toBeNull();
  });
});

// ============================================================
// Full Inference Pipeline Tests
// ============================================================

describe("inference pipeline", () => {
  it("runs full pipeline with all data present", () => {
    const input: InferenceInput = {
      findings: [
        makeFinding("SECRETS-001", "hardcoded secret in .env", "src/.env", 1),
        makeFinding("SECRETS-001", "hardcoded API key", "src/config.ts", 2),
        makeFinding("AUTH-001", "missing auth middleware", "src/routes.ts", 1),
      ],
      scoreHistory: [
        makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
        makeScorePoint("2026-01-02T00:00:00Z", 90, { GDPR: 88 }),
        makeScorePoint("2026-01-03T00:00:00Z", 85, { GDPR: 82 }),
      ],
      activityLog: [],
    };

    const report = runInferenceFromInput(input);

    // Clustering
    expect(report.clustering).not.toBeNull();
    expect(report.clustering!.totalFindings).toBe(3);

    // Root cause
    expect(report.rootCause).not.toBeNull();
    expect(report.rootCause!.topCause).not.toBeNull();

    // Score anomalies
    expect(report.scoreAnomalies).not.toBeNull();
    expect(report.scoreAnomalies!.dataPointCount).toBe(3);

    // Trends
    expect(report.trends).not.toBeNull();
    expect(report.trends!.overall).not.toBeNull();

    // Summary
    expect(report.summary.totalFindings).toBe(3);
    expect(report.summary.insightCount).toBeGreaterThanOrEqual(1);
  });

  it("handles empty input gracefully", () => {
    const input: InferenceInput = { findings: [], scoreHistory: [], activityLog: [] };
    const report = runInferenceFromInput(input);

    expect(report.clustering).toBeNull();
    expect(report.rootCause).toBeNull();
    expect(report.scoreAnomalies).toBeNull();
    expect(report.trends).toBeNull();
    expect(report.summary.totalFindings).toBe(0);
    expect(report.summary.insightCount).toBe(0);
  });

  it("handles findings-only input", () => {
    const input: InferenceInput = {
      findings: [
        makeFinding("SECRETS-001", "secret", "src/a.ts", 1),
      ],
      scoreHistory: [],
      activityLog: [],
    };

    const report = runInferenceFromInput(input);
    expect(report.clustering).not.toBeNull();
    expect(report.rootCause).not.toBeNull();
    expect(report.scoreAnomalies).toBeNull(); // no score history
    expect(report.trends).toBeNull(); // no score history
  });

  it("handles score-only input", () => {
    const input: InferenceInput = {
      findings: [],
      scoreHistory: [
        makeScorePoint("2026-01-01T00:00:00Z", 95, { GDPR: 94 }),
        makeScorePoint("2026-01-02T00:00:00Z", 90, { GDPR: 88 }),
      ],
      activityLog: [],
    };

    const report = runInferenceFromInput(input);
    expect(report.clustering).toBeNull();
    expect(report.rootCause).toBeNull();
    expect(report.scoreAnomalies).not.toBeNull();
    expect(report.trends).not.toBeNull();
  });
});

// ============================================================
// Helpers
// ============================================================

function makeFinding(
  ruleId: string,
  title: string,
  file: string,
  line: number,
): InferenceFinding {
  return {
    ruleId,
    severity: "high",
    category: "security",
    title,
    description: `${title} was detected in the codebase and requires immediate attention.`,
    file,
    line,
    evidence: `Evidence of ${ruleId} at ${file}:${line}. This represents a compliance gap.`,
    controlIds: [`${ruleId}`],
    fix: `Fix for ${ruleId}: Apply the recommended security control.`,
  };
}

function makeScorePoint(
  evaluatedAt: string,
  overall: number,
  frameworks: Record<string, number>,
): ScoreDataPoint {
  const fw: Record<string, { score: number }> = {};
  for (const [key, val] of Object.entries(frameworks)) {
    fw[key] = { score: val };
  }
  return { overall, evaluatedAt, frameworks: fw };
}

function makeActivityEntry(
  timestamp: string,
  action: string,
  title: string,
  details?: Record<string, unknown>,
): ActivityEntry {
  return {
    timestamp,
    action,
    title,
    description: `Activity: ${title}`,
    status: "success",
    details: details ?? {},
  };
}
