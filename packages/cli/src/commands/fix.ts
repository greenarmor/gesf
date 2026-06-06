import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { createAutoFixPlan, applyAutoFixAction, getNpmInstallsFromActions } from "@greenarmor/ges-mcp-server";

export const fixCommand = new Command("fix")
  .description("Automatically fix security and compliance findings")
  .option("-d, --dry-run", "Show what would be fixed without making changes")
  .option("-r, --rules <ruleIds>", "Only fix specific rule IDs (comma-separated, e.g. CONFIG-001,SECRETS-001)")
  .option("--ci", "CI mode - exit with error code if findings remain after fix")
  .action(async (options) => {
    const root = ensureGESInitialized();

    console.log("\n  GESF Auto-Fix Engine");
    console.log("  ────────────────────\n");

    console.log("  Scanning project files...");
    const { findings: rawFindings, scannedFiles } = runAudit(root);
    const findings: Finding[] = deduplicateFindings(rawFindings);

    console.log(`  Scanned ${scannedFiles} files`);
    console.log(`  Found ${findings.length} findings\n`);

    if (findings.length === 0) {
      console.log("  [✓] No issues found. Project is clean!\n");
      return;
    }

    const ruleFilter: Set<string> | undefined = options.rules
      ? new Set(options.rules.split(",").map((r: string) => r.trim()))
      : undefined;

    const { actions, warnings } = createAutoFixPlan(root, findings, ruleFilter);

    if (actions.length === 0) {
      console.log("  No auto-fixable issues found.\n");
      console.log("  All findings require manual review:\n");
      for (const w of warnings) {
        console.log(`    ${w}`);
      }
      console.log("");
      if (options.ci) process.exit(1);
      return;
    }

    const dryRun = options.dryRun === true;
    const npmInstalls = getNpmInstallsFromActions(actions);

    if (dryRun) {
      console.log(`  DRY RUN — ${actions.length} fixes planned (no changes applied):\n`);
    } else {
      console.log(`  Applying ${actions.length} fixes...\n`);
    }

    let applied = 0;
    let failed = 0;

    for (const action of actions) {
      if (dryRun) {
        console.log(`    [${action.type}] ${action.filePath}`);
        console.log(`        ${action.description}  [${action.ruleId}]`);
        applied++;
      } else {
        const result = applyAutoFixAction(root, action);
        if (result.applied) {
          console.log(`    [✓] [${action.type}] ${action.filePath}  [${action.ruleId}]`);
          applied++;
        } else {
          console.log(`    [✗] [${action.type}] ${action.filePath}  [${action.ruleId}]`);
          console.log(`        ${result.error}`);
          failed++;
        }
      }
    }

    console.log("");
    console.log(`  Fixes ${dryRun ? "planned" : "applied"}: ${applied}${failed > 0 ? ` (${failed} failed)` : ""}`);

    if (npmInstalls.length > 0) {
      console.log("\n  npm packages to install:");
      console.log(`    npm install ${npmInstalls.join(" ")}`);
    }

    if (warnings.length > 0) {
      console.log("\n  Manual review required:");
      for (const w of warnings) {
        console.log(`    ${w}`);
      }
    }

    console.log("\n  Next steps:");
    console.log("    1. Install npm packages listed above");
    console.log("    2. Review changes: git diff");
    console.log("    3. Re-run audit: ges audit");
    console.log("");

    if (options.ci && (findings.length > 0 && failed < findings.length) === false && findings.length > 0) {
      process.exit(1);
    }
  });
