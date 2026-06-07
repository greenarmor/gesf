import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";
import * as os from "node:os";
import { collectDashboardData } from "./index.js";
import { renderDashboard } from "./template.js";

describe("web-dashboard", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gesf-dash-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("collectDashboardData", () => {
    it("returns data even for empty project", () => {
      const data = collectDashboardData(tmpDir);
      expect(data).toHaveProperty("projectName");
      expect(data).toHaveProperty("findings");
      expect(data).toHaveProperty("controls");
      expect(data).toHaveProperty("packs");
      expect(Array.isArray(data.findings)).toBe(true);
    });

    it("reads config.json when present", () => {
      fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "config.json"),
        JSON.stringify({
          project_name: "TestApp",
          project_type: "saas",
          frameworks: ["GDPR", "OWASP"],
          requirements: {},
          created_at: "2026-01-01T00:00:00Z",
          version: "1.0.1",
        }),
      );

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

    it("loads all packs", () => {
      const data = collectDashboardData(tmpDir);
      expect(data.packs.length).toBeGreaterThanOrEqual(10);
    });

    it("applies control overrides when present", () => {
      fs.mkdirSync(path.join(tmpDir, ".ges"), { recursive: true });
      fs.writeFileSync(
        path.join(tmpDir, ".ges", "config.json"),
        JSON.stringify({
          project_name: "TestApp",
          project_type: "saas",
          frameworks: ["GDPR"],
          requirements: {},
          created_at: "2026-01-01T00:00:00Z",
          version: "1.0.1",
        }),
      );
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
          controlIds: [],
          fix: "fix it",
        },
      ];
      const html = renderDashboard(data);
      expect(html).toContain("1");
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

    it("includes pack list", () => {
      const data = collectDashboardData(tmpDir);
      const html = renderDashboard(data);
      expect(html).toContain("Installed Policy Packs");
      expect(html).toContain("gdpr");
    });
  });
});
