import type { DashboardData } from "./index.js";
import type { Control } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";

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

function severityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "#ef4444",
    high: "#f97316",
    medium: "#eab308",
    low: "#3b82f6",
  };
  return colors[severity] || "#6b7280";
}

function statusColor(status: string): string {
  const colors: Record<string, string> = {
    pass: "#22c55e",
    fail: "#ef4444",
    warning: "#eab308",
    "not-implemented": "#6b7280",
    "not-applicable": "#9ca3af",
  };
  return colors[status] || "#6b7280";
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    pass: "PASS",
    fail: "FAIL",
    warning: "WARN",
    "not-implemented": "NOT IMPL",
    "not-applicable": "N/A",
  };
  return labels[status] || status.toUpperCase();
}

export function renderDashboard(data: DashboardData): string {
  const score = data.score;
  const overall = score?.overall ?? 0;
  const overallGrade = score?.overall_grade ?? "F";
  const frameworks = score?.frameworks || {};
  const findings = data.findings;
  const controls = data.controls;
  const packs = data.packs;

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

  const findingsByPackId: Record<string, typeof findings> = {};
  for (const f of findings) {
    for (const cid of f.controlIds) {
      const pack = packs.find(p => {
        const pControls = getAllControlsForPack(p.id, controls);
        return pControls.some(c => c.id === cid);
      });
      if (pack) {
        if (!findingsByPackId[pack.id]) findingsByPackId[pack.id] = [];
        if (!findingsByPackId[pack.id].includes(f)) findingsByPackId[pack.id].push(f);
      }
    }
  }

  function getAllControlsForPack(packId: string, allControls: typeof controls): typeof controls {
    return allControls.filter(c => {
      const idUpper = c.id.toUpperCase();
      const packPrefix = packId.toUpperCase().replace(/-/g, "");
      if (packId === "gdpr") return idUpper.startsWith("GDPR-");
      if (packId === "owasp") return idUpper.startsWith("OWASP-");
      if (packId === "cis") return idUpper.startsWith("CIS-");
      if (packId === "nist") return idUpper.startsWith("NIST-");
      if (packId === "ai") return idUpper.startsWith("AI-");
      if (packId === "blockchain") return idUpper.startsWith("BC-");
      if (packId === "government") return idUpper.startsWith("GOV-");
      if (packId === "iso27001") return idUpper.startsWith("ISO27K-");
      if (packId === "iso27701") return idUpper.startsWith("ISO277-");
      if (packId === "hipaa") return idUpper.startsWith("HIPAA-");
      return false;
    });
  }

  const packJson = JSON.stringify(packs.map(p => ({
    ...p,
    _controls: undefined,
  })));

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>GESF Dashboard - ${escapeHtml(data.projectName)}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; background: #f3f4f6; color: #1f2937; line-height: 1.6; }
  .header { background: linear-gradient(135deg, #0f766e 0%, #14b8a6 100%); color: white; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  .header h1 { font-size: 24px; font-weight: 700; }
  .header .subtitle { font-size: 14px; opacity: 0.9; margin-top: 4px; }
  .nav-tabs { display: flex; gap: 4px; }
  .nav-tab { background: rgba(255,255,255,0.15); color: white; border: none; padding: 8px 18px; border-radius: 8px 8px 0 0; cursor: pointer; font-size: 13px; font-weight: 600; transition: background 0.2s; }
  .nav-tab:hover { background: rgba(255,255,255,0.25); }
  .nav-tab.active { background: #f3f4f6; color: #0f766e; }
  .container { max-width: 1400px; margin: 0 auto; padding: 24px; }
  .page { display: none; }
  .page.active { display: block; }
  .grid { display: grid; gap: 20px; }
  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-4 { grid-template-columns: repeat(4, 1fr); }
  @media (max-width: 900px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } }
  .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
  .card-title { font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; margin-bottom: 12px; }
  .big-number { font-size: 42px; font-weight: 700; }
  .stat { text-align: center; }
  .stat .num { font-size: 32px; font-weight: 700; }
  .stat .label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th { text-align: left; padding: 10px 8px; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280; font-size: 11px; text-transform: uppercase; }
  td { padding: 10px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  tr:hover td { background: #f9fafb; }
  .framework-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; }
  .framework-row:last-child { border-bottom: none; }
  .framework-name { font-size: 14px; font-weight: 600; min-width: 140px; }
  .footer { text-align: center; padding: 24px; color: #9ca3af; font-size: 12px; }
  a, .link { color: #0f766e; text-decoration: none; cursor: pointer; }
  a:hover, .link:hover { text-decoration: underline; }
  .pct-text { font-size: 13px; font-weight: 600; min-width: 50px; text-align: right; }
  .bar-container { flex: 1; margin: 0 12px; }
  .tag { display: inline-block; background: #e0f2fe; color: #0369a1; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; margin: 2px; }
  .badge { display: inline-block; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
  .badge-sev { min-width: 60px; text-align: center; }
  .badge-status { min-width: 70px; text-align: center; }

  .score-bar-wrap { width: 100%; background: #e5e7eb; border-radius: 4px; height: 8px; margin-top: 4px; }
  .score-bar-fill { height: 8px; border-radius: 4px; transition: width 0.4s; }

  .pack-card { cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s, box-shadow 0.2s; }
  .pack-card:hover { border-color: #14b8a6; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .pack-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .pack-name { font-size: 16px; font-weight: 700; color: #1f2937; }
  .pack-score { font-size: 24px; font-weight: 700; }
  .pack-desc { font-size: 13px; color: #6b7280; margin-bottom: 12px; line-height: 1.5; }
  .pack-stats { display: flex; gap: 16px; flex-wrap: wrap; font-size: 12px; color: #4b5563; }
  .pack-stats span { display: flex; align-items: center; gap: 4px; }

  .detail-back { display: inline-flex; align-items: center; gap: 6px; color: #0f766e; font-size: 14px; font-weight: 600; cursor: pointer; margin-bottom: 16px; }
  .detail-back:hover { text-decoration: underline; }
  .detail-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
  .detail-title { font-size: 22px; font-weight: 700; }
  .detail-meta { font-size: 13px; color: #6b7280; }

  .control-row { cursor: pointer; }
  .control-row:hover td { background: #ecfdf5; }

  .findings-trace { margin-top: 8px; }
  .trace-item { background: #fef2f2; border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 0 6px 6px 0; margin-bottom: 8px; font-size: 13px; }
  .trace-item.high { background: #fff7ed; border-left-color: #f97316; }
  .trace-item.medium { background: #fefce8; border-left-color: #eab308; }
  .trace-item.low { background: #eff6ff; border-left-color: #3b82f6; }
  .trace-title { font-weight: 600; margin-bottom: 4px; }
  .trace-detail { color: #6b7280; font-size: 12px; }
  .trace-fix { background: #f0fdf4; border-left: 3px solid #22c55e; padding: 10px 14px; border-radius: 0 6px 6px 0; margin: 6px 0 12px 6px; font-size: 13px; }
  .trace-fix-label { font-weight: 600; color: #166534; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }

  .guidance-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin-top: 12px; }
  .guidance-box h4 { font-size: 13px; color: #166534; margin-bottom: 8px; }
  .guidance-box p { font-size: 13px; color: #374151; line-height: 1.6; }

  .check-list { list-style: none; padding: 0; }
  .check-list li { padding: 6px 0; border-bottom: 1px solid #f3f4f6; display: flex; align-items: center; gap: 8px; font-size: 13px; }
  .check-list li:last-child { border-bottom: none; }
  .check-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 700; }

  .breadcrumb { font-size: 13px; color: #6b7280; margin-bottom: 16px; }
  .breadcrumb span { color: #0f766e; cursor: pointer; }
  .breadcrumb span:hover { text-decoration: underline; }

    .fix-detail-card { background: white; border-radius: 12px; padding: 0; box-shadow: 0 1px 3px rgba(0,0,0,0.08); margin-bottom: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
    .fix-detail-header { display: flex; align-items: center; gap: 12px; padding: 16px 20px; cursor: pointer; }
    .fix-detail-header:hover { background: #f9fafb; }
    .fix-detail-header.critical { border-left: 4px solid #ef4444; }
    .fix-detail-header.high { border-left: 4px solid #f97316; }
    .fix-detail-header.medium { border-left: 4px solid #eab308; }
    .fix-detail-header.low { border-left: 4px solid #3b82f6; }
    .fix-detail-num { font-size: 24px; font-weight: 700; min-width: 40px; text-align: center; }
    .fix-detail-info { flex: 1; }
    .fix-detail-title { font-size: 15px; font-weight: 700; color: #1f2937; }
    .fix-detail-meta { font-size: 12px; color: #6b7280; margin-top: 3px; }
    .fix-detail-badges { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
    .fix-detail-body { display: none; padding: 0 20px 20px; border-top: 1px solid #f3f4f6; }
    .fix-detail-body.open { display: block; }
    .fix-section { margin-top: 16px; }
    .fix-section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #374151; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e5e7eb; }
    .fix-finding-item { background: #fef2f2; border-left: 3px solid #ef4444; padding: 10px 14px; border-radius: 0 6px 6px 0; margin-bottom: 8px; }
    .fix-finding-item.high { background: #fff7ed; border-left-color: #f97316; }
    .fix-finding-item.medium { background: #fefce8; border-left-color: #eab308; }
    .fix-finding-item.low { background: #eff6ff; border-left-color: #3b82f6; }
    .fix-guidance-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; font-size: 13px; color: #374151; line-height: 1.7; }
    .fix-guidance-box strong { color: #166534; }
    .fix-checks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    @media (max-width: 768px) { .fix-checks-grid { grid-template-columns: 1fr; } }
    .fix-check-item { display: flex; align-items: center; gap: 8px; padding: 6px 10px; border-radius: 6px; font-size: 13px; background: #f9fafb; }
    .fix-check-pass { background: #f0fdf4; }
    .fix-check-fail { background: #fef2f2; }
    .fix-check-icon { width: 18px; height: 18px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; color: white; font-size: 10px; font-weight: 700; flex-shrink: 0; }
    .fix-toggle { font-size: 12px; color: #0f766e; cursor: pointer; font-weight: 600; }
    .fix-toggle:hover { text-decoration: underline; }
    .fix-evidence { background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; font-family: monospace; font-size: 11px; color: #4b5563; margin-top: 4px; white-space: pre-wrap; word-break: break-all; }

  .tab-bar { display: flex; gap: 2px; border-bottom: 2px solid #e5e7eb; margin-bottom: 16px; }
  .tab-btn { padding: 8px 16px; font-size: 13px; font-weight: 600; color: #6b7280; background: none; border: none; border-bottom: 2px solid transparent; cursor: pointer; margin-bottom: -2px; transition: color 0.2s, border-color 0.2s; }
  .tab-btn:hover { color: #0f766e; }
  .tab-btn.active { color: #0f766e; border-bottom-color: #0f766e; }
  .tab-panel { display: none; }
  .tab-panel.active { display: block; }

  .empty-state { text-align: center; padding: 40px 20px; color: #9ca3af; }
  .empty-state .icon { font-size: 48px; margin-bottom: 12px; }
  .empty-state .msg { font-size: 15px; font-weight: 600; }
  .empty-state .sub { font-size: 13px; margin-top: 4px; }

  @media (max-width: 768px) {
    .header { padding: 16px; }
    .container { padding: 16px; }
    .nav-tabs { width: 100%; overflow-x: auto; }
  }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>GESF Compliance Dashboard</h1>
    <div class="subtitle">${escapeHtml(data.projectName)} | ${escapeHtml(data.projectType)} | GESF v${escapeHtml(data.gesfVersion)}</div>
  </div>
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="showPage('overview', this)">Overview</button>
    <button class="nav-tab" onclick="showPage('packs', this)">Policy Packs</button>
    <button class="nav-tab" onclick="showPage('fixes', this)">Fixes Detail</button>
    <button class="nav-tab" onclick="showPage('findings', this)">Findings</button>
    <button class="nav-tab" onclick="showPage('traceability', this)">Traceability</button>
  </div>
</div>

<div class="container">

  <div id="page-overview" class="page active">
    <div class="grid">
      <div class="grid grid-3">
        <div class="card stat">
          ${donutSvg(controls.filter(c => c.status === "pass" || c.status === "not-applicable").length, controls.length || 1)}
          <div class="label">Overall Compliance</div>
        </div>
        <div class="card">
          <div class="card-title">Overall Score</div>
          <div class="big-number" style="color:${gradeColor(overallGrade)};">${overall}%</div>
          <div style="margin-top:4px;"><span class="badge" style="background:${gradeColor(overallGrade)};padding:4px 16px;border-radius:6px;font-size:14px;">Grade: ${overallGrade}</span></div>
          ${scoreBarHtml(overall)}
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
              <div class="bar-container">${scoreBarHtml(pct)}</div>
              <div class="pct-text" style="color:${color};">${pct}% (${f.grade})</div>
            </div>`;
          }).join('') : '<div class="empty-state"><div class="msg">No framework data</div><div class="sub">Run "ges score" to generate scores</div></div>'}
        </div>

        <div class="card">
          <div class="card-title">Control Status Breakdown</div>
          <div class="grid grid-3" style="gap:12px;">
            <div class="stat"><div class="num" style="color:#22c55e;">${controlsByStatus.pass}</div><div class="label">Pass</div></div>
            <div class="stat"><div class="num" style="color:#ef4444;">${controlsByStatus.fail}</div><div class="label">Fail</div></div>
            <div class="stat"><div class="num" style="color:#eab308;">${controlsByStatus.warning}</div><div class="label">Warning</div></div>
            <div class="stat"><div class="num" style="color:#6b7280;">${controlsByStatus["not-implemented"]}</div><div class="label">Not Impl</div></div>
            <div class="stat"><div class="num" style="color:#9ca3af;">${controlsByStatus["not-applicable"]}</div><div class="label">N/A</div></div>
            <div class="stat"><div class="num">${controls.length}</div><div class="label">Total</div></div>
          </div>
        </div>
      </div>

      <div class="grid grid-2">
        <div class="card">
          <div class="card-title">Security Findings Detail (${findings.length})</div>
          ${findings.length > 0 ? `<table>
            <thead><tr><th>Severity</th><th>Rule</th><th>File</th><th>Issue</th><th>Controls</th></tr></thead>
            <tbody>
              ${findings.slice(0, 20).map(f => `<tr>
                <td><span class="badge badge-sev" style="background:${severityColor(f.severity)}">${f.severity.toUpperCase()}</span></td>
                <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.ruleId)}</td>
                <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</td>
                <td>${escapeHtml(f.title)}</td>
                <td>${f.controlIds.length > 0 ? f.controlIds.map(cid => `<span class="tag" style="cursor:pointer;" onclick="showControlDetail('${escapeHtml(cid)}')">${escapeHtml(cid)}</span>`).join(' ') : '<span style="color:#9ca3af;">-</span>'}</td>
              </tr>`).join('')}
            </tbody>
          </table>
          ${findings.length > 20 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">... and ${findings.length - 20} more findings</div>` : ''}` : '<div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No security findings</div><div class="sub">Project is clean</div></div>'}
        </div>

        <div class="card">
          <div class="card-title">Missing Controls (${missingControls.length})</div>
          ${missingControls.length > 0 ? `<table>
            <thead><tr><th>ID</th><th>Name</th><th>Severity</th><th>Status</th><th>Findings</th></tr></thead>
            <tbody>
              ${missingControls.slice(0, 20).map(c => {
                const ctrlFindings = findings.filter(f => f.controlIds.includes(c.id));
                return `<tr class="control-row" onclick="showControlDetail('${escapeHtml(c.id)}')">
                  <td style="font-family:monospace;font-size:11px;">${escapeHtml(c.id)}</td>
                  <td>${escapeHtml(c.name)}</td>
                  <td><span class="badge badge-sev" style="background:${severityColor(c.severity)}">${c.severity.toUpperCase()}</span></td>
                  <td><span class="badge badge-status" style="background:${statusColor(c.status)}">${statusLabel(c.status)}</span></td>
                  <td>${ctrlFindings.length > 0 ? `<span style="color:#ef4444;font-weight:600;">${ctrlFindings.length}</span>` : '<span style="color:#9ca3af;">0</span>'}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
          ${missingControls.length > 20 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">... and ${missingControls.length - 20} more</div>` : ''}` : '<div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">All controls passing</div></div>'}
        </div>
      </div>

      <div class="card">
        <div class="card-title">Active Frameworks</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          ${data.frameworks.map(fw => `<span class="tag" style="background:#d1fae5;color:#065f46;">${escapeHtml(fw)}</span>`).join('') || '<span style="color:#9ca3af;">No frameworks configured</span>'}
        </div>
      </div>
    </div>
  </div>

  <div id="page-packs" class="page">
    <div id="packs-list">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;">Policy Packs &mdash; Detailed Reports</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">Click any pack to drill down into controls, findings, and fix guidance.</p>
      <div class="grid grid-2">
        ${packs.map(p => {
          const pct = p.score;
          const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444';
          return `<div class="card pack-card" onclick="loadPackDetail('${p.id}')">
          <div class="pack-header">
            <div>
              <div class="pack-name">${escapeHtml(p.name)}</div>
              <div style="font-size:12px;color:#6b7280;margin-top:2px;">${escapeHtml(p.id)} v${escapeHtml(p.version)}</div>
            </div>
            <div class="pack-score" style="color:${color};">${pct}%</div>
          </div>
          <div class="pack-desc">${escapeHtml(p.description)}</div>
          ${scoreBarHtml(pct)}
          <div class="pack-stats" style="margin-top:12px;">
            <span><span class="badge badge-status" style="background:#22c55e;">${p.passedCount - p.notApplicableCount}</span> pass</span>
            <span><span class="badge badge-status" style="background:#ef4444;">${p.failedCount}</span> fail</span>
            <span><span class="badge badge-status" style="background:#eab308;">${p.warningCount}</span> warn</span>
            <span><span class="badge badge-status" style="background:#6b7280;">${p.notImplementedCount}</span> not impl</span>
            <span><span class="badge badge-status" style="background:#9ca3af;">${p.notApplicableCount}</span> N/A</span>
            <span style="color:#ef4444;font-weight:600;">${p.findingsCount} findings</span>
            <span>${p.controlCount} controls</span>
            ${p.installed ? '<span style="color:#0f766e;font-weight:600;">Installed</span>' : '<span style="color:#9ca3af;">Not installed</span>'}
          </div>
        </div>`;
        }).join('')}
      </div>
    </div>
    <div id="pack-detail" style="display:none;"></div>
  </div>

  <div id="page-fixes" class="page">
    <div class="tab-bar" style="margin-bottom:0;">
      <button class="tab-btn active" onclick="showFixesTab('history', this)">Fix History (${data.fixHistory.length})</button>
      <button class="tab-btn" onclick="showFixesTab('pending', this)">Pending Fixes (${findings.length})</button>
    </div>

    <div id="fixes-tab-history" class="tab-panel active">
      ${renderFixHistorySection(data.fixHistory)}
    </div>

    <div id="fixes-tab-pending" class="tab-panel">
      ${renderDetailedFixesList(findings, controls, packs)}
    </div>
  </div>

  <div id="page-findings" class="page">
    <div id="findings-main">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:16px;">Security Findings Report</h2>
      <div class="tab-bar">
        <button class="tab-btn active" onclick="showFindingsTab('all', this)">All (${findings.length})</button>
        <button class="tab-btn" onclick="showFindingsTab('critical', this)">Critical (${findingsBySeverity.critical})</button>
        <button class="tab-btn" onclick="showFindingsTab('high', this)">High (${findingsBySeverity.high})</button>
        <button class="tab-btn" onclick="showFindingsTab('medium', this)">Medium (${findingsBySeverity.medium})</button>
        <button class="tab-btn" onclick="showFindingsTab('low', this)">Low (${findingsBySeverity.low})</button>
        <button class="tab-btn" onclick="showFindingsTab('bypack', this)">By Pack</button>
      </div>

      <div id="findings-tab-all" class="tab-panel active">
        ${renderFindingsTable(findings)}
      </div>
      <div id="findings-tab-critical" class="tab-panel">${renderFindingsTable(findings.filter(f => f.severity === "critical"))}</div>
      <div id="findings-tab-high" class="tab-panel">${renderFindingsTable(findings.filter(f => f.severity === "high"))}</div>
      <div id="findings-tab-medium" class="tab-panel">${renderFindingsTable(findings.filter(f => f.severity === "medium"))}</div>
      <div id="findings-tab-low" class="tab-panel">${renderFindingsTable(findings.filter(f => f.severity === "low"))}</div>
      <div id="findings-tab-bypack" class="tab-panel">
        ${packs.filter(p => (findingsByPackId[p.id] || []).length > 0).length > 0 ? packs.filter(p => (findingsByPackId[p.id] || []).length > 0).map(p => `
          <div class="card" style="margin-bottom:16px;">
            <div class="card-title" style="cursor:pointer;" onclick="loadPackDetail('${p.id}')">
              ${escapeHtml(p.name)} &mdash; ${(findingsByPackId[p.id] || []).length} findings
              <span style="float:right;color:#0f766e;font-weight:400;font-size:11px;">View pack details &rarr;</span>
            </div>
            ${renderFindingsTable(findingsByPackId[p.id] || [])}
          </div>
        `).join('') : '<div class="empty-state"><div class="msg">No findings mapped to policy packs</div></div>'}
      </div>
    </div>
    <div id="finding-detail" style="display:none;"></div>
  </div>

  <div id="page-traceability" class="page">
    <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Fix Traceability Matrix</h2>
    <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">Finding &rarr; Fix &rarr; Control &rarr; Policy Pack traceability for every security issue.</p>
    <div class="tab-bar">
      <button class="tab-btn active" onclick="showTraceTab('matrix', this)">Matrix</button>
      <button class="tab-btn" onclick="showTraceTab('fixes', this)">Prioritized Fixes</button>
      <button class="tab-btn" onclick="showTraceTab('controls', this)">Control Coverage</button>
    </div>

    <div id="trace-tab-matrix" class="tab-panel active">
      ${findings.length > 0 ? `<div class="card">
        <table>
          <thead><tr><th>Finding</th><th>Severity</th><th>File</th><th>Linked Controls</th><th>Policy Pack</th><th>Fix Guidance</th></tr></thead>
          <tbody>
            ${findings.slice(0, 50).map(f => {
              const linkedControls = controls.filter(c => f.controlIds.includes(c.id));
              const linkedPackIds = new Set<string>();
              for (const ctrl of linkedControls) {
                const pk = packs.find(pp => {
                  const pCtrls = getAllControlsForPack(pp.id, controls);
                  return pCtrls.some(c2 => c2.id === ctrl.id);
                });
                if (pk) linkedPackIds.add(pk.id);
              }
              return `<tr>
                <td>
                  <div style="font-weight:600;font-size:13px;">${escapeHtml(f.title)}</div>
                  <div style="font-size:11px;color:#6b7280;">${escapeHtml(f.ruleId)}</div>
                </td>
                <td><span class="badge badge-sev" style="background:${severityColor(f.severity)}">${f.severity.toUpperCase()}</span></td>
                <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</td>
                <td>${linkedControls.length > 0 ? linkedControls.map(c => `<div style="margin-bottom:2px;"><span class="link" onclick="showControlDetail('${escapeHtml(c.id)}')">${escapeHtml(c.id)}</span> <span style="color:#6b7280;font-size:11px;">${escapeHtml(c.name)}</span></div>`).join('') : '<span style="color:#9ca3af;">No linked controls</span>'}</td>
                <td>${linkedPackIds.size > 0 ? [...linkedPackIds].map(pid => {
                  const pk = packs.find(pp => pp.id === pid);
                  return pk ? `<span class="tag" style="cursor:pointer;" onclick="loadPackDetail('${pk.id}')">${escapeHtml(pk.name)}</span>` : '';
                }).join(' ') : '<span style="color:#9ca3af;">-</span>'}</td>
                <td style="max-width:300px;font-size:12px;color:#374151;">${escapeHtml(f.fix)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
        ${findings.length > 50 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">Showing 50 of ${findings.length} findings</div>` : ''}
      </div>` : '<div class="card"><div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No findings to trace</div><div class="sub">All clear</div></div></div>'}
    </div>

    <div id="trace-tab-fixes" class="tab-panel">
      ${renderDetailedFixesList(findings, controls, packs)}
    </div>

    <div id="trace-tab-controls" class="tab-panel">
      <div class="card">
        <div class="card-title">Control Coverage by Policy Pack</div>
        <table>
          <thead><tr><th>Policy Pack</th><th>Total Controls</th><th>Pass</th><th>Fail</th><th>Warn</th><th>Not Impl</th><th>Coverage</th><th>Findings</th></tr></thead>
          <tbody>
            ${packs.map(p => {
              const coverage = p.controlCount > 0 ? Math.round((p.passedCount / p.controlCount) * 100) : 0;
              const covColor = coverage >= 80 ? '#22c55e' : coverage >= 60 ? '#eab308' : '#f97316';
              return `<tr style="cursor:pointer;" onclick="loadPackDetail('${p.id}')">
                <td style="font-weight:600;">${escapeHtml(p.name)}</td>
                <td>${p.controlCount}</td>
                <td style="color:#22c55e;font-weight:600;">${p.passedCount}</td>
                <td style="color:#ef4444;font-weight:600;">${p.failedCount}</td>
                <td style="color:#eab308;font-weight:600;">${p.warningCount}</td>
                <td style="color:#6b7280;">${p.notImplementedCount}</td>
                <td><span style="color:${covColor};font-weight:700;">${coverage}%</span></td>
                <td>${p.findingsCount > 0 ? `<span style="color:#ef4444;font-weight:600;">${p.findingsCount}</span>` : '0'}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>

  <div id="control-detail-modal" style="display:none;"></div>

</div>

<div class="footer">
  Generated by GESF v${escapeHtml(data.gesfVersion)} | Last audit: ${escapeHtml(new Date(data.lastAudit).toLocaleString())} | <a href="/api/data">JSON API</a> | <a href="/api/packs">Packs API</a> | <a href="/api/fix-history">Fix History API</a>
</div>

<script>
(function() {
  var packData = ${JSON.stringify(packs.map(p => ({ id: p.id, name: p.name, controlCount: p.controlCount })))};
  var allControlIds = ${JSON.stringify(controls.map(c => c.id))};

  window.toggleFix = function(id) {
    var body = document.getElementById(id);
    var toggle = document.getElementById(id + '-toggle');
    if (!body) return;
    if (body.classList.contains('open')) {
      body.classList.remove('open');
      if (toggle) toggle.textContent = 'Expand';
    } else {
      body.classList.add('open');
      if (toggle) toggle.textContent = 'Collapse';
    }
  };

  var navTabMap = { overview: 0, packs: 1, fixes: 2, findings: 3, traceability: 4 };

  window.navigateToPage = function(page) {
    var tabs = document.querySelectorAll('.nav-tab');
    var idx = navTabMap[page];
    showPage(page, idx !== undefined ? tabs[idx] : null);
  };

  window.showPage = function(page, btn) {
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) pages[i].classList.remove('active');
    document.getElementById('page-' + page).classList.add('active');
    var tabs = document.querySelectorAll('.nav-tab');
    for (var i = 0; i < tabs.length; i++) tabs[i].classList.remove('active');
    if (btn) btn.classList.add('active');
    if (page === 'packs') {
      document.getElementById('packs-list').style.display = '';
      document.getElementById('pack-detail').style.display = 'none';
    }
    if (page === 'findings') {
      document.getElementById('findings-main').style.display = '';
      document.getElementById('finding-detail').style.display = 'none';
    }
  };

  window.showFindingsTab = function(tab, btn) {
    var panels = document.querySelectorAll('#page-findings .tab-panel');
    for (var i = 0; i < panels.length; i++) panels[i].classList.remove('active');
    document.getElementById('findings-tab-' + tab).classList.add('active');
    var btns = document.querySelectorAll('#page-findings .tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    if (btn) btn.classList.add('active');
  };

  window.showFixesTab = function(tab, btn) {
    var panels = document.querySelectorAll('#page-fixes .tab-panel');
    for (var i = 0; i < panels.length; i++) panels[i].classList.remove('active');
    var el = document.getElementById('fixes-tab-' + tab);
    if (el) el.classList.add('active');
    var btns = document.querySelectorAll('#page-fixes .tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    if (btn) btn.classList.add('active');
  };

  window.showTraceTab = function(tab, btn) {
    var panels = document.querySelectorAll('#page-traceability .tab-panel');
    for (var i = 0; i < panels.length; i++) panels[i].classList.remove('active');
    document.getElementById('trace-tab-' + tab).classList.add('active');
    var btns = document.querySelectorAll('#page-traceability .tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    if (btn) btn.classList.add('active');
  };

  window.loadPackDetail = function(packId) {
    var detail = document.getElementById('pack-detail');
    detail.style.display = '';
    detail.innerHTML = '<div class="card"><div class="card-title">Loading pack details...</div></div>';
    fetch('/api/packs/' + packId)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { detail.innerHTML = '<div class="card"><div class="card-title">Error</div><p>' + esc(data.error) + '</p></div>'; return; }
        renderPackDetail(packId, data, detail);
      })
      .catch(function(e) { detail.innerHTML = '<div class="card"><div class="card-title">Error loading pack</div><p>' + esc(e.message) + '</p></div>'; });
    document.getElementById('packs-list').style.display = 'none';

    var navTabs = document.querySelectorAll('.nav-tab');
    for (var i = 0; i < navTabs.length; i++) {
      if (navTabs[i].textContent.indexOf('Policy') >= 0) {
        navTabs[i].classList.add('active');
      } else {
        navTabs[i].classList.remove('active');
      }
    }
    document.getElementById('page-packs').classList.add('active');
    var pages = document.querySelectorAll('.page');
    for (var i = 0; i < pages.length; i++) {
      if (pages[i].id !== 'page-packs') pages[i].classList.remove('active');
    }
  };

  function renderPackDetail(packId, data, container) {
    var p = data.pack;
    var pct = p.score;
    var color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444';
    var controls = data.controls || [];
    var topFixes = data.topFixes || [];

    var html = '<div class="detail-back" onclick="backToPacks()">&larr; Back to all packs</div>';
    html += '<div class="detail-header">';
    html += '<div><div class="detail-title">' + esc(p.name) + '</div>';
    html += '<div class="detail-meta">' + esc(p.description) + '</div></div>';
    html += '<div style="text-align:right;">';
    html += '<div style="font-size:36px;font-weight:700;color:' + color + ';">' + pct + '%</div>';
    html += '<span class="badge" style="background:' + color + ';padding:4px 14px;border-radius:6px;font-size:13px;">Grade: ' + p.grade + '</span>';
    html += '</div></div>';

    html += '<div class="grid grid-4" style="margin-bottom:20px;">';
    html += '<div class="card stat"><div class="num">' + p.controlCount + '</div><div class="label">Controls</div></div>';
    html += '<div class="card stat"><div class="num" style="color:#22c55e;">' + p.passedCount + '</div><div class="label">Pass</div></div>';
    html += '<div class="card stat"><div class="num" style="color:#ef4444;">' + p.findingsCount + '</div><div class="label">Findings</div></div>';
    html += '<div class="card stat"><div class="num" style="color:#f97316;">' + topFixes.length + '</div><div class="label">Need Fix</div></div>';
    html += '</div>';

    if (topFixes.length > 0) {
      html += '<div class="card" style="margin-bottom:20px;"><div class="card-title">Prioritized Fixes (' + topFixes.length + ')</div>';
      for (var i = 0; i < topFixes.length; i++) {
        var fix = topFixes[i];
        var sevClass = fix.severity;
        var fixId = 'packfix-' + i;
        html += '<div class="fix-detail-card" style="margin-bottom:8px;">';
        html += '<div class="fix-detail-header ' + sevClass + '" onclick="toggleFix(\\'' + fixId + '\\')">';
        html += '<div class="fix-detail-num" style="color:' + sevColor(fix.severity) + ';">' + (i + 1) + '</div>';
        html += '<div class="fix-detail-info">';
        html += '<div class="fix-detail-title">' + esc(fix.controlName) + '</div>';
        html += '<div class="fix-detail-meta">' + esc(fix.controlId) + ' &mdash; ' + fix.findings.length + ' finding(s)</div>';
        html += '</div>';
        html += '<div class="fix-detail-badges">';
        html += '<span class="badge badge-sev" style="background:' + sevColor(fix.severity) + ';font-size:10px;">' + fix.severity.toUpperCase() + '</span>';
        html += '<span class="fix-toggle" id="' + fixId + '-toggle">Expand</span>';
        html += '</div></div>';
        html += '<div class="fix-detail-body" id="' + fixId + '">';
        html += '<div class="fix-section"><div class="fix-section-title">Findings</div>';
        for (var j = 0; j < fix.findings.length; j++) {
          var ff = fix.findings[j];
          html += '<div class="fix-finding-item ' + ff.severity + '">';
          html += '<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">';
          html += '<span class="badge badge-sev" style="background:' + sevColor(ff.severity) + ';font-size:10px;">' + ff.severity.toUpperCase() + '</span>';
          html += '<strong style="font-size:13px;">' + esc(ff.title) + '</strong></div>';
          html += '<div style="font-size:12px;color:#6b7280;"><span style="font-family:monospace;font-weight:600;">' + esc(ff.ruleId) + '</span> &mdash; <span style="font-family:monospace;">' + esc(ff.file) + (ff.line ? ':' + ff.line : '') + '</span></div>';
          if (ff.description) html += '<div style="font-size:12px;color:#4b5563;margin-top:4px;">' + esc(ff.description) + '</div>';
          if (ff.evidence) html += '<div class="fix-evidence">' + esc(ff.evidence) + '</div>';
          html += '</div>';
        }
        html += '</div>';
        html += '<div class="fix-section"><div class="fix-section-title">Fix Guidance</div>';
        html += '<div class="fix-guidance-box"><strong>How to fix:</strong> ' + esc(fix.guidance) + '</div>';
        for (var j = 0; j < fix.findings.length; j++) {
          if (fix.findings[j].fix) {
            html += '<div class="fix-guidance-box" style="margin-top:8px;background:#eff6ff;border-color:#bfdbfe;"><strong>Fix for ' + esc(fix.findings[j].ruleId) + ':</strong> ' + esc(fix.findings[j].fix) + '</div>';
          }
        }
        html += '</div>';
        html += '</div></div>';
      }
      html += '</div>';
    }

    html += '<div class="tab-bar">';
    html += '<button class="tab-btn active" onclick="showPackTab(\\'all\\',this)">All Controls (' + controls.length + ')</button>';
    html += '<button class="tab-btn" onclick="showPackTab(\\'failing\\',this)">Failing (' + (controls.filter(function(c){return c.status!=="pass"&&c.status!=="not-applicable"}).length) + ')</button>';
    html += '<button class="tab-btn" onclick="showPackTab(\\'withfindings\\',this)">With Findings (' + (controls.filter(function(c){return c.relatedFindings.length>0}).length) + ')</button>';
    html += '</div>';

    html += '<div id="pack-controls-all">';
    html += renderControlsTable(controls);
    html += '</div>';
    html += '<div id="pack-controls-failing" style="display:none;">';
    html += renderControlsTable(controls.filter(function(c){return c.status!=="pass"&&c.status!=="not-applicable"}));
    html += '</div>';
    html += '<div id="pack-controls-withfindings" style="display:none;">';
    html += renderControlsTable(controls.filter(function(c){return c.relatedFindings.length>0}));
    html += '</div>';

    container.innerHTML = html;
  }

  function renderControlsTable(ctrls) {
    if (ctrls.length === 0) return '<div class="empty-state"><div class="msg">No controls match this filter</div></div>';
    var html = '<table><thead><tr><th>ID</th><th>Name</th><th>Severity</th><th>Status</th><th>Checks</th><th>Findings</th><th>Actions</th></tr></thead><tbody>';
    for (var i = 0; i < ctrls.length; i++) {
      var c = ctrls[i];
      var passedChecks = c.checks.filter(function(ch){return ch.status==='pass'}).length;
      html += '<tr class="control-row" onclick="showControlDetail(\\'' + c.id + '\\')">';
      html += '<td style="font-family:monospace;font-size:11px;">' + esc(c.id) + '</td>';
      html += '<td>' + esc(c.name) + '</td>';
      html += '<td><span class="badge badge-sev" style="background:' + sevColor(c.severity) + '">' + c.severity.toUpperCase() + '</span></td>';
      html += '<td><span class="badge badge-status" style="background:' + statColor(c.status) + '">' + statLabel(c.status) + '</span></td>';
      html += '<td>' + passedChecks + '/' + c.checks.length + '</td>';
      html += '<td>' + (c.relatedFindings.length > 0 ? '<span style="color:#ef4444;font-weight:600;">' + c.relatedFindings.length + '</span>' : '0') + '</td>';
      html += '<td><span class="link">Details &rarr;</span></td>';
      html += '</tr>';
    }
    html += '</tbody></table>';
    return html;
  }

  window.showPackTab = function(tab, btn) {
    var panels = ['all', 'failing', 'withfindings'];
    for (var i = 0; i < panels.length; i++) {
      var el = document.getElementById('pack-controls-' + panels[i]);
      if (el) el.style.display = panels[i] === tab ? '' : 'none';
    }
    var btns = btn.parentElement.querySelectorAll('.tab-btn');
    for (var i = 0; i < btns.length; i++) btns[i].classList.remove('active');
    btn.classList.add('active');
  };

  window.backToPacks = function() {
    document.getElementById('packs-list').style.display = '';
    document.getElementById('pack-detail').style.display = 'none';
  };

  window.showControlDetail = function(controlId) {
    var modal = document.getElementById('control-detail-modal');
    modal.style.display = '';
    modal.innerHTML = '<div class="card"><div class="card-title">Loading control details...</div></div>';
    modal.scrollIntoView({ behavior: 'smooth' });

    fetch('/api/controls/' + controlId)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.error) { modal.innerHTML = '<div class="card"><div class="card-title">Error</div><p>' + esc(data.error) + '</p></div>'; return; }
        renderControlModal(data, modal);
      })
      .catch(function(e) { modal.innerHTML = '<div class="card"><div class="card-title">Error</div><p>' + esc(e.message) + '</p></div>'; });
  };

  function renderControlModal(data, container) {
    var html = '<div class="card" style="position:relative;">';
    html += '<button onclick="document.getElementById(\\'control-detail-modal\\').style.display=\\'none\\'" style="position:absolute;top:16px;right:16px;background:none;border:none;font-size:20px;cursor:pointer;color:#6b7280;">&times;</button>';
    html += '<div class="breadcrumb"><span onclick="navigateToPage(\\'packs\\')">Policy Packs</span> &rsaquo; <span onclick="loadPackDetail(\\'' + data.packId + '\\')">' + esc(data.packName) + '</span> &rsaquo; ' + esc(data.id) + '</div>';
    html += '<div class="detail-header">';
    html += '<div><div class="detail-title">' + esc(data.name) + '</div>';
    html += '<div class="detail-meta">' + esc(data.id) + ' | ' + esc(data.category) + ' | ' + esc(data.framework) + (data.article ? ' | ' + esc(data.article) : '') + '</div></div>';
    html += '<div style="text-align:right;">';
    html += '<span class="badge badge-sev" style="background:' + sevColor(data.severity) + ';font-size:12px;padding:4px 12px;">' + data.severity.toUpperCase() + '</span> ';
    html += '<span class="badge badge-status" style="background:' + statColor(data.status) + ';font-size:12px;padding:4px 12px;">' + statLabel(data.status) + '</span>';
    html += '</div></div>';

    html += '<div style="margin:16px 0;font-size:14px;color:#374151;line-height:1.7;">' + esc(data.description) + '</div>';

    html += '<h3 style="font-size:15px;font-weight:700;margin:20px 0 8px;">Checks (' + data.checks.length + ')</h3>';
    html += '<ul class="check-list">';
    for (var i = 0; i < data.checks.length; i++) {
      var ch = data.checks[i];
      var icon = ch.status === 'pass' ? '&#10003;' : '&#10007;';
      var iconBg = statColor(ch.status);
      html += '<li><span class="check-icon" style="background:' + iconBg + '">' + icon + '</span> <span>' + esc(ch.description) + '</span>';
      if (ch.evidence) html += ' <span style="color:#6b7280;font-size:11px;">(' + esc(ch.evidence) + ')</span>';
      html += '</li>';
    }
    html += '</ul>';

    if (data.relatedFindings && data.relatedFindings.length > 0) {
      html += '<h3 style="font-size:15px;font-weight:700;margin:20px 0 8px;">Related Findings (' + data.relatedFindings.length + ')</h3>';
      html += '<div class="findings-trace">';
      for (var i = 0; i < data.relatedFindings.length; i++) {
        var f = data.relatedFindings[i];
        html += '<div class="trace-item ' + f.severity + '">';
        html += '<div class="trace-title"><span class="badge badge-sev" style="background:' + sevColor(f.severity) + '">' + f.severity.toUpperCase() + '</span> ' + esc(f.title) + '</div>';
        html += '<div class="trace-detail">' + esc(f.ruleId) + ' | ' + esc(f.file) + (f.line ? ':' + f.line : '') + '</div>';
        html += '</div>';
        if (f.fix) {
          html += '<div class="trace-fix"><div class="trace-fix-label">Fix Guidance</div>' + esc(f.fix) + '</div>';
        }
      }
      html += '</div>';
    }

    html += '<div class="guidance-box">';
    html += '<h4>Implementation Guidance</h4>';
    html += '<p>' + esc(data.implementation_guidance) + '</p>';
    html += '</div>';

    html += '</div>';
    container.innerHTML = html;
  }

  function sevColor(s) {
    var m = { critical: '#ef4444', high: '#f97316', medium: '#eab308', low: '#3b82f6' };
    return m[s] || '#6b7280';
  }
  function statColor(s) {
    var m = { pass: '#22c55e', fail: '#ef4444', warning: '#eab308', 'not-implemented': '#6b7280', 'not-applicable': '#9ca3af' };
    return m[s] || '#6b7280';
  }
  function statLabel(s) {
    var m = { pass: 'PASS', fail: 'FAIL', warning: 'WARN', 'not-implemented': 'NOT IMPL', 'not-applicable': 'N/A' };
    return m[s] || (s || '').toUpperCase();
  }
  function esc(str) {
    if (!str) return '';
    var d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }
})();
</script>

</body>
</html>`;
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

function scoreBarHtml(score: number): string {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : score >= 40 ? "#f97316" : "#ef4444";
  return `<div class="score-bar-wrap"><div class="score-bar-fill" style="width:${score}%;background:${color};"></div></div>`;
}

function renderFindingsTable(findings: Finding[]): string {
  if (findings.length === 0) {
    return '<div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No findings in this category</div></div>';
  }
  return `<table>
    <thead><tr><th>Severity</th><th>Rule</th><th>File</th><th>Issue</th><th>Fix Guidance</th></tr></thead>
    <tbody>
      ${findings.slice(0, 50).map(f => `<tr>
        <td><span class="badge badge-sev" style="background:${severityColor(f.severity)}">${f.severity.toUpperCase()}</span></td>
        <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.ruleId)}</td>
        <td style="font-family:monospace;font-size:11px;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</td>
        <td>${escapeHtml(f.title)}</td>
        <td style="max-width:300px;font-size:12px;color:#374151;">${escapeHtml(f.fix)}</td>
      </tr>`).join('')}
    </tbody>
  </table>
  ${findings.length > 50 ? `<div style="text-align:center;padding:8px;color:#9ca3af;font-size:12px;">Showing 50 of ${findings.length}</div>` : ''}`;
}

function renderDetailedFixesList(findings: Finding[], controls: Control[], packs: { id: string; name: string; controlCount: number }[]): string {
  const fixesByControl = new Map<string, { control: Control; findings: Finding[] }>();
  for (const f of findings) {
    for (const cid of f.controlIds) {
      const ctrl = controls.find(c => c.id === cid);
      if (!ctrl) continue;
      const existing = fixesByControl.get(cid);
      if (existing) {
        if (!existing.findings.some(ef => ef.ruleId === f.ruleId && ef.file === f.file && ef.line === f.line)) {
          existing.findings.push(f);
        }
      } else {
        fixesByControl.set(cid, { control: ctrl, findings: [f] });
      }
    }
  }

  const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const fixEntries = [...fixesByControl.values()].sort((a, b) => {
    const aMin = Math.min(...a.findings.map(f => sevOrder[f.severity] ?? 4));
    const bMin = Math.min(...b.findings.map(f => sevOrder[f.severity] ?? 4));
    if (aMin !== bMin) return aMin - bMin;
    return b.findings.length - a.findings.length;
  });

  if (fixEntries.length === 0) {
    return '<div class="card"><div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No fixes needed</div><div class="sub">All findings are resolved</div></div></div>';
  }

  const totalFindings = fixEntries.reduce((sum, e) => sum + e.findings.length, 0);
  const criticalFixes = fixEntries.filter(e => e.findings.some(f => f.severity === "critical")).length;

  let html = '';
  html += `<div style="margin-bottom:20px;">`;
  html += `<h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Detailed Fix List</h2>`;
  html += `<p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every finding that needs a fix, grouped by the control it belongs to, with full traceability to the policy pack.</p>`;
  html += `<div class="grid grid-4" style="margin-bottom:20px;">`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${fixEntries.length}</div><div class="label">Controls to Fix</div></div>`;
  html += `<div class="card stat"><div class="num">${totalFindings}</div><div class="label">Total Findings</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${criticalFixes}</div><div class="label">Critical Fixes</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#f97316;">${fixEntries.filter(e => e.findings.some(f => f.severity === "high")).length}</div><div class="label">High Fixes</div></div>`;
  html += `</div>`;
  html += `</div>`;

  for (let i = 0; i < fixEntries.length; i++) {
    const entry = fixEntries[i];
    const c = entry.control;
    const maxSev = entry.findings.reduce((max, f) => {
      return (sevOrder[f.severity] ?? 4) < (sevOrder[max] ?? 4) ? f.severity : max;
    }, "low" as string);

    const packMatch = packs.find(p => {
      const idUpper = c.id.toUpperCase();
      const packPrefix = p.id.toUpperCase().replace(/-/g, "");
      if (p.id === "gdpr") return idUpper.startsWith("GDPR-");
      if (p.id === "owasp") return idUpper.startsWith("OWASP-");
      if (p.id === "cis") return idUpper.startsWith("CIS-");
      if (p.id === "nist") return idUpper.startsWith("NIST-");
      if (p.id === "ai") return idUpper.startsWith("AI-");
      if (p.id === "blockchain") return idUpper.startsWith("BC-");
      if (p.id === "government") return idUpper.startsWith("GOV-");
      if (p.id === "iso27001") return idUpper.startsWith("ISO27K-");
      if (p.id === "iso27701") return idUpper.startsWith("ISO277-");
      if (p.id === "hipaa") return idUpper.startsWith("HIPAA-");
      return false;
    });

    const fixId = `fix-${i}`;
    const passedChecks = c.checks.filter(ch => ch.status === "pass").length;
    const failedChecks = c.checks.filter(ch => ch.status === "fail").length;

    html += `<div class="fix-detail-card">`;

    html += `<div class="fix-detail-header ${maxSev}" onclick="toggleFix('${fixId}')">`;
    html += `<div class="fix-detail-num" style="color:${severityColor(maxSev)};">${i + 1}</div>`;
    html += `<div class="fix-detail-info">`;
    html += `<div class="fix-detail-title">${escapeHtml(c.name)}</div>`;
    html += `<div class="fix-detail-meta">${escapeHtml(c.id)} | ${escapeHtml(c.category)} | ${escapeHtml(c.framework)}${c.article ? ' | ' + escapeHtml(c.article) : ''} | Pack: ${escapeHtml(packMatch?.name || "Direct")}</div>`;
    html += `</div>`;
    html += `<div class="fix-detail-badges">`;
    html += `<span class="badge badge-sev" style="background:${severityColor(maxSev)}">${maxSev.toUpperCase()}</span>`;
    html += `<span class="badge badge-status" style="background:${statusColor(c.status)}">${statusLabel(c.status)}</span>`;
    html += `<span style="font-size:12px;color:#6b7280;">${entry.findings.length} finding(s)</span>`;
    html += `<span style="font-size:12px;color:#6b7280;">${passedChecks}/${c.checks.length} checks</span>`;
    html += `<span class="fix-toggle" id="${fixId}-toggle">Expand</span>`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="fix-detail-body" id="${fixId}">`;

    html += `<div class="fix-section">`;
    html += `<div class="fix-section-title">Findings (${entry.findings.length})</div>`;
    for (const f of entry.findings) {
      html += `<div class="fix-finding-item ${f.severity}">`;
      html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">`;
      html += `<span class="badge badge-sev" style="background:${severityColor(f.severity)};font-size:10px;">${f.severity.toUpperCase()}</span>`;
      html += `<strong style="font-size:13px;">${escapeHtml(f.title)}</strong>`;
      html += `</div>`;
      html += `<div style="font-size:12px;color:#6b7280;">`;
      html += `<span style="font-family:monospace;font-weight:600;">${escapeHtml(f.ruleId)}</span>`;
      html += ` &mdash; <span style="font-family:monospace;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</span>`;
      html += `</div>`;
      if (f.description) {
        html += `<div style="font-size:12px;color:#4b5563;margin-top:4px;">${escapeHtml(f.description)}</div>`;
      }
      if (f.evidence) {
        html += `<div class="fix-evidence">${escapeHtml(f.evidence)}</div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;

    html += `<div class="fix-section">`;
    html += `<div class="fix-section-title">Fix Guidance</div>`;
    html += `<div class="fix-guidance-box"><strong>How to fix:</strong> ${escapeHtml(c.implementation_guidance)}</div>`;
    for (const f of entry.findings) {
      if (f.fix) {
        html += `<div class="fix-guidance-box" style="margin-top:8px;background:#eff6ff;border-color:#bfdbfe;"><strong>Fix for ${escapeHtml(f.ruleId)}:</strong> ${escapeHtml(f.fix)}</div>`;
      }
    }
    html += `</div>`;

    if (c.checks.length > 0) {
      html += `<div class="fix-section">`;
      html += `<div class="fix-section-title">Control Checks (${passedChecks} passed, ${failedChecks} failed, ${c.checks.length - passedChecks - failedChecks} other)</div>`;
      html += `<div class="fix-checks-grid">`;
      for (const ch of c.checks) {
        const icon = ch.status === "pass" ? "&#10003;" : "&#10007;";
        const checkClass = ch.status === "pass" ? "fix-check-pass" : ch.status === "fail" ? "fix-check-fail" : "";
        html += `<div class="fix-check-item ${checkClass}">`;
        html += `<span class="fix-check-icon" style="background:${statusColor(ch.status)}">${icon}</span>`;
        html += `<span>${escapeHtml(ch.description)}</span>`;
        html += `</div>`;
      }
      html += `</div>`;
      html += `</div>`;
    }

    html += `<div class="fix-section">`;
    html += `<div class="fix-section-title">Traceability</div>`;
    html += `<table><tbody>`;
    html += `<tr><td style="font-weight:600;width:160px;">Control</td><td>${escapeHtml(c.id)} &mdash; ${escapeHtml(c.name)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Category</td><td>${escapeHtml(c.category)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Framework</td><td>${escapeHtml(c.framework)}${c.article ? ' / ' + escapeHtml(c.article) : ''}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Policy Pack</td><td>${packMatch ? `<span class="tag" style="cursor:pointer;" onclick="loadPackDetail('${packMatch.id}')">${escapeHtml(packMatch.name)}</span>` : 'Direct'}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Severity</td><td><span class="badge badge-sev" style="background:${severityColor(c.severity)}">${c.severity.toUpperCase()}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">Status</td><td><span class="badge badge-status" style="background:${statusColor(c.status)}">${statusLabel(c.status)}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">Findings Count</td><td>${entry.findings.length}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Description</td><td style="font-size:13px;color:#4b5563;">${escapeHtml(c.description)}</td></tr>`;
    html += `</tbody></table>`;
    html += `</div>`;

    html += `</div>`;
    html += `</div>`;
  }

  return html;
}

function renderFixHistorySection(entries: import("@greenarmor/ges-core").FixHistoryEntry[]): string {
  if (entries.length === 0) {
    return `<div class="card">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Compliance Fix History</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every autofix applied via CLI or MCP is recorded here with full compliance traceability.</p>
      <div class="empty-state">
        <div class="icon">&#128203;</div>
        <div class="msg">No fixes recorded yet</div>
        <div class="sub">Run <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">ges fix</code> or use the MCP <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">auto_fix</code> tool to apply fixes. Each fix will be recorded here.</div>
      </div>
    </div>`;
  }

  const applied = entries.filter(e => e.fix.applied);
  const failed = entries.filter(e => !e.fix.applied);
  const bySource = { cli: entries.filter(e => e.source === "cli").length, mcp: entries.filter(e => e.source === "mcp").length };
  const frameworksAffected = [...new Set(entries.flatMap(e => e.compliance_impact.frameworks_affected))];
  const totalControlsAddressed = entries.reduce((sum, e) => sum + e.compliance_impact.controls_addressed, 0);

  const bySeverity = {
    critical: entries.filter(e => e.compliance_impact.severity_resolved === "critical").length,
    high: entries.filter(e => e.compliance_impact.severity_resolved === "high").length,
    medium: entries.filter(e => e.compliance_impact.severity_resolved === "medium").length,
    low: entries.filter(e => e.compliance_impact.severity_resolved === "low").length,
  };

  let html = '';
  html += `<h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Compliance Fix History</h2>`;
  html += `<p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every autofix applied via CLI or MCP is recorded here with full compliance traceability.</p>`;

  html += `<div class="grid grid-4" style="margin-bottom:20px;">`;
  html += `<div class="card stat"><div class="num">${entries.length}</div><div class="label">Total Fixes</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#22c55e;">${applied.length}</div><div class="label">Applied</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${failed.length}</div><div class="label">Failed</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#0f766e;">${totalControlsAddressed}</div><div class="label">Controls Addressed</div></div>`;
  html += `</div>`;

  html += `<div class="grid grid-3" style="margin-bottom:20px;">`;
  html += `<div class="card"><div class="card-title">Severity Breakdown</div>
    <div style="display:flex;flex-wrap:wrap;gap:12px;margin-top:8px;">
      <div class="stat"><div class="num" style="color:#ef4444;font-size:20px;">${bySeverity.critical}</div><div class="label">Critical</div></div>
      <div class="stat"><div class="num" style="color:#f97316;font-size:20px;">${bySeverity.high}</div><div class="label">High</div></div>
      <div class="stat"><div class="num" style="color:#eab308;font-size:20px;">${bySeverity.medium}</div><div class="label">Medium</div></div>
      <div class="stat"><div class="num" style="color:#3b82f6;font-size:20px;">${bySeverity.low}</div><div class="label">Low</div></div>
    </div></div>`;
  html += `<div class="card"><div class="card-title">Fix Sources</div>
    <div style="display:flex;gap:16px;margin-top:8px;">
      <div class="stat"><div class="num" style="font-size:20px;">${bySource.cli}</div><div class="label">CLI (ges fix)</div></div>
      <div class="stat"><div class="num" style="font-size:20px;">${bySource.mcp}</div><div class="label">MCP (auto_fix)</div></div>
    </div></div>`;
  html += `<div class="card"><div class="card-title">Frameworks Impacted</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
      ${frameworksAffected.length > 0 ? frameworksAffected.map(fw => `<span class="tag" style="background:#d1fae5;color:#065f46;">${escapeHtml(fw)}</span>`).join('') : '<span style="color:#9ca3af;">None</span>'}
    </div></div>`;
  html += `</div>`;

  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  html += `<div class="card"><div class="card-title">All Recorded Fixes (newest first)</div>`;
  html += `<table><thead><tr><th>Time</th><th>Source</th><th>Severity</th><th>Rule</th><th>Finding</th><th>Fix Action</th><th>Controls</th><th>Frameworks</th><th>Status</th></tr></thead><tbody>`;

  for (const entry of sorted) {
    const time = new Date(entry.timestamp).toLocaleString();
    const sourceBadge = entry.source === "mcp"
      ? '<span class="badge" style="background:#7c3aed;font-size:10px;">MCP</span>'
      : '<span class="badge" style="background:#0f766e;font-size:10px;">CLI</span>';
    const sevBadge = `<span class="badge badge-sev" style="background:${severityColor(entry.compliance_impact.severity_resolved)};font-size:10px;">${entry.compliance_impact.severity_resolved.toUpperCase()}</span>`;
    const statusBadge = entry.fix.applied
      ? '<span class="badge badge-status" style="background:#22c55e;font-size:10px;">APPLIED</span>'
      : `<span class="badge badge-status" style="background:#ef4444;font-size:10px;">FAILED</span>`;
    const controlsHtml = entry.controls.length > 0
      ? entry.controls.map(c => `<div style="margin-bottom:2px;"><span class="link" onclick="showControlDetail('${escapeHtml(c.id)}')">${escapeHtml(c.id)}</span></div>`).join('')
      : '<span style="color:#9ca3af;">-</span>';
    const frameworksHtml = entry.compliance_impact.frameworks_affected.length > 0
      ? entry.compliance_impact.frameworks_affected.map(f => `<span class="tag">${escapeHtml(f)}</span>`).join(' ')
      : '<span style="color:#9ca3af;">-</span>';

    html += `<tr>
      <td style="font-size:11px;white-space:nowrap;">${time}</td>
      <td>${sourceBadge}</td>
      <td>${sevBadge}</td>
      <td style="font-family:monospace;font-size:11px;">${escapeHtml(entry.finding.rule_id)}</td>
      <td style="max-width:200px;">
        <div style="font-weight:600;font-size:12px;">${escapeHtml(entry.finding.title)}</div>
        <div style="font-size:11px;color:#6b7280;">${escapeHtml(entry.finding.file)}${entry.finding.line ? ':' + entry.finding.line : ''}</div>
      </td>
      <td style="max-width:200px;">
        <div style="font-size:12px;"><span class="badge" style="background:#6b7280;font-size:9px;">${entry.fix.action_type.toUpperCase()}</span> ${escapeHtml(entry.fix.file_path)}</div>
        <div style="font-size:11px;color:#6b7280;">${escapeHtml(entry.fix.description)}</div>
      </td>
      <td style="max-width:150px;">${controlsHtml}</td>
      <td>${frameworksHtml}</td>
      <td>${statusBadge}</td>
    </tr>`;
  }

  html += `</tbody></table></div>`;

  html += `<div class="card" style="margin-top:20px;"><div class="card-title">Detailed Fix Records</div>`;
  for (let i = 0; i < sorted.length; i++) {
    const entry = sorted[i];
    const fixId = `histfix-${i}`;
    const sevClass = entry.compliance_impact.severity_resolved;

    html += `<div class="fix-detail-card" style="margin-bottom:8px;">`;
    html += `<div class="fix-detail-header ${sevClass}" onclick="toggleFix('${fixId}')">`;
    html += `<div class="fix-detail-num" style="color:${severityColor(sevClass)};">${i + 1}</div>`;
    html += `<div class="fix-detail-info">`;
    html += `<div class="fix-detail-title">${escapeHtml(entry.finding.title)}</div>`;
    html += `<div class="fix-detail-meta">${escapeHtml(entry.finding.rule_id)} | ${escapeHtml(entry.finding.file)}${entry.finding.line ? ':' + entry.finding.line : ''} | ${entry.source.toUpperCase()} | ${new Date(entry.timestamp).toLocaleString()}</div>`;
    html += `</div>`;
    html += `<div class="fix-detail-badges">`;
    html += `<span class="badge badge-sev" style="background:${severityColor(sevClass)};font-size:10px;">${sevClass.toUpperCase()}</span>`;
    if (entry.fix.applied) {
      html += `<span class="badge" style="background:#22c55e;font-size:10px;">APPLIED</span>`;
    } else {
      html += `<span class="badge" style="background:#ef4444;font-size:10px;">FAILED</span>`;
    }
    html += `<span class="badge" style="background:${entry.source === 'mcp' ? '#7c3aed' : '#0f766e'};font-size:10px;">${entry.source.toUpperCase()}</span>`;
    html += `<span class="fix-toggle" id="${fixId}-toggle">Expand</span>`;
    html += `</div></div>`;

    html += `<div class="fix-detail-body" id="${fixId}">`;

    html += `<div class="fix-section"><div class="fix-section-title">Finding Details</div>`;
    html += `<table><tbody>`;
    html += `<tr><td style="font-weight:600;width:140px;">Rule</td><td style="font-family:monospace;">${escapeHtml(entry.finding.rule_id)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Category</td><td>${escapeHtml(entry.finding.category)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Severity</td><td><span class="badge badge-sev" style="background:${severityColor(entry.compliance_impact.severity_resolved)}">${sevClass.toUpperCase()}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">File</td><td style="font-family:monospace;">${escapeHtml(entry.finding.file)}${entry.finding.line ? ':' + entry.finding.line : ''}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Title</td><td>${escapeHtml(entry.finding.title)}</td></tr>`;
    if (entry.finding.description) {
      html += `<tr><td style="font-weight:600;">Description</td><td style="color:#4b5563;">${escapeHtml(entry.finding.description)}</td></tr>`;
    }
    if (entry.finding.evidence) {
      html += `<tr><td style="font-weight:600;">Evidence</td><td><div class="fix-evidence">${escapeHtml(entry.finding.evidence)}</div></td></tr>`;
    }
    html += `</tbody></table></div>`;

    html += `<div class="fix-section"><div class="fix-section-title">Fix Applied</div>`;
    html += `<table><tbody>`;
    html += `<tr><td style="font-weight:600;width:140px;">Action</td><td><span class="badge" style="background:#6b7280;">${entry.fix.action_type.toUpperCase()}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">Target File</td><td style="font-family:monospace;">${escapeHtml(entry.fix.file_path)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Description</td><td>${escapeHtml(entry.fix.description)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Status</td><td>${entry.fix.applied ? '<span style="color:#22c55e;font-weight:600;">Applied successfully</span>' : `<span style="color:#ef4444;font-weight:600;">Failed: ${escapeHtml(entry.fix.error || 'Unknown error')}</span>`}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Source</td><td>${entry.source === 'mcp' ? 'MCP auto_fix tool' : 'CLI ges fix command'}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Timestamp</td><td>${new Date(entry.timestamp).toLocaleString()}</td></tr>`;
    if (entry.dry_run) {
      html += `<tr><td style="font-weight:600;">Mode</td><td><span class="badge" style="background:#eab308;color:white;">DRY RUN</span></td></tr>`;
    }
    html += `</tbody></table></div>`;

    if (entry.fix.guidance) {
      html += `<div class="fix-section"><div class="fix-section-title">Fix Guidance</div>`;
      html += `<div class="fix-guidance-box">${escapeHtml(entry.fix.guidance)}</div></div>`;
    }

    html += `<div class="fix-section"><div class="fix-section-title">Compliance Traceability</div>`;
    html += `<table><tbody>`;
    html += `<tr><td style="font-weight:600;width:160px;">Controls Addressed</td><td>${entry.controls.length > 0 ? entry.controls.map(c =>
      `<div style="margin-bottom:4px;"><span class="link" onclick="showControlDetail('${escapeHtml(c.id)}')">${escapeHtml(c.id)}</span> &mdash; ${escapeHtml(c.name)} <span style="color:#6b7280;font-size:11px;">(${escapeHtml(c.framework)}${c.article ? ' / ' + escapeHtml(c.article) : ''})</span></div>`
    ).join('') : '<span style="color:#9ca3af;">No controls mapped</span>'}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Frameworks Affected</td><td>${entry.compliance_impact.frameworks_affected.length > 0 ? entry.compliance_impact.frameworks_affected.map(f => `<span class="tag" style="background:#d1fae5;color:#065f46;">${escapeHtml(f)}</span>`).join(' ') : '<span style="color:#9ca3af;">-</span>'}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Controls Count</td><td>${entry.compliance_impact.controls_addressed}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Severity Resolved</td><td><span class="badge badge-sev" style="background:${severityColor(entry.compliance_impact.severity_resolved)}">${entry.compliance_impact.severity_resolved.toUpperCase()}</span></td></tr>`;
    html += `</tbody></table></div>`;

    html += `</div></div>`;
  }
  html += `</div>`;

  return html;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
