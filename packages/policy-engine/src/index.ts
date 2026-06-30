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
import { createPrivacyCorePolicyPack } from "./packs/privacy-core.js";
import { createUKGDPRPolicyPack, createSwissFADPPolicyPack } from "./packs/privacy-europe.js";
import {
  createSingaporePDPAPolicyPack,
  createPhilippinesDPAPolicyPack,
  createJapanAPPIPolicyPack,
  createSouthKoreaPIPAPolicyPack,
  createChinaPIPLPolicyPack,
  createIndiaDPDPAPolicyPack,
} from "./packs/privacy-asia.js";
import { createBrazilLGPDPolicyPack, createCanadaPIPEDAPolicyPack, createCaliforniaCRPAPolicyPack } from "./packs/privacy-americas.js";
import { createSouthAfricaPOPIAPolicyPack, createUAEPDPLPolicyPack, createSaudiArabiaPDPLPolicyPack } from "./packs/privacy-africa-me.js";
import { createGovernancePolicyPack } from "./packs/governance.js";
import { createCISDockerPolicyPack } from "./packs/cis-docker.js";
import { createCISKubernetesPolicyPack } from "./packs/cis-kubernetes.js";
import { createOWASPMASVSPolicyPack } from "./packs/owasp-masvs.js";
import { createOWASPLLMPolicyPack } from "./packs/owasp-llm.js";
import { createPCIDSSPolicyPack } from "./packs/pci-dss.js";
import { createSOC2PolicyPack } from "./packs/soc2.js";
import { createZeroTrustPolicyPack } from "./packs/zero-trust.js";

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
  // Global Privacy Framework
  createPrivacyCorePolicyPack,
  // Europe
  createUKGDPRPolicyPack,
  createSwissFADPPolicyPack,
  // Asia-Pacific
  createSingaporePDPAPolicyPack,
  createPhilippinesDPAPolicyPack,
  createJapanAPPIPolicyPack,
  createSouthKoreaPIPAPolicyPack,
  createChinaPIPLPolicyPack,
  createIndiaDPDPAPolicyPack,
  // Americas
  createBrazilLGPDPolicyPack,
  createCanadaPIPEDAPolicyPack,
  createCaliforniaCRPAPolicyPack,
  // Africa + Middle East
  createSouthAfricaPOPIAPolicyPack,
  createUAEPDPLPolicyPack,
  createSaudiArabiaPDPLPolicyPack,
  // Governance
  createGovernancePolicyPack,
  // Security Compliance Depth
  createCISDockerPolicyPack,
  createCISKubernetesPolicyPack,
  createOWASPMASVSPolicyPack,
  createOWASPLLMPolicyPack,
  createPCIDSSPolicyPack,
  createSOC2PolicyPack,
  createZeroTrustPolicyPack,
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
  // Global Privacy Framework
  "privacy-core": createPrivacyCorePolicyPack,
  // Europe
  "uk-gdpr": createUKGDPRPolicyPack,
  "ch-fadp": createSwissFADPPolicyPack,
  // Asia-Pacific
  "sg-pdpa": createSingaporePDPAPolicyPack,
  "ph-dpa": createPhilippinesDPAPolicyPack,
  "jp-appi": createJapanAPPIPolicyPack,
  "kr-pipa": createSouthKoreaPIPAPolicyPack,
  "cn-pipl": createChinaPIPLPolicyPack,
  "in-dpdpa": createIndiaDPDPAPolicyPack,
  // Americas
  "br-lgpd": createBrazilLGPDPolicyPack,
  "ca-pipeda": createCanadaPIPEDAPolicyPack,
  "us-cpra": createCaliforniaCRPAPolicyPack,
  // Africa + Middle East
  "za-popia": createSouthAfricaPOPIAPolicyPack,
  "ae-pdpl": createUAEPDPLPolicyPack,
  "sa-pdpl": createSaudiArabiaPDPLPolicyPack,
  // Governance
  "governance": createGovernancePolicyPack,
  // Security Compliance Depth
  "cis-docker": createCISDockerPolicyPack,
  "cis-kubernetes": createCISKubernetesPolicyPack,
  "owasp-masvs": createOWASPMASVSPolicyPack,
  "owasp-llm": createOWASPLLMPolicyPack,
  "pci-dss": createPCIDSSPolicyPack,
  "soc2": createSOC2PolicyPack,
  "zero-trust": createZeroTrustPolicyPack,
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
export { createPrivacyCorePolicyPack } from "./packs/privacy-core.js";
export { createUKGDPRPolicyPack, createSwissFADPPolicyPack } from "./packs/privacy-europe.js";
export {
  createSingaporePDPAPolicyPack,
  createPhilippinesDPAPolicyPack,
  createJapanAPPIPolicyPack,
  createSouthKoreaPIPAPolicyPack,
  createChinaPIPLPolicyPack,
  createIndiaDPDPAPolicyPack,
} from "./packs/privacy-asia.js";
export { createBrazilLGPDPolicyPack, createCanadaPIPEDAPolicyPack, createCaliforniaCRPAPolicyPack } from "./packs/privacy-americas.js";
export { createSouthAfricaPOPIAPolicyPack, createUAEPDPLPolicyPack, createSaudiArabiaPDPLPolicyPack } from "./packs/privacy-africa-me.js";
export { createGovernancePolicyPack } from "./packs/governance.js";
export { createCISDockerPolicyPack } from "./packs/cis-docker.js";
export { createCISKubernetesPolicyPack } from "./packs/cis-kubernetes.js";
export { createOWASPMASVSPolicyPack } from "./packs/owasp-masvs.js";
export { createOWASPLLMPolicyPack } from "./packs/owasp-llm.js";
export { createPCIDSSPolicyPack } from "./packs/pci-dss.js";
export { createSOC2PolicyPack } from "./packs/soc2.js";
export { createZeroTrustPolicyPack } from "./packs/zero-trust.js";
export { PRIVACY_COUNTRIES, getCountryByCode, getCountryPackId, getCountriesByRegion } from "./packs/countries.js";
export type { CountryPrivacyPack } from "./packs/countries.js";
