import * as fs from "node:fs";
import * as path from "node:path";
import type { Scanner, Finding, ScanContext } from "./types.js";
import {
  loadGovernanceRecords,
  verifyGovernanceRecord,
} from "@greenarmor/ges-core";

export class GovernanceScanner implements Scanner {
  name = "governance";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    const controlsDir = path.join(ctx.root, "controls", "governance");
    if (!fs.existsSync(controlsDir)) return findings;

    const records = loadGovernanceRecords(ctx.root);

    if (records.length === 0) {
      findings.push({
        ruleId: "GOVP-001",
        severity: "high",
        category: "governance",
        title: "No governance provenance records found",
        description:
          "The governance control pack is installed, but no governance records exist. Every system with governance controls must have at least one governance provenance record linking system identity, risk assessment, policy basis, approval, and evidence.",
        file: ".ges/governance-records.json",
        evidence: "0 records found",
        controlIds: ["GOVP-001", "GOVP-004", "GOVP-005"],
        fix: "Run 'ges governance add --name <system> --type <type> --risk <level>' to create a governance record.",
      });
      return findings;
    }

    for (const record of records) {
      const verification = verifyGovernanceRecord(record);
      const fileId = `.ges/governance-records.json [${record.system_name}]`;

      if (!record.risk_assessment) {
        findings.push({
          ruleId: "GOVP-002",
          severity: "medium",
          category: "governance",
          title: `Missing risk assessment: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no linked risk assessment. A risk assessment is required for provenance chain completeness.`,
          file: fileId,
          evidence: `risk_assessment: null`,
          controlIds: ["GOVP-002"],
          fix: "Run 'ges governance risk-assessment <id> --assessor <name> --methodology <text> --score <score> --residual <level>'.",
        });
      }

      if (!record.policy_basis) {
        findings.push({
          ruleId: "GOVP-003",
          severity: "medium",
          category: "governance",
          title: `Missing policy basis: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no documented policy basis. The regulatory or organizational policy under which the system operates must be recorded.`,
          file: fileId,
          evidence: `policy_basis: null`,
          controlIds: ["GOVP-003"],
          fix: "Run 'ges governance policy-basis <id> --policy-name <name> --standard <standard>'.",
        });
      }

      if (!record.approval) {
        findings.push({
          ruleId: "GOVP-004",
          severity: "high",
          category: "governance",
          title: `Missing approval decision: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no recorded approval decision. An approval (approved, conditional, or rejected) must be documented with approver identity and authority.`,
          file: fileId,
          evidence: `approval: null`,
          controlIds: ["GOVP-004", "GOVP-008"],
          fix: "Run 'ges governance approve <id> --approver <name> --role <role> --decision <decision> --authority <authority>'.",
        });
      }

      if (record.evidence.length === 0) {
        findings.push({
          ruleId: "GOVP-005",
          severity: "high",
          category: "governance",
          title: `No evidence references: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no evidence references attached. At least one piece of supporting evidence must be linked to the approval chain.`,
          file: fileId,
          evidence: `evidence: []`,
          controlIds: ["GOVP-005"],
          fix: "Run 'ges governance evidence <id> --title <title> --source <system> --reference <ref>'.",
        });
      }

      if (!record.review_cycle) {
        findings.push({
          ruleId: "GOVP-007",
          severity: "low",
          category: "governance",
          title: `Missing review cycle: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no review cycle defined. Without a review cycle, continuous compliance monitoring is not enforced and approvals may expire without notice.`,
          file: fileId,
          evidence: `review_cycle: null`,
          controlIds: ["GOVP-007"],
          fix: "Run 'ges governance review-cycle <id> --frequency <freq> --next-review <date>'.",
        });
      }

      if (record.approval && record.approval.valid_until) {
        const expiry = new Date(record.approval.valid_until);
        const now = new Date();
        const daysUntilExpiry = Math.ceil(
          (expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (daysUntilExpiry < 0) {
          findings.push({
            ruleId: "GOVP-008",
            severity: "critical",
            category: "governance",
            title: `Expired approval: ${record.system_name}`,
            description: `Approval for "${record.system_name}" expired on ${record.approval.valid_until}. An expired approval means the system is no longer authorized under the governance framework.`,
            file: fileId,
            evidence: `valid_until: ${record.approval.valid_until} (expired ${Math.abs(daysUntilExpiry)} days ago)`,
            controlIds: ["GOVP-008"],
            fix: "Run 'ges governance approve <id> --decision approved --valid-until <new-date>' to renew the approval.",
          });
        } else if (daysUntilExpiry <= 30) {
          findings.push({
            ruleId: "GOVP-008",
            severity: "medium",
            category: "governance",
            title: `Approval expiring soon: ${record.system_name}`,
            description: `Approval for "${record.system_name}" expires in ${daysUntilExpiry} days (${record.approval.valid_until}). Plan a review before expiry.`,
            file: fileId,
            evidence: `valid_until: ${record.approval.valid_until} (${daysUntilExpiry} days remaining)`,
            controlIds: ["GOVP-008"],
            fix: "Run 'ges governance approve <id> --decision approved --valid-until <new-date>' to extend validity.",
          });
        }
      }

      if (!record.data_inventory) {
        findings.push({
          ruleId: "GOVP-009",
          severity: "low",
          category: "governance",
          title: `Missing data inventory: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no data inventory. Personal data categories and processing purposes should be documented for GDPR alignment.`,
          file: fileId,
          evidence: `data_inventory: null`,
          controlIds: ["GOVP-009"],
          fix: "Run 'ges governance data-inventory <id> --categories <cats> --purposes <purposes>'.",
        });
      }

      if (!record.compliance) {
        findings.push({
          ruleId: "GOVP-010",
          severity: "low",
          category: "governance",
          title: `Missing compliance links: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has no compliance framework links mapped. Linking to GDPR, OWASP, or other frameworks provides traceability.`,
          file: fileId,
          evidence: `compliance: null`,
          controlIds: ["GOVP-010"],
          fix: "Run 'ges governance compliance-links <id> --frameworks GDPR,OWASP'.",
        });
      }

      if (verification.issues.length > 0) {
        findings.push({
          ruleId: "GOVP-011",
          severity: "high",
          category: "governance",
          title: `Verification failed: ${record.system_name}`,
          description: `Governance record for "${record.system_name}" has ${verification.issues.length} blocking issue(s): ${verification.issues.join("; ")}.`,
          file: fileId,
          evidence: `Blocking issues: ${verification.issues.join("; ")}`,
          controlIds: ["GOVP-011"],
          fix: "Run 'ges governance verify <id>' to see the full verification report, then resolve blocking issues using enrichment commands.",
        });
      }
    }

    return findings;
  }
}
