import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { detectEcosystem, detectProject } from "./index.js";

let tmpDir: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-test-"));
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

function touch(file: string, content = "") {
  fs.writeFileSync(path.join(tmpDir, file), content);
}

describe("detectProject", () => {
  it("detects node with pnpm", () => {
    touch("pnpm-lock.yaml");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("node");
    expect(result.nodePackageManager).toBe("pnpm");
  });

  it("detects node with npm", () => {
    touch("package-lock.json");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("node");
    expect(result.nodePackageManager).toBe("npm");
  });

  it("detects node with yarn", () => {
    touch("yarn.lock");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("node");
    expect(result.nodePackageManager).toBe("yarn");
  });

  it("detects node with package.json only", () => {
    touch("package.json", "{}");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("node");
    expect(result.nodePackageManager).toBe("npm");
  });

  it("detects python with pip", () => {
    touch("requirements.txt");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("python");
    expect(result.pythonToolchain).toBe("pip");
  });

  it("detects python with poetry", () => {
    touch("poetry.lock");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("python");
    expect(result.pythonToolchain).toBe("poetry");
  });

  it("detects rust", () => {
    touch("Cargo.toml");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("rust");
  });

  it("detects go", () => {
    touch("go.mod");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("go");
  });

  it("detects ruby", () => {
    touch("Gemfile");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("ruby");
  });

  it("detects java", () => {
    touch("pom.xml");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("java");
  });

  it("detects php", () => {
    touch("composer.json", "{}");
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("php");
  });

  it("returns unknown for empty directory", () => {
    const result = detectProject(tmpDir);
    expect(result.ecosystem).toBe("unknown");
  });
});

describe("detectEcosystem", () => {
  it("returns node for pnpm project", () => {
    touch("pnpm-lock.yaml");
    expect(detectEcosystem(tmpDir)).toBe("node");
  });

  it("returns unknown for empty dir", () => {
    expect(detectEcosystem(tmpDir)).toBe("unknown");
  });

  it("returns rust for Cargo.toml", () => {
    touch("Cargo.toml");
    expect(detectEcosystem(tmpDir)).toBe("rust");
  });
});
