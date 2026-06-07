import * as http from "node:http";
import * as fs from "node:fs";
import * as path from "node:path";
import { runAudit, deduplicateFindings } from "@greenarmor/ges-audit-engine";
import { getAllPacks, getPacksForProjectType } from "@greenarmor/ges-policy-engine";
import { generateScoreFile } from "@greenarmor/ges-scoring-engine";
import type { ProjectConfig, ScoreFile, Control } from "@greenarmor/ges-core";
import type { Finding } from "@greenarmor/ges-audit-engine";
import { renderDashboard } from "./template.js";

export interface DashboardOptions {
  port?: number;
  host?: string;
  projectPath: string;
}

export interface DashboardData {
  projectName: string;
  projectType: string;
  frameworks: string[];
  gesfVersion: string;
  score: ScoreFile | null;
  controls: Control[];
  findings: Finding[];
  packs: { id: string; name: string; controlCount: number }[];
  lastAudit: string;
}

export function collectDashboardData(projectPath: string): DashboardData {
  const configPath = path.join(projectPath, ".ges", "config.json");
  let config: ProjectConfig | null = null;

  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    config = JSON.parse(raw);
  } catch {
    config = null;
  }

  let score: ScoreFile | null = null;
  try {
    const scorePath = path.join(projectPath, ".ges", "score.json");
    const raw = fs.readFileSync(scorePath, "utf-8");
    score = JSON.parse(raw);
  } catch {
    score = null;
  }

  let controls: Control[] = [];
  if (config) {
    try {
      const packs = getPacksForProjectType(config.project_type);
      const fwLower = new Set(config.frameworks.map(f => f.toLowerCase()));
      const DOMAIN_PACKS = new Set(["ai", "blockchain", "government"]);
      const filtered = packs.filter(pack =>
        DOMAIN_PACKS.has(pack.id.toLowerCase()) || fwLower.has(pack.id.toLowerCase())
      );
      controls = filtered.flatMap(p => p.controls);

      const overridesPath = path.join(projectPath, ".ges", "control-overrides.json");
      if (fs.existsSync(overridesPath)) {
        const overrides = JSON.parse(fs.readFileSync(overridesPath, "utf-8"));
        for (const override of overrides) {
          const control = controls.find(c => c.id === override.control_id);
          if (control) {
            control.status = override.status;
            for (const check of control.checks) {
              check.status = override.status;
            }
          }
        }
      }
    } catch {
      controls = [];
    }
  }

  let findings: Finding[] = [];
  try {
    const result = runAudit(projectPath);
    findings = deduplicateFindings(result.findings);
  } catch {
    findings = [];
  }

  if (!score && config) {
    try {
      score = generateScoreFile(controls, config.frameworks, findings);
    } catch {
      score = null;
    }
  }

  const allPacks = getAllPacks();
  const packsList = allPacks.map(p => ({
    id: p.id,
    name: p.name,
    controlCount: p.controls.length,
  }));

  const metadataPath = path.join(projectPath, ".ges", "metadata.json");
  let lastAudit = "";
  try {
    const meta = JSON.parse(fs.readFileSync(metadataPath, "utf-8"));
    lastAudit = meta.last_audit || meta.initialized_at || new Date().toISOString();
  } catch {
    lastAudit = new Date().toISOString();
  }

  return {
    projectName: config?.project_name || "Unknown Project",
    projectType: config?.project_type || "unknown",
    frameworks: config?.frameworks || [],
    gesfVersion: "1.1.1",
    score,
    controls,
    findings,
    packs: packsList,
    lastAudit,
  };
}

export function startDashboard(options: DashboardOptions): http.Server {
  const port = options.port || 3001;
  const host = options.host || "localhost";

  const server = http.createServer((req, res) => {
    if (!req.url) {
      res.writeHead(400);
      res.end("Bad request");
      return;
    }

    const url = new URL(req.url, `http://${host}:${port}`);

    if (url.pathname === "/" || url.pathname === "/index.html") {
      try {
        const data = collectDashboardData(options.projectPath);
        const html = renderDashboard(data);
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(html);
      } catch (err) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Dashboard error: ${err instanceof Error ? err.message : String(err)}`);
      }
      return;
    }

    if (url.pathname === "/api/data") {
      try {
        const data = collectDashboardData(options.projectPath);
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }));
      }
      return;
    }

    if (url.pathname === "/health") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }));
      return;
    }

    res.writeHead(404);
    res.end("Not found");
  });

  server.listen(port, host);

  return server;
}
