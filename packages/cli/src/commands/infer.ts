import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { runInference, type InferenceReport } from "@greenarmor/ges-inference-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
import {
  banner, success, warn, info, divider, blank,
  BOLD, DIM, GREEN, RED, YELLOW, CYAN, MAGENTA, GRAY,
} from "../utils/ui.js";

export const inferCommand = new Command("infer")
  .description("Run AI inference on compliance data — clustering, root cause, anomalies, trends")
  .option("--ci", "CI mode — output JSON")
  .action(async (options) => {
    const root = ensureGESInitialized();

    const report = runInference(root);

    if (options.ci) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }

    banner("AI Inference Engine", "Compliance data analysis");

    const s = report.summary;

    // Summary block
    blank();
    console.log(`  ${BOLD("Findings:")}      ${YELLOW(String(s.totalFindings))} total`);
    if (s.distinctPatterns > 0) {
      const reductionText = s.reductionRatio > 50
        ? GREEN(`${s.reductionRatio}%`)
        : s.reductionRatio > 20
          ? YELLOW(`${s.reductionRatio}%`)
          : GRAY(`${s.reductionRatio}%`);
      console.log(`  ${BOLD("Patterns:")}      ${s.distinctPatterns} distinct clusters (${reductionText} reduction)`);
    }

    if (s.topRootCause) {
      console.log(`  ${BOLD("Root Cause:")}    ${RED(s.topRootCause)}`);
      if (s.topRootCauseImpact) {
        console.log(`  ${DIM("Impact:")}        ${s.topRootCauseImpact}`);
      }
    }

    const trendIcon = s.overallTrend === "improving" ? GREEN("▲ improving")
      : s.overallTrend === "declining" ? RED("▼ declining")
      : s.overallTrend === "stable" ? YELLOW("─ stable")
      : GRAY("unknown");
    console.log(`  ${BOLD("Overall Trend:")} ${trendIcon}`);

    if (s.hasScoreAnomalies) {
      console.log(`  ${BOLD("Anomalies:")}     ${YELLOW("⚠ Score anomalies detected")}`);
    }

    console.log(`  ${BOLD("Insights:")}      ${MAGENTA(String(s.insightCount))} actionable`);
    blank();

    // Root Cause Analysis
    if (report.rootCause && report.rootCause.topCause) {
      divider(56);
      console.log(`  ${BOLD("🔍 Root Cause Analysis")}`);
      blank();

      const rc = report.rootCause;

      // Top 5 nodes
      const topNodes = rc.nodes.slice(0, 5);
      console.log(`  ${DIM("Top Impact Nodes:")}`);
      for (const node of topNodes) {
        const typeLabel = node.type === "file" ? "📄" : "🎯";
        const pct = Math.round(node.betweenness * 100);
        const severityBar = "█".repeat(Math.min(Math.round(node.severityScore / 20), 8));
        console.log(`    ${typeLabel} ${CYAN(node.identifier)}`);
        console.log(`      ${DIM("Connected to")} ${YELLOW(String(node.connectedFindings.length))} findings (${pct}%)  ${DIM(severityBar)}`);
      }
      blank();
      console.log(`  ${DIM("Summary:")} ${rc.summary}`);
      blank();
    }

    // Finding Clustering
    if (report.clustering && report.clustering.clusters.length > 0) {
      divider(56);
      console.log(`  ${BOLD("🗂️  Finding Clustering")}`);
      blank();

      const cl = report.clustering;
      console.log(`  ${cl.totalFindings} findings → ${YELLOW(String(cl.clusterCount))} clusters (${GREEN(String(cl.reductionRatio))}% reduction)`);
      blank();

      const topClusters = cl.clusters.slice(0, 5);
      for (const cluster of topClusters) {
        const sevLabel = cluster.severity === "critical" ? RED(cluster.severity)
          : cluster.severity === "high" ? YELLOW(cluster.severity)
          : cluster.severity === "medium" ? CYAN(cluster.severity)
          : GRAY(cluster.severity);
        console.log(`  ${BOLD(cluster.clusterId)}  ${sevLabel}  ${cluster.ruleId}`);
        console.log(`    ${DIM("Pattern:")} ${cluster.representativeTitle}`);
        if (cluster.findingCount > 1) {
          console.log(`    ${DIM("Count:")}   ${cluster.findingCount} findings in ${cluster.files.length} file(s)`);
        }
        blank();
      }

      if (cl.clusters.length > 5) {
        console.log(`  ${DIM("... and")} ${cl.clusters.length - 5} ${DIM("more clusters")}`);
        blank();
      }
    }

    // Score Anomalies
    if (report.scoreAnomalies && report.scoreAnomalies.hasAnomalies) {
      divider(56);
      console.log(`  ${BOLD("⚠️  Score Anomalies")}`);
      blank();

      for (const anomaly of report.scoreAnomalies.anomalies) {
        if (!anomaly.isAnomalous) continue;

        const direction = anomaly.delta < 0 ? RED(`▼ ${Math.abs(anomaly.delta)}%`) : GREEN(`▲ ${anomaly.delta}%`);
        console.log(`  ${YELLOW(anomaly.framework)}  ${direction}  (${anomaly.previousScore}% → ${anomaly.currentScore}%)`);
        console.log(`    ${DIM(`z-score: ${anomaly.zScore}`)}`);
        if (anomaly.triggeringEvent) {
          console.log(`    ${DIM("Trigger:")} ${anomaly.triggeringEvent}`);
        }
        blank();
      }
    }

    // Trend Predictions
    if (report.trends && report.trends.overall) {
      divider(56);
      console.log(`  ${BOLD("🔮 Trend Predictions")}`);
      blank();

      const overall = report.trends.overall;
      const dirIcon = overall.trendDirection === "improving" ? GREEN("▲")
        : overall.trendDirection === "declining" ? RED("▼")
        : YELLOW("─");
      console.log(`  ${BOLD("Overall:")}  ${dirIcon} ${overall.currentScore}% → ${overall.projectedScore}% ${DIM(`(R²=${overall.rSquared})`)}`);

      if (overall.cyclesToThreshold !== null && overall.cyclesToThreshold > 0) {
        console.log(`  ${DIM("Threshold (80%):")} ${YELLOW(`in ~${overall.cyclesToThreshold} audit cycles`)}`);
      }
      blank();

      // Per-framework trends (only non-overall)
      const fwTrends = report.trends.predictions.filter(p => p.framework !== "overall");
      if (fwTrends.length > 0) {
        console.log(`  ${DIM("Per Framework:")}`);
        for (const pred of fwTrends.slice(0, 6)) {
          const fwIcon = pred.trendDirection === "improving" ? GREEN("▲")
            : pred.trendDirection === "declining" ? RED("▼")
            : YELLOW("─");
          const cycleInfo = pred.cyclesToThreshold !== null && pred.cyclesToThreshold > 0
            ? DIM(` (threshold in ~${pred.cyclesToThreshold})`)
            : "";
          console.log(`    ${fwIcon} ${pred.framework.padEnd(12)} ${pred.currentScore}% → ${pred.projectedScore}%${cycleInfo}`);
        }
      }
      blank();
    }

    if (report.summary.insightCount === 0) {
      divider(56);
      blank();
      warn("No significant insights found.");
      info("Run an audit and accumulate more data for richer inference.");
      blank();
    }

    await showNextStepsMenu("infer");
  });
