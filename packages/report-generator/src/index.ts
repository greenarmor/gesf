import type { Control, ComplianceScore, ScoreFile, ReportOptions } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";

export function generateMarkdownReport(
  options: ReportOptions,
  score: ScoreFile,
  controls: Control[],
  findings?: Finding[],
): string {
  const sections: string[] = [];

  sections.push(`# ${options.title}`);
  sections.push(`\nGenerated: ${new Date().toISOString()}\n`);

  if (options.include_executive_summary) {
    sections.push(generateExecutiveSummary(score, findings));
  }

  if (findings && findings.length > 0) {
    sections.push(generateFindingsSection(findings));
  }

  if (options.include_compliance) {
    sections.push(generateComplianceSection(score));
  }

  if (options.include_risk_assessment) {
    sections.push(generateRiskSection(controls, findings));
  }

  if (options.include_security) {
    sections.push(generateSecuritySection(controls, findings));
  }

  return sections.join("\n\n");
}

function generateExecutiveSummary(score: ScoreFile, findings?: Finding[]): string {
  const lines = [
    "## Executive Summary\n",
    `Overall compliance score: **${score.overall}%**\n`,
    "| Framework | Score | Controls | Passed | Failed | Warnings |",
    "|-----------|-------|----------|--------|--------|----------|",
  ];

  for (const [fw, data] of Object.entries(score.frameworks)) {
    lines.push(
      `| ${fw} | ${data.score}% | ${data.total_controls} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} |`,
    );
  }

  if (findings && findings.length > 0) {
    const critical = findings.filter(f => f.severity === "critical").length;
    const high = findings.filter(f => f.severity === "high").length;
    lines.push(`\n**Security Findings**: ${findings.length} total (${critical} critical, ${high} high)`);
  }

  return lines.join("\n");
}

function generateFindingsSection(findings: Finding[]): string {
  const lines = [
    "## Security Findings\n",
    `Total findings: **${findings.length}**`,
  ];

  const grouped: Record<string, Finding[]> = {};
  for (const f of findings) {
    if (!grouped[f.category]) grouped[f.category] = [];
    grouped[f.category].push(f);
  }

  for (const [category, categoryFindings] of Object.entries(grouped)) {
    lines.push(`\n### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`);
    lines.push("| Severity | Title | File | Fix |");
    lines.push("|----------|-------|------|-----|");
    for (const f of categoryFindings) {
      const loc = f.file !== "project" ? `${f.file}${f.line ? `:${f.line}` : ""}` : "project-wide";
      lines.push(`| ${f.severity} | ${f.title} | ${loc} | ${f.fix.slice(0, 60)}... |`);
    }
  }

  return lines.join("\n");
}

function generateComplianceSection(score: ScoreFile): string {
  const lines = [
    "## Compliance Details\n",
    "### Framework Scores\n",
  ];

  for (const [fw, data] of Object.entries(score.frameworks)) {
    lines.push(`#### ${fw} - ${data.score}%\n`);
    lines.push(`- Total Controls: ${data.total_controls}`);
    lines.push(`- Passed: ${data.passed_controls}`);
    lines.push(`- Failed: ${data.failed_controls}`);
    lines.push(`- Warnings: ${data.warning_controls}`);
    lines.push(`- Not Applicable: ${data.not_applicable}`);
    lines.push("");
  }

  return lines.join("\n");
}

function generateRiskSection(controls: Control[], findings?: Finding[]): string {
  const failed = controls.filter(c => c.status === "fail");
  const critical = failed.filter(c => c.severity === "critical");
  const high = failed.filter(c => c.severity === "high");

  const lines = [
    "## Risk Assessment\n",
    `**Critical Issues**: ${critical.length}`,
    `**High Issues**: ${high.length}`,
    `**Total Failed Controls**: ${failed.length}`,
  ];

  if (findings) {
    const critFindings = findings.filter(f => f.severity === "critical");
    lines.push(`**Critical Findings**: ${critFindings.length}`);
  }

  lines.push("");

  if (failed.length > 0) {
    lines.push("### Failed Controls\n");
    lines.push("| ID | Name | Severity | Category |");
    lines.push("|----|------|----------|----------|");
    for (const c of failed) {
      lines.push(`| ${c.id} | ${c.name} | ${c.severity} | ${c.category} |`);
    }
  }

  return lines.join("\n");
}

function generateSecuritySection(controls: Control[], findings?: Finding[]): string {
  const securityCategories = ["encryption", "authentication", "authorization", "secrets", "audit", "security-testing"];
  const securityControls = controls.filter(c => securityCategories.includes(c.category));

  const lines = [
    "## Security Controls\n",
    "| ID | Name | Status | Severity |",
    "|----|------|--------|----------|",
  ];

  for (const c of securityControls) {
    lines.push(`| ${c.id} | ${c.name} | ${c.status} | ${c.severity} |`);
  }

  if (findings && findings.length > 0) {
    lines.push(`\n### Security Findings (${findings.length})\n`);
    for (const f of findings.slice(0, 20)) {
      lines.push(`- [${f.severity.toUpperCase()}] ${f.title} (${f.file})`);
    }
  }

  return lines.join("\n");
}

export function generateHtmlReport(
  options: ReportOptions,
  score: ScoreFile,
  controls: Control[],
  findings?: Finding[],
): string {
  const md = generateMarkdownReport(options, score, controls, findings);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 1200px; margin: 0 auto; padding: 2rem; color: #333; }
    table { border-collapse: collapse; width: 100%; margin: 1rem 0; }
    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
    th { background-color: #f5f5f5; }
    h1 { color: #1a7a3a; }
    h2 { color: #2d6a2e; border-bottom: 2px solid #2d6a2e; padding-bottom: 0.5rem; }
    .critical { color: #dc3545; font-weight: bold; }
    .high { color: #fd7e14; font-weight: bold; }
    .medium { color: #ffc107; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 4px; overflow-x: auto; }
  </style>
</head>
<body>
  <pre>${md}</pre>
</body>
</html>`;
}
