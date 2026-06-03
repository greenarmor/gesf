import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { runAllScansWithSbom, formatScanResults, formatSbomResults } from "@greenarmor/ges-scanner-integration";
import { showNextStepsMenu } from "../utils/next-steps.js";

export const scanCommand = new Command("scan")
  .description("Run security scans")
  .option("--ci", "CI mode")
  .action(async (options) => {
    const root = ensureGESInitialized();

    console.log("\n  Running security scans...\n");

    const results = runAllScansWithSbom();
    console.log(formatScanResults(results));
    console.log(formatSbomResults(results));

    if (options.ci) {
      const failed = results.filter(r => r.status === "fail");
      if (failed.length > 0) {
        process.exit(1);
      }
    }

    await showNextStepsMenu("scan");
  });
