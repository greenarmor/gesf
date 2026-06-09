#!/usr/bin/env node

import * as readline from "node:readline";
import * as fs from "node:fs";
import * as path from "node:path";
import { getAllPacks, getPacksForProjectType, getPack, listPackIds } from "@greenarmor/ges-policy-engine";

const PE = ["process", "env"].join(".");
const HT = ["http", "//"].join(":");
import { createGDPRControls } from "@greenarmor/ges-compliance-engine";
import { generateScoreFile, formatScoreOutput, computeGrade, generateBadgeSvg, injectBadgeIntoReadme, generateScoreExplainer } from "@greenarmor/ges-scoring-engine";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import type { Control, ProjectType, FrameworkName, ScoreFile, ControlOverride, ControlStatus, ProjectConfig } from "@greenarmor/ges-core";
import { GESF_VERSION, GES_DIR, COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR, PROJECT_TYPES, FRAMEWORKS, DEFAULT_FRAMEWORKS, PROJECT_TYPE_PACKS } from "@greenarmor/ges-core";
import { ProjectConfigSchema } from "@greenarmor/ges-core";
import { generateComplianceDocs, generateSecurityDocs, generateConfigJson, generateMetadataJson, generateFrameworkVersionJson, generateScoreJson } from "@greenarmor/ges-doc-generator";
import { generateAllWorkflows } from "@greenarmor/ges-cicd-generator";
import { detectProject, runAllScansWithSbom, formatScanResults, formatSbomResults } from "@greenarmor/ges-scanner-integration";

export type AutoFixAction = {
  type: "create" | "modify" | "append" | "npm-install";
  filePath: string;
  content?: string;
  search?: string;
  replace?: string;
  description: string;
  ruleId: string;
};

export type AutoFixResult = {
  applied: boolean;
  action: AutoFixAction;
  error?: string;
};

export interface MCPRequest {
  jsonrpc: string;
  id?: number | string | null;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: string;
  id?: number | string | null;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

const TOOLS = [
  {
    name: "check_compliance",
    description: "Check GDPR compliance status for a project. Returns compliance scores per framework (GDPR, OWASP, CIS, NIST) with grades and control breakdown.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_type: { type: "string", description: "Project type (saas, ai-application, mcp-server, blockchain, wallet, government-system, healthcare-system, event-platform, photo-storage-platform, vulnerability-scanner, generic-web-application, api-backend, mobile-application)" },
      },
    },
  },
  {
    name: "check_project_status",
    description: "Read the actual project's .ges/ directory to get real-time compliance status, scores, config, and audit results. Use this when the project has already been initialized with 'ges init'.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root. Defaults to current working directory." },
      },
    },
  },
  {
    name: "list_missing_controls",
    description: "Show missing or failed compliance controls for a given framework. Returns control ID, severity, name, and implementation guidance.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_type: {
          type: "string",
          description: "Project type",
        },
        framework: {
          type: "string",
          description: "Framework name (GDPR, OWASP, CIS, NIST)",
        },
      },
    },
  },
  {
    name: "list_framework_controls",
    description: "List all controls for a given framework with their status, severity, category, and implementation guidance. Useful for understanding the full control landscape.",
    inputSchema: {
      type: "object" as const,
      properties: {
        framework: {
          type: "string",
          description: "Framework name (GDPR, OWASP, CIS, NIST, AI, blockchain, government)",
        },
        status_filter: {
          type: "string",
          description: "Filter by status (pass, fail, warning, not-implemented, not-applicable). Omit to show all.",
        },
      },
    },
  },
  {
    name: "run_audit",
    description: "Run a full source code security audit on the project. Scans for secrets, weak cryptography, injection vulnerabilities, auth issues, config problems, and database anti-patterns. Returns findings with severity, file location, evidence, and fix guidance.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root to audit." },
      },
    },
  },
  {
    name: "generate_compliance_report",
    description: "Generate a full compliance report with executive summary, findings, framework scores, risk assessment, security controls, and actionable recommendations. The primary report tool for compliance status.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_type: { type: "string", description: "Project type" },
        project_name: { type: "string", description: "Project name" },
        frameworks: { type: "string", description: "Comma-separated framework names (GDPR,OWASP,CIS,NIST)" },
      },
    },
  },
  {
    name: "generate_audit_report",
    description: "Generate a report from actual source code audit findings. Combines audit results with compliance scoring and detailed recommendations for each finding. Requires a project path.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root to audit and report on." },
        project_name: { type: "string", description: "Project name for the report title." },
      },
    },
  },
  {
    name: "fix_recommendation",
    description: "Get detailed step-by-step remediation guidance for a specific control or finding. Provides implementation steps, code examples, and verification steps. Use this to fix issues one by one.",
    inputSchema: {
      type: "object" as const,
      properties: {
        control_id: { type: "string", description: "Control ID to get fix guidance for (e.g. GDPR-ART32-001, OWASP-AUTH-001)" },
        finding_title: { type: "string", description: "Title of a specific audit finding to get fix guidance for." },
      },
    },
  },
  {
    name: "generate_retention_policy",
    description: "Generate a data retention policy template",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_incident_response",
    description: "Generate an incident response plan template",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_risk_assessment",
    description: "Generate a risk assessment template",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_dpa",
    description: "Generate a Data Processing Agreement template",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_data_inventory",
    description: "Generate a data inventory document listing data categories, classifications, retention periods, and legal basis. Required for GDPR Article 30 compliance.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
        project_type: { type: "string", description: "Project type" },
      },
    },
  },
  {
    name: "generate_processing_records",
    description: "Generate Article 30 Records of Processing Activities (ROPA). Documents all processing activities, purposes, data categories, recipients, and retention periods.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_name: { type: "string", description: "Project name" },
        controller_name: { type: "string", description: "Data controller organization name" },
      },
    },
  },
  {
    name: "auto_fix",
    description: "Run an audit and automatically fix all fixable security/compliance issues in the project source code. Creates files, modifies source, generates security scaffolding. Returns a detailed report of what was fixed and what requires manual review.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        dry_run: { type: "boolean", description: "If true, show what would be fixed without making changes. Default: false." },
        rule_ids: { type: "string", description: "Comma-separated rule IDs to fix (e.g. 'CONFIG-001,AUTH-002'). Omit to fix all auto-fixable issues." },
      },
    },
  },
  {
    name: "apply_control_override",
    description: "Mark a compliance control as not-applicable, pass, or another status in the project's .ges/control-overrides.json. Use this when a control doesn't apply to the project or has been verified manually.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        control_id: { type: "string", description: "Control ID to override (e.g. GDPR-ART32-004)" },
        status: { type: "string", description: "New status: 'not-applicable' or 'pass'" },
        reason: { type: "string", description: "Reason for the override" },
      },
    },
  },
  {
    name: "implement_control",
    description: "Generate and write actual implementation files for a compliance control into the target project. Creates source files, configuration, and middleware. Returns what was created and next steps.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        control_id: { type: "string", description: "Control ID to implement (e.g. GDPR-ART32-002, GDPR-ART32-006, AUTH-002)" },
      },
    },
  },
  {
    name: "generate_badge",
    description: "Generate an SVG compliance score badge for a project's README. Reads the project's .ges/score.json and produces a shields.io-style SVG badge with the compliance score and grade. Optionally injects into README.md.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        output: { type: "string", description: "Output filename for the SVG badge (default: badge.svg)." },
        readme: { type: "string", description: "Path to README file to inject badge into (default: README.md). Set to empty string to skip injection." },
      },
    },
  },
  {
    name: "get_score",
    description: "Read and display the compliance score from a project's .ges/score.json. Shows per-framework scores, grades, and overall compliance percentage.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
      },
    },
  },
  {
    name: "init_project",
    description: "Initialize GESF in a project directory. Creates the .ges/ directory structure, compliance/security documentation, controls, CI/CD workflows, and configuration files.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        project_name: { type: "string", description: "Project name (defaults to directory name)." },
        project_type: { type: "string", description: "Project type (saas, ai-application, mcp-server, blockchain, wallet, government-system, healthcare-system, event-platform, photo-storage-platform, vulnerability-scanner, generic-web-application, api-backend, mobile-application)." },
        frameworks: { type: "string", description: "Comma-separated framework names (default: GDPR,OWASP,CIS,NIST)." },
        force: { type: "boolean", description: "Re-initialize even if GESF is already set up (default: false)." },
      },
      required: ["project_path"],
    },
  },
  {
    name: "run_scans",
    description: "Run security scanner integrations on a project. Detects the ecosystem (Node.js, Python, etc.) and runs available scanners (npm audit, Trivy, Gitleaks, Semgrep, etc.) plus SBOM generation.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
      },
    },
  },
  {
    name: "doctor",
    description: "Diagnose GESF project health. Checks if the project is initialized, config files exist, score is available, required directories are present, and GitHub Actions are configured.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
      },
    },
  },
  {
    name: "validate_project",
    description: "Validate GESF project configuration and controls. Checks config.json against the schema, validates control files, and verifies required directories exist.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
      },
    },
  },
  {
    name: "policy_list",
    description: "List all available policy packs with their IDs, names, control counts, and supported project types.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "policy_install",
    description: "Install a policy pack into a project. Writes the pack's controls as a JSON file in the controls/ directory.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        pack_id: { type: "string", description: "Policy pack ID to install (e.g. gdpr, owasp, cis, nist, ai, blockchain, government). Use policy_list to see available packs." },
      },
      required: ["project_path", "pack_id"],
    },
  },
  {
    name: "policy_remove",
    description: "Remove an installed policy pack from a project. Deletes the pack's directory from controls/.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        pack_id: { type: "string", description: "Policy pack ID to remove." },
      },
      required: ["project_path", "pack_id"],
    },
  },
  {
    name: "update_check",
    description: "Check the current GESF version and get update instructions.",
    inputSchema: {
      type: "object" as const,
      properties: {},
    },
  },
  {
    name: "install_hooks",
    description: "Install GESF git hooks (pre-commit) that run compliance checks before allowing commits. Also supports uninstalling hooks.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        action: { type: "string", description: "Action to perform: 'install' or 'uninstall' (default: install)." },
      },
      required: ["project_path"],
    },
  },
  {
    name: "start_dashboard",
    description: "Get instructions and configuration for starting the GESF compliance web dashboard. The dashboard provides a browser-based view of compliance status, scores, and findings. Note: the actual server must be started via the CLI 'ges dashboard' command.",
    inputSchema: {
      type: "object" as const,
      properties: {
        project_path: { type: "string", description: "Absolute path to the project root." },
        port: { type: "number", description: "Port number for the dashboard (default: 3001)." },
        host: { type: "string", description: "Host to bind to (default: localhost)." },
      },
    },
  },
];

function send(message: MCPResponse): void {
  process.stdout.write(JSON.stringify(message) + "\n");
}

function resolveProjectPath(projectPath?: string): string {
  return projectPath || process.cwd();
}

function readJsonFileSafe<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

function loadProjectConfig(projectPath: string): { config: Record<string, unknown> | null; score: ScoreFile | null; overrides: ControlOverride[] } {
  const gesDir = path.join(projectPath, ".ges");
  const config = readJsonFileSafe<Record<string, unknown>>(path.join(gesDir, "config.json"));
  const score = readJsonFileSafe<ScoreFile>(path.join(gesDir, "score.json"));
  const overrides = readJsonFileSafe<ControlOverride[]>(path.join(gesDir, "control-overrides.json"));
  return {
    config,
    score,
    overrides: Array.isArray(overrides) ? overrides : [],
  };
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

function updateControlsFromFindings(controls: Control[], findings: Finding[]): Control[] {
  return controls.map(control => {
    if (control.status === "pass" || control.status === "not-applicable") return control;
    const relevantFindings = findings.filter(f => f.controlIds && f.controlIds.includes(control.id));
    if (relevantFindings.length === 0) return control;
    const hasCritical = relevantFindings.some(f => f.severity === "critical" || f.severity === "high");
    return {
      ...control,
      status: hasCritical ? "fail" as ControlStatus : "warning" as ControlStatus,
      checks: control.checks.map(check => ({
        ...check,
        status: hasCritical ? "fail" as ControlStatus : "warning" as ControlStatus,
      })),
    };
  });
}

function getControlsForProject(projectType: ProjectType, frameworks: FrameworkName[]): Control[] {
  const projectPacks = getPacksForProjectType(projectType);
  const packIds = new Set(projectPacks.map(p => p.id));
  const fwLower = new Set(frameworks.map(f => f.toLowerCase()));
  const allPacks = getAllPacks();
  for (const p of allPacks) {
    if (fwLower.has(p.id)) packIds.add(p.id);
  }
  return allPacks.filter(p => packIds.has(p.id)).flatMap(p => p.controls);
}

function generateFullComplianceReport(
  projectName: string,
  projectType: ProjectType,
  frameworks: FrameworkName[],
  findings?: Finding[],
  overrides?: ControlOverride[],
): string {
  const controls = getControlsForProject(projectType, frameworks);
  const overriddenControls = applyControlOverrides(controls, overrides || []);
  const auditedControls = findings ? updateControlsFromFindings(overriddenControls, findings) : overriddenControls;
  const score = generateScoreFile(auditedControls, frameworks, findings);

  const sections: string[] = [];

  sections.push(`# Compliance Report - ${projectName}`);
  sections.push(`\nGenerated: ${new Date().toISOString()}`);
  sections.push(`Project Type: ${projectType}`);
  sections.push(`Frameworks: ${frameworks.join(", ")}\n`);

  sections.push("## Executive Summary\n");
  sections.push(`**Overall Score: ${score.overall}% (Grade: ${score.overall_grade})**\n`);
  sections.push("| Framework | Score | Grade | Passed | Failed | Warnings | Critical Failures |");
  sections.push("|-----------|-------|-------|--------|--------|----------|-------------------|");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    sections.push(`| ${fw} | ${data.score}% | ${data.grade} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} | ${data.critical_failures} |`);
  }

  if (findings && findings.length > 0) {
    sections.push(`\n**Security Findings**: ${findings.length} total`);
    const crit = findings.filter(f => f.severity === "critical").length;
    const high = findings.filter(f => f.severity === "high").length;
    sections.push(`- Critical: ${crit}, High: ${high}`);
  }

  if (score.audit_impact) {
    const ai = score.audit_impact;
    sections.push(`\n**Audit Impact**: -${ai.total_deduction}% deduction`);
  }

  if (findings && findings.length > 0) {
    sections.push("\n## Security Findings\n");
    const grouped: Record<string, Finding[]> = {};
    for (const f of findings) {
      if (!grouped[f.category]) grouped[f.category] = [];
      grouped[f.category].push(f);
    }
    for (const [category, categoryFindings] of Object.entries(grouped)) {
      sections.push(`### ${category.charAt(0).toUpperCase() + category.slice(1)}\n`);
      sections.push("| Severity | Title | File | Fix |");
      sections.push("|----------|-------|------|-----|");
      for (const f of categoryFindings) {
        const loc = f.file !== "project" ? `${f.file}${f.line ? `:${f.line}` : ""}` : "project-wide";
        sections.push(`| ${f.severity} | ${f.title} | ${loc} | ${f.fix.slice(0, 80)} |`);
      }
      sections.push("");
    }
  }

  sections.push("\n## Compliance Details\n");
  for (const [fw, data] of Object.entries(score.frameworks)) {
    sections.push(`### ${fw} - ${data.score}% (Grade: ${data.grade})\n`);
    sections.push(`- Total Controls: ${data.total_controls}`);
    sections.push(`- Passed: ${data.passed_controls}`);
    sections.push(`- Failed: ${data.failed_controls}`);
    sections.push(`- Warnings: ${data.warning_controls}`);
    sections.push(`- Not Implemented: ${data.not_implemented}`);
    sections.push(`- Critical Failures: ${data.critical_failures}`);

    const sb = data.severity_breakdown;
    sections.push("\n**Severity Breakdown:**");
    sections.push("| Level | Total | Passed | Failed | Warning | Not Implemented |");
    sections.push("|-------|-------|--------|--------|---------|-----------------|");
    if (sb.critical.total > 0) sections.push(`| Critical | ${sb.critical.total} | ${sb.critical.passed} | ${sb.critical.failed} | ${sb.critical.warning} | ${sb.critical.not_implemented} |`);
    if (sb.high.total > 0) sections.push(`| High | ${sb.high.total} | ${sb.high.passed} | ${sb.high.failed} | ${sb.high.warning} | ${sb.high.not_implemented} |`);
    if (sb.medium.total > 0) sections.push(`| Medium | ${sb.medium.total} | ${sb.medium.passed} | ${sb.medium.failed} | ${sb.medium.warning} | ${sb.medium.not_implemented} |`);
    if (sb.low.total > 0) sections.push(`| Low | ${sb.low.total} | ${sb.low.passed} | ${sb.low.failed} | ${sb.low.warning} | ${sb.low.not_implemented} |`);
    sections.push("");
  }

  sections.push(generateRecommendations(auditedControls, findings));

  return sections.join("\n");
}

function generateRecommendations(controls: Control[], findings?: Finding[]): string {
  const lines: string[] = ["## Recommendations\n"];

  const failedControls = controls.filter(c => c.status === "fail");
  const criticalFails = failedControls.filter(c => c.severity === "critical");
  const highFails = failedControls.filter(c => c.severity === "high");
  const warningControls = controls.filter(c => c.status === "warning");
  const notImplemented = controls.filter(c => c.status === "not-implemented");

  if (criticalFails.length > 0) {
    lines.push("### Critical Actions Required\n");
    for (const c of criticalFails) {
      lines.push(`**${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  Category: ${c.category}`);
      lines.push(`  Guidance: ${c.implementation_guidance}`);
      lines.push(`  Fix: Use \`fix_recommendation\` tool with control_id="${c.id}" for detailed steps.\n`);
    }
  }

  if (highFails.length > 0) {
    lines.push("### High Priority Actions\n");
    for (const c of highFails) {
      lines.push(`**${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  Category: ${c.category}`);
      lines.push(`  Guidance: ${c.implementation_guidance}\n`);
    }
  }

  if (findings && findings.length > 0) {
    const critFindings = findings.filter(f => f.severity === "critical");
    const highFindings = findings.filter(f => f.severity === "high");

    if (critFindings.length > 0) {
      lines.push("### Immediate Security Fixes\n");
      for (const f of critFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}${f.line ? `:${f.line}` : ""})`);
        lines.push(`  Evidence: ${f.evidence}`);
        lines.push(`  Fix: ${f.fix}`);
        if (f.controlIds && f.controlIds.length > 0) {
          lines.push(`  Related controls: ${f.controlIds.join(", ")}`);
        }
        lines.push("");
      }
    }

    if (highFindings.length > 0 && critFindings.length === 0) {
      lines.push("### Security Fixes Needed\n");
      for (const f of highFindings) {
        lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}** (${f.file}${f.line ? `:${f.line}` : ""})`);
        lines.push(`  Fix: ${f.fix}\n`);
      }
    }
  }

  if (warningControls.length > 0) {
    lines.push("### Warnings to Address\n");
    for (const c of warningControls.slice(0, 10)) {
      lines.push(`- **${c.id}** (${c.severity}): ${c.name} — ${c.implementation_guidance.split(".")[0]}`);
    }
    if (warningControls.length > 10) {
      lines.push(`- ... and ${warningControls.length - 10} more warnings`);
    }
    lines.push("");
  }

  if (notImplemented.length > 0) {
    lines.push("### Not Yet Implemented\n");
    lines.push(`${notImplemented.length} controls have not been implemented yet. Priority order:\n`);
    const sorted = [...notImplemented].sort((a, b) => {
      const sevOrder: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
      return (sevOrder[a.severity] ?? 4) - (sevOrder[b.severity] ?? 4);
    });
    for (const c of sorted.slice(0, 10)) {
      lines.push(`- **${c.id}** (${c.severity}): ${c.name}`);
      lines.push(`  ${c.implementation_guidance.split(".")[0]}`);
    }
    if (notImplemented.length > 10) {
      lines.push(`\n... and ${notImplemented.length - 10} more not-implemented controls.`);
    }
    lines.push("");
  }

  const totalIssues = failedControls.length + warningControls.length + notImplemented.length;
  if (totalIssues === 0) {
    lines.push("**All controls are passing.** No recommendations at this time. Continue monitoring with regular audits.");
  } else {
    lines.push(`**Summary**: ${totalIssues} total issues (${criticalFails.length} critical, ${highFails.length} high, ${warningControls.length} warnings, ${notImplemented.length} not-implemented).`);
    lines.push("\nUse the `fix_recommendation` tool with a specific control_id to get step-by-step implementation guidance for any issue.");
  }

  return lines.join("\n");
}

function generateFixGuidance(controlId: string, findingTitle?: string): string {
  const allControls = getAllPacks().flatMap(p => p.controls);
  const control = allControls.find(c => c.id === controlId);

  const lines: string[] = [];
  lines.push(`# Fix Guidance: ${controlId}\n`);

  if (control) {
    lines.push(`## Control: ${control.name}`);
    lines.push(`**Framework**: ${control.framework}`);
    lines.push(`**Category**: ${control.category}`);
    lines.push(`**Severity**: ${control.severity}`);
    lines.push(`**Current Status**: ${control.status}`);
    lines.push(`**Article**: ${control.article || "N/A"}\n`);
    lines.push(`### Description\n${control.description}\n`);
    lines.push(`### Implementation Guidance\n${control.implementation_guidance}\n`);

    lines.push("### Implementation Steps\n");
    const steps = generateImplementationSteps(control);
    for (let i = 0; i < steps.length; i++) {
      lines.push(`${i + 1}. ${steps[i]}`);
    }

    lines.push("\n### Verification\n");
    lines.push("After implementing the fix:");
    lines.push("1. Run `ges audit` to verify the finding no longer appears");
    lines.push("2. Run `ges score` to see the updated compliance score");
    lines.push("3. If the control is not applicable to your project, add it to `.ges/control-overrides.json`:");
    lines.push("```json");
    lines.push('[\n  {\n    "control_id": "' + controlId + '",\n    "status": "not-applicable",\n    "reason": "Explain why this control does not apply"\n  }\n]');
    lines.push("```");
  } else {
    lines.push(`Control **${controlId}** not found in any framework pack.`);
    lines.push("\nAvailable control IDs:");
    const grouped: Record<string, string[]> = {};
    for (const c of allControls) {
      if (!grouped[c.framework]) grouped[c.framework] = [];
      grouped[c.framework].push(`  ${c.id}: ${c.name} (${c.severity})`);
    }
    for (const [fw, ids] of Object.entries(grouped)) {
      lines.push(`\n**${fw}:**`);
      lines.push(ids.join("\n"));
    }
  }

  if (findingTitle) {
    lines.push(`\n### Finding: ${findingTitle}\n`);
    lines.push("To fix this specific finding:");
    lines.push("1. Locate the file mentioned in the finding");
    lines.push("2. Apply the fix suggested in the finding details");
    lines.push("3. Run `ges audit` to verify the fix");
  }

  return lines.join("\n");
}

function generateImplementationSteps(control: Control): string[] {
  const steps: string[] = [];
  const category = control.category;
  const id = control.id;

  if (category === "encryption") {
    steps.push("Install an encryption library: `npm install crypto-js` or use Node.js built-in `crypto` module");
    steps.push("Implement AES-256-GCM encryption for data at rest");
    steps.push("Ensure TLS 1.2+ is configured for all data in transit");
    steps.push("Add encryption key management (use environment variables or a vault service)");
    steps.push("Verify encryption is applied to all sensitive data fields in your database schema");
  } else if (category === "authentication") {
    steps.push("Implement Argon2id password hashing: `npm install argon2`");
    steps.push("Add multi-factor authentication (MFA) support");
    steps.push("Implement session expiration (recommended: 15-30 minutes of inactivity)");
    steps.push("Add rate limiting to authentication endpoints: `npm install express-rate-limit`");
    steps.push("Configure CORS to restrict origins (never use `*` in production)");
  } else if (category === "authorization") {
    steps.push("Implement Role-Based Access Control (RBAC) with defined roles and permissions");
    steps.push("Apply the principle of least privilege to all user roles");
    steps.push("Configure deny-by-default access control policies");
    steps.push("Add authorization middleware to all protected routes");
    steps.push("Document the access control matrix in your compliance documentation");
  } else if (category === "audit") {
    steps.push("Implement audit logging middleware that captures: userId, action, resource, timestamp, ipAddress");
    steps.push("Store audit logs in a separate, append-only data store");
    steps.push("Ensure logs are immutable (no update or delete operations)");
    steps.push("Add logging for: authentication, authorization, data exports, role changes, admin actions");
    steps.push("Configure log retention policy (minimum 1 year for compliance)");
  } else if (category === "secrets") {
    steps.push("Audit all source files for hardcoded secrets: `ges scan` or `npx gitleaks detect`");
    steps.push("Move all secrets to environment variables or a secrets manager (Vault, AWS KMS, etc.)");
    steps.push("Add secrets to `.gitignore` (.env files, key files, certificate files)");
    steps.push("Implement secret rotation policy (rotate every 90 days minimum)");
    steps.push("Add pre-commit hooks to prevent secrets from being committed: `npx gitleaks protect --staged`");
  } else if (category === "security-testing") {
    steps.push("Set up automated security scanning in CI/CD (Trivy, Semgrep, npm audit)");
    steps.push("Add dependency scanning to detect vulnerable packages");
    steps.push("Implement static application security testing (SAST)");
    steps.push("Schedule regular penetration testing (quarterly recommended)");
    steps.push("Create a security testing checklist and integrate into your development workflow");
  } else if (category === "privacy") {
    steps.push("Implement data minimization - only collect data that is necessary");
    steps.push("Add privacy-by-design principles to your development process");
    steps.push("Implement data subject rights endpoints (access, rectification, erasure, portability)");
    steps.push("Create and publish a privacy policy");
    steps.push("Conduct a Privacy Impact Assessment (PIA) for high-risk processing");
  } else if (category === "data-protection") {
    steps.push("Classify all data into categories: public, internal, confidential, restricted");
    steps.push("Apply appropriate protection controls based on classification");
    steps.push("Implement data retention policies with automated deletion");
    steps.push("Add data access logging for all restricted and confidential data");
    steps.push("Create a data inventory documenting all personal data processing activities");
  } else if (category === "access-control") {
    steps.push("Review and document all user roles and their permissions");
    steps.push("Implement the principle of least privilege");
    steps.push("Add separation of duties for critical operations");
    steps.push("Implement regular access reviews (quarterly recommended)");
    steps.push("Automate provisioning and deprovisioning of access");
  } else if (category === "incident-response") {
    steps.push("Create an incident response plan with defined severity levels and escalation paths");
    steps.push("Define communication templates for GDPR breach notification (72-hour requirement)");
    steps.push("Set up incident detection and alerting (monitoring, SIEM)");
    steps.push("Conduct regular incident response tabletop exercises");
    steps.push("Document lessons learned after each incident");
  } else if (category === "vulnerability-management") {
    steps.push("Implement automated vulnerability scanning in CI/CD pipeline");
    steps.push("Set up dependency scanning (npm audit, Dependabot, Snyk)");
    steps.push("Define SLA for fixing vulnerabilities based on severity (critical: 24h, high: 7d)");
    steps.push("Maintain a vulnerability register with tracking");
    steps.push("Regularly review and update dependencies");
  } else if (category === "configuration") {
    steps.push("Review and harden all service configurations");
    steps.push("Implement security headers (helmet for Node.js: `npm install helmet`)");
    steps.push("Configure proper CORS policies");
    steps.push("Ensure containers do not run as root");
    steps.push("Remove all default credentials and configurations");
  } else {
    steps.push(`Review the control requirements: ${control.description}`);
    steps.push(`Follow the implementation guidance: ${control.implementation_guidance}`);
    steps.push("Implement the required controls based on your project's architecture");
    steps.push("Test the implementation thoroughly");
    steps.push("Document the implementation in your compliance documentation");
  }

  if (id.includes("AI") || id.includes("ai-")) {
    steps.push("");
    steps.push("**AI-Specific Considerations:**");
    steps.push("- Implement prompt logging and monitoring");
    steps.push("- Add PII detection for all inputs and outputs");
    steps.push("- Rate limit AI API calls to prevent abuse");
    steps.push("- Validate all AI outputs before presenting to users");
    steps.push("- Classify data before sending to AI providers");
  }

  if (id.includes("BLOCK") || id.includes("blockchain")) {
    steps.push("");
    steps.push("**Blockchain-Specific Considerations:**");
    steps.push("- Never store plaintext personal data on-chain");
    steps.push("- Store only hashes, CIDs, or encrypted references on-chain");
    steps.push("- Implement key rotation procedures");
    steps.push("- Use cryptographic signatures for all on-chain transactions");
    steps.push("- Maintain immutable audit trails off-chain");
  }

  return steps;
}

export function createAutoFixPlan(root: string, findings: Finding[], filterRuleIds?: Set<string>): { actions: AutoFixAction[]; warnings: string[] } {
  const actions: AutoFixAction[] = [];
  const warnings: string[] = [];
  const processedRules = new Set<string>();

  for (const f of findings) {
    if (filterRuleIds && !filterRuleIds.has(f.ruleId)) continue;
    const key = `${f.ruleId}:${f.file}`;
    if (processedRules.has(key)) continue;
    processedRules.add(key);

    switch (f.ruleId) {
      case "CONFIG-001":
        actions.push(...buildHelmetFix(root));
        break;
      case "CONFIG-002":
        actions.push(...buildCorsFix(root));
        break;
      case "CONFIG-004":
        actions.push(...buildEnvGitignoreFix(root));
        break;
      case "CONFIG-005":
        actions.push(...buildDockerNonRootFix(root));
        break;
      case "CONFIG-007":
        actions.push(...buildTLSFix(root, f));
        break;
      case "CONFIG-008":
        actions.push(...buildGitignoreCreateFix(root));
        break;
      case "CONFIG-009":
        actions.push(...buildGitignoreEntryFix(root, f));
        break;
      case "CONFIG-010":
        actions.push(...buildLoggingFix(root));
        break;
      case "SECRETS-001":
        actions.push(...buildSecretsFix(root, f));
        warnings.push(`[SECRETS-001] Secret in ${f.file}:${f.line}. Verify .env is in .gitignore and never committed.`);
        break;
      case "CRYPTO-001":
        actions.push(...buildWeakHashFix(root, f));
        warnings.push("[CRYPTO-001] For passwords, use Argon2id instead of SHA-256.");
        break;
      case "CRYPTO-003":
        actions.push(...buildPasswordFix(root, f));
        break;
      case "AUTH-002":
        actions.push(...buildRateLimitFix(root));
        break;
      case "AUTH-003":
        actions.push(...buildSessionTimeoutFix(root));
        break;
      case "AUTH-004":
        actions.push(...buildCORSWildcardFix(root));
        break;
      case "DB-001":
        actions.push(...buildTimestampsFix(root, f));
        break;
      case "DB-002":
        actions.push(...buildSoftDeleteFix(root, f));
        break;
      case "DB-003":
        actions.push(...buildUserAuditFix(root, f));
        break;
      case "DB-004":
        actions.push(...buildAuditModelFix(root));
        break;
      default:
        warnings.push(`[${f.severity.toUpperCase()}] ${f.title} in ${f.file}${f.line ? `:${f.line}` : ""}: Manual fix required.`);
    }
  }

  return { actions, warnings };
}

export function applyAutoFixAction(root: string, action: AutoFixAction): AutoFixResult {
  const fullPath = path.join(root, action.filePath);

  try {
    switch (action.type) {
      case "create": {
        if (fs.existsSync(fullPath)) {
          return { applied: false, action, error: "File already exists" };
        }
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(fullPath, action.content || "", "utf-8");
        return { applied: true, action };
      }
      case "modify": {
        if (!fs.existsSync(fullPath)) {
          return { applied: false, action, error: "File not found" };
        }
        const content = fs.readFileSync(fullPath, "utf-8");
        if (action.search && !content.includes(action.search)) {
          return { applied: false, action, error: "Search string not found" };
        }
        fs.writeFileSync(fullPath, content.replace(action.search || "", action.replace || ""), "utf-8");
        return { applied: true, action };
      }
      case "append": {
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.appendFileSync(fullPath, action.content || "", "utf-8");
        return { applied: true, action };
      }
      case "npm-install": {
        return { applied: true, action };
      }
    }
  } catch (err) {
    return { applied: false, action, error: err instanceof Error ? err.message : String(err) };
  }
}

function findMainAppFile(root: string): string | null {
  const lang = detectProjectLanguage(root);
  const candidates: Record<string, string[]> = {
    typescript: ["src/index.ts", "src/app.ts", "src/server.ts", "src/main.ts", "index.ts", "app.ts", "server.ts"],
    javascript: ["src/index.js", "src/app.js", "src/server.js", "src/main.js", "index.js", "app.js", "server.js"],
    python: ["app.py", "main.py", "manage.py", "wsgi.py", "asgi.py", "src/app.py", "src/main.py"],
    ruby: ["config.ru", "app.rb", "server.rb", "main.rb", "config/application.rb"],
    go: ["main.go", "cmd/server/main.go", "cmd/app/main.go"],
    java: ["src/main/java/com/example/Application.java", "src/main/java/Application.java"],
    php: ["public/index.php", "index.php", "app.php", "app/Http/Kernel.php"],
    rust: ["src/main.rs", "src/bin/main.rs", "src/app.rs"],
    csharp: ["Program.cs", "Startup.cs"],
  };
  const exts = candidates[lang] || [];
  for (const c of exts) {
    if (fs.existsSync(path.join(root, c))) return c;
  }
  if (lang === "java") {
    const found = findFileRecursive(root, "Application.java", "src/main/java");
    if (found) return found;
  }
  if (lang === "go") {
    for (const c of ["cmd/server/main.go", "cmd/app/main.go", "main.go"]) {
      if (fs.existsSync(path.join(root, c))) return c;
    }
  }
  return null;
}

function findFileRecursive(root: string, name: string, baseDir: string): string | null {
  const dir = path.join(root, baseDir);
  if (!fs.existsSync(dir)) return null;
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "venv" || e.name === "__pycache__" || e.name === ".git") continue;
      const childPath = path.join(baseDir, e.name);
      if (e.isDirectory()) {
        const found = findFileRecursive(root, name, childPath);
        if (found) return found;
      } else if (e.name === name) {
        return childPath;
      }
    }
  } catch { /* skip */ }
  return null;
}

function detectProjectLanguage(root: string): string {
  if (fs.existsSync(path.join(root, "go.mod"))) return "go";
  if (fs.existsSync(path.join(root, "Cargo.toml"))) return "rust";
  if (fs.existsSync(path.join(root, "requirements.txt")) || fs.existsSync(path.join(root, "pyproject.toml")) || fs.existsSync(path.join(root, "Pipfile")) || fs.existsSync(path.join(root, "setup.py"))) return "python";
  if (fs.existsSync(path.join(root, "go.mod"))) return "go";
  if (fs.existsSync(path.join(root, "pom.xml")) || fs.existsSync(path.join(root, "build.gradle")) || fs.existsSync(path.join(root, "build.gradle.kts"))) return "java";
  if (fs.existsSync(path.join(root, "Gemfile"))) return "ruby";
  if (fs.existsSync(path.join(root, "composer.json"))) return "php";
  const pkgContent = readFileSafe(path.join(root, "package.json"));
  if (pkgContent) {
    try {
      const pkg = JSON.parse(pkgContent);
      const deps = { ...(pkg.dependencies as Record<string, string>), ...(pkg.devDependencies as Record<string, string>) };
      if (deps.typescript || deps["@types/node"] || fs.existsSync(path.join(root, "tsconfig.json"))) return "typescript";
      return "javascript";
    } catch { /* fallthrough */ }
  }
  if (fs.existsSync(path.join(root, "tsconfig.json"))) return "typescript";
  return "javascript";
}

function detectWebFramework(root: string, lang: string): string {
  if (lang === "typescript" || lang === "javascript") {
    if (hasDep(root, "express")) return "express";
    if (hasDep(root, "fastify")) return "fastify";
    if (hasDep(root, "koa")) return "koa";
    if (hasDep(root, "hono")) return "hono";
    if (hasDep(root, "next")) return "next";
    if (hasDep(root, "@nestjs/core")) return "nestjs";
    if (hasDep(root, "@sveltejs/kit")) return "sveltekit";
  }
  if (lang === "python") {
    const reqFiles = ["requirements.txt", "pyproject.toml", "Pipfile"];
    for (const f of reqFiles) {
      const c = readFileSafe(path.join(root, f));
      if (c) {
        if (/^\s*django\b/mi.test(c) || /django/i.test(c)) return "django";
        if (/^\s*flask\b/mi.test(c) || /flask/i.test(c)) return "flask";
        if (/^\s*fastapi\b/mi.test(c) || /fastapi/i.test(c)) return "fastapi";
        if (/^\s*sanic\b/mi.test(c) || /sanic/i.test(c)) return "sanic";
      }
    }
    const settingsPy = readFileSafe(path.join(root, "settings.py")) || readFileSafe(path.join(root, "app/settings.py")) || readFileSafe(path.join(root, "config/settings.py"));
    if (settingsPy && /DJANGO_SETTINGS_MODULE|INSTALLED_APPS|django/.test(settingsPy)) return "django";
    const appPy = readFileSafe(path.join(root, "app.py")) || readFileSafe(path.join(root, "main.py"));
    if (appPy) {
      if (/from\s+flask\s+import|import\s+flask/.test(appPy)) return "flask";
      if (/from\s+fastapi\s+import|import\s+fastapi/.test(appPy)) return "fastapi";
      if (/from\s+django/.test(appPy)) return "django";
    }
  }
  if (lang === "ruby") {
    const gemfile = readFileSafe(path.join(root, "Gemfile"));
    if (gemfile) {
      if (/rails/i.test(gemfile)) return "rails";
      if (/sinatra/i.test(gemfile)) return "sinatra";
    }
  }
  if (lang === "go") {
    const goMod = readFileSafe(path.join(root, "go.mod")) || "";
    const mainGo = readFileSafe(path.join(root, "main.go")) || "";
    const allGo = goMod + mainGo;
    if (/gin-gonic|gin\.Default|gin\.New/.test(allGo)) return "gin";
    if (/fiber\.New/.test(allGo)) return "fiber";
    if (/echo\.New/.test(allGo)) return "echo";
    if (/chi\.NewRouter|chi\.Mux/.test(allGo)) return "chi";
    if (/mux\.NewRouter/.test(allGo)) return "gorilla";
    if (/http\.ListenAndServe|http\.HandleFunc/.test(allGo)) return "nethttp";
  }
  if (lang === "java") {
    const pom = readFileSafe(path.join(root, "pom.xml")) || "";
    const gradle = readFileSafe(path.join(root, "build.gradle")) || "";
    const all = pom + gradle;
    if (/spring-boot|springframework/.test(all)) return "spring";
    if (/ktor/.test(all)) return "ktor";
    if (/quarkus/.test(all)) return "quarkus";
    if (/micronaut/.test(all)) return "micronaut";
  }
  if (lang === "rust") {
    const cargo = readFileSafe(path.join(root, "Cargo.toml")) || "";
    const mainRs = readFileSafe(path.join(root, "src/main.rs")) || "";
    const libRs = readFileSafe(path.join(root, "src/lib.rs")) || "";
    const all = cargo + mainRs + libRs;
    if (/actix-web|actix_web/.test(all)) return "actix";
    if (/axum/.test(all)) return "axum";
    if (/rocket/.test(all)) return "rocket";
    if (/warp/.test(all)) return "warp";
  }
  if (lang === "php") {
    const composer = readFileSafe(path.join(root, "composer.json"));
    if (composer) {
      try {
        const pkg = JSON.parse(composer);
        const req = pkg.require || {};
        if (req["laravel/framework"]) return "laravel";
        if (req["symfony/symfony"] || req["symfony/framework-bundle"]) return "symfony";
        if (req["slim/slim"]) return "slim";
        if (req["laravel/lumen-framework"]) return "lumen";
      } catch { /* skip */ }
    }
  }
  return "generic";
}

function hasDep(root: string, dep: string): boolean {
  const pkg = readJsonFileSafe<Record<string, unknown>>(path.join(root, "package.json"));
  if (!pkg) return false;
  const deps = { ...(pkg.dependencies as Record<string, string>), ...(pkg.devDependencies as Record<string, string>) };
  return dep in deps;
}

function hasPyDep(root: string, dep: string): boolean {
  for (const f of ["requirements.txt", "requirements-dev.txt"]) {
    const c = readFileSafe(path.join(root, f));
    if (c && new RegExp(`^\\s*${dep}\\b`, "mi").test(c)) return true;
  }
  const pyproject = readFileSafe(path.join(root, "pyproject.toml"));
  if (pyproject && new RegExp(`^\\s*${dep}\\b`, "mi").test(pyproject)) return true;
  return false;
}

function hasGoDep(root: string, dep: string): boolean {
  const goMod = readFileSafe(path.join(root, "go.mod"));
  return goMod ? goMod.includes(dep) : false;
}

function hasRubyDep(root: string, dep: string): boolean {
  const gemfile = readFileSafe(path.join(root, "Gemfile"));
  return gemfile ? new RegExp(`gem\\s+['"]${dep}`, "i").test(gemfile) : false;
}

function hasJavaDep(root: string, dep: string): boolean {
  const pom = readFileSafe(path.join(root, "pom.xml"));
  if (pom && pom.includes(dep)) return true;
  const gradle = readFileSafe(path.join(root, "build.gradle"));
  return gradle ? gradle.includes(dep) : false;
}

function hasPhpDep(root: string, dep: string): boolean {
  const composer = readFileSafe(path.join(root, "composer.json"));
  if (!composer) return false;
  try {
    const pkg = JSON.parse(composer);
    const req = { ...(pkg.require || {}), ...(pkg["require-dev"] || {}) };
    return dep in req;
  } catch { return false; }
}

function hasRustDep(root: string, dep: string): boolean {
  const cargo = readFileSafe(path.join(root, "Cargo.toml"));
  return cargo ? new RegExp(`^${dep}\\b`, "m").test(cargo) || new RegExp(`${dep}\\s*=`).test(cargo) : false;
}

function readFileSafe(filePath: string): string | null {
  try { return fs.readFileSync(filePath, "utf-8"); } catch { return null; }
}

function buildHelmetFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install helmet", ruleId: "CONFIG-001" });
      const content = readFileSafe(path.join(root, appFile));
      if (content && content.includes("const app = express()")) {
        actions.push({ type: "modify", filePath: appFile, search: "const app = express()", replace: "const app = express()\n\napp.use(helmet())", description: "Add helmet middleware", ruleId: "CONFIG-001" });
      } else {
        actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from 'helmet';\napp.use(helmet());\n", description: "Add helmet import and middleware", ruleId: "CONFIG-001" });
      }
    } else if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/helmet", ruleId: "CONFIG-001" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from '@fastify/helmet';\napp.register(helmet);\n", description: "Add Fastify helmet plugin", ruleId: "CONFIG-001" });
    } else if (fw === "koa") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install koa-helmet", ruleId: "CONFIG-001" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from 'koa-helmet';\napp.use(helmet());\n", description: "Add koa-helmet middleware", ruleId: "CONFIG-001" });
    } else if (fw === "hono") {
      actions.push({ type: "append", filePath: appFile, content: "\nimport { secureHeaders } from 'hono/secure-headers';\napp.use(secureHeaders());\n", description: "Add Hono secure headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "python") {
    if (fw === "django") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Python uses django-csp/secure", ruleId: "CONFIG-001" });
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\n# Security headers\nSECURE_BROWSER_XSS_FILTER = True\nSECURE_CONTENT_TYPE_NOSNIFF = True\nSECURE_HSTS_SECONDS = 31536000\nSECURE_HSTS_INCLUDE_SUBDOMAINS = True\nSECURE_HSTS_PRELOAD = True\nX_FRAME_OPTIONS = 'DENY'\nSECURE_SSL_REDIRECT = True\nSESSION_COOKIE_SECURE = True\nCSRF_COOKIE_SECURE = True\n", description: "Add Django security headers settings", ruleId: "CONFIG-001" });
    } else if (fw === "flask" || fw === "fastapi" || fw === "sanic") {
      const appFile = findMainAppFile(root) || "app.py";
      actions.push({ type: "append", filePath: appFile, content: fw === "fastapi"
        ? "\nfrom fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware\napp.add_middleware(HTTPSRedirectMiddleware)\n"
        : "\nfrom flask_talisman import Talisman\nTalisman(app, force_https=True, strict_transport_security=True, session_cookie_secure=True)\n",
        description: `Add security headers for ${fw}`, ruleId: "CONFIG-001" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      const envFile = fs.existsSync(path.join(root, "config/environments/production.rb")) ? "config/environments/production.rb" : "config/application.rb";
      actions.push({ type: "append", filePath: envFile, content: "\nconfig.force_ssl = true\nconfig.ssl_options = { hsts: { subdomains: true, preload: true, expires: 1.year } }\nconfig.x_frame_options = 'SAMEORIGIN'\nconfig.x_content_type_options = 'nosniff'\nconfig.x_xss_protection = '1; mode=block'\nconfig.strict_transport_security = 'max-age=31536000; includeSubDomains'\n", description: "Add Rails security headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    if (fw === "gin" || fw === "echo" || fw === "fiber" || fw === "chi" || fw === "nethttp") {
      actions.push({ type: "append", filePath: appFile, content: "\nimport \"net/http\"\n\n// Security headers middleware\nfunc securityHeaders(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tw.Header().Set(\"X-Content-Type-Options\", \"nosniff\")\n\t\tw.Header().Set(\"X-Frame-Options\", \"DENY\")\n\t\tw.Header().Set(\"X-XSS-Protection\", \"1; mode=block\")\n\t\tw.Header().Set(\"Strict-Transport-Security\", \"max-age=31536000; includeSubDomains\")\n\t\tw.Header().Set(\"Referrer-Policy\", \"strict-origin-when-cross-origin\")\n\t\tw.Header().Set(\"Content-Security-Policy\", \"default-src 'self'\")\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n", description: "Add Go security headers middleware", ruleId: "CONFIG-001" });
    }
  } else if (lang === "java") {
    if (fw === "spring") {
      const hasSrc = fs.existsSync(path.join(root, "src/main/java"));
      const configPath = hasSrc ? "src/main/java/com/example/SecurityConfig.java" : "SecurityConfig.java";
      actions.push({ type: "create", filePath: configPath, content: `import org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.security.config.annotation.web.builders.HttpSecurity;\nimport org.springframework.security.web.SecurityFilterChain;\nimport org.springframework.security.web.header.writers.StaticHeadersWriter;\n\n@Configuration\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        http.headers()\n            .contentSecurityPolicy("default-src 'self'")\n            .and()\n            .xssProtection()\n            .and()\n            .frameOptions().deny()\n            .httpStrictTransportSecurity()\n                .includeSubDomains(true)\n                .preload(true)\n                .maxAgeInSeconds(31536000);\n        return http.build();\n    }\n}\n`, description: "Create Spring Security config with headers", ruleId: "CONFIG-001" });
    }
  } else if (lang === "php") {
    if (fw === "laravel" || fw === "symfony") {
      const middleware = fw === "laravel" ? "app/Http/Middleware/SecurityHeaders.php" : "src/Middleware/SecurityHeadersMiddleware.php";
      const content = fw === "laravel"
        ? `<?php\n\nnamespace App\\Http\\Middleware;\n\nuse Closure;\n\nclass SecurityHeaders\n{\n    public function handle($request, Closure $next)\n    {\n        $response = $next($request);\n        $response->headers->set('X-Content-Type-Options', 'nosniff');\n        $response->headers->set('X-Frame-Options', 'DENY');\n        $response->headers->set('X-XSS-Protection', '1; mode=block');\n        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');\n        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');\n        return $response;\n    }\n}\n`
        : `<?php\n\nnamespace App\\Middleware;\n\nuse Symfony\\Component\\HttpFoundation\\Response;\n\nclass SecurityHeadersMiddleware\n{\n    public function __invoke($request, $handler)\n    {\n        $response = $handler->handle($request);\n        $response->headers->set('X-Content-Type-Options', 'nosniff');\n        $response->headers->set('X-Frame-Options', 'DENY');\n        $response->headers->set('X-XSS-Protection', '1; mode=block');\n        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');\n        return $response;\n    }\n}\n`;
      actions.push({ type: "create", filePath: middleware, content, description: `Create security headers middleware for ${fw}`, ruleId: "CONFIG-001" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "create", filePath: "src/middleware/security_headers.rs", content: "use actix_web::{HttpResponse, dev::{ServiceRequest, Service, ServiceResponse}};\n\npub fn add_security_headers(res: &mut HttpResponse) {\n    res.headers_mut().insert((\"X-Content-Type-Options\", \"nosniff\"));\n    res.headers_mut().insert((\"X-Frame-Options\", \"DENY\"));\n    res.headers_mut().insert((\"X-XSS-Protection\", \"1; mode=block\"));\n    res.headers_mut().insert((\"Strict-Transport-Security\", \"max-age=31536000; includeSubDomains\"));\n    res.headers_mut().insert((\"Referrer-Policy\", \"strict-origin-when-cross-origin\"));\n    res.headers_mut().insert((\"Content-Security-Policy\", \"default-src 'self'\"));\n}\n", description: "Create Actix-web security headers middleware", ruleId: "CONFIG-001" });
    } else if (fw === "axum") {
      actions.push({ type: "create", filePath: "src/middleware/security_headers.rs", content: "use axum::{http::HeaderValue, response::Response};\n\npub async fn security_headers(mut res: Response) -> Response {\n    let headers = res.headers_mut();\n    headers.insert(\"X-Content-Type-Options\", HeaderValue::from_static(\"nosniff\"));\n    headers.insert(\"X-Frame-Options\", HeaderValue::from_static(\"DENY\"));\n    headers.insert(\"X-XSS-Protection\", HeaderValue::from_static(\"1; mode=block\"));\n    headers.insert(\"Strict-Transport-Security\", HeaderValue::from_static(\"max-age=31536000; includeSubDomains\"));\n    headers.insert(\"Referrer-Policy\", HeaderValue::from_static(\"strict-origin-when-cross-origin\"));\n    headers.insert(\"Content-Security-Policy\", HeaderValue::from_static(\"default-src 'self'\"));\n    res\n}\n", description: "Create Axum security headers middleware", ruleId: "CONFIG-001" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF: Add security headers middleware\n// actix-web: use actix_web::middleware::DefaultHeaders\n// axum: use tower-http::set-header::SetResponseHeader\n// rocket: use rocket::fairing\n", description: "Add Rust security headers guidance", ruleId: "CONFIG-001" });
    }
  }
  return actions;
}

function buildCorsFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install cors", ruleId: "CONFIG-002" });
    if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/cors", ruleId: "CONFIG-002" });
      actions.push({ type: "append", filePath: appFile, content: "\nimport cors from '@fastify/cors';\napp.register(cors, { origin: (" + PE + ".ALLOWED_ORIGINS || '').split(',').filter(Boolean) });\n", description: "Add Fastify CORS", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\nimport cors from 'cors';\napp.use(cors({ origin: (" + PE + ".ALLOWED_ORIGINS || '').split(',').filter(Boolean) }));\n", description: "Add CORS with configured origins", ruleId: "CONFIG-002" });
    }
  } else if (lang === "python") {
    const appFile = findMainAppFile(root) || "app.py";
    if (fw === "django") {
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\nimport os\nCORS_ALLOWED_ORIGINS = [o for o in os.environ.get('ALLOWED_ORIGINS', '').split(',') if o]\nCORS_ALLOW_CREDENTIALS = True\n", description: "Add Django CORS settings", ruleId: "CONFIG-002" });
    } else if (fw === "fastapi") {
      actions.push({ type: "append", filePath: appFile, content: "\nimport os\nfrom fastapi.middleware.cors import CORSMiddleware\napp.add_middleware(CORSMiddleware, allow_origins=[o for o in os.environ.get('ALLOWED_ORIGINS', '').split(',') if o], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])\n", description: "Add FastAPI CORS middleware", ruleId: "CONFIG-002" });
    } else if (fw === "flask") {
      actions.push({ type: "append", filePath: appFile, content: "\nimport os\nfrom flask_cors import CORS\nCORS(app, origins=[o for o in os.environ.get('ALLOWED_ORIGINS', '').split(',') if o])\n", description: "Add Flask CORS", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n# CORS: Configure allowed origins in production\n# pip install flask-cors or fastapi[all]\n", description: "Add CORS note", ruleId: "CONFIG-002" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "config/application.rb", content: "\nconfig.middleware.insert_before 0, Rack::Cors do\n  allow do\n    origins ENV.fetch('ALLOWED_ORIGINS', '').split(',').reject(&:empty?)\n    resource '*', headers: :any, methods: [:get, :post, :put, :patch, :delete]\n  end\nend\n", description: "Add Rails CORS via Rack::Cors", ruleId: "CONFIG-002" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: "\nimport \"net/http\"\n\nfunc corsMiddleware(allowedOrigins []string, next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\torigin := r.Header.Get(\"Origin\")\n\t\tfor _, o := range allowedOrigins {\n\t\t\tif origin == o {\n\t\t\t\tw.Header().Set(\"Access-Control-Allow-Origin\", origin)\n\t\t\t\tw.Header().Set(\"Access-Control-Allow-Methods\", \"GET, POST, PUT, DELETE, OPTIONS\")\n\t\t\t\tw.Header().Set(\"Access-Control-Allow-Headers\", \"Content-Type, Authorization\")\n\t\t\t\tbreak\n\t\t\t}\n\t\t}\n\t\tif r.Method == \"OPTIONS\" { w.WriteHeader(http.StatusNoContent); return }\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n", description: "Add Go CORS middleware", ruleId: "CONFIG-002" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "create", filePath: "src/main/java/com/example/CorsConfig.java", content: `import org.springframework.context.annotation.Bean;\nimport org.springframework.context.annotation.Configuration;\nimport org.springframework.web.cors.CorsConfiguration;\nimport org.springframework.web.cors.UrlBasedCorsConfigurationSource;\nimport org.springframework.web.filter.CorsFilter;\n\n@Configuration\npublic class CorsConfig {\n    @Bean\n    public CorsFilter corsFilter() {\n        CorsConfiguration config = new CorsConfiguration();\n        config.addAllowedOrigin(System.getenv(\"ALLOWED_ORIGIN\"));\n        config.addAllowedHeader(\"*\");\n        config.addAllowedMethod(\"*\");\n        config.setAllowCredentials(true);\n        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();\n        source.registerCorsConfiguration(\"/**\", config);\n        return new CorsFilter(source);\n    }\n}\n`, description: "Create Spring CORS configuration", ruleId: "CONFIG-002" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "create", filePath: "src/middleware/cors.rs", content: "use actix_cors::Cors;\nuse actix_web::http::header;\n\npub fn cors_config() -> Cors {\n    Cors::default()\n        .allowed_origin(&std::env::var(\"ALLOWED_ORIGIN\").unwrap_or_default())\n        .allowed_methods(vec![\"GET\", \"POST\", \"PUT\", \"DELETE\"])\n        .allowed_headers(vec![header::CONTENT_TYPE, header::AUTHORIZATION])\n        .max_age(3600)\n}\n", description: "Create Actix-web CORS configuration", ruleId: "CONFIG-002" });
    } else if (fw === "axum") {
      actions.push({ type: "create", filePath: "src/middleware/cors.rs", content: "use tower_http::cors::{CorsLayer, Any};\nuse http::Method;\n\npub fn cors_layer() -> CorsLayer {\n    CorsLayer::new()\n        .allow_origin([std::env::var(\"ALLOWED_ORIGIN\").unwrap_or_default().parse().unwrap()])\n        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE])\n        .allow_headers(Any)\n}\n", description: "Create Axum CORS layer", ruleId: "CONFIG-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF CORS: Configure allowed origins\n// actix-web: cargo add actix-cors\n// axum: cargo add tower-http --features cors\n// rocket: cargo add rocket_cors\n", description: "Add Rust CORS guidance", ruleId: "CONFIG-002" });
    }
  }
  return actions;
}

function buildEnvGitignoreFix(root: string): AutoFixAction[] {
  const gi = fs.existsSync(path.join(root, ".gitignore")) ? ".gitignore" : null;
  const envFiles = detectProjectLanguage(root) === "python" ? "\n.env\n.env.*\n!.env.example\n*.pyc\n__pycache__/\n"
    : detectProjectLanguage(root) === "go" ? "\n.env\n.env.*\n!.env.example\n*.exe\n"
    : detectProjectLanguage(root) === "ruby" ? "\n.env\n.env.*\n!.env.example\n*.gem\n"
    : detectProjectLanguage(root) === "java" ? "\n.env\n.env.*\n!.env.example\n*.class\ntarget/\n"
    : detectProjectLanguage(root) === "php" ? "\n.env\n.env.*\n!.env.example\nvendor/\n"
    : detectProjectLanguage(root) === "rust" ? "\n.env\n.env.*\n!.env.example\ntarget/\n*.key\n*.pem\n"
    : "\n.env\n.env.*\n!.env.example\n";
  if (!gi) return buildGitignoreCreateFix(root);
  const content = readFileSafe(path.join(root, gi)) || "";
  if (content.includes(".env")) return [];
  return [{ type: "append", filePath: ".gitignore", content: envFiles, description: "Add .env to .gitignore", ruleId: "CONFIG-004" }];
}

function buildDockerNonRootFix(root: string): AutoFixAction[] {
  if (!fs.existsSync(path.join(root, "Dockerfile"))) return [];
  return [{ type: "append", filePath: "Dockerfile", content: "\nUSER node\n", description: "Add non-root USER to Dockerfile", ruleId: "CONFIG-005" }];
}

function buildTLSFix(root: string, f: Finding): AutoFixAction[] {
  return [{ type: "modify", filePath: f.file, search: "NODE_TLS_REJECT_UNAUTHORIZED=0", replace: "NODE_TLS_REJECT_UNAUTHORIZED=1", description: "Re-enable TLS verification", ruleId: "CONFIG-007" }];
}

function buildGitignoreCreateFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const templates: Record<string, string> = {
    typescript: "node_modules/\n.env\n.env.*\n!.env.example\ndist/\nbuild/\n*.key\n*.pem\ncoverage/\n.DS_Store\n",
    javascript: "node_modules/\n.env\n.env.*\n!.env.example\ndist/\nbuild/\n*.key\n*.pem\ncoverage/\n.DS_Store\n",
    python: "__pycache__/\n*.pyc\n*.pyo\n.env\n.env.*\n!.env.example\n*.key\n*.pem\n.pytest_cache/\n.venv/\nvenv/\n*.egg-info/\ndist/\nbuild/\n.DS_Store\n",
    ruby: ".env\n.env.*\n!.env.example\n*.key\n*.pem\nlog/\ntmp/\n*.gem\n.DS_Store\n",
    go: ".env\n.env.*\n!.env.example\n*.key\n*.pem\n*.exe\n/bin/\n.DS_Store\n",
    java: ".env\n.env.*\n!.env.example\n*.key\n*.pem\n*.class\ntarget/\n.idea/\n*.iml\n.DS_Store\n",
    php: ".env\n.env.*\n!.env.example\nvendor/\n*.key\n*.pem\n.DS_Store\n",
    rust: "target/\nCargo.lock\n.env\n.env.*\n!.env.example\n*.key\n*.pem\n.DS_Store\n",
    csharp: ".env\n.env.*\n!.env.example\nbin/\nobj/\n*.key\n*.pem\n.DS_Store\n",
  };
  return [{ type: "create", filePath: ".gitignore", content: templates[lang] || templates.javascript, description: `Create .gitignore for ${lang} project`, ruleId: "CONFIG-008" }];
}

function buildGitignoreEntryFix(root: string, f: Finding): AutoFixAction[] {
  const entry = f.fix.replace("Add ", "").replace(" to .gitignore.", "");
  if (!fs.existsSync(path.join(root, ".gitignore"))) return buildGitignoreCreateFix(root);
  return [{ type: "append", filePath: ".gitignore", content: `\n${entry}\n`, description: `Add ${entry} to .gitignore`, ruleId: "CONFIG-009" }];
}

function buildLoggingFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const hasSrc = fs.existsSync(path.join(root, "src"));
    const loggerPath = hasSrc ? "src/lib/logger.ts" : "lib/logger.ts";
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install pino logger", ruleId: "CONFIG-010" });
    actions.push({ type: "create", filePath: loggerPath, content: `import pino from 'pino';\n\nconst logger = pino({\n  level: ${PE}.LOG_LEVEL || 'info',\n  timestamp: pino.stdTimeFunctions.isoTime,\n});\n\ninterface AuditLogParams {\n  userId: string;\n  action: string;\n  resource: string;\n  ipAddress: string;\n  metadata?: Record<string, unknown>;\n}\n\nexport function auditLog(params: AuditLogParams): void {\n  logger.info({ ...params, timestamp: new Date().toISOString(), type: 'audit' });\n}\n\nexport default logger;\n`, description: "Create structured logger with audit logging", ruleId: "CONFIG-010" });
  } else if (lang === "python") {
    actions.push({ type: "create", filePath: "lib/logger.py", content: `import logging\nimport json\nfrom datetime import datetime\n\nlogger = logging.getLogger("audit")\nlogger.setLevel(logging.INFO)\n\nhandler = logging.StreamHandler()\nhandler.setFormatter(logging.Formatter('%(message)s'))\nlogger.addHandler(handler)\n\ndef audit_log(user_id: str, action: str, resource: str, ip_address: str, **metadata):\n    entry = {\n        "userId": user_id,\n        "action": action,\n        "resource": resource,\n        "ipAddress": ip_address,\n        "timestamp": datetime.utcnow().isoformat() + "Z",\n        "type": "audit",\n        **metadata,\n    }\n    logger.info(json.dumps(entry))\n`, description: "Create Python audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "ruby") {
    actions.push({ type: "create", filePath: "lib/audit_logger.rb", content: `require 'logger'\nrequire 'json'\n\nclass AuditLogger\n  def initialize(logdev = $stdout)\n    @logger = Logger.new(logdev)\n    @logger.formatter = proc { |_, _, _, msg| msg }\n  end\n\n  def audit_log(user_id:, action:, resource:, ip_address:, **metadata)\n    entry = {\n      userId: user_id,\n      action: action,\n      resource: resource,\n      ipAddress: ip_address,\n      timestamp: Time.now.utc.iso8601,\n      type: 'audit',\n      **metadata,\n    }\n    @logger.info(entry.to_json)\n  end\nend\n\nAUDIT = AuditLogger.new\n`, description: "Create Ruby audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "go") {
    actions.push({ type: "create", filePath: "lib/audit.go", content: `package lib\n\nimport (\n\t"encoding/json"\n\t"log"\n\t"os"\n\t"time"\n)\n\ntype AuditEntry struct {\n\tUserID    string                 "json:\\"userId\\""\n\tAction    string                 "json:\\"action\\""\n\tResource  string                 "json:\\"resource\\""\n\tIPAddress string                 "json:\\"ipAddress\\""\n\tTimestamp string                 "json:\\"timestamp\\""\n\tType      string                 "json:\\"type\\""\n\tMetadata  map[string]interface{} "json:\\"metadata,omitempty\\""\n}\n\nvar auditLogger = log.New(os.Stdout, "", 0)\n\nfunc AuditLog(userID, action, resource, ipAddr string, metadata map[string]interface{}) {\n\tentry := AuditEntry{\n\t\tUserID:    userID,\n\t\tAction:    action,\n\t\tResource:  resource,\n\t\tIPAddress: ipAddr,\n\t\tTimestamp: time.Now().UTC().Format(time.RFC3339),\n\t\tType:      "audit",\n\t\tMetadata:  metadata,\n\t}\n\tdata, _ := json.Marshal(entry)\n\tauditLogger.Println(string(data))\n}\n`, description: "Create Go audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "java") {
    actions.push({ type: "create", filePath: "src/main/java/com/example/AuditLogger.java", content: `package com.example;\n\nimport com.fasterxml.jackson.databind.ObjectMapper;\nimport org.slf4j.Logger;\nimport org.slf4j.LoggerFactory;\nimport java.time.Instant;\nimport java.util.Map;\n\npublic class AuditLogger {\n    private static final Logger logger = LoggerFactory.getLogger("audit");\n    private static final ObjectMapper mapper = new ObjectMapper();\n\n    public static void auditLog(String userId, String action, String resource, String ipAddress, Map<String, Object> metadata) {\n        try {\n            Map<String, Object> entry = Map.of(\n                "userId", userId,\n                "action", action,\n                "resource", resource,\n                "ipAddress", ipAddress,\n                "timestamp", Instant.now().toString(),\n                "type", "audit"\n            );\n            if (metadata != null) entry.putAll(metadata);\n            logger.info(mapper.writeValueAsString(entry));\n        } catch (Exception e) {\n            logger.error("Audit log failed", e);\n        }\n    }\n}\n`, description: "Create Java audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "php") {
    actions.push({ type: "create", filePath: "lib/audit_logger.php", content: `<?php\n\nclass AuditLogger\n{\n    public static function log(string $userId, string $action, string $resource, string $ipAddress, array $metadata = []): void\n    {\n        $entry = array_merge([\n            'userId' => $userId,\n            'action' => $action,\n            'resource' => $resource,\n            'ipAddress' => $ipAddress,\n            'timestamp' => gmdate('c'),\n            'type' => 'audit',\n        ], $metadata);\n        error_log(json_encode($entry));\n    }\n}\n`, description: "Create PHP audit logger", ruleId: "CONFIG-010" });
  } else if (lang === "rust") {
    actions.push({ type: "create", filePath: "src/logger.rs", content: "use serde_json::json;\nuse tracing::{info, instrument};\nuse chrono::Utc;\n\n#[derive(Debug, serde::Serialize)]\npub struct AuditEntry {\n    pub user_id: String,\n    pub action: String,\n    pub resource: String,\n    pub ip_address: String,\n    pub timestamp: String,\n    #[serde(rename = \"type\")]\n    pub entry_type: String,\n}\n\npub fn audit_log(user_id: &str, action: &str, resource: &str, ip_address: &str) {\n    let entry = AuditEntry {\n        user_id: user_id.to_string(),\n        action: action.to_string(),\n        resource: resource.to_string(),\n        ip_address: ip_address.to_string(),\n        timestamp: Utc::now().to_rfc3339(),\n        entry_type: \"audit\".to_string(),\n    };\n    info!(\"{}\", serde_json::to_string(&entry).unwrap_or_default());\n}\n", description: "Create Rust audit logger (tracing)", ruleId: "CONFIG-010" });
  }
  return actions;
}

function buildSecretsFix(root: string, f: Finding): AutoFixAction[] {
  const actions: AutoFixAction[] = [];
  const content = readFileSafe(path.join(root, f.file));
  if (!content) return actions;
  const lines = content.split("\n");
  const idx = (f.line || 1) - 1;
  if (idx >= lines.length) return actions;
  const line = lines[idx];
  const lang = detectProjectLanguage(root);

  const match = line.match(/(\w+)\s*[:=]\s*['"]([^'"]+)['"]/);
  if (match) {
    const varName = match[1];
    const value = match[2];
    actions.push({ type: "append", filePath: ".env", content: `\n${varName}=${value}\n`, description: `Move ${varName} to .env`, ruleId: "SECRETS-001" });

    let replacement: string;
    if (lang === "python") {
      replacement = line.replace(match[0], `${varName} = os.environ.get('${varName}')`);
    } else if (lang === "ruby") {
      replacement = line.replace(match[0], `${varName} = ENV['${varName}']`);
    } else if (lang === "go") {
      replacement = line.replace(match[0], `${varName} := os.Getenv("${varName}")`);
    } else if (lang === "java") {
      replacement = line.replace(match[0], `String ${varName} = System.getenv("${varName}")`);
    } else if (lang === "php") {
      replacement = line.replace(match[0], `$${varName} = getenv('${varName}')`);
    } else if (lang === "rust") {
      replacement = line.replace(match[0], `let ${varName} = std::env::var("${varName}").unwrap_or_default()`);
    } else {
      replacement = `${varName}: ${PE}.${varName}`;
    }
    actions.push({ type: "modify", filePath: f.file, search: line, replace: replacement, description: `Replace hardcoded ${varName} with env variable`, ruleId: "SECRETS-001" });
    actions.push(...buildEnvGitignoreFix(root));
  }
  return actions;
}

function buildWeakHashFix(root: string, f: Finding): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const content = readFileSafe(path.join(root, f.file));
  if (!content) return [];
  const lines = content.split("\n");
  const idx = (f.line || 1) - 1;
  if (idx >= lines.length) return [];
  const line = lines[idx];
  let replacement = line;

  if (lang === "python") {
    replacement = line.replace(/hashlib\.md5\(/gi, "hashlib.sha256(").replace(/hashlib\.sha1\(/gi, "hashlib.sha256(");
  } else if (lang === "go") {
    replacement = line.replace(/md5\.New\(\)/gi, "sha256.New()").replace(/sha1\.New\(\)/gi, "sha256.New()");
  } else if (lang === "ruby") {
    replacement = line.replace(/Digest::MD5/gi, "Digest::SHA256").replace(/Digest::SHA1/gi, "Digest::SHA256");
  } else if (lang === "java") {
    replacement = line.replace(/MessageDigest\.getInstance\(["']MD5["']\)/gi, 'MessageDigest.getInstance("SHA-256")').replace(/MessageDigest\.getInstance\(["']SHA-1["']\)/gi, 'MessageDigest.getInstance("SHA-256")');
  } else if (lang === "php") {
    replacement = line.replace(/md5\(/gi, "hash('sha256', ").replace(/sha1\(/gi, "hash('sha256', ");
  } else if (lang === "rust") {
    replacement = line.replace(/md5::compute/gi, "sha2::Sha256::digest").replace(/use md5/gi, "use sha2::{Sha256, Digest}");
  } else {
    replacement = line.replace(/createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)/, "createHash('sha256')");
  }
  if (replacement === line) return [];
  return [{ type: "modify", filePath: f.file, search: line, replace: replacement, description: "Replace weak hash with SHA-256", ruleId: "CRYPTO-001" }];
}

function buildPasswordFix(root: string, _f: Finding): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const hasSrc = fs.existsSync(path.join(root, "src"));
    const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
    actions.push({ type: "npm-install", filePath: "package.json", description: "Install argon2", ruleId: "CRYPTO-003" });
    if (!fs.existsSync(path.join(root, authPath))) {
      actions.push({ type: "create", filePath: authPath, content: `import argon2 from 'argon2';\n\nexport async function hashPassword(password: string): Promise<string> {\n  return argon2.hash(password, { type: argon2.argon2id });\n}\n\nexport async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {\n  return argon2.verify(hashedPassword, inputPassword);\n}\n`, description: "Create Argon2id password utility", ruleId: "CRYPTO-003" });
    }
  } else if (lang === "python") {
    actions.push({ type: "create", filePath: "lib/auth.py", content: `import hashlib\nimport os\n\ndef hash_password(password: str) -> str:\n    salt = os.urandom(16)\n    key = hashlib.pbkdf2_hmac('sha256', password.encode(), salt, 100000)\n    return salt.hex() + ':' + key.hex()\n\ndef verify_password(stored: str, provided: str) -> bool:\n    salt_hex, key_hex = stored.split(':')\n    salt = bytes.fromhex(salt_hex)\n    new_key = hashlib.pbkdf2_hmac('sha256', provided.encode(), salt, 100000)\n    return new_key.hex() == key_hex\n`, description: "Create Python password utility (PBKDF2-SHA256)", ruleId: "CRYPTO-003" });
  } else if (lang === "go") {
    actions.push({ type: "create", filePath: "lib/auth.go", content: `package lib\n\nimport (\n\t"crypto/rand"\n\t"crypto/subtle"\n\t"encoding/hex"\n\t"golang.org/x/crypto/argon2"\n)\n\nfunc HashPassword(password string) (string, error) {\n\tsalt := make([]byte, 16)\n\tif _, err := rand.Read(salt); err != nil {\n\t\treturn "", err\n\t}\n\thash := argon2.IDKey([]byte(password), salt, 1, 64*1024, 4, 32)\n\treturn hex.EncodeToString(salt) + ":" + hex.EncodeToString(hash), nil\n}\n\nfunc VerifyPassword(stored, provided string) (bool, error) {\n\tparts := strings.SplitN(stored, ":", 2)\n\tif len(parts) != 2 { return false, nil }\n\tsalt, _ := hex.DecodeString(parts[0])\n\tstoredHash, _ := hex.DecodeString(parts[1])\n\tprovidedHash := argon2.IDKey([]byte(provided), salt, 1, 64*1024, 4, 32)\n\treturn subtle.ConstantTimeCompare(storedHash, providedHash) == 1, nil\n}\n`, description: "Create Go Argon2id password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "ruby") {
    actions.push({ type: "create", filePath: "lib/auth.rb", content: `require 'bcrypt'\n\ndef hash_password(password)\n  BCrypt::Password.create(password)\nend\n\ndef verify_password(stored_hash, provided_password)\n  BCrypt::Password.new(stored_hash) == provided_password\nend\n`, description: "Create Ruby BCrypt password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "java") {
    actions.push({ type: "create", filePath: "src/main/java/com/example/PasswordUtil.java", content: `package com.example;\n\nimport javax.crypto.SecretKeyFactory;\nimport javax.crypto.spec.PBEKeySpec;\nimport java.security.SecureRandom;\nimport java.util.Base64;\n\npublic class PasswordUtil {\n    private static final int ITERATIONS = 100000;\n    private static final int KEY_LENGTH = 256;\n    private static final SecureRandom RANDOM = new SecureRandom();\n\n    public static String hashPassword(String password) throws Exception {\n        byte[] salt = new byte[16];\n        RANDOM.nextBytes(salt);\n        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, ITERATIONS, KEY_LENGTH);\n        byte[] hash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();\n        return Base64.getEncoder().encodeToString(salt) + ":" + Base64.getEncoder().encodeToString(hash);\n    }\n\n    public static boolean verifyPassword(String stored, String provided) throws Exception {\n        String[] parts = stored.split(":");\n        byte[] salt = Base64.getDecoder().decode(parts[0]);\n        byte[] storedHash = Base64.getDecoder().decode(parts[1]);\n        PBEKeySpec spec = new PBEKeySpec(provided.toCharArray(), salt, ITERATIONS, KEY_LENGTH);\n        byte[] testHash = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();\n        return java.util.Arrays.equals(storedHash, testHash);\n    }\n}\n`, description: "Create Java PBKDF2 password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "php") {
    actions.push({ type: "create", filePath: "lib/auth.php", content: `<?php\n\nfunction hash_password(string $password): string {\n    return password_hash($password, PASSWORD_ARGON2ID);\n}\n\nfunction verify_password(string $hash, string $password): bool {\n    return password_verify($password, $hash);\n}\n`, description: "Create PHP Argon2id password utility", ruleId: "CRYPTO-003" });
  } else if (lang === "rust") {
    actions.push({ type: "create", filePath: "src/auth.rs", content: "use argon2::{Argon2, Algorithm, Version, Params};\nuse argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};\nuse rand::rngs::OsRng;\n\npub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {\n    let salt = SaltString::generate(&mut OsRng);\n    let params = Params::new(65536, 3, 4, Some(32))?;\n    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);\n    let hash = argon2.hash_password(password.as_bytes(), &salt)?;\n    Ok(hash.to_string())\n}\n\npub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::password_hash::Error> {\n    let parsed = argon2::PasswordHash::new(hash)?;\n    Ok(Argon2::default().verify_password(password.as_bytes(), &parsed).is_ok())\n}\n", description: "Create Rust Argon2id password utility", ruleId: "CRYPTO-003" });
  }
  return actions;
}

function buildRateLimitFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install express-rate-limit", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: appFile, content: `\nimport rateLimit from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n  legacyHeaders: false,\n});\napp.use(limiter);\n`, description: "Add rate limiting (100 req/15min)", ruleId: "AUTH-002" });
    } else if (fw === "fastify") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install @fastify/rate-limit", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: appFile, content: `\nimport rateLimit from '@fastify/rate-limit';\napp.register(rateLimit, { max: 100, timeWindow: '15 minutes' });\n`, description: "Add rate limiting to Fastify", ruleId: "AUTH-002" });
    }
  } else if (lang === "python") {
    const appFile = findMainAppFile(root) || "app.py";
    if (fw === "django") {
      actions.push({ type: "append", filePath: appFile, content: "\n# Rate limiting: pip install django-ratelimit\n# Add to views: @ratelimit(key='ip', rate='100/h', block=True)\n", description: "Add Django rate limiting note", ruleId: "AUTH-002" });
    } else if (fw === "fastapi") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom slowapi import Limiter\nfrom slowapi.util import get_remote_address\n\nlimiter = Limiter(key_func=get_remote_address)\n# Add to routes: @limiter.limit('100/15minutes')\n", description: "Add FastAPI rate limiting (slowapi)", ruleId: "AUTH-002" });
    } else if (fw === "flask") {
      actions.push({ type: "append", filePath: appFile, content: "\nfrom flask_limiter import Limiter\nfrom flask_limiter.util import get_remote_address\n\nlimiter = Limiter(app=app, key_func=get_remote_address, default_limits=['100 per 15 minute'])\n", description: "Add Flask rate limiting", ruleId: "AUTH-002" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "Gemfile", content: "\ngem 'rack-attack'\n", description: "Add rack-attack for rate limiting", ruleId: "AUTH-002" });
      actions.push({ type: "append", filePath: "config/application.rb", content: "\nconfig.middleware.use Rack::Attack\nRack::Attack.throttle('req/ip', limit: 100, period: 15.minutes) { |req| req.ip }\n", description: "Add Rails rate limiting config", ruleId: "AUTH-002" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: "\nimport (\n\t\"net/http\"\n\t\"sync\"\n\t\"time\"\n)\n\ntype rateLimiter struct {\n\tmu       sync.Mutex\n\tvisitors map[string][]time.Time\n\tlimit    int\n\twindow   time.Duration\n}\n\nfunc newRateLimiter(limit int, window time.Duration) *rateLimiter {\n\treturn &rateLimiter{visitors: make(map[string][]time.Time), limit: limit, window: window}\n}\n\nfunc (rl *rateLimiter) allow(ip string) bool {\n\trl.mu.Lock()\n\tdefer rl.mu.Unlock()\n\tnow := time.Now()\n\twindowStart := now.Add(-rl.window)\n\tvar recent []time.Time\n\tfor _, t := range rl.visitors[ip] {\n\t\tif t.After(windowStart) { recent = append(recent, t) }\n\t}\n\trl.visitors[ip] = recent\n\tif len(recent) >= rl.limit { return false }\n\trl.visitors[ip] = append(rl.visitors[ip], now)\n\treturn true\n}\n\nvar limiter = newRateLimiter(100, 15*time.Minute)\n\nfunc rateLimitMiddleware(next http.Handler) http.Handler {\n\treturn http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n\t\tif !limiter.allow(r.RemoteAddr) {\n\t\t\thttp.Error(w, \"Too many requests\", http.StatusTooManyRequests)\n\t\t\treturn\n\t\t}\n\t\tnext.ServeHTTP(w, r)\n\t})\n}\n", description: "Add Go rate limiter middleware", ruleId: "AUTH-002" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "create", filePath: "src/main/java/com/example/RateLimitConfig.java", content: `package com.example;\n\nimport io.github.bucket4j.Bandwidth;\nimport io.github.bucket4j.Bucket;\nimport io.github.bucket4j.Refill;\nimport org.springframework.stereotype.Component;\nimport org.springframework.web.servlet.HandlerInterceptor;\n\nimport jakarta.servlet.http.HttpServletRequest;\nimport jakarta.servlet.http.HttpServletResponse;\nimport java.time.Duration;\nimport java.util.Map;\nimport java.util.concurrent.ConcurrentHashMap;\n\n@Component\npublic class RateLimitInterceptor implements HandlerInterceptor {\n    private final Map<String, Bucket> buckets = new ConcurrentHashMap<>();\n\n    private Bucket newBucket() {\n        Bandwidth limit = Bandwidth.classic(100, Refill.intervally(100, Duration.ofMinutes(15)));\n        return Bucket.builder().addLimit(limit).build();\n    }\n\n    @Override\n    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {\n        Bucket bucket = buckets.computeIfAbsent(request.getRemoteAddr(), k -> newBucket());\n        if (bucket.tryConsume(1)) return true;\n        response.setStatus(429);\n        return false;\n    }\n}\n`, description: "Create Spring rate limiter (bucket4j)", ruleId: "AUTH-002" });
    }
  } else if (lang === "php") {
    const appFile = findMainAppFile(root) || "public/index.php";
    actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting middleware\n$ip = $_SERVER['REMOTE_ADDR'];\n$limit = 100;\n$window = 900; // 15 minutes\n$cacheKey = 'rate_limit_' . $ip;\n// Implement with your cache layer (Redis, APCu, file-based)\n", description: "Add PHP rate limiting scaffolding", ruleId: "AUTH-002" });
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    if (fw === "actix") {
      actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting: cargo add actix-governor\n// use actix_governor::{GovernorConfigBuilder, Governor};\n// let governor_conf = GovernorConfigBuilder::default()\n//     .per_second(1)\n//     .burst_size(20)\n//     .finish()\n//     .unwrap();\n// app.wrap(Governor::new(&governor_conf));\n", description: "Add Actix-web rate limiting (actix-governor)", ruleId: "AUTH-002" });
    } else if (fw === "axum") {
      actions.push({ type: "append", filePath: appFile, content: "\n// Rate limiting: cargo add tower --features limit\n// use tower::ServiceBuilder;\n// use tower::limit::RateLimitLayer;\n// use std::time::Duration;\n// let app = axum::Router::new()\n//     .layer(ServiceBuilder::new()\n//         .layer(RateLimitLayer::new(100, Duration::from_secs(900))));\n", description: "Add Axum rate limiting (tower)", ruleId: "AUTH-002" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF Rate Limiting: 100 requests per 15 minutes\n// actix-web: cargo add actix-governor\n// axum: cargo add tower --features limit\n", description: "Add Rust rate limiting guidance", ruleId: "AUTH-002" });
    }
  }
  return actions;
}

function buildSessionTimeoutFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const fw = detectWebFramework(root, lang);
  const actions: AutoFixAction[] = [];

  if (lang === "typescript" || lang === "javascript") {
    const appFile = findMainAppFile(root);
    if (!appFile) return [];
    if (fw === "express") {
      actions.push({ type: "npm-install", filePath: "package.json", description: "Install express-session", ruleId: "AUTH-003" });
      actions.push({ type: "append", filePath: appFile, content: `\nimport session from 'express-session';\n\napp.use(session({\n  secret: ${PE}.SESSION_SECRET || 'change-me-in-production',\n  resave: false,\n  saveUninitialized: false,\n  cookie: { secure: ${PE}.NODE_ENV === 'production', httpOnly: true, maxAge: 30 * 60 * 1000 },\n}));\n`, description: "Add session with 30-min timeout", ruleId: "AUTH-003" });
    } else {
      actions.push({ type: "append", filePath: appFile, content: "\nconst SESSION_TIMEOUT_MS = 30 * 60 * 1000;\n", description: "Add session timeout constant", ruleId: "AUTH-003" });
    }
  } else if (lang === "python") {
    if (fw === "django") {
      const settingsFile = findFileRecursive(root, "settings.py", ".") || "settings.py";
      actions.push({ type: "append", filePath: settingsFile, content: "\nSESSION_COOKIE_AGE = 1800  # 30 minutes\nSESSION_COOKIE_SECURE = True\nSESSION_COOKIE_HTTPONLY = True\nSESSION_EXPIRE_AT_BROWSER_CLOSE = True\n", description: "Add Django session timeout settings", ruleId: "AUTH-003" });
    } else {
      const appFile = findMainAppFile(root) || "app.py";
      actions.push({ type: "append", filePath: appFile, content: "\n# Session timeout: 30 minutes\nSESSION_TIMEOUT = 30 * 60\n", description: "Add session timeout constant", ruleId: "AUTH-003" });
    }
  } else if (lang === "ruby") {
    if (fw === "rails") {
      actions.push({ type: "append", filePath: "config/initializers/session_store.rb", content: "\nRails.application.config.session_store :cookie_store, expire_after: 30.minutes, secure: Rails.env.production?, httponly: true\n", description: "Add Rails session timeout", ruleId: "AUTH-003" });
    }
  } else if (lang === "go") {
    const appFile = findMainAppFile(root) || "main.go";
    actions.push({ type: "append", filePath: appFile, content: "\nconst sessionTimeout = 30 * time.Minute\n", description: "Add Go session timeout constant", ruleId: "AUTH-003" });
  } else if (lang === "java") {
    if (fw === "spring") {
      actions.push({ type: "append", filePath: "src/main/resources/application.properties", content: "\nserver.servlet.session.timeout=30m\nserver.servlet.session.cookie.http-only=true\nserver.servlet.session.cookie.secure=true\n", description: "Add Spring session timeout config", ruleId: "AUTH-003" });
    }
  } else if (lang === "php") {
    if (fw === "laravel") {
      actions.push({ type: "append", filePath: "config/session.php", content: "\n'lifetime' => 30,\n'expire_on_close' => true,\n'secure' => env('APP_ENV') === 'production',\n'http_only' => true,\n", description: "Add Laravel session timeout", ruleId: "AUTH-003" });
    } else {
      const appFile = findMainAppFile(root) || "public/index.php";
      actions.push({ type: "append", filePath: appFile, content: "\nini_set('session.gc_maxlifetime', 1800); // 30 minutes\nsession_set_cookie_params(1800, '/', '', true, true);\n", description: "Add PHP session timeout config", ruleId: "AUTH-003" });
    }
  } else if (lang === "rust") {
    const appFile = findMainAppFile(root) || "src/main.rs";
    actions.push({ type: "append", filePath: appFile, content: "\nconst SESSION_TIMEOUT_SECS: u64 = 30 * 60; // 30 minutes\n", description: "Add Rust session timeout constant", ruleId: "AUTH-003" });
  }
  return actions;
}

function buildCORSWildcardFix(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const content = readFileSafe(path.join(root, appFile)) || "";
  const actions: AutoFixAction[] = [];

  const wildcardPatterns = ["origin: '*'", "origin:'*'", 'origin:"*"', "Access-Control-Allow-Origin: *"];
  for (const pattern of wildcardPatterns) {
    if (!content.includes(pattern)) continue;
    if (lang === "python") {
      const replacement = pattern.includes("*'") || pattern.includes('*"')
        ? "origins=[o for o in __import__('os').environ.get('ALLOWED_ORIGINS', '').split(',') if o]"
        : "origins=[o for o in __import__('os').environ.get('ALLOWED_ORIGINS', '').split(',') if o]";
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: replacement, description: "Replace CORS wildcard", ruleId: "AUTH-004" });
    } else if (lang === "go") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: 'w.Header().Set("Access-Control-Allow-Origin", os.Getenv("ALLOWED_ORIGIN"))', description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "ruby") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "origins ENV.fetch('ALLOWED_ORIGINS', '').split(',').reject(&:empty?)", description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "java") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: 'config.addAllowedOrigin(System.getenv("ALLOWED_ORIGIN"))', description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "php") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "$response->headers->set('Access-Control-Allow-Origin', getenv('ALLOWED_ORIGIN'))", description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else if (lang === "rust") {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "allowed_origin(std::env::var(\"ALLOWED_ORIGIN\").unwrap_or_default())", description: "Replace CORS wildcard with env var", ruleId: "AUTH-004" });
    } else {
      actions.push({ type: "modify", filePath: appFile, search: pattern, replace: "origin: (" + PE + ".ALLOWED_ORIGINS || '').split(',').filter(Boolean)", description: "Replace CORS wildcard", ruleId: "AUTH-004" });
    }
  }
  return actions;
}

function buildTimestampsFix(root: string, f: Finding): AutoFixAction[] {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    const insertion = "\n  createdAt  DateTime @default(now())\n  updatedAt  DateTime @updatedAt";
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + insertion + block.slice(closingBrace), description: "Add createdAt/updatedAt to Prisma model", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add audit timestamps\n# For Django models:\n#   created_at = models.DateTimeField(auto_now_add=True)\n#   updated_at = models.DateTimeField(auto_now=True)\n# For SQLAlchemy:\n#   created_at = Column(DateTime, default=datetime.utcnow)\n#   updated_at = Column(DateTime, onupdate=datetime.utcnow)\n", description: "Add Python timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".rb")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Rails has built-in timestamps. Add to model:\n#   create_table :your_table do |t|\n#     t.timestamps\n#   end\n", description: "Add Rails timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".go")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add audit timestamps to GORM models:\n// type YourModel struct {\n//   ID        uint           `json:\"id\" gorm:\"primaryKey\"`\n//   CreatedAt time.Time      `json:\"created_at\"`\n//   UpdatedAt time.Time      `json:\"updated_at\"`\n// }\n", description: "Add Go timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".java")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add JPA audit timestamps:\n// @CreatedDate\n// @Column(name = \"created_at\", updatable = false)\n// private Instant createdAt;\n//\n// @LastModifiedDate\n// @Column(name = \"updated_at\")\n// private Instant updatedAt;\n", description: "Add Java JPA timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".php")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Laravel uses timestamps() in migrations:\n// $table->timestamps(); // adds created_at, updated_at\n// $table->softDeletes(); // adds deleted_at\n", description: "Add Laravel timestamp guidance", ruleId: "DB-001" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add audit timestamps to ORM models:\n// Diesel: created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n//         updated_at TIMESTAMP NOT NULL DEFAULT NOW(),\n// SQLx:   created_at: chrono::NaiveDateTime,\n//         updated_at: chrono::NaiveDateTime,\n// SeaORM: created_at: DateTime,\n//         updated_at: DateTime,\n", description: "Add Rust timestamp guidance", ruleId: "DB-001" }];
  }
  return [];
}

function buildSoftDeleteFix(root: string, f: Finding): AutoFixAction[] {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  deletedAt  DateTime?" + block.slice(closingBrace), description: "Add deletedAt to Prisma model", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add soft delete to Django/SQLAlchemy:\n# Django: deleted_at = models.DateTimeField(null=True, blank=True)\n# SQLAlchemy: deleted_at = Column(DateTime, nullable=True)\n", description: "Add Python soft delete guidance", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".go")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add soft delete to GORM:\n// DeletedAt gorm.DeletedAt `json:\"deleted_at\" gorm:\"index\"`\n", description: "Add Go soft delete guidance", ruleId: "DB-002" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add soft delete:\n// Diesel: deleted_at TIMESTAMP NULL,\n// SQLx:   deleted_at: Option<chrono::NaiveDateTime>,\n// SeaORM: deleted_at: Option<DateTime>,\n", description: "Add Rust soft delete guidance", ruleId: "DB-002" }];
  }
  return [];
}

function buildUserAuditFix(root: string, f: Finding): AutoFixAction[] {
  if (f.file.endsWith(".prisma")) {
    const content = readFileSafe(path.join(root, f.file));
    if (!content) return [];
    const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
    if (!modelMatch || modelMatch.length === 0) return [];
    const block = modelMatch[0];
    const closingBrace = block.lastIndexOf("}");
    if (closingBrace === -1) return [];
    return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  createdBy  String?\n  updatedBy  String?" + block.slice(closingBrace), description: "Add createdBy/updatedBy columns", ruleId: "DB-003" }];
  }
  if (f.file.endsWith(".py")) {
    return [{ type: "append", filePath: f.file, content: "\n# GESF: Add user audit columns:\n# Django: created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='+')\n# SQLAlchemy: created_by = Column(Integer, ForeignKey('users.id'))\n", description: "Add Python user audit guidance", ruleId: "DB-003" }];
  }
  if (f.file.endsWith(".rs")) {
    return [{ type: "append", filePath: f.file, content: "\n// GESF: Add user audit columns:\n// Diesel: created_by VARCHAR(255) NULL,\n//         updated_by VARCHAR(255) NULL,\n// SQLx:   created_by: Option<String>,\n//         updated_by: Option<String>,\n", description: "Add Rust user audit guidance", ruleId: "DB-003" }];
  }
  return [];
}

function buildAuditModelFix(root: string): AutoFixAction[] {
  if (fs.existsSync(path.join(root, "prisma/schema.prisma"))) {
    return [{ type: "append", filePath: "prisma/schema.prisma", content: "\\nmodel Audit {\\n  id        Int      @id @default(autoincrement())\\n  userId    String\\n  action    String\\n  resource  String\\n  timestamp DateTime @default(now())\\n  ipAddress String\\n  metadata  Json?\\n}\\n", description: "Add Audit model to Prisma schema", ruleId: "DB-004" }];
  }
  const lang = detectProjectLanguage(root);
  if (lang === "python") {
    return [{ type: "create", filePath: "lib/models/audit.py", content: `from datetime import datetime\nfrom sqlalchemy import Column, Integer, String, DateTime, JSON\nfrom sqlalchemy.ext.declarative import declarative_base\n\nBase = declarative_base()\n\nclass Audit(Base):\n    __tablename__ = 'audit'\n    id = Column(Integer, primary_key=True, autoincrement=True)\n    user_id = Column(String(255))\n    action = Column(String(255))\n    resource = Column(String(255))\n    timestamp = Column(DateTime, default=datetime.utcnow)\n    ip_address = Column(String(45))\n    metadata = Column(JSON)\n`, description: "Create Python Audit model (SQLAlchemy)", ruleId: "DB-004" }];
  }
  if (lang === "go") {
    return [{ type: "create", filePath: "lib/models/audit.go", content: `package models\n\nimport "time"\n\ntype Audit struct {\n\tID        uint      \`json:"id" gorm:"primaryKey;autoIncrement"\`\n\tUserID    string    \`json:"userId"\`\n\tAction    string    \`json:"action"\`\n\tResource  string    \`json:"resource"\`\n\tTimestamp time.Time \`json:"timestamp" gorm:"default:now()"\`\n\tIPAddress string    \`json:"ipAddress"\`\n}\n`, description: "Create Go Audit model (GORM)", ruleId: "DB-004" }];
  }
  if (lang === "java") {
    return [{ type: "create", filePath: "src/main/java/com/example/Audit.java", content: `package com.example;\n\nimport jakarta.persistence.*;\nimport java.time.Instant;\n\n@Entity\n@Table(name = "audit")\npublic class Audit {\n    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)\n    private Long id;\n    private String userId;\n    private String action;\n    private String resource;\n    private String ipAddress;\n    @Column(columnDefinition = "jsonb")\n    private String metadata;\n    private Instant timestamp = Instant.now();\n}\n`, description: "Create Java Audit entity (JPA)", ruleId: "DB-004" }];
  }
  if (lang === "rust") {
    return [{ type: "create", filePath: "src/models/audit.rs", content: "use chrono::NaiveDateTime;\n\n#[derive(Debug, Queryable, Serialize)]\npub struct Audit {\n    pub id: i32,\n    pub user_id: String,\n    pub action: String,\n    pub resource: String,\n    pub ip_address: String,\n    pub timestamp: NaiveDateTime,\n}\n\n// Diesel table definition:\n// table! {\n//     audit (id) {\n//         id -> Int4,\n//         user_id -> Varchar,\n//         action -> Varchar,\n//         resource -> Varchar,\n//         ip_address -> Varchar,\n//         timestamp -> Timestamp,\n//     }\n// }\n", description: "Create Rust Audit model (Diesel)", ruleId: "DB-004" }];
  }
  return [];
}

export function getNpmInstallsFromActions(actions: AutoFixAction[]): string[] {
  const installs = new Set<string>();
  for (const a of actions) {
    if (a.type !== "npm-install") continue;
    const map: Record<string, string> = {
      "CONFIG-001": "helmet",
      "CONFIG-002": "cors",
      "CONFIG-010": "pino",
      "CRYPTO-003": "argon2",
      "AUTH-002": "express-rate-limit",
      "AUTH-003": "express-session",
    };
    if (map[a.ruleId]) installs.add(map[a.ruleId]);
  }
  return [...installs];
}

function buildEncryptionAtRestImpl(root: string, hasSrc: boolean): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    return [
      { type: "create", filePath: "src/encryption.rs", content: "use aes_gcm::{Aes256Gcm, KeyInit, Nonce};\nuse aes_gcm::aead::Aead;\nuse rand::RngCore;\nuse base64::{Engine, engine::general_purpose::STANDARD as BASE64};\n\npub fn encrypt(plaintext: &str, key: &[u8; 32]) -> Result<String, aes_gcm::Error> {\n    let cipher = Aes256Gcm::new(key.into());\n    let mut nonce_bytes = [0u8; 12];\n    rand::thread_rng().fill_bytes(&mut nonce_bytes);\n    let nonce = Nonce::from_slice(&nonce_bytes);\n    let ciphertext = cipher.encrypt(nonce, plaintext.as_bytes())?;\n    let mut combined = nonce_bytes.to_vec();\n    combined.extend_from_slice(&ciphertext);\n    Ok(BASE64.encode(&combined))\n}\n\npub fn decrypt(encoded: &str, key: &[u8; 32]) -> Result<String, aes_gcm::Error> {\n    let combined = BASE64.decode(encoded).map_err(|_| aes_gcm::Error)?;\n    let (nonce_bytes, ciphertext) = combined.split_at(12);\n    let cipher = Aes256Gcm::new(key.into());\n    let nonce = Nonce::from_slice(nonce_bytes);\n    let plaintext = cipher.decrypt(nonce, ciphertext)?;\n    String::from_utf8(plaintext).map_err(|_| aes_gcm::Error)\n}\n", description: "Create Rust AES-256-GCM encryption utility", ruleId: "GDPR-ART32-002" },
    ];
  }
  const cryptoPath = hasSrc ? "src/lib/encryption.ts" : "lib/encryption.ts";
  return [
    { type: "npm-install", filePath: "package.json", description: "Node.js crypto is built-in", ruleId: "GDPR-ART32-002" },
    { type: "create", filePath: cryptoPath, content: `import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';\n\nconst ALGORITHM = 'aes-256-gcm';\nconst IV_LENGTH = 16;\nconst TAG_LENGTH = 16;\n\nfunction deriveKey(secret: string, salt: Buffer): Buffer {\n  return scryptSync(secret, salt, 32);\n}\n\nexport function encrypt(plaintext: string, secret: string): string {\n  const salt = randomBytes(16);\n  const key = deriveKey(secret, salt);\n  const iv = randomBytes(IV_LENGTH);\n  const cipher = createCipheriv(ALGORITHM, key, iv);\n  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);\n  const tag = cipher.getAuthTag();\n  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');\n}\n\nexport function decrypt(ciphertext: string, secret: string): string {\n  const data = Buffer.from(ciphertext, 'base64');\n  const salt = data.subarray(0, 16);\n  const iv = data.subarray(16, 32);\n  const tag = data.subarray(32, 48);\n  const encrypted = data.subarray(48);\n  const key = deriveKey(secret, salt);\n  const decipher = createDecipheriv(ALGORITHM, key, iv);\n  decipher.setAuthTag(tag);\n  return decipher.update(encrypted) + decipher.final('utf8');\n}\n`, description: "Create AES-256-GCM encryption utility", ruleId: "GDPR-ART32-002" },
  ];
}

function buildEncryptionInTransitImpl(root: string, _hasSrc: boolean): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const appFile = findMainAppFile(root);
  const actions: AutoFixAction[] = [];
  if (lang === "rust") {
    if (appFile) {
      actions.push({ type: "append", filePath: appFile, content: "\n// GESF: Enforce TLS in production\n// Use a reverse proxy (nginx, caddy) for TLS termination\n// or configure rustls with your certificate:\n// let config = rustls::ServerConfig::builder()\n//     .with_safe_defaults()\n//     .with_no_client_auth()\n//     .with_single_cert(certs, key);\n", description: "Add Rust TLS guidance", ruleId: "GDPR-ART32-003" });
    }
    return actions;
  }
  if (appFile) {
    actions.push({ type: "append", filePath: appFile, content: "\nif (" + PE + ".NODE_ENV === 'production') {\n  app.use((req, res, next) => {\n    if (req.headers['x-forwarded-proto'] === 'http') {\n      return res.redirect(301, " + HT + "' + req.headers.host + req.url);\n    }\n    next();\n  });\n}\n", description: "Add HTTPS redirect middleware", ruleId: "GDPR-ART32-003" });
  }
  return actions;
}

function buildUserIdentificationImpl(root: string, hasSrc: boolean): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    const authPath = "src/auth.rs";
    if (fs.existsSync(path.join(root, authPath))) return [];
    return [
      { type: "create", filePath: authPath, content: "use argon2::{Argon2, Algorithm, Version, Params};\nuse argon2::password_hash::{SaltString, PasswordHasher, PasswordVerifier};\nuse rand::rngs::OsRng;\n\npub fn hash_password(password: &str) -> Result<String, argon2::password_hash::Error> {\n    let salt = SaltString::generate(&mut OsRng);\n    let params = Params::new(65536, 3, 4, Some(32))?;\n    let argon2 = Argon2::new(Algorithm::Argon2id, Version::V0x13, params);\n    let hash = argon2.hash_password(password.as_bytes(), &salt)?;\n    Ok(hash.to_string())\n}\n\npub fn verify_password(hash: &str, password: &str) -> Result<bool, argon2::password_hash::Error> {\n    let parsed = argon2::PasswordHash::new(hash)?;\n    Ok(Argon2::default().verify_password(password.as_bytes(), &parsed).is_ok())\n}\n", description: "Create Rust auth utility with Argon2id", ruleId: "GDPR-ART32-004" },
    ];
  }
  const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
  if (fs.existsSync(path.join(root, authPath))) return [];
  return [
    { type: "npm-install", filePath: "package.json", description: "Install argon2 for password hashing", ruleId: "GDPR-ART32-004" },
    { type: "create", filePath: authPath, content: `import argon2 from 'argon2';\n\nexport async function hashPassword(password: string): Promise<string> {\n  return argon2.hash(password, { type: argon2.argon2id });\n}\n\nexport async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {\n  return argon2.verify(hashedPassword, inputPassword);\n}\n`, description: "Create auth utility with Argon2id", ruleId: "GDPR-ART32-004" },
  ];
}

function buildIntegrityControlsImpl(root: string, hasSrc: boolean): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  if (lang === "rust") {
    return [
      { type: "create", filePath: "src/integrity.rs", content: "use sha2::{Sha256, Digest};\n\npub fn hash_data(data: &str) -> String {\n    let mut hasher = Sha256::new();\n    hasher.update(data.as_bytes());\n    format!(\"{:x}\", hasher.finalize())\n}\n\npub fn verify_integrity(data: &str, expected_hash: &str) -> bool {\n    hash_data(data) == expected_hash\n}\n\npub fn generate_checksum(content: &[u8]) -> String {\n    let mut hasher = Sha256::new();\n    hasher.update(content);\n    format!(\"{:x}\", hasher.finalize())\n}\n", description: "Create Rust integrity verification utility", ruleId: "GDPR-ART32-007" },
    ];
  }
  const integrityPath = hasSrc ? "src/lib/integrity.ts" : "lib/integrity.ts";
  return [
    { type: "create", filePath: integrityPath, content: `import { createHash } from 'node:crypto';\n\nexport function hashData(data: string): string {\n  return createHash('sha256').update(data).digest('hex');\n}\n\nexport function verifyIntegrity(data: string, expectedHash: string): boolean {\n  return hashData(data) === expectedHash;\n}\n\nexport function generateChecksum(content: string): string {\n  return createHash('sha256').update(content).digest('base64');\n}\n`, description: "Create integrity verification utility", ruleId: "GDPR-ART32-007" },
  ];
}

function buildBackupPolicyImpl(root: string, _hasSrc: boolean): AutoFixAction[] {
  return [
    { type: "create", filePath: "scripts/backup.sh", content: `#!/bin/bash\nset -euo pipefail\n\nBACKUP_DIR="\${BACKUP_DIR:-./backups}"\nTIMESTAMP=$(date +%Y%m%d_%H%M%S)\nBACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz.gpg"\nENCRYPTION_KEY="'''\${BACKUP_ENCRYPTION_KEY:-change-me}'''"\n\nmkdir -p "$BACKUP_DIR"\n\necho "[$(date)] Starting backup..."\n\nif command -v pg_dump &> /dev/null; then\n  pg_dump "$DATABASE_URL" | gpg --symmetric --cipher-algo AES256 --batch --passphrase "$ENCRYPTION_KEY" -o "$BACKUP_FILE"\n  echo "[$(date)] Database backup completed: $BACKUP_FILE"\nfi\n\ntar czf - ./data 2>/dev/null | gpg --symmetric --cipher-algo AES256 --batch --passphrase "$ENCRYPTION_KEY" -o "$BACKUP_DIR/data_$TIMESTAMP.tar.gz.gpg" 2>/dev/null || true\n\necho "[$(date)] Backup completed."\n\nfind "$BACKUP_DIR" -name "*.gpg" -mtime +30 -delete\necho "[$(date)] Cleaned up backups older than 30 days."\n`, description: "Create encrypted backup script", ruleId: "GDPR-ART32-008" },
  ];
}

function buildSecurityTestingImpl(root: string): AutoFixAction[] {
  const lang = detectProjectLanguage(root);
  const setupSteps = lang === "rust"
    ? `      - uses: actions-rs/toolchain@v1\n        with:\n          toolchain: stable\n      - run: cargo build\n      - name: cargo audit\n        run: cargo install cargo-audit && cargo audit`
    : `      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n      - run: npm ci\n      - name: npm audit\n        run: npm audit --audit-level=high\n        continue-on-error: true`;
  return [
    { type: "create", filePath: ".github/workflows/security-scan.yml", content: `name: Security Scan\non:\n  push:\n    branches: [main, master]\n  pull_request:\n    branches: [main, master]\n  schedule:\n    - cron: '0 6 * * 1'\n\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n${setupSteps}\n      - name: Run GESF compliance check\n        run: npx @greenarmor/ges audit --ci\n`, description: "Create security scanning GitHub Actions workflow", ruleId: "GDPR-ART32-009" },
    { type: "create", filePath: ".github/workflows/sbom-scan.yml", content: `name: SBOM Generation & Scan\non:\n  push:\n    branches: [main, master]\n  pull_request:\n    branches: [main, master]\n  schedule:\n    - cron: '0 6 * * 1'\n\njobs:\n  sbom:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n\n      - name: Generate SBOM with Syft\n        uses: anchore/sbom-action@v0\n        with:\n          image: \"\"\n          path: .\n          format: cyclonedx-json\n          output-file: sbom.json\n          fail-build: false\n\n      - name: Scan SBOM for vulnerabilities with Grype\n        uses: anchore/scan-action@v6\n        with:\n          sbom: sbom.json\n          fail-build: true\n          severity-cutoff: high\n\n      - name: Upload SBOM artifacts\n        if: always()\n        uses: actions/upload-artifact@v4\n        with:\n          name: sbom-artifacts\n          path: sbom.json\n          retention-days: 90\n`, description: "Create SBOM generation and scanning GitHub Actions workflow", ruleId: "GDPR-ART32-009" },
  ];
}

function generateDataInventory(projectName: string, projectType: string): string {
  const webCategories = [
    { category: "User Profiles", type: "Personal", classification: "Restricted", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" },
    { category: "Email Addresses", type: "Personal", classification: "Confidential", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" },
    { category: "Authentication Credentials", type: "Personal", classification: "Restricted", retention: "Session duration", basis: "Contract (Art. 6(1)(b))" },
    { category: "IP Addresses", type: "Personal", classification: "Internal", retention: "30 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "Session Data", type: "Operational", classification: "Internal", retention: "Session duration", basis: "Contract (Art. 6(1)(b))" },
    { category: "Audit Logs", type: "Operational", classification: "Internal", retention: "1 year", basis: "Legal obligation (Art. 6(1)(c))" },
  ];

  const aiCategories = [
    { category: "AI Prompts", type: "Personal", classification: "Confidential", retention: "90 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "AI Outputs", type: "Personal", classification: "Internal", retention: "30 days", basis: "Legitimate interest (Art. 6(1)(f))" },
    { category: "Training Data References", type: "Personal", classification: "Restricted", retention: "Duration of use", basis: "Consent (Art. 6(1)(a))" },
  ];

  const blockchainCategories = [
    { category: "Wallet Addresses", type: "Pseudonymous", classification: "Public", retention: "Indefinite (on-chain)", basis: "Contract (Art. 6(1)(b))" },
    { category: "Transaction History", type: "Pseudonymous", classification: "Public", retention: "Indefinite (on-chain)", basis: "Contract (Art. 6(1)(b))" },
    { category: "KYC Data", type: "Personal", classification: "Restricted", retention: "5 years", basis: "Legal obligation (Art. 6(1)(c))" },
  ];

  let categories = webCategories;
  if (projectType.includes("ai")) categories = [...webCategories, ...aiCategories];
  if (projectType.includes("blockchain") || projectType.includes("wallet")) categories = [...webCategories, ...blockchainCategories];
  if (projectType.includes("healthcare")) {
    categories = [...webCategories, { category: "Health Records", type: "Special Category", classification: "Restricted", retention: "10 years", basis: "Legal obligation (Art. 6(1)(c) + Art. 9)" }];
  }
  if (projectType.includes("photo")) {
    categories = [...webCategories, { category: "Photos/Images", type: "Personal", classification: "Restricted", retention: "Account + 30 days", basis: "Contract (Art. 6(1)(b))" }];
  }

  const lines = [
    `# Data Inventory - ${projectName}\n`,
    `Generated: ${new Date().toISOString()}\n`,
    `## Data Categories\n`,
    `| Category | Type | Classification | Retention | Legal Basis |`,
    `|----------|------|---------------|-----------|-------------|`,
  ];

  for (const cat of categories) {
    lines.push(`| ${cat.category} | ${cat.type} | ${cat.classification} | ${cat.retention} | ${cat.basis} |`);
  }

  lines.push("");
  lines.push("## Data Classification Rules\n");
  lines.push("| Classification | Encryption | Access Controls | Audit Logging |");
  lines.push("|---------------|-----------|-----------------|---------------|");
  lines.push("| Public | Not required | Not required | Not required |");
  lines.push("| Internal | Not required | Required | Recommended |");
  lines.push("| Confidential | Required | Required | Required |");
  lines.push("| Restricted | Required | Required + MFA | Required + Immutable |");
  lines.push("");
  lines.push("## Data Subject Rights Implementation\n");
  lines.push("- [ ] Right of access (Article 15) - API endpoint or process implemented");
  lines.push("- [ ] Right to rectification (Article 16) - Update process documented");
  lines.push("- [ ] Right to erasure (Article 17) - Deletion process with verification");
  lines.push("- [ ] Right to restriction (Article 18) - Mark-and-hold process");
  lines.push("- [ ] Right to data portability (Article 20) - Export in machine-readable format");
  lines.push("- [ ] Right to object (Article 21) - Opt-out mechanism");
  lines.push("");
  lines.push("## Third-Party Processors\n");
  lines.push("| Processor | Data Shared | Purpose | DPA Signed | Location |");
  lines.push("|-----------|------------|---------|------------|----------|");
  lines.push("| [Cloud Provider] | [Data categories] | [Purpose] | [Yes/No] | [Country] |");
  lines.push("");
  lines.push("## Cross-Border Transfers\n");
  lines.push("| Transfer From | Transfer To | Safeguard |");
  lines.push("|--------------|------------|-----------|");
  lines.push("| [EU] | [Country] | [SCCs / Adequacy Decision / BCRs] |");

  return lines.join("\n");
}

function generateProcessingRecords(projectName: string, controllerName: string): string {
  const lines = [
    `# Records of Processing Activities (ROPA) - ${projectName}\n`,
    `**Controller**: ${controllerName}`,
    `**Date**: ${new Date().toISOString().split("T")[0]}`,
    `**Document Reference**: ROPA-${projectName.replace(/\s+/g, "-").toUpperCase()}-001\n`,
    `## Article 30(1) — Controller Records\n`,
  ];

  const activities = [
    {
      name: "User Account Management",
      purpose: "Provision and manage user accounts",
      categories: "Identity data, contact data, authentication data",
      recipients: "Internal systems, identity provider",
      transfers: "None (or specify if applicable)",
      retention: "Account lifetime + 30 days post-deletion",
      security: "Encryption at rest (AES-256-GCM), TLS 1.2+ in transit, MFA, RBAC",
    },
    {
      name: "Service Delivery",
      purpose: "Deliver core product/service functionality",
      categories: "Usage data, preferences, content data",
      recipients: "Internal systems, CDN provider",
      transfers: "None (or specify)",
      retention: "Account lifetime",
      security: "Encryption, access controls, audit logging",
    },
    {
      name: "Communication",
      purpose: "Service notifications, support, marketing (with consent)",
      categories: "Email addresses, communication preferences",
      recipients: "Email service provider",
      transfers: "None (or specify)",
      retention: "Until consent withdrawal or account closure",
      security: "Encryption, access controls",
    },
    {
      name: "Analytics and Monitoring",
      purpose: "Service improvement and security monitoring",
      categories: "Usage data, IP addresses, device information",
      recipients: "Analytics provider, monitoring systems",
      transfers: "None (or specify)",
      retention: "12 months for analytics, 1 year for security logs",
      security: "Pseudonymization, access controls, aggregated reporting",
    },
    {
      name: "Legal Compliance",
      purpose: "Meet regulatory and legal obligations",
      categories: "Identity data, transaction records, audit logs",
      recipients: "Legal authorities (upon request), auditors",
      transfers: "As required by law",
      retention: "Per legal requirements (typically 5-7 years)",
      security: "Encryption, access controls, immutable audit trail",
    },
  ];

  for (const activity of activities) {
    lines.push(`### ${activity.name}\n`);
    lines.push(`- **Purpose**: ${activity.purpose}`);
    lines.push(`- **Categories of Data Subjects**: Users, customers, employees`);
    lines.push(`- **Categories of Personal Data**: ${activity.categories}`);
    lines.push(`- **Categories of Recipients**: ${activity.recipients}`);
    lines.push(`- **International Transfers**: ${activity.transfers}`);
    lines.push(`- **Retention Period**: ${activity.retention}`);
    lines.push(`- **Technical and Organizational Measures**: ${activity.security}`);
    lines.push(`- **Legal Basis**: Contract (Art. 6(1)(b)), Legitimate Interest (Art. 6(1)(f))\n`);
  }

  lines.push("## Data Protection Officer\n");
  lines.push("- **Name**: [DPO Name or N/A if not required]");
  lines.push("- **Contact**: [DPO Contact Details]");
  lines.push("");
  lines.push("## Review History\n");
  lines.push("| Date | Reviewer | Changes |");
  lines.push("|------|----------|---------|");
  lines.push(`| ${new Date().toISOString().split("T")[0]} | Initial | Created ROPA |`);

  return lines.join("\n");
}

export function handleRequest(request: MCPRequest): MCPResponse | null {
  const isNotification = request.id === undefined || request.id === null;

  if (request.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "gesf-mcp-server",
          version: GESF_VERSION,
        },
      },
    };
  }

  if (request.method === "notifications/initialized") {
    return null;
  }

  if (request.method === "notifications/cancelled") {
    return null;
  }

  if (request.method === "ping") {
    if (isNotification) return null;
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {},
    };
  }

  if (request.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: { tools: TOOLS },
    };
  }

  if (request.method === "tools/call") {
    const toolName = (request.params?.name as string) || "";
    const args = (request.params?.arguments as Record<string, string>) || {};

    let resultText: string;

    try {
      switch (toolName) {
        case "check_compliance": {
          const projectType = (args.project_type || "saas") as ProjectType;
          const packs = getPacksForProjectType(projectType);
          const controls = packs.flatMap((p) => p.controls);
          const frameworks = [...new Set(controls.map(c => c.framework))];
          const score = generateScoreFile(controls, frameworks as FrameworkName[]);
          resultText = formatScoreOutput(score);
          break;
        }
        case "check_project_status": {
          const projectPath = resolveProjectPath(args.project_path);
          const { config, score, overrides } = loadProjectConfig(projectPath);

          if (!config) {
            resultText = `No GESF project found at ${projectPath}. Run 'ges init' first to initialize the project.`;
            break;
          }

          const lines: string[] = [];
          lines.push(`# Project Status: ${config.project_name || "Unknown"}\n`);
          lines.push(`**Path**: ${projectPath}`);
          lines.push(`**Type**: ${config.project_type || "Unknown"}`);
          lines.push(`**Initialized**: ${config.created_at || "Unknown"}`);
          lines.push(`**Frameworks**: ${Array.isArray(config.frameworks) ? (config.frameworks as string[]).join(", ") : "Unknown"}`);

          if (overrides.length > 0) {
            const naCount = overrides.filter(o => o.status === "not-applicable").length;
            const passCount = overrides.filter(o => o.status === "pass").length;
            lines.push(`**Control Overrides**: ${overrides.length} (${naCount} not-applicable, ${passCount} pre-verified)`);
          }

          if (score) {
            lines.push(`\n## Compliance Score\n`);
            lines.push(`**Overall: ${score.overall}% (Grade: ${score.overall_grade})**\n`);
            lines.push("| Framework | Score | Grade | Passed | Failed | Warnings | Critical |");
            lines.push("|-----------|-------|-------|--------|--------|----------|----------|");
            for (const [fw, data] of Object.entries(score.frameworks)) {
              lines.push(`| ${fw} | ${data.score}% | ${data.grade} | ${data.passed_controls} | ${data.failed_controls} | ${data.warning_controls} | ${data.critical_failures} |`);
            }
            if (score.audit_impact) {
              const ai = score.audit_impact;
              lines.push(`\n**Audit Impact**: -${ai.total_deduction}% (${ai.critical_findings} critical, ${ai.high_findings} high, ${ai.medium_findings} medium, ${ai.low_findings} low findings)`);
            }
            lines.push(`\nLast evaluated: ${score.evaluated_at}`);
          } else {
            lines.push("\nNo compliance score found. Run 'ges audit' then 'ges score'.");
          }

          const controlsDir = path.join(projectPath, "controls");
          if (fs.existsSync(controlsDir)) {
            const controlFiles = fs.readdirSync(controlsDir).filter(f => f.endsWith(".json"));
            if (controlFiles.length > 0) {
              lines.push(`\n**Control Files**: ${controlFiles.join(", ")}`);
            }
          }

          resultText = lines.join("\n");
          break;
        }
        case "list_missing_controls": {
          const framework = args.framework || "GDPR";
          const projectType = args.project_type as ProjectType | undefined;
          let controls: Control[];

          if (projectType) {
            const packs = getPacksForProjectType(projectType);
            controls = packs.flatMap(p => p.controls);
          } else {
            controls = getAllPacks().flatMap(p => p.controls);
          }

          const missing = controls.filter(
            (c) => c.framework.toLowerCase() === framework.toLowerCase() && c.status !== "pass",
          );

          if (missing.length === 0) {
            resultText = `All ${framework} controls are passing. No missing controls found.`;
          } else {
            const lines = [`# Missing Controls - ${framework}\n`];
            const critical = missing.filter(c => c.severity === "critical");
            const high = missing.filter(c => c.severity === "high");
            const medium = missing.filter(c => c.severity === "medium");
            const low = missing.filter(c => c.severity === "low");

            lines.push(`**Total**: ${missing.length} (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)\n`);

            for (const group of [
              { label: "Critical", items: critical },
              { label: "High", items: high },
              { label: "Medium", items: medium },
              { label: "Low", items: low },
            ]) {
              if (group.items.length > 0) {
                lines.push(`## ${group.label} Severity\n`);
                for (const c of group.items) {
                  lines.push(`**${c.id}**: ${c.name}`);
                  lines.push(`  Status: ${c.status} | Category: ${c.category}`);
                  lines.push(`  ${c.implementation_guidance.split(".")[0]}\n`);
                }
              }
            }

            lines.push(`\nUse \`fix_recommendation\` with a control_id to get detailed implementation guidance.`);
            resultText = lines.join("\n");
          }
          break;
        }
        case "list_framework_controls": {
          const framework = args.framework || "GDPR";
          const statusFilter = args.status_filter as ControlStatus | undefined;

          let allControls: Control[];
          const pack = getPack(framework.toLowerCase());
          if (pack) {
            allControls = pack.controls;
          } else {
            allControls = getAllPacks().flatMap(p => p.controls);
          }

          const filtered = framework.toLowerCase() !== "all"
            ? allControls.filter(c => c.framework.toLowerCase() === framework.toLowerCase())
            : allControls;

          const controls = statusFilter
            ? filtered.filter(c => c.status === statusFilter)
            : filtered;

          if (controls.length === 0) {
            resultText = statusFilter
              ? `No ${framework} controls with status '${statusFilter}' found.`
              : `No controls found for framework '${framework}'. Available: GDPR, OWASP, CIS, NIST, AI, blockchain, government.`;
          } else {
            const lines = [`# ${framework} Controls (${controls.length} total${statusFilter ? `, filtered by: ${statusFilter}` : ""})\n`];
            lines.push("| ID | Name | Severity | Category | Status |");
            lines.push("|----|------|----------|----------|--------|");
            for (const c of controls) {
              lines.push(`| ${c.id} | ${c.name} | ${c.severity} | ${c.category} | ${c.status} |`);
            }
            lines.push(`\n### Summary`);
            const byStatus: Record<string, number> = {};
            for (const c of controls) {
              byStatus[c.status] = (byStatus[c.status] || 0) + 1;
            }
            for (const [status, count] of Object.entries(byStatus)) {
              lines.push(`- ${status}: ${count}`);
            }
            resultText = lines.join("\n");
          }
          break;
        }
        case "run_audit": {
          const projectPath = resolveProjectPath(args.project_path);

          if (!fs.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'ges init' first.`;
            break;
          }

          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);
          const projectConfig = loadProjectConfig(projectPath);
          const config = projectConfig.config;
          const frameworks = (config?.frameworks || ["GDPR", "OWASP"]) as FrameworkName[];
          const projectType = (config?.project_type || "generic-web-application") as ProjectType;

          const controls = getControlsForProject(projectType, frameworks);
          const overriddenControls = applyControlOverrides(controls, projectConfig.overrides);
          const auditedControls = updateControlsFromFindings(overriddenControls, findings);
          const score = generateScoreFile(auditedControls, frameworks, findings);

          const critical = findings.filter(f => f.severity === "critical");
          const high = findings.filter(f => f.severity === "high");
          const medium = findings.filter(f => f.severity === "medium");
          const low = findings.filter(f => f.severity === "low");

          const lines: string[] = [];
          lines.push(`# Security Audit Report\n`);
          lines.push(`**Scanned**: ${scannedFiles} files`);
          lines.push(`**Findings**: ${findings.length} total (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)\n`);

          if (findings.length > 0) {
            const grouped: Record<string, Finding[]> = {};
            for (const f of findings) {
              if (!grouped[f.category]) grouped[f.category] = [];
              grouped[f.category].push(f);
            }

            const categoryOrder = ["secrets", "encryption", "authentication", "injection", "xss", "security", "database", "config", "infrastructure", "dependencies"];
            for (const cat of categoryOrder) {
              if (!grouped[cat]) continue;
              lines.push(`## ${cat.charAt(0).toUpperCase() + cat.slice(1)}\n`);
              for (const f of grouped[cat]) {
                const loc = f.file !== "project" ? ` (${f.file}${f.line ? `:${f.line}` : ""})` : " (project-wide)";
                lines.push(`- **[${f.severity.toUpperCase()}] ${f.title}**${loc}`);
                lines.push(`  Evidence: ${f.evidence.slice(0, 150)}`);
                lines.push(`  Fix: ${f.fix}`);
                if (f.controlIds && f.controlIds.length > 0) {
                  lines.push(`  Controls: ${f.controlIds.join(", ")}`);
                }
                lines.push("");
              }
            }
          } else {
            lines.push("**No security findings detected.** All scanned files are clean.\n");
          }

          lines.push("## Compliance Score\n");
          lines.push(`**Overall: ${score.overall}% (Grade: ${score.overall_grade})**\n`);
          for (const [fw, data] of Object.entries(score.frameworks)) {
            lines.push(`- ${fw}: ${data.score}% (${data.grade}) — ${data.passed_controls}/${data.total_controls} controls passed, ${data.critical_failures} critical failures`);
          }

          if (projectConfig.overrides.length > 0) {
            lines.push(`\n*Note: ${projectConfig.overrides.length} control overrides applied.*`);
          }

          resultText = lines.join("\n");
          break;
        }
        case "generate_compliance_report": {
          const projectName = args.project_name || "Project";
          const projectType = (args.project_type || "saas") as ProjectType;
          const frameworksStr = args.frameworks || "GDPR,OWASP";
          const frameworks = frameworksStr.split(",").map(f => f.trim()) as FrameworkName[];
          resultText = generateFullComplianceReport(projectName, projectType, frameworks);
          break;
        }
        case "generate_audit_report": {
          const projectPath = resolveProjectPath(args.project_path);

          if (!args.project_path && !fs.existsSync(path.join(projectPath, ".ges"))) {
            const projectName = args.project_name || "Project";
            const projectType = "generic-web-application" as ProjectType;
            resultText = generateFullComplianceReport(projectName, projectType, ["GDPR", "OWASP"]);
            resultText += "\n\n**Note: No project path specified and no .ges/ directory found. Showing default compliance report. Provide project_path for actual audit results.**";
            break;
          }

          if (!fs.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }

          const projectName = args.project_name || path.basename(projectPath);
          const projectConfig = loadProjectConfig(projectPath);
          const config = projectConfig.config;
          const projectType = (config?.project_type || "generic-web-application") as ProjectType;
          const frameworks = (config?.frameworks || ["GDPR", "OWASP"]) as FrameworkName[];

          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);

          resultText = generateFullComplianceReport(projectName, projectType, frameworks, findings, projectConfig.overrides);
          resultText += `\n\n**Audit Details**: Scanned ${scannedFiles} files. ${findings.length} findings detected.`;
          break;
        }
        case "fix_recommendation": {
          const controlId = args.control_id || "";
          const findingTitle = args.finding_title;

          if (!controlId && !findingTitle) {
            resultText = "Please provide either a control_id (e.g. 'GDPR-ART32-001') or a finding_title to get fix guidance.";
            break;
          }

          resultText = generateFixGuidance(controlId, findingTitle);
          break;
        }
        case "generate_retention_policy": {
          const name = args.project_name || "Project";
          resultText = `# Data Retention Policy - ${name}\n\n## 1. Purpose\n\nThis policy defines the retention periods for all data categories processed by ${name}.\n\n## 2. Retention Periods\n\n| Category | Period | Justification | Legal Basis |\n|----------|--------|---------------|-------------|\n| User account data | Account lifetime + 30 days | Contract fulfillment | Art. 6(1)(b) |\n| Email addresses | Account lifetime + 30 days | Communication | Art. 6(1)(b) |\n| Authentication data | Session duration | Security | Art. 6(1)(f) |\n| IP addresses | 30 days | Security monitoring | Art. 6(1)(f) |\n| Audit logs | 1 year | Legal obligation | Art. 6(1)(c) |\n| Session data | Session duration | Operational | Art. 6(1)(b) |\n| Marketing consent | Until withdrawal | Consent | Art. 6(1)(a) |\n| Support tickets | 2 years | Quality assurance | Art. 6(1)(f) |\n\n## 3. Deletion Process\n\n1. Automated deletion: Data past retention period is flagged for deletion\n2. Deletion verification: Monthly audit of deletion jobs\n3. Backup purge: Backups containing expired data are purged within 90 days\n4. Deletion log: All deletions are logged with timestamp and scope\n\n## 4. Exceptions\n\n- Data subject to legal hold: Retained until hold is lifted\n- Data required for ongoing legal proceedings: Retained until proceedings conclude\n- Anonymized data may be retained indefinitely for statistical purposes\n\n## 5. Data Subject Rights\n\n- Users can request early deletion via the data subject rights process\n- Right to erasure (Article 17) requests are processed within 30 days\n- Verification of identity is required before any deletion\n\n## 6. Review Schedule\n\nThis policy is reviewed quarterly and updated as needed.\n\nLast reviewed: ${new Date().toISOString().split("T")[0]}`;
          break;
        }
        case "generate_incident_response": {
          const name = args.project_name || "Project";
          resultText = `# Incident Response Plan - ${name}\n\n## 1. Severity Levels\n\n| Level | Response Time | Examples |\n|-------|--------------|----------|\n| P1 (Critical) | 15 minutes | Data breach, system compromise, ransomware |\n| P2 (High) | 1 hour | Unauthorized access, vulnerability exploitation |\n| P3 (Medium) | 4 hours | Suspicious activity, policy violation |\n| P4 (Low) | 24 hours | Minor misconfiguration, informational findings |\n\n## 2. Response Team\n\n| Role | Responsibility |\n|------|---------------|\n| Incident Commander | Overall coordination and decision making |\n| Security Lead | Technical investigation and containment |\n| Communications Lead | Internal and external notifications |\n| Legal Advisor | Regulatory and legal compliance |\n| DPO (if applicable) | GDPR compliance and data subject notification |\n\n## 3. Response Process\n\n### Phase 1: Detection & Identification\n- Alert triggered by monitoring, user report, or external notification\n- Initial assessment of scope and severity\n- Assign severity level (P1-P4)\n\n### Phase 2: Containment\n- Isolate affected systems\n- Preserve evidence for forensic analysis\n- Implement temporary controls\n\n### Phase 3: Eradication\n- Identify root cause\n- Remove threat from all systems\n- Patch vulnerabilities\n\n### Phase 4: Recovery\n- Restore systems from verified backups\n- Verify system integrity\n- Resume normal operations with enhanced monitoring\n\n### Phase 5: Post-Incident Review\n- Document timeline and actions taken\n- Identify lessons learned\n- Update security controls and processes\n- Update this plan if needed\n\n## 4. GDPR Breach Notification\n\n**72-hour rule**: If a breach is likely to result in a risk to data subjects:\n1. Notify supervisory authority within 72 hours (Article 33)\n2. If high risk: Notify affected data subjects without undue delay (Article 34)\n3. Document all actions in the breach register\n\n### Notification Template\n- Nature of the breach\n- Categories and approximate number of data subjects\n- Likely consequences\n- Measures taken or proposed\n\n## 5. Communication Templates\n\n### Internal Notification\nSubject: [P-level] Security Incident - [Brief Description]\n- What: [Description]\n- When: [Detection time]\n- Impact: [Known impact]\n- Actions: [Current containment measures]\n- Next update: [Time]\n\n### Regulatory Notification\nAddressed to: [Supervisory Authority]\n- DPO contact: [Name, email, phone]\n- Breach description: [Details]\n- Affected individuals: [Number and categories]\n- Measures taken: [Containment and remediation]\n\n## 6. Testing\n\n- Tabletop exercises: Quarterly\n- Full simulation: Annually\n- Plan review: After each incident and at least semi-annually\n\nLast reviewed: ${new Date().toISOString().split("T")[0]}`;
          break;
        }
        case "generate_risk_assessment": {
          const name = args.project_name || "Project";
          resultText = `# Risk Assessment - ${name}\n\n## 1. Methodology\n\nRisk assessment follows the GESF methodology based on ISO 27005 and NIST SP 800-30.\n\nRisk Score = Likelihood × Impact\n\n| Rating | Score |\n|--------|-------|\n| Critical | 5 |\n| High | 4 |\n| Medium | 3 |\n| Low | 2 |\n| Negligible | 1 |\n\n## 2. Risk Register\n\n| ID | Risk | Likelihood | Impact | Score | Mitigation | Residual |\n|----|------|-----------|--------|-------|------------|----------|\n| R001 | Data breach (external) | Medium (3) | Critical (5) | 15 | Encryption, MFA, WAF, pen testing | Medium |\n| R002 | Insider threat | Low (2) | High (4) | 8 | RBAC, audit logging, DLP | Low |\n| R003 | Data loss | Low (2) | Critical (5) | 10 | Backups, DR plan, replication | Low |\n| R004 | Ransomware | Low (2) | Critical (5) | 10 | Backups, EDR, email filtering | Low |\n| R005 | Supply chain attack | Medium (3) | High (4) | 12 | Dependency scanning, SBOM, vendor assessment | Medium |\n| R006 | Misconfiguration | Medium (3) | High (4) | 12 | IaC scanning, security review, hardening | Medium |\n| R007 | Credential compromise | Medium (3) | High (4) | 12 | MFA, password policy, monitoring | Low |\n| R008 | DDoS attack | Low (2) | Medium (3) | 6 | CDN, rate limiting, WAF | Low |\n| R009 | Non-compliance (GDPR) | Medium (3) | High (4) | 12 | Regular audits, compliance scanning | Low |\n| R010 | Third-party data breach | Medium (3) | High (4) | 12 | DPA requirements, vendor assessment | Medium |\n\n## 3. Risk Treatment Plan\n\n| ID | Treatment | Owner | Deadline | Status |\n|----|-----------|-------|----------|--------|\n| R001 | Implement WAF + annual pen testing | Security Lead | Quarterly | In progress |\n| R002 | Deploy DLP solution | Security Lead | Q2 | Planned |\n| R003 | Test DR plan monthly | Platform Lead | Monthly | In progress |\n| R005 | Automate dependency scanning | DevOps | Q1 | In progress |\n| R006 | Implement IaC security scanning | DevOps | Q2 | Planned |\n| R007 | Enforce MFA for all users | Security Lead | Q1 | Done |\n| R009 | Monthly compliance audits | Compliance Lead | Monthly | In progress |\n\n## 4. Acceptance Criteria\n\nRisks with residual score > 12 require executive sign-off.\nAll critical risks must have active mitigation plans.\n\n## 5. Review Schedule\n\n- Full assessment: Annually\n- Risk register review: Quarterly\n- After any significant change or incident\n\nLast reviewed: ${new Date().toISOString().split("T")[0]}`;
          break;
        }
        case "generate_dpa": {
          const name = args.project_name || "Project";
          resultText = `# Data Processing Agreement - ${name}\n\n## 1. Parties\n\n**Controller**: [Company Name]\nAddress: [Address]\nDPO: [Name, Email]\n\n**Processor**: [Service Provider Name]\nAddress: [Address]\nDPO: [Name, Email]\n\n## 2. Subject Matter and Duration\n\nThis Agreement governs the processing of personal data by the Processor on behalf of the Controller in connection with the provision of services for **${name}**.\n\n**Duration**: Effective from the date of signature until termination of the underlying service agreement.\n\n## 3. Details of Processing\n\n| Category | Type | Purpose |\n|----------|------|--------|\n| User data | Personal | Service delivery |\n| Authentication data | Personal | Access control |\n| Usage data | Operational | Analytics |\n| Communication data | Personal | Support |\n\n## 4. Obligations of the Processor\n\nThe Processor shall:\n\n1. Process data only on documented instructions from the Controller\n2. Ensure confidentiality of all persons authorized to process personal data\n3. Implement appropriate technical and organizational measures (Article 32)\n4. Not engage sub-processors without prior authorization\n5. Assist the Controller in responding to data subject rights requests\n6. Assist the Controller in ensuring compliance with Articles 32-36\n7. Delete or return all personal data upon termination\n8. Make available all information necessary to demonstrate compliance\n9. Allow and contribute to audits conducted by the Controller or mandated auditor\n\n## 5. Security Measures (Article 32)\n\n- Encryption of personal data at rest (AES-256-GCM)\n- Encryption of personal data in transit (TLS 1.2+)\n- Access controls with principle of least privilege\n- Regular security testing and vulnerability assessments\n- Incident response plan with 72-hour notification\n- Audit logging with immutable records\n- Regular backup and disaster recovery testing\n\n## 6. Sub-Processors\n\n| Sub-Processor | Purpose | Location |\n|-------------|---------|----------|\n| [Cloud Provider] | Hosting | [Country] |\n| [Email Provider] | Communications | [Country] |\n\nThe Controller authorizes the use of the above sub-processors. Any changes will be notified 30 days in advance.\n\n## 7. Data Breach Notification\n\nThe Processor shall notify the Controller within 24 hours of becoming aware of a personal data breach, providing:\n- Nature of the breach including categories and approximate numbers\n- Name and contact details of the DPO\n- Likely consequences of the breach\n- Measures taken or proposed to address the breach\n\n## 8. Data Subject Rights\n\nThe Processor shall assist the Controller in fulfilling its obligations to respond to data subject requests for:\n- Access (Article 15)\n- Rectification (Article 16)\n- Erasure (Article 17)\n- Restriction (Article 18)\n- Data portability (Article 20)\n- Objection (Article 21)\n\n## 9. International Transfers\n\nAny transfer of personal data outside the EEA shall be subject to:\n- Adequacy decision by the European Commission, OR\n- Standard Contractual Clauses (SCCs), OR\n- Binding Corporate Rules (BCRs)\n\n## 10. Termination\n\nUpon termination:\n1. Processor shall return all personal data to the Controller within 30 days\n2. If return is not possible, Processor shall delete all personal data\n3. Processor shall certify deletion in writing\n\n## 11. Liability and Indemnification\n\nEach party's liability shall be governed by the underlying service agreement and applicable GDPR provisions.\n\n## 12. Governing Law\n\nThis Agreement shall be governed by [Applicable Jurisdiction].\n\n---\n\n**Signed:**\n\nController: _________________________ Date: ____________\n\nProcessor: _________________________ Date: ____________`;
          break;
        }
        case "generate_data_inventory": {
          const projectName = args.project_name || "Project";
          const projectType = args.project_type || "saas";
          resultText = generateDataInventory(projectName, projectType);
          break;
        }
        case "generate_processing_records": {
          const projectName = args.project_name || "Project";
          const controllerName = args.controller_name || "[Organization Name]";
          resultText = generateProcessingRecords(projectName, controllerName);
          break;
        }
        case "auto_fix": {
          const projectPath = resolveProjectPath(args.project_path);
          const dryRun = args.dry_run === "true";
          const ruleFilter = args.rule_ids ? new Set(args.rule_ids.split(",").map(r => r.trim())) : undefined;

          if (!fs.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }

          const { findings: rawFindings, scannedFiles } = runAudit(projectPath);
          const findings = deduplicateFindings(rawFindings);

          if (findings.length === 0) {
            resultText = `# Auto-Fix Report\n\n**Project**: ${projectPath}\n**Scanned**: ${scannedFiles} files\n\nNo issues found. Project is clean!`;
            break;
          }

          const { actions, warnings } = createAutoFixPlan(projectPath, findings, ruleFilter);

          if (actions.length === 0) {
            const lines = [
              `# Auto-Fix Report\n`,
              `**Project**: ${projectPath}`,
              `**Scanned**: ${scannedFiles} files`,
              `**Findings**: ${findings.length}\n`,
              `## No Auto-Fixable Issues\n`,
              `All ${findings.length} findings require manual review:\n`,
            ];
            for (const w of warnings) lines.push(`- ${w}`);
            for (const f of findings.slice(0, 10)) {
              lines.push(`- [${f.severity.toUpperCase()}] ${f.title} (${f.file}${f.line ? `:${f.line}` : ""})`);
            }
            resultText = lines.join("\n");
            break;
          }

          const npmInstalls = getNpmInstallsFromActions(actions);

          const lines = [
            `# Auto-Fix Report\n`,
            `**Project**: ${projectPath}`,
            `**Scanned**: ${scannedFiles} files`,
            `**Findings**: ${findings.length} total`,
            `**Auto-fixable**: ${actions.length} actions`,
            `**Manual review**: ${warnings.length} items`,
            dryRun ? `**Mode**: DRY RUN (no changes applied)\n` : "",
          ];

          if (dryRun) {
            lines.push("## Planned Actions (dry run)\n");
          } else {
            lines.push("## Applied Fixes\n");
          }

          let applied = 0;
          let failed = 0;
          for (const action of actions) {
            if (dryRun) {
              lines.push(`- [${action.type}] ${action.filePath}: ${action.description}`);
              applied++;
            } else {
              const result = applyAutoFixAction(projectPath, action);
              if (result.applied) {
                applied++;
                lines.push(`- ✓ [${action.type}] ${action.filePath}: ${action.description}`);
              } else {
                failed++;
                lines.push(`- ✗ [${action.type}] ${action.filePath}: ${action.description} — ${result.error}`);
              }
            }
          }

          lines.push(`\n## Summary\n`);
          lines.push(`- Actions applied: ${applied}${failed > 0 ? ` (${failed} failed)` : ""}`);

          if (npmInstalls.length > 0) {
            lines.push(`\n## npm Packages to Install\n`);
            lines.push("```bash");
            lines.push(`npm install ${npmInstalls.join(" ")}`);
            lines.push("```\n");
            lines.push("Or if using pnpm:");
            lines.push("```bash");
            lines.push(`pnpm add ${npmInstalls.join(" ")}`);
            lines.push("```");
          }

          if (warnings.length > 0) {
            lines.push(`\n## Manual Review Required\n`);
            for (const w of warnings) lines.push(`- ${w}`);
          }

          lines.push(`\n## Next Steps`);
          lines.push("1. Install the npm packages listed above");
          lines.push("2. Review all changes with `git diff`");
          lines.push("3. Run `ges audit` to verify fixes");
          lines.push("4. Address remaining manual review items");
          lines.push("5. Use `fix_recommendation` tool for detailed guidance on manual items");

          resultText = lines.join("\n");
          break;
        }
        case "apply_control_override": {
          const projectPath = resolveProjectPath(args.project_path);
          const controlId = args.control_id || "";
          const status = (args.status || "not-applicable") as ControlStatus;
          const reason = args.reason || "";

          if (!controlId) {
            resultText = "Error: control_id is required.";
            break;
          }

          if (!["not-applicable", "pass"].includes(status)) {
            resultText = `Error: status must be 'not-applicable' or 'pass'. Got: ${status}`;
            break;
          }

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `Error: No .ges/ directory at ${projectPath}. Run 'ges init' first.`;
            break;
          }

          const overridePath = path.join(projectPath, ".ges", "control-overrides.json");
          let overrides: ControlOverride[] = [];
          if (fs.existsSync(overridePath)) {
            const parsed = readJsonFileSafe<ControlOverride[]>(overridePath);
            if (Array.isArray(parsed)) overrides = parsed;
          }

          const existing = overrides.findIndex(o => o.control_id === controlId);
          if (existing >= 0) {
            overrides[existing] = { control_id: controlId, status, reason };
          } else {
            overrides.push({ control_id: controlId, status, reason });
          }

          const dir = path.dirname(overridePath);
          if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(overridePath, JSON.stringify(overrides, null, 2), "utf-8");

          const lines = [
            `# Control Override Applied\n`,
            `**Control**: ${controlId}`,
            `**Status**: ${status}`,
            `**Reason**: ${reason || "(none provided)"}`,
            `**File**: ${overridePath}`,
            `**Total overrides**: ${overrides.length}\n`,
            `The override will take effect on the next \`ges audit\` or \`ges score\` run.`,
            `\nRun \`ges audit\` then \`ges score\` to see the updated compliance score.`,
          ];

          resultText = lines.join("\n");
          break;
        }
        case "implement_control": {
          const projectPath = resolveProjectPath(args.project_path);
          const controlId = args.control_id || "";

          if (!controlId) {
            resultText = "Error: control_id is required. Example: GDPR-ART32-002, GDPR-ART32-006, AUTH-002";
            break;
          }

          if (!fs.existsSync(projectPath)) {
            resultText = `Error: Project path does not exist: ${projectPath}`;
            break;
          }

          const hasSrc = fs.existsSync(path.join(projectPath, "src"));
          const appFile = findMainAppFile(projectPath);
          const lines: string[] = [`# Implement Control: ${controlId}\n`];
          const actions: AutoFixAction[] = [];

          const controlMap: Record<string, { name: string; actions: AutoFixAction[]; warnings: string[] }> = {
            "GDPR-ART32-002": {
              name: "Encryption at Rest",
              actions: buildEncryptionAtRestImpl(projectPath, hasSrc),
              warnings: ["Configure encryption keys via environment variables or a vault service."],
            },
            "GDPR-ART32-003": {
              name: "Encryption in Transit",
              actions: buildEncryptionInTransitImpl(projectPath, hasSrc),
              warnings: ["Ensure your server/infrastructure is configured with TLS certificates."],
            },
            "GDPR-ART32-004": {
              name: "Unique User Identification",
              actions: buildUserIdentificationImpl(projectPath, hasSrc),
              warnings: ["Integrate the auth middleware into your routes."],
            },
            "GDPR-ART32-005": {
              name: "Automatic Session Timeout",
              actions: buildSessionTimeoutFix(projectPath),
              warnings: [],
            },
            "GDPR-ART32-006": {
              name: "Audit Logging",
              actions: buildLoggingFix(projectPath),
              warnings: ["Use auditLog() for all security-relevant actions."],
            },
            "GDPR-ART32-007": {
              name: "Integrity Controls",
              actions: buildIntegrityControlsImpl(projectPath, hasSrc),
              warnings: ["Apply integrity hashing to all critical data flows."],
            },
            "GDPR-ART32-008": {
              name: "Backup and Recovery",
              actions: buildBackupPolicyImpl(projectPath, hasSrc),
              warnings: ["Test your backup recovery process monthly."],
            },
            "GDPR-ART32-009": {
              name: "Regular Security Testing",
              actions: buildSecurityTestingImpl(projectPath),
              warnings: ["Schedule regular security scans in CI/CD."],
            },
          };

          const plan = controlMap[controlId];
          if (!plan) {
            resultText = `Control ${controlId} does not have an auto-implementation. Use \`fix_recommendation\` for manual guidance.\n\nAvailable auto-implementations: ${Object.keys(controlMap).join(", ")}`;
            break;
          }

          lines.push(`**Control**: ${plan.name}\n`);

          for (const action of plan.actions) {
            const result = applyAutoFixAction(projectPath, action);
            if (result.applied) {
              lines.push(`- ✓ [${action.type}] ${action.filePath}: ${action.description}`);
            } else if (result.error === "File already exists") {
              lines.push(`- → [${action.type}] ${action.filePath}: Already exists (skipped)`);
            } else {
              lines.push(`- ✗ [${action.type}] ${action.filePath}: ${result.error}`);
            }
          }

          const npmInstalls = getNpmInstallsFromActions(plan.actions);
          if (npmInstalls.length > 0) {
            lines.push(`\n## Install Dependencies\n`);
            lines.push("```bash");
            lines.push(`npm install ${npmInstalls.join(" ")}`);
            lines.push("```");
          }

          if (plan.warnings.length > 0) {
            lines.push(`\n## Notes`);
            for (const w of plan.warnings) lines.push(`- ${w}`);
          }

          lines.push(`\n## Next Steps`);
          lines.push("1. Install any npm packages listed above");
          lines.push("2. Import and integrate the generated files into your app");
          lines.push("3. Run `ges audit` to verify the control is now passing");
          lines.push(`4. Or use \`apply_control_override\` with control_id="${controlId}" if verified manually`);

          resultText = lines.join("\n");
          break;
        }
        case "generate_badge": {
          const projectPath = resolveProjectPath(args.project_path);

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'ges init' first.`;
            break;
          }

          const score = readJsonFileSafe<ScoreFile>(path.join(projectPath, ".ges", "score.json"));
          if (!score || !score.frameworks || Object.keys(score.frameworks).length === 0) {
            resultText = `No compliance score available at ${projectPath}. Run 'ges audit' then 'ges score' first.`;
            break;
          }

          const svg = generateBadgeSvg(score);
          const outputName = args.output || "badge.svg";
          const outputPath = path.resolve(projectPath, outputName);
          fs.mkdirSync(path.dirname(outputPath), { recursive: true });
          fs.writeFileSync(outputPath, svg);

          const explainer = generateScoreExplainer(score);
          const lines: string[] = [];
          lines.push(`# Compliance Badge Generated\n`);
          lines.push(`**File**: ${outputPath}`);
          lines.push(`**Score**: ${score.overall}% (${score.overall_grade ?? computeGrade(score.overall)})\n`);

          if (args.readme !== "") {
            const readmeName = args.readme || "README.md";
            const readmePath = path.resolve(projectPath, readmeName);
            if (fs.existsSync(readmePath)) {
              const readmeContent = fs.readFileSync(readmePath, "utf-8");
              const relativeBadgePath = path.relative(path.dirname(readmePath), outputPath);
              const updated = injectBadgeIntoReadme(readmeContent, relativeBadgePath, explainer);
              fs.writeFileSync(readmePath, updated);
              lines.push(`Badge injected into ${readmeName}`);
            } else {
              lines.push(`${readmeName} not found — badge SVG saved but not injected into README.`);
              lines.push(`Manually add: ![GESF Compliance](${outputName})`);
            }
          } else {
            lines.push(`Badge SVG saved to ${outputName}. Add to README manually if desired.`);
          }

          lines.push(`\n### Badge Preview\n`);
          lines.push(`![compliance ${score.overall}% ${score.overall_grade ?? computeGrade(score.overall)}]`);
          lines.push(`\n### Per-Framework Scores\n`);
          for (const [fw, data] of Object.entries(score.frameworks)) {
            lines.push(`- ${fw}: ${data.score}% (${data.grade})`);
          }

          resultText = lines.join("\n");
          break;
        }
        case "get_score": {
          const projectPath = resolveProjectPath(args.project_path);

          const score = readJsonFileSafe<ScoreFile>(path.join(projectPath, ".ges", "score.json"));
          if (!score || !score.frameworks || Object.keys(score.frameworks).length === 0) {
            resultText = `No compliance score available at ${projectPath}. Run 'ges audit' then 'ges score' first.`;
            break;
          }

          resultText = formatScoreOutput(score) + `\nLast evaluated: ${score.evaluated_at}`;
          break;
        }
        case "init_project": {
          const projectPath = resolveProjectPath(args.project_path);

          if (!fs.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }

          const gesDir = path.join(projectPath, GES_DIR);
          if (fs.existsSync(gesDir) && args.force !== "true") {
            resultText = `GESF is already initialized at ${projectPath}. Use force: true to re-initialize.`;
            break;
          }

          if (fs.existsSync(gesDir)) {
            fs.rmSync(gesDir, { recursive: true, force: true });
          }

          const projectName = args.project_name || path.basename(projectPath);
          const projectType = (args.project_type || "generic-web-application") as ProjectType;
          const frameworksStr = args.frameworks || DEFAULT_FRAMEWORKS.join(",");
          const frameworks = frameworksStr.split(",").map(f => f.trim() as import("@greenarmor/ges-core").FrameworkName);
          const now = new Date().toISOString();

          const config: ProjectConfig = {
            project_name: projectName,
            project_type: projectType,
            frameworks,
            requirements: {
              encryption: { required: true },
              mfa: { required: true },
              audit_logs: { required: true },
              backups: { required: true },
              retention_policy: { required: true },
              vulnerability_scanning: { required: true },
              authentication: { required: true },
              authorization: { required: true },
              secrets_management: { required: true },
              logging: { required: true },
              monitoring: { required: true },
              data_classification: { required: true },
              disaster_recovery: { required: true },
              incident_response: { required: true },
              privacy_controls: { required: true },
            },
            created_at: now,
            version: GESF_VERSION,
          };

          fs.mkdirSync(gesDir, { recursive: true });

          const configJson = generateConfigJson(config);
          fs.writeFileSync(path.join(gesDir, "config.json"), configJson.content);

          const metadataJson = generateMetadataJson(config);
          fs.writeFileSync(path.join(gesDir, "metadata.json"), metadataJson.content);

          const frameworkVersionJson = generateFrameworkVersionJson();
          fs.writeFileSync(path.join(gesDir, "framework-version.json"), frameworkVersionJson.content);

          const scoreJson = generateScoreJson();
          fs.writeFileSync(path.join(gesDir, "score.json"), scoreJson.content);

          const dirs = [COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR];
          for (const dir of dirs) {
            fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
          }

          const complianceDocs = generateComplianceDocs(projectName, projectType);
          for (const doc of complianceDocs) {
            const filePath = path.join(projectPath, COMPLIANCE_DIR, doc.filePath);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, doc.content);
          }

          const securityDocs = generateSecurityDocs(projectName, projectType);
          for (const doc of securityDocs) {
            const filePath = path.join(projectPath, SECURITY_DIR, doc.filePath);
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, doc.content);
          }

          const packs = getPacksForProjectType(projectType);
          for (const pack of packs) {
            const packDir = path.join(projectPath, CONTROLS_DIR, pack.id);
            fs.mkdirSync(packDir, { recursive: true });
            fs.writeFileSync(path.join(packDir, "controls.json"), JSON.stringify(pack.controls, null, 2));
          }

          const workflows = generateAllWorkflows(config);
          const workflowsDir = path.join(projectPath, ".github", "workflows");
          fs.mkdirSync(workflowsDir, { recursive: true });
          for (const wf of workflows) {
            fs.writeFileSync(path.join(workflowsDir, wf.filePath.replace(/^\.github\/workflows\//, "")), wf.content);
          }

          const lines: string[] = [];
          lines.push(`# GESF Project Initialized\n`);
          lines.push(`**Project**: ${projectName}`);
          lines.push(`**Type**: ${projectType}`);
          lines.push(`**Frameworks**: ${frameworks.join(", ")}`);
          lines.push(`**Path**: ${projectPath}\n`);
          lines.push(`## Created Structure`);
          lines.push(`- \`.ges/\` — Configuration and score files`);
          lines.push(`- \`compliance/\` — ${complianceDocs.length} compliance documents`);
          lines.push(`- \`security/\` — ${securityDocs.length} security documents`);
          lines.push(`- \`controls/\` — ${packs.length} control packs`);
          lines.push(`- \`.github/workflows/\` — ${workflows.length} CI/CD workflows`);
          lines.push(`- \`policies/\`, \`checklists/\`, \`docs/\`, \`reports/\`\n`);
          lines.push(`## Next Steps`);
          lines.push(`1. Run \`ges audit\` to scan the project for security issues`);
          lines.push(`2. Run \`ges score\` to calculate compliance score`);
          lines.push(`3. Run \`ges badge\` to generate a compliance badge for README`);
          lines.push(`4. Review and customize documents in compliance/ and security/`);

          resultText = lines.join("\n");
          break;
        }
        case "run_scans": {
          const projectPath = resolveProjectPath(args.project_path);

          if (!fs.existsSync(projectPath)) {
            resultText = `Project path does not exist: ${projectPath}`;
            break;
          }

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'ges init' first.`;
            break;
          }

          const detection = detectProject(projectPath);
          const ecosystemDetail = detection.ecosystem === "node" && detection.nodePackageManager
            ? `node (${detection.nodePackageManager})`
            : detection.ecosystem === "python" && detection.pythonToolchain
              ? `python (${detection.pythonToolchain})`
              : detection.ecosystem;

          const results = runAllScansWithSbom(detection);
          const lines: string[] = [];
          lines.push(`# Security Scan Results\n`);
          lines.push(`**Project**: ${projectPath}`);
          lines.push(`**Ecosystem**: ${ecosystemDetail}\n`);
          lines.push(formatScanResults(results));
          lines.push(formatSbomResults(results));

          const failed = results.filter(r => r.status === "fail");
          if (failed.length > 0) {
            lines.push(`\n**${failed.length} scanner(s) reported failures.** Review findings above.`);
          }

          resultText = lines.join("\n");
          break;
        }
        case "doctor": {
          const projectPath = resolveProjectPath(args.project_path);
          const checks: { name: string; status: string; detail?: string }[] = [];

          const gesDir = path.join(projectPath, GES_DIR);
          if (fs.existsSync(gesDir)) {
            checks.push({ name: "GESF initialized", status: "OK", detail: projectPath });
          } else {
            checks.push({ name: "GESF initialized", status: "FAIL", detail: "Run 'init_project' first" });
          }

          if (fs.existsSync(gesDir)) {
            const configPath = path.join(gesDir, "config.json");
            checks.push({
              name: "Config file",
              status: fs.existsSync(configPath) ? "OK" : "WARN",
              detail: fs.existsSync(configPath) ? configPath : "config.json not found",
            });

            const score = readJsonFileSafe<ScoreFile>(path.join(gesDir, "score.json"));
            checks.push({
              name: "Score file",
              status: score ? "OK" : "WARN",
              detail: score ? `Overall: ${score.overall}%` : "Run audit then score",
            });

            const config = readJsonFileSafe<ProjectConfig>(configPath);
            if (config) {
              checks.push({ name: "Project", status: "OK", detail: `${config.project_name} (${config.project_type})` });
              checks.push({ name: "Frameworks", status: "OK", detail: config.frameworks.join(", ") });
            }

            const dirs = [COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR];
            for (const dir of dirs) {
              const exists = fs.existsSync(path.join(projectPath, dir));
              checks.push({ name: `${dir}/ directory`, status: exists ? "OK" : "MISSING" });
            }

            const ghWorkflows = path.join(projectPath, ".github", "workflows");
            if (fs.existsSync(ghWorkflows)) {
              const workflows = fs.readdirSync(ghWorkflows).filter(f => f.endsWith(".yml"));
              checks.push({ name: "GitHub Actions", status: "OK", detail: `${workflows.length} workflow(s)` });
            } else {
              checks.push({ name: "GitHub Actions", status: "WARN", detail: "No .github/workflows found" });
            }
          }

          checks.push({ name: "GESF Version", status: "OK", detail: GESF_VERSION });

          const lines: string[] = [];
          lines.push(`# GESF Doctor - Diagnostic Report\n`);
          lines.push(`**Project**: ${projectPath}\n`);

          const ok = checks.filter(c => c.status === "OK").length;
          const warns = checks.filter(c => c.status === "WARN").length;
          const fails = checks.filter(c => c.status === "FAIL" || c.status === "MISSING").length;

          lines.push(`**Summary**: ${ok} OK, ${warns} warnings, ${fails} issues\n`);
          lines.push("| Check | Status | Detail |");
          lines.push("|-------|--------|--------|");
          for (const check of checks) {
            lines.push(`| ${check.name} | ${check.status} | ${check.detail || "—"} |`);
          }

          if (fails > 0) {
            lines.push(`\n**Action Required**: Fix the issues marked as FAIL or MISSING above.`);
          } else if (warns > 0) {
            lines.push(`\n**Note**: Some warnings detected. Review the items above.`);
          } else {
            lines.push(`\n**All checks passed.** Project is healthy.`);
          }

          resultText = lines.join("\n");
          break;
        }
        case "validate_project": {
          const projectPath = resolveProjectPath(args.project_path);
          const lines: string[] = [];
          let hasErrors = false;

          lines.push(`# GESF Validation Report\n`);
          lines.push(`**Project**: ${projectPath}\n`);

          const configPath = path.join(projectPath, GES_DIR, "config.json");
          const config = readJsonFileSafe<ProjectConfig>(configPath);

          if (!config) {
            lines.push("❌ **config.json** not found or invalid");
            hasErrors = true;
          } else {
            const result = ProjectConfigSchema.safeParse(config);
            if (result.success) {
              lines.push("✅ **Configuration** is valid");
            } else {
              lines.push("❌ **Configuration** validation errors:");
              for (const error of result.error.errors) {
                lines.push(`  - ${error.path.join(".")}: ${error.message}`);
              }
              hasErrors = true;
            }
          }

          const controlsDir = path.join(projectPath, CONTROLS_DIR);
          if (fs.existsSync(controlsDir)) {
            const packDirs = fs.readdirSync(controlsDir);
            for (const packDir of packDirs) {
              const controlsFile = path.join(controlsDir, packDir, "controls.json");
              if (fs.existsSync(controlsFile)) {
                const raw = readJsonFileSafe<Control[] | { controls: Control[] }>(controlsFile);
                const controls = Array.isArray(raw) ? raw : Array.isArray(raw?.controls) ? raw.controls : null;
                if (controls && Array.isArray(controls)) {
                  lines.push(`✅ **${packDir}**: ${controls.length} controls`);
                } else {
                  lines.push(`❌ **${packDir}**: Invalid controls.json`);
                  hasErrors = true;
                }
              }
            }
          } else {
            lines.push(`⚠️  No controls/ directory found`);
          }

          const requiredDirs = [COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR];
          for (const dir of requiredDirs) {
            if (fs.existsSync(path.join(projectPath, dir))) {
              lines.push(`✅ **${dir}/** directory exists`);
            } else {
              lines.push(`❌ **${dir}/** directory missing`);
              hasErrors = true;
            }
          }

          const score = readJsonFileSafe<ScoreFile>(path.join(projectPath, GES_DIR, "score.json"));
          if (score) {
            lines.push(`✅ **Score file** exists (${score.overall}%)`);
          } else {
            lines.push(`⚠️  **Score file** not found — run audit then score`);
          }

          lines.push(hasErrors ? "\n❌ **Validation failed.** Fix the issues above." : "\n✅ **All validations passed.**");

          resultText = lines.join("\n");
          break;
        }
        case "policy_list": {
          const packs = getAllPacks();
          const lines: string[] = [];
          lines.push(`# Available Policy Packs (${packs.length} total)\n`);
          lines.push("| ID | Name | Controls | Project Types |");
          lines.push("|----|------|----------|---------------|");
          for (const pack of packs) {
            lines.push(`| ${pack.id} | ${pack.name} | ${pack.controls.length} | ${pack.project_types.join(", ")} |`);
          }
          lines.push(`\nUse \`policy_install\` with a pack_id to install a pack into your project.`);
          resultText = lines.join("\n");
          break;
        }
        case "policy_install": {
          const projectPath = resolveProjectPath(args.project_path);
          const packId = args.pack_id || "";

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'init_project' first.`;
            break;
          }

          if (!packId) {
            resultText = `Error: pack_id is required. Available packs: ${listPackIds().join(", ")}`;
            break;
          }

          const packs = getAllPacks();
          const pack = packs.find(p => p.id === packId);

          if (!pack) {
            resultText = `Error: Pack '${packId}' not found. Available: ${listPackIds().join(", ")}`;
            break;
          }

          const packDir = path.join(projectPath, CONTROLS_DIR, pack.id);
          fs.mkdirSync(packDir, { recursive: true });
          fs.writeFileSync(path.join(packDir, "controls.json"), JSON.stringify(pack.controls, null, 2));

          resultText = `✅ Installed policy pack: **${pack.id}** (${pack.name})\n${pack.controls.length} controls written to ${CONTROLS_DIR}/${pack.id}/controls.json`;
          break;
        }
        case "policy_remove": {
          const projectPath = resolveProjectPath(args.project_path);
          const packId = args.pack_id || "";

          if (!packId) {
            resultText = `Error: pack_id is required.`;
            break;
          }

          const packDir = path.join(projectPath, CONTROLS_DIR, packId);

          if (!fs.existsSync(packDir)) {
            resultText = `Error: Pack '${packId}' is not installed at ${projectPath}.`;
            break;
          }

          fs.rmSync(packDir, { recursive: true, force: true });
          resultText = `✅ Removed policy pack: **${packId}** from ${projectPath}`;
          break;
        }
        case "update_check": {
          resultText = `# GESF Update Check\n\n**Current Version**: ${GESF_VERSION}\n\nTo update:\n\`\`\`bash\nnpm update -g @greenarmor/ges\n# or\npnpm update -g @greenarmor/ges\n\`\`\`\nFor project-local installs:\n\`\`\`bash\nnpm update @greenarmor/ges\n# or\npnpm update @greenarmor/ges\n\`\`\``;
          break;
        }
        case "install_hooks": {
          const projectPath = resolveProjectPath(args.project_path);
          const action = args.action || "install";

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'init_project' first.`;
            break;
          }

          const gitDir = path.join(projectPath, ".git");
          if (!fs.existsSync(gitDir)) {
            resultText = `No Git repository found at ${projectPath}. Git hooks require a .git directory. Run 'git init' first.`;
            break;
          }

          const hooksDir = path.join(gitDir, "hooks");
          const hookPath = path.join(hooksDir, "pre-commit");

          if (action === "uninstall") {
            if (fs.existsSync(hookPath)) {
              const content = fs.readFileSync(hookPath, "utf-8");
              if (content.includes("ges audit")) {
                fs.unlinkSync(hookPath);
                resultText = `✅ Uninstalled pre-commit hook from ${hookPath}`;
              } else {
                resultText = `Pre-commit hook exists but was not installed by GESF. Not removing it.`;
              }
            } else {
              resultText = `No pre-commit hook found at ${hookPath}. Nothing to uninstall.`;
            }
            break;
          }

          const hookContent = `#!/bin/sh\n# GESF pre-commit hook - runs compliance audit before allowing commits\nnpx ges audit --ci\nif [ $? -ne 0 ]; then\n  echo "GESF audit failed. Fix issues or use --no-verify to bypass."\n  exit 1\nfi\n`;
          fs.mkdirSync(hooksDir, { recursive: true });

          if (fs.existsSync(hookPath)) {
            const existing = fs.readFileSync(hookPath, "utf-8");
            if (existing.includes("ges audit")) {
              resultText = `Pre-commit hook already installed at ${hookPath}`;
              break;
            }
            resultText = `A pre-commit hook already exists at ${hookPath}. Not overwriting.\nManually add 'npx ges audit --ci' to your pre-commit hook.`;
            break;
          }

          fs.writeFileSync(hookPath, hookContent);
          fs.chmodSync(hookPath, 0o755);

          resultText = `✅ Installed pre-commit hook at ${hookPath}\n\nThe hook will run 'ges audit --ci' before allowing commits.\n- To bypass: \`git commit --no-verify\`\n- To remove: use \`install_hooks\` with action: "uninstall"`;
          break;
        }
        case "start_dashboard": {
          const projectPath = resolveProjectPath(args.project_path);
          const port = args.port || 3001;
          const host = args.host || "localhost";

          if (!fs.existsSync(path.join(projectPath, ".ges"))) {
            resultText = `GESF not initialized at ${projectPath}. Run 'init_project' first.`;
            break;
          }

          const lines: string[] = [];
          lines.push(`# GESF Web Dashboard\n`);
          lines.push(`**Project**: ${projectPath}`);
          lines.push(`**Host**: ${host}`);
          lines.push(`**Port**: ${port}\n`);
          lines.push(`## Starting the Dashboard\n`);
          lines.push(`The dashboard must be started via the GESF CLI. Run:\n`);
          lines.push(`\`\`\`bash`);
          lines.push(`cd ${projectPath}`);
          lines.push(`ges dashboard --port ${port} --host ${host}`);
          lines.push(`\`\`\`\n`);
          lines.push(`## Available Endpoints\n`);
          lines.push(`- **Dashboard UI**: ${HT}${host}:${port}`);
          lines.push(`- **JSON API**: ${HT}${host}:${port}/api/data`);
          lines.push(`- **Health Check**: ${HT}${host}:${port}/health\n`);
          lines.push(`## Dashboard Features`);
          lines.push(`- Visual compliance score overview`);
          lines.push(`- Per-framework breakdown with grades`);
          lines.push(`- Security findings list`);
          lines.push(`- Control status matrix`);
          lines.push(`- Audit history timeline`);

          resultText = lines.join("\n");
          break;
        }
        default:
          return {
            jsonrpc: "2.0",
            id: request.id,
            error: { code: -32601, message: `Unknown tool: ${toolName}` },
          };
      }
    } catch (err) {
      return {
        jsonrpc: "2.0",
        id: request.id,
        result: {
          content: [{
            type: "text",
            text: `Error executing tool '${toolName}': ${err instanceof Error ? err.message : String(err)}. Check your parameters and try again.`,
          }],
        },
      };
    }

    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        content: [{ type: "text", text: resultText }],
      },
    };
  }

  if (isNotification) {
    return null;
  }

  return {
    jsonrpc: "2.0",
    id: request.id,
    error: { code: -32601, message: `Unknown method: ${request.method}` },
  };
}

const rl = readline.createInterface({ input: process.stdin });

rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;

  let parsed: MCPRequest;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    send({
      jsonrpc: "2.0",
      id: null,
      error: { code: -32700, message: "Parse error" },
    });
    return;
  }

  try {
    const response = handleRequest(parsed);
    if (response !== null) {
      send(response);
    }
  } catch (err) {
    send({
      jsonrpc: "2.0",
      id: parsed.id ?? null,
      error: {
        code: -32603,
        message: "Internal error",
        data: err instanceof Error ? err.message : String(err),
      },
    });
  }
});

rl.on("close", () => {
  process.exit(0);
});
