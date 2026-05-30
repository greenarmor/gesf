import * as fs from "node:fs";
import * as path from "node:path";
import type { Finding, ScanContext } from "./scanners/types.js";
import { SecretsScanner } from "./scanners/secrets-scanner.js";
import { CryptoScanner } from "./scanners/crypto-scanner.js";
import { CodeSecurityScanner } from "./scanners/code-security-scanner.js";
import { AuthScanner } from "./scanners/auth-scanner.js";
import { ConfigScanner } from "./scanners/config-scanner.js";
import { DatabaseScanner } from "./scanners/database-scanner.js";

export type { Finding } from "./scanners/types.js";

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage",
  ".ges", "vendor", "__pycache__", ".venv", "venv", ".turbo", ".cache",
  "reports", "compliance", "security", "controls", "policies", "checklists", "docs",
]);

const IGNORE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".woff",
  ".woff2", ".ttf", ".eot", ".mp4", ".mp3", ".zip", ".gz", ".tar",
  ".lock", ".map", ".wasm",
]);

function collectFiles(root: string): string[] {
  const files: string[] = [];

  function walk(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (!IGNORE_EXTENSIONS.has(ext)) {
          files.push(path.relative(root, fullPath));
        }
      }
    }
  }

  walk(root);
  return files;
}

function readFiles(root: string, files: string[]): Map<string, string> {
  const contents = new Map<string, string>();
  const MAX_FILE_SIZE = 1024 * 1024;

  for (const file of files) {
    try {
      const fullPath = path.join(root, file);
      const stat = fs.statSync(fullPath);
      if (stat.size > MAX_FILE_SIZE) continue;
      const content = fs.readFileSync(fullPath, "utf-8");
      contents.set(file, content);
    } catch {
      // skip unreadable files
    }
  }

  return contents;
}

export function runAudit(root: string): { findings: Finding[]; scannedFiles: number } {
  const files = collectFiles(root);
  const fileContents = readFiles(root, files);
  const ctx: ScanContext = { root, files, fileContents };

  const scanners = [
    new SecretsScanner(),
    new CryptoScanner(),
    new CodeSecurityScanner(),
    new AuthScanner(),
    new ConfigScanner(),
    new DatabaseScanner(),
  ];

  const allFindings: Finding[] = [];
  for (const scanner of scanners) {
    allFindings.push(...scanner.scan(ctx));
  }

  return { findings: allFindings, scannedFiles: files.length };
}

export function deduplicateFindings(findings: Finding[]): Finding[] {
  const seen = new Set<string>();
  return findings.filter(f => {
    const key = `${f.ruleId}:${f.file}:${f.line || ""}:${f.evidence}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
