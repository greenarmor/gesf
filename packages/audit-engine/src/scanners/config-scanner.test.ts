import { describe, it, expect } from "vitest";
import { ConfigScanner } from "./config-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: "/test",
    files: Object.keys(files),
    fileContents,
    isWebProject: true,
  };
}

describe("ConfigScanner", () => {
  const scanner = new ConfigScanner();

  it("flags missing helmet for express app", () => {
    const ctx = makeCtx({
      "package.json": JSON.stringify({
        dependencies: { express: "4.18.0" },
      }),
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-001")).toBe(true);
  });

  it("does not flag helmet when installed", () => {
    const ctx = makeCtx({
      "package.json": JSON.stringify({
        dependencies: { express: "4.18.0", helmet: "7.0.0" },
      }),
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-001")).toBe(false);
  });

  it("flags missing CORS package", () => {
    const ctx = makeCtx({
      "package.json": JSON.stringify({
        dependencies: { express: "4.18.0", helmet: "7.0.0" },
      }),
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-002")).toBe(true);
  });

  it("flags missing .gitignore", () => {
    const ctx = makeCtx({
      "package.json": JSON.stringify({ dependencies: {} }),
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-008" || f.ruleId === "CONFIG-009")).toBe(true);
  });

  it("does not flag .gitignore when present with .env", () => {
    const ctx = makeCtx({
      ".gitignore": `node_modules/\n.env\ndist/`,
    });
    const findings = scanner.scan(ctx);
    const gitignoreFindings = findings.filter(f => f.ruleId === "CONFIG-008" || f.ruleId === "CONFIG-009");
    expect(gitignoreFindings.length).toBe(0);
  });

  it("flags Docker running as root", () => {
    const ctx = makeCtx({
      "Dockerfile": `FROM node:18\nWORKDIR /app\nCOPY . .\nCMD ["node", "index.js"]`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-005")).toBe(true);
  });

  it("does not flag Docker with non-root USER", () => {
    const ctx = makeCtx({
      "Dockerfile": `FROM node:18\nUSER node\nCMD ["node", "index.js"]`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "CONFIG-005")).toBe(false);
  });

  it("flags .env file without .gitignore entry", () => {
    const ctx = makeCtx({
      ".gitignore": `node_modules/\n`,
      ".env": `SECRET=hello`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes(".env") || f.title.includes("gitignore"))).toBe(true);
  });
});
