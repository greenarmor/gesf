import { Command } from "commander";
import { ensureGESInitialized, readJsonFile } from "../utils/project.js";
import type { Control, ProjectConfig } from "@greenarmor/ges-core";
import { ProjectConfigSchema } from "@greenarmor/ges-core";
import { GES_DIR } from "@greenarmor/ges-core";
import * as fs from "node:fs";
import * as path from "node:path";

export const validateCommand = new Command("validate")
  .description("Validate GESF configuration and controls")
  .action(async () => {
    const root = ensureGESInitialized();
    let hasErrors = false;

    console.log("\n  Validating GESF configuration...\n");

    const configPath = path.join(root, GES_DIR, "config.json");
    const config = readJsonFile<ProjectConfig>(configPath);

    if (!config) {
      console.log("  [✗] config.json not found or invalid");
      hasErrors = true;
    } else {
      const result = ProjectConfigSchema.safeParse(config);
      if (result.success) {
        console.log("  [✓] Configuration is valid");
      } else {
        console.log("  [✗] Configuration validation errors:");
        for (const error of result.error.errors) {
          console.log(`    - ${error.path.join(".")}: ${error.message}`);
        }
        hasErrors = true;
      }
    }

    const controlsDir = path.join(root, "controls");
    if (fs.existsSync(controlsDir)) {
      const packDirs = fs.readdirSync(controlsDir);
      for (const packDir of packDirs) {
        const controlsFile = path.join(controlsDir, packDir, "controls.json");
        if (fs.existsSync(controlsFile)) {
          const controls = readJsonFile<Control[]>(controlsFile);
          if (controls) {
            console.log(`  [✓] ${packDir}: ${controls.length} controls`);
          } else {
            console.log(`  [✗] ${packDir}: Invalid controls.json`);
            hasErrors = true;
          }
        }
      }
    }

    const requiredDirs = ["compliance", "security", "controls"];
    for (const dir of requiredDirs) {
      if (fs.existsSync(path.join(root, dir))) {
        console.log(`  [✓] ${dir}/ directory exists`);
      } else {
        console.log(`  [✗] ${dir}/ directory missing`);
        hasErrors = true;
      }
    }

    console.log(hasErrors ? "\n  Validation failed.\n" : "\n  All validations passed.\n");

    if (hasErrors) process.exit(1);
  });
