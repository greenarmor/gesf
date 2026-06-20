import * as fs from "node:fs";
import * as path from "node:path";
import type { Control, ControlOverride, ControlStatus, ProjectConfig } from "../types/index.js";
import { safeWriteJson } from "../utils/index.js";

const GES_DIR = ".ges";
const CONTROLS_DIR = "controls";
const CONFIG_FILE = "config.json";
const OVERRIDES_FILE = "control-overrides.json";

export function loadControlsFromDisk(projectPath: string): Control[] {
  const controlsDir = path.join(projectPath, CONTROLS_DIR);
  const result: Control[] = [];

  try {
    const entries = fs.readdirSync(controlsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const ctrlFile = path.join(controlsDir, entry.name, "controls.json");
      if (!fs.existsSync(ctrlFile)) continue;
      try {
        const raw = fs.readFileSync(ctrlFile, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const ctrl of parsed) {
            if (ctrl && typeof ctrl.id === "string") {
              result.push(ctrl as Control);
            }
          }
        }
      } catch {
        // skip malformed controls.json
      }
    }
  } catch {
    // controls dir may not exist
  }

  return result;
}

export function getInstalledPackIds(projectPath: string): Set<string> {
  const ids = new Set<string>();
  const controlsDir = path.join(projectPath, CONTROLS_DIR);

  try {
    const entries = fs.readdirSync(controlsDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const ctrlFile = path.join(controlsDir, entry.name, "controls.json");
        if (fs.existsSync(ctrlFile)) {
          ids.add(entry.name);
        }
      }
    }
  } catch {
    // controls dir may not exist
  }

  return ids;
}

export function loadControlOverrides(projectPath: string): ControlOverride[] {
  const overridesPath = path.join(projectPath, GES_DIR, OVERRIDES_FILE);
  try {
    const raw = fs.readFileSync(overridesPath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveControlOverride(
  projectPath: string,
  controlId: string,
  status: ControlStatus,
  reason: string,
): void {
  const overrides = loadControlOverrides(projectPath);
  const existingIdx = overrides.findIndex(o => o.control_id === controlId);
  const entry: ControlOverride = { control_id: controlId, status, reason };

  if (existingIdx >= 0) {
    overrides[existingIdx] = entry;
  } else {
    overrides.push(entry);
  }

  const overridesPath = path.join(projectPath, GES_DIR, OVERRIDES_FILE);
  safeWriteJson(overridesPath, overrides);
}

export function applyOverridesToControls(
  controls: Control[],
  overrides: ControlOverride[],
): Control[] {
  if (overrides.length === 0) return controls;

  return controls.map(control => {
    const override = overrides.find(o => o.control_id === control.id);
    if (!override) return control;
    return {
      ...control,
      status: override.status,
      checks: control.checks.map(check => ({ ...check, status: override.status })),
    };
  });
}

export function loadConfig(projectPath: string): ProjectConfig | null {
  const configPath = path.join(projectPath, GES_DIR, CONFIG_FILE);
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    return JSON.parse(raw) as ProjectConfig;
  } catch {
    return null;
  }
}

export function addFrameworkToConfig(projectPath: string, framework: string): boolean {
  const configPath = path.join(projectPath, GES_DIR, CONFIG_FILE);
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    if (!config.frameworks) config.frameworks = [];
    const fwLower = new Set(config.frameworks.map((f: string) => f.toLowerCase()));
    if (fwLower.has(framework.toLowerCase())) return false;

    config.frameworks.push(framework);
    safeWriteJson(configPath, config);
    return true;
  } catch {
    return false;
  }
}

export function removeFrameworkFromConfig(projectPath: string, framework: string): boolean {
  const configPath = path.join(projectPath, GES_DIR, CONFIG_FILE);
  try {
    const raw = fs.readFileSync(configPath, "utf-8");
    const config = JSON.parse(raw);
    if (!config.frameworks) return false;

    const before = config.frameworks.length;
    config.frameworks = config.frameworks.filter(
      (f: string) => f.toLowerCase() !== framework.toLowerCase()
    );

    if (config.frameworks.length === before) return false;

    safeWriteJson(configPath, config);
    return true;
  } catch {
    return false;
  }
}
