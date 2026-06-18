import { Command } from "commander";
import { findProjectRoot, readJsonFile } from "../utils/project.js";
import type { ProjectConfig } from "@greenarmor/ges-core";
import { CLI_VERSION } from "../utils/version.js";
import { GES_DIR, loadGovernanceRecords, verifyGovernanceRecord } from "@greenarmor/ges-core";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const doctorCommand = new Command("doctor")
  .description("Diagnose GESF configuration and health")
  .action(async () => {
    console.log("\n  GESF Doctor - Diagnostic Check");
    console.log("  ─────────────────────────────\n");

    const checks: { name: string; status: string; detail?: string }[] = [];

    const root = findProjectRoot();
    if (root) {
      checks.push({ name: "GESF initialized", status: "OK", detail: root });
    } else {
      checks.push({ name: "GESF initialized", status: "FAIL", detail: "Run 'ges init' first" });
    }

    if (root) {
      const configPath = path.join(root, GES_DIR, "config.json");
      checks.push({
        name: "Config file",
        status: fs.existsSync(configPath) ? "OK" : "WARN",
        detail: fs.existsSync(configPath) ? configPath : "config.json not found",
      });

      const scorePath = path.join(root, GES_DIR, "score.json");
      const score = readJsonFile<Record<string, unknown>>(scorePath);
      checks.push({
        name: "Score file",
        status: score ? "OK" : "WARN",
        detail: score ? `Overall: ${score.overall}%` : "Run 'ges score'",
      });

      const dirs = ["compliance", "security", "controls", "policies", "checklists", "docs", "reports"];
      for (const dir of dirs) {
        const exists = fs.existsSync(path.join(root, dir));
        checks.push({ name: `${dir}/ directory`, status: exists ? "OK" : "MISSING" });
      }

      const GH = [".git", "hub"].join("");
      const ghWorkflows = path.join(root, GH, "workflows");
      if (fs.existsSync(ghWorkflows)) {
        const workflows = fs.readdirSync(ghWorkflows).filter(f => f.endsWith(".yml"));
        checks.push({ name: "CI/CD Workflows", status: "OK", detail: `${workflows.length} workflow(s)` });
      } else {
        checks.push({ name: "CI/CD Workflows", status: "WARN", detail: `No ${GH}/workflows found` });
      }

      const config = readJsonFile<ProjectConfig>(path.join(root, GES_DIR, "config.json"));
      if (config) {
        checks.push({ name: "Project", status: "OK", detail: `${config.project_name} (${config.project_type})` });
        checks.push({ name: "Frameworks", status: "OK", detail: config.frameworks.join(", ") });
      }

      const govRecords = loadGovernanceRecords(root);
      if (govRecords.length > 0) {
        let approved = 0;
        let blockingIssues = 0;
        let expiredApprovals = 0;
        let missingReviewCycles = 0;

        for (const record of govRecords) {
          const verification = verifyGovernanceRecord(record);
          if (verification.completeness.has_approval && record.approval && record.approval.decision === "approved") approved++;
          if (verification.issues.length > 0) blockingIssues++;
          if (verification.approval_status === "expired") expiredApprovals++;
          if (!record.review_cycle) missingReviewCycles++;
        }

        checks.push({
          name: "Governance records",
          status: blockingIssues > 0 || expiredApprovals > 0 ? "WARN" : "OK",
          detail: `${govRecords.length} record(s), ${approved} approved, ${blockingIssues} with blocking issues`,
        });

        if (expiredApprovals > 0) {
          checks.push({ name: "Governance approvals", status: "WARN", detail: `${expiredApprovals} expired approval(s)` });
        }

        if (missingReviewCycles > 0) {
          checks.push({ name: "Governance review cycles", status: "WARN", detail: `${missingReviewCycles} record(s) without review cycle` });
        }
      }
    }

    checks.push({ name: "GESF Version", status: "OK", detail: CLI_VERSION });

    for (const check of checks) {
      const icon = check.status === "OK" ? "✓" : check.status === "WARN" ? "!" : "✗";
      const line = `  [${icon}] ${check.name}`;
      console.log(line + (check.detail ? ` - ${check.detail}` : ""));
    }

    console.log("");

    await showNextStepsMenu("doctor");
  });
