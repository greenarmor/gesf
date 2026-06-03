import type { PolicyPack, Control } from "@greenarmor/ges-core";

export function createCISPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "CIS-001",
      name: "Inventory of Authorized and Unauthorized Devices",
      description: "Maintain an inventory of all devices authorized to access organizational data.",
      category: "asset-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain device inventory. Implement MDM. Monitor for unauthorized devices.",
      checks: [
        { id: "CIS-001-C1", description: "Device inventory maintained", status: "not-implemented" },
        { id: "CIS-001-C2", description: "Unauthorized device detection", status: "not-implemented" },
      ],
    },
    {
      id: "CIS-002",
      name: "Inventory of Authorized and Unauthorized Software",
      description: "Maintain a software inventory via SBOM generation and scanning.",
      category: "asset-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Generate SBOM in CycloneDX or SPDX format using Syft or Trivy. Scan SBOM for vulnerabilities using Grype. Automate SBOM generation in CI/CD pipeline. Store SBOM artifacts alongside release artifacts.",
      checks: [
        { id: "CIS-002-C1", description: "Software inventory (SBOM) maintained", status: "not-implemented" },
        { id: "CIS-002-C2", description: "Dependency scanning implemented", status: "not-implemented" },
        { id: "CIS-002-C3", description: "SBOM generated in CycloneDX or SPDX format", status: "not-implemented" },
        { id: "CIS-002-C4", description: "SBOM vulnerability scanning configured", status: "not-implemented" },
        { id: "CIS-002-C5", description: "SBOM generation automated in CI/CD", status: "not-implemented" },
      ],
    },
    {
      id: "CIS-003",
      name: "Secure Configuration",
      description: "Establish and maintain secure configuration for all hardware and software.",
      category: "configuration",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use infrastructure-as-code. Implement configuration management. Regular configuration audits.",
      checks: [
        { id: "CIS-003-C1", description: "Secure baseline configurations defined", status: "not-implemented" },
        { id: "CIS-003-C2", description: "Configuration drift detection", status: "not-implemented" },
      ],
    },
    {
      id: "CIS-004",
      name: "Continuous Vulnerability Management",
      description: "Continuously assess and remediate vulnerabilities.",
      category: "vulnerability-management",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Automated vulnerability scanning in CI/CD. Regular penetration testing. Remediation SLAs defined.",
      checks: [
        { id: "CIS-004-C1", description: "Automated vulnerability scanning", status: "not-implemented" },
        { id: "CIS-004-C2", description: "Remediation SLAs defined", status: "not-implemented" },
      ],
    },
    {
      id: "CIS-005",
      name: "Controlled Use of Administrative Privileges",
      description: "Control and monitor access to administrative privileges.",
      category: "access-control",
      framework: "CIS",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC. Use least privilege. Audit all admin actions. Require MFA for admin access.",
      checks: [
        { id: "CIS-005-C1", description: "RBAC implemented", status: "not-implemented" },
        { id: "CIS-005-C2", description: "MFA required for admin access", status: "not-implemented" },
        { id: "CIS-005-C3", description: "Admin action audit logging", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "cis",
    name: "CIS Controls Policy Pack",
    description: "Center for Internet Security Controls.",
    version: "1.0.0",
    project_types: [
      "saas", "healthcare-system", "generic-web-application", "government-system",
    ],
    controls,
    frameworks: ["CIS"],
  };
}
