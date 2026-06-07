import type { DashboardData } from "./index.js";

function gradeColor(grade: string): string {
  switch (grade) {
    case "A": return "#22c55e";
    case "B": return "#84cc16";
    case "C": return "#eab308";
    case "D": return "#f97316";
    case "F": return "#ef4444";
    default: return "#6b7280";
  }
}

function severityBadge(severity: string): string {
  const colors: Record<string, string> = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#3b82f6",
  };
  const color = colors[severity] || "#6b7280";
  return `<span style="background:${color};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">${severity.toUpperCase()}</span>`;
}

function statusBadge(status: string): string {
  const colors: Record<string, string> = {
    pass: "#22c55e",
    fail: "#ef4444",
    warning: "#eab308",
    "not-implemented": "#6b7280",
    "not-applicable": "#9ca3af",
  };
  const labels: Record<string, string> = {
    pass: "PASS",
    fail: "FAIL",
    warning: "WARN",
    "not-implemented": "NOT IMPL",
    "not-applicable": "N/A",
  };
  const color = colors[status] || "#6b7280";
  const label = labels[status] || status.toUpperCase();
  return `<span style="background:${color};color:white;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;">${label}</span>`;
}

function scoreBar(score: number): string {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";
  return `<div style="width:100%;background:#e5e7eb;border-radius:4px;height:8px;margin-top:4px;">
    <div style="width:${score}%;background:${color};height:8px;border-radius:4px;"></div>
  </div>`;
}

function donutSvg(passed: number, total: number): string {
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const pct = total > 0 ? passed / total : 0;
  const offset = circumference * (1 - pct);
  const color = pct >= 0.8 ? "#22c55e" : pct >= 0.6 ? "#eab308" : pct >= 0.4 ? "#f97316" : "#ef4444";
  return `<svg width="140" height="140" viewBox="0 0 140 140">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="12"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="12"
      stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"
      stroke-linecap="round" transform="rotate(-90 ${cx} ${cy})"/>
    <text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="28" font-weight="700" fill="#1f2937">${Math.round(pct * 100)}%</text>
    <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="11" fill="#6b7280">${passed}/${total} passed</text>
  </svg>`;
}

export function renderDashboard(data: DashboardData): string {
  const score = data.score;
  const overall = score?.overall ?? 0;
  const overallGrade = score?.overall_grade ?? "F";
  const frameworks = score?.frameworks || {};
  const findings = data.findings;
  const controls = data.controls;

  const findingsBySeverity = {
    critical: findings.filter(f => f.severity === "critical").length,
    high: findings.filter(f => f.severity === "high").length,
    medium: findings.filter(f => f.severity === "medium").length,
    low: findings.filter(f => f.severity === "low").length,
  };

  const controlsByStatus = {
    pass: controls.filter(c => c.status === "pass").length,
    fail: controls.filter(c => c.status === "fail").length,
    warning: controls.filter(c => c.status === "warning").length,
    "not-implemented": controls.filter(c => c.status === "not-implemented").length,
    "not-applicable": controls.filter(c => c.status === "not-applicable").length,
  };

  const frameworkKeys = Object.keys(frameworks);
  const missingControls = controls.filter(c => c.status !== "pass" && c.status !== "not-applicable");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GESF Dashboard - ${escapeHtml(data.projectName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #f3f4f6; color: #1f2937; line-height: 1.6; }
  .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 24px 32px; }
  .header h1 { font-size: 24px; font-weight: 700; }
  .header .subtitle { font-size: 14px; opacity: 0.9; margin-top: 4px; }
  .container { max-width: 1200px; margin: 0 auto; padding: 24px; }
  .grid { display: grid; gap: 20px; }
  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 768px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
  .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 12px; }
  .big-number { font-size: 42px; font-weight: 700; }
  .flex-center { display: flex; align-items: center; justify-content: center; }
  .stat { text-align: center; }
  .stat .num { font-size: 32px; font-weight: 700; }
  .stat .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 11px; text-transform: uppercase; }
  td { padding: 10px 8px; border-bottom: 1px solid #f3f4f6; }
  tr:hover td { background: #f9fafb; }
  .badge-row { display: flex; gap: 6px; flex-wrap: wrap; }
  .framework-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
  .framework-row:last-child { border-bottom: none; }
  .framework-name { font-size: 14px; font-weight: 600; min-width: 140px; }
  .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; }
  a { color: #0f766e; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .pct-text { font-size: 13px; font-weight: 600; min-width: 50px; text-align: right; }
  .bar-container { flex: 1; margin: 0 12px; }
  .tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; margin: 2px; }
</style>
</head>
<body>

<div class="header">
  <h1>GESF Compliance Dashboard</h1>
  <div class="subtitle">${escapeHtml(data.projectName)} | ${escapeHtml(data.projectType)} | GESF v${escapeHtml(data.gesfVersion)}</div>
</div>

<div class="container">
  <div class="grid">

    <div class="grid grid-3">
      <div class="card stat">
        ${donutSvg(score ? Object.values(frameworks).reduce((n,f)=>n+f.passed_controls,0) : 0, controls.length || 1)}
        <div class="label">Overall Compliance</div>
      </div>
      <div class="card">
        <div class="card-title">Overall Score</div>
        <div class="big-number" style="color:${gradeColor(overallGrade)};">${overall}%</div>
        <div style="margin-top:4px;"><span style="background:${gradeColor(overallGrade)};color:white;padding:4px 16px;border-radius:6px;font-weight:700;">Grade: ${overallGrade}</span></div>
        ${scoreBar(overall)}
      </div>
      <div class="card">
        <div class="card-title">Security Findings</div>
        <div class="big-number" style="color:${findings.length > 0 ? '#ef4444' : '#22c55e'};">${findings.length}</div>
        <div style="margin-top:8px;font-size:13px;color:#6b7280;">
          <span style="color:#ef4444;font-weight:600;">${findingsBySeverity.critical} critical</span> |
          <span style="color:#f97316;font-weight:600;">${findingsBySeverity.high} high</span> |
          <span style="color:#eab308;font-weight:600;">${findingsBySeverity.medium} medium</span> |
          <span style="color:#3b82f6;font-weight:600;">${findingsBySeverity.low} low</span>
        </div>
      </div>
    </div>

    <div class="grid grid-2">

      <div class="card">
        <div class="card-title">Framework Scores</div>
        ${frameworkKeys.length > 0 ? frameworkKeys.map(fw => {
          const f = frameworks[fw];
          const pct = f.score;
          const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444';
          return `<div class="framework-row">
            <div class="framework-name">${escapeHtml(fw)}</div>
            <div class="bar-container">${scoreBar(pct)}</div>
            <div class="pct-text" style="color:${color};">${pct}% (${f.grade})</div>
          </div>`;
        }).join('') : '<div style="padding:20px;text-align:center;color:#9ca3af;">No framework data. Run "ges score".</div>'}
      </div>

      <div class="card">
        <div class="card-title">Control Status Breakdown</div>
        <div class="grid grid-3" style="gap:12px;">
          <div class="stat">
            <div class="num" style="color:#22c55e;">${controlsByStatus.pass}</div>
            <div class="label">Pass</div>
          </div>
          <div class="stat">
            <div class="num" style="color:#ef4444;">${controlsByStatus.fail}</div>
            <div class="label">Fail</div>
          </div>
          <div class="stat">
            <div class="num" style="color:#eab308;">${controlsByStatus.warning}</div>
            <div class="label">Warning</div>
          </div>
          <div class="stat">
            <div class="num" style="color:#6b7280;">${controlsByStatus["not-implemented"]}</div>
            <div class="label">Not Impl</div>
          </div>
          <div class="stat">
            <div class="num" style="color:#9ca3af;">${controlsByStatus["not-applicable"]}</div>
            <div class="label">N/A</div>
          </div>
          <div class="stat">
            <div class="num">${controls.length}</div>
            <div class="label">Total</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-2">

      <div class="card">
        <div class="card-title">Security Findings Detail (${findings.length})</div>
        ${findings.length > 0 ? `<table>
          <thead><tr><th>Severity</th><th>Rule</th><th>File</th><th>Issue</th></tr></thead>
          <tbody>
            ${findings.slice(0, 15).map(f => `<tr>
              <td>${severityBadge(f.severity)}</td>
              <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.ruleId)}</td>
              <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</td>
              <td>${escapeHtml(f.title)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        ${findings.length > 15 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">... and ${findings.length - 15} more findings</div>` : ''}` : '<div style="padding:24px;text-align:center;color:#22c55e;font-weight:600;">No security findings. Project is clean.</div>'}
      </div>

      <div class="card">
        <div class="card-title">Missing Controls (${missingControls.length})</div>
        ${missingControls.length > 0 ? `<table>
          <thead><tr><th>ID</th><th>Name</th><th>Severity</th><th>Status</th></tr></thead>
          <tbody>
            ${missingControls.slice(0, 15).map(c => `<tr>
              <td style="font-family:monospace;font-size:11px;">${escapeHtml(c.id)}</td>
              <td>${escapeHtml(c.name)}</td>
              <td>${severityBadge(c.severity)}</td>
              <td>${statusBadge(c.status)}</td>
            </tr>`).join('')}
          </tbody>
        </table>
        ${missingControls.length > 15 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">... and ${missingControls.length - 15} more</div>` : ''}` : '<div style="padding:24px;text-align:center;color:#22c55e;font-weight:600;">All controls are passing.</div>'}
      </div>
    </div>

    <div class="card">
      <div class="card-title">Installed Policy Packs (${data.packs.length})</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        ${data.packs.map(p => `<span class="tag">${escapeHtml(p.id)} (${p.controlCount} controls)</span>`).join('')}
      </div>
    </div>

    <div class="card">
      <div class="card-title">Active Frameworks</div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
        ${data.frameworks.map(fw => `<span class="tag" style="background:#d1fae5;color:#065f46;">${escapeHtml(fw)}</span>`).join('') || '<span style="color:#9ca3af;">No frameworks configured</span>'}
      </div>
    </div>

  </div>

  <div class="footer">
    Generated by GESF v${escapeHtml(data.gesfVersion)} | Last audit: ${escapeHtml(new Date(data.lastAudit).toLocaleString())} | <a href="/api/data">JSON API</a>
  </div>
</div>

</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
