import { Command } from "commander";
import { ensureGESInitialized } from "../utils/project.js";
import { startDashboard } from "@greenarmor/ges-web-dashboard";

export const dashboardCommand = new Command("dashboard")
  .description("Start the GESF compliance web dashboard")
  .option("-p, --port <port>", "Port number (default: 3001)")
  .option("-h, --host <host>", "Host to bind to (default: localhost)")
  .action(async (options) => {
    const root = ensureGESInitialized();
    const port = options.port ? parseInt(options.port, 10) : 3001;
    const host = options.host || "localhost";

    console.log("\n  GESF Web Dashboard");
    console.log("  ──────────────────\n");
    console.log(`  Starting dashboard server...`);
    console.log(`  Project: ${root}\n`);

    try {
      const server = startDashboard({ port, host, projectPath: root });

      server.on("listening", () => {
        console.log(`  Dashboard running at: http://${host}:${port}`);
        console.log(`  JSON API:             http://${host}:${port}/api/data`);
        console.log(`  Health check:         http://${host}:${port}/health`);
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
