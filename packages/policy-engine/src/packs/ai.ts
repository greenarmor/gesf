import type { PolicyPack, Control } from "@greenarmor/ges-core";

export function createAIPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "AI-001",
      name: "Prompt Logging",
      description: "Log all AI prompts and interactions for audit purposes.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement logging of all prompts sent to AI models. Store prompts securely with access controls. Define retention periods.",
      checks: [
        { id: "AI-001-C1", description: "Prompt logging system implemented", status: "not-implemented" },
        { id: "AI-001-C2", description: "Logs stored securely", status: "not-implemented" },
        { id: "AI-001-C3", description: "Retention period defined", status: "not-implemented" },
      ],
    },
    {
      id: "AI-002",
      name: "Output Validation",
      description: "Validate AI outputs before presenting to users or taking actions.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement output filtering and validation. Check for PII leakage. Validate against safety guidelines.",
      checks: [
        { id: "AI-002-C1", description: "Output validation pipeline implemented", status: "not-implemented" },
        { id: "AI-002-C2", description: "PII detection on outputs", status: "not-implemented" },
      ],
    },
    {
      id: "AI-003",
      name: "PII Detection",
      description: "Detect and protect personal data in AI inputs and outputs.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement PII detection before sending to external AI providers. Redact or pseudonymise detected PII.",
      checks: [
        { id: "AI-003-C1", description: "PII detection on inputs", status: "not-implemented" },
        { id: "AI-003-C2", description: "PII redaction/pseudonymisation implemented", status: "not-implemented" },
      ],
    },
    {
      id: "AI-004",
      name: "AI Rate Limiting",
      description: "Implement rate limiting on AI endpoints.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement per-user and per-IP rate limiting on AI endpoints. Define usage quotas.",
      checks: [
        { id: "AI-004-C1", description: "Rate limiting on AI endpoints", status: "not-implemented" },
        { id: "AI-004-C2", description: "Usage quotas defined", status: "not-implemented" },
      ],
    },
    {
      id: "AI-005",
      name: "Data Classification for AI",
      description: "Classify data before processing through AI systems.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement data classification checks before AI processing. Restrict restricted/confidential data from external AI providers.",
      checks: [
        { id: "AI-005-C1", description: "Data classification before AI processing", status: "not-implemented" },
        { id: "AI-005-C2", description: "Restricted data blocked from external AI", status: "not-implemented" },
      ],
    },
    {
      id: "AI-006",
      name: "Prevent Unauthorized Data Transfer to External AI",
      description: "Prevent unauthorized transfer of personal data to external AI providers.",
      category: "ai-governance",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement data loss prevention for AI API calls. Review and approve AI providers. Document data processing agreements.",
      checks: [
        { id: "AI-006-C1", description: "DLP controls for AI API calls", status: "not-implemented" },
        { id: "AI-006-C2", description: "AI providers reviewed and approved", status: "not-implemented" },
        { id: "AI-006-C3", description: "DPAs with AI providers signed", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "ai",
    name: "AI System Policy Pack",
    description: "Controls for LLMs, Agents, MCP, and RAG systems.",
    version: "1.0.0",
    project_types: ["ai-application", "mcp-server"],
    controls,
    frameworks: ["GDPR"],
  };
}
