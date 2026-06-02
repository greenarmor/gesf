import type { Scanner, Finding, ScanContext } from "./types.js";

const SECRET_PATTERNS = [
  { pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Hardcoded password" },
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Hardcoded API key" },
  { pattern: /(?:secret|token|auth)\s*[:=]\s*['"][^'"]{8,}/gi, name: "Hardcoded secret/token" },
  { pattern: /(?:mongodb|postgres|mysql|redis):\/\/[^\s'"]{10,}/gi, name: "Database connection string with credentials" },
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, name: "OpenAI/API key pattern" },
  { pattern: /AKIA[0-9A-Z]{16}/g, name: "AWS Access Key ID" },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, name: "Private key in source" },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, name: "GitHub personal access token" },
  { pattern: /gho_[a-zA-Z0-9]{36}/g, name: "GitHub OAuth token" },
  { pattern: /glpat-[a-zA-Z0-9\-]{20,}/g, name: "GitLab personal access token" },
  { pattern: /xox[bpsa]-[a-zA-Z0-9\-]{10,}/g, name: "Slack token" },
  { pattern: /eyJ[a-zA-Z0-9_-]{10,}\.[a-zA-Z0-9_-]{10,}/g, name: "JWT token in source" },
  { pattern: /(?:CONNECTION_STRING|DATABASE_URL|DB_PASSWORD|SECRET_KEY|PRIVATE_KEY)\s*[:=]\s*['"][^'"]{4,}/gi, name: "Sensitive environment variable with value" },
];

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage",
  ".ges", "vendor", "__pycache__", ".venv", "venv",
]);

const IGNORE_FILES = new Set([
  ".gitignore", "package-lock.json", "pnpm-lock.yaml", "yarn.lock",
]);

const DOTENV_FILES = /^\.env(?:\.\w+)?$/;

function shouldScanFile(filePath: string): boolean {
  const parts = filePath.split("/");
  if (parts.some(p => IGNORE_DIRS.has(p))) return false;
  const basename = parts[parts.length - 1] || "";
  if (IGNORE_FILES.has(basename)) return false;
  if (DOTENV_FILES.test(basename)) return false;
  return true;
}

export class SecretsScanner implements Scanner {
  name = "secrets";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    for (const [filePath, content] of ctx.fileContents) {
      if (!shouldScanFile(filePath)) continue;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (const { pattern, name } of SECRET_PATTERNS) {
          pattern.lastIndex = 0;
          const match = pattern.exec(line);
          if (match) {
            findings.push({
              ruleId: "SECRETS-001",
              severity: "critical",
              category: "secrets",
              title: name,
              description: "A secret or credential was found in source code. Secrets must never be committed to repositories.",
              file: filePath,
              line: i + 1,
              evidence: maskSecret(match[0]),
              controlIds: ["OWASP-ASVS-005", "GDPR-ART32-002"],
              fix: "Move this secret to a secure vault (Vault, AWS KMS, etc.) or environment variable. Never commit secrets to source control.",
            });
          }
        }
      }
    }

    return findings;
  }
}

function maskSecret(secret: string): string {
  if (secret.length <= 8) return "***";
  return secret.slice(0, 4) + "***" + secret.slice(-4);
}
