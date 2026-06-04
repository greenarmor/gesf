import { Command } from "commander";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as url from "node:url";
import { select } from "../utils/prompts.js";
import { showNextStepsMenu } from "../utils/next-steps.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const SERVER_NAME = "gesf";

type ClientId =
  | "claude-desktop"
  | "vscode"
  | "cursor"
  | "opencode"
  | "crush"
  | "windsurf";

interface ClientConfig {
  id: ClientId;
  name: string;
  configPaths: string[];
  configKey: string;
  format: "mcpServers" | "mcp" | "servers" | "opencode";
}

const CLIENTS: ClientConfig[] = [
  {
    id: "claude-desktop",
    name: "Claude Desktop",
    configPaths: [
      path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Claude",
        "claude_desktop_config.json",
      ),
      path.join(
        os.homedir(),
        ".config",
        "Claude",
        "claude_desktop_config.json",
      ),
    ],
    configKey: "mcpServers",
    format: "mcpServers",
  },
  {
    id: "vscode",
    name: "VS Code (Copilot)",
    configPaths: [
      path.join(".vscode", "mcp.json"),
      path.join(
        os.homedir(),
        "Library",
        "Application Support",
        "Code",
        "User",
        "mcp.json",
      ),
      path.join(
        os.homedir(),
        ".config",
        "Code",
        "User",
        "mcp.json",
      ),
      path.join(
        os.homedir(),
        "AppData",
        "Roaming",
        "Code",
        "User",
        "mcp.json",
      ),
    ],
    configKey: "servers",
    format: "servers",
  },
  {
    id: "cursor",
    name: "Cursor",
    configPaths: [
      path.join(".cursor", "mcp.json"),
    ],
    configKey: "mcpServers",
    format: "mcpServers",
  },
  {
    id: "opencode",
    name: "OpenCode",
    configPaths: [
      "opencode.json",
      path.join(".config", "opencode", "opencode.json"),
    ],
    configKey: "mcp",
    format: "opencode",
  },
  {
    id: "crush",
    name: "Crush",
    configPaths: [
      path.join(
        os.homedir(),
        ".local",
        "share",
        "crush",
        "crush.json",
      ),
    ],
    configKey: "mcp",
    format: "mcp",
  },
  {
    id: "windsurf",
    name: "Windsurf",
    configPaths: [
      path.join(".windsurf", "mcp.json"),
    ],
    configKey: "mcpServers",
    format: "mcpServers",
  },
];

function resolveServerPath(): { command: string; args: string[] } {
  const searchPaths = [
    path.resolve(__dirname, "..", "..", "..", "mcp-server", "dist", "server.js"),
    path.resolve(__dirname, "..", "..", "mcp-server", "dist", "server.js"),
    path.resolve(__dirname, "..", "..", "mcp-server", "bundle", "server.js"),
  ];

  for (const serverPath of searchPaths) {
    if (fs.existsSync(serverPath)) {
      return { command: "node", args: [serverPath] };
    }
  }

  return { command: "npx", args: ["-y", "@greenarmor/ges-mcp-server"] };
}

function buildServerEntry(client: ClientConfig): Record<string, unknown> {
  const { command, args } = resolveServerPath();

  if (client.format === "opencode") {
    return {
      type: "local",
      command: [command, ...args],
      enabled: true,
    };
  }

  const entry: Record<string, unknown> = { command, args };

  if (client.format === "servers" || client.format === "mcp") {
    entry.type = "stdio";
  }

  return entry;
}

function readJsonFile(filePath: string): Record<string, unknown> | null {
  try {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function writeJsonFile(filePath: string, data: Record<string, unknown>): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function addServerToConfig(
  config: Record<string, unknown>,
  client: ClientConfig,
): Record<string, unknown> {
  const result = { ...config };
  const key = client.configKey;

  const existing = (result[key] as Record<string, unknown>) || {};
  result[key] = {
    ...existing,
    [SERVER_NAME]: buildServerEntry(client),
  };

  return result;
}

function getConfigPath(client: ClientConfig): string {
  for (const p of client.configPaths) {
    if (fs.existsSync(p)) return p;
  }
  return client.configPaths[0];
}

function printSetupInstructions(client: ClientConfig, configPath: string): void {
  console.log(`\n  ${client.name}`);
  console.log(`  Config: ${configPath}`);

  switch (client.id) {
    case "claude-desktop":
      console.log("  Restart Claude Desktop to load the server.");
      break;
    case "vscode":
      console.log("  Reload the VS Code window (Cmd+Shift+P / Ctrl+Shift+P → Developer: Reload Window).");
      console.log("  Verify: Open Copilot Chat → Agent mode → tools icon (🔨) → look for 'gesf'.");
      break;
    case "cursor":
      console.log("  Restart Cursor to load the server.");
      break;
    case "opencode":
      console.log("  Restart OpenCode to load the server.");
      break;
    case "crush":
      console.log("  Restart Crush to load the server.");
      break;
    case "windsurf":
      console.log("  Restart Windsurf to load the server.");
      break;
  }
}

async function setupClient(clientId: ClientId, defaultToGlobal = false): Promise<void> {
  const client = CLIENTS.find((c) => c.id === clientId);
  if (!client) {
    console.error(`Unknown client: ${clientId}`);
    process.exit(1);
  }

  if (client.id === "vscode") {
    await setupVsCode(client, defaultToGlobal);
    return;
  }

  const configPath = getConfigPath(client);
  const existing = readJsonFile(configPath) || {};
  const updated = addServerToConfig(existing, client);
  writeJsonFile(configPath, updated);

  printSetupInstructions(client, configPath);
  console.log(`  Status: configured\n`);

  await showNextStepsMenu("mcp-setup");
}

async function setupVsCode(client: ClientConfig, defaultToGlobal = false): Promise<void> {
  const globalPaths = client.configPaths.slice(1);
  const globalPath = globalPaths.find((p) => fs.existsSync(p)) || globalPaths[0];
  const projectPath = client.configPaths[0];

  let choice: string;

  if (defaultToGlobal) {
    choice = "global";
  } else {
    console.log("\n  VS Code MCP Setup\n");
    console.log("  Choose configuration scope:\n");
    console.log(`  1) Global — available in all projects (${globalPath})`);
    console.log(`  2) Project — current project only (${projectPath})`);
    console.log("");

    choice = await select({
      message: "Configuration scope:",
      choices: [
        { name: "Global (recommended — all projects)", value: "global" },
        { name: "Project (current project only)", value: "project" },
      ],
    });
  }

  const configPath = choice === "global" ? globalPath : projectPath;
  const existing = readJsonFile(configPath) || {};

  if (existing.inputs) {
    delete existing.inputs;
    console.log("  Removed invalid 'inputs' section from existing config.");
  }

  const updated = addServerToConfig(existing, client);
  writeJsonFile(configPath, updated);

  printSetupInstructions(client, configPath);
  console.log(`  Status: configured\n`);

  await showNextStepsMenu("mcp-setup");
}

async function setupAll(): Promise<void> {
  console.log("\n  GESF MCP Server Setup\n");
  console.log("  ─────────────────────\n");

  for (const client of CLIENTS) {
    try {
      await setupClient(client.id, true);
    } catch (err) {
      console.log(`  ${client.name}: skipped (${err instanceof Error ? err.message : String(err)})\n`);
    }
  }

  console.log("  Done. Restart your MCP clients to connect.\n");

  await showNextStepsMenu("mcp-setup");
}

async function setupInteractive(): Promise<void> {
  const clientId = await select({
    message: "Which MCP client do you want to configure?",
    choices: [
      ...CLIENTS.map((c) => ({ name: c.name, value: c.id })),
      { name: "All clients", value: "all" },
    ],
  });

  if (clientId === "all") {
    await setupAll();
  } else {
    await setupClient(clientId as ClientId);
  }

  await showNextStepsMenu("mcp-setup");
}

export const mcpSetupCommand = new Command("setup")
  .description("Configure MCP clients to use the GESF compliance server")
  .addCommand(
    new Command("claude")
      .description("Configure Claude Desktop")
      .action(() => setupClient("claude-desktop")),
  )
  .addCommand(
    new Command("vscode")
      .description("Configure VS Code (Copilot)")
      .action(() => setupClient("vscode")),
  )
  .addCommand(
    new Command("cursor")
      .description("Configure Cursor")
      .action(() => setupClient("cursor")),
  )
  .addCommand(
    new Command("opencode")
      .description("Configure OpenCode")
      .action(() => setupClient("opencode")),
  )
  .addCommand(
    new Command("crush")
      .description("Configure Crush")
      .action(() => setupClient("crush")),
  )
  .addCommand(
    new Command("windsurf")
      .description("Configure Windsurf")
      .action(() => setupClient("windsurf")),
  )
  .addCommand(
    new Command("all")
      .description("Configure all supported MCP clients")
      .action(() => setupAll()),
  )
  .action(() => setupInteractive());
