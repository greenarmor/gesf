import type { PolicyPack, Control } from "@greenarmor/ges-core";

export function createBlockchainPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "BC-001",
      name: "Cryptographic Signatures",
      description: "All on-chain operations must use cryptographic signatures.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement wallet-based transaction signing. Verify signatures before on-chain operations.",
      checks: [
        { id: "BC-001-C1", description: "Cryptographic signing implemented", status: "not-implemented" },
        { id: "BC-001-C2", description: "Signature verification on all operations", status: "not-implemented" },
      ],
    },
    {
      id: "BC-002",
      name: "Validator Identity Verification",
      description: "Validators must be identity-verified.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement KYC for validators. Maintain identity verification records.",
      checks: [
        { id: "BC-002-C1", description: "Validator identity verification process", status: "not-implemented" },
      ],
    },
    {
      id: "BC-003",
      name: "Key Rotation",
      description: "Implement regular key rotation for blockchain operations.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Define key rotation schedule. Automate rotation where possible. Maintain key history.",
      checks: [
        { id: "BC-003-C1", description: "Key rotation schedule defined", status: "not-implemented" },
        { id: "BC-003-C2", description: "Rotation automation implemented", status: "not-implemented" },
      ],
    },
    {
      id: "BC-004",
      name: "Encrypted Payload Support",
      description: "Support encrypted payloads for sensitive on-chain data.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Encrypt sensitive data before storing on-chain. Use hybrid encryption schemes.",
      checks: [
        { id: "BC-004-C1", description: "Encrypted payload support implemented", status: "not-implemented" },
        { id: "BC-004-C2", description: "No plaintext personal data on-chain", status: "not-implemented" },
      ],
    },
    {
      id: "BC-005",
      name: "Immutable Audit Trails",
      description: "Maintain immutable audit trails for all blockchain operations.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Use blockchain immutability for audit logs. Store hashes and CIDs. Keep references off-chain.",
      checks: [
        { id: "BC-005-C1", description: "Audit trail mechanism implemented", status: "not-implemented" },
        { id: "BC-005-C2", description: "Hashes stored on-chain, data off-chain", status: "not-implemented" },
      ],
    },
    {
      id: "BC-006",
      name: "No Plaintext Personal Data On-Chain",
      description: "Never store plaintext personal data on-chain. Store only hashes, CIDs, references, and encrypted metadata.",
      category: "blockchain",
      framework: "GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Store only hashes (SHA-256+), CIDs, references, or encrypted metadata on-chain. Keep actual data in encrypted off-chain storage.",
      checks: [
        { id: "BC-006-C1", description: "Only hashes/CIDs/references on-chain", status: "not-implemented" },
        { id: "BC-006-C2", description: "Encrypted metadata for on-chain records", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "blockchain",
    name: "Blockchain Policy Pack",
    description: "Controls for blockchain, wallets, and government ledgers.",
    version: "1.0.0",
    project_types: ["blockchain", "wallet"],
    controls,
    frameworks: ["GDPR"],
  };
}
