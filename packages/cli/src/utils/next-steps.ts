import { select } from "./prompts.js";
import { GESF_VERSION } from "@greenarmor/ges-core";

export interface NextStep {
  label: string;
  value: string;
  description?: string;
}

const DIVIDER = "  ─────────────────────────────────────────────";

function isInteractive(): boolean {
  return process.stdin.isTTY === true && process.stdout.isTTY === true;
}

export function getNextStepsForCommand(command: string, context?: Record<string, unknown>): NextStep[] {
  switch (command) {
    case "init":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan your project for compliance issues" },
        { label: "View score", value: "ges score", description: "See your compliance score" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "Check health", value: "ges doctor", description: "Diagnose your GESF setup" },
        { label: "View policies", value: "ges policy list", description: "See installed policy packs" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "audit":
      return [
        { label: "View score", value: "ges score", description: "See detailed compliance score" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "Fix issues", value: "ges doctor", description: "Check what needs attention" },
        { label: "Scan dependencies", value: "ges scan", description: "Run external security scanners" },
        { label: "View compliance", value: "ges compliance", description: "See compliance status by pack" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "score":
      return [
        { label: "Run audit", value: "ges audit", description: "Re-scan for compliance issues" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "View compliance", value: "ges compliance", description: "See status by pack" },
        { label: "Fix issues", value: "ges doctor", description: "Check what needs attention" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "report":
      return [
        { label: "Run audit", value: "ges audit", description: "Re-scan for compliance issues" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "View compliance", value: "ges compliance", description: "See status by pack" },
        { label: "Regenerate docs", value: "ges generate --all", description: "Update all documentation" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "doctor":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "Validate config", value: "ges validate", description: "Validate GESF configuration" },
        { label: "Fix issues", value: "ges generate --all", description: "Regenerate missing files" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "scan":
      return [
        { label: "Run audit", value: "ges audit", description: "Full compliance audit" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "compliance":
      return [
        { label: "Run audit", value: "ges audit", description: "Re-scan for issues" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "View policies", value: "ges policy list", description: "See available policy packs" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "validate":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "Check health", value: "ges doctor", description: "Diagnose GESF setup" },
        { label: "Fix issues", value: "ges generate --all", description: "Regenerate missing files" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "generate":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "Generate report", value: "ges report", description: "Create a compliance report" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "policy-list":
      return [
        { label: "Install a pack", value: "ges policy install", description: "Install a policy pack" },
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "View compliance", value: "ges compliance", description: "See status by pack" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "policy-install":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan with new pack" },
        { label: "View compliance", value: "ges compliance", description: "See status by pack" },
        { label: "View policies", value: "ges policy list", description: "See all policy packs" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "policy-remove":
      return [
        { label: "View policies", value: "ges policy list", description: "See remaining packs" },
        { label: "Run audit", value: "ges audit", description: "Re-scan after removal" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "update":
      return [
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "Check health", value: "ges doctor", description: "Diagnose GESF setup" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    case "mcp-setup":
      return [
        { label: "Setup another client", value: "ges mcp setup", description: "Configure another MCP client" },
        { label: "Check health", value: "ges doctor", description: "Diagnose GESF setup" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];

    default:
      return [
        { label: "Run audit", value: "ges audit", description: "Scan for compliance issues" },
        { label: "View score", value: "ges score", description: "See compliance score" },
        { label: "Check health", value: "ges doctor", description: "Diagnose GESF setup" },
        { label: "Exit", value: "exit", description: "Return to terminal" },
      ];
  }
}

export async function showNextStepsMenu(command: string, context?: Record<string, unknown>): Promise<void> {
  if (!isInteractive()) return;

  const steps = getNextStepsForCommand(command, context);

  console.log(DIVIDER);
  console.log("  What would you like to do next?\n");

  const answer = await select({
    message: "Select next action:",
    choices: steps.map(step => ({
      name: step.description ? `${step.label} — ${step.description}` : step.label,
      value: step.value,
    })),
  });

  if (answer === "exit") {
    console.log("");
    return;
  }

  console.log(`\n  Running: ${answer}\n`);
  console.log(DIVIDER + "\n");

  const { execSync } = await import("node:child_process");
  try {
    execSync(answer, { stdio: "inherit" });
  } catch {
    process.exit(1);
  }
}
