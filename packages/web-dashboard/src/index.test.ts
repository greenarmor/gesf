import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import * as http from "node:http";
import { collectDashboardData, collectPackDetail, collectControlDetail, startDashboard } from "./index.js";
import { renderDashboard } from "./template.js";

describe("web-dashboard", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-dash-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  function setupProject(frameworks: string[] = ["GDPR", "OWASP"]) {
    fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
    fs.writeFileSync(
      path.join(tmpDir, ".ges", "config.json"),
      JSON.stringify({
        project_name: "TestApp",
        project_type: "saas",
        frameworks,
        requirements: {},
        created_at: "2026-01-01T00:00:00Z",
        version: "1.1.1",
      }),
    );
    fs.writeFileSync(
      path.join(tmpDir, ".ges", "metadata.json"),
      JSON.stringify({
        project_name: "TestApp",
        project_type: "saas",
        initialized_at: "2026-01-01T00:00:00Z",
        gesf_version: "1.1.1",
        last_audit: "2026-01-02T00:00:00Z",
      }),
    );
  }

  describe("collectDashboardData", () => {
    it("returns data even for empty project", () => {
      const data = collectDashboardData(tmpDir);
      expect(data).toHaveProperty("projectName");
      expect(data).toHaveProperty("findings");
      expect(data).toHaveProperty("controls");
      expect(data).toHaveProperty("packs");
      expect(Array.isArray(data.findings)).toBe(true);
      expect(Array.isArray(data.packs)).toBe(true);
    });

    it("reads config.json when present", () => {
      setupProject();
      const data = collectDashboardData(tmpDir);
      expect(data.projectName).toBe("TestApp");
      expect(data.projectType).toBe("saas");
      expect(data.frameworks).toContain("GDPR");
    });

    it("reads score.json when present", () => {
      fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "score.json"),
        JSON.stringify({
          overall: 85,
          overall_grade: "B",
          frameworks: {},
          evaluated_at: "2026-01-01T00:00:00Z",
        }),
      );

      const data = collectDashboardData(tmpDir);
      expect(data.score).not.toBeNull();
      expect(data.score!.overall).toBe(85);
      expect(data.score!.overall_grade).toBe("B");
    });

    it("loads all packs as PackSummary objects", () => {
      const data = collectDashboardData(tmpDir);
      expect(data.packs.length).toBeGreaterThanOrEqual(10);
      for (const pack of data.packs) {
        expect(pack).toHaveProperty("id");
        expect(pack).toHaveProperty("name");
        expect(pack).toHaveProperty("description");
        expect(pack).toHaveProperty("score");
        expect(pack).toHaveProperty("grade");
        expect(pack).toHaveProperty("controlCount");
        expect(pack).toHaveProperty("passedCount");
        expect(pack).toHaveProperty("failedCount");
        expect(pack).toHaveProperty("findingsCount");
        expect(pack).toHaveProperty("installed");
        expect(typeof pack.score).toBe("number");
        expect(typeof pack.controlCount).toBe("number");
      }
    });

    it("applies control overrides when present", () => {
      setupProject(["GDPR"]);
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "control-overrides.json"),
        JSON.stringify([
          { control_id: "GDPR-ART5-001", status: "pass", reason: "Manually verified" },
        ]),
      );

      const data = collectDashboardData(tmpDir);
      const control = data.controls.find(c => c.id === "GDPR-ART5-001");
      if (control) {
        expect(control.status).toBe("pass");
      }
    });

    it("detects installed packs from controls/ directory", () => {
      setupProject();
      fs.mkdirSync(path.join(tmpDir, "controls", "gdpr"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, "controls", "gdpr", "controls.json"),
        JSON.stringify([]),
      );

      const data = collectDashboardData(tmpDir);
      const gdprPack = data.packs.find(p => p.id === "gdpr");
      expect(gdprPack).toBeDefined();
      expect(gdprPack!.installed).toBe(true);
    });
  });

  describe("collectPackDetail", () => {
    it("returns null for unknown pack", () => {
      const detail = collectPackDetail(tmpDir, "nonexistent");
      expect(detail).toBeNull();
    });

    it("returns detailed pack report for gdpr", () => {
      setupProject(["GDPR"]);
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      expect(detail!.pack.id).toBe("gdpr");
      expect(detail!.pack.name).toContain("GDPR");
      expect(detail!.controls.length).toBeGreaterThan(0);
      expect(detail!.topFixes).toBeDefined();
      expect(detail!.severityBreakdown).toBeDefined();
      expect(detail!.statusBreakdown).toBeDefined();
      expect(detail!.findingsByControl).toBeDefined();
    });

    it("control details include packId and packName", () => {
      setupProject(["GDPR"]);
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      for (const ctrl of detail!.controls) {
        expect(ctrl.packId).toBe("gdpr");
        expect(ctrl.packName).toContain("GDPR");
        expect(ctrl).toHaveProperty("relatedFindings");
        expect(ctrl).toHaveProperty("checks");
        expect(ctrl).toHaveProperty("implementation_guidance");
      }
    });

    it("severityBreakdown has all levels", () => {
      setupProject();
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      expect(detail!.severityBreakdown).toHaveProperty("critical");
      expect(detail!.severityBreakdown).toHaveProperty("high");
      expect(detail!.severityBreakdown).toHaveProperty("medium");
      expect(detail!.severityBreakdown).toHaveProperty("low");
    });

    it("statusBreakdown has all statuses", () => {
      setupProject();
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      expect(detail!.statusBreakdown).toHaveProperty("pass");
      expect(detail!.statusBreakdown).toHaveProperty("fail");
      expect(detail!.statusBreakdown).toHaveProperty("warning");
      expect(detail!.statusBreakdown).toHaveProperty("not-implemented");
      expect(detail!.statusBreakdown).toHaveProperty("not-applicable");
    });

    it("topFixes contains non-pass controls sorted by severity", () => {
      setupProject();
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      for (const fix of detail!.topFixes) {
        expect(fix).toHaveProperty("controlId");
        expect(fix).toHaveProperty("controlName");
        expect(fix).toHaveProperty("severity");
        expect(fix).toHaveProperty("findings");
        expect(fix).toHaveProperty("guidance");
        expect(fix.severity).not.toBe("pass");
      }
    });

    it("findingsByControl maps control IDs to findings", () => {
      setupProject();
      const detail = collectPackDetail(tmpDir, "gdpr");
      expect(detail).not.toBeNull();
      expect(typeof detail!.findingsByControl).toBe("object");
    });
  });

  describe("collectControlDetail", () => {
    it("returns null when no config", () => {
      const detail = collectControlDetail(tmpDir, "GDPR-ART5-001");
      expect(detail).toBeNull();
    });

    it("returns null for unknown control", () => {
      setupProject(["GDPR"]);
      const detail = collectControlDetail(tmpDir, "NONEXISTENT-001");
      expect(detail).toBeNull();
    });

    it("returns detailed control for known control ID", () => {
      setupProject(["GDPR"]);
      const allData = collectDashboardData(tmpDir);
      if (allData.controls.length > 0) {
        const ctrlId = allData.controls[0].id;
        const detail = collectControlDetail(tmpDir, ctrlId);
        expect(detail).not.toBeNull();
        expect(detail!.id).toBe(ctrlId);
        expect(detail!.name).toBeTruthy();
        expect(detail!.description).toBeTruthy();
        expect(detail!.framework).toBeTruthy();
        expect(detail!.severity).toBeTruthy();
        expect(detail!.status).toBeTruthy();
        expect(detail!.implementation_guidance).toBeTruthy();
        expect(Array.isArray(detail!.checks)).toBe(true);
        expect(Array.isArray(detail!.relatedFindings)).toBe(true);
        expect(detail!.packId).toBeTruthy();
        expect(detail!.packName).toBeTruthy();
      }
    });
  });

  describe("renderDashboard", () => {
    it("generates valid HTML", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("</html>");
      expect(html).toContain("GESF Compliance Dashboard");
    });

    it("includes project name in title", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain(data.projectName);
    });

    it("includes all page tabs", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("showPage('overview', this)");
      expect(html).toContain("showPage('packs', this)");
      expect(html).toContain("showPage('fixes', this)");
      expect(html).toContain("showPage('findings', this)");
      expect(html).toContain("showPage('traceability', this)");
    });

    it("includes findings count when findings exist", () => {
      const data = collectDashboardData(tmpDir);
      data.findings = [
        {
          ruleId: "TEST-001",
          severity: "critical",
          category: "test",
          title: "Test finding",
          description: "Test",
          file: "test.ts",
          line: 1,
          evidence: "test",
          controlIds: ["GDPR-ART32-001"],
          fix: "fix it",
        },
      ];
      const html = renderDashboard(data);
      expect(html).toContain("Test finding");
    });

    it("shows clean message when no findings", () => {
      const data = collectDashboardData(tmpDir);
      data.findings = [];
      const html = renderDashboard(data);
      expect(html).toContain("No security findings");
    });

    it("includes framework scores when score data exists", () => {
      const data = collectDashboardData(tmpDir);
      data.score = {
        overall: 75,
        overall_grade: "C",
        frameworks: {
          GDPR: {
            framework: "GDPR",
            score: 80,
            grade: "B",
            total_controls: 22,
            passed_controls: 18,
            failed_controls: 0,
            warning_controls: 0,
            not_applicable: 0,
            not_implemented: 4,
            severity_breakdown: {} as any,
            critical_failures: 0,
            max_possible_score: 100,
            evaluated_at: "2026-01-01T00:00:00Z",
          },
        },
        evaluated_at: "2026-01-01T00:00:00Z",
      };
      const html = renderDashboard(data);
      expect(html).toContain("GDPR");
      expect(html).toContain("80%");
    });

    it("escapes HTML in project name", () => {
      const data = collectDashboardData(tmpDir);
      data.projectName = "<script>alert(1)</script>";
      const html = renderDashboard(data);
      expect(html).not.toContain("<script>alert(1)</script>");
      expect(html).toContain("&lt;script&gt;");
    });

    it("includes pack list with scores and details", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("Policy Packs");
      expect(html).toContain("loadPackDetail");
    });

    it("includes traceability matrix page", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("Fix Traceability Matrix");
      expect(html).toContain("trace-tab-matrix");
      expect(html).toContain("trace-tab-fixes");
      expect(html).toContain("trace-tab-controls");
    });

    it("includes findings report with severity tabs", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("Security Findings Report");
      expect(html).toContain("findings-tab-all");
      expect(html).toContain("findings-tab-critical");
      expect(html).toContain("findings-tab-high");
      expect(html).toContain("findings-tab-medium");
      expect(html).toContain("findings-tab-low");
      expect(html).toContain("findings-tab-bypack");
    });

    it("includes detailed fixes page with expandable cards", () => {
      setupProject(["GDPR"]);
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("page-fixes");
      expect(html).toContain("fix-detail-card");
      expect(html).toContain("toggleFix");
      expect(html).toContain("fix-section-title");
      expect(html).toContain("fix-guidance-box");
    });

    it("renders fixes with full finding details and evidence", () => {
      setupProject(["GDPR"]);
      const data = collectDashboardData(tmpDir);
      const gdprControls = data.controls.filter(c => c.id.startsWith("GDPR-"));
      const controlId = gdprControls.length > 0 ? gdprControls[0].id : "GDPR-ART32-001";
      data.findings = [
        {
          ruleId: "TEST-001",
          severity: "critical",
          category: "secrets",
          title: "Hardcoded API key",
          description: "An API key was found in source code",
          file: "src/config.ts",
          line: 42,
          evidence: `API_KEY=abc123`,
          controlIds: [controlId],
          fix: "Move API key to environment variable",
        },
      ];
      const html = renderDashboard(data);
      expect(html).toContain("Hardcoded API key");
      expect(html).toContain("src/config.ts:42");
      expect(html).toContain("Move API key to environment variable");
      expect(html).toContain("TEST-001");
      expect(html).toContain("fix-finding-item");
      expect(html).toContain("fix-guidance-box");
      expect(html).toContain("fix-section-title");
      expect(html).toContain("Fix Guidance");
      expect(html).toContain("Traceability");
    });

    it("includes all 5 navigation tabs", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("showPage('overview', this)");
      expect(html).toContain("showPage('packs', this)");
      expect(html).toContain("showPage('fixes', this)");
      expect(html).toContain("showPage('findings', this)");
      expect(html).toContain("showPage('traceability', this)");
    });

    it("includes API links in footer", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("/api/data");
      expect(html).toContain("/api/packs");
      expect(html).toContain("/api/fix-history");
    });

    it("includes empty fix history when no fixes applied", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("Compliance Fix History");
      expect(html).toContain("No fixes recorded yet");
    });

    it("renders fix history entries with full compliance traceability", () => {
      setupProject(["GDPR"]);
      const data = collectDashboardData(tmpDir);
      data.fixHistory = [
        {
          id: "fix-test-1",
          timestamp: "2026-06-09T12:00:00Z",
          source: "mcp",
          dry_run: false,
          finding: {
            rule_id: "SECRETS-001",
            severity: "critical",
            category: "secrets",
            title: "Hardcoded API key",
            file: "src/config.ts",
            line: 42,
            evidence: "const API_KEY = 'sk-abc123'",
            description: "An API key was found in source code",
          },
          controls: [
            { id: "GDPR-ART32-001", name: "Encryption at Rest", framework: "GDPR", article: "Article 32", status: "fail" },
          ],
          fix: {
            action_type: "modify",
            file_path: "src/config.ts",
            description: "Replace hardcoded key with env variable",
            guidance: "Move API key to environment variable",
            applied: true,
          },
          compliance_impact: {
            frameworks_affected: ["GDPR"],
            controls_addressed: 1,
            severity_resolved: "critical",
          },
        },
      ];
      const html = renderDashboard(data);
      expect(html).toContain("Compliance Fix History");
      expect(html).toContain("SECRETS-001");
      expect(html).toContain("Hardcoded API key");
      expect(html).toContain("src/config.ts");
      expect(html).toContain("GDPR-ART32-001");
      expect(html).toContain("APPLIED");
      expect(html).toContain("MCP");
      expect(html).toContain("showFixesTab");
      expect(html).toContain("fixes-tab-history");
      expect(html).toContain("fixes-tab-pending");
    });

    it("shows failed fixes in fix history", () => {
      const data = collectDashboardData(tmpDir);
      data.fixHistory = [
        {
          id: "fix-test-2",
          timestamp: "2026-06-09T12:00:00Z",
          source: "cli",
          dry_run: false,
          finding: {
            rule_id: "CONFIG-001",
            severity: "high",
            category: "config",
            title: "Missing helmet",
            file: "src/app.ts",
            evidence: "No helmet middleware",
            description: "Helmet middleware not configured",
          },
          controls: [],
          fix: {
            action_type: "create",
            file_path: "src/middleware/security.ts",
            description: "Create security middleware",
            guidance: "Install and configure helmet",
            applied: false,
            error: "File already exists",
          },
          compliance_impact: {
            frameworks_affected: [],
            controls_addressed: 0,
            severity_resolved: "high",
          },
        },
      ];
      const html = renderDashboard(data);
      expect(html).toContain("FAILED");
      expect(html).toContain("File already exists");
      expect(html).toContain("CLI");
    });
  });

  describe("API routes", () => {
    async function startServer(projectPath: string): Promise<{ server: http.Server; port: number }> {
      const server = startDashboard({ projectPath, port: 0, host: "127.0.0.1" });
      await new Promise<void>((resolve, reject) => {
        server.on("listening", () => resolve());
        server.on("error", reject);
      });
      const addr = server.address() as { port: number };
      return { server, port: addr.port };
    }

    function close(server: http.Server): Promise<void> {
      return new Promise(resolve => server.close(() => resolve()));
    }

    async function get(port: number, path: string): Promise<{ status: number; body: string }> {
      return new Promise((resolve, reject) => {
        const req = http.request({ hostname: "127.0.0.1", port, path, method: "GET" }, (res) => {
          let body = "";
          res.on("data", (chunk) => { body += chunk; });
          res.on("end", () => resolve({ status: res.statusCode || 0, body }));
        });
        req.on("error", reject);
        req.end();
      });
    }

    it("starts dashboard server and responds to /api/packs", async () => {
      setupProject();
      const { server, port } = await startServer(tmpDir);
      const { body } = await get(port, "/api/packs");
      const parsed = JSON.parse(body);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed.length).toBeGreaterThanOrEqual(10);
      expect(parsed[0]).toHaveProperty("id");
      expect(parsed[0]).toHaveProperty("score");
      await close(server);
    });

    it("responds to /api/packs/:id with pack detail", async () => {
      setupProject();
      const { server, port } = await startServer(tmpDir);
      const { body, status } = await get(port, "/api/packs/gdpr");
      expect(status).toBe(200);
      const parsed = JSON.parse(body);
      expect(parsed).toHaveProperty("pack");
      expect(parsed).toHaveProperty("controls");
      expect(parsed).toHaveProperty("topFixes");
      expect(parsed).toHaveProperty("severityBreakdown");
      expect(parsed).toHaveProperty("statusBreakdown");
      expect(parsed.pack.id).toBe("gdpr");
      await close(server);
    });

    it("returns 404 for unknown pack", async () => {
      setupProject();
      const { server, port } = await startServer(tmpDir);
      const { status } = await get(port, "/api/packs/nonexistent");
      expect(status).toBe(404);
      await close(server);
    });

    it("responds to /api/packs/:id/controls", async () => {
      setupProject();
      const { server, port } = await startServer(tmpDir);
      const { body, status } = await get(port, "/api/packs/gdpr/controls");
      expect(status).toBe(200);
      const parsed = JSON.parse(body);
      expect(Array.isArray(parsed)).toBe(true);
      if (parsed.length > 0) {
        expect(parsed[0]).toHaveProperty("id");
        expect(parsed[0]).toHaveProperty("relatedFindings");
        expect(parsed[0]).toHaveProperty("packId");
      }
      await close(server);
    });

    it("responds to /api/controls/:id", async () => {
      setupProject(["GDPR"]);
      const { server, port } = await startServer(tmpDir);
      const allData = collectDashboardData(tmpDir);
      const ctrlId = allData.controls.length > 0 ? allData.controls[0].id : "GDPR-ART5-001";
      const { body, status } = await get(port, `/api/controls/${ctrlId}`);
      const parsed = JSON.parse(body);
      if (status === 200) {
        expect(parsed).toHaveProperty("id", ctrlId);
        expect(parsed).toHaveProperty("checks");
        expect(parsed).toHaveProperty("relatedFindings");
        expect(parsed).toHaveProperty("implementation_guidance");
        expect(parsed).toHaveProperty("packId");
        expect(parsed).toHaveProperty("packName");
      } else {
        expect(parsed).toHaveProperty("error");
      }
      await close(server);
    });

    it("responds to /api/findings/by-control/:id", async () => {
      setupProject(["GDPR"]);
      const { server, port } = await startServer(tmpDir);
      const { body, status } = await get(port, "/api/findings/by-control/GDPR-ART5-001");
      const parsed = JSON.parse(body);
      if (status === 200) {
        expect(Array.isArray(parsed)).toBe(true);
      }
      await close(server);
    });

    it("responds to /health", async () => {
      const { server, port } = await startServer(tmpDir);
      const { body } = await get(port, "/health");
      const parsed = JSON.parse(body);
      expect(parsed.status).toBe("ok");
      await close(server);
    });

    it("responds to /api/fix-history", async () => {
      setupProject();
      const { server, port } = await startServer(tmpDir);
      const { body, status } = await get(port, "/api/fix-history");
      expect(status).toBe(200);
      const parsed = JSON.parse(body);
      expect(Array.isArray(parsed)).toBe(true);
      await close(server);
    });

    it("returns 404 for unknown routes", async () => {
      const { server, port } = await startServer(tmpDir);
      const { status } = await get(port, "/nonexistent");
      expect(status).toBe(404);
      await close(server);
    });

    it("returns 405 for POST requests", async () => {
      const { server, port } = await startServer(tmpDir);
      const result = await new Promise<{ status: number }>((resolve, reject) => {
        const req = http.request({ hostname: "127.0.0.1", port, path: "/api/packs", method: "POST" }, (res) => {
          resolve({ status: res.statusCode || 0 });
        });
        req.on("error", reject);
        req.end();
      });
      expect(result.status).toBe(405);
      await close(server);
    });
  });
});
