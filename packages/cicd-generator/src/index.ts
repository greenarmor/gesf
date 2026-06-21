import type { ProjectConfig } from "@greenarmor/ges-core";
import * as path from "node:path";

export interface WorkflowFile {
  filePath: string;
  content: string;
}

const GESF_VERSION = "1.5.5";

function gesfInitStep(config: ProjectConfig): string {
  const frameworks = config?.frameworks?.length
    ? config.frameworks.join(",")
    : "GDPR,OWASP,CIS,NIST";
  const type = config?.project_type || "generic-web-application";
  return `        run: ges init --name "${"${{ github.event.repository.name }}"}" --type "${type}" --frameworks "${frameworks}" --country "US-CA" --force`;
}

function nodeSetupStep(): string {
  return [
    "      - name: Setup Node.js",
    "        uses: actions/setup-node@v4",
    "        with:",
    "          node-version: '22'",
  ].join("\n");
}

function gesfInstallStep(): string {
  return [
    "      - name: Install GESF",
    `        run: npm install -g @greenarmor/ges@${GESF_VERSION}`,
  ].join("\n");
}

const GATE_HEADER = `# ═══════════════════════════════════════════════════════════════
# GESF Security Gate — blocks PR merges on failures.
# To enable enforcement: Settings → Branches → Branch protection rules
#   → Require status checks → add the job name below.
# ═══════════════════════════════════════════════════════════════`;

const ON_TRIGGER_DAILY = `on:
  push:
  pull_request:
  schedule:
    - cron: '0 6 * * *'

# Triggers on ALL branches and PRs. Branch protection rules
# enforce the gate on the default branch (main/master/trunk/auto).`;

const ON_TRIGGER_NOSCHEDULE = `on:
  push:
  pull_request:

# Triggers on ALL branches and PRs. Branch protection rules
# enforce the gate on the default branch (main/master/trunk/auto).`;

const DEFAULT_BRANCH_COND = "github.ref == format('refs/heads/{0}', github.event.repository.default_branch)";

/**
 * Compliance Gate Workflow
 *
 * GESF's SUPREME authority — its 9 built-in scanners are unique (no
 * external tool provides them): secrets, crypto, code-security, auth,
 * config, database, IaC, governance, injection.
 *
 * Gate behavior: `ges audit --ci` exits non-zero on critical findings.
 */
export function generateComplianceWorkflow(config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "compliance.yml"),
    content: `name: Compliance Gate

${GATE_HEADER}

${ON_TRIGGER_DAILY}

permissions:
  contents: write
  pull-requests: read

jobs:
  compliance:
    name: GESF Compliance Gate
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

${nodeSetupStep()}

${gesfInstallStep()}

      - name: Initialize GESF
${gesfInitStep(config)}

      - name: Run Compliance Audit
        run: ges audit --ci

      - name: Generate Compliance Score
        run: ges score --ci

      - name: Generate Compliance Badge
        if: ${DEFAULT_BRANCH_COND}
        run: ges badge

      - name: Commit Compliance Badge
        if: ${DEFAULT_BRANCH_COND}
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add badge.svg README.md || true
          git diff --cached --quiet || git commit -m "Update compliance badge [skip ci]"
          git push

      - name: Upload Compliance Report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: compliance-report
          path: reports/
`,
  };
}

/**
 * Security Gate Workflow (Semgrep SAST)
 *
 * Uses the maintained Semgrep GitHub Action for SAST scanning with
 * native GitHub integration (Security tab, PR annotations).
 *
 * Gate behavior: Semgrep exits non-zero on blocking findings.
 */
export function generateSecurityWorkflow(_config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "security.yml"),
    content: `name: Security Gate (Semgrep)

${GATE_HEADER}

${ON_TRIGGER_DAILY}

jobs:
  semgrep:
    name: Semgrep SAST
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto
`,
  };
}

/**
 * Dependency Gate Workflow (Trivy + audit)
 *
 * Trivy filesystem scan + package-manager-aware audit.
 * Auto-detects npm, pnpm, or yarn via lockfile presence.
 *
 * Gate behavior: Trivy exits non-zero on CRITICAL/HIGH. Audit
 * exits non-zero on HIGH+.
 */
export function generateDependencyScanWorkflow(_config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "dependency-scan.yml"),
    content: `name: Dependency Gate (Trivy)

${GATE_HEADER}

${ON_TRIGGER_DAILY}

jobs:
  dependency-scan:
    name: Trivy + Dependency Audit
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

${nodeSetupStep()}

      - name: Setup pnpm
        if: hashFiles('pnpm-lock.yaml') != ''
        uses: pnpm/action-setup@v4

      - name: Install dependencies and audit (pnpm)
        if: hashFiles('pnpm-lock.yaml') != ''
        run: |
          pnpm install --frozen-lockfile
          pnpm audit --audit-level=high

      - name: Install dependencies and audit (npm)
        if: hashFiles('pnpm-lock.yaml') == '' && hashFiles('package-lock.json') != ''
        run: |
          npm ci
          npm audit --audit-level=high

      - name: Install dependencies and audit (yarn)
        if: hashFiles('pnpm-lock.yaml') == '' && hashFiles('package-lock.json') == '' && hashFiles('yarn.lock') != ''
        run: |
          yarn install --frozen-lockfile
          yarn audit --level high
`,
  };
}

/**
 * Secret Gate Workflow (Gitleaks)
 *
 * Uses the maintained Gitleaks GitHub Action to scan full git history.
 *
 * Gate behavior: Gitleaks exits non-zero on any secret detected.
 */
export function generateSecretScanWorkflow(_config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "secret-scan.yml"),
    content: `name: Secret Gate (Gitleaks)

${GATE_HEADER}

${ON_TRIGGER_NOSCHEDULE}

jobs:
  secret-scan:
    name: Gitleaks
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Gitleaks
        uses: gitleaks/gitleaks-action@v2
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
  };
}

/**
 * SBOM & Infrastructure Gate Workflow
 *
 * Three layers of supply chain scanning:
 *   1. Filesystem SBOM (Syft + Grype) — always runs, scans source deps
 *   2. Container image scan (Trivy) — runs when Dockerfile present
 *   3. IaC config scan (Trivy) — runs when K8s/Docker/Terraform files present
 *
 * Critical for Docker/Kubernetes projects: container images bundle OS-level
 * packages (apt, apk, yum) that filesystem-only scans completely miss.
 *
 * Gate behavior: Grype fails on HIGH+ vulns. Trivy image scan fails on
 * CRITICAL/HIGH. Trivy config scan fails on misconfigurations.
 */
export function generateSbomWorkflow(_config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "sbom-scan.yml"),
    content: `name: SBOM & Infrastructure Gate

# ═══════════════════════════════════════════════════════════════
# Supply chain gate — SBOM generation + container/IaC scanning.
# Especially critical for Docker/Kubernetes projects: catches
# OS-level CVEs in base images that filesystem scans miss.
# ═══════════════════════════════════════════════════════════════

${ON_TRIGGER_DAILY}

jobs:
  sbom:
    name: Filesystem SBOM (Syft + Grype)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Generate SBOM with Syft
        uses: anchore/sbom-action@v0
        with:
          image: ""
          path: .
          format: cyclonedx-json
          output-file: sbom-filesystem.json
          fail-build: false

      - name: Scan SBOM for vulnerabilities with Grype
        uses: anchore/scan-action@v6
        with:
          sbom: sbom-filesystem.json
          fail-build: true
          severity-cutoff: high

      - name: Upload filesystem SBOM
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: sbom-filesystem
          path: sbom-filesystem.json
          retention-days: 90

  container-scan:
    name: Container Image Scan (Trivy)
    runs-on: ubuntu-latest
    # Only runs when a Dockerfile is present
    if: hashFiles('Dockerfile', '**/Dockerfile', 'docker-compose.yml', 'docker-compose.yaml') != ''
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Build Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          load: true
          tags: gesf-scan:latest

      - name: Scan Docker image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: gesf-scan:latest
          format: 'sarif'
          output: 'trivy-container.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Upload container scan results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: container-scan
          path: trivy-container.sarif
          retention-days: 90

  iac-scan:
    name: Infrastructure Config Scan (Trivy)
    runs-on: ubuntu-latest
    # Only runs when IaC files are present (K8s, Docker Compose, Terraform)
    if: hashFiles('k8s/**', 'kubernetes/**', 'helm/**', 'terraform/**', 'tf/**', '*.tf', '**/*.tf', 'docker-compose*.yml', 'docker-compose*.yaml') != ''
    steps:
      - uses: actions/checkout@v4

      - name: Scan IaC configs with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'config'
          scan-ref: '.'
          format: 'sarif'
          output: 'trivy-iac.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Upload IaC scan results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: iac-scan
          path: trivy-iac.sarif
          retention-days: 90
`,
  };
}

export function generateAllWorkflows(config: ProjectConfig): WorkflowFile[] {
  return [
    generateComplianceWorkflow(config),
    generateSecurityWorkflow(config),
    generateDependencyScanWorkflow(config),
    generateSecretScanWorkflow(config),
    generateSbomWorkflow(config),
  ];
}
