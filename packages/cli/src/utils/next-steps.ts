import { select } from "./prompts.js";
import { divider, blank, label, info, GREEN, DIM, GRAY } from "./ui.js";

export interface NextStep {
  label: string;
  value: string;
  description?: string;
}

function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

const ALL_COMMANDS: Record<string, NextStep> = {
  audit:     { label: "Run audit",           value: "ges audit",               description: "Scan for compliance issues" },
  score:     { label: "View score",          value: "ges score",               description: "See compliance score" },
  compliance:{ label: "View compliance",     value: "ges compliance",          description: "See status by pack" },
  report:    { label: "Generate report",     value: "ges report",              description: "Create compliance/security report" },
  badge:     { label: "Generate badge",      value: "ges badge",               description: "Create SVG badge for README" },
  doctor:    { label: "Check health",        value: "ges doctor",              description: "Diagnose GESF setup" },
  validate:  { label: "Validate config",     value: "ges validate",            description: "Validate configuration and controls" },
  scan:      { label: "Scan dependencies",   value: "ges scan",                description: "Run external security scanners" },
  generate:  { label: "Regenerate docs",     value: "ges generate --all",      description: "Update all documentation and workflows" },
  policy:    { label: "Manage policies",     value: "ges policy list",         description: "List, install, or remove policy packs" },
  update:    { label: "Check updates",       value: "ges update",              description: "Check for GESF updates" },
  governance:{ label: "Governance",          value: "ges governance list",     description: "View approval provenance chains" },
};

function buildSteps(exclude: string[]): NextStep[] {
  const steps: NextStep[] = [];
  for (const [key, step] of Object.entries(ALL_COMMANDS)) {
    if (!exclude.includes(key)) steps.push(step);
  }
  steps.push({ label: "Exit", value: "exit", description: "Return to terminal" });
  return steps;
}

export function getNextStepsForCommand(command: string, context?: Record<string, unknown>): NextStep[] {
  switch (command) {
    case "init":
      return buildSteps(["init"]);

    case "audit":
      return buildSteps(["audit"]);

    case "score":
      return buildSteps(["score"]);

    case "report":
      return buildSteps(["report"]);

    case "badge":
      return buildSteps(["badge"]);

    case "doctor":
      return buildSteps(["doctor"]);

    case "scan":
      return buildSteps(["scan"]);

    case "compliance":
      return buildSteps(["compliance"]);

    case "validate":
      return buildSteps(["validate"]);

    case "generate":
      return buildSteps(["generate"]);

    case "policy-list":
      return buildSteps(["policy"]);

    case "policy-install":
      return buildSteps(["policy"]);

    case "policy-remove":
      return buildSteps(["policy"]);

    case "update":
      return buildSteps(["update"]);

    case "governance":
      return buildSteps(["governance"]);

    case "mcp-setup":
      return buildSteps(["mcp-setup"]);

    default:
      return buildSteps([]);
  }
}

export async function showNextStepsMenu(command: string, context?: Record<string, unknown>): Promise<void> {
  if (!isInteractive()) return;

  const steps = getNextStepsForCommand(command, context);

  divider();
  label("What would you like to do next?");

  const answer = await select({
    message: "Choose your next action:",
    choices: steps.map(step => ({
      name: step.description ? `${step.label} — ${step.description}` : step.label,
      value: step.value,
    })),
  });

  if (answer === "exit") {
    console.log("");
    return;
  }

  blank();
  info("Running", GREEN(answer));
  divider();
  blank();

  const { execSync } = await import("node:child_process");
  try {
    execSync(answer, { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}
