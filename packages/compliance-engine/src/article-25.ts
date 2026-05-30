import type { Control } from "@greenarmor/ges-core";

export function createArticle25Controls(): Control[] {
  return [
    {
      id: "GDPR-ART25-001",
      name: "Data Protection by Design",
      description: "Implement appropriate technical and organisational measures to integrate data protection principles into processing.",
      category: "privacy-by-design",
      framework: "GDPR",
      article: "Article 25(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Conduct privacy impact assessments during design phase. Implement pseudonymisation by default. Minimise data processing in all components.",
      checks: [
        { id: "GDPR-ART25-001-C1", description: "Privacy impact assessment conducted", status: "not-implemented" },
        { id: "GDPR-ART25-001-C2", description: "Pseudonymisation implemented where applicable", status: "not-implemented" },
        { id: "GDPR-ART25-001-C3", description: "Data protection integrated into development lifecycle", status: "not-implemented" },
      ],
    },
    {
      id: "GDPR-ART25-002",
      name: "Data Protection by Default",
      description: "Only personal data necessary for each specific purpose is processed by default.",
      category: "privacy-by-design",
      framework: "GDPR",
      article: "Article 25(2)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Configure default settings to process minimal data. Require explicit opt-in for additional data processing. Implement granular consent controls.",
      checks: [
        { id: "GDPR-ART25-002-C1", description: "Default settings minimise data processing", status: "not-implemented" },
        { id: "GDPR-ART25-002-C2", description: "Explicit opt-in required for additional processing", status: "not-implemented" },
      ],
    },
  ];
}
