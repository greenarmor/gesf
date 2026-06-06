import { execSync } from "node:child_process";
import { existsSync } from "node:fs";

export { analyzeDependencies, formatDependencyReport } from "./dependency-analysis.js";
export type { DependencyFinding, DependencyReport } from "./dependency-analysis.js";

export interface ScanResult {
  scanner: string;
  status: "pass" | "fail" | "error" | "not-available";
  findings: number;
  output: string;
}

export interface SbomResult {
  scanner: string;
  status: "generated" | "error" | "not-available";
  format: string;
  components: number;
  output: string;
}

export type Ecosystem = "node" | "python" | "rust" | "go" | "ruby" | "java" | "php" | "dotnet" | "unknown";

export type NodePackageManager = "pnpm" | "npm" | "yarn" | "bun";

export type PythonToolchain = "pip" | "poetry" | "pipenv" | "pdm" | "uv";

export interface ProjectDetection {
  ecosystem: Ecosystem;
  nodePackageManager?: NodePackageManager;
  pythonToolchain?: PythonToolchain;
}

const NODE_PM_MARKERS: Array<{ file: string; pm: NodePackageManager }> = [
  { file: "pnpm-lock.yaml", pm: "pnpm" },
  { file: "yarn.lock", pm: "yarn" },
  { file: "bun.lockb", pm: "bun" },
  { file: "package-lock.json", pm: "npm" },
];

const PYTHON_TOOLCHAIN_MARKERS: Array<{ file: string; toolchain: PythonToolchain }> = [
  { file: "uv.lock", toolchain: "uv" },
  { file: "pdm.lock", toolchain: "pdm" },
  { file: "poetry.lock", toolchain: "poetry" },
  { file: "Pipfile.lock", toolchain: "pipenv" },
  { file: "requirements.txt", toolchain: "pip" },
];

export function detectEcosystem(dir: string = "."): Ecosystem {
  return detectProject(dir).ecosystem;
}

export function detectProject(dir: string = "."): ProjectDetection {
  const detection: ProjectDetection = { ecosystem: "unknown" };

  if (NODE_PM_MARKERS.some((m) => existsSync(`${dir}/${m.file}`)) || existsSync(`${dir}/package.json`)) {
    detection.ecosystem = "node";
    for (const marker of NODE_PM_MARKERS) {
      if (existsSync(`${dir}/${marker.file}`)) {
        detection.nodePackageManager = marker.pm;
        break;
      }
    }
    if (!detection.nodePackageManager && existsSync(`${dir}/package.json`)) {
      detection.nodePackageManager = "npm";
    }
    return detection;
  }

  if (PYTHON_TOOLCHAIN_MARKERS.some((m) => existsSync(`${dir}/${m.file}`)) || existsSync(`${dir}/pyproject.toml`)) {
    detection.ecosystem = "python";
    for (const marker of PYTHON_TOOLCHAIN_MARKERS) {
      if (existsSync(`${dir}/${marker.file}`)) {
        detection.pythonToolchain = marker.toolchain;
        break;
      }
    }
    if (!detection.pythonToolchain) {
      detection.pythonToolchain = "pip";
    }
    return detection;
  }

  if (existsSync(`${dir}/Cargo.toml`) || existsSync(`${dir}/Cargo.lock`)) {
    detection.ecosystem = "rust";
    return detection;
  }

  if (existsSync(`${dir}/go.mod`) || existsSync(`${dir}/go.sum`)) {
    detection.ecosystem = "go";
    return detection;
  }

  if (existsSync(`${dir}/Gemfile`) || existsSync(`${dir}/Gemfile.lock`)) {
    detection.ecosystem = "ruby";
    return detection;
  }

  if (existsSync(`${dir}/pom.xml`) || existsSync(`${dir}/build.gradle`) || existsSync(`${dir}/build.gradle.kts`) || existsSync(`${dir}/gradle.lockfile`)) {
    detection.ecosystem = "java";
    return detection;
  }

  if (existsSync(`${dir}/composer.json`) || existsSync(`${dir}/composer.lock`)) {
    detection.ecosystem = "php";
    return detection;
  }

  if (existsSync(`${dir}/packages.lock.json`) || existsSync(`${dir}/nuget.config`)) {
    detection.ecosystem = "dotnet";
    return detection;
  }

  return detection;
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

interface AuditorCandidate {
  name: string;
  command: string;
  args: string;
}

function getNodeAuditor(pm?: NodePackageManager): AuditorCandidate | null {
  const auditors: Record<NodePackageManager, AuditorCandidate> = {
    pnpm: { name: "pnpm audit", command: "pnpm", args: "audit --audit-level=high --json" },
    npm: { name: "npm audit", command: "npm", args: "audit --audit-level=high --json" },
    yarn: { name: "yarn audit", command: "yarn", args: "audit --level high --json" },
    bun: { name: "bun audit", command: "bun", args: "audit --audit-level=high --json" },
  };
  if (pm && auditors[pm]) return auditors[pm];
  return null;
}

function getPythonAuditor(toolchain?: PythonToolchain): AuditorCandidate | null {
  const auditors: Record<PythonToolchain, AuditorCandidate> = {
    pip: { name: "pip-audit", command: "pip-audit", args: "--format json" },
    poetry: { name: "pip-audit", command: "pip-audit", args: "--format json" },
    pipenv: { name: "pip-audit", command: "pip-audit", args: "--format json" },
    pdm: { name: "pip-audit", command: "pip-audit", args: "--format json" },
    uv: { name: "pip-audit", command: "pip-audit", args: "--format json" },
  };
  if (toolchain && auditors[toolchain]) return auditors[toolchain];
  return null;
}

const UNIVERSAL_AUDITORS: Record<Ecosystem, AuditorCandidate[]> = {
  node: [],
  python: [],
  rust: [{ name: "cargo audit", command: "cargo", args: "audit --json" }],
  go: [{ name: "govulncheck", command: "govulncheck", args: "./..." }],
  ruby: [{ name: "bundle-audit", command: "bundle-audit", args: "check --format json" }],
  java: [{ name: "OWASP Dependency-Check", command: "dependency-check", args: "--scan . --format JSON --out /dev/null" }],
  php: [{ name: "composer audit", command: "composer", args: "audit --format json" }],
  dotnet: [{ name: "dotnet audit", command: "dotnet", args: "list package --vulnerable --include-transitive" }],
  unknown: [],
};

export function runDependencyAudit(detection: ProjectDetection): ScanResult {
  let primary: AuditorCandidate | null = null;

  if (detection.ecosystem === "node") {
    primary = getNodeAuditor(detection.nodePackageManager);
  } else if (detection.ecosystem === "python") {
    primary = getPythonAuditor(detection.pythonToolchain);
  }

  if (primary) {
    const result = runScan(primary.name, primary.command, primary.args);
    if (result.status !== "not-available") {
      return result;
    }
  }

  const fallbacks = UNIVERSAL_AUDITORS[detection.ecosystem] || [];
  for (const auditor of fallbacks) {
    const result = runScan(auditor.name, auditor.command, auditor.args);
    if (result.status !== "not-available") {
      return result;
    }
  }

  const tried = [primary, ...fallbacks].filter(Boolean).map((a) => a!.name);
  return {
    scanner: "Dependency Audit",
    status: "not-available",
    findings: 0,
    output: tried.length > 0
      ? `Auditor not found: ${tried.join(", ")}`
      : `No dependency auditor configured for ecosystem: ${detection.ecosystem}`,
  };
}

export function runAllScans(detection?: ProjectDetection): ScanResult[] {
  const detected = detection ?? detectProject();
  return [
    runDependencyAudit(detected),
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
  ];
}

export function runAllScansWithSbom(detection?: ProjectDetection): ScanResult[] {
  return [
    ...runAllScans(detection),
    ...runAllSbomScans(),
  ];
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

export function formatScanResults(results: ScanResult[]): string {
  const lines: string[] = ["", "  Security Scan Results", "  -------------------"];
  for (const result of results) {
    const statusIcon = result.status === "pass" ? "PASS" : result.status === "fail" ? "FAIL" : result.status === "error" ? "ERROR" : "N/A";
    lines.push(`  ${result.scanner.padEnd(28)} ${statusIcon}`);
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
    lines.push(`  ${result.scanner.padEnd(28)} ${statusIcon}`);
  }
  lines.push("");
  return lines.join("\n");
}
