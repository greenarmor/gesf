import { Command } from "commander";
import * as readline from "node:readline";
import { handleRequest } from "@greenarmor/ges-mcp-server";
import type { MCPRequest, MCPResponse } from "@greenarmor/ges-mcp-server";
import { mcpSetupCommand } from "./mcp-setup.js";
import { banner, blank, info, DIM, GRAY, YELLOW, BOLD } from "../utils/ui.js";
import { select } from "../utils/prompts.js";

export const mcpCommand = new Command("mcp")
  .description("MCP AI Compliance Assistant")
  .action(async () => {
    if (!process.stdin.isTTY || !process.stdout.isTTY) {
      mcpCommand.outputHelp();
      return;
    }

    banner("GESF MCP Server", "AI Compliance Assistant Integration");

    const action = await select({
      message: "What would you like to do?",
      choices: [
        { name: `Setup MCP clients ${DIM("— configure Claude, Cursor, VS Code, etc.")}`, value: "setup" },
        { name: `Start MCP server ${DIM("— JSON-RPC over stdio (for advanced use)")}`, value: "start" },
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
      execSync(`ges mcp ${action}`, { stdio: "inherit" });
    } catch {
      process.exit(1);
    }
  })
  .addCommand(
    new Command("start")
      .description("Start the GESF MCP server (JSON-RPC over stdio)")
      .action(() => {
        const rl = readline.createInterface({ input: process.stdin });

        rl.on("line", (line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          let parsed: MCPRequest;
          try {
            parsed = JSON.parse(trimmed);
          } catch {
            process.stdout.write(
              JSON.stringify({
                jsonrpc: "2.0",
                id: null,
                error: { code: -32700, message: "Parse error" },
              }) + "\n",
            );
            return;
          }

          try {
            const response = handleRequest(parsed);
            if (response !== null) {
              process.stdout.write(JSON.stringify(response) + "\n");
            }
          } catch (err) {
            process.stdout.write(
              JSON.stringify({
                jsonrpc: "2.0",
                id: parsed.id ?? null,
                error: {
                  code: -32603,
                  message: "Internal error",
                  data: err instanceof Error ? err.message : String(err),
                },
              }) + "\n",
            );
          }
        });

        rl.on("close", () => {
          process.exit(0);
        });
      }),
  )
  .addCommand(mcpSetupCommand);
