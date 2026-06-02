import type { ProjectConfig } from "@greenarmor/ges-core";
import * as path from "node:path";

export interface WorkflowFile {
  filePath: string;
  content: string;
}

export function generateComplianceWorkflow(config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "compliance.yml"),
    content: `name: Compliance Check

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * 1'

jobs:
  compliance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install GESF
        run: npm install -g @greenarmor/ges

      - name: Run Compliance Audit
        run: ges audit --ci

      - name: Generate Compliance Score
        run: ges score --ci

      - name: Generate Compliance Badge
        if: github.event_name != 'pull_request'
        run: ges badge

      - name: Commit Compliance Badge
        if: github.event_name != 'pull_request'
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

export function generateSecurityWorkflow(config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "security.yml"),
    content: `name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Semgrep
        uses: returntocorp/semgrep-action@v1
        with:
          config: auto

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install GESF
        run: npm install -g @greenarmor/ges

      - name: Run Security Scan
        run: ges scan --ci
`,
  };
}

export function generateDependencyScanWorkflow(config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "dependency-scan.yml"),
    content: `name: Dependency Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 6 * * *'

jobs:
  dependency-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'
          severity: 'CRITICAL,HIGH'

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Run npm audit
        run: npm audit --audit-level=high
        continue-on-error: true
`,
  };
}

export function generateSecretScanWorkflow(config: ProjectConfig): WorkflowFile {
  return {
    filePath: path.join(".github", "workflows", "secret-scan.yml"),
    content: `name: Secret Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  secret-scan:
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

export function generateAllWorkflows(config: ProjectConfig): WorkflowFile[] {
  return [
    generateComplianceWorkflow(config),
    generateSecurityWorkflow(config),
    generateDependencyScanWorkflow(config),
    generateSecretScanWorkflow(config),
  ];
}
