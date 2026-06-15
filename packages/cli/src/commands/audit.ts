import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig, ScoreFile, FrameworkName, Control, ControlOverride } from "@greenarmor/ges-core";
import { recordActivity } from "@greenarmor/ges-core";
import { getPacksForProjectType, getAllPacks } from "@greenarmor/ges-policy-engine";
import { generateScoreFile, formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import { runAudit, runAuditIncremental, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding, AuditCache } from "@greenarmor/ges-audit-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
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

    console.log("\n  GESF Compliance Audit");
    console.log("  ────────────────────\n");

    console.log("  Scanning project files...");

    let rawFindings: Finding[];
    let scannedFiles: number;

    if (options.incremental) {
      const cachePath = path.join(root, ".ges", "audit-cache.json");
      const existingCache = readJsonFile<AuditCache>(cachePath) || {};
      const result = runAuditIncremental(root, existingCache);
      writeJsonFile(cachePath, result.newCache);
      rawFindings = result.findings;
      scannedFiles = result.scannedFiles;
      console.log(`  Scanned ${scannedFiles} files (${result.changedFiles} changed)`);
    } else {
      const result = runAudit(root);
      rawFindings = result.findings;
      scannedFiles = result.scannedFiles;
      console.log(`  Scanned ${scannedFiles} files`);
    }

    const findings = deduplicateFindings(rawFindings);
    console.log("");

    const frameworks = (config?.frameworks || ["GDPR", "OWASP"]) as FrameworkName[];

    const projectPacks = getPacksForProjectType(config?.project_type || "generic-web-application");
    const packIds = new Set(projectPacks.map(p => p.id));
    const fwLower = new Set(frameworks.map(f => f.toLowerCase()));
    const allPacks = getAllPacks();
    for (const p of allPacks) {
      if (fwLower.has(p.id)) packIds.add(p.id);
    }
    const controls = allPacks.filter(p => packIds.has(p.id)).flatMap(p => p.controls);

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
      console.log(`  Control overrides: ${naCount} not-applicable, ${passCount} pre-verified\n`);
    }

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
