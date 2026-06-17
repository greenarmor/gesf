import type { PolicyPack, Control } from "@greenarmor/ges-core";

// ============================================================
// SOUTH AFRICA — POPIA (Protection of Personal Information Act, 2013, Act No. 4 of 2013)
// Regulator: Information Regulator (established under POPIA)
// In effect: July 1, 2020 (fully enforced from July 1, 2021)
// ============================================================

export function createSouthAfricaPOPIAPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Information Officer & Governance ---

    {
      id: "POPIA-01",
      name: "Information Officer Designation",
      description: "Designate an Information Officer and register their details with the Information Regulator.",
      category: "privacy-governance",
      framework: "POPIA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Designate the head of the organization as the Information Officer (IO). Register the IO's contact details with the Information Regulator. Ensure the IO's contact details are available on the organization's website and in official documentation. The IO is responsible for: encouraging compliance, dealing with information requests, cooperating with the Regulator, and ensuring compliance audits. Deputy IOs may be designated for specific business units. [Ref: POPIA Section 17; Information Regulator Guidelines on IO Designation]",
      checks: [
        { id: "POPIA-01-C1", description: "Information Officer designated and registered with Regulator", status: "not-implemented" },
        { id: "POPIA-01-C2", description: "IO contact details published on website", status: "not-implemented" },
        { id: "POPIA-01-C3", description: "Deputy IOs designated if needed", status: "not-implemented" },
      ],
    },

    // --- Processing Conditions ---

    {
      id: "POPIA-02",
      name: "Lawfulness of Processing (Section 10)",
      description: "Process personal information lawfully and only if specific conditions are met.",
      category: "consent-management",
      framework: "POPIA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Process PI only if: (1) the data subject/competent person consents, (2) necessary for contract performance, (3) compliance with legal obligation, (4) protects a legitimate interest, (5) necessary for public law duty, (6) performed by public body, or (7) the information is public. Consent must be voluntary, specific, informed, and unambiguous. [Ref: POPIA Sections 10-11]",
      checks: [
        { id: "POPIA-02-C1", description: "Processing basis documented per processing activity", status: "not-implemented" },
        { id: "POPIA-02-C2", description: "Consent obtained (voluntary, specific, informed, unambiguous)", status: "not-implemented" },
      ],
    },
    {
      id: "POPIA-03",
      name: "Purpose Specification and Retention",
      description: "Limit processing to specified purposes and delete/deidentify data when purpose is achieved.",
      category: "data-retention",
      framework: "POPIA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Do not process PI for purposes incompatible with the purpose for which it was obtained. Retain PI no longer than necessary to achieve the purpose. Destroy or deidentify records once the responsible party is no longer authorized to retain them, unless retention is required by law or contract. Record the destruction. Retain personal information only for historical, statistical, or research purposes with adequate safeguards. [Ref: POPIA Section 14; Sections 18-19]",
      checks: [
        { id: "POPIA-03-C1", description: "Purpose compatibility assessed for each processing", status: "not-implemented" },
        { id: "POPIA-03-C2", description: "Retention periods defined and documented", status: "not-implemented" },
        { id: "POPIA-03-C3", description: "Deletion/deidentification records maintained", status: "not-implemented" },
      ],
    },
    {
      id: "POPIA-04",
      name: "Further Processing Limitation",
      description: "Ensure further processing of personal information is compatible with the original collection purpose.",
      category: "data-inventory",
      framework: "POPIA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Further processing is compatible if: it is connected to the original purpose, consent has been obtained, the data has been made public, the processing is necessary for compliance, or it protects legitimate interests. Conduct compatibility assessments considering: the purpose of the intended further processing, the nature of the information, the consequences for the data subject, and contractual or other rights. [Ref: POPIA Section 15]",
      checks: [
        { id: "POPIA-04-C1", description: "Compatibility assessment conducted for further processing", status: "not-implemented" },
        { id: "POPIA-04-C2", description: "Further processing register maintained", status: "not-implemented" },
      ],
    },

    // --- Information Quality & Security ---

    {
      id: "POPIA-05",
      name: "Information Quality (Section 16)",
      description: "Take reasonably practicable steps to ensure personal information is complete, accurate, and not misleading.",
      category: "data-inventory",
      framework: "POPIA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Ensure data quality at collection and before use. Verify data against reliable sources. Provide correction mechanisms for data subjects. Document data quality control processes. Consider the purpose of processing when assessing quality requirements. [Ref: POPIA Section 16]",
      checks: [
        { id: "POPIA-05-C1", description: "Data quality verification procedures implemented", status: "not-implemented" },
        { id: "POPIA-05-C2", description: "Correction mechanism available for data subjects", status: "not-implemented" },
      ],
    },
    {
      id: "POPIA-06",
      name: "Security Safeguards (Section 19)",
      description: "Implement appropriate, reasonable technical and organizational security measures to secure personal information.",
      category: "security-controls",
      framework: "POPIA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Identify all reasonably foreseeable internal and external risks. Establish and maintain appropriate safeguards against identified risks. Regularly verify that safeguards are effectively implemented and updated. Safeguards must address: data loss, damage, unauthorized access, and unauthorized destruction. Safeguards include: access controls, encryption, firewalls, security software, physical access control, and incident response. [Ref: POPIA Section 19; Information Regulator Security Guidance]",
      checks: [
        { id: "POPIA-06-C1", description: "Risk assessment conducted for identified risks", status: "not-implemented" },
        { id: "POPIA-06-C2", description: "Safeguards implemented and regularly verified", status: "not-implemented" },
        { id: "POPIA-06-C3", description: "Encryption and access controls in place", status: "not-implemented" },
      ],
    },

    // --- Data Subject Rights ---

    {
      id: "POPIA-07",
      name: "Data Subject Rights (Section 23-25)",
      description: "Implement data subject rights: notification, access, correction, objection, and destruction.",
      category: "data-subject-rights",
      framework: "POPIA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement rights: (1) right to be notified when PI is collected, (2) right to establish whether the responsible party holds PI, (3) right to request correction/destruction of PI, (4) right to object to processing on reasonable grounds. Respond to requests within a reasonable time (generally within 30 days). Charge no fee for the initial request. Maintain documentation of requests and responses. [Ref: POPIA Sections 23-25]",
      checks: [
        { id: "POPIA-07-C1", description: "All POPIA data subject rights implemented", status: "not-implemented" },
        { id: "POPIA-07-C2", description: "Requests responded to within reasonable time", status: "not-implemented" },
        { id: "POPIA-07-C3", description: "Request documentation maintained", status: "not-implemented" },
      ],
    },

    // --- Breach Notification ---

    {
      id: "POPIA-08",
      name: "Compromise Notification (Section 22)",
      description: "Notify the Information Regulator and affected data subjects of security compromises.",
      category: "incident-management",
      framework: "POPIA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "When there are reasonable grounds to believe PI has been accessed or acquired by unauthorized persons, notify: (1) the Information Regulator, and (2) affected data subjects (unless exceptions apply). Notification must include: possible identity of unauthorized person, date of compromise, PI potentially compromised, possible harm, and steps taken/being taken. The Regulator may direct the responsible party to notify or publish notification if it hasn't been done. Maintain a compromise register. [Ref: POPIA Section 22; Information Regulator Breach Notification Regulations]",
      checks: [
        { id: "POPIA-08-C1", description: "Regulator notification procedure for compromises", status: "not-implemented" },
        { id: "POPIA-08-C2", description: "Individual notification with required details", status: "not-implemented" },
        { id: "POPIA-08-C3", description: "Compromise register maintained", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "za-popia",
    name: "South Africa POPIA Pack (Act 4 of 2013)",
    description: "Comprehensive South African POPIA controls: Information Officer designation (Sec. 17), lawful processing conditions (Sec. 10-11), purpose specification and retention (Sec. 14/18-19), further processing limitation (Sec. 15), information quality (Sec. 16), security safeguards (Sec. 19), data subject rights (Sec. 23-25), and compromise notification (Sec. 22).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["POPIA"],
  };
}

// ============================================================
// UAE — PDPL (Federal Decree-Law No. 45 of 2021 on the Protection of Personal Data)
// Regulator: UAE Data Office (established under Federal Law by decree)
// Implementing Regulation: Cabinet Decision No. 93 of 2021
// ============================================================

export function createUAEPDPLPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Data Protection Officer ---

    {
      id: "PDPL-UAE-01",
      name: "Data Protection Officer (UAE)",
      description: "Appoint a Data Protection Officer for processing that requires systematic monitoring or large-scale sensitive data.",
      category: "privacy-governance",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Appoint a DPO when processing involves: large-scale processing of sensitive personal data, systematic monitoring of data subjects on a large scale, or cases specified by the UAE Data Office. The DPO must: advise on PDPL compliance, cooperate with the UAE Data Office, and act as contact point. Publish DPO contact details. Ensure DPO independence and no conflict of interest. [Ref: PDPL Article 10-11; Cabinet Decision No. 93/2021]",
      checks: [
        { id: "PDPL-UAE-01-C1", description: "DPO appointed where required", status: "not-implemented" },
        { id: "PDPL-UAE-01-C2", description: "DPO contact details published", status: "not-implemented" },
        { id: "PDPL-UAE-01-C3", description: "DPO independence ensured", status: "not-implemented" },
      ],
    },

    // --- Consent & Legal Basis ---

    {
      id: "PDPL-UAE-02",
      name: "Consent and Legal Basis (UAE)",
      description: "Obtain clear, unambiguous consent or identify alternative legal basis for processing.",
      category: "consent-management",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain clear and unambiguous consent for processing. Alternatively, process based on: contract performance, legal obligation, vital interests, public interest, legitimate interests assessed against data subject rights, or other lawful bases specified in the law. For sensitive personal data (health, biometric, racial, religious, criminal), obtain explicit consent unless an exception applies. Consent must be free, specific, informed, and unambiguous. [Ref: PDPL Articles 4-5, 7-9]",
      checks: [
        { id: "PDPL-UAE-02-C1", description: "Clear, unambiguous consent obtained per purpose", status: "not-implemented" },
        { id: "PDPL-UAE-02-C2", description: "Explicit consent for sensitive data", status: "not-implemented" },
        { id: "PDPL-UAE-02-C3", description: "Legal basis documented per processing activity", status: "not-implemented" },
      ],
    },

    // --- Privacy Notice ---

    {
      id: "PDPL-UAE-03",
      name: "Privacy Notice and Transparency",
      description: "Provide clear privacy notices at the time of collection with all PDPL-required information.",
      category: "privacy-governance",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide a privacy notice including: controller identity and contact details, DPO contact, processing purposes, legal basis, data categories, recipients, cross-border transfers, retention period, data subject rights, and complaint mechanisms. Present in clear and understandable language (Arabic and/or English as appropriate). Make the notice available at or before collection. Update when processing purposes change. [Ref: PDPL Article 6]",
      checks: [
        { id: "PDPL-UAE-03-C1", description: "Privacy notice includes all PDPL-required items", status: "not-implemented" },
        { id: "PDPL-UAE-03-C2", description: "Notice provided at or before collection", status: "not-implemented" },
        { id: "PDPL-UAE-03-C3", description: "Notice in appropriate language(s)", status: "not-implemented" },
      ],
    },

    // --- Personal Data Protection Impact Assessment ---

    {
      id: "PDPL-UAE-04",
      name: "Personal Data Protection Impact Assessment",
      description: "Conduct DPIAs for processing activities that may pose high risks to data subjects.",
      category: "privacy-governance",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct a DPIA before processing that may result in a high risk to data subject rights, particularly when using new technologies. The DPIA must include: systematic description of processing, necessity and proportionality assessment, risk identification and assessment, and mitigation measures. Consult the DPO. Submit DPIA results to the UAE Data Office when requested. For Mainland UAE, specific DPIA requirements apply under Cabinet Decision No. 93/2021. [Ref: PDPL Article 20-21; Cabinet Decision No. 93/2021]",
      checks: [
        { id: "PDPL-UAE-04-C1", description: "DPIA criteria for high-risk processing established", status: "not-implemented" },
        { id: "PDPL-UAE-04-C2", description: "DPIAs conducted with required documentation", status: "not-implemented" },
        { id: "PDPL-UAE-04-C3", description: "Results submitted to UAE Data Office when required", status: "not-implemented" },
      ],
    },

    // --- Cross-Border Data Transfers ---

    {
      id: "PDPL-UAE-05",
      name: "Cross-Border Data Transfer (UAE)",
      description: "Ensure personal data transferred outside the UAE receives an adequate level of protection.",
      category: "cross-border-transfers",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Transfer personal data outside the UAE only when: the destination country provides adequate protection (UAE Data Office adequacy decision), appropriate safeguards are in place (SCCs, BCRs), or specific exceptions apply (explicit consent, contract performance, public interest). Assess destination country's legal framework. Use UAE Data Office-approved transfer mechanisms. Maintain transfer documentation. Special rules apply to transfers within UAE Free Zones (DIFC, ADGM) which have their own data protection regimes. [Ref: PDPL Article 22-25; Cabinet Decision No. 93/2021]",
      checks: [
        { id: "PDPL-UAE-05-C1", description: "Adequacy assessment conducted per destination country", status: "not-implemented" },
        { id: "PDPL-UAE-05-C2", description: "SCCs or BCRs for non-adequate transfers", status: "not-implemented" },
        { id: "PDPL-UAE-05-C3", description: "Free Zone (DIFC/ADGM) rules assessed if applicable", status: "not-implemented" },
      ],
    },

    // --- Breach Notification & Security ---

    {
      id: "PDPL-UAE-06",
      name: "Breach Notification and Security (UAE)",
      description: "Implement security measures and notify the UAE Data Office of personal data breaches.",
      category: "incident-management",
      framework: "PDPL-UAE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement appropriate technical and organizational measures to protect personal data. When a personal data breach occurs, notify the UAE Data Office as soon as possible and within the timeframe specified by regulation. If the breach poses high risk to data subjects, notify them without undue delay. The notification must include: nature of the breach, affected data categories, approximate number of affected individuals, measures taken, and contact details for further information. Maintain an internal breach register. [Ref: PDPL Article 15, 33-34; Cabinet Decision No. 93/2021]",
      checks: [
        { id: "PDPL-UAE-06-C1", description: "Security measures documented and implemented", status: "not-implemented" },
        { id: "PDPL-UAE-06-C2", description: "UAE Data Office notification procedure established", status: "not-implemented" },
        { id: "PDPL-UAE-06-C3", description: "Individual notification for high-risk breaches", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "ae-pdpl",
    name: "UAE PDPL Pack (Federal Decree-Law No. 45 of 2021)",
    description: "Comprehensive UAE personal data protection controls: DPO appointment (Art. 10-11), consent and legal basis (Art. 4-9), privacy notice requirements (Art. 6), DPIA for high-risk processing (Art. 20-21), cross-border transfers with Free Zone awareness (Art. 22-25), and breach notification with security measures (Art. 15/33-34).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PDPL-UAE"],
  };
}

// ============================================================
// SAUDI ARABIA — PDPL (Personal Data Protection Law, Royal Decree No. M/19)
// As amended September 2023 (Amending Law No. M/148)
// Regulator: National Data Management Office (NDMO) / SDAIA
// Fully in effect: September 14, 2023
// ============================================================

export function createSaudiArabiaPDPLPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Consent & Legal Basis ---

    {
      id: "PDPL-SA-01",
      name: "Consent and Legal Basis",
      description: "Obtain valid consent or identify alternative legal basis for processing personal data under the PDPL.",
      category: "consent-management",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain consent that is: specific, informed, and unambiguous, indicating the data subject's clear will. Alternatively, process based on: contract performance, legal obligation, vital interests, public task, legitimate interests (assessed against data subject rights and freedoms). For sensitive data (health, genetic, racial, ethnic, religious, biometric, criminal), obtain explicit consent unless an exception applies. Consent must be documented. [Ref: PDPL Articles 5-6, 9; Amending Law M/148/2023]",
      checks: [
        { id: "PDPL-SA-01-C1", description: "Specific, informed, unambiguous consent obtained", status: "not-implemented" },
        { id: "PDPL-SA-01-C2", description: "Explicit consent for sensitive data", status: "not-implemented" },
        { id: "PDPL-SA-01-C3", description: "Legal basis documented per processing activity", status: "not-implemented" },
      ],
    },

    // --- Privacy Notice ---

    {
      id: "PDPL-SA-02",
      name: "Privacy Notice (Arabic Language)",
      description: "Provide clear privacy notices in Arabic with all PDPL-required disclosures.",
      category: "privacy-governance",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide a privacy notice including: controller identity, contact details, processing purposes, legal basis, data categories, recipients, retention period, cross-border transfers, data subject rights (amendment, withdrawal of consent, destruction), and complaint mechanisms. The notice must be in clear Arabic language. Present before or at the time of collection. Update when processing purposes change. [Ref: PDPL Article 8; Amending Law M/148/2023]",
      checks: [
        { id: "PDPL-SA-02-C1", description: "Privacy notice in Arabic with all required items", status: "not-implemented" },
        { id: "PDPL-SA-02-C2", description: "Notice provided before/at collection", status: "not-implemented" },
      ],
    },

    // --- Data Subject Rights ---

    {
      id: "PDPL-SA-03",
      name: "Data Subject Rights",
      description: "Implement data subject rights including access, correction, destruction, and objection.",
      category: "data-subject-rights",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement rights: (1) right to be informed of processing, (2) right to access personal data and related information, (3) right to correct/update incomplete or inaccurate data, (4) right to destruction of data processed in violation, (5) right to withdraw consent, (6) right to lodge a complaint. Respond to requests within a reasonable period. Enable rights through accessible means (including the organization's website or app). [Ref: PDPL Articles 16-18; Amending Law M/148/2023]",
      checks: [
        { id: "PDPL-SA-03-C1", description: "All PDPL rights implemented and accessible", status: "not-implemented" },
        { id: "PDPL-SA-03-C2", description: "Requests processed within reasonable period", status: "not-implemented" },
      ],
    },

    // --- Data Localization & Cross-Border Transfer ---

    {
      id: "PDPL-SA-04",
      name: "Data Localization and Cross-Border Transfer",
      description: "Comply with Saudi data localization requirements and cross-border transfer regulations.",
      category: "cross-border-transfers",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "The amended PDPL requires that personal data be processed in Saudi Arabia. Cross-border transfer is permitted only when: the destination provides an adequate level of protection (per NDMO assessment), appropriate safeguards are in place (SCCs, BCRs approved by NDMO), or specific exceptions apply (explicit consent, contract performance, public interest). Assess the legal framework of the destination country. Maintain a transfer register. Obtain NDMO approval where required for specific transfers. Monitor NDMO transfer regulations and guidelines. [Ref: PDPL Article 29; Amending Law M/148/2023; NDMO Transfer Regulations]",
      checks: [
        { id: "PDPL-SA-04-C1", description: "Data localization requirement assessed and implemented", status: "not-implemented" },
        { id: "PDPL-SA-04-C2", description: "NDMO adequacy assessment for destination countries", status: "not-implemented" },
        { id: "PDPL-SA-04-C3", description: "SCCs/BCRs approved by NDMO for non-adequate transfers", status: "not-implemented" },
        { id: "PDPL-SA-04-C4", description: "Transfer register maintained", status: "not-implemented" },
      ],
    },

    // --- Security & Breach Notification ---

    {
      id: "PDPL-SA-05",
      name: "Security Measures and Breach Notification",
      description: "Implement appropriate security safeguards and notify NDMO and affected individuals of data breaches.",
      category: "incident-management",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement appropriate technical and organizational measures to protect personal data considering: the nature of data, processing methods, and risk levels. Notify NDMO of any personal data breach within 72 hours of becoming aware of it (or immediately if high risk). If the breach poses a high risk to data subjects, notify them without undue delay. The notification must include: nature of breach, affected data categories, number of affected individuals, potential consequences, and measures taken. Maintain a breach register. [Ref: PDPL Articles 20, 30; Amending Law M/148/2023; NDMO Breach Regulations]",
      checks: [
        { id: "PDPL-SA-05-C1", description: "Security measures documented and risk-assessed", status: "not-implemented" },
        { id: "PDPL-SA-05-C2", description: "NDMO notification within 72 hours", status: "not-implemented" },
        { id: "PDPL-SA-05-C3", description: "Individual notification for high-risk breaches", status: "not-implemented" },
        { id: "PDPL-SA-05-C4", description: "Breach register maintained", status: "not-implemented" },
      ],
    },

    // --- NDMO Registration & Oversight ---

    {
      id: "PDPL-SA-06",
      name: "NDMO Registration and Compliance",
      description: "Register with NDMO as required and comply with NDMO oversight obligations.",
      category: "privacy-governance",
      framework: "PDPL-SA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Register with the National Data Management Office (NDMO) when required by regulation. Appoint a Data Protection Officer to liaise with NDMO. Maintain records of processing activities. Cooperate with NDMO audits and investigations. Implement NDMO-issued guidelines and policies. Submit annual compliance reports if required. For government entities, comply with NDMO National Data Governance policies. [Ref: PDPL Article 40; Amending Law M/148/2023; NDMO National Data Governance Interim Regulations]",
      checks: [
        { id: "PDPL-SA-06-C1", description: "NDMO registration completed where required", status: "not-implemented" },
        { id: "PDPL-SA-06-C2", description: "Processing records maintained for NDMO oversight", status: "not-implemented" },
        { id: "PDPL-SA-06-C3", description: "NDMO guidelines and policies implemented", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "sa-pdpl",
    name: "Saudi Arabia PDPL Pack (Royal Decree M/19 as amended M/148/2023)",
    description: "Comprehensive Saudi PDPL controls: consent and legal basis (Art. 5-9), Arabic privacy notice (Art. 8), data subject rights (Art. 16-18), data localization and cross-border transfer with NDMO approval (Art. 29), 72-hour breach notification (Art. 30), and NDMO registration and oversight (Art. 40).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PDPL-SA"],
  };
}
