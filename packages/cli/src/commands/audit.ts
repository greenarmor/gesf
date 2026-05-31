import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig, ScoreFile, FrameworkName, Control } from "@greenarmor/ges-core";
import { getAllPacks } from "@greenarmor/ges-policy-engine";
import { generateScoreFile, formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as path from "node:path";

export const auditCommand = new Command("audit")
  .description("Run a compliance audit on the project")
  .option("--ci", "CI mode - exit with error code on failures")
  .option("--json", "Output findings as JSON")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const config = readJsonFile<ProjectConfig>(path.join(root, ".ges", "config.json"));

    console.log("\n  GESF Compliance Audit");
    console.log("  ────────────────────\n");

    console.log("  Scanning project files...");
    const { findings: rawFindings, scannedFiles } = runAudit(root);
    const findings = deduplicateFindings(rawFindings);

    console.log(`  Scanned ${scannedFiles} files\n`);

    const frameworks = (config?.frameworks || ["GDPR", "OWASP"]) as FrameworkName[];
    const controls = getAllPacks().flatMap(p => p.controls);

    const updatedControls = updateControlsFromFindings(controls, findings);
    const scoreData = generateScoreFile(updatedControls, frameworks);

    writeJsonFile(path.join(root, ".ges", "score.json"), scoreData);

    const critical = findings.filter(f => f.severity === "critical");
    const high = findings.filter(f => f.severity === "high");
    const medium = findings.filter(f => f.severity === "medium");
    const low = findings.filter(f => f.severity === "low");

    if (options.json) {
      console.log(JSON.stringify({ findings, score: scoreData }, null, 2));
      if (options.ci && critical.length > 0) process.exit(1);
      return;
    }

    console.log("  ── Findings ─────────────────────\n");
    console.log(`  Total findings: ${findings.length}`);
    console.log(`  Critical: ${critical.length}  High: ${high.length}  Medium: ${medium.length}  Low: ${low.length}\n`);

    if (findings.length > 0) {
      const grouped = groupByCategory(findings);
      for (const [category, categoryFindings] of Object.entries(grouped)) {
        console.log(`  [${category.toUpperCase()}]`);
        for (const f of categoryFindings.slice(0, 10)) {
          const sev = f.severity === "critical" ? "CRIT" : f.severity === "high" ? "HIGH" : f.severity === "medium" ? "MED " : "LOW ";
          const loc = f.file !== "project" ? ` (${f.file}${f.line ? ":" + f.line : ""})` : "";
          console.log(`    [${sev}] ${f.title}${loc}`);
          if (f.evidence && f.file !== "project") {
            console.log(`          ${f.evidence.slice(0, 100)}`);
          }
        }
        if (categoryFindings.length > 10) {
          console.log(`    ... and ${categoryFindings.length - 10} more`);
        }
        console.log("");
      }
    } else {
      console.log("  ✓ No security or compliance issues found in source code.\n");
    }

    console.log("  ── Compliance Score ──────────────");
    console.log(formatScoreOutput(scoreData));

    if (critical.length > 0) {
      console.log("  !! Critical issues must be resolved before deployment. !!\n");
    }

    if (options.ci && critical.length > 0) {
      process.exit(1);
    }

    await showNextStepsMenu("audit");
  });

function updateControlsFromFindings(controls: Control[], findings: Finding[]): Control[] {
  return controls.map(control => {
    const relevantFindings = findings.filter(f => f.controlIds.includes(control.id));
    if (relevantFindings.length === 0) return control;

    const hasCritical = relevantFindings.some(f => f.severity === "critical" || f.severity === "high");

    const updatedChecks = control.checks.map(check => {
      if (hasCritical) {
        return { ...check, status: "fail" as const };
      }
      return { ...check, status: "warning" as const };
    });

    return {
      ...control,
      checks: updatedChecks,
      status: hasCritical ? "fail" as const : "warning" as const,
    };
  });
}

function groupByCategory(findings: Finding[]): Record<string, Finding[]> {
  const groups: Record<string, Finding[]> = {};
  for (const f of findings) {
    const cat = f.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(f);
  }

  const order = ["secrets", "authentication", "encryption", "injection", "xss", "security", "database", "config", "infrastructure", "dependencies"];
  const sorted: Record<string, Finding[]> = {};
  for (const cat of order) {
    if (groups[cat]) sorted[cat] = groups[cat];
  }
  for (const [cat, items] of Object.entries(groups)) {
    if (!sorted[cat]) sorted[cat] = items;
  }

  return sorted;
}
