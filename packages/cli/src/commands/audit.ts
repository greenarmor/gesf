import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig, ScoreFile, FrameworkName, Control, ControlOverride } from "@greenarmor/ges-core";
import { recordActivity, loadControlsFromDisk } from "@greenarmor/ges-core";
import { getPacksForProjectType, getAllPacks } from "@greenarmor/ges-policy-engine";
import { generateScoreFile, formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import { runAudit, runAuditIncremental, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding, AuditCache } from "@greenarmor/ges-audit-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
import { banner, divider, blank, success, warn, info, severityBadge, BOLD, DIM, CYAN, GREEN, RED, YELLOW, GRAY } from "../utils/ui.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const auditCommand = new Command("audit")
  .description("Run a compliance audit on the project")
  .option("--ci", "CI mode - exit with error code on failures")
  .option("--json", "Output findings as JSON")
  .option("--incremental", "Only rescan changed files since last audit")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const config = readJsonFile<ProjectConfig>(path.join(root, ".ges", "config.json"));

    if (!options.json) {
      banner("GESF Compliance Audit", options.incremental ? "Incremental scan" : "Full project scan");
      info("Scanning project files...");
    }

    let rawFindings: Finding[];
    let scannedFiles: number;

    if (options.incremental) {
      const cachePath = path.join(root, ".ges", "audit-cache.json");
      const existingCache = readJsonFile<AuditCache>(cachePath) || {};
      const result = runAuditIncremental(root, existingCache);
      writeJsonFile(cachePath, result.newCache);
      rawFindings = result.findings;
      scannedFiles = result.scannedFiles;
      if (!options.json) success("Scan complete", `${scannedFiles} files (${result.changedFiles} changed)`);
    } else {
      const result = runAudit(root);
      rawFindings = result.findings;
      scannedFiles = result.scannedFiles;
      if (!options.json) success("Scan complete", `${scannedFiles} files`);
    }

    const findings = deduplicateFindings(rawFindings);
    if (!options.json) blank();

    const configFrameworks = (config?.frameworks || ["GDPR", "OWASP"]) as FrameworkName[];

    const projectPacks = getPacksForProjectType(config?.project_type || "generic-web-application");
    const packIds = new Set(projectPacks.map(p => p.id));
    const fwLower = new Set(configFrameworks.map(f => f.toLowerCase()));
    const allPacks = getAllPacks();
    for (const p of allPacks) {
      if (fwLower.has(p.id)) packIds.add(p.id);
    }
    const memoryControls = allPacks.filter(p => packIds.has(p.id)).flatMap(p => p.controls);

    const diskControls = loadControlsFromDisk(root);
    const seenIds = new Set(memoryControls.map(c => c.id));
    const extraFromDisk = diskControls.filter(c => !seenIds.has(c.id));
    const controls = [...memoryControls, ...extraFromDisk];

    const frameworks = [...new Set(controls.map(c => c.framework).filter(Boolean))] as FrameworkName[];

    const overrides = loadControlOverrides(root);
    const updatedControls = applyControlOverrides(controls, overrides);
    const auditedControls = updateControlsFromFindings(updatedControls, findings);
    const scoreData = generateScoreFile(auditedControls, frameworks, findings);

    writeJsonFile(path.join(root, ".ges", "score.json"), scoreData);
    writeJsonFile(path.join(root, ".ges", "last-audit.json"), {
      findings,
      scannedFiles,
      timestamp: new Date().toISOString(),
    });

    try {
      const metaPath = path.join(root, ".ges", "metadata.json");
      const meta = readJsonFile<Record<string, unknown>>(metaPath) || {};
      meta.last_audit = new Date().toISOString();
      writeJsonFile(metaPath, meta);
    } catch { /* ignore metadata errors */ }

    const critical = findings.filter(f => f.severity === "critical");
    const high = findings.filter(f => f.severity === "high");
    const medium = findings.filter(f => f.severity === "medium");
    const low = findings.filter(f => f.severity === "low");

    if (overrides.length > 0) {
      const naCount = overrides.filter(o => o.status === "not-applicable").length;
      const passCount = overrides.filter(o => o.status === "pass").length;
      if (!options.json) info("Control overrides", `${naCount} not-applicable, ${passCount} pre-verified`);
    }

    if (options.json) {
      console.log(JSON.stringify({ findings, score: scoreData }, null, 2));
      if (options.ci && critical.length > 0) process.exit(1);
      return;
    }

    console.log(`  ${BOLD("Findings")}`);
    divider(40);
    console.log(`  ${DIM("Total")}     ${findings.length}`);
    console.log(`  ${RED(`Critical ${critical.length}`)}  ${RED(`High ${high.length}`)}  ${YELLOW(`Medium ${medium.length}`)}  ${CYAN(`Low ${low.length}`)}\n`);

    if (findings.length > 0) {
      const grouped = groupByCategory(findings);
      for (const [category, categoryFindings] of Object.entries(grouped)) {
        console.log(`  ${BOLD(category.toUpperCase())}`);
        for (const f of categoryFindings.slice(0, 10)) {
          const loc = f.file !== "project" ? ` ${DIM(`(${f.file}${f.line ? ":" + f.line : ""})`)}` : "";
          console.log(`    ${severityBadge(f.severity).padEnd(10)} ${f.title}${loc}`);
          if (f.evidence && f.file !== "project") {
            console.log(`          ${GRAY(f.evidence.slice(0, 100))}`);
          }
        }
        if (categoryFindings.length > 10) {
          console.log(`    ${DIM(`... and ${categoryFindings.length - 10} more`)}`);
        }
        console.log("");
      }
    } else {
      success("No security or compliance issues found in source code.");
      blank();
    }

    console.log(`  ${BOLD("Compliance Score")}`);
    divider(40);
    console.log(formatScoreOutput(scoreData));

    if (critical.length > 0) {
      warn("Critical issues must be resolved before deployment.");
      blank();
    }

    recordActivity(root, {
      source: "cli",
      action: "audit",
      title: `Compliance audit completed`,
      description: `Scanned ${scannedFiles} files, found ${findings.length} findings (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low). Overall score: ${scoreData.overall}%.`,
      status: critical.length > 0 ? "failed" : findings.length > 0 ? "partial" : "success",
      details: { findings_count: findings.length, score: scoreData.overall, files_scanned: scannedFiles },
    });

    if (options.ci && critical.length > 0) {
      process.exit(1);
    }

    await showNextStepsMenu("audit");
  });

function loadControlOverrides(root: string): ControlOverride[] {
  const overridePath = path.join(root, ".ges", "control-overrides.json");
  if (!fs.existsSync(overridePath)) return [];
  const overrides = readJsonFile<ControlOverride[]>(overridePath);
  return Array.isArray(overrides) ? overrides : [];
}

function applyControlOverrides(controls: Control[], overrides: ControlOverride[]): Control[] {
  if (overrides.length === 0) return controls;

  const overrideMap = new Map(overrides.map(o => [o.control_id, o]));

  return controls.map(control => {
    const override = overrideMap.get(control.id);
    if (!override) return control;

    return {
      ...control,
      status: override.status,
      checks: control.checks.map(check => ({ ...check, status: override.status })),
    };
  });
}

const SCANNABLE_CATEGORIES = new Set([
  "encryption",
  "authentication",
  "audit",
  "security",
  "database",
  "secrets",
  "injection",
  "xss",
  "infrastructure",
  "dependencies",
]);

function updateControlsFromFindings(controls: Control[], findings: Finding[]): Control[] {
  const controlsWithFindings = new Set(
    findings.flatMap(f => f.controlIds)
  );

  return controls.map(control => {
    if (control.status === "pass" || control.status === "not-applicable") return control;

    const relevantFindings = findings.filter(f => f.controlIds.includes(control.id));
    if (relevantFindings.length === 0) {
      if (
        SCANNABLE_CATEGORIES.has(control.category) &&
        !controlsWithFindings.has(control.id)
      ) {
        return {
          ...control,
          checks: control.checks.map(check => ({ ...check, status: "pass" as const })),
          status: "pass" as const,
        };
      }
      return control;
    }

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
