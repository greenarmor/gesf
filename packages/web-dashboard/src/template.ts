import type { DashboardData, GovernanceData } from "./index.js";
import type { Control } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";

interface ComplianceIssue {
  controlId: string;
  controlName: string;
  severity: string;
  status: string;
  category: string;
  framework: string;
  article?: string;
  description: string;
  implementation_guidance: string;
  packId: string;
  packName: string;
  passedChecks: number;
  totalChecks: number;
  auditFindings: Finding[];
}

function matchPackForControl(controlId: string, packs: { id: string; name: string }[]): { id: string; name: string } | undefined {
  const idUpper = controlId.toUpperCase();
  for (const p of packs) {
    if (p.id === "gdpr" && idUpper.startsWith("GDPR-")) return p;
    if (p.id === "owasp" && idUpper.startsWith("OWASP-")) return p;
    if (p.id === "cis" && idUpper.startsWith("CIS-")) return p;
    if (p.id === "nist" && idUpper.startsWith("NIST-")) return p;
    if (p.id === "ai" && idUpper.startsWith("AI-")) return p;
    if (p.id === "blockchain" && idUpper.startsWith("BC-")) return p;
    if (p.id === "government" && idUpper.startsWith("GOV-")) return p;
    if (p.id === "governance" && idUpper.startsWith("GOVP-")) return p;
    if (p.id === "iso27001" && idUpper.startsWith("ISO27K-")) return p;
    if (p.id === "iso27701" && idUpper.startsWith("ISO277-")) return p;
    if (p.id === "hipaa" && idUpper.startsWith("HIPAA-")) return p;
  }
  return undefined;
}

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
  const governance = data.governance;

  const fixAssignmentMap = new Map<string, import("@greenarmor/ges-core").FixAssignment>();
  for (const a of data.fixAssignments) {
    fixAssignmentMap.set(a.finding_key, a);
  }

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
      if (packId === "governance") return idUpper.startsWith("GOVP-");
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

  const complianceIssues: ComplianceIssue[] = controls
    .filter(c => c.status !== "pass" && c.status !== "not-applicable")
    .map(c => {
      const pack = matchPackForControl(c.id, packs);
      const auditFindings = findings.filter(f => f.controlIds.includes(c.id));
      return {
        controlId: c.id,
        controlName: c.name,
        severity: c.severity,
        status: c.status,
        category: c.category,
        framework: c.framework,
        article: c.article,
        description: c.description,
        implementation_guidance: c.implementation_guidance,
        packId: pack?.id || "",
        packName: pack?.name || "Direct",
        passedChecks: c.checks.filter(ch => ch.status === "pass").length,
        totalChecks: c.checks.length,
        auditFindings,
      };
    })
    .sort((a, b) => {
      const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    });

  const issuesBySeverity = {
    critical: complianceIssues.filter(i => i.severity === "critical").length,
    high: complianceIssues.filter(i => i.severity === "high").length,
    medium: complianceIssues.filter(i => i.severity === "medium").length,
    low: complianceIssues.filter(i => i.severity === "low").length,
  };

  const issuesByPackId: Record<string, ComplianceIssue[]> = {};
  for (const issue of complianceIssues) {
    const key = issue.packId || "direct";
    if (!issuesByPackId[key]) issuesByPackId[key] = [];
    issuesByPackId[key].push(issue);
  }

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

  /* Governance toolbar */
  .gov-toolbar { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; margin-bottom: 16px; }
  .gov-btn { padding: 6px 14px; border-radius: 6px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; }
  .gov-btn-primary { background: #6366f1; color: white; }
  .gov-btn-primary:hover { background: #5558e9; }
  .gov-btn-outline { background: white; color: #6366f1; border: 1px solid #c7d2fe; }
  .gov-btn-outline:hover { background: #eef2ff; }
  .gov-btn-danger { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
  .gov-btn-danger:hover { background: #fee2e2; }

  /* Per-record action buttons */
  .gov-actions { display: flex; gap: 4px; flex-wrap: wrap; margin-top: 8px; padding-top: 8px; border-top: 1px solid #f3f4f6; }
  .gov-action-btn { padding: 3px 8px; border-radius: 4px; border: 1px solid #e5e7eb; background: #f9fafb; color: #4b5563; font-size: 11px; cursor: pointer; }
  .gov-action-btn:hover { background: #eef2ff; border-color: #c7d2fe; color: #4f46e5; }

  /* Modal overlay */
  .gov-modal-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.4); z-index: 1000; justify-content: center; align-items: flex-start; padding-top: 60px; }
  .gov-modal-overlay.active { display: flex; }
  .gov-modal { background: white; border-radius: 10px; box-shadow: 0 20px 60px rgba(0,0,0,0.15); max-width: 520px; width: 90%; max-height: 80vh; overflow-y: auto; }
  .gov-modal-header { padding: 16px 20px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: white; border-radius: 10px 10px 0 0; z-index: 1; }
  .gov-modal-title { font-size: 15px; font-weight: 700; color: #1f2937; }
  .gov-modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #9ca3af; padding: 0 4px; line-height: 1; }
  .gov-modal-close:hover { color: #ef4444; }
  .gov-modal-body { padding: 20px; }
  .gov-modal-body label { display: block; font-size: 12px; font-weight: 600; color: #4b5563; margin-bottom: 4px; margin-top: 12px; }
  .gov-modal-body label:first-child { margin-top: 0; }
  .gov-modal-body input, .gov-modal-body select, .gov-modal-body textarea {
    width: 100%; padding: 7px 10px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 13px; box-sizing: border-box;
  }
  .gov-modal-body input:focus, .gov-modal-body select:focus, .gov-modal-body textarea:focus { outline: none; border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99,102,241,0.1); }
  .gov-modal-body textarea { resize: vertical; min-height: 60px; }
  .gov-modal-footer { padding: 12px 20px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 8px; position: sticky; bottom: 0; background: white; border-radius: 0 0 10px 10px; }
  .gov-form-hint { font-size: 11px; color: #9ca3af; margin-top: 2px; }

  /* Toast notifications */
  .gov-toast-container { position: fixed; top: 20px; right: 20px; z-index: 2000; display: flex; flex-direction: column; gap: 8px; }
  .gov-toast { padding: 12px 18px; border-radius: 8px; color: white; font-size: 13px; font-weight: 600; box-shadow: 0 4px 12px rgba(0,0,0,0.15); display: flex; align-items: center; gap: 8px; animation: govToastSlide 0.3s ease; max-width: 360px; }
  .gov-toast.success { background: #22c55e; }
  .gov-toast.error { background: #ef4444; }
  @keyframes govToastSlide { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: translateX(0); } }
</style>
</head>
<body>

<div class="header">
  <div>
    <h1>${escapeHtml(data.projectName)}</h1>
    <div class="subtitle">GESF v${escapeHtml(data.gesfVersion)}</div>
  </div>
  <div class="nav-tabs">
    <button class="nav-tab active" onclick="showPage('overview', this)">Overview</button>
    <button class="nav-tab" onclick="showPage('packs', this)">Policy Packs</button>
    <button class="nav-tab" onclick="showPage('fixes', this)">Fixes Detail</button>
    <button class="nav-tab" onclick="showPage('findings', this)">Findings</button>
    <button class="nav-tab" onclick="showPage('traceability', this)">Traceability</button>
    <button class="nav-tab" onclick="showPage('activity', this)">Activity Log</button>
    <button class="nav-tab" onclick="showPage('governance', this)">Governance</button>
    <button class="nav-tab" onclick="showPage('inference', this)">🤖 AI Insights</button>
  </div>
</div>

<div class="container">

  <div id="page-overview" class="page active">
    <div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:12px;">
      <a href="/api/report/compliance?format=markdown" class="report-btn" style="background:#0f766e;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">📄 Compliance Report (MD)</a>
      <a href="/api/report/compliance?format=html" class="report-btn" style="background:#0f766e;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">📄 Compliance Report (HTML)</a>
      <a href="/api/report/governance" class="report-btn" style="background:#6366f1;color:white;padding:6px 14px;border-radius:6px;text-decoration:none;font-size:12px;font-weight:600;">📋 Governance Report</a>
    </div>
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

      ${(() => {
        const installedPacks = packs.filter(p => p.installed);
        if (installedPacks.length === 0) return '';
        return `<div class="card" style="margin-top:16px;">
          <div class="card-title">Installed Policy Packs (${installedPacks.length})</div>
          <div class="grid grid-2" style="gap:12px;margin-top:8px;">
            ${installedPacks.map(p => {
              const pct = p.score;
              const color = pct >= 80 ? '#22c55e' : pct >= 60 ? '#eab308' : pct >= 40 ? '#f97316' : '#ef4444';
              const isImplemented = p.notImplementedCount < p.controlCount;
              const statusBadge = isImplemented
                ? '<span style="background:#d1fae5;color:#065f46;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">Implemented</span>'
                : '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:4px;font-size:10px;font-weight:600;">Not Implemented</span>';
              const borderStyle = isImplemented ? '1px solid #e5e7eb' : '1px dashed #d1d5db;opacity:0.85;';
              return `<div class="pack-mini" onclick="loadPackDetail('${p.id}')" style="cursor:pointer;padding:12px;border:${borderStyle};border-radius:8px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                  <div style="font-size:13px;font-weight:600;">${escapeHtml(p.name)}</div>
                  <div style="display:flex;align-items:center;gap:8px;">
                    ${statusBadge}
                    <div style="font-size:16px;font-weight:700;color:${color};">${pct}%</div>
                  </div>
                </div>
                ${scoreBarHtml(pct)}
                <div style="margin-top:6px;font-size:11px;color:#6b7280;">
                  ${p.controlCount} controls &middot;
                  <span style="color:#22c55e;">${p.passedCount - p.notApplicableCount} pass</span> &middot;
                  <span style="color:#ef4444;">${p.failedCount} fail</span> &middot;
                  <span style="color:#6b7280;">${p.notImplementedCount} not impl</span>
                </div>
              </div>`;
            }).join('')}
          </div>
        </div>`;
      })()}

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
        <div class="card-title">Active Frameworks &amp; Installed Packs</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;">
          ${data.frameworks.map(fw => `<span class="tag" style="background:#d1fae5;color:#065f46;">${escapeHtml(fw)}</span>`).join('')}
          ${packs.filter(p => p.installed).map(p => {
            const isImpl = p.notImplementedCount < p.controlCount;
            const bg = isImpl ? '#dbeafe' : '#fef3c7';
            const cl = isImpl ? '#1e40af' : '#92400e';
            return `<span class="tag" style="background:${bg};color:${cl};">${escapeHtml(p.name)}</span>`;
          }).join('')}
          ${data.frameworks.length === 0 && packs.filter(p => p.installed).length === 0 ? '<span style="color:#9ca3af;">No frameworks or packs installed</span>' : ''}
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
      <button class="tab-btn" onclick="showFixesTab('pending', this)">Pending Fixes (${complianceIssues.length})</button>
    </div>

    <div id="fixes-tab-history" class="tab-panel active">
      ${renderFixHistorySection(data.fixHistory, complianceIssues)}
    </div>

    <div id="fixes-tab-pending" class="tab-panel">
      ${renderComplianceFixCards(complianceIssues, "fix", fixAssignmentMap, governance.records)}
    </div>
  </div>

  <div id="page-findings" class="page">
    <div id="findings-main">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Compliance Findings &amp; Issues</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">Every control that is not passing is a compliance finding. Code-level audit evidence is shown where available.</p>

      <div class="grid grid-4" style="margin-bottom:20px;">
        <div class="card stat"><div class="num" style="color:${complianceIssues.length > 0 ? '#ef4444' : '#22c55e'};">${complianceIssues.length}</div><div class="label">Total Issues</div></div>
        <div class="card stat"><div class="num" style="color:#ef4444;">${issuesBySeverity.critical}</div><div class="label">Critical</div></div>
        <div class="card stat"><div class="num" style="color:#f97316;">${issuesBySeverity.high}</div><div class="label">High</div></div>
        <div class="card stat"><div class="num">${findings.length}</div><div class="label">Audit Evidence</div></div>
      </div>

      <div class="tab-bar">
        <button class="tab-btn active" onclick="showFindingsTab('all', this)">All Issues (${complianceIssues.length})</button>
        <button class="tab-btn" onclick="showFindingsTab('critical', this)">Critical (${issuesBySeverity.critical})</button>
        <button class="tab-btn" onclick="showFindingsTab('high', this)">High (${issuesBySeverity.high})</button>
        <button class="tab-btn" onclick="showFindingsTab('medium', this)">Medium (${issuesBySeverity.medium})</button>
        <button class="tab-btn" onclick="showFindingsTab('low', this)">Low (${issuesBySeverity.low})</button>
        <button class="tab-btn" onclick="showFindingsTab('bypack', this)">By Pack</button>
        ${findings.length > 0 ? `<button class="tab-btn" onclick="showFindingsTab('evidence', this)">Audit Evidence (${findings.length})</button>` : ''}
      </div>

      <div id="findings-tab-all" class="tab-panel active">
        ${renderComplianceIssuesTable(complianceIssues)}
      </div>
      <div id="findings-tab-critical" class="tab-panel">${renderComplianceIssuesTable(complianceIssues.filter(i => i.severity === "critical"))}</div>
      <div id="findings-tab-high" class="tab-panel">${renderComplianceIssuesTable(complianceIssues.filter(i => i.severity === "high"))}</div>
      <div id="findings-tab-medium" class="tab-panel">${renderComplianceIssuesTable(complianceIssues.filter(i => i.severity === "medium"))}</div>
      <div id="findings-tab-low" class="tab-panel">${renderComplianceIssuesTable(complianceIssues.filter(i => i.severity === "low"))}</div>
      <div id="findings-tab-bypack" class="tab-panel">
        ${packs.filter(p => (issuesByPackId[p.id] || []).length > 0).length > 0 ? packs.filter(p => (issuesByPackId[p.id] || []).length > 0).map(p => `
          <div class="card" style="margin-bottom:16px;">
            <div class="card-title" style="cursor:pointer;" onclick="loadPackDetail('${p.id}')">
              ${escapeHtml(p.name)} &mdash; ${(issuesByPackId[p.id] || []).length} issues
              <span style="float:right;color:#0f766e;font-weight:400;font-size:11px;">View pack details &rarr;</span>
            </div>
            ${renderComplianceIssuesTable(issuesByPackId[p.id] || [])}
          </div>
        `).join('') : '<div class="empty-state"><div class="msg">No compliance issues mapped to policy packs</div></div>'}
      </div>
      ${findings.length > 0 ? `<div id="findings-tab-evidence" class="tab-panel">${renderFindingsTable(findings)}</div>` : ''}
    </div>
    <div id="finding-detail" style="display:none;"></div>
  </div>

  <div id="page-traceability" class="page">
    <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Compliance Traceability Matrix</h2>
    <p style="color:#6b7280;font-size:14px;margin-bottom:20px;">Full traceability: Control &rarr; Framework &rarr; Policy Pack &rarr; Severity &rarr; Fix Guidance for every compliance issue.</p>
    <div class="tab-bar">
      <button class="tab-btn active" onclick="showTraceTab('matrix', this)">Matrix (${complianceIssues.length})</button>
      <button class="tab-btn" onclick="showTraceTab('fixes', this)">Prioritized Fixes</button>
      <button class="tab-btn" onclick="showTraceTab('controls', this)">Control Coverage</button>
    </div>

    <div id="trace-tab-matrix" class="tab-panel active">
      ${complianceIssues.length > 0 ? `<div class="card">
        <table>
          <thead><tr><th>Control</th><th>Severity</th><th>Framework</th><th>Policy Pack</th><th>Status</th><th>Checks</th><th>Audit</th><th>Fix Guidance</th></tr></thead>
          <tbody>
            ${complianceIssues.map(issue => `<tr>
              <td>
                <span class="link" onclick="showControlDetail('${escapeHtml(issue.controlId)}')">${escapeHtml(issue.controlId)}</span>
                <div style="font-size:12px;color:#4b5563;">${escapeHtml(issue.controlName)}</div>
              </td>
              <td><span class="badge badge-sev" style="background:${severityColor(issue.severity)}">${issue.severity.toUpperCase()}</span></td>
              <td style="font-size:12px;">${escapeHtml(issue.framework)}${issue.article ? '<br><span style="color:#6b7280;">' + escapeHtml(issue.article) + '</span>' : ''}</td>
              <td>${issue.packId ? `<span class="tag" style="cursor:pointer;" onclick="loadPackDetail('${issue.packId}')">${escapeHtml(issue.packName)}</span>` : '<span style="color:#9ca3af;">-</span>'}</td>
              <td><span class="badge badge-status" style="background:${statusColor(issue.status)}">${statusLabel(issue.status)}</span></td>
              <td style="font-size:12px;">${issue.passedChecks}/${issue.totalChecks}</td>
              <td>${issue.auditFindings.length > 0 ? `<span style="color:#ef4444;font-weight:600;">${issue.auditFindings.length}</span>` : '<span style="color:#9ca3af;">0</span>'}</td>
              <td style="max-width:280px;font-size:12px;color:#374151;">${escapeHtml(issue.implementation_guidance.substring(0, 150))}${issue.implementation_guidance.length > 150 ? '...' : ''}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>` : '<div class="card"><div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No issues to trace</div><div class="sub">All controls passing</div></div></div>'}
    </div>

    <div id="trace-tab-fixes" class="tab-panel">
      ${renderComplianceFixCards(complianceIssues, "trace", fixAssignmentMap, governance.records)}
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

  <div id="page-activity" class="page">
    ${renderActivityLogSection(data.activityLog || [])}
  </div>

  <div id="page-governance" class="page">
    ${renderGovernanceSection(governance)}
  </div>

  <div id="page-inference" class="page">
    ${renderInferencePage()}
  </div>

  <div id="control-detail-modal" style="display:none;"></div>

  <div class="gov-modal-overlay" id="assign-modal-overlay" onclick="if(event.target===this)closeAssignModal()">
    <div class="gov-modal" id="assign-modal"></div>
  </div>

</div>

<div class="footer">
  Generated by GESF v${escapeHtml(data.gesfVersion)} | Last audit: ${escapeHtml(new Date(data.lastAudit).toLocaleString())} | <a href="/api/data">JSON API</a> | <a href="/api/packs">Packs API</a> | <a href="/api/fix-history">Fix History API</a> | <a href="/api/fix-assignments">Fix Assignments API</a> | <a href="/api/activity-log">Activity Log API</a> | <a href="/api/governance">Governance API</a> | <a href="/api/inference">Inference API</a>
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

  var navTabMap = { overview: 0, packs: 1, fixes: 2, findings: 3, traceability: 4, activity: 5, governance: 6, inference: 7 };

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

  window.goToPendingFixes = function() {
    var btns = document.querySelectorAll('#page-fixes .tab-btn');
    showFixesTab('pending', btns.length > 1 ? btns[1] : (btns[0] || null));
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

  // --- Governance action toolbar ---
  var govAction = null;
  var govRecordId = null;
  var govTitles = {
    'create': 'Create Governance Record',
    'approve': 'Record Approval Decision',
    'evidence': 'Add Evidence Reference',
    'risk-assessment': 'Link Risk Assessment',
    'policy-basis': 'Document Policy Basis',
    'review-cycle': 'Set Review Cycle',
    'data-inventory': 'Document Data Inventory',
    'committee': 'Record Committee Approval',
    'compliance-links': 'Map Compliance Links'
  };
  function govF(name, label, inputHtml) {
    return '<label>' + label + '</label>' + inputHtml;
  }
  function govI(name, label, ph) {
    return govF(name, label, '<input type="text" name="' + name + '" placeholder="' + (ph||'') + '">');
  }
  function govS(name, label, opts) {
    var o = '';
    for (var i = 0; i < opts.length; i++) o += '<option value="' + opts[i][0] + '">' + opts[i][1] + '</option>';
    return govF(name, label, '<select name="' + name + '">' + o + '</select>');
  }
  function govT(name, label, ph) {
    return govF(name, label, '<textarea name="' + name + '" placeholder="' + (ph||'') + '"></textarea>');
  }

  window.openGovModal = function(action, recordId) {
    govAction = action;
    govRecordId = recordId || null;
    var m = document.getElementById('gov-modal');
    var h = '<div class="gov-modal-header"><div class="gov-modal-title">' + (govTitles[action]||action) + '</div><button class="gov-modal-close" onclick="closeGovModal()">&times;</button></div><div class="gov-modal-body">';
    if (action === 'create') {
      h += govI('system_name','System Name *','e.g., Payment API Gateway');
      h += govS('system_type','System Type',[['ai-system','AI System'],['application','Application'],['data-process','Data Process'],['api','API'],['model','Model'],['infrastructure','Infrastructure'],['third-party-service','Third-Party Service']]);
      h += govS('risk_level','Risk Level',[['low','Low'],['medium','Medium'],['high','High'],['critical','Critical']]);
      h += govT('system_description','Description','Brief description');
    } else if (action === 'approve') {
      h += govI('approver_name','Approver Name *','e.g., Jane Smith');
      h += govI('approver_role','Approver Role','e.g., CISO');
      h += govI('approver_email','Approver Email','e.g., jane@company.com');
      h += govI('approval_authority','Approval Authority','e.g., CISO Office');
      h += govS('decision','Decision',[['approved','Approved'],['conditional','Conditional'],['rejected','Rejected']]);
      h += govI('valid_from','Valid From','YYYY-MM-DD');
      h += govI('valid_until','Valid Until','YYYY-MM-DD (blank = indefinite)');
      h += govI('conditions','Conditions','comma-separated');
      h += govT('rationale','Rationale','Reason for decision');
    } else if (action === 'evidence') {
      h += govI('title','Title *','e.g., DPIA Report 2024');
      h += govS('type','Evidence Type',[['document','Document'],['ticket','Ticket'],['meeting-record','Meeting Record'],['report','Report'],['certificate','Certificate'],['contract','Contract'],['log','Log'],['dashboard','Dashboard'],['email','Email'],['other','Other']]);
      h += govS('source_system','Source System',[['jira','Jira'],['confluence','Confluence'],['servicenow','ServiceNow'],['sharepoint','SharePoint'],['grc-platform','GRC Platform'],['git','Git'],['file','File'],['url','URL'],['email','Email'],['other','Other']]);
      h += govI('reference','Reference *','Ticket ID, URL, doc name');
      h += govI('location_description','Location','Where to find it');
    } else if (action === 'risk-assessment') {
      h += govI('assessor','Assessor Name *','e.g., John Doe');
      h += govI('methodology','Methodology','e.g., NIST RMF');
      h += govI('risk_score','Risk Score','e.g., 7.5/10');
      h += govI('residual_risk','Residual Risk','low / medium / high / critical');
      h += govI('identified_risks','Identified Risks','comma-separated');
      h += govI('mitigation_measures','Mitigation Measures','comma-separated');
    } else if (action === 'policy-basis') {
      h += govI('policy_id','Policy ID','e.g., POL-001');
      h += govI('policy_name','Policy Name *','e.g., InfoSec Policy');
      h += govI('version','Version','e.g., 2.0');
      h += govI('standard','Standard','e.g., ISO 27001, GDPR');
      h += govI('clauses','Applicable Clauses','comma-separated');
    } else if (action === 'review-cycle') {
      h += govS('frequency','Review Frequency',[['quarterly','Quarterly'],['semi-annual','Semi-Annual'],['annual','Annual'],['biennial','Biennial']]);
      h += govI('next_review','Next Review Date','YYYY-MM-DD');
    } else if (action === 'data-inventory') {
      h += govI('personal_data_categories','Data Categories','comma-separated');
      h += govI('processing_purposes','Processing Purposes','comma-separated');
      h += govI('data_subjects','Data Subjects','comma-separated');
      h += govI('cross_border_transfers','Cross-Border Transfers','comma-separated');
      h += govI('retention_period','Retention Period','e.g., 7 years');
    } else if (action === 'committee') {
      h += govI('committee_name','Committee Name *','e.g., Data Governance Board');
      h += govI('meeting_date','Meeting Date','YYYY-MM-DD');
      h += govI('meeting_reference','Meeting Reference','e.g., MIN-2024-001');
      h += govI('attendees','Attendees','comma-separated');
      h += govT('decision_summary','Decision Summary','Summary of committee decision');
    } else if (action === 'compliance-links') {
      h += govI('frameworks','Frameworks','comma-separated (GDPR, OWASP...)');
      h += govI('controls_satisfied','Controls Satisfied','comma-separated control IDs');
      h += govI('control_pack_ids','Control Pack IDs','comma-separated pack IDs');
    }
    h += '<label>Your Name</label><input type="text" name="actor_name" placeholder="Optional"><div class="gov-form-hint">For activity log attribution</div>';
    h += '<label>Your Role</label><input type="text" name="actor_role" placeholder="Optional">';
    h += '</div>';
    h += '<div class="gov-modal-footer"><button class="gov-btn gov-btn-outline" onclick="closeGovModal()">Cancel</button><button class="gov-btn gov-btn-primary" onclick="submitGovForm()">Save</button></div>';
    m.innerHTML = h;
    document.getElementById('gov-modal-overlay').classList.add('active');
  };

  window.closeGovModal = function() {
    document.getElementById('gov-modal-overlay').classList.remove('active');
    document.getElementById('gov-modal').innerHTML = '';
  };

  window.submitGovForm = function() {
    var inputs = document.querySelectorAll('#gov-modal .gov-modal-body input[name], #gov-modal .gov-modal-body select[name], #gov-modal .gov-modal-body textarea[name]');
    var body = {};
    for (var i = 0; i < inputs.length; i++) body[inputs[i].name] = inputs[i].value;
    var url = govRecordId ? '/api/governance/' + encodeURIComponent(govRecordId) + '/' + govAction : '/api/governance/create';
    var btn = document.querySelector('#gov-modal .gov-modal-footer .gov-btn-primary');
    if (btn) { btn.textContent = 'Saving...'; btn.disabled = true; }
    fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) { closeGovModal(); showToast('Saved! Reloading...', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else { showToast(d.error || 'Failed', 'error'); if (btn) { btn.textContent = 'Save'; btn.disabled = false; } }
      })
      .catch(function(e) { showToast('Error: ' + (e.message||'network'), 'error'); if (btn) { btn.textContent = 'Save'; btn.disabled = false; } });
  };

  window.govDeleteRecord = function(recordId, systemName) {
    if (!confirm('Delete governance record "' + systemName + '"? This action cannot be undone.')) return;
    fetch('/api/governance/' + encodeURIComponent(recordId) + '/delete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) { showToast('Deleted! Reloading...', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else { showToast(d.error || 'Failed', 'error'); }
      })
      .catch(function(e) { showToast('Error: ' + (e.message||'network'), 'error'); });
  };

  window.showToast = function(msg, type) {
    var c = document.getElementById('gov-toast-container');
    if (!c) return;
    var t = document.createElement('div');
    t.className = 'gov-toast ' + (type||'success');
    t.innerHTML = (type === 'error' ? '&#10007; ' : '&#10003; ') + msg;
    c.appendChild(t);
    setTimeout(function() { t.style.opacity = '0'; t.style.transition = 'opacity 0.3s'; setTimeout(function() { if(t.parentNode) t.remove(); }, 300); }, 3000);
  };

  var govRecordsForAssign = ${JSON.stringify(governance.records.map(r => ({ id: r.id, name: r.system_name, status: r.status, risk: r.risk_level })))};

  window.openAssignModal = function(fkey, ruleId, title, file, line, severity, controlIds) {
    var overlay = document.getElementById('assign-modal-overlay');
    var modal = document.getElementById('assign-modal');
    if (!overlay || !modal) return;
    modal.dataset.fkey = fkey;
    modal.dataset.ruleId = ruleId;
    modal.dataset.title = title;
    modal.dataset.file = file;
    modal.dataset.line = String(line || 0);
    modal.dataset.severity = severity;
    modal.dataset.controlIds = controlIds;
    var findingCtx = '<div style="margin-bottom:12px;padding:8px 10px;background:#f9fafb;border-radius:6px;font-size:12px;">' +
      '<strong>' + ruleId + '</strong> &mdash; ' + title + '<br>' +
      '<span style="color:#6b7280;font-family:monospace;">' + file + (line ? ':' + line : '') + '</span>' +
      '</div>';
    var assigneeFields =
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Assignee Name *</label>' +
      '<input name="assignee" type="text" placeholder="e.g., Jane Doe" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Assignee Role</label>' +
      '<input name="assignee_role" type="text" placeholder="e.g., Security Engineer" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Your Name (for audit log)</label>' +
      '<input name="actor_name" type="text" placeholder="Who is making this assignment" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Your Role</label>' +
      '<input name="actor_role" type="text" placeholder="e.g., Tech Lead" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />';
    if (govRecordsForAssign.length === 0) {
      modal.innerHTML =
        '<div class="gov-modal-header"><h3>Create Governance Record &amp; Assign Fix</h3><button class="gov-modal-close" onclick="closeAssignModal()">&times;</button></div>' +
        '<div class="gov-modal-body">' +
        '<div style="margin-bottom:12px;padding:10px 12px;background:#fef3c7;border:1px solid #fde68a;border-radius:6px;font-size:12px;color:#92400e;">' +
        '<strong>No governance records exist yet.</strong> Create one below to establish the approval provenance chain. The fix will be assigned to it automatically.' +
        '</div>' +
        findingCtx +
        '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">System Name *</label>' +
        '<input name="system_name" type="text" placeholder="e.g., Customer Support Chatbot" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
        '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">System Type</label>' +
        '<select name="system_type" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;">' +
          '<option value="ai-system">AI System</option>' +
          '<option value="application" selected>Application</option>' +
          '<option value="data-process">Data Process</option>' +
          '<option value="api">API</option>' +
          '<option value="model">Model</option>' +
          '<option value="infrastructure">Infrastructure</option>' +
          '<option value="third-party-service">Third-Party Service</option>' +
        '</select>' +
        '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Risk Level</label>' +
        '<select name="risk_level" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;">' +
          '<option value="low">Low</option>' +
          '<option value="medium" selected>Medium</option>' +
          '<option value="high">High</option>' +
          '<option value="critical">Critical</option>' +
        '</select>' +
        assigneeFields +
        '</div>' +
        '<div class="gov-modal-footer"><button class="gov-btn gov-btn-outline" onclick="closeAssignModal()">Cancel</button><button class="gov-btn gov-btn-primary" onclick="submitCreateAndAssignForm()">Create &amp; Assign</button></div>';
      overlay.classList.add('active');
      return;
    }
    var recordOptions = govRecordsForAssign.map(function(r) {
      return '<option value="' + r.id + '">' + r.name + ' (' + r.status + ', ' + r.risk + ' risk)</option>';
    }).join('');
    modal.innerHTML =
      '<div class="gov-modal-header"><h3>Assign Fix to Governance Record</h3><button class="gov-modal-close" onclick="closeAssignModal()">&times;</button></div>' +
      '<div class="gov-modal-body">' +
      findingCtx +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Governance Record *</label>' +
      '<select name="governance_record_id" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;">' + recordOptions + '</select>' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Assignee Name *</label>' +
      '<input name="assignee" type="text" placeholder="e.g., Jane Doe" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Assignee Role</label>' +
      '<input name="assignee_role" type="text" placeholder="e.g., Security Engineer" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Notes</label>' +
      '<textarea name="notes" rows="2" placeholder="Optional context for this assignment..." style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;"></textarea>' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Your Name (for audit log)</label>' +
      '<input name="actor_name" type="text" placeholder="Who is making this assignment" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '<label style="font-size:12px;font-weight:600;display:block;margin-bottom:4px;">Your Role</label>' +
      '<input name="actor_role" type="text" placeholder="e.g., Tech Lead" style="width:100%;padding:8px;border:1px solid #d1d5db;border-radius:6px;margin-bottom:12px;" />' +
      '</div>' +
      '<div class="gov-modal-footer"><button class="gov-btn gov-btn-outline" onclick="closeAssignModal()">Cancel</button><button class="gov-btn gov-btn-primary" onclick="submitAssignForm()">Assign</button></div>';
    overlay.classList.add('active');
  };

  window.closeAssignModal = function() {
    var overlay = document.getElementById('assign-modal-overlay');
    var modal = document.getElementById('assign-modal');
    if (overlay) overlay.classList.remove('active');
    if (modal) modal.innerHTML = '';
  };

  window.submitAssignForm = function() {
    var modal = document.getElementById('assign-modal');
    if (!modal) return;
    var inputs = modal.querySelectorAll('[name]');
    var body = {
      finding_key: modal.dataset.fkey,
      finding_rule_id: modal.dataset.ruleId,
      finding_title: modal.dataset.title,
      finding_file: modal.dataset.file,
      finding_line: parseInt(modal.dataset.line, 10),
      finding_severity: modal.dataset.severity,
      finding_control_ids: (modal.dataset.controlIds || '').split(',').filter(Boolean),
    };
    for (var i = 0; i < inputs.length; i++) {
      body[inputs[i].name] = inputs[i].value;
    }
    var btn = modal.querySelector('.gov-btn-primary');
    if (btn) { btn.textContent = 'Saving...'; btn.disabled = true; }
    fetch('/api/fix-assignments/assign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) { closeAssignModal(); showToast('Fix assigned! Reloading...', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else { showToast(d.error || 'Failed', 'error'); if (btn) { btn.textContent = 'Assign'; btn.disabled = false; } }
      })
      .catch(function(e) { showToast('Error: ' + (e.message||'network'), 'error'); if (btn) { btn.textContent = 'Assign'; btn.disabled = false; } });
  };

  window.submitCreateAndAssignForm = function() {
    var modal = document.getElementById('assign-modal');
    if (!modal) return;
    var inputs = modal.querySelectorAll('[name]');
    var fields = {};
    for (var i = 0; i < inputs.length; i++) {
      fields[inputs[i].name] = inputs[i].value;
    }
    if (!fields.system_name || !fields.system_name.trim()) {
      showToast('System name is required', 'error');
      return;
    }
    if (!fields.assignee || !fields.assignee.trim()) {
      showToast('Assignee name is required', 'error');
      return;
    }
    var btn = modal.querySelector('.gov-btn-primary');
    if (btn) { btn.textContent = 'Creating...'; btn.disabled = true; }
    fetch('/api/governance/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_name: fields.system_name,
        system_description: fields.system_description || '',
        system_type: fields.system_type || 'application',
        risk_level: fields.risk_level || 'medium',
        actor_name: fields.actor_name,
        actor_role: fields.actor_role,
      }),
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.success || !d.record) {
          showToast(d.error || 'Failed to create governance record', 'error');
          if (btn) { btn.textContent = 'Create & Assign'; btn.disabled = false; }
          return;
        }
        govRecordsForAssign.unshift({ id: d.record.id, name: d.record.system_name, status: d.record.status, risk: d.record.risk_level });
        return fetch('/api/fix-assignments/assign', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            finding_key: modal.dataset.fkey,
            finding_rule_id: modal.dataset.ruleId,
            finding_title: modal.dataset.title,
            finding_file: modal.dataset.file,
            finding_line: parseInt(modal.dataset.line, 10),
            finding_severity: modal.dataset.severity,
            finding_control_ids: (modal.dataset.controlIds || '').split(',').filter(Boolean),
            governance_record_id: d.record.id,
            assignee: fields.assignee,
            assignee_role: fields.assignee_role || '',
            assigned_by: fields.actor_name || 'dashboard',
            notes: 'Auto-created governance record during fix assignment',
            actor_name: fields.actor_name,
            actor_role: fields.actor_role,
          }),
        }).then(function(r) { return r.json(); });
      })
      .then(function(d) {
        if (!d) return;
        if (d.success) {
          closeAssignModal();
          showToast('Governance record created & fix assigned! Reloading...', 'success');
          setTimeout(function() { location.reload(); }, 800);
        } else {
          showToast(d.error || 'Failed to assign fix', 'error');
          if (btn) { btn.textContent = 'Create & Assign'; btn.disabled = false; }
        }
      })
      .catch(function(e) {
        showToast('Error: ' + (e.message||'network'), 'error');
        if (btn) { btn.textContent = 'Create & Assign'; btn.disabled = false; }
      });
  };

  window.resolveFindingFix = function(fkey) {
    if (!confirm('Mark this fix as resolved?')) return;
    var resolver = prompt('Your name:', '') || 'dashboard';
    var resolverRole = prompt('Your role:', '') || '';
    var method = prompt('Method (auto-fix / manual / not-applicable):', 'manual') || 'manual';
    var notes = prompt('Resolution notes (optional):', '') || '';
    fetch('/api/fix-assignments/resolve', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finding_key: fkey,
        resolved_by: resolver,
        resolved_by_role: resolverRole,
        method: method,
        resolution_notes: notes,
        actor_name: resolver,
        actor_role: resolverRole,
      }),
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) { showToast('Fix resolved! Reloading...', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else { showToast(d.error || 'Failed', 'error'); }
      })
      .catch(function(e) { showToast('Error: ' + (e.message||'network'), 'error'); });
  };

  window.unassignFix = function(fkey) {
    if (!confirm('Remove this fix assignment?')) return;
    fetch('/api/fix-assignments/' + encodeURIComponent(fkey) + '/unassign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.success) { showToast('Unassigned! Reloading...', 'success'); setTimeout(function() { location.reload(); }, 800); }
        else { showToast(d.error || 'Failed', 'error'); }
      })
      .catch(function(e) { showToast('Error: ' + (e.message||'network'), 'error'); });
  };

  window.loadInference = function() {
    var content = document.getElementById('inference-content');
    var loading = document.getElementById('inference-loading');
    content.style.display = 'none';
    loading.style.display = 'block';

    fetch('/api/inference')
      .then(function(r) { return r.json(); })
      .then(function(report) {
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = renderInferenceReport(report);
      })
      .catch(function(e) {
        loading.style.display = 'none';
        content.style.display = 'block';
        content.innerHTML = '<div class="card" style="background:#fef2f2;border:1px solid #fecaca;"><p style="color:#dc2626;">Error loading inference: ' + (e.message||'network error') + '</p><p style="color:#6b7280;font-size:13px;">Ensure the project has audit findings and score history (run &lt;code&gt;ges audit&lt;/code&gt; first).</p></div>';
      });
  };

  function renderInferenceReport(report) {
    var h = '';
    var s = report.summary;

    // Summary cards
    h += '<div class="grid grid-4" style="margin-bottom:16px;">';
    h += '<div class="card stat"><div class="num">' + s.totalFindings + '</div><div class="label">Findings</div></div>';
    h += '<div class="card stat"><div class="num">' + s.distinctPatterns + '</div><div class="label">Patterns</div></div>';
    h += '<div class="card stat"><div class="num" style="color:' + (s.overallTrend==="improving"?"#22c55e":s.overallTrend==="declining"?"#ef4444":"#6b7280") + ';">' + (s.overallTrend||'?') + '</div><div class="label">Trend</div></div>';
    h += '<div class="card stat"><div class="num" style="color:#8b5cf6;">' + s.insightCount + '</div><div class="label">Insights</div></div>';
    h += '</div>';

    if (s.insightCount === 0) {
      h += '<div class="empty-state"><div class="icon">&#128270;</div><div class="msg">No significant insights found</div><div class="sub">Run more audits to accumulate data for richer inference</div></div>';
      return h;
    }

    if (s.reductionRatio > 0) {
      h += '<div class="card" style="background:#f0fdf4;border:1px solid #bbf7d0;margin-bottom:12px;"><strong>&#9989; Findings Reduced:</strong> ' + s.totalFindings + ' findings grouped into ' + s.distinctPatterns + ' distinct patterns (' + s.reductionRatio + '% reduction).</div>';
    }

    if (s.topRootCause) {
      h += '<div class="card" style="background:#fef2f2;border:1px solid #fecaca;margin-bottom:12px;"><strong>&#128204; Root Cause:</strong> <code>' + escapeHtml(s.topRootCause) + '</code> — ' + (s.topRootCauseImpact||'') + '</div>';
    }

    if (s.hasScoreAnomalies) {
      h += '<div class="card" style="background:#fffbeb;border:1px solid #fde68a;margin-bottom:12px;"><strong>&#9888; Score Anomaly Detected:</strong> Significant compliance score changes found. See details below.</div>';
    }

    // Root Cause Analysis
    if (report.rootCause && report.rootCause.topCause) {
      h += '<div class="card"><div class="card-title">&#128269; Root Cause Analysis</div>';
      var nodes = report.rootCause.nodes.slice(0, 6);
      h += '<p style="color:#6b7280;font-size:13px;margin-bottom:12px;">' + report.rootCause.summary + '</p>';
      h += '<table><thead><tr><th>Node</th><th>Type</th><th>Connected Findings</th><th>Impact</th><th>Severity Score</th></tr></thead><tbody>';
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        var pct = Math.round(n.betweenness * 100);
        var bar = '';
        var barW = Math.min(Math.round(n.severityScore / 3), 30);
        for (var j = 0; j < barW; j++) bar += '&#9617;';
        h += '<tr>';
        h += '<td><code style="font-size:12px;">' + escapeHtml(n.identifier) + '</code></td>';
        h += '<td>' + (n.type==='file'?'&#128196; File':'&#127919; Control') + '</td>';
        h += '<td>' + n.connectedFindings.length + ' (' + pct + '%)</td>';
        h += '<td>' + bar + '</td>';
        h += '<td>' + n.severityScore + '</td>';
        h += '</tr>';
      }
      h += '</tbody></table></div>';
    }

    // Finding Clusters
    if (report.clustering && report.clustering.clusters.length > 0) {
      h += '<div class="card"><div class="card-title">&#128202; Finding Clusters</div>';
      h += '<p style="color:#6b7280;font-size:13px;margin-bottom:12px;">' + report.clustering.totalFindings + ' findings → <strong>' + report.clustering.clusterCount + ' clusters</strong> (' + report.clustering.reductionRatio + '% reduction)</p>';
      var clusters = report.clustering.clusters.slice(0, 6);
      for (var i = 0; i < clusters.length; i++) {
        var c = clusters[i];
        var sevColor = c.severity==='critical'?'#ef4444':c.severity==='high'?'#f97316':c.severity==='medium'?'#eab308':'#22c55e';
        h += '<div style="padding:10px 12px;margin-bottom:8px;border-left:4px solid ' + sevColor + ';background:#f9fafb;border-radius:6px;">';
        h += '<strong>' + c.clusterId + '</strong> <span style="color:' + sevColor + ';font-weight:600;">[' + c.severity + ']</span> <span style="color:#4b5563;">' + escapeHtml(c.ruleId) + '</span>';
        h += '<div style="font-size:13px;color:#6b7280;margin-top:4px;">' + escapeHtml(c.representativeTitle) + '</div>';
        h += '<div style="font-size:12px;color:#9ca3af;margin-top:4px;">' + c.findingCount + ' findings in ' + c.files.length + ' file(s) → Fix: ' + escapeHtml(c.representativeFix.substring(0,100)) + '</div>';
        h += '</div>';
      }
      h += '</div>';
    }

    // Score Anomalies
    if (report.scoreAnomalies && report.scoreAnomalies.hasAnomalies) {
      h += '<div class="card"><div class="card-title">&#9888; Score Anomalies</div>';
      h += '<p style="color:#6b7280;font-size:13px;margin-bottom:12px;">' + report.scoreAnomalies.dataPointCount + ' data points, σ=' + report.scoreAnomalies.standardDeviation + '</p>';
      for (var i = 0; i < report.scoreAnomalies.anomalies.length; i++) {
        var a = report.scoreAnomalies.anomalies[i];
        if (!a.isAnomalous) continue;
        var dir = a.delta < 0 ? '&#9660;' : '&#9650;';
        var color = a.delta < 0 ? '#ef4444' : '#22c55e';
        h += '<div style="padding:10px 12px;margin-bottom:6px;background:#fffbeb;border:1px solid #fde68a;border-radius:6px;">';
        h += '<strong>' + escapeHtml(a.framework) + '</strong> <span style="color:' + color + ';">' + dir + ' ' + Math.abs(a.delta) + '%</span> (' + a.previousScore + '% → ' + a.currentScore + '%) z=' + a.zScore;
        if (a.triggeringEvent) h += '<div style="font-size:12px;color:#6b7280;margin-top:4px;">Trigger: ' + escapeHtml(a.triggeringEvent) + '</div>';
        h += '</div>';
      }
      h += '</div>';
    }

    // Trend Predictions
    if (report.trends && report.trends.overall) {
      h += '<div class="card"><div class="card-title">&#128302; Trend Predictions</div>';
      var o = report.trends.overall;
      var tColor = o.trendDirection==='improving'?'#22c55e':o.trendDirection==='declining'?'#ef4444':'#6b7280';
      h += '<p style="margin-bottom:12px;"><strong>Overall:</strong> <span style="color:' + tColor + ';font-weight:600;">' + (o.trendDirection||'?') + '</span> — ' + o.currentScore + '% → ' + o.projectedScore + '% <span style="color:#9ca3af;font-size:12px;">(R²=' + o.rSquared + ')</span></p>';
      if (o.cyclesToThreshold !== null && o.cyclesToThreshold > 0) {
        h += '<p style="color:#f97316;font-size:13px;margin-bottom:12px;">&#9200; Threshold (80%): in ~' + o.cyclesToThreshold + ' audit cycles</p>';
      }
      if (report.trends.predictions.length > 0) {
        h += '<table><thead><tr><th>Framework</th><th>Trend</th><th>Current</th><th>Projected</th><th>R²</th><th>Threshold</th></tr></thead><tbody>';
        for (var i = 0; i < report.trends.predictions.length && i < 8; i++) {
          var p = report.trends.predictions[i];
          var pColor = p.trendDirection==='improving'?'#22c55e':p.trendDirection==='declining'?'#ef4444':'#6b7280';
          var pDir = p.trendDirection==='improving'?'&#9650;':p.trendDirection==='declining'?'&#9660;':'&#9472;';
          var pCyc = p.cyclesToThreshold !== null && p.cyclesToThreshold > 0 ? '~' + p.cyclesToThreshold : '-';
          h += '<tr><td>' + escapeHtml(p.framework) + '</td>';
          h += '<td style="color:' + pColor + ';">' + pDir + ' ' + p.trendDirection + '</td>';
          h += '<td>' + p.currentScore + '%</td>';
          h += '<td>' + p.projectedScore + '%</td>';
          h += '<td>' + p.rSquared + '</td>';
          h += '<td>' + pCyc + '</td>';
          h += '</tr>';
        }
        h += '</tbody></table>';
      }
      h += '</div>';
    }

    h += '<p style="text-align:right;color:#9ca3af;font-size:11px;margin-top:12px;">Generated: ' + report.generatedAt + '</p>';
    return h;
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
      if (p.id === "governance") return idUpper.startsWith("GOVP-");
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

function renderFixHistorySection(entries: import("@greenarmor/ges-core").FixHistoryEntry[], complianceIssues: ComplianceIssue[] = []): string {
  if (entries.length === 0) {
    return `<div class="card">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Compliance Fix History</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every autofix applied via CLI or MCP is recorded here with full compliance traceability.</p>
      <div class="empty-state">
        <div class="icon">&#128203;</div>
        <div class="msg">No fixes recorded yet</div>
        <div class="sub">Run <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">ges fix</code> or use the MCP <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">auto_fix</code> tool to apply fixes. Each fix will be recorded here.</div>
        ${complianceIssues.length > 0 ? `<div style="margin-top:16px;"><span class="badge badge-status" style="background:#f97316;font-size:12px;padding:4px 12px;">${complianceIssues.length} pending fixes</span> <span class="link" style="font-size:13px;" onclick="goToPendingFixes()">View pending fixes &rarr;</span></div>` : ''}
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
    if (entry.actor_name) {
      html += `<tr><td style="font-weight:600;">Actor</td><td>${escapeHtml(entry.actor_name)}${entry.actor_role ? ' (' + escapeHtml(entry.actor_role) + ')' : ''}</td></tr>`;
    }
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

function renderComplianceIssuesTable(issues: ComplianceIssue[]): string {
  if (issues.length === 0) {
    return '<div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">No compliance issues in this category</div></div>';
  }
  return `<table>
    <thead><tr><th>Severity</th><th>Control</th><th>Framework</th><th>Policy Pack</th><th>Status</th><th>Checks</th><th>Audit</th><th>Fix Guidance</th></tr></thead>
    <tbody>
      ${issues.map(issue => `<tr>
        <td><span class="badge badge-sev" style="background:${severityColor(issue.severity)}">${issue.severity.toUpperCase()}</span></td>
        <td>
          <span class="link" onclick="showControlDetail('${escapeHtml(issue.controlId)}')">${escapeHtml(issue.controlId)}</span>
          <div style="font-size:12px;color:#4b5563;">${escapeHtml(issue.controlName)}</div>
        </td>
        <td style="font-size:12px;">${escapeHtml(issue.framework)}${issue.article ? '<br><span style="color:#6b7280;">' + escapeHtml(issue.article) + '</span>' : ''}</td>
        <td>${issue.packId ? `<span class="tag" style="cursor:pointer;" onclick="loadPackDetail('${issue.packId}')">${escapeHtml(issue.packName)}</span>` : '<span style="color:#9ca3af;">Direct</span>'}</td>
        <td><span class="badge badge-status" style="background:${statusColor(issue.status)}">${statusLabel(issue.status)}</span></td>
        <td style="font-size:12px;">${issue.passedChecks}/${issue.totalChecks}</td>
        <td>${issue.auditFindings.length > 0 ? `<span style="color:#ef4444;font-weight:600;">${issue.auditFindings.length}</span>` : '<span style="color:#9ca3af;">0</span>'}</td>
        <td style="max-width:280px;font-size:12px;color:#4b5563;">${escapeHtml(issue.implementation_guidance.substring(0, 200))}${issue.implementation_guidance.length > 200 ? '...' : ''}</td>
      </tr>`).join('')}
    </tbody>
  </table>`;
}

function renderComplianceFixCards(
  issues: ComplianceIssue[],
  idPrefix: string,
  assignmentMap?: Map<string, import("@greenarmor/ges-core").FixAssignment>,
  govRecords?: import("@greenarmor/ges-core").GovernanceRecord[],
): string {
  if (issues.length === 0) {
    return '<div class="card"><div class="empty-state"><div class="icon">&#10003;</div><div class="msg" style="color:#22c55e;">All controls passing</div><div class="sub">No fixes needed</div></div></div>';
  }

  const totalAuditFindings = issues.reduce((sum, i) => sum + i.auditFindings.length, 0);
  const criticalCount = issues.filter(i => i.severity === "critical").length;
  const highCount = issues.filter(i => i.severity === "high").length;

  const assignedCount = assignmentMap ? assignmentMap.size : 0;

  let html = '';
  html += `<div style="margin-bottom:20px;">`;
  html += `<div class="grid grid-4" style="margin-bottom:20px;">`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${issues.length}</div><div class="label">Controls to Fix</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${criticalCount}</div><div class="label">Critical</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#f97316;">${highCount}</div><div class="label">High</div></div>`;
  html += `<div class="card stat"><div class="num">${totalAuditFindings}</div><div class="label">Audit Findings</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:${assignedCount > 0 ? "#3b82f6" : "#9ca3af"};">${assignedCount}</div><div class="label">Assigned</div></div>`;
  html += `</div>`;
  html += `</div>`;

  for (let i = 0; i < issues.length; i++) {
    const issue = issues[i];
    const fixId = `${idPrefix}-${i}`;

    html += `<div class="fix-detail-card">`;
    html += `<div class="fix-detail-header ${issue.severity}" onclick="toggleFix('${fixId}')">`;
    html += `<div class="fix-detail-num" style="color:${severityColor(issue.severity)};">${i + 1}</div>`;
    html += `<div class="fix-detail-info">`;
    html += `<div class="fix-detail-title">${escapeHtml(issue.controlName)}</div>`;
    html += `<div class="fix-detail-meta">${escapeHtml(issue.controlId)} | ${escapeHtml(issue.category)} | ${escapeHtml(issue.framework)}${issue.article ? ' | ' + escapeHtml(issue.article) : ''} | Pack: ${escapeHtml(issue.packName)}</div>`;
    html += `</div>`;
    html += `<div class="fix-detail-badges">`;
    html += `<span class="badge badge-sev" style="background:${severityColor(issue.severity)}">${issue.severity.toUpperCase()}</span>`;
    html += `<span class="badge badge-status" style="background:${statusColor(issue.status)}">${statusLabel(issue.status)}</span>`;
    html += `<span style="font-size:12px;color:#6b7280;">${issue.passedChecks}/${issue.totalChecks} checks</span>`;
    if (issue.auditFindings.length > 0) {
      html += `<span style="font-size:12px;color:#ef4444;font-weight:600;">${issue.auditFindings.length} evidence</span>`;
    }
    html += `<span class="fix-toggle" id="${fixId}-toggle">Expand</span>`;
    html += `</div></div>`;

    html += `<div class="fix-detail-body" id="${fixId}">`;

    html += `<div class="fix-section"><div class="fix-section-title">Description</div>`;
    html += `<div style="font-size:13px;color:#4b5563;line-height:1.6;">${escapeHtml(issue.description)}</div>`;
    html += `</div>`;

    if (issue.auditFindings.length > 0) {
      html += `<div class="fix-section"><div class="fix-section-title">Audit Evidence &amp; Fix Assignments (${issue.auditFindings.length})</div>`;
      for (const f of issue.auditFindings) {
        const fkey = `${f.ruleId}:${f.file}:${f.line || 0}`;
        const assignment = assignmentMap?.get(fkey);
        html += `<div class="fix-finding-item ${f.severity}">`;
        html += `<div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">`;
        html += `<span class="badge badge-sev" style="background:${severityColor(f.severity)};font-size:10px;">${f.severity.toUpperCase()}</span>`;
        html += `<strong style="font-size:13px;">${escapeHtml(f.title)}</strong></div>`;
        html += `<div style="font-size:12px;color:#6b7280;"><span style="font-family:monospace;font-weight:600;">${escapeHtml(f.ruleId)}</span> &mdash; <span style="font-family:monospace;">${escapeHtml(f.file)}${f.line ? ':' + f.line : ''}</span></div>`;
        if (f.description) html += `<div style="font-size:12px;color:#4b5563;margin-top:4px;">${escapeHtml(f.description)}</div>`;
        if (f.evidence) html += `<div class="fix-evidence">${escapeHtml(f.evidence)}</div>`;
        if (assignment) {
          const statusColorAssign = assignment.status === "fixed" || assignment.status === "verified" ? "#22c55e" : assignment.status === "in-progress" ? "#3b82f6" : "#eab308";
          html += `<div class="fix-assign-box" style="margin-top:8px;padding:10px 12px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;">`;
          html += `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">`;
          html += `<span class="badge" style="background:${statusColorAssign};color:#fff;font-size:10px;text-transform:uppercase;">${escapeHtml(assignment.status)}</span>`;
          html += `<span style="font-size:12px;font-weight:600;color:#166534;">Linked: ${escapeHtml(assignment.governance_system_name)}</span>`;
          html += `<span style="font-size:11px;color:#4b5563;">Assignee: ${escapeHtml(assignment.assignee)}${assignment.assignee_role ? ' (' + escapeHtml(assignment.assignee_role) + ')' : ''}</span>`;
          html += `</div>`;
          if (assignment.resolution) {
            html += `<div style="font-size:11px;color:#4b5563;margin-top:4px;">Resolved by ${escapeHtml(assignment.resolution.resolved_by)} via ${escapeHtml(assignment.resolution.method)} on ${escapeHtml(new Date(assignment.resolution.resolved_at).toLocaleDateString())}</div>`;
          }
          html += `<div style="margin-top:6px;display:flex;gap:6px;">`;
          if (assignment.status !== "fixed" && assignment.status !== "verified") {
            html += `<button class="gov-action-btn" style="background:#22c55e;color:#fff;border:none;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;" onclick="event.stopPropagation();resolveFindingFix('${escapeHtml(fkey)}')">Mark Fixed</button>`;
          }
          html += `<button class="gov-action-btn" style="background:#fee2e2;color:#991b1b;border:none;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;" onclick="event.stopPropagation();unassignFix('${escapeHtml(fkey)}')">Unassign</button>`;
          html += `</div>`;
          html += `</div>`;
        } else {
          html += `<div style="margin-top:8px;">`;
          html += `<button class="gov-action-btn" style="background:#3b82f6;color:#fff;border:none;padding:4px 12px;border-radius:4px;font-size:11px;cursor:pointer;" onclick="event.stopPropagation();openAssignModal('${escapeHtml(fkey)}','${escapeHtml(f.ruleId)}','${escapeHtml(f.title.replace(/'/g, "\\'"))}','${escapeHtml(f.file)}',${f.line || 0},'${escapeHtml(f.severity)}','${escapeHtml(f.controlIds.join(","))}')">+ Assign to Governance Record</button>`;
          html += `</div>`;
        }
        html += `</div>`;
      }
      html += `</div>`;
    }

    html += `<div class="fix-section"><div class="fix-section-title">Fix Guidance</div>`;
    html += `<div class="fix-guidance-box"><strong>How to fix:</strong> ${escapeHtml(issue.implementation_guidance)}</div>`;
    for (const f of issue.auditFindings) {
      if (f.fix) {
        html += `<div class="fix-guidance-box" style="margin-top:8px;background:#eff6ff;border-color:#bfdbfe;"><strong>Fix for ${escapeHtml(f.ruleId)}:</strong> ${escapeHtml(f.fix)}</div>`;
      }
    }
    html += `</div>`;

    const ctrlFkey = `${issue.controlId}::0`;
    const ctrlAssignment = assignmentMap?.get(ctrlFkey);
    html += renderGovernanceProvenanceSection(issue.controlId, issue.controlName, issue.severity, ctrlFkey, ctrlAssignment, govRecords);

    html += `<div class="fix-section"><div class="fix-section-title">Traceability</div>`;
    html += `<table><tbody>`;
    html += `<tr><td style="font-weight:600;width:160px;">Control</td><td><span class="link" onclick="showControlDetail('${escapeHtml(issue.controlId)}')">${escapeHtml(issue.controlId)}</span> &mdash; ${escapeHtml(issue.controlName)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Category</td><td>${escapeHtml(issue.category)}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Framework</td><td>${escapeHtml(issue.framework)}${issue.article ? ' / ' + escapeHtml(issue.article) : ''}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Policy Pack</td><td>${issue.packId ? `<span class="tag" style="cursor:pointer;" onclick="loadPackDetail('${issue.packId}')">${escapeHtml(issue.packName)}</span>` : 'Direct'}</td></tr>`;
    html += `<tr><td style="font-weight:600;">Severity</td><td><span class="badge badge-sev" style="background:${severityColor(issue.severity)}">${issue.severity.toUpperCase()}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">Status</td><td><span class="badge badge-status" style="background:${statusColor(issue.status)}">${statusLabel(issue.status)}</span></td></tr>`;
    html += `<tr><td style="font-weight:600;">Checks</td><td>${issue.passedChecks}/${issue.totalChecks} passed</td></tr>`;
    html += `<tr><td style="font-weight:600;">Audit Evidence</td><td>${issue.auditFindings.length} finding(s)</td></tr>`;
    html += `</tbody></table>`;
    html += `</div>`;

    html += `</div></div>`;
  }

  return html;
}

function renderGovernanceProvenanceSection(
  controlId: string,
  controlName: string,
  severity: string,
  ctrlFkey: string,
  ctrlAssignment: import("@greenarmor/ges-core").FixAssignment | undefined,
  govRecords?: import("@greenarmor/ges-core").GovernanceRecord[],
): string {
  let html = `<div class="fix-section"><div class="fix-section-title">Governance Provenance Chain</div>`;

  if (ctrlAssignment && govRecords) {
    const record = govRecords.find(r => r.id === ctrlAssignment.governance_record_id);

    const aStatusColor = ctrlAssignment.status === "fixed" || ctrlAssignment.status === "verified"
      ? "#22c55e"
      : ctrlAssignment.status === "in-progress"
        ? "#3b82f6"
        : "#eab308";
    html += `<div style="padding:12px 16px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;margin-bottom:10px;">`;
    html += `<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:8px;">`;
    html += `<span class="badge" style="background:${aStatusColor};color:#fff;font-size:10px;text-transform:uppercase;">${escapeHtml(ctrlAssignment.status)}</span>`;
    html += `<span style="font-size:12px;font-weight:600;color:#166534;">Assignee: ${escapeHtml(ctrlAssignment.assignee)}${ctrlAssignment.assignee_role ? ' (' + escapeHtml(ctrlAssignment.assignee_role) + ')' : ''}</span>`;
    html += `<span style="font-size:11px;color:#6b7280;">Assigned by ${escapeHtml(ctrlAssignment.assigned_by)} on ${escapeHtml(new Date(ctrlAssignment.assigned_at).toLocaleDateString())}</span>`;
    html += `</div>`;
    if (ctrlAssignment.notes) {
      html += `<div style="font-size:12px;color:#4b5563;margin-bottom:6px;"><strong>Notes:</strong> ${escapeHtml(ctrlAssignment.notes)}</div>`;
    }
    if (ctrlAssignment.resolution) {
      const r = ctrlAssignment.resolution;
      html += `<div style="font-size:12px;padding:6px 10px;background:#dcfce7;border-radius:6px;margin-top:6px;">`;
      html += `<strong>&#10003; Resolved</strong> by ${escapeHtml(r.resolved_by)}${r.resolved_by_role ? ' (' + escapeHtml(r.resolved_by_role) + ')' : ''} via <strong>${escapeHtml(r.method)}</strong> on ${escapeHtml(new Date(r.resolved_at).toLocaleDateString())}`;
      if (r.resolution_notes) html += `<br><span style="color:#4b5563;">${escapeHtml(r.resolution_notes)}</span>`;
      html += `</div>`;
    }
    html += `<div style="margin-top:8px;display:flex;gap:6px;">`;
    if (ctrlAssignment.status !== "fixed" && ctrlAssignment.status !== "verified") {
      html += `<button class="gov-action-btn" style="background:#22c55e;color:#fff;border:none;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;" onclick="event.stopPropagation();resolveFindingFix('${escapeHtml(ctrlFkey)}')">Mark Fixed</button>`;
    }
    html += `<button class="gov-action-btn" style="background:#fee2e2;color:#991b1b;border:none;padding:4px 10px;border-radius:4px;font-size:11px;cursor:pointer;" onclick="event.stopPropagation();unassignFix('${escapeHtml(ctrlFkey)}')">Unassign</button>`;
    html += `</div>`;
    html += `</div>`;

    if (record) {
      html += renderProvenanceChainInline(record);
    }
  } else {
    html += `<div style="padding:12px 16px;border-radius:8px;background:#f9fafb;border:1px dashed #d1d5db;">`;
    html += `<div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">`;
    html += `<div style="font-size:13px;color:#6b7280;">This control is not linked to any governance record. Assign it to create a provenance chain for auditors.</div>`;
    html += `<button class="gov-action-btn" style="background:#4f46e5;color:#fff;border:none;padding:6px 14px;border-radius:6px;font-size:12px;cursor:pointer;font-weight:600;white-space:nowrap;" onclick="event.stopPropagation();openAssignModal('${escapeHtml(ctrlFkey)}','${escapeHtml(controlId)}','${escapeHtml(controlName.replace(/'/g, "\\'"))}','',0,'${escapeHtml(severity)}','${escapeHtml(controlId)}')">+ Assign to Governance Record</button>`;
    html += `</div>`;
    html += `</div>`;

    if (issueHasFindingLevelAssignments(ctrlFkey, controlId)) {
      html += `<div style="margin-top:8px;font-size:11px;color:#6b7280;">&#8505; Individual audit findings within this control may already be assigned at the finding level below.</div>`;
    }
  }

  html += `</div>`;
  return html;
}

function issueHasFindingLevelAssignments(ctrlFkey: string, controlId: string): boolean {
  return false;
}

function renderProvenanceChainInline(record: import("@greenarmor/ges-core").GovernanceRecord): string {
  let html = `<div style="border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">`;

  html += `<div style="background:#f3f4f6;padding:10px 14px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;">`;
  html += `<span style="font-size:14px;font-weight:700;color:#1f2937;">${escapeHtml(record.system_name)}</span>`;
  html += `<span class="badge" style="background:${record.status === "approved" ? "#22c55e" : record.status === "rejected" || record.status === "revoked" ? "#ef4444" : "#eab308"};color:#fff;font-size:10px;text-transform:uppercase;">${escapeHtml(record.status)}</span>`;
  html += `<span class="badge" style="background:${record.risk_level === "critical" ? "#ef4444" : record.risk_level === "high" ? "#f97316" : record.risk_level === "medium" ? "#eab308" : "#22c55e"};color:#fff;font-size:10px;text-transform:uppercase;">${escapeHtml(record.risk_level)} RISK</span>`;
  html += `<span style="font-size:11px;color:#9ca3af;font-family:monospace;">${escapeHtml(record.id)}</span>`;
  html += `</div>`;

  html += `<div style="padding:10px 14px;">`;
  html += `<table style="width:100%;font-size:12px;border-collapse:collapse;">`;

  if (record.approval) {
    const a = record.approval;
    const decColor = a.decision === "approved" ? "#22c55e" : "#ef4444";
    html += `<tr style="border-bottom:1px solid #f3f4f6;">`;
    html += `<td style="padding:6px 8px;font-weight:600;width:140px;color:#374151;">Approval</td>`;
    html += `<td style="padding:6px 8px;">`;
    html += `<span style="color:${decColor};font-weight:600;">${escapeHtml(a.decision.toUpperCase())}</span> by ${escapeHtml(a.approver_name)} (${escapeHtml(a.approver_role)})`;
    if (a.valid_until) html += ` &mdash; valid until ${escapeHtml(a.valid_until)}`;
    html += `</td></tr>`;
  } else {
    html += `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:6px 8px;font-weight:600;width:140px;color:#374151;">Approval</td><td style="padding:6px 8px;color:#ef4444;">&#10007; Not recorded</td></tr>`;
  }

  if (record.risk_assessment) {
    const ra = record.risk_assessment;
    html += `<tr style="border-bottom:1px solid #f3f4f6;">`;
    html += `<td style="padding:6px 8px;font-weight:600;color:#374151;">Risk Assessment</td>`;
    html += `<td style="padding:6px 8px;">Score: <strong>${escapeHtml(ra.risk_score)}</strong> &mdash; Residual: ${escapeHtml(ra.residual_risk)} (${escapeHtml(ra.methodology)})</td>`;
    html += `</tr>`;
  } else {
    html += `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:6px 8px;font-weight:600;color:#374151;">Risk Assessment</td><td style="padding:6px 8px;color:#9ca3af;">&#10007; Not assessed</td></tr>`;
  }

  if (record.policy_basis) {
    const pb = record.policy_basis;
    html += `<tr style="border-bottom:1px solid #f3f4f6;">`;
    html += `<td style="padding:6px 8px;font-weight:600;color:#374151;">Policy Basis</td>`;
    html += `<td style="padding:6px 8px;">${escapeHtml(pb.policy_name)} v${escapeHtml(pb.version)} (${escapeHtml(pb.standard)})</td>`;
    html += `</tr>`;
  } else {
    html += `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:6px 8px;font-weight:600;color:#374151;">Policy Basis</td><td style="padding:6px 8px;color:#9ca3af;">&#10007; Not documented</td></tr>`;
  }

  html += `<tr style="border-bottom:1px solid #f3f4f6;">`;
  html += `<td style="padding:6px 8px;font-weight:600;color:#374151;">Evidence Chain</td>`;
  if (record.evidence.length > 0) {
    html += `<td style="padding:6px 8px;">`;
    for (const e of record.evidence) {
      html += `<span style="display:inline-block;margin-right:6px;margin-bottom:2px;padding:2px 8px;background:#eff6ff;border:1px solid #bfdbfe;border-radius:4px;font-size:11px;">${escapeHtml(e.title)} <span style="color:#6b7280;">(${escapeHtml(e.source_system)}: ${escapeHtml(e.reference)})</span></span>`;
    }
    html += `</td>`;
  } else {
    html += `<td style="padding:6px 8px;color:#9ca3af;">&#10007; No evidence references</td>`;
  }
  html += `</tr>`;

  if (record.review_cycle) {
    const rc = record.review_cycle;
    html += `<tr style="border-bottom:1px solid #f3f4f6;">`;
    html += `<td style="padding:6px 8px;font-weight:600;color:#374151;">Review Cycle</td>`;
    html += `<td style="padding:6px 8px;">${escapeHtml(rc.frequency)} &mdash; next review: ${escapeHtml(rc.next_review)}</td>`;
    html += `</tr>`;
  } else {
    html += `<tr style="border-bottom:1px solid #f3f4f6;"><td style="padding:6px 8px;font-weight:600;color:#374151;">Review Cycle</td><td style="padding:6px 8px;color:#9ca3af;">&#10007; Not scheduled</td></tr>`;
  }

  html += `<tr>`;
  html += `<td style="padding:6px 8px;font-weight:600;color:#374151;">Provenance Chain</td>`;
  const chainParts: string[] = [];
  chainParts.push(record.approval ? "&#10003;" : "&#10007;");
  chainParts.push(record.risk_assessment ? "&#10003;" : "&#10007;");
  chainParts.push(record.policy_basis ? "&#10003;" : "&#10007;");
  chainParts.push(record.evidence.length > 0 ? "&#10003;" : "&#10007;");
  chainParts.push(record.review_cycle ? "&#10003;" : "&#10007;");
  html += `<td style="padding:6px 8px;font-size:11px;">Approval ${chainParts[0]} &rarr; Risk ${chainParts[1]} &rarr; Policy ${chainParts[2]} &rarr; Evidence ${chainParts[3]} &rarr; Review ${chainParts[4]}</td>`;
  html += `</tr>`;

  html += `</table>`;
  html += `</div>`;
  html += `</div>`;
  return html;
}

function renderActivityLogSection(entries: import("@greenarmor/ges-core").ActivityLogEntry[]): string {
  if (!entries || entries.length === 0) {
    return `<div class="card">
      <h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Activity Log</h2>
      <p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every GESF operation performed via CLI or MCP is recorded here &mdash; the single source of truth for what GESF did to your project.</p>
      <div class="empty-state">
        <div class="icon">&#128203;</div>
        <div class="msg">No activity recorded yet</div>
        <div class="sub">Operations will appear here as you use GESF commands (<code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">ges init</code>, <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">ges audit</code>, <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-size:12px;">ges fix</code>, MCP tools, etc.)</div>
      </div>
    </div>`;
  }

  const sorted = [...entries].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const bySource = { cli: entries.filter(e => e.source === "cli").length, mcp: entries.filter(e => e.source === "mcp").length };
  const byStatus = {
    success: entries.filter(e => e.status === "success").length,
    partial: entries.filter(e => e.status === "partial").length,
    failed: entries.filter(e => e.status === "failed").length,
    info: entries.filter(e => e.status === "info").length,
  };
  const byAction: Record<string, number> = {};
  for (const e of entries) {
    byAction[e.action] = (byAction[e.action] || 0) + 1;
  }
  const actionLabels: Record<string, string> = {
    init: "Project Init",
    audit: "Audit Run",
    fix: "Auto-Fix",
    policy_install: "Pack Installed",
    policy_remove: "Pack Removed",
    control_override: "Control Override",
    implement_control: "Control Implemented",
    score: "Score Generated",
    scan: "Scanners Run",
    validate: "Validation",
    generate: "Docs Generated",
    hooks_install: "Hooks Installed",
    hooks_uninstall: "Hooks Removed",
    dashboard_start: "Dashboard Started",
    badge_generate: "Badge Generated",
  };
  const actionColors: Record<string, string> = {
    init: "#0f766e",
    audit: "#3b82f6",
    fix: "#22c55e",
    policy_install: "#8b5cf6",
    policy_remove: "#ef4444",
    control_override: "#eab308",
    implement_control: "#22c55e",
    score: "#3b82f6",
    scan: "#f97316",
    validate: "#6b7280",
    generate: "#0f766e",
    hooks_install: "#6b7280",
    hooks_uninstall: "#6b7280",
    dashboard_start: "#8b5cf6",
    badge_generate: "#0f766e",
  };
  const statusColors: Record<string, string> = {
    success: "#22c55e",
    partial: "#eab308",
    failed: "#ef4444",
    info: "#3b82f6",
  };

  let html = '';
  html += `<h2 style="font-size:20px;font-weight:700;margin-bottom:8px;">Activity Log</h2>`;
  html += `<p style="color:#6b7280;font-size:14px;margin-bottom:16px;">Every GESF operation performed via CLI or MCP is recorded here &mdash; the single source of truth for what GESF did to your project.</p>`;

  html += `<div class="grid grid-4" style="margin-bottom:20px;">`;
  html += `<div class="card stat"><div class="num">${entries.length}</div><div class="label">Total Operations</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#22c55e;">${byStatus.success}</div><div class="label">Successful</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#ef4444;">${byStatus.failed + byStatus.partial}</div><div class="label">Failed/Partial</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#0f766e;">${bySource.cli}</div><div class="label">CLI Source</div></div>`;
  html += `</div>`;

  html += `<div class="grid grid-2" style="margin-bottom:20px;">`;
  html += `<div class="card"><div class="card-title">Operations by Type</div>`;
  for (const [action, count] of Object.entries(byAction).sort((a, b) => b[1] - a[1])) {
    const label = actionLabels[action] || action;
    const color = actionColors[action] || "#6b7280";
    html += `<div class="framework-row"><div class="framework-name" style="min-width:160px;font-size:13px;"><span class="badge" style="background:${color};font-size:10px;margin-right:6px;">${label}</span></div><div style="flex:1;"></div><div class="pct-text">${count}</div></div>`;
  }
  html += `</div>`;
  html += `<div class="card"><div class="card-title">Sources & Status</div>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:16px;margin-top:8px;">`;
  html += `<div class="stat"><div class="num" style="font-size:20px;">${bySource.cli}</div><div class="label">CLI</div></div>`;
  html += `<div class="stat"><div class="num" style="font-size:20px;">${bySource.mcp}</div><div class="label">MCP</div></div>`;
  html += `<div class="stat"><div class="num" style="font-size:20px;color:#22c55e;">${byStatus.success}</div><div class="label">Success</div></div>`;
  html += `<div class="stat"><div class="num" style="font-size:20px;color:#ef4444;">${byStatus.failed}</div><div class="label">Failed</div></div>`;
  html += `</div></div>`;
  html += `</div>`;

  html += `<div class="card"><div class="card-title">Timeline (newest first)</div>`;
  html += `<table><thead><tr><th>Time</th><th>Source</th><th>Actor</th><th>Action</th><th>Status</th><th>Description</th><th>Impact</th></tr></thead><tbody>`;

  for (const entry of sorted) {
    const time = new Date(entry.timestamp).toLocaleString();
    const sourceBadge = entry.source === "mcp"
      ? '<span class="badge" style="background:#7c3aed;font-size:10px;">MCP</span>'
      : '<span class="badge" style="background:#0f766e;font-size:10px;">CLI</span>';
    const actorHtml = entry.actor_name
      ? `<div style="font-size:12px;font-weight:600;">${escapeHtml(entry.actor_name)}</div>${entry.actor_role ? '<div style="font-size:11px;color:#6b7280;">' + escapeHtml(entry.actor_role) + '</div>' : ''}`
      : '<span style="color:#9ca3af;font-size:11px;">-</span>';
    const actionLabel = actionLabels[entry.action] || entry.action;
    const actionColor = actionColors[entry.action] || "#6b7280";
    const actionBadge = `<span class="badge" style="background:${actionColor};font-size:10px;">${escapeHtml(actionLabel)}</span>`;
    const statusBadge = `<span class="badge badge-status" style="background:${statusColors[entry.status] || '#6b7280'};font-size:10px;">${entry.status.toUpperCase()}</span>`;

    const impactParts: string[] = [];
    if (entry.details.findings_count !== undefined) impactParts.push(`${entry.details.findings_count} findings`);
    if (entry.details.fixes_applied !== undefined) impactParts.push(`${entry.details.fixes_applied} fixes`);
    if (entry.details.packs_affected && entry.details.packs_affected.length > 0) impactParts.push(`Packs: ${entry.details.packs_affected.join(", ")}`);
    if (entry.details.controls_affected && entry.details.controls_affected.length > 0) impactParts.push(`Controls: ${entry.details.controls_affected.length}`);
    if (entry.details.files_created && entry.details.files_created.length > 0) impactParts.push(`${entry.details.files_created.length} files created`);
    if (entry.details.frameworks_added && entry.details.frameworks_added.length > 0) impactParts.push(`Added: ${entry.details.frameworks_added.join(", ")}`);
    if (entry.details.score !== undefined) impactParts.push(`Score: ${entry.details.score}%`);
    const impactHtml = impactParts.length > 0
      ? impactParts.map(p => `<div style="font-size:11px;color:#6b7280;margin-bottom:2px;">${escapeHtml(p)}</div>`).join('')
      : '<span style="color:#9ca3af;">-</span>';

    html += `<tr>
      <td style="font-size:11px;white-space:nowrap;">${time}</td>
      <td>${sourceBadge}</td>
      <td>${actorHtml}</td>
      <td>${actionBadge}</td>
      <td>${statusBadge}</td>
      <td>
        <div style="font-weight:600;font-size:13px;">${escapeHtml(entry.title)}</div>
        <div style="font-size:12px;color:#6b7280;">${escapeHtml(entry.description)}</div>
      </td>
      <td style="max-width:200px;">${impactHtml}</td>
    </tr>`;
  }

  html += `</tbody></table></div>`;

  return html;
}

function govStatusColor(status: string): string {
  const m: Record<string, string> = {
    approved: "#22c55e",
    conditional: "#eab308",
    "pending-review": "#3b82f6",
    draft: "#6b7280",
    rejected: "#ef4444",
    revoked: "#ef4444",
    expired: "#f97316",
  };
  return m[status] || "#6b7280";
}

function govRiskColor(level: string): string {
  const m: Record<string, string> = {
    low: "#22c55e",
    medium: "#eab308",
    high: "#f97316",
    critical: "#ef4444",
  };
  return m[level] || "#6b7280";
}

function renderGovernanceSection(data: GovernanceData): string {
  const { records, verifications, summary } = data;

  if (records.length === 0) {
    return `<div class="card">
      <div class="card-title">Governance Provenance Chain</div>
      <div class="empty-state">
        <div class="icon">&#128203;</div>
        <div class="msg">No governance records found</div>
        <div class="sub">Create your first governance record to start building the provenance chain</div>
        <div class="sub" style="margin-top:12px;">The governance tab provides end-to-end traceability for auditors:<br>
          System &rarr; Risk Assessment &rarr; Policy &rarr; Approval &rarr; Evidence &rarr; Review Cycle</div>
        <div style="margin-top:16px;">
          <button class="gov-btn gov-btn-primary" onclick="openGovModal('create')">&#43; Create First Record</button>
        </div>
      </div>
    </div>
    ${renderGovModals()}
    ${renderGovToastContainer()}`;
  }

  let html = "";

  html += `<div style="margin-bottom:20px;">`;
  html += `<h2 style="font-size:20px;font-weight:700;margin-bottom:4px;">Governance Provenance Chain</h2>`;
  html += `<p style="color:#6b7280;font-size:14px;margin-bottom:16px;">End-to-end approval traceability for auditors and regulators. Each record links: System &rarr; Risk Assessment &rarr; Policy &rarr; Approval &rarr; Evidence &rarr; Review Cycle.</p>`;
  html += `<div class="gov-toolbar"><button class="gov-btn gov-btn-primary" onclick="openGovModal('create')">&#43; New Record</button><a href="/api/report/governance" class="gov-btn gov-btn-outline">&#128203; Export Report</a></div>`;
  html += `<div class="grid grid-4" style="margin-bottom:20px;">`;
  html += `<div class="card stat"><div class="num">${summary.total}</div><div class="label">Total Systems</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#22c55e;">${summary.approved}</div><div class="label">Approved</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#3b82f6;">${summary.pending}</div><div class="label">Pending</div></div>`;
  html += `<div class="card stat"><div class="num" style="color:#f97316;">${summary.expired + summary.validWithIssues}</div><div class="label">Expired / Issues</div></div>`;
  html += `</div>`;
  html += `</div>`;

  if (summary.criticalRisk > 0 || summary.highRisk > 0) {
    html += `<div class="card" style="margin-bottom:20px;border-left:4px solid #ef4444;">`;
    html += `<div class="card-title" style="color:#ef4444;">High-Risk Systems</div>`;
    html += `<div style="display:flex;gap:16px;font-size:14px;">`;
    html += `<span><span style="color:#ef4444;font-weight:700;">${summary.criticalRisk}</span> critical risk</span>`;
    html += `<span><span style="color:#f97316;font-weight:700;">${summary.highRisk}</span> high risk</span>`;
    html += `</div></div>`;
  }

  html += `<div id="governance-records-list">`;

  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const v = verifications[i] || verifications.find(vv => vv.record_id === r.id);

    const statusBg = govStatusColor(r.status);
    const riskBg = govRiskColor(r.risk_level);

    html += `<div class="fix-detail-card" style="margin-bottom:12px;">`;
    html += `<div class="fix-detail-header" onclick="toggleFix('gov-${i}')" style="cursor:pointer;">`;
    html += `<div class="fix-detail-info" style="flex:1;">`;
    html += `<div class="fix-detail-title">${escapeHtml(r.system_name)}</div>`;
    html += `<div class="fix-detail-meta">${escapeHtml(r.system_type)} | ${escapeHtml(r.id)}${r.system_version ? ' | v' + escapeHtml(r.system_version) : ''}</div>`;
    html += `</div>`;
    html += `<div class="fix-detail-badges">`;
    html += `<span class="badge badge-sev" style="background:${statusBg};font-size:10px;">${r.status.toUpperCase()}</span>`;
    html += `<span class="badge badge-sev" style="background:${riskBg};font-size:10px;">${r.risk_level.toUpperCase()} RISK</span>`;
    if (v) {
      html += `<span class="badge badge-sev" style="background:${v.valid ? '#22c55e' : '#ef4444'};font-size:10px;">${v.valid ? '&#10003; VALID' : '&#10007; ISSUES'}</span>`;
    }
    html += `<span class="fix-toggle" id="gov-${i}-toggle">Expand</span>`;
    html += `</div>`;
    html += `</div>`;

    html += `<div class="fix-detail-body" id="gov-${i}">`;

    if (v) {
      html += `<div class="fix-section"><div class="fix-section-title">Verification Checklist</div>`;
      html += `<ul class="check-list">`;
      const checks: [boolean, string][] = [
        [v.completeness.has_approval, "Approval Decision"],
        [v.completeness.has_risk_assessment, "Risk Assessment"],
        [v.completeness.has_policy_basis, "Policy Basis"],
        [v.completeness.has_evidence, `Evidence Chain (${v.completeness.evidence_count} refs)`],
        [v.completeness.has_review_cycle, "Review Cycle"],
        [v.completeness.has_data_inventory, "Data Inventory"],
        [v.completeness.has_compliance_links, "Compliance Links"],
        [v.completeness.is_current, "Currently Valid"],
      ];
      for (const [ok, label] of checks) {
        const icon = ok ? "&#10003;" : "&#10007;";
        const bg = ok ? "#22c55e" : "#ef4444";
        html += `<li><span class="check-icon" style="background:${bg};">${icon}</span> <span>${label}</span></li>`;
      }
      html += `</ul>`;

      if (v.approval_status !== "none") {
        html += `<div style="margin-top:8px;font-size:13px;">`;
        html += `<strong>Approval Status:</strong> `;
        const apColor = v.approval_status === "valid" ? "#22c55e" : v.approval_status === "expired" ? "#ef4444" : "#eab308";
        html += `<span style="color:${apColor};font-weight:600;">${v.approval_status.toUpperCase()}</span>`;
        if (v.days_until_expiry !== null) {
          const dayText = v.days_until_expiry < 0
            ? `${Math.abs(v.days_until_expiry)} days ago (EXPIRED)`
            : `${v.days_until_expiry} days remaining`;
          html += ` &mdash; ${dayText}`;
        }
        html += `</div>`;
      }

      if (v.issues.length > 0) {
        html += `<div style="margin-top:8px;"><strong style="color:#ef4444;">Blocking Issues:</strong><ul style="margin-top:4px;">`;
        for (const iss of v.issues) {
          html += `<li style="font-size:13px;color:#ef4444;">${escapeHtml(iss)}</li>`;
        }
        html += `</ul></div>`;
      }
      if (v.warnings.length > 0) {
        html += `<div style="margin-top:4px;"><strong style="color:#eab308;">Warnings:</strong><ul style="margin-top:4px;">`;
        for (const w of v.warnings) {
          html += `<li style="font-size:13px;color:#92400e;">${escapeHtml(w)}</li>`;
        }
        html += `</ul></div>`;
      }
      html += `</div>`;
    }

    html += `<div class="fix-section"><div class="fix-section-title">Approval Decision</div>`;
    if (r.approval) {
      const a = r.approval;
      html += `<div style="font-size:13px;line-height:1.8;">`;
      html += `<div><strong>Approver:</strong> ${escapeHtml(a.approver_name)} (${escapeHtml(a.approver_role)})</div>`;
      html += `<div><strong>Authority:</strong> ${escapeHtml(a.approval_authority)}</div>`;
      html += `<div><strong>Decision:</strong> <span style="color:${a.decision === "approved" ? "#22c55e" : "#ef4444"};font-weight:600;">${a.decision.toUpperCase()}</span></div>`;
      html += `<div><strong>Date:</strong> ${escapeHtml(a.decision_date)}</div>`;
      html += `<div><strong>Validity:</strong> ${escapeHtml(a.valid_from)} &rarr; ${escapeHtml(a.valid_until || "indefinite")}</div>`;
      if (a.conditions && a.conditions.length > 0) {
        html += `<div><strong>Conditions:</strong> ${(a.conditions || []).map(c => escapeHtml(c)).join("; ")}</div>`;
      }
      if (a.rationale) {
        html += `<div><strong>Rationale:</strong> ${escapeHtml(a.rationale)}</div>`;
      }
      html += `</div>`;
    } else {
      html += `<div style="color:#ef4444;font-size:13px;">&#9888; NOT RECORDED</div>`;
    }
    html += `</div>`;

    if (r.risk_assessment) {
      const ra = r.risk_assessment;
      html += `<div class="fix-section"><div class="fix-section-title">Risk Assessment</div>`;
      html += `<div style="font-size:13px;line-height:1.8;">`;
      html += `<div><strong>Assessor:</strong> ${escapeHtml(ra.assessor)}</div>`;
      html += `<div><strong>Methodology:</strong> ${escapeHtml(ra.methodology)}</div>`;
      html += `<div><strong>Risk Score:</strong> ${escapeHtml(ra.risk_score)} &mdash; <strong>Residual:</strong> ${escapeHtml(ra.residual_risk)}</div>`;
      html += `<div><strong>Date:</strong> ${escapeHtml(ra.assessment_date)}</div>`;
      if (ra.identified_risks && ra.identified_risks.length > 0) {
        html += `<div><strong>Identified Risks:</strong> ${(ra.identified_risks || []).map(r => escapeHtml(r)).join(", ")}</div>`;
      }
      html += `</div>`;
      html += `</div>`;
    }

    if (r.policy_basis) {
      const pb = r.policy_basis;
      html += `<div class="fix-section"><div class="fix-section-title">Policy Basis</div>`;
      html += `<div style="font-size:13px;line-height:1.8;">`;
      html += `<div><strong>Policy:</strong> ${escapeHtml(pb.policy_name)} (${escapeHtml(pb.policy_id)} v${escapeHtml(pb.version)})</div>`;
      html += `<div><strong>Standard:</strong> ${escapeHtml(pb.standard)}</div>`;
      if (pb.clauses && pb.clauses.length > 0) {
        html += `<div><strong>Clauses:</strong> ${(pb.clauses || []).map(c => escapeHtml(c)).join(", ")}</div>`;
      }
      html += `</div>`;
      html += `</div>`;
    }

    html += `<div class="fix-section"><div class="fix-section-title">Evidence Chain (${r.evidence.length})</div>`;
    if (r.evidence.length === 0) {
      html += `<div style="color:#ef4444;font-size:13px;">&#9888; NO EVIDENCE REFERENCES</div>`;
    } else {
      html += `<table><thead><tr><th>Title</th><th>Type</th><th>Source</th><th>Reference</th></tr></thead><tbody>`;
      for (const e of r.evidence) {
        html += `<tr>`;
        html += `<td>${escapeHtml(e.title)}</td>`;
        html += `<td style="font-size:12px;">${escapeHtml(e.type)}</td>`;
        html += `<td><span class="badge" style="background:#6b7280;color:white;font-size:10px;padding:2px 8px;">${escapeHtml(e.source_system)}</span></td>`;
        html += `<td style="font-family:monospace;font-size:11px;">${escapeHtml(e.reference)}</td>`;
        html += `</tr>`;
      }
      html += `</tbody></table>`;
    }
    html += `</div>`;

    if (r.review_cycle) {
      const rc = r.review_cycle;
      html += `<div class="fix-section"><div class="fix-section-title">Review Cycle</div>`;
      html += `<div style="font-size:13px;line-height:1.8;">`;
      html += `<div><strong>Frequency:</strong> ${escapeHtml(rc.frequency)}</div>`;
      html += `<div><strong>Last Review:</strong> ${escapeHtml(rc.last_review)} | <strong>Next:</strong> ${escapeHtml(rc.next_review)}</div>`;
      html += `</div>`;
      html += `</div>`;
    }

    if (r.committee) {
      const c = r.committee;
      html += `<div class="fix-section"><div class="fix-section-title">Committee Approval</div>`;
      html += `<div style="font-size:13px;line-height:1.8;">`;
      html += `<div><strong>Committee:</strong> ${escapeHtml(c.committee_name)}</div>`;
      html += `<div><strong>Meeting:</strong> ${escapeHtml(c.meeting_date)} (${escapeHtml(c.meeting_reference)})</div>`;
      if (c.attendees.length > 0) {
        html += `<div><strong>Attendees:</strong> ${(c.attendees || []).map(a => escapeHtml(a)).join(", ")}</div>`;
      }
      html += `</div>`;
      html += `</div>`;
    }

    html += `<div class="gov-actions">`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('approve','${escapeHtml(r.id)}')">Approve</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('evidence','${escapeHtml(r.id)}')">Evidence</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('risk-assessment','${escapeHtml(r.id)}')">Risk</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('policy-basis','${escapeHtml(r.id)}')">Policy</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('review-cycle','${escapeHtml(r.id)}')">Review</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('data-inventory','${escapeHtml(r.id)}')">Data Inv</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('committee','${escapeHtml(r.id)}')">Committee</button>`;
    html += `<button class="gov-action-btn" onclick="event.stopPropagation();openGovModal('compliance-links','${escapeHtml(r.id)}')">Compliance</button>`;
    html += `<button class="gov-action-btn" style="color:#dc2626;" onclick="event.stopPropagation();govDeleteRecord('${escapeHtml(r.id)}','${escapeHtml(r.system_name)}')">Delete</button>`;
    html += `</div>`;

    html += `<div style="margin-top:8px;font-size:11px;color:#9ca3af;">Created: ${escapeHtml(r.created_at)} by ${escapeHtml(r.created_by)} | Updated: ${escapeHtml(r.updated_at)} (v${r.record_version})</div>`;

    html += `</div>`;
    html += `</div>`;
  }

  html += `</div>`;
  html += renderGovModals();
  html += renderGovToastContainer();
  return html;
}

function renderInferencePage(): string {
  return `<div class="card">
    <div class="card-title">🤖 AI Inference Engine</div>
    <p style="color:#6b7280;font-size:14px;margin-bottom:16px;">AI-powered analysis of compliance data: finding clustering, root cause identification, score anomaly detection, and trend prediction.</p>
    <div id="inference-content">
      <div class="empty-state">
        <div class="icon">🤖</div>
        <div class="msg">Click load to run AI inference</div>
        <div class="sub">Analyzes audit findings, score history, and activity logs to surface actionable insights</div>
        <button class="gov-btn gov-btn-primary" onclick="loadInference()" style="margin-top:12px;">&#9654; Run Inference</button>
      </div>
    </div>
    <div id="inference-loading" style="display:none;text-align:center;padding:40px;">
      <div style="font-size:24px;margin-bottom:12px;">&#9881;</div>
      <p style="color:#6b7280;">Analyzing compliance data...</p>
    </div>
  </div>`;
}

function escapeHtml(str: unknown): string {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderGovModals(): string {
  return `<div class="gov-modal-overlay" id="gov-modal-overlay" onclick="if(event.target===this)closeGovModal()">
    <div class="gov-modal" id="gov-modal"></div>
  </div>`;
}

function renderGovToastContainer(): string {
  return `<div class="gov-toast-container" id="gov-toast-container"></div>`;
}
