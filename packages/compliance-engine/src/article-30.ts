import type { Control } from "@greenarmor/ges-core";

export function createArticle30Controls(): Control[] {
  return [
    {
      id: "GDPR-ART30-001",
      name: "Record of Processing Activities",
      description: "Maintain a record of processing activities under the controller's responsibility.",
      category: "documentation",
      framework: "GDPR",
      article: "Article 30(1)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Create and maintain a processing activities register. Include: purposes, data categories, recipients, retention periods, and security measures.",
      checks: [
        { id: "GDPR-ART30-001-C1", description: "Processing activities register created", status: "not-implemented" },
        { id: "GDPR-ART30-001-C2", description: "All required fields documented per Article 30", status: "not-implemented" },
        { id: "GDPR-ART30-001-C3", description: "Register kept up to date", status: "not-implemented" },
      ],
    },
    {
      id: "GDPR-ART30-002",
      name: "Processor Records",
      description: "Processors must maintain records of all categories of processing carried out on behalf of controllers.",
      category: "documentation",
      framework: "GDPR",
      article: "Article 30(2)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "If acting as a processor, maintain records of all processing categories. Include controller details, processing purposes, and data transfers.",
      checks: [
        { id: "GDPR-ART30-002-C1", description: "Processor processing records maintained", status: "not-implemented" },
        { id: "GDPR-ART30-002-C2", description: "Data transfer documentation complete", status: "not-implemented" },
      ],
    },
  ];
}
