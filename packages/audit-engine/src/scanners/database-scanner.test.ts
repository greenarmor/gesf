import { describe, it, expect } from "vitest";
import { DatabaseScanner } from "./database-scanner.js";
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

describe("DatabaseScanner", () => {
  const scanner = new DatabaseScanner();

  it("flags missing audit timestamps in Prisma schema", () => {
    const ctx = makeCtx({
      "prisma/schema.prisma": `model User {\n  id Int @id\n  email String\n}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "DB-001")).toBe(true);
  });

  it("flags missing soft delete in schema", () => {
    const ctx = makeCtx({
      "prisma/schema.prisma": `model User {\n  id Int @id\n  createdAt DateTime @default(now())\n}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "DB-002")).toBe(true);
  });

  it("flags missing user audit columns", () => {
    const ctx = makeCtx({
      "prisma/schema.prisma": `model User {\n  id Int @id\n  createdAt DateTime @default(now())\n  deletedAt DateTime?\n}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "DB-003")).toBe(true);
  });

  it("does not flag complete schema", () => {
    const ctx = makeCtx({
      "prisma/schema.prisma": `model User {\n  id Int @id\n  createdAt DateTime @default(now())\n  deletedAt DateTime?\n  createdBy String\n}\n\nmodel Audit {\n  id Int @id\n  action String\n}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("flags SQL schema without timestamps", () => {
    const ctx = makeCtx({
      "schema.sql": `CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(255));`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "DB-001")).toBe(true);
  });

  it("flags missing Audit model in Prisma", () => {
    const ctx = makeCtx({
      "prisma/schema.prisma": `model User {\n  id Int @id\n  createdAt DateTime @default(now())\n  deletedAt DateTime?\n  createdBy String\n}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "DB-004")).toBe(true);
  });

  it("ignores files in migration directories", () => {
    const ctx = makeCtx({
      "db/migrations/001_init.sql": `CREATE TABLE users (id INT PRIMARY KEY);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("links database findings to GDPR controls", () => {
    const ctx = makeCtx({
      "schema.sql": `CREATE TABLE users (id INT PRIMARY KEY);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].controlIds).toContain("GDPR-ART32-006");
  });
});
