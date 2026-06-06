import { describe, it, expect } from "vitest";
import { AuthScanner } from "./auth-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>, isWebProject = true): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: "/test",
    files: Object.keys(files),
    fileContents,
    isWebProject,
  };
}

describe("AuthScanner", () => {
  const scanner = new AuthScanner();

  it("flags missing rate limiting on web project", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nconst app = express();\napp.get("/", (req, res) => res.send("hi"));`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-002")).toBe(true);
  });

  it("flags missing session timeout", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nconst app = express();`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-003")).toBe(true);
  });

  it("flags missing MFA", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nconst app = express();`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-005")).toBe(true);
  });

  it("flags wildcard CORS", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nimport cors from "cors";\nconst app = express();\napp.use(cors({ origin: "*" }));`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-004")).toBe(true);
  });

  it("does not flag restricted CORS", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nimport cors from "cors";\nconst app = express();\napp.use(cors({ origin: ["https://example.com"] }));`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-004")).toBe(false);
  });

  it("returns no findings for non-web project", () => {
    const ctx = makeCtx({
      "script.ts": `console.log("hello");`,
    }, false);
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("detects rate limiting when present", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nimport rateLimit from "express-rate-limit";\nconst app = express();\napp.use(rateLimit({ max: 100 }));`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "AUTH-002")).toBe(false);
  });

  it("links auth findings to GDPR controls", () => {
    const ctx = makeCtx({
      "app.ts": `import express from "express";\nconst app = express();`,
    });
    const findings = scanner.scan(ctx);
    const rateLimitFinding = findings.find(f => f.ruleId === "AUTH-002");
    expect(rateLimitFinding?.controlIds).toContain("GDPR-ART32-004");
  });
});
