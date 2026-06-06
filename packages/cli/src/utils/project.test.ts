import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import {
  findProjectRoot,
  readJsonFile,
  writeJsonFile,
  writeFileSync,
  GES_DIR,
} from "./project.js";

let tmpDir: string;
let origCwd: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-cli-test-"));
  origCwd = process.cwd();
});

afterEach(() => {
  process.chdir(origCwd);
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("findProjectRoot", () => {
  it("finds root with config.json", () => {
    fs.mkdirSync(path.join(tmpDir, GES_DIR));
    fs.writeFileSync(path.join(tmpDir, GES_DIR, "config.json"), "{}");
    expect(findProjectRoot(tmpDir)).toBe(tmpDir);
  });

  it("finds root with config.yaml (backwards compat)", () => {
    fs.mkdirSync(path.join(tmpDir, GES_DIR));
    fs.writeFileSync(path.join(tmpDir, GES_DIR, "config.yaml"), "name: test");
    expect(findProjectRoot(tmpDir)).toBe(tmpDir);
  });

  it("returns null when no config found", () => {
    expect(findProjectRoot(tmpDir)).toBeNull();
  });

  it("finds root from nested subdirectory", () => {
    fs.mkdirSync(path.join(tmpDir, GES_DIR));
    fs.writeFileSync(path.join(tmpDir, GES_DIR, "config.json"), "{}");
    const nested = path.join(tmpDir, "src", "deep", "path");
    fs.mkdirSync(nested, { recursive: true });
    expect(findProjectRoot(nested)).toBe(tmpDir);
  });
});

describe("readJsonFile", () => {
  it("reads valid JSON", () => {
    const filePath = path.join(tmpDir, "test.json");
    fs.writeFileSync(filePath, '{"name":"test","value":42}');
    const result = readJsonFile<{ name: string; value: number }>(filePath);
    expect(result).not.toBeNull();
    expect(result!.name).toBe("test");
    expect(result!.value).toBe(42);
  });

  it("returns null for missing file", () => {
    expect(readJsonFile(path.join(tmpDir, "nonexistent.json"))).toBeNull();
  });

  it("returns null for invalid JSON", () => {
    const filePath = path.join(tmpDir, "bad.json");
    fs.writeFileSync(filePath, "{not valid json}");
    expect(readJsonFile(filePath)).toBeNull();
  });
});

describe("writeJsonFile", () => {
  it("writes JSON to file", () => {
    const filePath = path.join(tmpDir, "output.json");
    writeJsonFile(filePath, { name: "test", items: [1, 2, 3] });
    const content = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(content);
    expect(parsed.name).toBe("test");
    expect(parsed.items).toEqual([1, 2, 3]);
  });

  it("creates parent directories", () => {
    const filePath = path.join(tmpDir, "nested", "dir", "output.json");
    writeJsonFile(filePath, { ok: true });
    expect(fs.existsSync(filePath)).toBe(true);
  });
});

describe("writeFileSync", () => {
  it("writes content to file", () => {
    const filePath = path.join(tmpDir, "test.txt");
    writeFileSync(filePath, "hello world");
    expect(fs.readFileSync(filePath, "utf-8")).toBe("hello world");
  });

  it("creates parent directories if needed", () => {
    const filePath = path.join(tmpDir, "a", "b", "c", "file.txt");
    writeFileSync(filePath, "nested");
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it("overwrites existing file", () => {
    const filePath = path.join(tmpDir, "overwrite.txt");
    writeFileSync(filePath, "first");
    writeFileSync(filePath, "second");
    expect(fs.readFileSync(filePath, "utf-8")).toBe("second");
  });
});
