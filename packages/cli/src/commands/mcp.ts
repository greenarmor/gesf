import { Command } from "commander";
import * as readline from "node:readline";
import { handleRequest } from "@greenarmor/ges-mcp-server";
import type { MCPRequest, MCPResponse } from "@greenarmor/ges-mcp-server";
import { mcpSetupCommand } from "./mcp-setup.js";

export const mcpCommand = new Command("mcp")
  .description("MCP AI Compliance Assistant")
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
