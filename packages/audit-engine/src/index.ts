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
          const rel = path.relative(root, fullPath).replace(/\\/g, "/");
          if (!SKIP_PATHS.some(skip => rel.includes(skip))) {
            files.push(rel);
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
