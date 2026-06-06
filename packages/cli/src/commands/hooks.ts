import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { installHooks, uninstallHooks } from "@greenarmor/ges-git-hooks";

export const hooksCommand = new Command("hooks")
  .description("Manage GESF git hooks (pre-commit compliance enforcement)")
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
      })
  );
