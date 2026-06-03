#!/usr/bin/env node

import * as readline from "node:readline";
import * as fs from "node:fs";
import * as path from "node:path";
import { getAllPacks, getPacksForProjectType, getPack } from "@greenarmor/ges-policy-engine";
import { createGDPRControls } from "@greenarmor/ges-compliance-engine";
import { generateScoreFile, formatScoreOutput, computeGrade } from "@greenarmor/ges-scoring-engine";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import type { Control, ProjectType, FrameworkName, ScoreFile, ControlOverride, ControlStatus } from "@greenarmor/ges-core";
import { GESF_VERSION } from "@greenarmor/ges-core";

type AutoFixAction = {
  type: "create" | "modify" | "append" | "npm-install";
  filePath: string;
  content?: string;
  search?: string;
  replace?: string;
  description: string;
  ruleId: string;
};

type AutoFixResult = {
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

function createAutoFixPlan(root: string, findings: Finding[], filterRuleIds?: Set<string>): { actions: AutoFixAction[]; warnings: string[] } {
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

function applyAutoFixAction(root: string, action: AutoFixAction): AutoFixResult {
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
  const candidates = ["src/index.ts", "src/index.js", "src/app.ts", "src/app.js", "src/server.ts", "src/server.js", "src/main.ts", "src/main.js", "index.ts", "index.js", "app.ts", "app.js"];
  for (const c of candidates) {
    if (fs.existsSync(path.join(root, c))) return c;
  }
  return null;
}

function hasDep(root: string, dep: string): boolean {
  const pkg = readJsonFileSafe<Record<string, unknown>>(path.join(root, "package.json"));
  if (!pkg) return false;
  const deps = { ...(pkg.dependencies as Record<string, string>), ...(pkg.devDependencies as Record<string, string>) };
  return dep in deps;
}

function readFileSafe(filePath: string): string | null {
  try { return fs.readFileSync(filePath, "utf-8"); } catch { return null; }
}

function buildHelmetFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const actions: AutoFixAction[] = [
    { type: "npm-install", filePath: "package.json", description: "Install helmet", ruleId: "CONFIG-001" },
  ];
  const content = readFileSafe(path.join(root, appFile));
  if (content && content.includes("const app = express()")) {
    actions.push({ type: "modify", filePath: appFile, search: "const app = express()", replace: "const app = express()\n\napp.use(helmet())", description: "Add helmet middleware", ruleId: "CONFIG-001" });
  } else {
    actions.push({ type: "append", filePath: appFile, content: "\nimport helmet from 'helmet';\napp.use(helmet());\n", description: "Add helmet import and middleware", ruleId: "CONFIG-001" });
  }
  return actions;
}

function buildCorsFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  return [
    { type: "npm-install", filePath: "package.json", description: "Install cors", ruleId: "CONFIG-002" },
    { type: "append", filePath: appFile, content: "\nimport cors from 'cors';\napp.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'] }));\n", description: "Add CORS with configured origins", ruleId: "CONFIG-002" },
  ];
}

function buildEnvGitignoreFix(root: string): AutoFixAction[] {
  const gi = fs.existsSync(path.join(root, ".gitignore")) ? ".gitignore" : null;
  if (!gi) return buildGitignoreCreateFix(root);
  const content = readFileSafe(path.join(root, gi)) || "";
  if (content.includes(".env")) return [];
  return [{ type: "append", filePath: ".gitignore", content: "\n.env\n.env.*\n!.env.example\n", description: "Add .env to .gitignore", ruleId: "CONFIG-004" }];
}

function buildDockerNonRootFix(root: string): AutoFixAction[] {
  if (!fs.existsSync(path.join(root, "Dockerfile"))) return [];
  return [{ type: "append", filePath: "Dockerfile", content: "\nUSER node\n", description: "Add non-root USER to Dockerfile", ruleId: "CONFIG-005" }];
}

function buildTLSFix(root: string, f: Finding): AutoFixAction[] {
  return [{ type: "modify", filePath: f.file, search: "NODE_TLS_REJECT_UNAUTHORIZED=0", replace: "NODE_TLS_REJECT_UNAUTHORIZED=1", description: "Re-enable TLS verification", ruleId: "CONFIG-007" }];
}

function buildGitignoreCreateFix(root: string): AutoFixAction[] {
  return [{ type: "create", filePath: ".gitignore", content: "node_modules/\n.env\n.env.*\n!.env.example\ndist/\nbuild/\n*.key\n*.pem\ncoverage/\n.DS_Store\n", description: "Create .gitignore with security entries", ruleId: "CONFIG-008" }];
}

function buildGitignoreEntryFix(root: string, f: Finding): AutoFixAction[] {
  const entry = f.fix.replace("Add ", "").replace(" to .gitignore.", "");
  if (!fs.existsSync(path.join(root, ".gitignore"))) return buildGitignoreCreateFix(root);
  return [{ type: "append", filePath: ".gitignore", content: `\n${entry}\n`, description: `Add ${entry} to .gitignore`, ruleId: "CONFIG-009" }];
}

function buildLoggingFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  const hasSrc = fs.existsSync(path.join(root, "src"));
  const loggerPath = hasSrc ? "src/lib/logger.ts" : "lib/logger.ts";
  const actions: AutoFixAction[] = [
    { type: "npm-install", filePath: "package.json", description: "Install pino logger", ruleId: "CONFIG-010" },
    { type: "create", filePath: loggerPath, content: `import pino from 'pino';\n\nconst logger = pino({\n  level: process.env.LOG_LEVEL || 'info',\n  timestamp: pino.stdTimeFunctions.isoTime,\n});\n\ninterface AuditLogParams {\n  userId: string;\n  action: string;\n  resource: string;\n  ipAddress: string;\n  metadata?: Record<string, unknown>;\n}\n\nexport function auditLog(params: AuditLogParams): void {\n  logger.info({ ...params, timestamp: new Date().toISOString(), type: 'audit' });\n}\n\nexport default logger;\n`, description: "Create structured logger with audit logging", ruleId: "CONFIG-010" },
  ];
  if (appFile) {
    actions.push({ type: "append", filePath: appFile, content: `\nimport logger from './${hasSrc ? "lib/logger" : (hasSrc ? "src/lib/logger" : "lib/logger")}';\n`, description: "Import logger", ruleId: "CONFIG-010" });
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
  const match = line.match(/(\w+)\s*[:=]\s*['"]([^'"]+)['"]/);
  if (match) {
    const varName = match[1];
    const value = match[2];
    const envFile = fs.existsSync(path.join(root, ".env")) ? ".env" : ".env";
    actions.push({ type: "append", filePath: envFile, content: `\n${varName}=${value}\n`, description: `Move ${varName} to .env`, ruleId: "SECRETS-001" });
    actions.push({ type: "modify", filePath: f.file, search: line, replace: `${varName}: process.env.${varName}`, description: `Replace hardcoded ${varName}`, ruleId: "SECRETS-001" });
    actions.push(...buildEnvGitignoreFix(root));
  }
  return actions;
}

function buildWeakHashFix(root: string, f: Finding): AutoFixAction[] {
  const content = readFileSafe(path.join(root, f.file));
  if (!content) return [];
  const lines = content.split("\n");
  const idx = (f.line || 1) - 1;
  if (idx >= lines.length) return [];
  const line = lines[idx];
  let replacement = line;
  if (/createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)/.test(line)) {
    replacement = line.replace(/createHash\s*\(\s*['"](?:md5|sha1)['"]\s*\)/, "createHash('sha256')");
  } else if (/hashlib\.md5\(/i.test(line)) {
    replacement = line.replace(/hashlib\.md5\(/gi, "hashlib.sha256(");
  } else if (/hashlib\.sha1\(/i.test(line)) {
    replacement = line.replace(/hashlib\.sha1\(/gi, "hashlib.sha256(");
  }
  if (replacement === line) return [];
  return [{ type: "modify", filePath: f.file, search: line, replace: replacement, description: "Replace weak hash with SHA-256", ruleId: "CRYPTO-001" }];
}

function buildPasswordFix(root: string, _f: Finding): AutoFixAction[] {
  const hasSrc = fs.existsSync(path.join(root, "src"));
  const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
  const actions: AutoFixAction[] = [
    { type: "npm-install", filePath: "package.json", description: "Install argon2", ruleId: "CRYPTO-003" },
  ];
  if (!fs.existsSync(path.join(root, authPath))) {
    actions.push({ type: "create", filePath: authPath, content: `import argon2 from 'argon2';\n\nexport async function hashPassword(password: string): Promise<string> {\n  return argon2.hash(password, { type: argon2.argon2id });\n}\n\nexport async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {\n  return argon2.verify(hashedPassword, inputPassword);\n}\n`, description: "Create Argon2id password utility", ruleId: "CRYPTO-003" });
  }
  return actions;
}

function buildRateLimitFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const isExpress = hasDep(root, "express");
  const isFastify = hasDep(root, "fastify");
  if (isExpress) {
    return [
      { type: "npm-install", filePath: "package.json", description: "Install express-rate-limit", ruleId: "AUTH-002" },
      { type: "append", filePath: appFile, content: `\nimport rateLimit from 'express-rate-limit';\n\nconst limiter = rateLimit({\n  windowMs: 15 * 60 * 1000,\n  max: 100,\n  standardHeaders: true,\n  legacyHeaders: false,\n});\napp.use(limiter);\n`, description: "Add rate limiting (100 req/15min)", ruleId: "AUTH-002" },
    ];
  } else if (isFastify) {
    return [
      { type: "npm-install", filePath: "package.json", description: "Install @fastify/rate-limit", ruleId: "AUTH-002" },
      { type: "append", filePath: appFile, content: `\nimport rateLimit from '@fastify/rate-limit';\napp.register(rateLimit, { max: 100, timeWindow: '15 minutes' });\n`, description: "Add rate limiting to Fastify", ruleId: "AUTH-002" },
    ];
  }
  return [];
}

function buildSessionTimeoutFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const isExpress = hasDep(root, "express");
  if (!isExpress) return [{ type: "append", filePath: appFile, content: "\nconst SESSION_TIMEOUT_MS = 30 * 60 * 1000;\n", description: "Add session timeout constant", ruleId: "AUTH-003" }];
  const content = readFileSafe(path.join(root, appFile)) || "";
  if (content.includes("session(")) return [];
  return [
    { type: "npm-install", filePath: "package.json", description: "Install express-session", ruleId: "AUTH-003" },
    { type: "append", filePath: appFile, content: `\nimport session from 'express-session';\n\napp.use(session({\n  secret: process.env.SESSION_SECRET || 'change-me-in-production',\n  resave: false,\n  saveUninitialized: false,\n  cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true, maxAge: 30 * 60 * 1000 },\n}));\n`, description: "Add session with 30-min timeout", ruleId: "AUTH-003" },
  ];
}

function buildCORSWildcardFix(root: string): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  if (!appFile) return [];
  const content = readFileSafe(path.join(root, appFile)) || "";
  const actions: AutoFixAction[] = [];
  if (content.includes("origin: '*'")) {
    actions.push({ type: "modify", filePath: appFile, search: "origin: '*'", replace: "origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']", description: "Replace CORS wildcard", ruleId: "AUTH-004" });
  }
  if (content.includes('origin:"*"')) {
    actions.push({ type: "modify", filePath: appFile, search: 'origin:"*"', replace: "origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000']", description: "Replace CORS wildcard", ruleId: "AUTH-004" });
  }
  return actions;
}

function buildTimestampsFix(root: string, f: Finding): AutoFixAction[] {
  if (!f.file.endsWith(".prisma")) return [];
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

function buildSoftDeleteFix(root: string, f: Finding): AutoFixAction[] {
  if (!f.file.endsWith(".prisma")) return [];
  const content = readFileSafe(path.join(root, f.file));
  if (!content) return [];
  const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
  if (!modelMatch || modelMatch.length === 0) return [];
  const block = modelMatch[0];
  const closingBrace = block.lastIndexOf("}");
  if (closingBrace === -1) return [];
  return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  deletedAt  DateTime?" + block.slice(closingBrace), description: "Add deletedAt to Prisma model", ruleId: "DB-002" }];
}

function buildUserAuditFix(root: string, f: Finding): AutoFixAction[] {
  if (!f.file.endsWith(".prisma")) return [];
  const content = readFileSafe(path.join(root, f.file));
  if (!content) return [];
  const modelMatch = content.match(/model\s+\w+\s*\{[^}]*\}/g);
  if (!modelMatch || modelMatch.length === 0) return [];
  const block = modelMatch[0];
  const closingBrace = block.lastIndexOf("}");
  if (closingBrace === -1) return [];
  return [{ type: "modify", filePath: f.file, search: block, replace: block.slice(0, closingBrace) + "\n  createdBy  String?\n  updatedBy  String?" + block.slice(closingBrace), description: "Add createdBy/updatedBy columns", ruleId: "DB-003" }];
}

function buildAuditModelFix(root: string): AutoFixAction[] {
  const content = readFileSafe(path.join(root, "prisma/schema.prisma"));
  if (!content) return [];
  return [{ type: "append", filePath: "prisma/schema.prisma", content: "\\nmodel Audit {\\n  id        Int      @id @default(autoincrement())\\n  userId    String\\n  action    String\\n  resource  String\\n  timestamp DateTime @default(now())\\n  ipAddress String\\n  metadata  Json?\\n}\\n", description: "Add Audit model to Prisma schema", ruleId: "DB-004" }];
}

function getNpmInstallsFromActions(actions: AutoFixAction[]): string[] {
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
  const cryptoPath = hasSrc ? "src/lib/encryption.ts" : "lib/encryption.ts";
  return [
    { type: "npm-install", filePath: "package.json", description: "Node.js crypto is built-in", ruleId: "GDPR-ART32-002" },
    { type: "create", filePath: cryptoPath, content: `import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'node:crypto';\n\nconst ALGORITHM = 'aes-256-gcm';\nconst IV_LENGTH = 16;\nconst TAG_LENGTH = 16;\n\nfunction deriveKey(secret: string, salt: Buffer): Buffer {\n  return scryptSync(secret, salt, 32);\n}\n\nexport function encrypt(plaintext: string, secret: string): string {\n  const salt = randomBytes(16);\n  const key = deriveKey(secret, salt);\n  const iv = randomBytes(IV_LENGTH);\n  const cipher = createCipheriv(ALGORITHM, key, iv);\n  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);\n  const tag = cipher.getAuthTag();\n  return Buffer.concat([salt, iv, tag, encrypted]).toString('base64');\n}\n\nexport function decrypt(ciphertext: string, secret: string): string {\n  const data = Buffer.from(ciphertext, 'base64');\n  const salt = data.subarray(0, 16);\n  const iv = data.subarray(16, 32);\n  const tag = data.subarray(32, 48);\n  const encrypted = data.subarray(48);\n  const key = deriveKey(secret, salt);\n  const decipher = createDecipheriv(ALGORITHM, key, iv);\n  decipher.setAuthTag(tag);\n  return decipher.update(encrypted) + decipher.final('utf8');\n}\n`, description: "Create AES-256-GCM encryption utility", ruleId: "GDPR-ART32-002" },
  ];
}

function buildEncryptionInTransitImpl(root: string, _hasSrc: boolean): AutoFixAction[] {
  const appFile = findMainAppFile(root);
  const actions: AutoFixAction[] = [];
  if (appFile) {
    actions.push({ type: "append", filePath: appFile, content: "\nif (process.env.NODE_ENV === 'production') {\n  app.use((req, res, next) => {\n    if (req.headers['x-forwarded-proto'] === 'http') {\n      return res.redirect(301, `https://${req.headers.host}${req.url}`);\n    }\n    next();\n  });\n}\n", description: "Add HTTPS redirect middleware", ruleId: "GDPR-ART32-003" });
  }
  return actions;
}

function buildUserIdentificationImpl(root: string, hasSrc: boolean): AutoFixAction[] {
  const authPath = hasSrc ? "src/lib/auth.ts" : "lib/auth.ts";
  if (fs.existsSync(path.join(root, authPath))) return [];
  return [
    { type: "npm-install", filePath: "package.json", description: "Install argon2 for password hashing", ruleId: "GDPR-ART32-004" },
    { type: "create", filePath: authPath, content: `import argon2 from 'argon2';\n\nexport async function hashPassword(password: string): Promise<string> {\n  return argon2.hash(password, { type: argon2.argon2id });\n}\n\nexport async function verifyPassword(hashedPassword: string, inputPassword: string): Promise<boolean> {\n  return argon2.verify(hashedPassword, inputPassword);\n}\n`, description: "Create auth utility with Argon2id", ruleId: "GDPR-ART32-004" },
  ];
}

function buildIntegrityControlsImpl(root: string, hasSrc: boolean): AutoFixAction[] {
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
  const ghDir = path.join(root, ".github/workflows");
  return [
    { type: "create", filePath: ".github/workflows/security-scan.yml", content: `name: Security Scan\non:\n  push:\n    branches: [main, master]\n  pull_request:\n    branches: [main, master]\n  schedule:\n    - cron: '0 6 * * 1'\n\njobs:\n  security:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-node@v4\n        with:\n          node-version: '22'\n      - run: npm ci\n      - name: npm audit\n        run: npm audit --audit-level=high\n        continue-on-error: true\n      - name: Run GESF compliance check\n        run: npx @greenarmor/ges audit --ci\n`, description: "Create security scanning GitHub Actions workflow", ruleId: "GDPR-ART32-009" },
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
