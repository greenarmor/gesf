import type {
  Control,
  ComplianceScore,
  ComplianceGrade,
  SeverityBreakdown,
  ScoreFile,
  FrameworkName,
  AuditImpact,
  SeverityLevel,
} from "@greenarmor/ges-core";

const SEVERITY_WEIGHTS: Record<SeverityLevel, number> = {
  critical: 10,
  high: 7,
  medium: 4,
  low: 1,
};

const STATUS_CREDIT: Record<string, number> = {
  pass: 1.0,
  warning: 0.5,
  fail: 0,
  "not-implemented": 0,
  "not-applicable": 1.0,
};

const SEVERITY_PENALTY: Record<SeverityLevel, number> = {
  critical: 12,
  high: 7,
  medium: 4,
  low: 1,
};

function computeGrade(score: number): ComplianceGrade {
  if (score >= 90) return "A";
  if (score >= 80) return "B";
  if (score >= 65) return "C";
  if (score >= 50) return "D";
  return "F";
}

function emptySeverityBucket() {
  return { total: 0, passed: 0, failed: 0, warning: 0, not_implemented: 0 };
}

function buildSeverityBreakdown(controls: Control[]): SeverityBreakdown {
  const breakdown: SeverityBreakdown = {
    critical: emptySeverityBucket(),
    high: emptySeverityBucket(),
    medium: emptySeverityBucket(),
    low: emptySeverityBucket(),
  };

  for (const c of controls) {
    const bucket = breakdown[c.severity];
    bucket.total++;
    if (c.status === "pass" || c.status === "not-applicable") {
      bucket.passed++;
    } else if (c.status === "warning") {
      bucket.warning++;
    } else if (c.status === "fail") {
      bucket.failed++;
    } else {
      bucket.not_implemented++;
    }
  }

  return breakdown;
}

function computeWeightedScore(controls: Control[]): {
  score: number;
  maxPossible: number;
} {
  if (controls.length === 0) return { score: 0, maxPossible: 0 };

  let earned = 0;
  let maxPossible = 0;

  for (const c of controls) {
    const weight = SEVERITY_WEIGHTS[c.severity];
    const credit = STATUS_CREDIT[c.status] ?? 0;
    earned += weight * credit;
    maxPossible += weight;
  }

  const score = maxPossible > 0 ? Math.round((earned / maxPossible) * 100) : 0;
  return { score, maxPossible };
}

function countCriticalFailures(controls: Control[]): number {
  return controls.filter(
    (c) => c.severity === "critical" && (c.status === "fail" || c.status === "not-implemented"),
  ).length;
}

export function scoreByFramework(
  controls: Control[],
  frameworks: FrameworkName[],
): Record<string, ComplianceScore> {
  const result: Record<string, ComplianceScore> = {};

  for (const fw of frameworks) {
    const fwControls = controls.filter((c) => c.framework === fw);
    const { score, maxPossible } = computeWeightedScore(fwControls);
    const breakdown = buildSeverityBreakdown(fwControls);

    const passed = fwControls.filter(
      (c) => c.status === "pass" || c.status === "not-applicable",
    ).length;
    const failed = fwControls.filter((c) => c.status === "fail").length;
    const warning = fwControls.filter((c) => c.status === "warning").length;
    const notApplicable = fwControls.filter((c) => c.status === "not-applicable").length;
    const notImplemented = fwControls.filter((c) => c.status === "not-implemented").length;
    const criticalFailures = countCriticalFailures(fwControls);

    let adjustedScore = score;
    if (criticalFailures > 0 && adjustedScore > 0) {
      const cap = Math.max(0, 75 - criticalFailures * 8);
      adjustedScore = Math.min(adjustedScore, cap);
    }

    result[fw] = {
      framework: fw,
      score: adjustedScore,
      grade: computeGrade(adjustedScore),
      total_controls: fwControls.length,
      passed_controls: passed,
      failed_controls: failed,
      warning_controls: warning,
      not_applicable: notApplicable,
      not_implemented: notImplemented,
      severity_breakdown: breakdown,
      critical_failures: criticalFailures,
      max_possible_score: maxPossible,
      evaluated_at: new Date().toISOString(),
    };
  }

  return result;
}

export function computeAuditImpact(
  findings: { severity: string }[],
): AuditImpact {
  const critical = findings.filter((f) => f.severity === "critical").length;
  const high = findings.filter((f) => f.severity === "high").length;
  const medium = findings.filter((f) => f.severity === "medium").length;
  const low = findings.filter((f) => f.severity === "low").length;

  const totalDeduction = Math.min(
    100,
    critical * SEVERITY_PENALTY.critical +
      high * SEVERITY_PENALTY.high +
      medium * SEVERITY_PENALTY.medium +
      low * SEVERITY_PENALTY.low,
  );

  return {
    total_deduction: totalDeduction,
    critical_findings: critical,
    high_findings: high,
    medium_findings: medium,
    low_findings: low,
  };
}

export function computeOverallScore(
  frameworkScores: Record<string, ComplianceScore>,
): number {
  const scores = Object.values(frameworkScores);
  if (scores.length === 0) return 0;

  let totalWeight = 0;
  let weightedSum = 0;

  for (const s of scores) {
    const weight = Math.max(1, s.total_controls);
    weightedSum += s.score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function generateScoreFile(
  controls: Control[],
  frameworks: FrameworkName[],
  findings?: { severity: string }[],
): ScoreFile {
  const frameworkScores = scoreByFramework(controls, frameworks);
  let overall = computeOverallScore(frameworkScores);

  let auditImpact: AuditImpact | undefined;

  if (findings && findings.length > 0) {
    auditImpact = computeAuditImpact(findings);
    overall = Math.max(0, overall - auditImpact.total_deduction);
  }

  return {
    overall,
    overall_grade: computeGrade(overall),
    frameworks: frameworkScores,
    audit_impact: auditImpact,
    evaluated_at: new Date().toISOString(),
  };
}

export function formatScoreOutput(score: ScoreFile): string {
  const lines: string[] = [];

  lines.push("");
  lines.push("  ╔══════════════════════════════════════════════╗");
  lines.push("  ║         COMPLIANCE SCORE REPORT              ║");
  lines.push("  ╚══════════════════════════════════════════════╝");
  lines.push("");

  for (const [fw, data] of Object.entries(score.frameworks)) {
    const padding = Math.max(1, 20 - fw.length);
    const dots = ".".repeat(padding);
    const gradeTag = `[${data.grade}]`;
    lines.push(`  ${fw} ${dots} ${String(data.score).padStart(3)}%  ${gradeTag}`);

    if (data.critical_failures > 0) {
      lines.push(`    ⚠  ${data.critical_failures} critical control(s) failed`);
    }

    const sb = data.severity_breakdown;
    const parts: string[] = [];
    if (sb.critical.total > 0)
      parts.push(`${sb.critical.passed}/${sb.critical.total} critical`);
    if (sb.high.total > 0)
      parts.push(`${sb.high.passed}/${sb.high.total} high`);
    if (sb.medium.total > 0)
      parts.push(`${sb.medium.passed}/${sb.medium.total} medium`);
    if (sb.low.total > 0)
      parts.push(`${sb.low.passed}/${sb.low.total} low`);
    if (parts.length > 0) lines.push(`    ${parts.join(" · ")}`);
  }

  lines.push("  ──────────────────────────────────────────────");

  const overallPadding = Math.max(1, 20 - "Overall".length);
  const overallDots = ".".repeat(overallPadding);
  lines.push(
    `  Overall ${overallDots} ${String(score.overall).padStart(3)}%  [${score.overall_grade}]`,
  );

  if (score.audit_impact) {
    const ai = score.audit_impact;
    lines.push("");
    lines.push("  Audit Findings Impact:");
    lines.push(`    Critical: ${ai.critical_findings}  ·  High: ${ai.high_findings}  ·  Medium: ${ai.medium_findings}  ·  Low: ${ai.low_findings}`);
    lines.push(`    Score deduction: -${ai.total_deduction}%`);
  }

  lines.push("");

  return lines.join("\n");
}

export { SEVERITY_WEIGHTS, STATUS_CREDIT, SEVERITY_PENALTY, computeGrade };

const GRADE_COLORS: Record<ComplianceGrade, string> = {
  A: "#2ea44f",
  B: "#84b6eb",
  C: "#e3b341",
  D: "#d29922",
  F: "#cf222e",
};

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function measureTextWidth(text: string): number {
  let w = 0;
  for (const ch of text) {
    if (ch >= "0" && ch <= "9") w += 7;
    else if (ch === " ") w += 4;
    else if (ch === "%") w += 9;
    else w += 7.5;
  }
  return Math.ceil(w);
}

export function generateBadgeSvg(score: ScoreFile): string {
  const scoreText = `${score.overall}%`;
  const grade = score.overall_grade ?? computeGrade(score.overall);
  const color = GRADE_COLORS[grade];

  const leftText = "compliance";
  const rightText = `${scoreText} (${grade})`;

  const leftWidth = measureTextWidth(leftText) + 20;
  const rightWidth = measureTextWidth(rightText) + 20;
  const totalWidth = leftWidth + rightWidth;
  const height = 20;

  const fwLines = Object.entries(score.frameworks)
    .map(([fw, data]) => `${fw}: ${data.score}% (${data.grade ?? computeGrade(data.score)})`)
    .join("&#10;");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="${height}" role="img" aria-label="Compliance: ${scoreText} Grade ${grade}">
  <title>Compliance Score: ${scoreText} (Grade ${grade})&#10;${fwLines}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${leftWidth}" height="${height}" fill="#555"/>
    <rect x="${leftWidth}" width="${rightWidth}" height="${height}" fill="${color}"/>
    <rect width="${totalWidth}" height="${height}" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="110">
    <text x="${Math.round(leftWidth / 2 * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(leftWidth - 12) * 10}" lengthAdjust="spacing">${escapeXml(leftText)}</text>
    <text x="${Math.round(leftWidth / 2 * 10)}" y="140" transform="scale(.1)" textLength="${(leftWidth - 12) * 10}" lengthAdjust="spacing">${escapeXml(leftText)}</text>
    <text x="${Math.round((leftWidth + rightWidth / 2) * 10)}" y="150" fill="#010101" fill-opacity=".3" transform="scale(.1)" textLength="${(rightWidth - 12) * 10}" lengthAdjust="spacing">${escapeXml(rightText)}</text>
    <text x="${Math.round((leftWidth + rightWidth / 2) * 10)}" y="140" transform="scale(.1)" textLength="${(rightWidth - 12) * 10}" lengthAdjust="spacing">${escapeXml(rightText)}</text>
  </g>
</svg>`;
}

export function generateScoreExplainer(score: ScoreFile): string {
  const lines: string[] = [];
  const indent = "> ";

  lines.push(`${indent}**GESF Compliance Score: ${score.overall}% (${score.overall_grade})**`);
  lines.push(">");
  lines.push(`${indent}| Framework | Score | Grade | Controls |`);
  lines.push(`${indent}|-----------|-------|-------|----------|`);

  for (const [fw, data] of Object.entries(score.frameworks)) {
    const passed = data.passed_controls;
    const total = data.total_controls;
    lines.push(`${indent}| ${fw} | ${data.score}% | ${data.grade} | ${passed}/${total} passed |`);
  }

  if (score.audit_impact) {
    const ai = score.audit_impact;
    lines.push(">");
    const parts: string[] = [];
    if (ai.critical_findings > 0) parts.push(`${ai.critical_findings} critical`);
    if (ai.high_findings > 0) parts.push(`${ai.high_findings} high`);
    if (ai.medium_findings > 0) parts.push(`${ai.medium_findings} medium`);
    if (ai.low_findings > 0) parts.push(`${ai.low_findings} low`);
    if (parts.length > 0) {
      lines.push(`${indent}Audit findings: ${parts.join(", ")} (score deduction: -${ai.total_deduction}%)`);
    }
  }

  lines.push(">");
  lines.push(`${indent}_(Last evaluated: ${score.evaluated_at.split("T")[0]})_`);

  return lines.join("\n");
}

const EXPLAINER_START = "<!-- GESF-SCORE-START -->";
const EXPLAINER_END = "<!-- GESF-SCORE-END -->";

export function injectBadgeIntoReadme(readmeContent: string, badgeSvgPath: string, scoreExplainer?: string): string {
  const badgeLine = `![GESF Compliance](${badgeSvgPath})`;
  const explainerBlock = scoreExplainer
    ? `\n${EXPLAINER_START}\n${scoreExplainer}\n${EXPLAINER_END}`
    : "";

  const existingBadge = /!\[GESF Compliance\]\([^)]*\)/;
  const hasExistingExplainer = readmeContent.includes(EXPLAINER_START) && readmeContent.includes(EXPLAINER_END);

  if (hasExistingExplainer) {
    let updated = readmeContent;

    if (existingBadge.test(updated)) {
      updated = updated.replace(existingBadge, badgeLine);
    }

    const explainerRegex = new RegExp(
      EXPLAINER_START.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") +
      "[\\s\\S]*?" +
      EXPLAINER_END.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    );
    updated = updated.replace(explainerRegex, `${EXPLAINER_START}\n${scoreExplainer || ""}\n${EXPLAINER_END}\n`);

    return updated;
  }

  if (existingBadge.test(readmeContent)) {
    if (scoreExplainer) {
      const badgeIdx = readmeContent.indexOf("![GESF Compliance]");
      const lineEnd = readmeContent.indexOf("\n", badgeIdx);
      const afterBadge = lineEnd !== -1 ? lineEnd : readmeContent.length;
      return readmeContent.slice(0, badgeIdx) + badgeLine +
        "\n" + EXPLAINER_START + "\n" + scoreExplainer + "\n" + EXPLAINER_END + "\n\n" +
        readmeContent.slice(afterBadge + 1);
    }
    return readmeContent.replace(existingBadge, badgeLine);
  }

  const headingMatch = readmeContent.match(/^#\s+.+$/m);
  if (headingMatch && headingMatch.index !== undefined) {
    const afterHeading = headingMatch.index + headingMatch[0].length;
    const insertion = `\n\n${badgeLine}${explainerBlock}\n`;
    return readmeContent.slice(0, afterHeading) + insertion + readmeContent.slice(afterHeading);
  }

  return badgeLine + explainerBlock + "\n\n" + readmeContent;
}
