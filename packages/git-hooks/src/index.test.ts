import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { installHooks, uninstallHooks, runPreCommitCheck, PRE_COMMIT_HOOK } from "./index.js";

describe("git-hooks", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-hooks-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("PRE_COMMIT_HOOK", () => {
    it("should be a non-empty shell script", () => {
      expect(PRE_COMMIT_HOOK.length).toBeGreaterThan(100);
      expect(PRE_COMMIT_HOOK).toContain("#!/bin/sh");
    });

    it("should contain GESF marker for re-install detection", () => {
      expect(PRE_COMMIT_HOOK).toContain("@greenarmor/ges-git-hooks");
    });
  });

  describe("installHooks", () => {
    it("should error if not a git repository", () => {
      const result = installHooks(tmpDir, ["pre-commit"]);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain(".git");
    });

    it("should install pre-commit hook in a git repo", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });

      const result = installHooks(tmpDir, ["pre-commit"]);
      expect(result.errors.length).toBe(0);
      expect(result.installed).toContain("pre-commit");

      const hookPath = path.join(tmpDir, ".git", "hooks", "pre-commit");
      expect(fs.existsSync(hookPath)).toBe(true);

      const content = fs.readFileSync(hookPath, "utf-8");
      expect(content).toContain("@greenarmor/ges-git-hooks");
    });

    it("should create hooks directory if it doesn't exist", () => {
      fs.mkdirSync(path.join(tmpDir, ".git"), { recursive: true });

      const result = installHooks(tmpDir, ["pre-commit"]);
      expect(result.errors.length).toBe(0);
      expect(result.installed).toContain("pre-commit");
      expect(fs.existsSync(path.join(tmpDir, ".git", "hooks"))).toBe(true);
    });

    it("should skip if hook exists and is not a GESF hook", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });
      const hookPath = path.join(tmpDir, ".git", "hooks", "pre-commit");
      fs.writeFileSync(hookPath, "#!/bin/sh\necho custom hook\n", "utf-8");

      const result = installHooks(tmpDir, ["pre-commit"]);
      expect(result.installed.length).toBe(0);
      expect(result.skipped.length).toBe(1);
      expect(result.skipped[0]).toContain("already exists");
    });

    it("should update existing GESF hook", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });
      const hookPath = path.join(tmpDir, ".git", "hooks", "pre-commit");
      fs.writeFileSync(hookPath, "# old @greenarmor/ges-git-hooks #", "utf-8");

      const result = installHooks(tmpDir, ["pre-commit"]);
      expect(result.installed).toContain("pre-commit");

      const content = fs.readFileSync(hookPath, "utf-8");
      expect(content).toContain("#!/bin/sh");
    });

    it("should reject unsupported hook names", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });

      const result = installHooks(tmpDir, ["nonexistent-hook"]);
      expect(result.errors.length).toBe(1);
      expect(result.errors[0]).toContain("Unsupported hook");
    });
  });

  describe("uninstallHooks", () => {
    it("should remove GESF hook", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });
      installHooks(tmpDir, ["pre-commit"]);

      const result = uninstallHooks(tmpDir, ["pre-commit"]);
      expect(result.installed).toContain("removed pre-commit");

      const hookPath = path.join(tmpDir, ".git", "hooks", "pre-commit");
      expect(fs.existsSync(hookPath)).toBe(false);
    });

    it("should skip non-GESF hooks", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });
      const hookPath = path.join(tmpDir, ".git", "hooks", "pre-commit");
      fs.writeFileSync(hookPath, "#!/bin/sh\necho custom\n", "utf-8");

      const result = uninstallHooks(tmpDir, ["pre-commit"]);
      expect(result.skipped.length).toBe(1);
      expect(fs.existsSync(hookPath)).toBe(true);
    });

    it("should handle missing hook gracefully", () => {
      fs.mkdirSync(path.join(tmpDir, ".git", "hooks"), { recursive: true });

      const result = uninstallHooks(tmpDir, ["pre-commit"]);
      expect(result.skipped.length).toBe(1);
      expect(result.skipped[0]).toContain("not installed");
    });
  });

  describe("runPreCommitCheck", () => {
    it("should return a result object with findings", () => {
      const result = runPreCommitCheck(tmpDir);
      expect(result).toHaveProperty("passed");
      expect(result).toHaveProperty("findings");
      expect(result).toHaveProperty("totalFindings");
      expect(result).toHaveProperty("criticalFindings");
      expect(Array.isArray(result.findings)).toBe(true);
    });
  });
});
