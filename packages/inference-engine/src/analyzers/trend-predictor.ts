import type { ScoreDataPoint, TrendPrediction, TrendPredictionResult } from "../types.js";

const DEFAULT_THRESHOLD = 80;

/**
 * Trend prediction via simple linear regression on score-over-time.
 *
 * For each framework (and overall), computes:
 *   - slope: rate of score change per data point
 *   - rSquared: fit quality
 *   - projected score: current + slope (one step ahead)
 *   - cyclesToThreshold: how many data points until crossing the 80% threshold
 *   - trendDirection: improving, declining, or stable
 */
export function predictTrends(scoreHistory: ScoreDataPoint[]): TrendPredictionResult {
  if (scoreHistory.length < 2) {
    return {
      predictions: [],
      overall: null,
      dataPointCount: scoreHistory.length,
    };
  }

  // Extract overall score series
  const overallScores = scoreHistory.map((dp) => dp.overall);
  const overallPrediction = computePrediction("overall", overallScores);

  // Collect all framework keys
  const frameworkKeys = new Set<string>();
  for (const dp of scoreHistory) {
    for (const fw of Object.keys(dp.frameworks)) {
      frameworkKeys.add(fw);
    }
  }

  // Compute predictions per framework
  const predictions: TrendPrediction[] = [];
  for (const fw of frameworkKeys) {
    const fwScores = scoreHistory
      .map((dp) => dp.frameworks[fw])
      .filter((s): s is { score: number } => s !== undefined)
      .map((s) => s.score);

    if (fwScores.length < 2) continue;

    const prediction = computePrediction(fw, fwScores);
    predictions.push(prediction);
  }

  return {
    predictions: predictions.sort((a, b) => b.rSquared - a.rSquared),
    overall: overallPrediction,
    dataPointCount: scoreHistory.length,
  };
}

function computePrediction(name: string, scores: number[]): TrendPrediction {
  const n = scores.length;

  // Linear regression: y = slope * x + intercept
  const xValues = scores.map((_, i) => i); // 0, 1, 2, ... (time steps)
  const yValues = scores;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (let i = 0; i < n; i++) {
    sumX += xValues[i];
    sumY += yValues[i];
    sumXY += xValues[i] * yValues[i];
    sumX2 += xValues[i] * xValues[i];
    sumY2 += yValues[i] * yValues[i];
  }

  const denominator = n * sumX2 - sumX * sumX;
  let slope: number;
  let intercept: number;

  if (denominator === 0) {
    // All x values are the same (shouldn't happen with 0,1,2...)
    slope = 0;
    intercept = sumY / n;
  } else {
    slope = (n * sumXY - sumX * sumY) / denominator;
    intercept = (sumY * sumX2 - sumX * sumXY) / denominator;
  }

  // R-squared
  const meanY = sumY / n;
  let ssTot = 0, ssRes = 0;
  for (let i = 0; i < n; i++) {
    const predicted = slope * xValues[i] + intercept;
    ssTot += (yValues[i] - meanY) ** 2;
    ssRes += (yValues[i] - predicted) ** 2;
  }
  const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

  // Projected score (one step ahead)
  const currentScore = yValues[n - 1];
  const projectedScore = slope * n + intercept;

  // Cycles to threshold
  let cyclesToThreshold: number | null = null;

  if (slope !== 0) {
    // Solve: slope * t + intercept = threshold
    const stepsToCross = (DEFAULT_THRESHOLD - intercept) / slope;
    // t is relative to x=0, current position is at x=n-1
    const stepsRemaining = stepsToCross - (n - 1);
    if (stepsRemaining > 0 && stepsRemaining < 1000) {
      cyclesToThreshold = Math.round(stepsRemaining);
    }
  } else if (currentScore < DEFAULT_THRESHOLD) {
    // flat below threshold — already there
    cyclesToThreshold = 0;
  }

  // Trend direction
  let trendDirection: "improving" | "declining" | "stable";
  if (Math.abs(slope) < 1) {
    trendDirection = "stable";
  } else if (slope > 0) {
    trendDirection = "improving";
  } else {
    trendDirection = "declining";
  }

  // Description
  let description: string;
  const directionWord = slope > 0 ? "improving" : slope < 0 ? "declining" : "holding steady";
  const absRate = Math.abs(slope).toFixed(1);
  const quality = rSquared > 0.7 ? "strong" : rSquared > 0.4 ? "moderate" : "weak";

  if (name === "overall") {
    description = `Overall score is ${directionWord} at ${absRate}% per audit cycle (${quality} fit, R²=${rSquared.toFixed(2)}).`;
  } else {
    description = `${name} is ${directionWord} at ${absRate}% per audit cycle (${quality} fit, R²=${rSquared.toFixed(2)}).`;
  }

  return {
    framework: name,
    slope: Math.round(slope * 100) / 100,
    intercept: Math.round(intercept * 100) / 100,
    rSquared: Math.round(rSquared * 1000) / 1000,
    currentScore: Math.round(currentScore * 10) / 10,
    projectedScore: Math.round(projectedScore * 10) / 10,
    cyclesToThreshold,
    threshold: DEFAULT_THRESHOLD,
    trendDirection,
    description,
  };
}
