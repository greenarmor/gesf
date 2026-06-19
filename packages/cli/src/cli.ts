#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands/init.js";
import { auditCommand } from "./commands/audit.js";
import { scoreCommand } from "./commands/score.js";
import { reportCommand } from "./commands/report.js";
import { doctorCommand } from "./commands/doctor.js";
import { scanCommand } from "./commands/scan.js";
import { complianceCommand } from "./commands/compliance.js";
import { validateCommand } from "./commands/validate.js";
import { generateCommand } from "./commands/generate.js";
import { policyCommand } from "./commands/policy.js";
import { updateCommand } from "./commands/update.js";
import { mcpCommand } from "./commands/mcp.js";
import { badgeCommand } from "./commands/badge.js";
import { controlCommand } from "./commands/control.js";
import { fixCommand } from "./commands/fix.js";
import { hooksCommand } from "./commands/hooks.js";
import { dashboardCommand } from "./commands/dashboard.js";
import { governanceCommand } from "./commands/governance.js";
import { assignCommand } from "./commands/assign.js";
import { CLI_VERSION } from "./utils/version.js";
import { createRequire } from "node:module";

const program = new Command();

program
  .name("ges")
  .description("Green Engineering Standard Framework - Compliance-as-Code CLI")
  .version(CLI_VERSION);

program.addCommand(initCommand);
program.addCommand(auditCommand);
program.addCommand(scoreCommand);
program.addCommand(reportCommand);
program.addCommand(doctorCommand);
program.addCommand(scanCommand);
program.addCommand(complianceCommand);
program.addCommand(validateCommand);
program.addCommand(generateCommand);
program.addCommand(policyCommand);
program.addCommand(updateCommand);
program.addCommand(mcpCommand);
program.addCommand(badgeCommand);
program.addCommand(controlCommand);
program.addCommand(fixCommand);
program.addCommand(hooksCommand);
program.addCommand(dashboardCommand);
program.addCommand(governanceCommand);
program.addCommand(assignCommand);

program.parse();
