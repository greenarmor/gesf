import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeFileSync } from "../utils/project.js";
import type { ProjectConfig } from "@greenarmor/ges-core";
import { recordActivity } from "@greenarmor/ges-core";
import { generateComplianceDocs, generateSecurityDocs } from "@greenarmor/ges-doc-generator";
import { generateAllWorkflows } from "@greenarmor/ges-cicd-generator";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as path from "node:path";

export const generateCommand = new Command("generate")
  .description("Regenerate documentation and workflows")
  .option("--docs", "Regenerate documentation")
  .option("--workflows", "Regenerate CI/CD workflows")
  .option("--all", "Regenerate everything")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const config = readJsonFile<ProjectConfig>(path.join(root, ".ges", "config.json"));

    if (!config) {
      console.error("  Error: Could not read configuration.");
      process.exit(1);
    }

    const doDocs = options.docs || options.all;
    const doWorkflows = options.workflows || options.all;

    if (!doDocs && !doWorkflows) {
      console.log("  Specify --docs, --workflows, or --all");
      return;
    }

    let docCount = 0;
    let wfCount = 0;

    if (doDocs) {
      console.log("  Generating compliance documents...");
      const complianceDocs = generateComplianceDocs(config.project_name, config.project_type);
      for (const doc of complianceDocs) {
        writeFileSync(path.join(root, doc.filePath), doc.content);
      }

      console.log("  Generating security documents...");
      const securityDocs = generateSecurityDocs(config.project_name, config.project_type);
      for (const doc of securityDocs) {
        writeFileSync(path.join(root, doc.filePath), doc.content);
      }
      docCount = complianceDocs.length + securityDocs.length;
      console.log("  ✓ Documents generated");
    }

    if (doWorkflows) {
      console.log("  Generating CI/CD workflows...");
      const workflows = generateAllWorkflows(config);
      for (const wf of workflows) {
        writeFileSync(path.join(root, wf.filePath), wf.content);
      }
      wfCount = workflows.length;
      console.log("  ✓ Workflows generated");
    }

    console.log("");

    recordActivity(root, {
      source: "cli",
      action: "generate",
      title: `Generated ${docCount} docs, ${wfCount} workflows`,
      description: `Regenerated ${doDocs ? `${docCount} documents` : ""}${doDocs && doWorkflows ? " and " : ""}${doWorkflows ? `${wfCount} CI/CD workflows` : ""} for ${config.project_name}.`,
      details: { files_count: docCount + wfCount },
    });

    await showNextStepsMenu("generate");
  });
