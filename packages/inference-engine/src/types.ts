import type { SeverityLevel } from "@greenarmor/ges-core";

// ============================================================
// Finding-like structure (works with audit-engine Finding)
// ============================================================
export interface InferenceFinding {
  ruleId: string;
  severity: SeverityLevel;
  category: string;
  title: string;
  description: string;
  file: string;
  line?: number;
  evidence: string;
  controlIds: string[];
  fix: string;
}

// ============================================================
// Score data point for time-series analysis
// ============================================================
export interface ScoreDataPoint {
  overall: number;
  evaluatedAt: string;
  frameworks: Record<string, { score: number }>;
}

// ============================================================
// Activity log entry (subset of the core type)
// ============================================================
export interface ActivityEntry {
  timestamp: string;
  action: string;
  title: string;
  description: string;
  status: string;
  details: {
    score?: number;
    findings_count?: number;
    [key: string]: unknown;
  };
}

// ============================================================
// Finding Clustering
// ============================================================
export interface FindingCluster {
  clusterId: string;
  pattern: string;
  ruleId: string;
  category: string;
  severity: SeverityLevel;
  findingCount: number;
  files: string[];
  representativeTitle: string;
  representativeFix: string;
  findingIndices: number[];
}

export interface ClusteringResult {
  totalFindings: number;
  clusterCount: number;
  clusters: FindingCluster[];
  reductionRatio: number;
}

// ============================================================
// Root Cause Analysis
// ============================================================
export interface RootCauseNode {
  type: "file" | "control";
  identifier: string;
  connectedFindings: number[];
  severityScore: number;
  betweenness: number;
  frameworks: string[];
}

export interface RootCauseResult {
  nodes: RootCauseNode[];
  topCause: RootCauseNode | null;
  summary: string;
  totalFindingsTraced: number;
  maxSeverityScore: number;
}

// ============================================================
// Score Anomaly Detection
// ============================================================
export interface ScoreAnomaly {
  framework: string;
  delta: number;
  previousScore: number;
  currentScore: number;
  zScore: number;
  isAnomalous: boolean;
  evaluatedAt: string;
  triggeringEvent: string | null;
  description: string;
}

export interface ScoreAnomalyResult {
  anomalies: ScoreAnomaly[];
  hasAnomalies: boolean;
  averageScore: number;
  standardDeviation: number;
  dataPointCount: number;
}

// ============================================================
// Trend Prediction
// ============================================================
export interface TrendPrediction {
  framework: string;
  slope: number;
  intercept: number;
  rSquared: number;
  currentScore: number;
  projectedScore: number;
  cyclesToThreshold: number | null;
  threshold: number;
  trendDirection: "improving" | "declining" | "stable";
  description: string;
}

export interface TrendPredictionResult {
  predictions: TrendPrediction[];
  overall: TrendPrediction | null;
  dataPointCount: number;
}

// ============================================================
// Full Inference Report
// ============================================================
export interface InferenceReport {
  generatedAt: string;
  clustering: ClusteringResult | null;
  rootCause: RootCauseResult | null;
  scoreAnomalies: ScoreAnomalyResult | null;
  trends: TrendPredictionResult | null;
  summary: InferenceSummary;
}

export interface InferenceSummary {
  totalFindings: number;
  distinctPatterns: number;
  reductionRatio: number;
  topRootCause: string | null;
  topRootCauseImpact: string | null;
  hasScoreAnomalies: boolean;
  overallTrend: "improving" | "declining" | "stable" | "unknown";
  insightCount: number;
}

// ============================================================
// Input data bundle (loaded from .ges/)
// ============================================================
export interface InferenceInput {
  findings: InferenceFinding[];
  scoreHistory: ScoreDataPoint[];
  activityLog: ActivityEntry[];
}
