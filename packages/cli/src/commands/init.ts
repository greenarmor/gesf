import { Command } from "commander";
import { input, select, checkbox } from "../utils/prompts.js";
import {
  banner,
  divider,
  blank,
  success,
  error,
  warn,
  info,
  step,
  kv,
  label,
  BOLD,
  CYAN,
  DIM,
  GREEN,
  GRAY,
} from "../utils/ui.js";
import {
  PROJECT_TYPES,
  FRAMEWORKS,
  DEFAULT_FRAMEWORKS,
  GES_DIR,
  COMPLIANCE_DIR,
  SECURITY_DIR,
  CONTROLS_DIR,
  POLICIES_DIR,
  CHECKLISTS_DIR,
  DOCS_DIR,
  REPORTS_DIR,
} from "@greenarmor/ges-core";
import { CLI_VERSION } from "../utils/version.js";
import type { ProjectConfig, ProjectType, FrameworkName, GovernanceSystemType, GovernanceRiskLevel } from "@greenarmor/ges-core";
import { recordActivity } from "@greenarmor/ges-core";
import { createGovernanceRecord, addGovernanceRecord } from "@greenarmor/ges-core";
import { getPacksForProjectType, getPack, PRIVACY_COUNTRIES, getCountryByCode } from "@greenarmor/ges-policy-engine";
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
  .option("-c, --country <country>", "Country of origin (e.g., BR, CA, US-CA, GB, SG)")
  .option("--force", "Re-initialize even if GESF is already set up")
  .action(async (options) => {
    banner(
      `Green Engineering Standard Framework`,
      `v${CLI_VERSION}`,
    );

    const gesDir = path.join(process.cwd(), GES_DIR);
    if (fs.existsSync(gesDir)) {
      if (!options.force) {
        error("GESF is already initialized in this project.");
        info("Use", "ges init --force to re-initialize.\n");
        process.exit(1);
      }
      warn("Re-initializing GESF", "existing files will be overwritten\n");
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
      error("At least one framework must be selected.");
      process.exit(1);
    }

    // --- Mandatory: Country of Origin ---
    let countryCode = options.country || "";

    if (!countryCode) {
      const regions = ["Europe", "Asia-Pacific", "Americas", "Africa", "Middle East", "Global / EU-wide"];
      const selectedRegion = await select({
        message: "Select your project's primary country/region of operation:",
        choices: regions.map(r => ({ value: r, name: r })),
      });

      if (selectedRegion === "Global / EU-wide") {
        countryCode = "EU";
      } else {
        const countriesInRegion = PRIVACY_COUNTRIES.filter(c => c.region === selectedRegion);
        const countryChoice = await select({
          message: "Select the country:",
          choices: [
            ...countriesInRegion.map(c => ({
              value: c.code,
              name: `${c.name} — ${c.lawName}`,
            })),
            { value: "OTHER", name: "Other / Not listed (skip privacy pack)" },
          ],
        });
        countryCode = countryChoice;
      }
    }

    countryCode = countryCode.toUpperCase();
    const countryInfo = getCountryByCode(countryCode);

    if (options.country && !countryInfo && countryCode !== "EU") {
      warn(`Country code '${options.country}' not recognized.`, "No privacy pack will be auto-installed.");
      info("Available codes:", `${PRIVACY_COUNTRIES.map(c => c.code).join(", ")}, EU`);
    }

    // --- Optional: Additional privacy packs ---
    const additionalPacks = await checkbox({
      message: "Select additional privacy packs (optional — you can add more later with 'ges policy install'):",
      choices: PRIVACY_COUNTRIES
        .filter(c => c.code !== countryCode)
        .map(c => ({
          value: c.packId,
          name: `${c.name} (${c.lawName})`,
          checked: false,
        })),
    });

    // --- Determine which packs to install ---
    const installedPackIds = new Set<string>();

    // Domain packs from project type
    const allProjectPacks = getPacksForProjectType(projectType);
    const fwLower = new Set(selectedFrameworks.map((f: string) => f.toLowerCase()));
    const DOMAIN_PACKS = new Set(["ai", "blockchain", "government"]);
    for (const pack of allProjectPacks) {
      if (DOMAIN_PACKS.has(pack.id.toLowerCase()) || fwLower.has(pack.id.toLowerCase())) {
        installedPackIds.add(pack.id);
      }
    }

    // Privacy core (always installed)
    installedPackIds.add("privacy-core");

    // Country pack (auto-selected from country of origin)
    if (countryInfo) {
      installedPackIds.add(countryInfo.packId);
      // EU maps to GDPR which is already in default frameworks
    } else if (countryCode === "EU") {
      installedPackIds.add("gdpr");
    }

    // Additional packs selected by user
    for (const packId of additionalPacks) {
      installedPackIds.add(packId);
    }

    // Build config
    const now = new Date().toISOString();
    const config: ProjectConfig = {
      project_name: projectName,
      project_type: projectType,
      frameworks: selectedFrameworks,
      country: countryCode,
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
      version: CLI_VERSION,
    };

    const dirs = [GES_DIR, COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR, ".dev-logs"];
    for (const dir of dirs) {
      fs.mkdirSync(path.join(process.cwd(), dir), { recursive: true });
    }

    const gitignorePath = path.join(process.cwd(), ".gitignore");
    const devLogsIgnore = ".dev-logs/\n";
    if (fs.existsSync(gitignorePath)) {
      const existing = fs.readFileSync(gitignorePath, "utf-8");
      if (!existing.includes(".dev-logs/")) {
        fs.appendFileSync(gitignorePath, `\n# GESF developer logs (developer-only, not for remote)\n${devLogsIgnore}`);
      }
    } else {
      writeFileSync(gitignorePath, `# GESF developer logs (developer-only, not for remote)\n${devLogsIgnore}\n`);
    }

    writeFileSync(
      path.join(process.cwd(), ".dev-logs", "README.md"),
      `# Developer Logs\n\nThis directory is part of GESF — the Green Engineering Standard Framework.\n\nIt stores development notes, session logs, AI assistant recommendations, and release notes for your project.\n\n**This directory is gitignored and intended for developers only. Do not submit to remote.**\n\n## Structure\n\n- \`session-*.md\` — Session logs (if using GESF for development tracking)\n- \`release-notes-*.md\` — Release notes for your project\n- \`ai-recommendations/\` — Recommendations from AI assistants using the MCP server (for human review)\n`,
    );

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

    // Install all selected packs
    const packs = [];
    for (const packId of installedPackIds) {
      const pack = getPack(packId);
      if (pack) {
        const packDir = path.join(process.cwd(), CONTROLS_DIR, pack.id);
        fs.mkdirSync(packDir, { recursive: true });
        writeFileSync(
          path.join(packDir, "controls.json"),
          JSON.stringify(pack.controls, null, 2),
        );
        packs.push(pack);
      }
    }

    const workflows = generateAllWorkflows(config);
    for (const wf of workflows) {
      writeFileSync(path.join(process.cwd(), wf.filePath), wf.content);
    }

    // Genesis governance record — establishes the root of the approval provenance chain
    // using project info collected during init, so audit findings can be assigned immediately.
    const genesisSystemType = mapProjectTypeToSystemType(projectType);
    const genesisRiskLevel = inferRiskLevel(projectType);
    const genesisRecord = createGovernanceRecord({
      system_name: projectName,
      system_description: `Genesis governance record auto-created by ges init for a ${projectType} project. Frameworks: ${selectedFrameworks.join(", ")}. Update this record with approval, risk assessment, and evidence as your project matures.`,
      system_type: genesisSystemType,
      risk_level: genesisRiskLevel,
      created_by: "ges-init",
    });
    addGovernanceRecord(process.cwd(), genesisRecord);

    blank();
    step(1, 4, "Creating project structure");
    success("Project structure created");
    success("Configuration files generated");
    success("Compliance documents created");
    success("Security documents created");
    if (countryInfo) {
      success("Country privacy pack auto-installed", `${countryInfo.packId} (${countryInfo.name})`);
    } else if (countryCode === "EU") {
      success("EU GDPR privacy pack auto-installed");
    }
    if (additionalPacks.length > 0) {
      success("Additional privacy packs installed", additionalPacks.join(", "));
    }
    success("Control packs installed", packs.map(p => p.id).join(", "));
    success("GitHub Actions workflows generated");
    success("Genesis governance record created", `${genesisRecord.id} (${genesisSystemType}, ${genesisRiskLevel} risk)`);
    success("Developer logs directory created", ".dev-logs/");
    blank();
    step(2, 4, "Project summary");
    blank();
    console.log(`  ${CYAN(BOLD("GESF initialized"))} for "${projectName}" (${projectType})`);
    if (countryInfo) {
      kv("Country", `${countryInfo.name} — ${countryInfo.lawName}`);
    }
    divider(40);
    blank();
    step(3, 4, "Next steps");
    label("Quick start:");
    console.log(`    ${GRAY("1.")} Review generated compliance documents`);
    console.log(`    ${GRAY("2.")} Run ${GREEN("ges audit")} to evaluate your project`);
    console.log(`    ${GRAY("3.")} Run ${GREEN("ges score")} to see your compliance score`);
    console.log(`    ${GRAY("4.")} Add more packs with ${GREEN("ges policy install <pack-id>")}`);

    recordActivity(process.cwd(), {
      source: "cli",
      action: "init",
      title: `Project initialized: ${projectName}`,
      description: `Initialized GESF for ${projectType} project${countryInfo ? ` in ${countryInfo.name}` : ""} with frameworks: ${selectedFrameworks.join(", ")}. Installed ${packs.length} policy packs: ${packs.map(p => p.id).join(", ")}. Genesis governance record created: ${genesisRecord.id}.`,
      details: { packs_affected: packs.map(p => p.id), frameworks_added: selectedFrameworks.map((f: FrameworkName) => String(f)), country: countryCode, genesis_governance_record_id: genesisRecord.id },
    });

    await showNextStepsMenu("init");
  });

function mapProjectTypeToSystemType(projectType: ProjectType): GovernanceSystemType {
  switch (projectType) {
    case "ai-application":
    case "mcp-server":
      return "ai-system";
    case "api-backend":
      return "api";
    default:
      return "application";
  }
}

function inferRiskLevel(projectType: ProjectType): GovernanceRiskLevel {
  if (projectType === "healthcare-system" || projectType === "government-system") {
    return "high";
  }
  if (projectType === "blockchain" || projectType === "wallet") {
    return "high";
  }
  return "medium";
}
