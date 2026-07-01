import type { ScoreDataPoint, ScoreAnomaly, ScoreAnomalyResult, ActivityEntry } from "../types.js";

/**
 * Score anomaly detection using z-score analysis on score deltas.
 *
 * Takes a history of score data points and detects which frameworks
 * experienced statistically significant score changes (|z-score| > 1.5).
 *
 * Also correlates anomalies with recent activity log entries to identify
 * triggering events (e.g., policy install, audit, fix).
 */
export function detectScoreAnomalies(
  scoreHistory: ScoreDataPoint[],
  activityLog: ActivityEntry[],
): ScoreAnomalyResult {
  if (scoreHistory.length < 2) {
    return {
      anomalies: [],
      hasAnomalies: false,
      averageScore: scoreHistory.length > 0 ? scoreHistory[0].overall : 0,
      standardDeviation: 0,
      dataPointCount: scoreHistory.length,
    };
  }

  // Collect all framework keys across all data points
  const frameworkKeys = new Set<string>();
  for (const dp of scoreHistory) {
    for (const fw of Object.keys(dp.frameworks)) {
      frameworkKeys.add(fw);
    }
  }

  // For each framework, compute deltas and z-scores
  const anomalies: ScoreAnomaly[] = [];
  const allDeltas: number[] = [];

  for (const fw of frameworkKeys) {
    const fwScores = scoreHistory
      .map((dp) => dp.frameworks[fw])
      .filter((s): s is { score: number } => s !== undefined)
      .map((s) => s.score);

    if (fwScores.length < 2) continue;

    // Compute deltas between consecutive data points
    const deltas: number[] = [];
    for (let i = 1; i < fwScores.length; i++) {
      deltas.push(fwScores[i] - fwScores[i - 1]);
    }

    if (deltas.length === 0) continue;

    // Mean and standard deviation of deltas
    const mean = deltas.reduce((sum, d) => sum + d, 0) / deltas.length;
    const variance = deltas.reduce((sum, d) => sum + (d - mean) ** 2, 0) / deltas.length;
    const stdDev = Math.sqrt(variance);

    for (const d of deltas) {
      allDeltas.push(d);
    }

    // Check the most recent delta for anomaly
    const latestDelta = deltas[deltas.length - 1];
    const prevScore = fwScores[fwScores.length - 2];
    const currScore = fwScores[fwScores.length - 1];

    // z-score: avoid division by zero; with only 1 delta (2 data points), flag by magnitude alone
    const zScore = stdDev > 0 ? Math.abs(latestDelta - mean) / stdDev : (Math.abs(latestDelta) > 10 ? 3 : 0);
    const isAnomalous = zScore > 1.5 && Math.abs(latestDelta) > 5; // z > 1.5 AND meaningful change > 5%

    // Try to find a triggering event near the time of the latest score point
    const latestTimestamp = scoreHistory[scoreHistory.length - 1].evaluatedAt;
    const triggeringEvent = findTriggeringEvent(activityLog, latestTimestamp, fw);

    let description: string;
    if (isAnomalous) {
      const direction = latestDelta < 0 ? "dropped" : "increased";
      const magnitude = Math.abs(latestDelta).toFixed(1);
      description = `${fw} score ${direction} by ${magnitude}% (from ${prevScore.toFixed(0)}% to ${currScore.toFixed(0)}%), z-score: ${zScore.toFixed(2)}.`;
      if (triggeringEvent) {
        description += ` Triggered by: ${triggeringEvent}.`;
      }
    } else {
      description = `${fw} score change of ${latestDelta.toFixed(1)}% is within normal range (z-score: ${zScore.toFixed(2)}).`;
    }

    anomalies.push({
      framework: fw,
      delta: Math.round(latestDelta * 10) / 10,
      previousScore: prevScore,
      currentScore: currScore,
      zScore: Math.round(zScore * 100) / 100,
      isAnomalous,
      evaluatedAt: latestTimestamp,
      triggeringEvent,
      description,
    });
  }

  // Compute overall statistics
  const overallMean = allDeltas.length > 0
    ? allDeltas.reduce((sum, d) => sum + d, 0) / allDeltas.length
    : 0;
  const overallVar = allDeltas.length > 0
    ? allDeltas.reduce((sum, d) => sum + (d - overallMean) ** 2, 0) / allDeltas.length
    : 0;
  const overallStdDev = Math.sqrt(overallVar);

  return {
    anomalies: anomalies.sort((a, b) => b.zScore - a.zScore),
    hasAnomalies: anomalies.some((a) => a.isAnomalous),
    averageScore: Math.round(overallMean * 10) / 10,
    standardDeviation: Math.round(overallStdDev * 10) / 10,
    dataPointCount: scoreHistory.length,
  };
}

/**
 * Find a triggering activity log entry near the given timestamp.
 */
function findTriggeringEvent(
  activityLog: ActivityEntry[],
  targetTimestamp: string,
  framework: string,
): string | null {
  const target = new Date(targetTimestamp).getTime();

  // Look for activity entries within 12 hours before the score drop
  const window = 12 * 60 * 60 * 1000; // 12 hours

  const candidates = activityLog
    .filter((entry) => {
      const entryTime = new Date(entry.timestamp).getTime();
      return entryTime >= target - window && entryTime <= target;
    })
    .sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

  for (const entry of candidates) {
    const actionMap: Record<string, string> = {
      audit: "Audit completed",
      fix: "Auto-fix applied",
      policy_install: "Policy pack installed",
      policy_remove: "Policy pack removed",
      control_override: "Control override applied",
      score: "Score evaluation",
    };

    const label = actionMap[entry.action] ?? entry.action;

    if (entry.action === "audit" || entry.action === "score") {
      return `${label}: ${entry.title}`;
    }

    // For policy installs, check if it affects this framework
    const fwAdded = entry.details?.frameworks_added as string[] | undefined;
    if (fwAdded?.some((fw: string) => fw.toUpperCase() === framework.toUpperCase())) {
      return `${label}: ${entry.title}`;
    }
  }

  return null;
}
