import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig, ScoreFile } from "@greenarmor/ges-core";
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
      const lines: string[] = [""];
      for (const [fw, data] of Object.entries(score.frameworks)) {
        const padding = Math.max(1, 20 - fw.length);
        const dots = ".".repeat(padding);
        lines.push(`  ${fw} ${dots} ${data.score}%`);
      }
      const overallPadding = Math.max(1, 20 - "Overall".length);
      lines.push(`  Overall ${".".repeat(overallPadding)} ${score.overall}%`);
      lines.push("");
      lines.push(`  Last evaluated: ${score.evaluated_at}`);
      lines.push("");
      console.log(lines.join("\n"));
    }

    await showNextStepsMenu("score");
  });
