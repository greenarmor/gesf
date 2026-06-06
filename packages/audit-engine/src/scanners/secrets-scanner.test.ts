import { describe, it, expect } from "vitest";
import { SecretsScanner } from "./secrets-scanner.js";
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

describe("SecretsScanner", () => {
  const scanner = new SecretsScanner();

  it("detects hardcoded passwords", () => {
    const ctx = makeCtx({
      "app.ts": `const password = "supersecret123";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0].category).toBe("secrets");
    expect(findings[0].severity).toBe("critical");
    expect(findings[0].ruleId).toBe("SECRETS-001");
  });

  it("detects API keys", () => {
    const ctx = makeCtx({
      "config.ts": `const apiKey = "ak_live_1234567890abcdef";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(1);
    expect(findings[0].title).toContain("API key");
  });

  it("detects AWS access keys", () => {
    const ctx = makeCtx({
      "s3.ts": `const accessKey = "AKIAIOSFODNN7EXAMPLE";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("AWS"))).toBe(true);
  });

  it("detects private keys", () => {
    const ctx = makeCtx({
      "key.ts": `const key = "-----BEGIN RSA PRIVATE KEY-----";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("Private key"))).toBe(true);
  });

  it("detects database connection strings", () => {
    const ctx = makeCtx({
      "db.ts": `const url = "mongodb://user:password123@host:27017/db";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(1);
  });

  it("detects GitHub tokens", () => {
    const ctx = makeCtx({
      "ci.ts": `const token = "ghp_1234567890abcdefghijklmnopqrstuvwxyz1234";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("GitHub"))).toBe(true);
  });

  it("detects JWT tokens", () => {
    const ctx = makeCtx({
      "auth.ts": `const jwt = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("JWT"))).toBe(true);
  });

  it("masks secrets in evidence", () => {
    const ctx = makeCtx({
      "app.ts": `const password = "supersecret123";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].evidence).toContain("***");
    expect(findings[0].evidence).not.toContain("supersecret123");
  });

  it("returns no findings for clean code", () => {
    const ctx = makeCtx({
      "app.ts": `const port = 3000;\nconst name = "myapp";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("skips .env files", () => {
    const ctx = makeCtx({
      ".env": `PASSWORD=supersecret123`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("skips lock files", () => {
    const ctx = makeCtx({
      "package-lock.json": `{"password": "secret123"}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("links findings to GDPR and OWASP controls", () => {
    const ctx = makeCtx({
      "app.ts": `const password = "supersecret123";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].controlIds).toContain("OWASP-ASVS-005");
    expect(findings[0].controlIds).toContain("GDPR-ART32-002");
  });

  it("reports correct line numbers", () => {
    const ctx = makeCtx({
      "app.ts": `const a = 1;\nconst b = 2;\nconst password = "supersecret123";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].line).toBe(3);
  });
});
