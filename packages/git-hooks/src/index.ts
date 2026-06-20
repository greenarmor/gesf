import * as fs from "node:fs";
import * as path from "node:path";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { safeWriteFile } from "@greenarmor/ges-core";

export const PRE_COMMIT_HOOK = `#!/bin/sh
# GESF Pre-Commit Hook - Runs compliance audit before allowing commits
# Installed by @greenarmor/ges-git-hooks

echo "[GESF] Running compliance audit..."

# Find the GESF CLI
GES_CLI=""
if [ -f "./node_modules/.bin/ges" ]; then
  GES_CLI="./node_modules/.bin/ges"
elif command -v ges >/dev/null 2>&1; then
  GES_CLI="ges"
elif [ -f "./node_modules/@greenarmor/ges/dist/cli.js" ]; then
  GES_CLI="node ./node_modules/@greenarmor/ges/dist/cli.js"
fi

if [ -z "$GES_CLI" ]; then
  echo "[GESF] Warning: ges CLI not found. Skipping audit."
  echo "[GESF] Install with: npm install @greenarmor/ges"
  exit 0
fi

# Run audit in CI mode (exits non-zero on findings)
$GES_CLI audit --ci
RESULT=$?

if [ $RESULT -ne 0 ]; then
  echo ""
  echo "[GESF] Commit blocked: compliance audit found issues."
  echo "[GESF] Fix with: ges fix"
  echo "[GESF] Or bypass with: git commit --no-verify"
  exit 1
fi

echo "[GESF] Audit passed. Commit allowed."
exit 0
`;

export interface HookInstallResult {
  installed: string[];
  skipped: string[];
  errors: string[];
}

export function installHooks(projectRoot: string, hooks: string[] = ["pre-commit"]): HookInstallResult {
  const result: HookInstallResult = { installed: [], skipped: [], errors: [] };
  const gitDir = path.join(projectRoot, ".git");

  if (!fs.existsSync(gitDir)) {
    result.errors.push("Not a git repository (.git directory not found)");
    return result;
  }

  const hooksDir = path.join(gitDir, "hooks");

  if (!fs.existsSync(hooksDir)) {
    fs.mkdirSync(hooksDir, { recursive: true });
  }

  const hookContents: Record<string, string> = {
    "pre-commit": PRE_COMMIT_HOOK,
  };

  for (const hookName of hooks) {
    const hookPath = path.join(hooksDir, hookName);

    if (hookContents[hookName] === undefined) {
      result.errors.push(`Unsupported hook: ${hookName}`);
      continue;
    }

    if (fs.existsSync(hookPath)) {
      const existing = fs.readFileSync(hookPath, "utf-8");
      if (existing.includes("@greenarmor/ges-git-hooks")) {
        safeWriteFile(hookPath, hookContents[hookName]);
        fs.chmodSync(hookPath, 0o755);
        result.installed.push(hookName);
        continue;
      }
      result.skipped.push(`${hookName} (already exists, not a GESF hook)`);
      continue;
    }

    safeWriteFile(hookPath, hookContents[hookName]);
    fs.chmodSync(hookPath, 0o755);
    result.installed.push(hookName);
  }

  return result;
}

export function uninstallHooks(projectRoot: string, hooks: string[] = ["pre-commit"]): HookInstallResult {
  const result: HookInstallResult = { installed: [], skipped: [], errors: [] };
  const hooksDir = path.join(projectRoot, ".git", "hooks");

  if (!fs.existsSync(hooksDir)) {
    result.errors.push("No .git/hooks directory found");
    return result;
  }

  for (const hookName of hooks) {
    const hookPath = path.join(hooksDir, hookName);

    if (!fs.existsSync(hookPath)) {
      result.skipped.push(`${hookName} (not installed)`);
      continue;
    }

    const content = fs.readFileSync(hookPath, "utf-8");
    if (content.includes("@greenarmor/ges-git-hooks")) {
      fs.unlinkSync(hookPath);
      result.installed.push(`removed ${hookName}`);
    } else {
      result.skipped.push(`${hookName} (not a GESF hook, skipping)`);
    }
  }

  return result;
}

export interface PreCommitResult {
  passed: boolean;
  findings: Finding[];
  totalFindings: number;
  criticalFindings: number;
}

export function runPreCommitCheck(projectRoot: string): PreCommitResult {
  const { findings: rawFindings } = runAudit(projectRoot);
  const findings = deduplicateFindings(rawFindings);
  const criticalFindings = findings.filter(f => f.severity === "critical").length;

  return {
    passed: findings.length === 0,
    findings,
    totalFindings: findings.length,
    criticalFindings,
  };
}
