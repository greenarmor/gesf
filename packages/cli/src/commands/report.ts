import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeFileSync } from "../utils/project.js";
import type { ProjectConfig, ScoreFile, ReportOptions } from "@greenarmor/ges-core";
import { getAllPacks } from "@greenarmor/ges-policy-engine";
import { generateMarkdownReport, generateHtmlReport } from "@greenarmor/ges-report-generator";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import * as path from "node:path";

export const reportCommand = new Command("report")
  .description("Generate compliance reports")
  .option("-f, --format <format>", "Report format (markdown, html, pdf)", "markdown")
  .option("-o, --output <path>", "Output file path")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const config = readJsonFile<ProjectConfig>(path.join(root, ".ges", "config.json"));

    console.log("\n  Generating compliance report...\n");

    const score = readJsonFile<ScoreFile>(path.join(root, ".ges", "score.json"));
    if (!score) {
      console.error("  Error: No score data. Run 'ges audit' first.");
      process.exit(1);
    }

    const controls = getAllPacks().flatMap(p => p.controls);

    const { findings: rawFindings } = runAudit(root);
    const findings = deduplicateFindings(rawFindings);

    const reportOptions: ReportOptions = {
      format: options.format || "markdown",
      title: `Compliance Report - ${config?.project_name || "Project"}`,
      include_executive_summary: true,
      include_risk_assessment: true,
      include_compliance: true,
      include_security: true,
    };

    let content: string;
    let ext: string;

    if (options.format === "html") {
      content = generateHtmlReport(reportOptions, score, controls, findings);
      ext = "html";
    } else {
      content = generateMarkdownReport(reportOptions, score, controls, findings);
      ext = "md";
    }

    const defaultOutput = path.join(root, "reports", `compliance-report.${ext}`);
    const outputPath = options.output || defaultOutput;

    writeFileSync(outputPath, content);

    console.log(`  Report generated: ${outputPath}`);
    console.log(`  ${findings.length} security findings included\n`);

    if (options.format === "pdf") {
      console.log("  Note: PDF generation requires pandoc:");
      console.log(`    pandoc ${outputPath} -o ${outputPath.replace(".md", ".pdf")}\n`);
    }
  });
