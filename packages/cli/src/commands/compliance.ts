import { Command } from "commander";
import { ensureGESInitialized, readJsonFile } from "../utils/project.js";
import type { Control, ProjectConfig } from "@greenarmor/ges-core";
import { getPacksForProjectType } from "@greenarmor/ges-policy-engine";
import { formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import type { ScoreFile } from "@greenarmor/ges-core";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const complianceCommand = new Command("compliance")
  .description("Show compliance status")
  .action(async () => {
    const root = ensureGESInitialized();

    const scorePath = path.join(root, ".ges", "score.json");
    const score = readJsonFile<ScoreFile>(scorePath);

    if (score && score.frameworks && Object.keys(score.frameworks).length > 0) {
      console.log(formatScoreOutput(score));
    } else {
      console.log("\n  No compliance score available. Run 'ges audit' first.\n");
    }

    const config = readJsonFile<ProjectConfig>(path.join(root, ".ges", "config.json"));
    if (config) {
      console.log("  Installed Policy Packs:");
      const packs = getPacksForProjectType(config.project_type);
      for (const pack of packs) {
        const controlsFile = path.join(root, "controls", pack.id, "controls.json");
        const controls = readJsonFile<Control[]>(controlsFile);
        const total = controls?.length || 0;
        const passed = controls?.filter(c => c.status === "pass").length || 0;
        console.log(`    ${pack.id.padEnd(15)} ${passed}/${total} controls passed`);
      }
    }

    console.log("");

    await showNextStepsMenu("compliance");
  });
