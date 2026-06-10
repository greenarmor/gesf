import { Command } from "commander";
import { CLI_VERSION } from "../utils/version.js";
import { showNextStepsMenu } from "../utils/next-steps.js";

export const updateCommand = new Command("update")
  .description("Check for GESF updates")
  .action(async () => {
    console.log(`\n  GESF Version: ${CLI_VERSION}`);
    console.log("  Update check: Run 'npm update -g @greenarmor/ges' or 'pnpm update -g @greenarmor/ges'\n");

    await showNextStepsMenu("update");
  });
