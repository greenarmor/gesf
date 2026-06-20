import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { safeWriteJson } from "@greenarmor/ges-core";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { createAutoFixPlan, applyAutoFixAction, getNpmInstallsFromActions } from "@greenarmor/ges-mcp-server";
import { appendFixHistory, createFixHistoryEntry, recordActivity, loadControlsFromDisk, loadControlOverrides, applyOverridesToControls } from "@greenarmor/ges-core";
import type { Control } from "@greenarmor/ges-core";
import { getAllPacks } from "@greenarmor/ges-policy-engine";
import * as fs from "node:fs";
import * as path from "node:path";

function loadProjectControls(root: string): Control[] {
  try {
    const configPath = path.join(root, ".ges", "config.json");
    let inMemoryControls: Control[] = [];

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      const fwLower = new Set(config.frameworks.map((f: string) => f.toLowerCase()));
      const allPacks = getAllPacks();
      const filtered = allPacks.filter(pack =>
        fwLower.has(pack.id.toLowerCase())
      );
      inMemoryControls = filtered.flatMap((p: any) => p.controls);
    }

    const diskControls = loadControlsFromDisk(root);
    const seenIds = new Set(inMemoryControls.map(c => c.id));
    const extraFromDisk = diskControls.filter(c => !seenIds.has(c.id));
    const controls = [...inMemoryControls, ...extraFromDisk];

    const overrides = loadControlOverrides(root);
    return applyOverridesToControls(controls, overrides);
  } catch {
    return [];
  }
}

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
    const projectControls = loadProjectControls(root);

    try {
      safeWriteJson(path.join(root, ".ges", "last-audit.json"), {
        findings, scannedFiles, timestamp: new Date().toISOString(),
      });
    } catch { /* ignore persistence errors */ }

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
    const historyEntries = [];

    for (const action of actions) {
      const matchingFindings = findings.filter(f => f.ruleId === action.ruleId);
      const primaryFinding = matchingFindings[0];

      const matchedControls = primaryFinding
        ? projectControls.filter((c: Control) => primaryFinding.controlIds.includes(c.id))
        : [];

      if (dryRun) {
        console.log(`    [${action.type}] ${action.filePath}`);
        console.log(`        ${action.description}  [${action.ruleId}]`);
        applied++;
        historyEntries.push(createFixHistoryEntry({
          source: "cli",
          dry_run: true,
          finding: primaryFinding ?? {
            ruleId: action.ruleId,
            severity: "medium",
            category: "",
            title: action.description,
            file: "",
            evidence: "",
            description: action.description,
            controlIds: [],
            fix: action.description,
          },
          action,
          controls: matchedControls,
          applied: false,
        }));
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
        historyEntries.push(createFixHistoryEntry({
          source: "cli",
          dry_run: false,
          finding: primaryFinding ?? {
            ruleId: action.ruleId,
            severity: "medium",
            category: "",
            title: action.description,
            file: "",
            evidence: "",
            description: action.description,
            controlIds: [],
            fix: action.description,
          },
          action,
          controls: matchedControls,
          applied: result.applied,
          error: result.applied ? undefined : result.error,
        }));
      }
    }

    if (historyEntries.length > 0 && !dryRun) {
      appendFixHistory(root, historyEntries);
      console.log(`\n  Fix history recorded in .ges/fix-history.json`);
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

    recordActivity(root, {
      source: "cli",
      action: "fix",
      title: `Auto-fix ${dryRun ? "planned" : "applied"}: ${applied} fixes`,
      description: `${dryRun ? "Planned" : "Applied"} ${applied} fix(es) across ${actions.length} action(s)${failed > 0 ? ` (${failed} failed)` : ""}. Scanned ${scannedFiles} files, ${findings.length} findings found.`,
      status: failed > 0 ? "partial" : "success",
      details: { fixes_applied: applied, findings_count: findings.length, files_scanned: scannedFiles },
    });

    if (options.ci && (findings.length > 0 && failed < findings.length) === false && findings.length > 0) {
      process.exit(1);
    }
  });
