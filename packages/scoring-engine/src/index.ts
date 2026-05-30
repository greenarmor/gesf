import type { Control, ComplianceScore, ScoreFile, FrameworkName } from "@greenarmor/ges-core";

export function scoreControls(controls: Control[]): number {
  if (controls.length === 0) return 0;
  const passed = controls.filter(c => c.status === "pass" || c.status === "not-applicable").length;
  return Math.round((passed / controls.length) * 100);
}

export function scoreByFramework(controls: Control[], frameworks: FrameworkName[]): Record<string, ComplianceScore> {
  const result: Record<string, ComplianceScore> = {};
  for (const fw of frameworks) {
    const fwControls = controls.filter(c => c.framework === fw);
    const total = fwControls.length;
    const passed = fwControls.filter(c => c.status === "pass").length;
    const failed = fwControls.filter(c => c.status === "fail").length;
    const warning = fwControls.filter(c => c.status === "warning").length;
    const notApplicable = fwControls.filter(c => c.status === "not-applicable").length;
    const score = total > 0 ? Math.round(((passed + notApplicable) / total) * 100) : 0;

    result[fw] = {
      framework: fw,
      score,
      total_controls: total,
      passed_controls: passed,
      failed_controls: failed,
      warning_controls: warning,
      not_applicable: notApplicable,
      evaluated_at: new Date().toISOString(),
    };
  }
  return result;
}

export function computeOverallScore(frameworkScores: Record<string, ComplianceScore>): number {
  const scores = Object.values(frameworkScores);
  if (scores.length === 0) return 0;
  const total = scores.reduce((sum, s) => sum + s.score, 0);
  return Math.round(total / scores.length);
}

export function generateScoreFile(controls: Control[], frameworks: FrameworkName[]): ScoreFile {
  const frameworkScores = scoreByFramework(controls, frameworks);
  const overall = computeOverallScore(frameworkScores);
  return {
    overall,
    frameworks: frameworkScores,
    evaluated_at: new Date().toISOString(),
  };
}

export function formatScoreOutput(score: ScoreFile): string {
  const lines: string[] = [];
  lines.push("");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    const padding = Math.max(1, 20 - fw.length);
    const dots = ".".repeat(padding);
    lines.push(`  ${fw} ${dots} ${data.score}%`);
  }
  const overallPadding = Math.max(1, 20 - "Overall".length);
  const overallDots = ".".repeat(overallPadding);
  lines.push(`  Overall ${overallDots} ${score.overall}%`);
  lines.push("");
  return lines.join("\n");
}
