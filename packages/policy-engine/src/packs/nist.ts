import type { PolicyPack, Control } from "@greenarmor/ges-core";

export function createNISTPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "NIST-ID-001",
      name: "Identity Management",
      description: "Manage identities and access to organizational resources.",
      category: "identify",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement centralized identity management. Use SSO. Automate user provisioning and deprovisioning.",
      checks: [
        { id: "NIST-ID-001-C1", description: "Centralized identity management", status: "not-implemented" },
        { id: "NIST-ID-001-C2", description: "SSO implemented", status: "not-implemented" },
      ],
    },
    {
      id: "NIST-PR-001",
      name: "Access Control",
      description: "Implement access control policies and mechanisms.",
      category: "protect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC or ABAC. Enforce least privilege. Regular access reviews.",
      checks: [
        { id: "NIST-PR-001-C1", description: "Access control model implemented", status: "not-implemented" },
        { id: "NIST-PR-001-C2", description: "Regular access reviews scheduled", status: "not-implemented" },
      ],
    },
    {
      id: "NIST-PR-002",
      name: "Data Security",
      description: "Protect data at rest and in transit.",
      category: "protect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Encrypt data at rest (AES-256). Encrypt data in transit (TLS 1.2+). Classify data.",
      checks: [
        { id: "NIST-PR-002-C1", description: "Data encryption at rest", status: "not-implemented" },
        { id: "NIST-PR-002-C2", description: "Data encryption in transit", status: "not-implemented" },
        { id: "NIST-PR-002-C3", description: "Data classification implemented", status: "not-implemented" },
      ],
    },
    {
      id: "NIST-DE-001",
      name: "Security Monitoring",
      description: "Monitor for security events and anomalies.",
      category: "detect",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement centralized logging. Use SIEM or similar. Define alert thresholds.",
      checks: [
        { id: "NIST-DE-001-C1", description: "Centralized logging implemented", status: "not-implemented" },
        { id: "NIST-DE-001-C2", description: "Security alerting configured", status: "not-implemented" },
      ],
    },
    {
      id: "NIST-RS-001",
      name: "Incident Response",
      description: "Establish and maintain incident response capabilities.",
      category: "respond",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create incident response plan. Define roles and responsibilities. Conduct regular drills.",
      checks: [
        { id: "NIST-RS-001-C1", description: "Incident response plan documented", status: "not-implemented" },
        { id: "NIST-RS-001-C2", description: "Roles and responsibilities defined", status: "not-implemented" },
        { id: "NIST-RS-001-C3", description: "Regular drills conducted", status: "not-implemented" },
      ],
    },
    {
      id: "NIST-RC-001",
      name: "Recovery Planning",
      description: "Establish and maintain recovery plans.",
      category: "recover",
      framework: "NIST",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create disaster recovery plan. Define RTO and RPO. Test recovery procedures regularly.",
      checks: [
        { id: "NIST-RC-001-C1", description: "Disaster recovery plan documented", status: "not-implemented" },
        { id: "NIST-RC-001-C2", description: "RTO and RPO defined", status: "not-implemented" },
        { id: "NIST-RC-001-C3", description: "Regular recovery tests", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "nist",
    name: "NIST Cybersecurity Framework Policy Pack",
    description: "NIST CSF controls across Identify, Protect, Detect, Respond, and Recover.",
    version: "1.0.0",
    project_types: [
      "saas", "healthcare-system", "generic-web-application", "government-system",
    ],
    controls,
    frameworks: ["NIST"],
  };
}
