import type { PolicyPack, Control, ProjectType } from "@greenarmor/ges-core";
import { createGDPRControls } from "@greenarmor/ges-compliance-engine";

export function createGDPRPolicyPack(): PolicyPack {
  return {
    id: "gdpr",
    name: "GDPR Compliance Pack",
    description: "General Data Protection Regulation controls covering Articles 5, 25, 30, 32, 33, and 34.",
    version: "1.0.0",
    project_types: [
      "saas", "ai-application", "mcp-server", "blockchain", "wallet",
      "government-system", "healthcare-system", "event-platform",
      "photo-storage-platform", "vulnerability-scanner",
      "generic-web-application", "api-backend", "mobile-application",
    ],
    controls: createGDPRControls(),
    frameworks: ["GDPR"],
  };
}
