import { checkForUpdate, dismissVersion, isInteractive, NPM_PACKAGE } from "./update-check.js";
import { select } from "./prompts.js";
import {
  updateNoticeBox,
  updateNoticeLine,
  blank,
  divider,
  info,
  success,
  error,
  GREEN,
  DIM,
  CYAN,
  YELLOW,
} from "./ui.js";

const SKIP_COMMANDS = new Set(["update", "mcp", "start"]);

export async function showUpdateNoticeIfNeeded(currentCommandName?: string): Promise<void> {
  if (currentCommandName && SKIP_COMMANDS.has(currentCommandName)) return;

  const result = await checkForUpdate();
  if (!result.updateAvailable || result.dismissed || !result.latestVersion) return;

  if (!isInteractive()) {
    updateNoticeLine(result.currentVersion, result.latestVersion);
    return;
  }

  updateNoticeBox(result.currentVersion, result.latestVersion);

  const action = await select({
    message: "An update is available. What would you like to do?",
    choices: [
      { name: `${GREEN("Update now")} ${DIM("— install latest and exit")}`, value: "update" },
      { name: `Skip for now ${DIM("— continue with current version")}`, value: "skip" },
      { name: `${YELLOW("Skip this version")} ${DIM(`— don't remind me about ${result.latestVersion} again`)}`, value: "dismiss" },
    ],
  });

  if (action === "skip") {
    blank();
    return;
  }

  if (action === "dismiss") {
    dismissVersion(result.latestVersion);
    blank();
    return;
  }

  if (action === "update") {
    blank();
    info("Installing", `${CYAN(NPM_PACKAGE)}@${result.latestVersion}`);
    divider();

    const { execSync } = await import("node:child_process");
    try {
      execSync(`npm install -g ${NPM_PACKAGE}@latest`, { stdio: "inherit" });
      blank();
      success("Update complete!", `Now running ${result.latestVersion}. Please re-run your command.`);
      blank();
      process.exit(0);
    } catch {
      error("Update failed.", "You can update manually: npm install -g @greenarmor/ges@latest");
      blank();
    }
  }
}
