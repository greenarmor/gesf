import { Command } from "commander";
import { CLI_VERSION } from "../utils/version.js";
import { showNextStepsMenu } from "../utils/next-steps.js";
import {
  checkForUpdate,
  compareVersions,
  dismissVersion,
  disableUpdateChecks,
  enableUpdateChecks,
  isInteractive,
  NPM_PACKAGE,
} from "../utils/update-check.js";
import {
  banner,
  blank,
  divider,
  success,
  error,
  warn,
  info,
  kv,
  label,
  GREEN,
  RED,
  YELLOW,
  DIM,
  CYAN,
  GRAY,
} from "../utils/ui.js";
import { select, confirm } from "../utils/prompts.js";

export const updateCommand = new Command("update")
  .description("Check for GESF updates")
  .option("--check", "Only check for updates, don't install")
  .option("--disable-checks", "Disable automatic update notifications")
  .option("--enable-checks", "Re-enable automatic update notifications")
  .action(async (options) => {
    if (options.disableChecks) {
      disableUpdateChecks();
      success("Update checks disabled.", "You won't see update notifications anymore.");
      info("Re-enable", "ges update --enable-checks");
      blank();
      return;
    }

    if (options.enableChecks) {
      enableUpdateChecks();
      success("Update checks enabled.", "You'll see update notifications when new versions are available.");
      blank();
      return;
    }

    banner("GESF Update", "Version check & upgrade");

    info("Current version", CLI_VERSION);
    kv("Package", NPM_PACKAGE);
    blank();

    label("Checking npm registry for latest version...");
    const result = await checkForUpdate(true);

    if (!result.latestVersion) {
      warn("Could not reach npm registry.", "Check your network connection and try again.");
      console.log(`  ${DIM("Or check manually:")} ${CYAN("npm view @greenarmor/ges version")}\n`);
      await showNextStepsMenu("update");
      return;
    }

    kv("Latest version", result.latestVersion);
    blank();

    if (compareVersions(result.latestVersion, CLI_VERSION) <= 0) {
      success("You're up to date!", `Running ${CLI_VERSION} (latest).`);
      blank();
      await showNextStepsMenu("update");
      return;
    }

    divider();
    console.log(`  ${YELLOW("↻")} ${YELLOW(`Update available: ${CLI_VERSION} → ${result.latestVersion}`)}`);
    divider();
    blank();

    if (options.check || !isInteractive()) {
      console.log(`  ${DIM("To update:")}`);
      console.log(`    ${GREEN("npm install -g @greenarmor/ges@latest")}`);
      console.log(`    ${DIM("or")}`);
      console.log(`    ${GREEN("pnpm add -g @greenarmor/ges@latest")}\n`);
      await showNextStepsMenu("update");
      return;
    }

    const shouldUpdate = await confirm({
      message: `Install @greenarmor/ges@${result.latestVersion} now?`,
      default: true,
    });

    if (!shouldUpdate) {
      const dismiss = await confirm({
        message: `Skip this version (${result.latestVersion})?`,
        default: false,
      });
      if (dismiss) {
        dismissVersion(result.latestVersion);
        success("Version skipped.", `You won't be reminded about ${result.latestVersion} again.`);
      }
      blank();
      await showNextStepsMenu("update");
      return;
    }

    blank();
    info("Installing", `${CYAN(`${NPM_PACKAGE}@latest`)}`);
    divider();

    const { execSync } = await import("node:child_process");
    try {
      execSync(`npm install -g ${NPM_PACKAGE}@latest`, { stdio: "inherit" });
      blank();
      success("Update complete!", `Installed ${result.latestVersion}.`);
      blank();
    } catch {
      error("Update failed.", "Try manually: npm install -g @greenarmor/ges@latest");
      blank();
    }

    await showNextStepsMenu("update");
  });
