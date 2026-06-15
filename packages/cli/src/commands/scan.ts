import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { runAllScansWithSbom, formatScanResults, formatSbomResults, detectProject } from "@greenarmor/ges-scanner-integration";
import { recordActivity } from "@greenarmor/ges-core";
import { showNextStepsMenu } from "../utils/next-steps.js";

export const scanCommand = new Command("scan")
  .description("Run security scans")
  .option("--ci", "CI mode")
  .action(async (options) => {
    const root = ensureGESInitialized();

    const detection = detectProject(root);
    const detail = detection.ecosystem === "node" && detection.nodePackageManager
      ? `node (${detection.nodePackageManager})`
      : detection.ecosystem === "python" && detection.pythonToolchain
        ? `python (${detection.pythonToolchain})`
        : detection.ecosystem;
    console.log(`\n  Detected ecosystem: ${detail}`);
    console.log("  Running security scans...\n");

    const results = runAllScansWithSbom(detection);
    console.log(formatScanResults(results));
    console.log(formatSbomResults(results));

    recordActivity(root, {
      source: "cli",
      action: "scan",
      title: `Security scans completed (${results.length} tools)`,
      description: `Ran ${results.length} scanner(s) for ${detail} ecosystem. ${results.filter(r => r.status === "pass").length} passed, ${results.filter(r => r.status === "fail").length} failed.`,
      status: results.some(r => r.status === "fail") ? "partial" : "success",
    });

    if (options.ci) {
      const failed = results.filter(r => r.status === "fail");
      if (failed.length > 0) {
        process.exit(1);
      }
    }

    await showNextStepsMenu("scan");
  });
