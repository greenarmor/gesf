import { Command } from "commander";
import { getAllPacks, listPackIds } from "@greenarmor/ges-policy-engine";
import { ensureGESInitialized, readJsonFile, writeFileSync, writeJsonFile } from "../utils/project.js";
import type { ProjectConfig } from "@greenarmor/ges-core";
import { showNextStepsMenu } from "../utils/next-steps.js";
import * as fs from "node:fs";
import * as path from "node:path";

const policyCmd = new Command("policy")
  .description("Manage policy packs");

policyCmd
  .command("list")
  .description("List available policy packs")
  .action(async () => {
    console.log("\n  Available Policy Packs:\n");
    const packs = getAllPacks();
    for (const pack of packs) {
      console.log(`  ${pack.id.padEnd(15)} ${pack.name}`);
      console.log(`  ${"".padEnd(15)} ${pack.controls.length} controls | ${pack.project_types.join(", ")}`);
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
      console.error(`  Error: Pack '${packId}' not found. Available: ${listPackIds().join(", ")}`);
      process.exit(1);
    }

    const packDir = path.join(root, "controls", pack.id);
    fs.mkdirSync(packDir, { recursive: true });
    writeFileSync(
      path.join(packDir, "controls.json"),
      JSON.stringify(pack.controls, null, 2),
    );

    console.log(`\n  ✓ Installed policy pack: ${pack.id} (${pack.controls.length} controls)\n`);

    await showNextStepsMenu("policy-install");
  });

policyCmd
  .command("remove <packId>")
  .description("Remove a policy pack")
  .action(async (packId: string) => {
    const root = ensureGESInitialized();
    const packDir = path.join(root, "controls", packId);

    if (!fs.existsSync(packDir)) {
      console.error(`  Error: Pack '${packId}' is not installed.`);
      process.exit(1);
    }

    fs.rmSync(packDir, { recursive: true, force: true });
    console.log(`\n  ✓ Removed policy pack: ${packId}\n`);

    await showNextStepsMenu("policy-remove");
  });

export const policyCommand = policyCmd;
