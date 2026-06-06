import { execSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

export interface DependencyFinding {
  package: string;
  version: string;
  severity: "critical" | "high" | "medium" | "low";
  type: "vulnerability" | "license" | "outdated" | "deprecated";
  description: string;
  recommendation: string;
}

export interface DependencyReport {
  totalDeps: number;
  findings: DependencyFinding[];
  licenseSummary: Record<string, number>;
  outdatedCount: number;
  deprecatedCount: number;
  vulnerabilityCount: number;
}

export function analyzeDependencies(projectPath: string = "."): DependencyReport {
  const findings: DependencyFinding[] = [];
  let totalDeps = 0;
  const licenseSummary: Record<string, number> = {};
  let outdatedCount = 0;
  let deprecatedCount = 0;
  let vulnerabilityCount = 0;

  if (existsSync(join(projectPath, "package.json"))) {
    const result = analyzeNodeProject(projectPath);
    findings.push(...result.findings);
    totalDeps += result.totalDeps;
    Object.assign(licenseSummary, result.licenseSummary);
    outdatedCount += result.outdatedCount;
    deprecatedCount += result.deprecatedCount;
    vulnerabilityCount += result.vulnerabilityCount;
  }

  if (existsSync(join(projectPath, "requirements.txt")) || existsSync(join(projectPath, "pyproject.toml"))) {
    const result = analyzePythonProject(projectPath);
    findings.push(...result.findings);
    totalDeps += result.totalDeps;
    Object.assign(licenseSummary, result.licenseSummary);
    vulnerabilityCount += result.vulnerabilityCount;
  }

  if (existsSync(join(projectPath, "Cargo.toml"))) {
    const result = analyzeRustProject(projectPath);
    findings.push(...result.findings);
    totalDeps += result.totalDeps;
    vulnerabilityCount += result.vulnerabilityCount;
  }

  if (existsSync(join(projectPath, "go.mod"))) {
    const result = analyzeGoProject(projectPath);
    findings.push(...result.findings);
    totalDeps += result.totalDeps;
    vulnerabilityCount += result.vulnerabilityCount;
  }

  return { totalDeps, findings, licenseSummary, outdatedCount, deprecatedCount, vulnerabilityCount };
}

interface PartialReport {
  totalDeps: number;
  findings: DependencyFinding[];
  licenseSummary: Record<string, number>;
  outdatedCount: number;
  deprecatedCount: number;
  vulnerabilityCount: number;
}

function analyzeNodeProject(projectPath: string): PartialReport {
  const findings: DependencyFinding[] = [];
  const licenseSummary: Record<string, number> = {};
  let totalDeps = 0;
  let outdatedCount = 0;
  let deprecatedCount = 0;
  let vulnerabilityCount = 0;

  try {
    const pkgContent = readFileSync(join(projectPath, "package.json"), "utf-8");
    const pkg = JSON.parse(pkgContent);
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    totalDeps = Object.keys(deps).length;

    for (const [name, version] of Object.entries(deps)) {
      if (isDeprecatedNodePackage(name)) {
        deprecatedCount++;
        findings.push({
          package: name,
          version: version as string,
          severity: "medium",
          type: "deprecated",
          description: `Package "${name}" is deprecated or known to have maintenance issues.`,
          recommendation: getDeprecatedRecommendation(name),
        });
      }

      if (hasCopyleftLicense(name)) {
        licenseSummary["copyleft"] = (licenseSummary["copyleft"] || 0) + 1;
        findings.push({
          package: name,
          version: version as string,
          severity: "medium",
          type: "license",
          description: `Package "${name}" may use a copyleft license (GPL, AGPL). Verify compatibility with your project license.`,
          recommendation: "Review the package license. Consider an alternative with a permissive license (MIT, Apache-2.0, BSD).",
        });
      }
    }
  } catch {
    // not parseable
  }

  try {
    const auditOutput = execSync("npm audit --json", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const audit = JSON.parse(auditOutput);
    const vulns = audit.vulnerabilities || audit.vulnerabilities || {};

    for (const [name, info] of Object.entries(vulns) as [string, any][]) {
      const severity = info.severity || "medium";
      vulnerabilityCount++;
      findings.push({
        package: name,
        version: info.range || "unknown",
        severity: severity as DependencyFinding["severity"],
        type: "vulnerability",
        description: `Vulnerability in "${name}": ${info.title || info.advisory || "Security vulnerability detected"}`,
        recommendation: info.fixAvailable ? `Update to ${typeof info.fixAvailable === "object" ? info.fixAvailable.version : "latest"}` : "No fix available. Consider replacing this dependency.",
      });
    }
  } catch {
    // npm audit not available or failed
  }

  try {
    const outdatedOutput = execSync("npm outdated --json", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (outdatedOutput.trim()) {
      const outdated = JSON.parse(outdatedOutput);
      for (const [name, info] of Object.entries(outdated) as [string, any][]) {
        outdatedCount++;
        findings.push({
          package: name,
          version: info.current || "unknown",
          severity: "low",
          type: "outdated",
          description: `Package "${name}" is outdated: ${info.current} -> ${info.latest}`,
          recommendation: `Update with: npm install ${name}@latest`,
        });
      }
    }
  } catch {
    // npm outdated not available or failed
  }

  if (!licenseSummary["permissive"]) licenseSummary["permissive"] = totalDeps - (licenseSummary["copyleft"] || 0);

  return { totalDeps, findings, licenseSummary, outdatedCount, deprecatedCount, vulnerabilityCount };
}

function analyzePythonProject(projectPath: string): PartialReport {
  const findings: DependencyFinding[] = [];
  let totalDeps = 0;
  let vulnerabilityCount = 0;

  try {
    const reqFile = existsSync(join(projectPath, "requirements.txt"))
      ? readFileSync(join(projectPath, "requirements.txt"), "utf-8")
      : readFileSync(join(projectPath, "pyproject.toml"), "utf-8");

    const deps = reqFile
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !l.startsWith("#") && !l.startsWith("["));
    totalDeps = deps.length;
  } catch {
    // not readable
  }

  try {
    const pipAudit = execSync("pip-audit --format json 2>/dev/null || pip install pip-audit && pip-audit --format json", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 60000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (pipAudit.trim()) {
      const audit = JSON.parse(pipAudit);
      for (const vuln of audit.dependencies || []) {
        vulnerabilityCount++;
        findings.push({
          package: vuln.name,
          version: vuln.version || "unknown",
          severity: "high",
          type: "vulnerability",
          description: `Python vulnerability in "${vuln.name}": ${vuln.vulns?.[0]?.id || "Security issue"}`,
          recommendation: `Upgrade ${vuln.name} to ${vuln.vulns?.[0]?.fix_versions?.[0] || "latest"}`,
        });
      }
    }
  } catch {
    // pip-audit not available
  }

  return { totalDeps, findings, licenseSummary: {}, outdatedCount: 0, deprecatedCount: 0, vulnerabilityCount };
}

function analyzeRustProject(projectPath: string): PartialReport {
  const findings: DependencyFinding[] = [];
  let totalDeps = 0;
  let vulnerabilityCount = 0;

  try {
    const cargoLock = readFileSync(join(projectPath, "Cargo.lock"), "utf-8");
    totalDeps = (cargoLock.match(/^name = /gm) || []).length;
  } catch {
    // no lock file
  }

  try {
    const cargoAudit = execSync("cargo audit --json 2>/dev/null", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    if (cargoAudit.trim()) {
      const audit = JSON.parse(cargoAudit);
      for (const vuln of audit.vulnerabilities || []) {
        vulnerabilityCount++;
        findings.push({
          package: vuln.name || "unknown",
          version: vuln.version || "unknown",
          severity: "high",
          type: "vulnerability",
          description: `Rust advisory: ${vuln.advisory?.title || "Security vulnerability"}`,
          recommendation: `Update ${vuln.name} to latest version.`,
        });
      }
    }
  } catch {
    // cargo audit not installed
  }

  return { totalDeps, findings, licenseSummary: {}, outdatedCount: 0, deprecatedCount: 0, vulnerabilityCount };
}

function analyzeGoProject(projectPath: string): PartialReport {
  const findings: DependencyFinding[] = [];
  let totalDeps = 0;
  let vulnerabilityCount = 0;

  try {
    const goList = execSync("go list -m all 2>/dev/null", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    totalDeps = goList.trim().split("\n").length - 1; // minus the main module
  } catch {
    // go not available
  }

  try {
    const govuln = execSync("govulncheck ./... 2>/dev/null", {
      cwd: projectPath,
      encoding: "utf-8",
      timeout: 30000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    const vulnLines = govuln.split("\n").filter((l) => l.includes("Vulnerability"));
    vulnerabilityCount = vulnLines.length;
    for (const line of vulnLines) {
      findings.push({
        package: "unknown",
        version: "unknown",
        severity: "high",
        type: "vulnerability",
        description: `Go vulnerability: ${line.trim()}`,
        recommendation: "Update affected modules to latest versions.",
      });
    }
  } catch {
    // govulncheck not installed
  }

  return { totalDeps, findings, licenseSummary: {}, outdatedCount: 0, deprecatedCount: 0, vulnerabilityCount };
}

const DEPRECATED_PACKAGES = new Set([
  "request",
  "node-uuid",
  "bcrypt-nodejs",
  "gulp-util",
  "bower",
  "phantomjs",
  "gulp-babel",
  "npmconf",
  "rimraf",
  "left-pad",
  "core-js@2",
  "moment",
  "jquery",
  "lodash",
]);

function isDeprecatedNodePackage(name: string): boolean {
  return DEPRECATED_PACKAGES.has(name);
}

function getDeprecatedRecommendation(name: string): string {
  const alternatives: Record<string, string> = {
    "request": "Use node-fetch, axios, or undici instead.",
    "node-uuid": "Use the uuid package instead.",
    "bcrypt-nodejs": "Use bcrypt or argon2 instead.",
    "bower": "Use npm or yarn instead.",
    "phantomjs": "Use puppeteer or playwright instead.",
    "moment": "Use date-fns, dayjs, or luxon instead.",
    "jquery": "Use modern DOM APIs or a framework (React, Vue, Svelte).",
    "lodash": "Use native JavaScript methods or single-purpose packages.",
    "left-pad": "Use String.prototype.padStart().",
    "rimraf": "Use fs.rm() (Node.js 14+) instead.",
  };
  return alternatives[name] || "Find a maintained alternative on npm.";
}

const COPYLEFT_PACKAGES = new Set([
  "ghost",
  "ffmpeg-static",
]);

function hasCopyleftLicense(name: string): boolean {
  return COPYLEFT_PACKAGES.has(name);
}

export function formatDependencyReport(report: DependencyReport): string {
  const lines: string[] = [
    "",
    "  Dependency Analysis",
    "  --------------------",
    `  Total dependencies: ${report.totalDeps}`,
    `  Vulnerabilities:    ${report.vulnerabilityCount}`,
    `  Outdated:           ${report.outdatedCount}`,
    `  Deprecated:         ${report.deprecatedCount}`,
  ];

  if (Object.keys(report.licenseSummary).length > 0) {
    lines.push("  Licenses:");
    for (const [license, count] of Object.entries(report.licenseSummary)) {
      lines.push(`    ${license}: ${count}`);
    }
  }

  if (report.findings.length > 0) {
    const critical = report.findings.filter((f) => f.severity === "critical");
    const high = report.findings.filter((f) => f.severity === "high");
    const medium = report.findings.filter((f) => f.severity === "medium");
    const low = report.findings.filter((f) => f.severity === "low");

    lines.push("");
    lines.push(`  Findings: ${report.findings.length} total (${critical.length} critical, ${high.length} high, ${medium.length} medium, ${low.length} low)`);
    lines.push("");

    const shown = [...critical, ...high, ...medium].slice(0, 20);
    for (const f of shown) {
      const sev = f.severity.toUpperCase().padEnd(8);
      const type = f.type.toUpperCase().padEnd(12);
      lines.push(`  [${sev}] [${type}] ${f.package}@${f.version}`);
      lines.push(`    ${f.description}`);
      lines.push(`    Fix: ${f.recommendation}`);
      lines.push("");
    }

    const remaining = report.findings.length - shown.length;
    if (remaining > 0) {
      lines.push(`  ... and ${remaining} more findings`);
    }
  } else {
    lines.push("  No dependency issues found.");
  }

  lines.push("");
  return lines.join("\n");
}
