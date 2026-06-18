import * as fs from "node:fs";
import * as path from "node:path";
import type { Finding, ScanContext } from "./scanners/types.js";
import { SecretsScanner } from "./scanners/secrets-scanner.js";
import { CryptoScanner } from "./scanners/crypto-scanner.js";
import { CodeSecurityScanner } from "./scanners/code-security-scanner.js";
import { AuthScanner } from "./scanners/auth-scanner.js";
import { ConfigScanner } from "./scanners/config-scanner.js";
import { DatabaseScanner } from "./scanners/database-scanner.js";
import { IaCScanner } from "./scanners/iac-scanner.js";
import { GovernanceScanner } from "./scanners/governance-scanner.js";

export type { Finding } from "./scanners/types.js";

const IGNORE_DIRS = new Set([
  "node_modules", ".git", "dist", "build", ".next", ".nuxt", "coverage",
  ".ges", "vendor", "__pycache__", ".venv", "venv", ".turbo", ".cache",
  "reports",
  "bundle", ".crush", ".vscode", ".idea",
]);

const SKIP_PATHS = [
  "/audit-engine/src/",
];

const IGNORE_EXTENSIONS = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".ico", ".woff",
  ".woff2", ".ttf", ".eot", ".mp4", ".mp3", ".zip", ".gz", ".tar",
  ".lock", ".map", ".wasm",
]);

function loadGesIgnore(root: string): string[] {
  const ignorePath = path.join(root, ".gesignore");
  if (!fs.existsSync(ignorePath)) return [];
  try {
    const content = fs.readFileSync(ignorePath, "utf-8");
    return content
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith("#"));
  } catch {
    return [];
  }
}

function isIgnored(filePath: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    if (pattern.endsWith("/")) {
      const dir = pattern.slice(0, -1);
      if (filePath === dir || filePath.startsWith(dir + "/")) return true;
    } else if (pattern.startsWith("*.")) {
      const ext = pattern.slice(1);
      if (filePath.endsWith(ext)) return true;
    } else if (pattern.includes("*")) {
      const regex = new RegExp("^" + pattern.replace(/\./g, "\\.").replace(/\*/g, ".*") + "$");
      if (regex.test(filePath)) return true;
    } else {
      if (filePath === pattern || filePath.startsWith(pattern + "/")) return true;
    }
  }
  return false;
}

function collectFiles(root: string): string[] {
  const files: string[] = [];
  const ignorePatterns = loadGesIgnore(root);

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
          const rel = path.relative(root, fullPath).replace(/\\/g, "/");
          if (!SKIP_PATHS.some(skip => rel.includes(skip))) {
            if (!isIgnored(rel, ignorePatterns)) {
              files.push(rel);
            }
          }
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

function detectWebProject(fileContents: Map<string, string>): boolean {
  const webPatterns = [
    /from\s+['"]express['"]/, /require\s*\(\s*['"]express['"]\s*\)/,
    /from\s+['"]fastify['"]/, /require\s*\(\s*['"]fastify['"]\s*\)/,
    /from\s+['"]koa['"]/, /require\s*\(\s*['"]koa['"]\s*\)/,
    /from\s+['"]hono['"]/, /require\s*\(\s*['"]hono['"]\s*\)/,
    /from\s+['"]@nestjs/, /from\s+['"]next['"]/, /from\s+['"]nuxt['"]/,
    /from\s+['"]@sveltejs/, /from\s+['"]@remix-run/,
    /from\s+['"]@angular/, /from\s+['"]vue['"]/,

    /import\s+django/, /from\s+flask\s+import/, /from\s+fastapi\s+import/,
    /from\s+sanic\s+import/, /from\s+aiohttp\s+import/, /import\s+tornado/,

    /use\s+gin\.Default\(\)|gin\.New\(\)/, /fiber\.New\(\)/,
    /echo\.New\(\)/, /mux\.NewRouter\(\)/, /chi\.NewRouter\(\)/,
    /iris\.New\(\)/,

    /use\s+Actix\s*Web/, /use\s+rocket/, /use\s+warp/, /use\s+axum/,

    /Rails\.application/, /ActionController::Base/, /Sinatra::Base/,

    /import\s+io\.express/, /import\s+io\.ktor/, /import\s+spark\.Spark/,
    /@SpringBootApplication/, /@Controller/, /@RestController/,

    /use\s+Rocketeer/, /Route::get|Route::post/, /use\s+Illuminate/,

    /using\s+Microsoft\.AspNetCore/, /using\s+Nancy/, /ControllerBase/,

    /createServer\s*\(\s*.*request\b/, /http\.createServer/,
    /router\.(get|post|put|delete|patch)\s*\(/,
  ];

  for (const [, content] of fileContents) {
    for (const pattern of webPatterns) {
      if (pattern.test(content)) return true;
    }
  }

  for (const [filePath, content] of fileContents) {
    if (filePath === "package.json") {
      try {
        const pkg = JSON.parse(content);
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
        if (allDeps.express || allDeps.fastify || allDeps.koa || allDeps.hono ||
            allDeps.next || allDeps.nuxt || allDeps["@nestjs/core"] || allDeps["@sveltejs/kit"] ||
            allDeps["@remix-run/node"] || allDeps["@angular/core"] || allDeps.vue) {
          return true;
        }
      } catch { /* not json */ }
    }
    if (filePath === "requirements.txt" || filePath === "pyproject.toml") {
      if (/django|flask|fastapi|sanic|aiohttp|tornado|starlette/i.test(content)) return true;
    }
    if (filePath === "go.mod") {
      if (/gin-gonic|fiber|echo|chi|gorilla\/mux|iris/i.test(content)) return true;
    }
    if (filePath === "Cargo.toml") {
      if (/actix-web|rocket|warp|axum|tide/i.test(content)) return true;
    }
    if (filePath === "Gemfile") {
      if (/rails|sinatra|hanami/i.test(content)) return true;
    }
    if (filePath === "pom.xml" || filePath === "build.gradle") {
      if (/spring-boot|ktor|sparkjava|quarkus/i.test(content)) return true;
    }
    if (filePath === "composer.json") {
      try {
        const pkg = JSON.parse(content);
        const allDeps = { ...pkg.require, ...pkg["require-dev"] };
        if (allDeps["laravel/framework"] || allDeps["symfony/symfony"] || allDeps["slim/slim"]) return true;
      } catch { /* not json */ }
    }
  }

  return false;
}

export function runAudit(root: string): { findings: Finding[]; scannedFiles: number } {
  const files = collectFiles(root);
  const fileContents = readFiles(root, files);
  const isWebProject = detectWebProject(fileContents);
  const ctx: ScanContext = { root, files, fileContents, isWebProject };

  const scanners = [
    new SecretsScanner(),
    new CryptoScanner(),
    new CodeSecurityScanner(),
    new AuthScanner(),
    new ConfigScanner(),
    new DatabaseScanner(),
    new IaCScanner(),
    new GovernanceScanner(),
  ];

  const allFindings: Finding[] = [];
  for (const scanner of scanners) {
    allFindings.push(...scanner.scan(ctx));
  }

  return { findings: allFindings, scannedFiles: files.length };
}

export interface AuditCache {
  [filePath: string]: { hash: string; findings: Finding[] };
}

export function runAuditIncremental(
  root: string,
  cache?: AuditCache,
): { findings: Finding[]; scannedFiles: number; newCache: AuditCache; changedFiles: number } {
  const files = collectFiles(root);
  const fileContents = readFiles(root, files);
  const oldCache = cache || {};
  const newCache: AuditCache = {};
  const changedFiles: string[] = [];

  for (const file of files) {
    const content = fileContents.get(file) || "";
    const hash = simpleHash(content);

    if (oldCache[file] && oldCache[file].hash === hash) {
      newCache[file] = oldCache[file];
    } else {
      changedFiles.push(file);
      newCache[file] = { hash, findings: [] };
    }
  }

  const isWebProject = detectWebProject(fileContents);
  const changedContents = new Map<string, string>();
  for (const file of changedFiles) {
    changedContents.set(file, fileContents.get(file) || "");
  }

  const ctx: ScanContext = {
    root,
    files: changedFiles,
    fileContents: changedContents,
    isWebProject,
  };

  const fullCtx: ScanContext = {
    root,
    files,
    fileContents,
    isWebProject,
  };

  const perFileScanners = [
    new SecretsScanner(),
    new CryptoScanner(),
    new CodeSecurityScanner(),
    new DatabaseScanner(),
    new IaCScanner(),
  ];

  const projectScanners = [
    new AuthScanner(),
    new ConfigScanner(),
    new GovernanceScanner(),
  ];

  const changedFindings: Finding[] = [];
  for (const scanner of perFileScanners) {
    changedFindings.push(...scanner.scan(ctx));
  }

  for (const finding of changedFindings) {
    if (newCache[finding.file]) {
      newCache[finding.file].findings.push(finding);
    }
  }

  const projectFindings: Finding[] = [];
  for (const scanner of projectScanners) {
    projectFindings.push(...scanner.scan(fullCtx));
  }

  const allFindings: Finding[] = [];
  for (const file of files) {
    if (newCache[file]) {
      allFindings.push(...newCache[file].findings);
    }
  }
  allFindings.push(...projectFindings);

  return {
    findings: allFindings,
    scannedFiles: files.length,
    newCache,
    changedFiles: changedFiles.length,
  };
}

function simpleHash(content: string): string {
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
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
