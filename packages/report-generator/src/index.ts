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

  sections.push(generateRecommendationsSection(score, controls, findings));

  return sections.join("\n\n");
}

function generateExecutiveSummary(score: ScoreFile, findings?: Finding[]): string {
  const lines = [
    "## Executive Summary\n",
    `Overall compliance score: **${score.overall}%** (Grade: **${score.overall_grade}**)
`,
    "| Framework | Grade | Score | Controls | Passed | Failed | Warnings | Critical Failures |",
    "|-----------|-------|-------|----------|--------|--------|----------|-------------------|",
  ];

  for (const [fw, data] of Object.entries(score.frameworks)) {
    lines.push(
      `| ${fw} | ${data.grade} | ${data.score}% | ${data.total_controls} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} | ${data.critical_failures} |`,
    );
  }

  if (findings && findings.length > 0) {
    const critical = findings.filter(f => f.severity === "critical").length;
    const high = findings.filter(f => f.severity === "high").length;
    lines.push(`\n**Security Findings**: ${findings.length} total (${critical} critical, ${high} high)`);
  }

  if (score.audit_impact) {
    const ai = score.audit_impact;
    lines.push(`\n**Audit Impact**: -${ai.total_deduction}% (${ai.critical_findings} critical, ${ai.high_findings} high, ${ai.medium_findings} medium, ${ai.low_findings} low findings)`);
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
    lines.push(`#### ${fw} - ${data.score}% (Grade: ${data.grade})\n`);
    lines.push(`- Total Controls: ${data.total_controls}`);
    lines.push(`- Passed: ${data.passed_controls}`);
    lines.push(`- Failed: ${data.failed_controls}`);
    lines.push(`- Warnings: ${data.warning_controls}`);
    lines.push(`- Not Applicable: ${data.not_applicable}`);
    lines.push(`- Not Implemented: ${data.not_implemented}`);
    lines.push(`- Critical Failures: ${data.critical_failures}`);

    const sb = data.severity_breakdown;
    lines.push("\n**Severity Breakdown:**");
    lines.push("| Level | Total | Passed | Failed | Warning | Not Implemented |");
    lines.push("|-------|-------|--------|--------|---------|-----------------|");
    if (sb.critical.total > 0) lines.push(`| Critical | ${sb.critical.total} | ${sb.critical.passed} | ${sb.critical.failed} | ${sb.critical.warning} | ${sb.critical.not_implemented} |`);
    if (sb.high.total > 0) lines.push(`| High | ${sb.high.total} | ${sb.high.passed} | ${sb.high.failed} | ${sb.high.warning} | ${sb.high.not_implemented} |`);
    if (sb.medium.total > 0) lines.push(`| Medium | ${sb.medium.total} | ${sb.medium.passed} | ${sb.medium.failed} | ${sb.medium.warning} | ${sb.medium.not_implemented} |`);
    if (sb.low.total > 0) lines.push(`| Low | ${sb.low.total} | ${sb.low.passed} | ${sb.low.failed} | ${sb.low.warning} | ${sb.low.not_implemented} |`);
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

function generateRecommendationsSection(score: ScoreFile, controls: Control[], findings?: Finding[]): string {
  const lines = ["## Compliance Recommendations\n"];

  const failedControls = controls.filter(c => c.status === "fail");
  const criticalFails = failedControls.filter(c => c.severity === "critical");
  const highFails = failedControls.filter(c => c.severity === "high");
  const notImplemented = controls.filter(c => c.status === "not-implemented");

  if (criticalFails.length > 0) {
    lines.push("### Critical Actions Required\n");
    for (const c of criticalFails.slice(0, 10)) {
      lines.push(`- **${c.id}**: ${c.name} — ${c.implementation_guidance.split(".")[0]}`);
    }
    lines.push("");
  }

  if (highFails.length > 0) {
    lines.push("### High Priority Actions\n");
    for (const c of highFails.slice(0, 10)) {
      lines.push(`- **${c.id}**: ${c.name} — ${c.implementation_guidance.split(".")[0]}`);
    }
    lines.push("");
  }

  if (findings && findings.length > 0) {
    const critFindings = findings.filter(f => f.severity === "critical");
    const highFindings = findings.filter(f => f.severity === "high");

    if (critFindings.length > 0) {
      lines.push("### Immediate Security Fixes\n");
      for (const f of critFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}): ${f.fix}`);
      }
      lines.push("");
    }

    if (highFindings.length > 0 && critFindings.length === 0) {
      lines.push("### Security Fixes Needed\n");
      for (const f of highFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}): ${f.fix}`);
      }
      lines.push("");
    }
  }

  if (notImplemented.length > 0) {
    const sample = notImplemented.slice(0, 5);
    lines.push("### Not Yet Implemented\n");
    lines.push(`${notImplemented.length} controls have not been implemented yet. Start with:`);
    lines.push("");
    for (const c of sample) {
      lines.push(`- **${c.id}** (${c.severity}): ${c.name}`);
    }
    if (notImplemented.length > 5) {
      lines.push(`- ... and ${notImplemented.length - 5} more`);
    }
    lines.push("");
  }

  if (score.overall >= 90) {
    lines.push("Overall compliance posture is strong. Focus on maintaining controls and addressing remaining findings.");
  } else if (score.overall >= 65) {
    lines.push("Compliance posture needs improvement. Prioritize critical and high severity controls above all else.");
  } else if (score.overall >= 50) {
    lines.push("Compliance posture is below acceptable threshold. Immediate action required on critical controls.");
  } else {
    lines.push("**Compliance posture is critically low.** Resolve all critical findings before any deployment.");
  }

  return lines.join("\n");
}

export function generatePdfReport(
  options: ReportOptions,
  score: ScoreFile,
  controls: Control[],
  findings?: Finding[],
): string {
  const md = generateMarkdownReport(options, score, controls, findings);
  return markdownToPdf(md, options.title);
}

function escapePdfText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function markdownToPdf(markdown: string, title: string): string {
  const lines = markdown.split("\n");
  const pageWidth = 515;
  const pageHeight = 757;
  const marginLeft = 50;
  const marginTop = 50;
  const fontSize = 10;
  const lineHeight = 14;
  const maxWidth = pageWidth - marginLeft * 2;

  const contentLines: string[] = [];
  let y = pageHeight - marginTop;

  for (const rawLine of lines) {
    if (rawLine.trim() === "") {
      y -= lineHeight / 2;
      continue;
    }

    const isHeader = rawLine.startsWith("#");
    let text = rawLine;
    let currentFontSize = fontSize;

    if (rawLine.startsWith("### ")) {
      text = rawLine.slice(4);
      currentFontSize = 12;
    } else if (rawLine.startsWith("## ")) {
      text = rawLine.slice(3);
      currentFontSize = 14;
    } else if (rawLine.startsWith("# ")) {
      text = rawLine.slice(2);
      currentFontSize = 18;
    }

    text = text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "");

    const approxCharWidth = currentFontSize * 0.55;
    const maxChars = Math.floor(maxWidth / approxCharWidth);

    const words = text.split(" ");
    let currentLine = "";

    for (const word of words) {
      const testLine = currentLine ? currentLine + " " + word : word;
      if (testLine.length > maxChars && currentLine) {
        if (y < marginTop + lineHeight) {
          contentLines.push("BT");
          contentLines.push(`/F${isHeader ? 2 : 1} ${currentFontSize} Tf`);
          contentLines.push(`${marginLeft} ${y} Td`);
          contentLines.push(`(${escapePdfText(currentLine)}) Tj`);
          contentLines.push("ET");
          y = pageHeight - marginTop;
        } else {
          contentLines.push("BT");
          contentLines.push(`/F${isHeader ? 2 : 1} ${currentFontSize} Tf`);
          contentLines.push(`${marginLeft} ${y} Td`);
          contentLines.push(`(${escapePdfText(currentLine)}) Tj`);
          contentLines.push("ET");
          y -= lineHeight + (isHeader ? 4 : 0);
        }
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y < marginTop + lineHeight) {
        y = pageHeight - marginTop;
      }
      contentLines.push("BT");
      contentLines.push(`/F${isHeader ? 2 : 1} ${currentFontSize} Tf`);
      contentLines.push(`${marginLeft} ${y} Td`);
      contentLines.push(`(${escapePdfText(currentLine)}) Tj`);
      contentLines.push("ET");
      y -= lineHeight + (isHeader ? 4 : 0);
    }
  }

  const contentStream = contentLines.join("\n");

  const objects: string[] = [];
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  objects.push("<< /Type /Pages /Kids [3 0 R] /Count 1 >>");
  objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth + marginLeft * 2} ${pageHeight + marginTop * 2}] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>`);
  objects.push(`<< /Length ${contentStream.length} >>\nstream\n${contentStream}\nendstream`);
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];

  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }

  const xrefOffset = pdf.length;
  pdf += "xref\n";
  pdf += `0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return pdf;
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
