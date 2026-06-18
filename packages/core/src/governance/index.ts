import * as fs from "node:fs";
import * as path from "node:path";
import type {
  GovernanceRecord,
  GovernanceVerificationResult,
  GovernanceStatus,
  GovernanceSystemType,
  GovernanceRiskLevel,
  ApprovalDecision,
  EvidenceRef,
  EvidenceType,
  EvidenceSourceSystem,
} from "../types/index.js";

const GOVERNANCE_FILE = "governance-records.json";

function recordsPath(projectPath: string): string {
  return path.join(projectPath, ".ges", GOVERNANCE_FILE);
}

export function loadGovernanceRecords(projectPath: string): GovernanceRecord[] {
  const rPath = recordsPath(projectPath);
  try {
    const raw = fs.readFileSync(rPath, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export function saveGovernanceRecords(projectPath: string, records: GovernanceRecord[]): void {
  const gesDir = path.join(projectPath, ".ges");
  if (!fs.existsSync(gesDir)) {
    fs.mkdirSync(gesDir, { recursive: true });
  }
  fs.writeFileSync(recordsPath(projectPath), JSON.stringify(records, null, 2), "utf-8");
}

let govCounter = 0;

export function generateGovernanceId(): string {
  govCounter++;
  return `gov-${Date.now()}-${govCounter}`;
}

let evidenceCounter = 0;

export function generateEvidenceId(): string {
  evidenceCounter++;
  return `evidence-${Date.now()}-${evidenceCounter}`;
}

export interface CreateGovernanceRecordInput {
  system_name: string;
  system_description?: string;
  system_type?: GovernanceSystemType;
  system_version?: string;
  risk_level?: GovernanceRiskLevel;
  created_by?: string;
}

export function createGovernanceRecord(opts: CreateGovernanceRecordInput): GovernanceRecord {
  const now = new Date().toISOString();
  const id = generateGovernanceId();
  return {
    id,
    system_name: opts.system_name,
    system_description: opts.system_description || "",
    system_type: opts.system_type || "ai-system",
    system_version: opts.system_version || "",
    status: "draft",
    risk_level: opts.risk_level || "medium",
    approval: null,
    risk_assessment: null,
    policy_basis: null,
    committee: null,
    evidence: [],
    review_cycle: null,
    data_inventory: null,
    compliance: null,
    created_at: now,
    created_by: opts.created_by || "system",
    updated_at: now,
    updated_by: opts.created_by || "system",
    record_version: 1,
  };
}

export function addGovernanceRecord(projectPath: string, record: GovernanceRecord): GovernanceRecord {
  const records = loadGovernanceRecords(projectPath);
  records.push(record);
  saveGovernanceRecords(projectPath, records);
  return record;
}

export function updateGovernanceRecord(
  projectPath: string,
  id: string,
  updates: Partial<GovernanceRecord>,
  updatedBy?: string,
): GovernanceRecord | null {
  const records = loadGovernanceRecords(projectPath);
  const idx = records.findIndex(r => r.id === id);
  if (idx === -1) return null;
  const now = new Date().toISOString();
  records[idx] = {
    ...records[idx],
    ...updates,
    updated_at: now,
    updated_by: updatedBy || records[idx].updated_by,
    record_version: records[idx].record_version + 1,
  };
  saveGovernanceRecords(projectPath, records);
  return records[idx];
}

export function findGovernanceRecord(projectPath: string, id: string): GovernanceRecord | null {
  const records = loadGovernanceRecords(projectPath);
  return records.find(r => r.id === id || r.system_name.toLowerCase() === id.toLowerCase()) || null;
}

export function setGovernanceApproval(
  projectPath: string,
  id: string,
  approval: ApprovalDecision,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  const newStatus: GovernanceStatus = approval.decision === "approved" ? "approved" : approval.decision === "rejected" ? "rejected" : "conditional";
  return updateGovernanceRecord(projectPath, record.id, { approval, status: newStatus }, updatedBy);
}

export function addGovernanceEvidence(
  projectPath: string,
  id: string,
  evidence: EvidenceRef,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  const evidenceList = [...record.evidence, evidence];
  return updateGovernanceRecord(projectPath, record.id, { evidence: evidenceList }, updatedBy);
}

export function createEvidenceRef(opts: {
  type: EvidenceType;
  title: string;
  source_system: EvidenceSourceSystem;
  reference: string;
  location_description: string;
  added_by: string;
}): EvidenceRef {
  return {
    id: generateEvidenceId(),
    type: opts.type,
    title: opts.title,
    source_system: opts.source_system,
    reference: opts.reference,
    location_description: opts.location_description,
    added_by: opts.added_by,
    added_at: new Date().toISOString(),
  };
}

export function deleteGovernanceRecord(projectPath: string, id: string): boolean {
  const records = loadGovernanceRecords(projectPath);
  const filtered = records.filter(r => r.id !== id && r.system_name.toLowerCase() !== id.toLowerCase());
  if (filtered.length === records.length) return false;
  saveGovernanceRecords(projectPath, filtered);
  return true;
}

export function setGovernanceRiskAssessment(
  projectPath: string,
  id: string,
  riskAssessment: import("../types/index.js").RiskAssessmentRef,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { risk_assessment: riskAssessment }, updatedBy);
}

export function setGovernancePolicyBasis(
  projectPath: string,
  id: string,
  policyBasis: import("../types/index.js").PolicyBasisRef,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { policy_basis: policyBasis }, updatedBy);
}

export function setGovernanceReviewCycle(
  projectPath: string,
  id: string,
  reviewCycle: import("../types/index.js").ReviewCycle,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { review_cycle: reviewCycle }, updatedBy);
}

export function setGovernanceDataInventory(
  projectPath: string,
  id: string,
  dataInventory: import("../types/index.js").GovernanceDataInventory,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { data_inventory: dataInventory }, updatedBy);
}

export function setGovernanceComplianceLinks(
  projectPath: string,
  id: string,
  compliance: import("../types/index.js").GovernanceComplianceLinks,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { compliance }, updatedBy);
}

export function setGovernanceCommittee(
  projectPath: string,
  id: string,
  committee: import("../types/index.js").CommitteeApprovalRef,
  updatedBy?: string,
): GovernanceRecord | null {
  const record = findGovernanceRecord(projectPath, id);
  if (!record) return null;
  return updateGovernanceRecord(projectPath, record.id, { committee }, updatedBy);
}

export function verifyGovernanceRecord(record: GovernanceRecord): GovernanceVerificationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  const hasApproval = record.approval !== null;
  const hasRiskAssessment = record.risk_assessment !== null;
  const hasPolicyBasis = record.policy_basis !== null;
  const hasEvidence = record.evidence.length > 0;
  const hasReviewCycle = record.review_cycle !== null;
  const hasDataInventory = record.data_inventory !== null;
  const hasComplianceLinks = record.compliance !== null;

  if (!hasApproval) issues.push("No approval decision recorded");
  if (!hasRiskAssessment) issues.push("No risk assessment linked");
  if (!hasPolicyBasis) issues.push("No policy basis documented");
  if (!hasEvidence) issues.push("No evidence references attached");
  if (!hasReviewCycle) warnings.push("No review cycle defined — continuous compliance not monitored");
  if (!hasDataInventory) warnings.push("No data inventory — personal data categories undocumented");
  if (!hasComplianceLinks) warnings.push("No compliance framework links mapped");

  let approvalStatus: "valid" | "expired" | "pending" | "none" = "none";
  let daysUntilExpiry: number | null = null;

  if (hasApproval && record.approval) {
    const now = new Date();
    if (record.approval.valid_until) {
      const expiry = new Date(record.approval.valid_until);
      daysUntilExpiry = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysUntilExpiry < 0) {
        approvalStatus = "expired";
        issues.push(`Approval expired on ${record.approval.valid_until}`);
      } else {
        approvalStatus = "valid";
        if (daysUntilExpiry <= 30) {
          warnings.push(`Approval expires in ${daysUntilExpiry} days (${record.approval.valid_until})`);
        }
      }
    } else {
      approvalStatus = "valid";
    }

    if (record.status === "pending-review" || record.status === "draft") {
      approvalStatus = "pending";
    }
  }

  const isCurrent =
    approvalStatus === "valid" &&
    (record.review_cycle === null || new Date(record.review_cycle.next_review) >= new Date());

  const valid = issues.length === 0 && hasApproval && hasRiskAssessment && hasEvidence;

  return {
    record_id: record.id,
    system_name: record.system_name,
    valid,
    issues,
    warnings,
    completeness: {
      has_approval: hasApproval,
      has_risk_assessment: hasRiskAssessment,
      has_policy_basis: hasPolicyBasis,
      has_evidence: hasEvidence,
      has_review_cycle: hasReviewCycle,
      has_data_inventory: hasDataInventory,
      has_compliance_links: hasComplianceLinks,
      evidence_count: record.evidence.length,
      is_current: isCurrent,
    },
    approval_status: approvalStatus,
    days_until_expiry: daysUntilExpiry,
  };
}

export function verifyAllGovernanceRecords(projectPath: string): GovernanceVerificationResult[] {
  return loadGovernanceRecords(projectPath).map(verifyGovernanceRecord);
}
