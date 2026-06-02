import { Command } from "commander";
import { ensureGESInitialized, readJsonFile } from "../utils/project.js";
import type { ScoreFile } from "@greenarmor/ges-core";
import { formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as path from "node:path";

export const scoreCommand = new Command("score")
  .description("Calculate and display compliance score")
  .option("--ci", "CI mode - output JSON format")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const scorePath = path.join(root, ".ges", "score.json");
    const score = readJsonFile<ScoreFile>(scorePath);

    if (!score || !score.frameworks || Object.keys(score.frameworks).length === 0) {
      console.log("\n  No compliance score available. Run 'ges audit' first.\n");
      await showNextStepsMenu("score");
      return;
    }

    if (options.ci) {
      console.log(JSON.stringify(score, null, 2));
    } else {
      console.log(formatScoreOutput(score));
      console.log(`  Last evaluated: ${score.evaluated_at}\n`);
    }

    await showNextStepsMenu("score");
  });
