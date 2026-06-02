import { Command } from "commander";
import { ensureGESInitialized, readJsonFile } from "../utils/project.js";
import type { Control, ProjectConfig, ScoreFile } from "@greenarmor/ges-core";
import { getPacksForProjectType } from "@greenarmor/ges-policy-engine";
import { formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
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
        const raw = readJsonFile<Control[] | { controls: Control[] }>(controlsFile);
        const controls = Array.isArray(raw) ? raw : Array.isArray(raw?.controls) ? raw.controls : null;
        const total = controls?.length || 0;
        const passed = controls?.filter(c => c.status === "pass").length || 0;
        const failed = controls?.filter(c => c.status === "fail").length || 0;
        const criticalFailed = controls?.filter(c => c.status === "fail" && c.severity === "critical").length || 0;
        const statusTag = criticalFailed > 0 ? " ⚠" : "";
        console.log(`    ${pack.id.padEnd(15)} ${passed}/${total} passed  ${failed} failed${statusTag}`);
      }
    }

    console.log("");

    await showNextStepsMenu("compliance");
  });
