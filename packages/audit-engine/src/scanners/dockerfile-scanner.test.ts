import { describe, it, expect } from "vitest";
import { DockerfileScanner } from "./dockerfile-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: "/test",
    files: Object.keys(files),
    fileContents,
  };
}

describe("DockerfileScanner", () => {
  const scanner = new DockerfileScanner();

  it("should detect missing non-root USER instruction", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20-alpine\nWORKDIR /app\nCOPY . .\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const rootFinding = findings.find(f => f.ruleId === "DOCKER-001");
    expect(rootFinding).toBeDefined();
    expect(rootFinding!.severity).toBe("critical");
    expect(rootFinding!.controlIds).toContain("CIS-DOCKER-001");
  });

  it("should not flag non-root USER as root", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20-alpine\nRUN adduser -D appuser\nUSER appuser\nWORKDIR /app\nCOPY . .\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const rootFinding = findings.find(f => f.ruleId === "DOCKER-001");
    expect(rootFinding).toBeUndefined();
  });

  it("should detect :latest tag", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:latest\nUSER appuser\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const latestFindings = findings.filter(f => f.ruleId === "DOCKER-002");
    expect(latestFindings.length).toBeGreaterThanOrEqual(1);
    expect(latestFindings[0].controlIds).toContain("CIS-DOCKER-003");
  });

  it("should detect missing HEALTHCHECK", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20-alpine\nUSER appuser\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const hcFinding = findings.find(f => f.ruleId === "DOCKER-003");
    expect(hcFinding).toBeDefined();
    expect(hcFinding!.controlIds).toContain("CIS-DOCKER-009");
  });

  it("should detect ADD instruction", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20-alpine\nUSER appuser\nADD archive.tar.gz /app/\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const addFinding = findings.find(f => f.ruleId === "DOCKER-008");
    expect(addFinding).toBeDefined();
  });

  it("should detect secrets in ENV", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20-alpine\nUSER appuser\nENV API_KEY=sk-1234567890abcdef\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    const secretFinding = findings.find(f => f.ruleId === "DOCKER-006");
    expect(secretFinding).toBeDefined();
    expect(secretFinding!.severity).toBe("critical");
  });

  it("should detect privileged: true in docker-compose", () => {
    const ctx = makeCtx({
      "docker-compose.yml": "services:\n  web:\n    image: nginx:1.25\n    privileged: true\n",
    });
    const findings = scanner.scan(ctx);
    const privFinding = findings.find(f => f.ruleId === "DOCKER-005");
    expect(privFinding).toBeDefined();
    expect(privFinding!.severity).toBe("critical");
    expect(privFinding!.controlIds).toContain("CIS-DOCKER-007");
  });

  it("should detect missing user in docker-compose service", () => {
    const ctx = makeCtx({
      "docker-compose.yml": "services:\n  web:\n    image: nginx:1.25\n    ports:\n      - \"80:80\"\n",
    });
    const findings = scanner.scan(ctx);
    const userFinding = findings.find(f => f.ruleId === "DOCKER-010");
    expect(userFinding).toBeDefined();
    expect(userFinding!.severity).toBe("high");
  });

  it("should detect :latest in docker-compose", () => {
    const ctx = makeCtx({
      "docker-compose.yml": "services:\n  web:\n    image: nginx:latest\n    user: nginx\n    read_only: true\n",
    });
    const findings = scanner.scan(ctx);
    const latestFinding = findings.find(f => f.ruleId === "DOCKER-002");
    expect(latestFinding).toBeDefined();
  });

  it("should not flag clean Dockerfile", () => {
    const ctx = makeCtx({
      "Dockerfile": "FROM node:20.11-alpine\nRUN adduser -D appuser\nUSER appuser\nHEALTHCHECK --interval=30s CMD wget -q --spider http://localhost:3000/health || exit 1\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nCMD [\"node\", \"index.js\"]\n",
    });
    const findings = scanner.scan(ctx);
    // Should have no critical findings
    const criticals = findings.filter(f => f.severity === "critical");
    expect(criticals.length).toBe(0);
  });

  it("should not scan non-Docker files", () => {
    const ctx = makeCtx({
      "index.ts": "import express from 'express';\nconst app = express();\n",
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });
});
