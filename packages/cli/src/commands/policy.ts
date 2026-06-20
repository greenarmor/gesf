import { Command } from "commander";
import { getAllPacks, listPackIds } from "@greenarmor/ges-policy-engine";
import { ensureGESInitialized, readJsonFile, writeFileSync, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig } from "@greenarmor/ges-core";
import { addFrameworkToConfig, removeFrameworkFromConfig, recordActivity } from "@greenarmor/ges-core";
import { showNextStepsMenu } from "../utils/next-steps.js";
import { banner, blank, success, error, kv, BOLD, CYAN, DIM, GRAY, YELLOW } from "../utils/ui.js";
import { select } from "../utils/prompts.js";
import * as fs from "node:fs";
import * as path from "node:path";

const policyCmd = new Command("policy")
  .description("Manage policy packs")
  .action(async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      policyCmd.outputHelp();
      return;
    }

    banner("Policy Packs", "Compliance control management");

    let root: string;
    try {
      root = ensureGESInitialized();
    } catch {
      error("GESF is not initialized.", "Run `ges init` first.");
      blank();
      return;
    }

    const installedPacks = fs.existsSync(path.join(root, "controls"))
      ? fs.readdirSync(path.join(root, "controls")).filter(d => {
          try { return fs.statSync(path.join(root, "controls", d)).isDirectory(); } catch { return false; }
        })
      : [];

    if (installedPacks.length > 0) {
      console.log(`  ${BOLD("Installed Packs")} ${GRAY(`(${installedPacks.length})`)}`);
      installedPacks.forEach(p => console.log(`    ${GRAY("•")} ${p}`));
      console.log("");
    }

    const action = await select({
      message: "What would you like to do?",
      choices: [
        { name: `List all available packs ${DIM("— see what can be installed")}`, value: "list" },
        { name: `Install a pack ${DIM("— add compliance controls")}`, value: "install" },
        ...(installedPacks.length > 0 ? [
          { name: `Remove a pack ${DIM(`(${installedPacks.length} installed)`)}`, value: "remove" },
        ] : []),
        { name: `${YELLOW("Exit")} ${DIM("— return to terminal")}`, value: "exit" },
      ],
    });

    if (action === "exit") {
      blank();
      return;
    }

    let cmd = "ges policy";

    if (action === "list") {
      cmd += " list";
    } else if (action === "install") {
      const packs = getAllPacks();
      const packChoice = await select({
        message: "Select a pack to install:",
        choices: [
          ...packs.map(p => ({
            name: `${p.id.padEnd(16)} ${DIM(p.name)} ${GRAY(`(${p.controls.length} controls)`)}`,
            value: p.id,
          })),
        ],
      });
      cmd += ` install ${packChoice}`;
    } else if (action === "remove") {
      const packChoice = await select({
        message: "Select a pack to remove:",
        choices: [
          ...installedPacks.map(p => ({ name: p, value: p })),
        ],
      });
      cmd += ` remove ${packChoice}`;
    }

    blank();
    const { execSync } = await import("node:child_process");
    try {
      execSync(cmd, { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  });

policyCmd
  .command("list")
  .description("List available policy packs")
  .action(async () => {
    banner("Policy Packs", "Available compliance control packs");
    const packs = getAllPacks();
    for (const pack of packs) {
      console.log(`  ${CYAN(BOLD(pack.id.padEnd(18)))} ${pack.name}`);
      console.log(`      ${DIM(`${pack.controls.length} controls`)} ${GRAY("|")} ${DIM(pack.project_types.join(", "))}`);
      console.log("");
    }

    await showNextStepsMenu("policy-list");
  });

policyCmd
  .command("install <packId>")
  .description("Install a policy pack")
  .action(async (packId: string) => {
    const root = ensureGESInitialized();
    const packs = getAllPacks();
    const pack = packs.find(p => p.id === packId);

    if (!pack) {
      error(`Pack '${packId}' not found.`, `Available: ${listPackIds().join(", ")}`);
      process.exit(1);
    }

    const packDir = path.join(root, "controls", pack.id);
    fs.mkdirSync(packDir, { recursive: true });
    writeFileSync(
      path.join(packDir, "controls.json"),
      JSON.stringify(pack.controls, null, 2),
    );

    const frameworksAdded: string[] = [];
    for (const fw of pack.frameworks) {
      if (addFrameworkToConfig(root, fw)) {
        frameworksAdded.push(fw);
      }
    }

    blank();
    success("Installed policy pack", `${pack.id} (${pack.controls.length} controls)`);
    if (frameworksAdded.length > 0) {
      success("Updated project frameworks", frameworksAdded.join(", "));
    }
    success("Dashboard will reflect this pack's controls");
    blank();

    recordActivity(root, {
      source: "cli",
      action: "policy_install",
      title: `Installed pack: ${pack.name}`,
      description: `Installed ${pack.controls.length} controls from ${pack.id} pack.${frameworksAdded.length > 0 ? ` Added ${frameworksAdded.join(", ")} to config frameworks.` : ""}`,
      details: { packs_affected: [pack.id], frameworks_added: frameworksAdded },
    });

    await showNextStepsMenu("policy-install");
  });

policyCmd
  .command("remove <packId>")
  .description("Remove a policy pack")
  .action(async (packId: string) => {
    const root = ensureGESInitialized();
    const packDir = path.join(root, "controls", packId);

    if (!fs.existsSync(packDir)) {
      error(`Pack '${packId}' is not installed.`);
      process.exit(1);
    }

    fs.rmSync(packDir, { recursive: true, force: true });

    const packs = getAllPacks();
    const pack = packs.find(p => p.id === packId);
    if (pack) {
      for (const fw of pack.frameworks) {
        removeFrameworkFromConfig(root, fw);
      }
    } else {
      removeFrameworkFromConfig(root, packId.toUpperCase());
    }

    blank();
    success("Removed policy pack", packId);
    blank();

    recordActivity(root, {
      source: "cli",
      action: "policy_remove",
      title: `Removed pack: ${packId}`,
      description: `Removed ${packId} pack and its controls from the project.`,
      details: { packs_affected: [packId] },
    });

    await showNextStepsMenu("policy-remove");
  });

export const policyCommand = policyCmd;
