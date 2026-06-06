import { describe, it, expect } from "vitest";
import { CodeSecurityScanner } from "./code-security-scanner.js";
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

describe("CodeSecurityScanner", () => {
  const scanner = new CodeSecurityScanner();

  it("detects SQL injection via string concatenation", () => {
    const ctx = makeCtx({
      "db.ts": `db.query("SELECT * FROM users WHERE id = " + req.query.id);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("SQL Injection"))).toBe(true);
  });

  it("detects SQL injection via template literal", () => {
    const ctx = makeCtx({
      "db.ts": `db.query(\`SELECT * FROM users WHERE name = \${req.body.name}\`);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("SQL Injection"))).toBe(true);
  });

  it("detects XSS via innerHTML", () => {
    const ctx = makeCtx({
      "view.ts": `element.innerHTML = req.body.comment;`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("XSS"))).toBe(true);
  });

  it("detects XSS via document.write", () => {
    const ctx = makeCtx({
      "view.ts": `document.write(req.query.html);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("XSS"))).toBe(true);
  });

  it("detects code injection via exec", () => {
    const ctx = makeCtx({
      "cmd.ts": `exec(req.body.command);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("injection"))).toBe(true);
  });

  it("returns no findings for safe parameterized queries", () => {
    const ctx = makeCtx({
      "safe.ts": `db.query("SELECT * FROM users WHERE id = $1", [req.query.id]);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("returns no findings for textContent usage", () => {
    const ctx = makeCtx({
      "safe.ts": `element.textContent = req.body.comment;`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("only scans code file extensions", () => {
    const ctx = makeCtx({
      "readme.md": `db.query("SELECT * FROM users WHERE id = " + req.query.id);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("assigns critical severity to injection findings", () => {
    const ctx = makeCtx({
      "db.ts": `db.query("SELECT * FROM users WHERE id = " + req.query.id);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].severity).toBe("critical");
  });

  it("links findings to OWASP controls", () => {
    const ctx = makeCtx({
      "db.ts": `db.query("SELECT * FROM users WHERE id = " + req.query.id);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings[0].controlIds).toContain("OWASP-ASVS-001");
  });
});
