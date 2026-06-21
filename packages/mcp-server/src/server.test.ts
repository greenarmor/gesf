import { describe, it, expect, afterEach } from "vitest";
import { handleRequest, stopDashboardServer } from "./server.js";
import type { MCPRequest } from "./server.js";

function req(method: string, params?: Record<string, unknown>, id: number | string = 1): MCPRequest {
  return { jsonrpc: "2.0", id, method, params };
}

function callTool(name: string, args: Record<string, string> = {}, id: number = 1): MCPRequest {
  return req("tools/call", { name, arguments: args }, id);
}

function getResultText(response: unknown): string {
  const r = response as { result?: { content?: { text?: string }[] } };
  return r.result?.content?.[0]?.text ?? "";
}

describe("MCP Protocol", () => {
  it("responds to initialize", () => {
    const res = handleRequest(req("initialize"));
    expect(res).not.toBeNull();
    const result = (res as { result: { protocolVersion: string; serverInfo: { name: string } } }).result;
    expect(result.protocolVersion).toBe("2024-11-05");
    expect(result.serverInfo.name).toBe("gesf-mcp-server");
  });

  it("returns null for notifications/initialized", () => {
    const res = handleRequest({ jsonrpc: "2.0", method: "notifications/initialized" });
    expect(res).toBeNull();
  });

  it("returns null for notifications/cancelled", () => {
    const res = handleRequest({ jsonrpc: "2.0", method: "notifications/cancelled" });
    expect(res).toBeNull();
  });

  it("responds to ping", () => {
    const res = handleRequest(req("ping"));
    expect(res).not.toBeNull();
    expect((res as { result: unknown }).result).toBeDefined();
  });

  it("returns null for ping notification", () => {
    const res = handleRequest({ jsonrpc: "2.0", method: "ping" });
    expect(res).toBeNull();
  });

  it("responds to tools/list with 46 tools", () => {
    const res = handleRequest(req("tools/list"));
    const tools = (res as { result: { tools: { name: string }[] } }).result.tools;
    expect(tools.length).toBe(46);
  });

  it("returns error for unknown method", () => {
    const res = handleRequest(req("unknown/method"));
    expect((res as { error?: { code: number } }).error).toBeDefined();
  });
});

describe("tools/list content", () => {
  it("includes all expected tool names", () => {
    const res = handleRequest(req("tools/list"));
    const tools = (res as { result: { tools: { name: string }[] } }).result.tools;
    const names = tools.map((t) => t.name);
    expect(names).toContain("check_compliance");
    expect(names).toContain("check_project_status");
    expect(names).toContain("list_missing_controls");
    expect(names).toContain("list_framework_controls");
    expect(names).toContain("run_audit");
    expect(names).toContain("generate_compliance_report");
    expect(names).toContain("generate_audit_report");
    expect(names).toContain("fix_recommendation");
    expect(names).toContain("auto_fix");
    expect(names).toContain("implement_control");
    expect(names).toContain("apply_control_override");
    expect(names).toContain("generate_retention_policy");
    expect(names).toContain("generate_incident_response");
    expect(names).toContain("generate_risk_assessment");
    expect(names).toContain("generate_dpa");
    expect(names).toContain("generate_data_inventory");
    expect(names).toContain("generate_processing_records");
    expect(names).toContain("generate_badge");
    expect(names).toContain("get_score");
    expect(names).toContain("init_project");
    expect(names).toContain("run_scans");
    expect(names).toContain("doctor");
    expect(names).toContain("validate_project");
    expect(names).toContain("policy_list");
    expect(names).toContain("policy_install");
    expect(names).toContain("policy_remove");
    expect(names).toContain("update_check");
    expect(names).toContain("install_hooks");
    expect(names).toContain("start_dashboard");
    expect(names).toContain("record_recommendation");
  });
});

describe("check_compliance tool", () => {
  it("returns compliance score output", () => {
    const res = handleRequest(callTool("check_compliance", { project_type: "saas" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain("GDPR");
  });
});

describe("list_missing_controls tool", () => {
  it("returns missing controls for GDPR", () => {
    const res = handleRequest(callTool("list_missing_controls", { framework: "GDPR" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("list_framework_controls tool", () => {
  it("returns all GDPR controls", () => {
    const res = handleRequest(callTool("list_framework_controls", { framework: "GDPR" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("generate_retention_policy tool", () => {
  it("generates a retention policy", () => {
    const res = handleRequest(callTool("generate_retention_policy", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain("Retention");
  });
});

describe("generate_incident_response tool", () => {
  it("generates an incident response plan", () => {
    const res = handleRequest(callTool("generate_incident_response", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain("Incident");
  });
});

describe("generate_risk_assessment tool", () => {
  it("generates a risk assessment", () => {
    const res = handleRequest(callTool("generate_risk_assessment", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain("Risk");
  });
});

describe("generate_dpa tool", () => {
  it("generates a DPA", () => {
    const res = handleRequest(callTool("generate_dpa", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain("Data Processing");
  });
});

describe("generate_data_inventory tool", () => {
  it("generates a data inventory", () => {
    const res = handleRequest(callTool("generate_data_inventory", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("generate_processing_records tool", () => {
  it("generates processing records", () => {
    const res = handleRequest(callTool("generate_processing_records", { project_name: "TestApp" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("fix_recommendation tool", () => {
  it("returns guidance for a control ID", () => {
    const res = handleRequest(callTool("fix_recommendation", { control_id: "GDPR-ART32-002" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });
});

describe("apply_control_override tool", () => {
  it("rejects status pass for AI", () => {
    const res = handleRequest(callTool("apply_control_override", {
      control_id: "GDPR-ART32-002",
      status: "pass",
      project_path: "/tmp/test-gesf",
      reason: "Test reason here",
    }));
    const text = getResultText(res);
    expect(text.toLowerCase()).toContain("cannot");
  });

  it("rejects not-applicable without reason", () => {
    const res = handleRequest(callTool("apply_control_override", {
      control_id: "GDPR-ART32-002",
      status: "not-applicable",
      project_path: "/tmp/test-gesf",
    }));
    const text = getResultText(res);
    expect(text.toLowerCase()).toContain("reason");
  });
});

describe("record_recommendation tool", () => {
  it("writes a recommendation to .dev-logs", () => {
    const res = handleRequest(callTool("record_recommendation", {
      project_path: "/Users/tata/gesf",
      title: "Test Improvement Idea",
      description: "This is a test recommendation description.",
      suggested_action: "Implement the improvement in next sprint.",
      category: "security",
    }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
    expect(text.toLowerCase()).toContain("recommendation");
  });
});

describe("unknown tool", () => {
  it("returns error for unknown tool name", () => {
    const res = handleRequest(callTool("nonexistent_tool"));
    expect((res as { error?: { code: number } }).error).toBeDefined();
  });
});

describe("new tools", () => {
  it("update_check returns version info", () => {
    const res = handleRequest(callTool("update_check"));
    const text = getResultText(res);
    expect(text).toContain("1.5.6");
    expect(text).toContain("npm update");
  });

  it("policy_list returns packs", () => {
    const res = handleRequest(callTool("policy_list"));
    const text = getResultText(res);
    expect(text).toContain("gdpr");
    expect(text).toContain("owasp");
  });

  it("doctor returns diagnostic for valid project", () => {
    const res = handleRequest(callTool("doctor", { project_path: "/Users/tata/gesf" }));
    const text = getResultText(res);
    expect(text).toContain("GESF initialized");
    expect(text).toContain("OK");
  });

  it("validate_project validates config", () => {
    const res = handleRequest(callTool("validate_project", { project_path: "/Users/tata/gesf" }));
    const text = getResultText(res);
    expect(text).toContain("Configuration");
  });

  it("get_score returns score for valid project", () => {
    const res = handleRequest(callTool("get_score", { project_path: "/Users/tata/gesf" }));
    const text = getResultText(res);
    expect(text).toContain("GDPR");
  });

  it("install_hooks returns error without git", () => {
    const res = handleRequest(callTool("install_hooks", { project_path: "/tmp/nonexistent" }));
    const text = getResultText(res);
    expect(text.length).toBeGreaterThan(0);
  });

  it("start_dashboard starts the dashboard server", () => {
    const res = handleRequest(callTool("start_dashboard", { project_path: "/Users/tata/gesf", port: "13987" }));
    const text = getResultText(res);
    expect(text).toContain("Running");
    expect(text).toContain("13987");
  });

  afterEach(() => {
    stopDashboardServer();
  });
});
