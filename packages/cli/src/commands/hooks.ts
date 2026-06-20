import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { installHooks, uninstallHooks } from "@greenarmor/ges-git-hooks";
import { recordActivity } from "@greenarmor/ges-core";
import { banner, blank, DIM, YELLOW } from "../utils/ui.js";
import { select } from "../utils/prompts.js";
import * as fs from "node:fs";
import * as path from "node:path";

export const hooksCommand = new Command("hooks")
  .description("Manage GESF git hooks (pre-commit compliance enforcement)")
  .action(async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      hooksCommand.outputHelp();
      return;
    }

    banner("Git Hooks", "Pre-commit compliance enforcement");

    let root: string;
    try {
      root = ensureGESInitialized();
    } catch {
      const { error } = await import("../utils/ui.js");
      error("GESF is not initialized.", "Run `ges init` first.");
      blank();
      return;
    }

    const hookPath = path.join(root, ".git", "hooks", "pre-commit");
    const isInstalled = fs.existsSync(hookPath);

    const action = await select({
      message: "What would you like to do?",
      choices: [
        ...(isInstalled
          ? [{ name: `Uninstall pre-commit hook ${DIM("— remove compliance gate")}`, value: "uninstall" }]
          : [{ name: `Install pre-commit hook ${DIM("— blocks commits with critical findings")}`, value: "install" }]
        ),
        { name: `${YELLOW("Exit")} ${DIM("— return to terminal")}`, value: "exit" },
      ],
    });

    if (action === "exit") {
      blank();
      return;
    }

    blank();
    const { execSync } = await import("node:child_process");
    try {
      execSync(`ges hooks ${action}`, { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  })
  .addCommand(
    new Command("install")
      .description("Install the pre-commit hook that runs ges audit before each commit")
      .action(async () => {
        const root = ensureGESInitialized();
        const result = installHooks(root, ["pre-commit"]);

        if (result.errors.length > 0) {
          for (const err of result.errors) {
            console.error(`  Error: ${err}`);
          }
          process.exit(1);
        }

        for (const h of result.installed) {
          console.log(`  [✓] Installed hook: ${h}`);
        }
        for (const s of result.skipped) {
          console.log(`  [!] Skipped: ${s}`);
        }

        console.log("\n  Pre-commit hook installed at: .git/hooks/pre-commit");
        console.log("  The hook will run 'ges audit' before allowing commits.");
        console.log("  To bypass: git commit --no-verify");
        console.log("  To remove: ges hooks uninstall\n");

        recordActivity(root, {
          source: "cli",
          action: "hooks_install",
          title: `Git hooks installed (${result.installed.length})`,
          description: `Installed pre-commit hook that runs 'ges audit' before each commit.`,
        });
      })
  )
  .addCommand(
    new Command("uninstall")
      .description("Remove the GESF pre-commit hook")
      .action(async () => {
        const root = ensureGESInitialized();
        const result = uninstallHooks(root, ["pre-commit"]);

        for (const h of result.installed) {
          console.log(`  [✓] ${h}`);
        }
        for (const s of result.skipped) {
          console.log(`  [!] ${s}`);
        }

        console.log("\n  Pre-commit hook removed.\n");

        recordActivity(root, {
          source: "cli",
          action: "hooks_uninstall",
          title: `Git hooks removed`,
          description: `Removed pre-commit hook.`,
        });
      })
  );
