import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ScoreFile } from "@greenarmor/ges-core";
import { generateBadgeSvg, injectBadgeIntoReadme, computeGrade } from "@greenarmor/ges-scoring-engine";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const badgeCommand = new Command("badge")
  .description("Generate compliance score badge for README")
  .option("-o, --output <path>", "Output path for badge SVG", ".ges/badge.svg")
  .option("--readme <path>", "README file to inject badge into", "README.md")
  .option("--no-readme", "Do not inject badge into README")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const scorePath = path.join(root, ".ges", "score.json");
    const score = readJsonFile<ScoreFile>(scorePath);

    if (!score || !score.frameworks || Object.keys(score.frameworks).length === 0) {
      console.log("\n  No compliance score available. Run 'ges audit' first.\n");
      await showNextStepsMenu("badge");
      return;
    }

    const svg = generateBadgeSvg(score);
    const outputPath = path.resolve(root, options.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, svg);

    console.log(`\n  Badge generated: ${options.output}`);
    console.log(`  Score: ${score.overall}% (${score.overall_grade ?? computeGrade(score.overall)})`);

    if (options.readme !== false) {
      const readmePath = path.resolve(root, options.readme);
      if (fs.existsSync(readmePath)) {
        const readmeContent = fs.readFileSync(readmePath, "utf-8");
        const relativeBadgePath = path.relative(path.dirname(readmePath), outputPath);
        const updated = injectBadgeIntoReadme(readmeContent, relativeBadgePath);
        fs.writeFileSync(readmePath, updated);
        console.log(`  Badge injected into ${options.readme}`);
      } else {
        console.log(`  ${options.readme} not found — skipping badge injection`);
      }
    }

    console.log("");

    await showNextStepsMenu("badge");
  });
