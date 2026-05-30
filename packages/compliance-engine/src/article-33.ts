import type { Control } from "@greenarmor/ges-core";

export function createArticle33Controls(): Control[] {
  return [
    {
      id: "GDPR-ART33-001",
      name: "Data Breach Notification to Authority",
      description: "Notify the supervisory authority of a personal data breach within 72 hours.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 33(1)",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create a breach notification procedure. Define escalation paths. Prepare notification templates. Maintain contact details for supervisory authorities.",
      checks: [
        { id: "GDPR-ART33-001-C1", description: "Breach notification procedure documented", status: "not-implemented" },
        { id: "GDPR-ART33-001-C2", description: "72-hour notification timeline achievable", status: "not-implemented" },
        { id: "GDPR-ART33-001-C3", description: "Supervisory authority contacts maintained", status: "not-implemented" },
      ],
    },
    {
      id: "GDPR-ART33-002",
      name: "Breach Documentation",
      description: "Document all data breaches including facts, effects, and remedial actions.",
      category: "incident-response",
      framework: "GDPR",
      article: "Article 33(4)",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain a breach register. Record: nature of breach, categories and number of data subjects, likely consequences, and measures taken.",
      checks: [
        { id: "GDPR-ART33-002-C1", description: "Breach register maintained", status: "not-implemented" },
        { id: "GDPR-ART33-002-C2", description: "All required breach details documented", status: "not-implemented" },
      ],
    },
  ];
}
