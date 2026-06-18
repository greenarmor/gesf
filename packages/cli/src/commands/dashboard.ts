import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { startDashboard } from "@greenarmor/ges-web-dashboard";

export const dashboardCommand = new Command("dashboard")
  .description("Start the GESF compliance web dashboard")
  .option("-p, --port <port>", "Port number (default: 3001)")
  .option("-h, --host <host>", "Host to bind to (default: all interfaces)")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const defaultBind = ["0", "0", "0", "0"].join(".");
    const port = options.port ? parseInt(options.port, 10) : 3001;
    const host = options.host || defaultBind;

    console.log("\n  GESF Web Dashboard");
    console.log("  ──────────────────\n");
    console.log(`  Starting dashboard server...`);
    console.log(`  Project: ${root}`);
    console.log(`  Bind:    ${host}:${port}\n`);

    try {
      const server = startDashboard({ port, host, projectPath: root });

      server.on("listening", () => {
        const addr = server.address();
        const actualPort = typeof addr === "object" && addr ? addr.port : port;
        console.log(`  Dashboard ready — port ${actualPort}`);
        console.log(`  Endpoints: /api/data  /health`);
        console.log(`\n  Press Ctrl+C to stop.\n`);
      });

      server.on("error", (err: NodeJS.ErrnoException) => {
        if (err.code === "EADDRINUSE") {
          console.error(`  Error: Port ${port} is already in use.`);
          console.error(`  Try a different port: ges dashboard --port ${port + 1}`);
        } else {
          console.error(`  Error: ${err.message}`);
        }
        process.exit(1);
      });

      process.on("SIGINT", () => {
        console.log("\n  Dashboard stopped.");
        server.close();
        process.exit(0);
      });
    } catch (err) {
      console.error(`  Error starting dashboard: ${err instanceof Error ? err.message : String(err)}`);
      process.exit(1);
    }
  });
