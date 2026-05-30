import * as fs from "node:fs";
import * as path from "node:path";

export const GES_DIR = ".ges";

export function findProjectRoot(startDir: string = process.cwd()): string | null {
  let dir = startDir;
  while (dir !== path.dirname(dir)) {
    if (fs.existsSync(path.join(dir, GES_DIR, "config.yaml"))) {
      return dir;
    }
    dir = path.dirname(dir);
  }
  return null;
}

export function ensureGESInitialized(): string {
  const root = findProjectRoot();
  if (!root) {
    console.error("Error: GESF not initialized. Run 'ges init' first.");
    process.exit(1);
  }
  return root;
}

export function writeFileSync(filePath: string, content: string): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content, "utf-8");
}

export function readJsonFile<T>(filePath: string): T | null {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content) as T;
  } catch {
    return null;
  }
}

export function writeJsonFile(filePath: string, data: unknown): void {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}
