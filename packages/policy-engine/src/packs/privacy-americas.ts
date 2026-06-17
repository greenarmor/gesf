import type { PolicyPack, Control } from "@greenarmor/ges-core";

// ============================================================
// BRAZIL — LGPD (Lei Geral de Proteção de Dados, Law No. 13,709/2018)
// Regulator: ANPD (Autoridade Nacional de Proteção de Dados)
// In effect: September 18, 2020 (sanctions from August 1, 2021)
// ============================================================

export function createBrazilLGPDPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Governance & Accountability ---

    {
      id: "LGPD-01",
      name: "Encarregado (DPO) Appointment",
      description: "Appoint an Encarregado (Data Protection Officer) and publish their contact information per ANPD guidance.",
      category: "privacy-governance",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Appoint an Encarregado de Proteção de Dados (DPO) who is responsible for: accepting complaints, communicating with ANPD, guiding employees/contractors on LGPD compliance, and executing other ANPD-defined duties. Publish the Encarregado's identity and contact details on the organization's website or other accessible medium. The Encarregado must be a person of integrity and independence. Small entities may be exempted by ANPD regulation. [Ref: LGPD Article 41; ANPD Resolution CD/ANPD No. 5/2022]",
      checks: [
        { id: "LGPD-01-C1", description: "Encarregado appointed with defined responsibilities", status: "not-implemented" },
        { id: "LGPD-01-C2", description: "Contact information published and accessible", status: "not-implemented" },
        { id: "LGPD-01-C3", description: "ANPD exemption assessment documented if applicable", status: "not-implemented" },
      ],
    },
    {
      id: "LGPD-02",
      name: "Records of Processing Activities",
      description: "Maintain a Record of Personal Data Processing Operations as required by LGPD Article 37.",
      category: "data-inventory",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Maintain a Record of Personal Data Processing Operations (ROPD) documenting: controller/processor/Encarregado details, categories of data subjects, personal data categories, purposes, data sharing, international transfers, retention, and security measures. Small entities are exempt unless processing is high-risk under ANPD criteria. [Ref: LGPD Article 37; ANPD Simplified Records Resolution]",
      checks: [
        { id: "LGPD-02-C1", description: "ROPD maintained with all Article 37 required fields", status: "not-implemented" },
        { id: "LGPD-02-C2", description: "Records updated when processing activities change", status: "not-implemented" },
        { id: "LGPD-02-C3", description: "Exemption assessment documented for small entities", status: "not-implemented" },
      ],
    },

    // --- Legal Bases & Consent ---

    {
      id: "LGPD-03",
      name: "Legal Basis for Processing",
      description: "Identify and document one of the ten LGPD legal bases for each processing activity.",
      category: "consent-management",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Document the applicable legal basis for each processing activity. The ten bases are: (1) consent, (2) compliance with legal/regulatory duty, (3) public administration policy execution, (4) studies by research entities, (5) contract performance, (6) regular exercise of rights, (7) protection of life/physical safety, (8) protection of health by health professionals/services, (9) legitimate interests, (10) credit protection. When relying on legitimate interests, conduct a balancing test. [Ref: LGPD Article 7]",
      checks: [
        { id: "LGPD-03-C1", description: "Legal basis documented per processing activity", status: "not-implemented" },
        { id: "LGPD-03-C2", description: "Legitimate interest balancing test conducted where applicable", status: "not-implemented" },
        { id: "LGPD-03-C3", description: "Legal basis communicated in privacy notice", status: "not-implemented" },
      ],
    },
    {
      id: "LGPD-04",
      name: "Consent Management (LGPD)",
      description: "Obtain free, informed, and unambiguous consent that is specific for each purpose.",
      category: "consent-management",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Consent must be: free, informed, unambiguous, expressed in writing or by other means demonstrating the holder's will. Must be specific for each purpose (no bundled consent). Consent for sensitive personal data must be in writing or by separate means, unless an exception applies. Children and adolescents' data requires specific consent from at least one parent or legal guardian (best interest of the child principle). Provide easy withdrawal mechanism at no cost. [Ref: LGPD Articles 8, 11, 14]",
      checks: [
        { id: "LGPD-04-C1", description: "Consent obtained per specific purpose (no bundling)", status: "not-implemented" },
        { id: "LGPD-04-C2", description: "Written/separate consent for sensitive data", status: "not-implemented" },
        { id: "LGPD-04-C3", description: "Guardian consent for minors (best interest principle)", status: "not-implemented" },
        { id: "LGPD-04-C4", description: "Easy, free consent withdrawal mechanism", status: "not-implemented" },
      ],
    },

    // --- Data Subject Rights ---

    {
      id: "LGPD-05",
      name: "Holder Rights (Article 18)",
      description: "Implement all data holder rights with response within 15 days of request.",
      category: "data-subject-rights",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement rights: (1) confirmation of processing, (2) access to data, (3) correction of incomplete/inaccurate data, (4) anonymization/blocking/deletion of unnecessary/excessive/processed in non-compliance, (5) portability to another service/product provider, (6) deletion of personal data processed with consent, (7) information about data sharing, (8) information about possibility to deny consent and consequences. Respond within 15 days of the request. Facilitate rights via an easy, free mechanism. [Ref: LGPD Article 18]",
      checks: [
        { id: "LGPD-05-C1", description: "All Article 18 rights implemented and accessible", status: "not-implemented" },
        { id: "LGPD-05-C2", description: "Response within 15 days of request", status: "not-implemented" },
        { id: "LGPD-05-C3", description: "Free mechanism for exercising rights", status: "not-implemented" },
      ],
    },

    // --- Security & DPIA ---

    {
      id: "LGPD-06",
      name: "Security of Personal Data",
      description: "Implement appropriate technical and organizational security measures per LGPD Article 46.",
      category: "security-controls",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement security measures appropriate to the nature of the personal data and considering: the current state of technology, the specific characteristics of processing, and the potential risks. Measures should include: access controls, encryption, network security, authentication, backup, and incident response. Periodically review and update measures. Follow ANPD security guidance when published. [Ref: LGPD Article 46]",
      checks: [
        { id: "LGPD-06-C1", description: "Security measures documented and risk-assessed", status: "not-implemented" },
        { id: "LGPD-06-C2", description: "Encryption and access controls implemented", status: "not-implemented" },
        { id: "LGPD-06-C3", description: "Security measures reviewed and updated periodically", status: "not-implemented" },
      ],
    },
    {
      id: "LGPD-07",
      name: "Data Protection Impact Assessment (DPIA-LGPD)",
      description: "Conduct a Data Protection Impact Assessment for processing based on legitimate interests or high-risk activities.",
      category: "privacy-governance",
      framework: "LGPD",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct a DPIA for processing activities that may generate public risk, based on ANPD criteria. The DPIA must document: processing description, legitimacy assessments, risk analysis, and mitigation measures. Consult the Encarregado. The DPIA must be kept under confidentiality. Submit to ANPD when requested or when the processing poses high risk. [Ref: LGPD Article 38; ANPD DPIA Guidance]",
      checks: [
        { id: "LGPD-07-C1", description: "DPIA criteria established based on ANPD guidance", status: "not-implemented" },
        { id: "LGPD-07-C2", description: "DPIAs conducted for high-risk processing", status: "not-implemented" },
        { id: "LGPD-07-C3", description: "DPIA records maintained under confidentiality", status: "not-implemented" },
      ],
    },

    // --- Breach Notification ---

    {
      id: "LGPD-08",
      name: "ANPD Breach Notification",
      description: "Notify ANPD and affected data subjects of security incidents that may cause risk or harm.",
      category: "incident-management",
      framework: "LGPD",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Notify ANPD within a reasonable timeframe of a security incident that may cause risk or relevant harm to data subjects. The ANPD notification must include: nature of data, description of the incident, affected data subjects, technical/security measures adopted, risks involved, and reasons for delay (if any). Notify affected data subjects unless the risk has been mitigated (e.g., encryption). Maintain an internal incident register. [Ref: LGPD Article 48; ANPD Resolution CD/ANPD No. 15/2024]",
      checks: [
        { id: "LGPD-08-C1", description: "ANPD notification procedure established", status: "not-implemented" },
        { id: "LGPD-08-C2", description: "Affected data subjects notified when risk/harm exists", status: "not-implemented" },
        { id: "LGPD-08-C3", description: "Incident register maintained", status: "not-implemented" },
      ],
    },

    // --- International Transfers ---

    {
      id: "LGPD-09",
      name: "International Data Transfer (LGPD)",
      description: "Ensure international transfers of personal data comply with LGPD Articles 33-36.",
      category: "cross-border-transfers",
      framework: "LGPD",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Transfer personal data to foreign countries only when: the destination country provides adequate level of protection (ANPD adequacy decision), the controller guarantees and demonstrates compliance (SCCs), international cooperation instruments exist, or the controller proves effective compliance with principles and rights. ANPD may establish specific contractual clauses (CCs). When a transfer basis is contested, the burden of proof is on the controller. [Ref: LGPD Articles 33-36; ANPD International Transfer Regulations]",
      checks: [
        { id: "LGPD-09-C1", description: "Transfer register maintained with basis per transfer", status: "not-implemented" },
        { id: "LGPD-09-C2", description: "ANPD SCCs or adequacy for each international transfer", status: "not-implemented" },
        { id: "LGPD-09-C3", description: "ANPD adequacy decisions monitored", status: "not-implemented" },
      ],
    },

    // --- Processor Management ---

    {
      id: "LGPD-10",
      name: "Operator (Processor) Contracts",
      description: "Execute LGPD-compliant contracts with all operators (processors).",
      category: "vendor-management",
      framework: "LGPD",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute written contracts with operators (processors) covering: processing purposes, nature and scope, duration, data categories, data subject rights, security measures, confidentiality, sub-processor controls, data return/deletion upon termination, and audit rights. Operators must process only on documented instructions. Operators are jointly liable for damages caused by processing that deviates from instructions. [Ref: LGPD Article 39]",
      checks: [
        { id: "LGPD-10-C1", description: "Article 39 contracts executed with all operators", status: "not-implemented" },
        { id: "LGPD-10-C2", description: "Sub-processor flow-down terms included", status: "not-implemented" },
        { id: "LGPD-10-C3", description: "Data return/deletion upon termination guaranteed", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "br-lgpd",
    name: "Brazil LGPD Pack (Law 13,709/2018)",
    description: "Comprehensive Brazilian LGPD controls: Encarregado appointment (Art. 41), ROPD (Art. 37), ten legal bases (Art. 7), consent management (Art. 8/11/14), holder rights with 15-day response (Art. 18), security (Art. 46), DPIA (Art. 38), ANPD breach notification (Art. 48), international transfers (Art. 33-36), and operator contracts (Art. 39).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["LGPD"],
  };
}

// ============================================================
// CANADA — PIPEDA (Personal Information Protection and Electronic Documents Act, S.C. 2000, c. 5)
// Regulator: Office of the Privacy Commissioner of Canada (OPC)
// Breach provisions: PIPEDA Section 10.1 (in force Nov 1, 2018)
// ============================================================

export function createCanadaPIPEDAPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Accountability Principle ---

    {
      id: "PIPEDA-01",
      name: "Accountability (Principle 1)",
      description: "Designate a Privacy Officer responsible for compliance and implement accountability policies.",
      category: "privacy-governance",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Designate an individual (Privacy Officer) accountable for PIPEDA compliance. The organization is responsible for personal information under its control, including information transferred to third parties for processing. Implement policies and practices to comply with PIPEDA. Make the Privacy Officer's identity and contact information available upon request. [Ref: PIPEDA Schedule 1, Principle 4.1]",
      checks: [
        { id: "PIPEDA-01-C1", description: "Privacy Officer designated and documented", status: "not-implemented" },
        { id: "PIPEDA-01-C2", description: "Accountability policies implemented", status: "not-implemented" },
        { id: "PIPEDA-01-C3", description: "Privacy Officer contact available upon request", status: "not-implemented" },
      ],
    },

    // --- Identifying Purposes ---

    {
      id: "PIPEDA-02",
      name: "Identifying Purposes (Principle 2)",
      description: "Document and communicate the purposes for personal information collection before or at the time of collection.",
      category: "consent-management",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Identify and document purposes for which personal information is collected. Communicate purposes to the individual before or at the time of collection. For secondary use, identify the new purpose and obtain consent. Purposes should be limited to what a reasonable person would consider appropriate. [Ref: PIPEDA Schedule 1, Principle 4.2; PIPEDA Section 5]",
      checks: [
        { id: "PIPEDA-02-C1", description: "Purposes documented before/at collection", status: "not-implemented" },
        { id: "PIPEDA-02-C2", description: "New consent obtained for secondary purposes", status: "not-implemented" },
      ],
    },

    // --- Consent ---

    {
      id: "PIPEDA-03",
      name: "Consent (Principle 3)",
      description: "Obtain meaningful knowledge and consent for collection, use, or disclosure of personal information.",
      category: "consent-management",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain consent that is appropriate for the circumstances. Consent can be express or implied. Require express consent for sensitive information. Do not make consent a condition of providing a service beyond what is necessary. Provide means to withdraw consent, subject to legal/contractual restrictions. For minors, obtain consent from a parent/guardian. Consider the 'appropriate purposes' test under PIPEDA Section 5(3). [Ref: PIPEDA Schedule 1, Principle 4.3; PIPEDA Section 6.1]",
      checks: [
        { id: "PIPEDA-03-C1", description: "Consent obtained appropriate to circumstances", status: "not-implemented" },
        { id: "PIPEDA-03-C2", description: "Express consent for sensitive data", status: "not-implemented" },
        { id: "PIPEDA-03-C3", description: "Consent withdrawal mechanism available", status: "not-implemented" },
      ],
    },

    // --- Limiting Collection ---

    {
      id: "PIPEDA-04",
      name: "Limiting Collection (Principle 4)",
      description: "Limit collection of personal information to what is necessary for identified purposes.",
      category: "data-inventory",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Collect personal information only by fair and lawful means. Do not collect information that is unnecessary for the identified purposes. Document data minimization practices. Avoid deceptive or misleading collection practices. Regularly review collection forms and processes for necessity. [Ref: PIPEDA Schedule 1, Principle 4.4]",
      checks: [
        { id: "PIPEDA-04-C1", description: "Collection limited to identified purposes", status: "not-implemented" },
        { id: "PIPEDA-04-C2", description: "Collection methods are fair and lawful", status: "not-implemented" },
      ],
    },

    // --- Limiting Use, Disclosure, and Retention ---

    {
      id: "PIPEDA-05",
      name: "Limiting Use, Disclosure, Retention (Principle 5)",
      description: "Do not use or disclose personal information for new purposes without consent. Retain only as long as necessary.",
      category: "data-retention",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Use and disclose personal information only for the purpose it was collected, unless consent is obtained or required by law. Retain personal information only as long as necessary for the identified purposes or as required by law. Destroy, erase, or anonymize data no longer required. Document retention and destruction guidelines. [Ref: PIPEDA Schedule 1, Principle 4.5]",
      checks: [
        { id: "PIPEDA-05-C1", description: "New purposes require fresh consent", status: "not-implemented" },
        { id: "PIPEDA-05-C2", description: "Retention schedules documented", status: "not-implemented" },
        { id: "PIPEDA-05-C3", description: "Destruction/anonymization of expired data", status: "not-implemented" },
      ],
    },

    // --- Accuracy ---

    {
      id: "PIPEDA-06",
      name: "Accuracy (Principle 6)",
      description: "Ensure personal information is accurate, complete, and up-to-date for its intended use.",
      category: "data-inventory",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Minimize the possibility of using inaccurate information for decisions. Update personal information when inaccuracies are identified. Provide mechanisms for individuals to challenge accuracy and have information amended. Do not routinely update data unless necessary for the identified purpose. [Ref: PIPEDA Schedule 1, Principle 4.6]",
      checks: [
        { id: "PIPEDA-06-C1", description: "Accuracy verification procedures implemented", status: "not-implemented" },
        { id: "PIPEDA-06-C2", description: "Individual amendment/challenge mechanism available", status: "not-implemented" },
      ],
    },

    // --- Safeguards ---

    {
      id: "PIPEDA-07",
      name: "Safeguards (Principle 7)",
      description: "Implement security safeguards appropriate to the sensitivity of the personal information.",
      category: "security-controls",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Protect personal information with safeguards appropriate to sensitivity. Safeguards include: physical measures (locked offices, restricted access), organizational measures (security clearances, need-to-know), and technological measures (passwords, encryption, firewalls). Methods of disposal must prevent unauthorized access. Ensure employees understand the importance of maintaining confidentiality. [Ref: PIPEDA Schedule 1, Principle 4.7; OPC Security Guidance]",
      checks: [
        { id: "PIPEDA-07-C1", description: "Safeguards proportional to data sensitivity", status: "not-implemented" },
        { id: "PIPEDA-07-C2", description: "Physical, organizational, and technical safeguards implemented", status: "not-implemented" },
        { id: "PIPEDA-07-C3", description: "Secure disposal methods preventing unauthorized access", status: "not-implemented" },
      ],
    },

    // --- Access and Individual Rights ---

    {
      id: "PIPEDA-08",
      name: "Openness and Access (Principles 8 & 9)",
      description: "Provide individuals access to their personal information and make privacy policies readily available.",
      category: "data-subject-rights",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Make information about privacy policies and practices readily available. Upon request, inform individuals of the existence, use, and disclosure of their personal information and provide access. Respond within 30 days (extendable by 30). Provide access at minimal or no cost. Allow individuals to challenge the accuracy and completeness of information. Document refusals with reasons. [Ref: PIPEDA Schedule 1, Principles 4.8-4.9; PIPEDA Section 8]",
      checks: [
        { id: "PIPEDA-08-C1", description: "Privacy policy publicly available", status: "not-implemented" },
        { id: "PIPEDA-08-C2", description: "Access requests fulfilled within 30 days", status: "not-implemented" },
        { id: "PIPEDA-08-C3", description: "Accuracy challenge mechanism implemented", status: "not-implemented" },
      ],
    },

    // --- Challenging Compliance ---

    {
      id: "PIPEDA-09",
      name: "Challenging Compliance (Principle 10)",
      description: "Establish procedures to receive and respond to complaints about personal information handling.",
      category: "data-subject-rights",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Establish complaint procedures that are easily accessible and simple to use. Inform complainants of avenues of recourse, including the ability to complain to the OPC. Investigate all complaints and take appropriate remedial action. Document complaints, investigations, and outcomes. [Ref: PIPEDA Schedule 1, Principle 4.10]",
      checks: [
        { id: "PIPEDA-09-C1", description: "Accessible complaint procedure established", status: "not-implemented" },
        { id: "PIPEDA-09-C2", description: "OPC escalation communicated to complainants", status: "not-implemented" },
        { id: "PIPEDA-09-C3", description: "Complaint register maintained", status: "not-implemented" },
      ],
    },

    // --- Mandatory Breach Notification ---

    {
      id: "PIPEDA-10",
      name: "Mandatory Breach Notification (RROSH)",
      description: "Notify the OPC and affected individuals of breaches posing a 'real risk of significant harm.'",
      category: "incident-management",
      framework: "PIPEDA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Conduct a Real Risk of Significant Harm (RROSH) assessment for every breach. If a breach poses a real risk of significant harm to an individual, notify: (1) the affected individual(s) directly, (2) the OPC, and (3) any other organization/government institution that may mitigate harm. Maintain a breach record containing: breach description, date/discovery date, number of affected individuals, RROSH assessment, and remediation. Keep breach records for 24 months. [Ref: PIPEDA Section 10.1; Breach of Security Safeguards Regulations]",
      checks: [
        { id: "PIPEDA-10-C1", description: "RROSH assessment procedure implemented", status: "not-implemented" },
        { id: "PIPEDA-10-C2", description: "OPC and individual notification for RROSH breaches", status: "not-implemented" },
        { id: "PIPEDA-10-C3", description: "Breach records maintained for 24 months", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "ca-pipeda",
    name: "Canada PIPEDA Pack (10 Fair Information Principles)",
    description: "Comprehensive Canadian PIPEDA controls covering all 10 CSA fair information principles (Schedule 1): accountability, identifying purposes, consent, limiting collection, limiting use/disclosure/retention, accuracy, safeguards, openness, individual access, challenging compliance, plus mandatory RROSH breach notification (Section 10.1).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PIPEDA"],
  };
}

// ============================================================
// CALIFORNIA — CPRA (California Privacy Rights Act of 2020)
// Amends CCPA (California Consumer Privacy Act of 2018)
// Civil Code Sections 1798.100 - 1798.199.100
// Regulator: California Privacy Protection Agency (CPPA)
// ============================================================

export function createCaliforniaCRPAPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Consumer Rights ---

    {
      id: "CPRA-01",
      name: "Right to Know and Access",
      description: "Implement consumer rights to know what personal information is collected, used, shared, or sold.",
      category: "data-subject-rights",
      framework: "CPRA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Provide consumers the right to: (1) know the categories and specific pieces of personal information collected, (2) know the categories of sources, (3) know the business/commercial purpose for collecting/selling/sharing, (4) know the categories of third parties receiving data. Provide two methods for submitting requests (at minimum a toll-free number and internet address). Verify the consumer's identity. Respond within 45 days (extendable by 45). [Ref: Cal. Civ. Code § 1798.100, § 1798.110, § 1798.115]",
      checks: [
        { id: "CPRA-01-C1", description: "Two request submission methods available", status: "not-implemented" },
        { id: "CPRA-01-C2", description: "Identity verification procedure implemented", status: "not-implemented" },
        { id: "CPRA-01-C3", description: "Response within 45 days (90 max)", status: "not-implemented" },
      ],
    },
    {
      id: "CPRA-02",
      name: "Right to Delete",
      description: "Allow consumers to request deletion of their personal information.",
      category: "data-subject-rights",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Upon a verifiable consumer request, delete the consumer's personal information from business records and direct service providers/contractors to delete. Exceptions include: completing transactions, security/fraud detection, debugging, exercising free speech, complying with legal obligations, internal uses aligned with consumer expectations, and legal compliance. [Ref: Cal. Civ. Code § 1798.105]",
      checks: [
        { id: "CPRA-02-C1", description: "Deletion request process implemented", status: "not-implemented" },
        { id: "CPRA-02-C2", description: "Service provider deletion directed", status: "not-implemented" },
        { id: "CPRA-02-C3", description: "Exceptions documented and applied appropriately", status: "not-implemented" },
      ],
    },
    {
      id: "CPRA-03",
      name: "Right to Correct",
      description: "Allow consumers to correct inaccurate personal information maintained by the business.",
      category: "data-subject-rights",
      framework: "CPRA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Implement a mechanism for consumers to request correction of inaccurate personal information. Use reasonable efforts to verify accuracy before correcting. Consider the nature of the personal information, its use, and the potential impact on the consumer. Communicate the outcome of correction requests. [Ref: Cal. Civ. Code § 1798.106; CPRA added this right]",
      checks: [
        { id: "CPRA-03-C1", description: "Correction request process implemented", status: "not-implemented" },
        { id: "CPRA-03-C2", description: "Reasonable accuracy verification before correction", status: "not-implemented" },
      ],
    },
    {
      id: "CPRA-04",
      name: "Right to Opt-Out of Sale/Sharing",
      description: "Provide mechanisms for consumers to opt out of sale or sharing of personal information.",
      category: "consent-management",
      framework: "CPRA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Provide a clear and conspicuous 'Do Not Sell or Share My Personal Information' link on the homepage. Honor Global Privacy Control (GPC) browser signals as a valid opt-out request. Do not require account creation to submit opt-out requests. Do not discriminate against consumers who exercise their rights (except for permitted financial incentives). Allow authorized agents to submit requests on behalf of consumers. [Ref: Cal. Civ. Code § 1798.120, § 1798.135; CPPA GPC Regulations]",
      checks: [
        { id: "CPRA-04-C1", description: "'Do Not Sell or Share' link on homepage", status: "not-implemented" },
        { id: "CPRA-04-C2", description: "GPC browser signals honored", status: "not-implemented" },
        { id: "CPRA-04-C3", description: "No account requirement for opt-out", status: "not-implemented" },
        { id: "CPRA-04-C4", description: "Authorized agent requests supported", status: "not-implemented" },
      ],
    },
    {
      id: "CPRA-05",
      name: "Sensitive Personal Information Controls",
      description: "Allow consumers to limit use and disclosure of sensitive personal information.",
      category: "consent-management",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement a 'Limit the Use of My Sensitive Personal Information' link. Sensitive PI includes: SSN/driver's license/state ID, financial account info with access codes, precise geolocation, racial/ethnic origin, religious beliefs, private communications, genetic/biometric/health data, sex life/orientation. Consumers may limit use to what is necessary for performing services or providing goods. [Ref: Cal. Civ. Code § 1798.121; CPRA Definition of Sensitive PI § 1798.140(ae)]",
      checks: [
        { id: "CPRA-05-C1", description: "'Limit Sensitive PI' link on homepage", status: "not-implemented" },
        { id: "CPRA-05-C2", description: "Sensitive PI categories identified and mapped", status: "not-implemented" },
        { id: "CPRA-05-C3", description: "Use limiting mechanism implemented", status: "not-implemented" },
      ],
    },

    // --- Privacy Notice & Disclosures ---

    {
      id: "CPRA-06",
      name: "Privacy Policy Requirements",
      description: "Publish a privacy policy meeting all CPRA disclosure requirements.",
      category: "privacy-governance",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Publish a privacy policy describing: categories of PI collected, retention periods per category, categories of PI sold/shared, consumers' rights and how to exercise them, GPC recognition, financial incentive programs, PI collection/use/sources/categories of third parties, purpose of collecting/sharing, whether the business processes PI for secondary uses, whether assessments are conducted, and contact methods. Update at least every 12 months. Submit to CPPA registry if required. [Ref: Cal. Civ. Code § 1798.130; CPPA Privacy Policy Regulations]",
      checks: [
        { id: "CPRA-06-C1", description: "Privacy policy includes all CPRA-required disclosures", status: "not-implemented" },
        { id: "CPRA-06-C2", description: "Retention periods disclosed per data category", status: "not-implemented" },
        { id: "CPRA-06-C3", description: "Policy reviewed at least annually", status: "not-implemented" },
      ],
    },

    // --- Service Provider / Contractor Contracts ---

    {
      id: "CPRA-07",
      name: "Service Provider and Contractor Contracts",
      description: "Execute CPRA-compliant contracts with all service providers, contractors, and third parties.",
      category: "vendor-management",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute written contracts with service providers/contractors that: set out specific business purposes, prohibit using PI for other purposes, prohibit combining with other data (except permitted), prohibit selling/sharing, require notification of inability to comply within 5 days, grant audit rights, require sub-processor flow-down, and specify security measures. For third parties receiving PI, contract must prohibit combining for cross-context behavioral advertising. [Ref: Cal. Civ. Code § 1798.140(ag), § 1798.100(d); CPPA Contract Regulations]",
      checks: [
        { id: "CPRA-07-C1", description: "CPRA-compliant contracts with all service providers", status: "not-implemented" },
        { id: "CPRA-07-C2", description: "Audit rights and sub-processor flow-down included", status: "not-implemented" },
        { id: "CPRA-07-C3", description: "Cross-context behavioral advertising prohibition in third-party contracts", status: "not-implemented" },
      ],
    },

    // --- Data Protection Assessments ---

    {
      id: "CPRA-08",
      name: "Cybersecurity Audits and DPAs",
      description: "Conduct cybersecurity audits and data protection assessments for processing activities presenting significant risk.",
      category: "privacy-governance",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct regular cybersecurity audits. Perform Data Protection Assessments for processing activities that present significant risk to consumer privacy or security, including: selling/sharing PI, processing sensitive PI, automated decision-making technology (ADMT), and processing for purposes incompatible with disclosed purposes. Document assessments and make available to the CPPA upon request. [Ref: Cal. Civ. Code § 1798.185(a)(15); CPPA ADMT and Risk Assessment Regulations]",
      checks: [
        { id: "CPRA-08-C1", description: "Cybersecurity audit program established", status: "not-implemented" },
        { id: "CPRA-08-C2", description: "DPAs conducted for significant-risk processing", status: "not-implemented" },
        { id: "CPRA-08-C3", description: "ADMT assessments conducted where applicable", status: "not-implemented" },
      ],
    },

    // --- Data Minimization & Purpose Limitation ---

    {
      id: "CPRA-09",
      name: "Data Minimization and Purpose Limitation",
      description: "Collect and process personal information only for specific, explicit, and disclosed purposes.",
      category: "data-inventory",
      framework: "CPRA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Collect, use, retain, and share only what is reasonably necessary and proportionate to the disclosed purposes. Document collection purposes and verify minimization. Do not use PI for incompatible secondary purposes without notice and consent. Retain PI no longer than necessary for the purpose. [Ref: Cal. Civ. Code § 1798.100(c)]",
      checks: [
        { id: "CPRA-09-C1", description: "Collection limited to reasonably necessary data", status: "not-implemented" },
        { id: "CPRA-09-C2", description: "Purpose compatibility assessed before secondary use", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "us-cpra",
    name: "California CPRA Pack (CCPA as amended by CPRA 2020)",
    description: "Comprehensive California privacy controls covering CPRA/CCPA: right to know/access (§1798.100-115), right to delete (§1798.105), right to correct (§1798.106), opt-out of sale/sharing with GPC support (§1798.120/135), sensitive PI controls (§1798.121), privacy policy requirements, service provider contracts, cybersecurity audits and DPAs (§1798.185), and data minimization.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["CPRA"],
  };
}
