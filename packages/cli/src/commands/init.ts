import { Command } from "commander";
import { input, select, checkbox } from "../utils/prompts.js";
import {
  PROJECT_TYPES,
  FRAMEWORKS,
  DEFAULT_FRAMEWORKS,
  GESF_VERSION,
  GES_DIR,
  COMPLIANCE_DIR,
  SECURITY_DIR,
  CONTROLS_DIR,
  POLICIES_DIR,
  CHECKLISTS_DIR,
  DOCS_DIR,
  REPORTS_DIR,
} from "@greenarmor/ges-core";
import type { ProjectConfig, ProjectType, FrameworkName } from "@greenarmor/ges-core";
import { getPacksForProjectType } from "@greenarmor/ges-policy-engine";
import {
  generateComplianceDocs,
  generateSecurityDocs,
  generateConfigJson,
  generateMetadataJson,
  generateFrameworkVersionJson,
  generateScoreJson,
} from "@greenarmor/ges-doc-generator";
import { generateAllWorkflows } from "@greenarmor/ges-cicd-generator";
import { writeFileSync } from "../utils/project.js";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const initCommand = new Command("init")
  .description("Initialize GESF in the current project")
  .option("-n, --name <name>", "Project name")
  .option("-t, --type <type>", "Project type")
  .option("-f, --frameworks <frameworks>", "Comma-separated frameworks")
  .option("--force", "Re-initialize even if GESF is already set up")
  .action(async (options) => {
    console.log("\n  Green Engineering Standard Framework (GESF) v" + GESF_VERSION);
    console.log("  ─────────────────────────────────────────────\n");

    const gesDir = path.join(process.cwd(), GES_DIR);
    if (fs.existsSync(gesDir)) {
      if (!options.force) {
        console.error("  Error: GESF is already initialized in this project.");
        console.error("  Use 'ges init --force' to re-initialize.\n");
        process.exit(1);
      }
      console.log("  ⚠ Re-initializing GESF (existing files will be overwritten)...\n");
      fs.rmSync(gesDir, { recursive: true, force: true });
    }

    const projectName = options.name || await input({ message: "Project name:", default: path.basename(process.cwd()) });

    const projectType = options.type
      ? (options.type as ProjectType)
      : await select({
          message: "Select project type:",
          choices: PROJECT_TYPES.map(t => ({ value: t.value, name: t.label })),
        }) as ProjectType;

    const selectedFrameworks = options.frameworks
      ? options.frameworks.split(",").map((f: string) => f.trim() as FrameworkName)
      : await checkbox({
          message: "Select compliance frameworks:",
          choices: FRAMEWORKS.map(f => ({
            value: f.value,
            name: f.label,
            checked: DEFAULT_FRAMEWORKS.includes(f.value),
          })),
        }) as FrameworkName[];

    if (selectedFrameworks.length === 0) {
      console.error("  Error: At least one framework must be selected.");
      process.exit(1);
    }

    const now = new Date().toISOString();
    const config: ProjectConfig = {
      project_name: projectName,
      project_type: projectType,
      frameworks: selectedFrameworks,
      requirements: {
        encryption: { required: true, level: "mandatory" },
        mfa: { required: true, level: "mandatory" },
        audit_logs: { required: true, level: "mandatory" },
        backups: { required: true, level: "mandatory" },
        retention_policy: { required: true, level: "mandatory" },
        vulnerability_scanning: { required: true, level: "mandatory" },
        authentication: { required: true, level: "mandatory" },
        authorization: { required: true, level: "mandatory" },
        secrets_management: { required: true, level: "mandatory" },
        logging: { required: true, level: "mandatory" },
        monitoring: { required: true, level: "recommended" },
        data_classification: { required: true, level: "mandatory" },
        disaster_recovery: { required: true, level: "mandatory" },
        incident_response: { required: true, level: "mandatory" },
        privacy_controls: { required: true, level: "mandatory" },
      },
      created_at: now,
      version: GESF_VERSION,
    };

    const dirs = [GES_DIR, COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR];
    for (const dir of dirs) {
      fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
    }

    const configJson = generateConfigJson(config);
    writeFileSync(path.join(process.cwd(), configJson.filePath), configJson.content);

    const metadata = generateMetadataJson(config);
    writeFileSync(path.join(process.cwd(), metadata.filePath), metadata.content);

    const fwVersion = generateFrameworkVersionJson();
    writeFileSync(path.join(process.cwd(), fwVersion.filePath), fwVersion.content);

    const scoreFile = generateScoreJson();
    writeFileSync(path.join(process.cwd(), scoreFile.filePath), scoreFile.content);

    const complianceDocs = generateComplianceDocs(projectName, projectType);
    for (const doc of complianceDocs) {
      writeFileSync(path.join(process.cwd(), doc.filePath), doc.content);
    }

    const securityDocs = generateSecurityDocs(projectName, projectType);
    for (const doc of securityDocs) {
      writeFileSync(path.join(process.cwd(), doc.filePath), doc.content);
    }

    const allProjectPacks = getPacksForProjectType(projectType);
    const fwLower = new Set(selectedFrameworks.map((f: string) => f.toLowerCase()));
    const DOMAIN_PACKS = new Set(["ai", "blockchain", "government"]);
    const packs = allProjectPacks.filter(pack =>
      DOMAIN_PACKS.has(pack.id.toLowerCase()) || fwLower.has(pack.id.toLowerCase())
    );
    for (const pack of packs) {
      const packDir = path.join(process.cwd(), CONTROLS_DIR, pack.id);
      fs.mkdirSync(packDir, { recursive: true });
      writeFileSync(
        path.join(packDir, "controls.json"),
        JSON.stringify(pack.controls, null, 2),
      );
    }

    const workflows = generateAllWorkflows(config);
    for (const wf of workflows) {
      writeFileSync(path.join(process.cwd(), wf.filePath), wf.content);
    }

    console.log("  ✓ Project structure created");
    console.log("  ✓ Configuration files generated");
    console.log("  ✓ Compliance documents created");
    console.log("  ✓ Security documents created");
    console.log("  ✓ Control packs installed:", packs.map(p => p.id).join(", "));
    console.log("  ✓ GitHub Actions workflows generated");
    console.log(`\n  GESF initialized for "${projectName}" (${projectType})`);
    console.log("  Next steps:");
    console.log("    1. Review generated compliance documents");
    console.log("    2. Run 'ges audit' to evaluate your project");
    console.log("    3. Run 'ges score' to see your compliance score\n");

    await showNextStepsMenu("init");
  });
