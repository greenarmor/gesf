import type { Scanner, Finding, ScanContext } from "./types.js";

export class ConfigScanner implements Scanner {
  name = "config";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    this.checkPackageJson(ctx, findings);
    this.checkEnvFiles(ctx, findings);
    this.checkDockerConfig(ctx, findings);
    this.checkTLSConfig(ctx, findings);
    this.checkGitignore(ctx, findings);
    this.checkLoggingConfig(ctx, findings);

    return findings;
  }

  private checkPackageJson(ctx: ScanContext, findings: Finding[]): void {
    const pkgContent = ctx.fileContents.get("package.json");
    if (!pkgContent) return;

    try {
      const pkg = JSON.parse(pkgContent);
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };

      if (deps.helmet === undefined && (deps.express || deps.koa || deps.fastify)) {
        findings.push({
          ruleId: "CONFIG-001",
          severity: "high",
          category: "security",
          title: "Missing security headers (no helmet)",
          description: "No helmet middleware detected for HTTP framework. Security headers protect against XSS, clickjacking, and other attacks.",
          file: "package.json",
          evidence: "helmet not in dependencies",
          controlIds: ["OWASP-ASVS-002", "OWASP-ASVS-006"],
          fix: "npm install helmet && app.use(helmet())",
        });
      }

      if (deps.cors === undefined && (deps.express || deps.fastify)) {
        findings.push({
          ruleId: "CONFIG-002",
          severity: "medium",
          category: "security",
          title: "No CORS configuration",
          description: "No CORS package found. Unrestricted CORS can expose your API to cross-origin attacks.",
          file: "package.json",
          evidence: "cors not in dependencies",
          controlIds: ["OWASP-ASVS-006"],
          fix: "npm install cors and configure allowed origins explicitly.",
        });
      }

      const auditDeps = ["express", "lodash", "axios", "underscore"];
      for (const dep of auditDeps) {
        if (deps[dep]) {
          findings.push({
            ruleId: "CONFIG-003",
            severity: "medium",
            category: "dependencies",
            title: `Dependency review needed: ${dep}`,
            description: `${dep} is a commonly exploited dependency. Ensure you are running the latest version with no known vulnerabilities.`,
            file: "package.json",
            evidence: `${dep}: ${deps[dep]}`,
            controlIds: ["CIS-004", "OWASP-ASVS-005"],
            fix: "Run npm audit regularly. Update to latest version. Consider automated dependency scanning.",
          });
        }
      }
    } catch {
      // not valid JSON
    }
  }

  private checkEnvFiles(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (filePath !== ".env" && !filePath.endsWith("/.env") && !filePath.startsWith(".env.")) continue;
      if (filePath.includes("example") || filePath.includes("template")) continue;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line || line.startsWith("#")) continue;

        if (/\b(PASSWORD|SECRET|KEY|TOKEN|PRIVATE)\b.*=\s*[^\s]/i.test(line) &&
            !line.includes("your_") && !line.includes("changeme") && !line.includes("xxx")) {
          findings.push({
            ruleId: "CONFIG-004",
            severity: "critical",
            category: "secrets",
            title: "Secret with value in .env file",
            description: "A .env file contains actual secret values. Ensure .env files are in .gitignore and never committed.",
            file: filePath,
            line: i + 1,
            evidence: line.split("=")[0] + "=***",
            controlIds: ["OWASP-ASVS-005", "GDPR-ART32-002"],
            fix: "Ensure .env is in .gitignore. Use a secrets management solution for production.",
          });
        }
      }
    }
  }

  private checkDockerConfig(ctx: ScanContext, findings: Finding[]): void {
    const dockerfile = ctx.fileContents.get("Dockerfile");
    if (dockerfile) {
      if (/USER\s+root/i.test(dockerfile) || (!/USER\s+/i.test(dockerfile))) {
        findings.push({
          ruleId: "CONFIG-005",
          severity: "medium",
          category: "infrastructure",
          title: "Docker running as root",
          description: "Container may be running as root. Use a non-root user for security.",
          file: "Dockerfile",
          evidence: "No non-root USER directive found",
          controlIds: ["CIS-003"],
          fix: "Add: USER node (or other non-root user) to your Dockerfile.",
        });
      }

      if (/\bENV\b.*(?:PASSWORD|SECRET|KEY|TOKEN)\s*=\s*\S+/i.test(dockerfile)) {
        findings.push({
          ruleId: "CONFIG-006",
          severity: "critical",
          category: "secrets",
          title: "Secret in Dockerfile ENV",
          description: "Secrets must not be baked into Docker images.",
          file: "Dockerfile",
          evidence: "ENV with secret value",
          controlIds: ["OWASP-ASVS-005"],
          fix: "Use Docker secrets or environment variables at runtime instead.",
        });
      }
    }
  }

  private checkTLSConfig(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.includes(".env") && !filePath.includes("config")) continue;

      if (/\bNODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]?0['"]?/i.test(content)) {
        findings.push({
          ruleId: "CONFIG-007",
          severity: "critical",
          category: "encryption",
          title: "TLS verification disabled",
          description: "NODE_TLS_REJECT_UNAUTHORIZED=0 disables TLS certificate verification, enabling MITM attacks.",
          file: filePath,
          evidence: "NODE_TLS_REJECT_UNAUTHORIZED=0",
          controlIds: ["GDPR-ART32-003", "OWASP-ASVS-006"],
          fix: "Remove NODE_TLS_REJECT_UNAUTHORIZED=0. Fix the certificate issue instead.",
        });
      }
    }
  }

  private checkGitignore(ctx: ScanContext, findings: Finding[]): void {
    const gitignore = ctx.fileContents.get(".gitignore");
    if (!gitignore) {
      findings.push({
        ruleId: "CONFIG-008",
        severity: "high",
        category: "security",
        title: "No .gitignore file",
        description: "No .gitignore found. Secrets and build artifacts may be committed accidentally.",
        file: ".gitignore",
        evidence: "File not found",
        controlIds: ["OWASP-ASVS-005"],
        fix: "Create .gitignore with node_modules/, .env, dist/, *.key, etc.",
      });
      return;
    }

    const required = [".env", "node_modules"];
    for (const pattern of required) {
      if (!gitignore.includes(pattern)) {
        findings.push({
          ruleId: "CONFIG-009",
          severity: "high",
          category: "security",
          title: `.gitignore missing ${pattern}`,
          description: `${pattern} should be in .gitignore to prevent accidental commits.`,
          file: ".gitignore",
          evidence: `${pattern} not found in .gitignore`,
          controlIds: ["OWASP-ASVS-005"],
          fix: `Add ${pattern} to .gitignore.`,
        });
      }
    }
  }

  private checkLoggingConfig(ctx: ScanContext, findings: Finding[]): void {
    const hasLogging = this.searchContent(ctx, [
      /winston|pino|bunyan|morgan|helmet/i,
      /logging|logger/i,
      /auditLog|audit_log/i,
    ]);

    if (!hasLogging) {
      findings.push({
        ruleId: "CONFIG-010",
        severity: "high",
        category: "audit",
        title: "No logging framework detected",
        description: "No logging library or audit logging found. Audit logging is mandatory for GDPR compliance.",
        file: "project",
        evidence: "No logging library (winston, pino, etc.) found",
        controlIds: ["GDPR-ART32-006", "OWASP-ASVS-004"],
        fix: "Install a logging library (winston or pino) and implement structured audit logging.",
      });
    }
  }

  private searchContent(ctx: ScanContext, patterns: RegExp[]): boolean {
    for (const [, content] of ctx.fileContents) {
      for (const pattern of patterns) {
        pattern.lastIndex = 0;
        if (pattern.test(content)) return true;
      }
    }
    return false;
  }
}
