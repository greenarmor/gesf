import { Command } from "commander";
import { ensureGESInitialized, readJsonFile, writeJsonFile } from "../utils/project.js";
import type { ControlOverride, ControlStatus } from "@greenarmor/ges-core";
import { getAllPacks } from "@greenarmor/ges-policy-engine";
import * as path from "node:path";

const VALID_STATUSES: ControlStatus[] = ["pass", "fail", "warning", "not-applicable", "not-implemented"];

export const controlCommand = new Command("control")
  .description("Mark a compliance control status manually")
  .argument("<controlId>", "Control ID (e.g. GDPR-ART32-001)")
  .argument("<status>", "Status: pass, fail, warning, not-applicable, not-implemented")
  .option("-r, --reason <reason>", "Reason for the override")
  .action(async (controlId: string, status: string, options) => {
    const normalizedStatus = status as ControlStatus;

    if (!VALID_STATUSES.includes(normalizedStatus)) {
      console.error(`  Error: Invalid status "${status}". Valid values: ${VALID_STATUSES.join(", ")}`);
      process.exit(1);
    }

    const allPacks = getAllPacks();
    const allControls = allPacks.flatMap(p => p.controls);
    const control = allControls.find(c => c.id === controlId);

    if (!control) {
      console.error(`  Error: Unknown control ID "${controlId}".`);
      console.error(`  Available control IDs can be found in controls/ directory or via 'ges compliance'.`);
      process.exit(1);
    }

    const root = ensureGESInitialized();
    const overridePath = path.join(root, ".ges", "control-overrides.json");
    const existing = readJsonFile<ControlOverride[]>(overridePath) || [];
    const overrides = Array.isArray(existing) ? existing : [];

    const filtered = overrides.filter(o => o.control_id !== controlId);

    filtered.push({
      control_id: controlId,
      status: normalizedStatus,
      reason: options.reason || `Manually set to ${normalizedStatus}`,
    });

    writeJsonFile(overridePath, filtered);

    console.log(`\n  [✓] Control ${controlId} marked as: ${normalizedStatus}`);
    console.log(`      ${control.name}`);
    console.log(`      Reason: ${options.reason || `Manually set to ${normalizedStatus}`}`);
    console.log(`\n  Override saved to: ${overridePath}`);
    console.log(`  Run 'ges audit' to see the updated compliance score.\n`);
  });
