import type { Scanner, Finding, ScanContext } from "./types.js";

const SECRET_PATTERNS = [
  /\b(?:password|passwd|pwd)\s*[:=]\s*["']?[^\s"']{4,}/i,
  /\b(?:secret|api[_-]?key|access[_-]?key|token)\s*[:=]\s*["']?[^\s"']{8,}/i,
  /\b(?:AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}\b/,
  /\bPRIVATE\s+KEY\b/i,
  /\bbearer\s+[a-zA-Z0-9._-]{20,}/i,
];

const COMPOSE_FILES = /^(docker-compose|compose)\.ya?ml$/i;
const DOCKERFILE_NAMES = /^(dockerfile|containerfile|.+\.dockerfile)$/i;

function isDockerfile(filePath: string): boolean {
  const name = filePath.split("/").pop() || "";
  return DOCKERFILE_NAMES.test(name);
}

function isComposeFile(filePath: string): boolean {
  const name = filePath.split("/").pop() || "";
  return COMPOSE_FILES.test(name);
}

export class DockerfileScanner implements Scanner {
  name = "dockerfile";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    for (const [filePath, content] of ctx.fileContents) {
      if (isDockerfile(filePath)) {
        this.scanDockerfile(filePath, content, findings);
      }
      if (isComposeFile(filePath)) {
        this.scanComposeFile(filePath, content, findings);
      }
    }

    return findings;
  }

  private scanDockerfile(filePath: string, content: string, findings: Finding[]): void {
    const lines = content.split("\n");
    let hasFromLatest = false;
    let hasFromLine = false;
    let hasUser = false;
    let hasHealthcheck = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const upper = line.toUpperCase();

      if (upper.startsWith("FROM")) {
        hasFromLine = true;
        const imageRef = line.substring(4).trim().split(/\s+/)[0];

        if (imageRef.includes(":latest")) {
          hasFromLatest = true;
          findings.push({
            ruleId: "DOCKER-002",
            severity: "medium",
            category: "supply-chain",
            title: "Dockerfile uses :latest tag",
            description: "Using the :latest tag makes builds non-reproducible and can introduce unexpected breaking changes.",
            file: filePath,
            line: i + 1,
            evidence: line,
            controlIds: ["CIS-DOCKER-003"],
            fix: "Pin the image to a specific version tag (e.g., node:20.11-alpine) or SHA256 digest.",
          });
        }

        if (imageRef.includes("@sha256:")) {
          // Good - pinned by digest
        } else if (!imageRef.includes(":")) {
          findings.push({
            ruleId: "DOCKER-002",
            severity: "medium",
            category: "supply-chain",
            title: "Dockerfile image has no version tag",
            description: "Image reference without a tag defaults to :latest, making builds non-reproducible.",
            file: filePath,
            line: i + 1,
            evidence: line,
            controlIds: ["CIS-DOCKER-003"],
            fix: "Add a specific version tag (e.g., node:20.11-alpine) or SHA256 digest.",
          });
        }
      }

      if (upper.startsWith("USER ")) {
        const userVal = line.substring(5).trim();
        if (userVal !== "root" && userVal !== "0" && userVal !== "0:0") {
          hasUser = true;
        }
      }

      if (upper.startsWith("HEALTHCHECK")) {
        hasHealthcheck = true;
      }

      if (upper.startsWith("ADD ")) {
        findings.push({
          ruleId: "DOCKER-008",
          severity: "medium",
          category: "container-security",
          title: "ADD instruction used instead of COPY",
          description: "ADD can fetch remote URLs and auto-extract archives, which introduces security risks. Use COPY for local files.",
          file: filePath,
          line: i + 1,
          evidence: line,
          controlIds: [],
          fix: "Replace ADD with COPY for local files. If you need to fetch a remote URL, use RUN curl/wget instead.",
        });
      }

      // Check for secrets in ENV/ARG
      if (upper.startsWith("ENV ") || upper.startsWith("ARG ")) {
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(line)) {
            findings.push({
              ruleId: "DOCKER-006",
              severity: "critical",
              category: "secrets",
              title: "Secret detected in Dockerfile ENV/ARG",
              description: "A potential secret (password, API key, token) is hardcoded in the Dockerfile. Secrets should never be baked into images.",
              file: filePath,
              line: i + 1,
              evidence: line.replace(/.{20}/g, "***"),
              controlIds: ["GDPR-ART32-006", "OWASP-ASVS-005"],
              fix: "Remove the secret from the Dockerfile. Inject secrets at runtime via environment variables, secrets manager, or vault.",
            });
            break;
          }
        }
      }
    }

    // After parsing all lines - check for missing USER
    if (hasFromLine && !hasUser) {
      findings.push({
        ruleId: "DOCKER-001",
        severity: "critical",
        category: "container-security",
        title: "Dockerfile runs as root (no USER instruction)",
        description: "No non-root USER instruction found. The container will run as root, which is a major security risk.",
        file: filePath,
        evidence: "No USER instruction found in Dockerfile",
        controlIds: ["CIS-DOCKER-001"],
        fix: "Add a non-root user: RUN adduser -D appuser && USER appuser",
      });
    }

    // Check for missing HEALTHCHECK
    if (hasFromLine && !hasHealthcheck) {
      findings.push({
        ruleId: "DOCKER-003",
        severity: "low",
        category: "operational",
        title: "No HEALTHCHECK instruction in Dockerfile",
        description: "Without a HEALTHCHECK, orchestrators cannot detect unhealthy containers automatically.",
        file: filePath,
        evidence: "No HEALTHCHECK instruction found in Dockerfile",
        controlIds: ["CIS-DOCKER-009"],
        fix: "Add HEALTHCHECK --interval=30s CMD curl -f http://localhost:3000/health || exit 1",
      });
    }
  }

  private scanComposeFile(filePath: string, content: string, findings: Finding[]): void {
    const lines = content.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();

      if (lower.includes("privileged") && lower.includes("true")) {
        findings.push({
          ruleId: "DOCKER-005",
          severity: "critical",
          category: "container-security",
          title: "Privileged container enabled in docker-compose",
          description: "privileged: true grants the container full access to host devices and kernel capabilities — essentially root access to the host.",
          file: filePath,
          line: i + 1,
          evidence: trimmed,
          controlIds: ["CIS-DOCKER-007"],
          fix: "Remove privileged: true. If specific capabilities are needed, add them via cap_add individually.",
        });
      }

      if (lower.includes("read_only") && lower.includes("true")) {
        // Good - read only is enabled
      } else if (this.isServiceBlock(lines, i) && this.lacksReadOnly(lines, i)) {
        // We check at service level - only report if there are containers without read_only
        // (detected more precisely in checkLacksReadOnly)
      }

      // Check for :latest in image references
      if (lower.includes("image:") && lower.includes(":latest")) {
        findings.push({
          ruleId: "DOCKER-002",
          severity: "medium",
          category: "supply-chain",
          title: "docker-compose uses :latest image tag",
          description: "Using :latest makes deployments non-reproducible and can introduce unexpected breaking changes.",
          file: filePath,
          line: i + 1,
          evidence: trimmed,
          controlIds: ["CIS-DOCKER-003"],
          fix: "Pin the image to a specific version tag or SHA256 digest.",
        });
      }
    }

    // Check for secrets in environment variables
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lower = line.toLowerCase();
      if (lower.includes("environment") || (lower.startsWith("- ") && /password|secret|token|api[_-]?key/i.test(lower))) {
        for (const pattern of SECRET_PATTERNS) {
          if (pattern.test(line)) {
            findings.push({
              ruleId: "DOCKER-006",
              severity: "critical",
              category: "secrets",
              title: "Secret in docker-compose environment variable",
              description: "A potential secret is hardcoded directly in the docker-compose file. This is readable by anyone with access to the compose file.",
              file: filePath,
              line: i + 1,
              evidence: line.trim().replace(/.{20}/g, "***"),
              controlIds: ["GDPR-ART32-006", "OWASP-ASVS-005"],
              fix: "Use Docker secrets or an external secrets manager. Reference secrets via environment variables injected at runtime.",
            });
            break;
          }
        }
      }
    }

    // Check for missing user directive and missing read_only
    if (content.includes("services:")) {
      this.checkMissingUserAndReadOnly(filePath, content, findings);
    }
  }

  private isServiceBlock(lines: string[], idx: number): boolean {
    return lines[idx].includes("services:") || (lines[idx].startsWith("  ") && !lines[idx].startsWith("    ") && lines[idx].trim().endsWith(":"));
  }

  private lacksReadOnly(lines: string[], idx: number): boolean {
    return true;
  }

  private checkMissingUserAndReadOnly(filePath: string, content: string, findings: Finding[]): void {
    const lines = content.split("\n");

    let inServices = false;
    let serviceDepth = -1;
    let currentService = "";
    let hasUser = false;
    let hasReadOnly = false;
    let serviceLine = -1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();
      const depth = line.length - line.trimStart().length;

      if (trimmed === "services:") {
        inServices = true;
        serviceDepth = depth;
        continue;
      }

      if (inServices && depth === serviceDepth + 2 && trimmed.endsWith(":") && !trimmed.includes(" ")) {
        // New service block
        if (currentService && !hasUser) {
          findings.push({
            ruleId: "DOCKER-010",
            severity: "high",
            category: "container-security",
            title: `docker-compose service "${currentService}" runs without non-root user`,
            description: "No 'user' directive found for this service. The container will run as root.",
            file: filePath,
            line: serviceLine + 1,
            evidence: `Service "${currentService}" has no user: directive`,
            controlIds: ["CIS-DOCKER-001"],
            fix: "Add 'user: 1000:1000' or 'user: appuser' to the service definition.",
          });
        }

        currentService = trimmed.replace(":", "");
        hasUser = false;
        hasReadOnly = false;
        serviceLine = i;
        continue;
      }

      if (inServices && currentService) {
        const lower = trimmed.toLowerCase();
        if (lower.startsWith("user:") || lower.startsWith("user :")) {
          hasUser = true;
        }
        if (lower.includes("read_only") && lower.includes("true")) {
          hasReadOnly = true;
        }
      }
    }

    // Check last service
    if (currentService && !hasUser) {
      findings.push({
        ruleId: "DOCKER-010",
        severity: "high",
        category: "container-security",
        title: `docker-compose service "${currentService}" runs without non-root user`,
        description: "No 'user' directive found for this service. The container will run as root.",
        file: filePath,
        line: serviceLine + 1,
        evidence: `Service "${currentService}" has no user: directive`,
        controlIds: ["CIS-DOCKER-001"],
        fix: "Add 'user: 1000:1000' or 'user: appuser' to the service definition.",
      });
    }

    if (currentService && !hasReadOnly) {
      findings.push({
        ruleId: "DOCKER-009",
        severity: "high",
        category: "container-security",
        title: `docker-compose service "${currentService}" has no read-only root filesystem`,
        description: "Without read_only: true, attackers can write malicious files to the container's root filesystem.",
        file: filePath,
        line: serviceLine + 1,
        evidence: `Service "${currentService}" has no read_only: true directive`,
        controlIds: ["CIS-DOCKER-006"],
        fix: "Add 'read_only: true' to the service definition. Mount writable volumes for paths that need writes.",
      });
    }
  }
}
