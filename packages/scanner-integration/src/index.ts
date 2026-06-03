import { execSync } from "node:child_process";

export interface ScanResult {
  scanner: string;
  status: "pass" | "fail" | "error" | "not-available";
  findings: number;
  output: string;
}

export function runNpmAudit(): ScanResult {
  return runScan("npm audit", "npm audit", "--audit-level=high --json");
}

export function runPnpmAudit(): ScanResult {
  return runScan("pnpm audit", "pnpm audit", "--audit-level=high --json");
}

export function runTrivy(): ScanResult {
  return runScan("Trivy", "trivy", "fs --severity HIGH,CRITICAL .");
}

export function runGitleaks(): ScanResult {
  return runScan("Gitleaks", "gitleaks", "detect --source . --no-git");
}

export function runSemgrep(): ScanResult {
  return runScan("Semgrep", "semgrep", "--config auto --json .");
}

export function runSyft(): ScanResult {
  return runScan("Syft (SBOM)", "syft", ". -o cyclonedx-json");
}

export function runTrivySbom(): ScanResult {
  return runScan("Trivy SBOM", "trivy", "sbom . --format cyclonedx-json");
}

export function runGrype(): ScanResult {
  return runScan("Grype (SBOM scan)", "grype", "sbom:./sbom.json --fail-on high");
}

export function runNpmSbom(): ScanResult {
  return runScan("npm SBOM", "npm", "sbom --sbom-type cyclodedx");
}

function runScan(name: string, command: string, args: string): ScanResult {
  try {
    const output = execSync(`${command} ${args}`, {
      encoding: "utf-8",
      timeout: 120000,
      stdio: ["pipe", "pipe", "pipe"],
    });
    return {
      scanner: name,
      status: "pass",
      findings: 0,
      output: output.slice(0, 1000),
    };
  } catch (error: unknown) {
    const err = error as { stdout?: string; stderr?: string; status?: number };
    if (err.status === 1) {
      return {
        scanner: name,
        status: "fail",
        findings: -1,
        output: (err.stdout || err.stderr || "").slice(0, 1000),
      };
    }
    return {
      scanner: name,
      status: "not-available",
      findings: 0,
      output: (err.stderr || `${name} not found`).slice(0, 500),
    };
  }
}

export interface SbomResult {
  scanner: string;
  status: "generated" | "error" | "not-available";
  format: string;
  components: number;
  output: string;
}

export function runAllScans(): ScanResult[] {
  return [
    runNpmAudit(),
    runTrivy(),
    runGitleaks(),
    runSemgrep(),
  ];
}

export function runAllSbomScans(): ScanResult[] {
  return [
    runSyft(),
    runTrivySbom(),
    runGrype(),
    runNpmSbom(),
  ];
}

export function runAllScansWithSbom(): ScanResult[] {
  return [
    ...runAllScans(),
    ...runAllSbomScans(),
  ];
}

export function formatScanResults(results: ScanResult[]): string {
  const lines: string[] = ["", "  Security Scan Results", "  -------------------"];
  for (const result of results) {
    const statusIcon = result.status === "pass" ? "PASS" : result.status === "fail" ? "FAIL" : result.status === "error" ? "ERROR" : "N/A";
    lines.push(`  ${result.scanner.padEnd(20)} ${statusIcon}`);
  }
  lines.push("");
  return lines.join("\n");
}

export function formatSbomResults(results: ScanResult[]): string {
  const sbomScanners = results.filter((r) =>
    r.scanner.includes("SBOM") || r.scanner.includes("Syft") || r.scanner.includes("Grype")
  );
  if (sbomScanners.length === 0) return "";

  const lines: string[] = ["", "  SBOM Scan Results", "  -----------------"];
  for (const result of sbomScanners) {
    const statusIcon = result.status === "pass" ? "GENERATED" : result.status === "fail" ? "FAIL" : result.status === "error" ? "ERROR" : "N/A";
    lines.push(`  ${result.scanner.padEnd(24)} ${statusIcon}`);
  }
  lines.push("");
  return lines.join("\n");
}
