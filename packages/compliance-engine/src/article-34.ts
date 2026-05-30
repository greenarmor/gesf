import type { Control } from "@greenarmor/ges-core";

export function createArticle34Controls(): Control[] {
  return [
    {
      id: "GDPR-ART34-001",
      name: "Data Breach Communication to Data Subjects",
      description: "Communicate personal data breaches to affected data subjects when likely to result in high risk.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 34(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Prepare data subject notification templates. Define criteria for high-risk breaches. Establish communication channels.",
      checks: [
        { id: "GDPR-ART34-001-C1", description: "Data subject notification templates prepared", status: "not-implemented" },
        { id: "GDPR-ART34-001-C2", description: "High-risk criteria defined", status: "not-implemented" },
        { id: "GDPR-ART34-001-C3", description: "Communication channels established", status: "not-implemented" },
      ],
    },
  ];
}
