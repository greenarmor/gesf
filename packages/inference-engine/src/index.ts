import * as fs from "node:fs";
import * as path from "node:path";
import type {
  InferenceInput,
  InferenceReport,
  InferenceSummary,
  ScoreDataPoint,
  ActivityEntry,
  InferenceFinding,
} from "./types.js";
export type { InferenceInput, InferenceReport, InferenceSummary, ScoreDataPoint, ActivityEntry, InferenceFinding };
export type { FindingCluster, ClusteringResult, RootCauseNode, RootCauseResult, ScoreAnomaly, ScoreAnomalyResult, TrendPrediction, TrendPredictionResult } from "./types.js";
import { clusterFindings } from "./analyzers/finding-clusterer.js";
import { analyzeRootCause } from "./analyzers/root-cause.js";
import { detectScoreAnomalies } from "./analyzers/score-anomaly.js";
import { predictTrends } from "./analyzers/trend-predictor.js";

/**
 * Load all inference input data from a project's .ges/ directory.
 */
export function loadInferenceInput(projectPath: string): InferenceInput {
  const gesDir = path.join(projectPath, ".ges");

  const findings = loadFindings(gesDir);
  const scoreHistory = loadScoreHistory(gesDir);
  const activityLog = loadActivity(gesDir);

  return { findings, scoreHistory, activityLog };
}

/**
 * Run the full inference pipeline on a project.
 */
export function runInference(projectPath: string): InferenceReport {
  const input = loadInferenceInput(projectPath);
  return runInferenceFromInput(input);
}

/**
 * Run inference from pre-loaded input data (useful for testing).
 */
export function runInferenceFromInput(input: InferenceInput): InferenceReport {
  const clustering = input.findings.length > 0
    ? clusterFindings(input.findings)
    : null;

  const rootCause = input.findings.length > 0
    ? analyzeRootCause(input.findings)
    : null;

  const scoreAnomalies = input.scoreHistory.length >= 2
    ? detectScoreAnomalies(input.scoreHistory, input.activityLog)
    : null;

  const trends = input.scoreHistory.length >= 2
    ? predictTrends(input.scoreHistory)
    : null;

  const summary = buildSummary(input, clustering, rootCause, scoreAnomalies, trends);

  return {
    generatedAt: new Date().toISOString(),
    clustering,
    rootCause,
    scoreAnomalies,
    trends,
    summary,
  };
}

// ============================================================
// Data loaders
// ============================================================

function loadFindings(gesDir: string): InferenceFinding[] {
  const findingsPath = path.join(gesDir, "last-audit.json");
  try {
    const raw = fs.readFileSync(findingsPath, "utf-8");
    const data = JSON.parse(raw);
    const findings = Array.isArray(data.findings) ? data.findings : [];
    // Filter out invalid entries
    return findings.filter(
      (f: unknown) =>
        f !== null &&
        typeof f === "object" &&
        typeof (f as Record<string, unknown>).ruleId === "string",
    ) as InferenceFinding[];
  } catch {
    return [];
  }
}

function loadScoreHistory(gesDir: string): ScoreDataPoint[] {
  const historyPath = path.join(gesDir, "score.json");
  try {
    const raw = fs.readFileSync(historyPath, "utf-8");
    const data = JSON.parse(raw);

    // score.json is a single ScoreFile. Build a single-element history.
    if (data && typeof data.overall === "number") {
      const point: ScoreDataPoint = {
        overall: data.overall,
        evaluatedAt: data.evaluated_at ?? new Date().toISOString(),
        frameworks: {},
      };

      if (data.frameworks && typeof data.frameworks === "object") {
        for (const [key, val] of Object.entries(data.frameworks)) {
          if (val !== null && typeof val === "object" && typeof (val as Record<string, unknown>).score === "number") {
            point.frameworks[key] = { score: (val as { score: number }).score };
          }
        }
      }

      return [point];
    }
    return [];
  } catch {
    return [];
  }
}

function loadActivity(gesDir: string): ActivityEntry[] {
  const activityPath = path.join(gesDir, "activity-log.json");
  try {
    const raw = fs.readFileSync(activityPath, "utf-8");
    const data = JSON.parse(raw);
    const entries = Array.isArray(data) ? data : [];
    return entries.filter(
      (e: unknown) =>
        e !== null &&
        typeof e === "object" &&
        typeof (e as Record<string, unknown>).timestamp === "string",
    ) as ActivityEntry[];
  } catch {
    return [];
  }
}

// ============================================================
// Summary builder
// ============================================================

function buildSummary(
  input: InferenceInput,
  clustering: ReturnType<typeof clusterFindings> | null,
  rootCause: ReturnType<typeof analyzeRootCause> | null,
  scoreAnomalies: ReturnType<typeof detectScoreAnomalies> | null,
  trends: ReturnType<typeof predictTrends> | null,
): InferenceSummary {
  let insightCount = 0;

  // Count insights from each analyzer
  if (clustering && clustering.clusterCount > 0 && clustering.reductionRatio > 20) insightCount++;
  if (rootCause?.topCause) insightCount++;
  if (scoreAnomalies?.hasAnomalies) {
    insightCount += scoreAnomalies.anomalies.filter((a) => a.isAnomalous).length;
  }
  if (trends?.overall && trends.overall.trendDirection === "declining") insightCount++;
  for (const pred of trends?.predictions ?? []) {
    if (pred.trendDirection === "declining" && pred.cyclesToThreshold !== null) insightCount++;
  }

  return {
    totalFindings: input.findings.length,
    distinctPatterns: clustering?.clusterCount ?? 0,
    reductionRatio: clustering?.reductionRatio ?? 0,
    topRootCause: rootCause?.topCause?.identifier ?? null,
    topRootCauseImpact: rootCause?.topCause
      ? `${rootCause.topCause.connectedFindings.length} of ${rootCause.totalFindingsTraced} findings (${Math.round(rootCause.topCause.betweenness * 100)}%)`
      : null,
    hasScoreAnomalies: scoreAnomalies?.hasAnomalies ?? false,
    overallTrend: trends?.overall?.trendDirection ?? "unknown",
    insightCount,
  };
}
