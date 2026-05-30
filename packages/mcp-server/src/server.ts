#!/usr/bin/env node

import * as readline from "node:readline";
import { getAllPacks, getPacksForProjectType } from "@greenarmor/ges-policy-engine";
import { createGDPRControls } from "@greenarmor/ges-compliance-engine";
import { generateScoreFile, formatScoreOutput } from "@greenarmor/ges-scoring-engine";
import type { Control, ProjectType } from "@greenarmor/ges-core";

export interface MCPRequest {
  jsonrpc: string;
  id?: number;
  method: string;
  params?: Record<string, unknown>;
}

export interface MCPResponse {
  jsonrpc: string;
  id?: number;
  result?: unknown;
  error?: { code: number; message: string };
}

const TOOLS = [
  {
    name: "check_compliance",
    description: "Check GDPR compliance status for a project",
    inputSchema: {
      type: "object",
      properties: {
        project_type: { type: "string", description: "Project type" },
      },
    },
  },
  {
    name: "list_missing_controls",
    description: "Show missing compliance controls",
    inputSchema: {
      type: "object",
      properties: {
        project_type: { type: "string", description: "Project type" },
        framework: { type: "string", description: "Framework name (GDPR, OWASP, etc.)" },
      },
    },
  },
  {
    name: "generate_retention_policy",
    description: "Generate a data retention policy template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_incident_response",
    description: "Generate an incident response plan template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_risk_assessment",
    description: "Generate a risk assessment template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
  {
    name: "generate_dpa",
    description: "Generate a Data Processing Agreement template",
    inputSchema: {
      type: "object",
      properties: {
        project_name: { type: "string", description: "Project name" },
      },
    },
  },
];

export function handleRequest(request: MCPRequest): MCPResponse {
  if (request.method === "initialize") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        protocolVersion: "2024-11-05",
        capabilities: { tools: {} },
        serverInfo: {
          name: "gesf-mcp-server",
          version: "0.1.0",
        },
      },
    };
  }

  if (request.method === "tools/list") {
    return {
      jsonrpc: "2.0",
      id: request.id,
      result: { tools: TOOLS },
    };
  }

  if (request.method === "tools/call") {
    const toolName = (request.params?.name as string) || "";
    const args = (request.params?.arguments as Record<string, string>) || {};

    let resultText: string;

    switch (toolName) {
      case "check_compliance": {
        const projectType = (args.project_type || "saas") as ProjectType;
        const packs = getPacksForProjectType(projectType);
        const controls = packs.flatMap(p => p.controls);
        const score = generateScoreFile(controls, ["GDPR", "OWASP"]);
        resultText = formatScoreOutput(score);
        break;
      }
      case "list_missing_controls": {
        const framework = args.framework || "GDPR";
        const allControls = getAllPacks().flatMap(p => p.controls);
        const missing = allControls.filter(
          c => c.framework === framework && c.status !== "pass",
        );
        resultText = missing.length > 0
          ? missing.map(c => `- [${c.severity.toUpperCase()}] ${c.id}: ${c.name}`).join("\n")
          : "All controls are passing.";
        break;
      }
      case "generate_retention_policy": {
        const name = args.project_name || "Project";
        resultText = `# Data Retention Policy - ${name}\n\n## Retention Periods\n\n| Category | Period | Justification |\n|----------|--------|---------------|\n| User data | Account + 30 days | Contract |\n| Audit logs | 1 year | Legal obligation |\n| Session data | Session duration | Operational |\n\nReview quarterly and update as needed.`;
        break;
      }
      case "generate_incident_response": {
        const name = args.project_name || "Project";
        resultText = `# Incident Response Plan - ${name}\n\n## Severity Levels\n- P1 (Critical): 15 min response\n- P2 (High): 1 hour response\n- P3 (Medium): 4 hour response\n\n## Process\n1. Detection → 2. Assessment → 3. Containment → 4. Eradication → 5. Recovery → 6. Post-Incident\n\n## GDPR: Notify supervisory authority within 72 hours.`;
        break;
      }
      case "generate_risk_assessment": {
        const name = args.project_name || "Project";
        resultText = `# Risk Assessment - ${name}\n\n| Risk | Likelihood | Impact | Mitigation |\n|------|-----------|--------|------------|\n| Data breach | Medium | Critical | Encryption, MFA, access controls |\n| Insider threat | Low | High | RBAC, audit logging |\n| Data loss | Low | Critical | Backups, DR plan |\n| Non-compliance | Medium | High | Regular audits |`;
        break;
      }
      case "generate_dpa": {
        const name = args.project_name || "Project";
        resultText = `# Data Processing Agreement - ${name}\n\n## Parties\n- Controller: [Company Name]\n- Processor: [Service Provider]\n\n## Subject Matter\nProcessing of personal data as described in the attached schedule.\n\n## Duration\nEffective until termination of services.\n\n## Obligations\n- Process data only on documented instructions\n- Ensure confidentiality\n- Implement appropriate security (Article 32)\n- Assist with data subject rights\n- Assist with breach notification\n- Delete/return data on termination`;
        break;
      }
      default:
        return {
          jsonrpc: "2.0",
          id: request.id,
          error: { code: -32601, message: `Unknown tool: ${toolName}` },
        };
    }

    return {
      jsonrpc: "2.0",
      id: request.id,
      result: {
        content: [{ type: "text", text: resultText }],
      },
    };
  }

  return {
    jsonrpc: "2.0",
    id: request.id,
    error: { code: -32601, message: `Unknown method: ${request.method}` },
  };
}

const rl = readline.createInterface({ input: process.stdin });

let buffer = "";

rl.on("line", (line) => {
  buffer += line + "\n";
  try {
    const request = JSON.parse(buffer.trim());
    buffer = "";
    const response = handleRequest(request);
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch {
    // incomplete JSON, keep buffering
  }
});
