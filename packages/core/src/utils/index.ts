import * as fs from "node:fs";
import * as path from "node:path";

/**
 * Writes JSON to disk atomically using write-to-temp-then-rename.
 *
 * On POSIX systems, `fs.renameSync()` is atomic — the file is either
 * the old version or the new version, never half-written. This prevents
 * corruption if the process crashes mid-write (power loss, OOM, SIGKILL).
 *
 * The temp file is created in the same directory as the target to ensure
 * the rename operation is atomic (cross-device renames are not atomic).
 */
export function safeWriteJson(filePath: string, data: unknown, indent = 2): void {
  const json = JSON.stringify(data, null, indent);
  safeWriteFile(filePath, json);
}

/**
 * Writes a string to disk atomically using write-to-temp-then-rename.
 *
 * Creates parent directories if they don't exist.
 * Uses `.tmp` extension for the intermediate file, cleaned up on error.
 */
export function safeWriteFile(filePath: string, content: string, _encoding: BufferEncoding = "utf-8"): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const tmpPath = filePath + ".tmp";

  try {
    fs.writeFileSync(tmpPath, content, "utf-8");
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Clean up temp file if rename failed
    try {
      if (fs.existsSync(tmpPath)) {
        fs.unlinkSync(tmpPath);
      }
    } catch {
      // ignore cleanup errors
    }
    throw err;
  }
}

/**
 * Reads and parses a JSON file with error handling.
 * Returns the fallback value if the file doesn't exist or is malformed.
 */
export function safeReadJson<T>(filePath: string, fallback: T): T {
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return data as T;
  } catch {
    return fallback;
  }
}
