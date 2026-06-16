import type { PolicyPack, ProjectType } from "@greenarmor/ges-core";
import { createGDPRPolicyPack } from "./packs/gdpr.js";
import { createOWASPPolicyPack } from "./packs/owasp.js";
import { createAIPolicyPack } from "./packs/ai.js";
import { createBlockchainPolicyPack } from "./packs/blockchain.js";
import { createGovernmentPolicyPack } from "./packs/government.js";
import { createCISPolicyPack } from "./packs/cis.js";
import { createNISTPolicyPack } from "./packs/nist.js";
import { createNIST80053PolicyPack } from "./packs/nist-800-53.js";
import { createISO27001PolicyPack } from "./packs/iso27001.js";
import { createISO27701PolicyPack } from "./packs/iso27701.js";
import { createHIPAAPolicyPack } from "./packs/hipaa.js";

const ALL_PACKS: (() => PolicyPack)[] = [
  createGDPRPolicyPack,
  createOWASPPolicyPack,
  createAIPolicyPack,
  createBlockchainPolicyPack,
  createGovernmentPolicyPack,
  createCISPolicyPack,
  createNISTPolicyPack,
  createNIST80053PolicyPack,
  createISO27001PolicyPack,
  createISO27701PolicyPack,
  createHIPAAPolicyPack,
];

const PACK_MAP: Record<string, () => PolicyPack> = {
  gdpr: createGDPRPolicyPack,
  owasp: createOWASPPolicyPack,
  ai: createAIPolicyPack,
  blockchain: createBlockchainPolicyPack,
  government: createGovernmentPolicyPack,
  cis: createCISPolicyPack,
  nist: createNISTPolicyPack,
  "nist-800-53": createNIST80053PolicyPack,
  iso27001: createISO27001PolicyPack,
  iso27701: createISO27701PolicyPack,
  hipaa: createHIPAAPolicyPack,
};

export function getAllPacks(): PolicyPack[] {
  return ALL_PACKS.map(fn => fn());
}

export function getPack(id: string): PolicyPack | undefined {
  const factory = PACK_MAP[id];
  return factory ? factory() : undefined;
}

export function getPacksForProjectType(projectType: ProjectType): PolicyPack[] {
  return getAllPacks().filter(pack => pack.project_types.includes(projectType));
}

export function listPackIds(): string[] {
  return Object.keys(PACK_MAP);
}

export { createGDPRPolicyPack } from "./packs/gdpr.js";
export { createOWASPPolicyPack } from "./packs/owasp.js";
export { createAIPolicyPack } from "./packs/ai.js";
export { createBlockchainPolicyPack } from "./packs/blockchain.js";
export { createGovernmentPolicyPack } from "./packs/government.js";
export { createCISPolicyPack } from "./packs/cis.js";
export { createNISTPolicyPack } from "./packs/nist.js";
export { createNIST80053PolicyPack } from "./packs/nist-800-53.js";
export { createISO27001PolicyPack } from "./packs/iso27001.js";
export { createISO27701PolicyPack } from "./packs/iso27701.js";
export { createHIPAAPolicyPack } from "./packs/hipaa.js";
