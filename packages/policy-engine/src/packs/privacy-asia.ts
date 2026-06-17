import type { PolicyPack, Control } from "@greenarmor/ges-core";

// ============================================================
// SINGAPORE — PDPA (Personal Data Protection Act 2012, as amended 2020/2021)
// Regulator: Personal Data Protection Commission (PDPC)
// ============================================================

export function createSingaporePDPAPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "PDPA-SG-01",
      name: "Data Protection Officer (Singapore)",
      description: "Appoint a DPO and publish their contact information as required by PDPA.",
      category: "privacy-governance",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Appoint at least one DPO and make their business contact information publicly available on the organization's website. The DPO ensures PDPA compliance, handles complaints, and liaises with the PDPC. The DPO need not be a dedicated employee but must have sufficient knowledge and authority. [Ref: PDPA Section 11; PDPC Advisory Guidelines]",
      checks: [
        { id: "PDPA-SG-01-C1", description: "DPO appointed and contact information published", status: "not-implemented" },
        { id: "PDPA-SG-01-C2", description: "DPO responsibilities documented", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-02",
      name: "Consent Obligation",
      description: "Obtain clear, informed consent for collection, use, and disclosure of personal data.",
      category: "consent-management",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain consent that is: given for a purpose reasonably related to the purpose notified, clear and unambiguous, obtained by an affirmative act, and documented. Notify individuals of: purposes at the point of collection, expected processing, and right to withdraw consent. Do not require consent for collection/use/dissemination as a condition of providing a service unless necessary. [Ref: PDPA Section 13-15]",
      checks: [
        { id: "PDPA-SG-02-C1", description: "Consent obtained for each specific purpose", status: "not-implemented" },
        { id: "PDPA-SG-02-C2", description: "Purpose notification at point of collection", status: "not-implemented" },
        { id: "PDPA-SG-02-C3", description: "Consent records maintained", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-03",
      name: "Purpose Limitation",
      description: "Limit collection, use, and disclosure of personal data to purposes for which consent was obtained.",
      category: "consent-management",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Document purposes for each data collection. Only use data for consented purposes or purposes reasonably related to the original. Obtain new consent for new purposes. Implement technical controls preventing use beyond stated purposes. [Ref: PDPA Section 18]",
      checks: [
        { id: "PDPA-SG-03-C1", description: "Purposes documented per data collection", status: "not-implemented" },
        { id: "PDPA-SG-03-C2", description: "New consent obtained for new purposes", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-04",
      name: "Notification Obligation",
      description: "Inform individuals of the purposes for collection, use, or disclosure of personal data.",
      category: "privacy-governance",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Notify individuals at or before collection of: data items collected, purposes, expected disclosure recipients, and data retention. If data collected from third parties, notify within a reasonable time. Provide clear, plain-language notices accessible in relevant formats. [Ref: PDPA Section 20]",
      checks: [
        { id: "PDPA-SG-04-C1", description: "Collection notices provided at point of collection", status: "not-implemented" },
        { id: "PDPA-SG-04-C2", description: "Third-party data subjects notified", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-05",
      name: "Access and Correction Rights",
      description: "Provide individuals access to and correction of their personal data.",
      category: "data-subject-rights",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Respond to access requests within 30 days. Provide: personal data held, purposes, and disclosure info for past year. Respond to correction requests within 30 days. Correct data and notify recipients of corrections within a reasonable time. Charge reasonable fees for access if disclosed. [Ref: PDPA Section 21-22]",
      checks: [
        { id: "PDPA-SG-05-C1", description: "Access request process within 30 days", status: "not-implemented" },
        { id: "PDPA-SG-05-C2", description: "Correction request process within 30 days", status: "not-implemented" },
        { id: "PDPA-SG-05-C3", description: "Correction recipients notified", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-06",
      name: "Accuracy Obligation",
      description: "Ensure personal data is accurate and complete before use or disclosure.",
      category: "data-inventory",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Implement reasonable steps to ensure data accuracy before use/disclosure. Consider: data source reliability, purpose of use, potential impact on individuals. Provide self-service correction mechanisms. Verify data at collection. [Ref: PDPA Section 23]",
      checks: [
        { id: "PDPA-SG-06-C1", description: "Accuracy verification procedures implemented", status: "not-implemented" },
        { id: "PDPA-SG-06-C2", description: "Self-service correction available", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-07",
      name: "Protection Obligation",
      description: "Implement reasonable security arrangements to protect personal data.",
      category: "security-controls",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement reasonable security arrangements considering: nature of data, impact of breach, format (physical/electronic), and cost. Include: access controls, encryption, network security, data minimization, endpoint protection, and incident response. Follow PDPC's Guide to Data Protection Practices for ICT Systems. [Ref: PDPA Section 24; PDPC Security Guidelines]",
      checks: [
        { id: "PDPA-SG-07-C1", description: "Security arrangements documented and risk-assessed", status: "not-implemented" },
        { id: "PDPA-SG-07-C2", description: "Access controls and encryption implemented", status: "not-implemented" },
        { id: "PDPA-SG-07-C3", description: "PDPC ICT security guidelines followed", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-08",
      name: "Retention Limitation",
      description: "Cease retention of personal data when no longer needed for business or legal purposes.",
      category: "data-retention",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define and document retention periods. Cease retention when: purpose is fulfilled, consent withdrawn, or no business/legal need. Implement automated deletion or anonymisation. Review retention schedules annually. Document disposal methods. [Ref: PDPA Section 25]",
      checks: [
        { id: "PDPA-SG-08-C1", description: "Retention periods defined and documented", status: "not-implemented" },
        { id: "PDPA-SG-08-C2", description: "Automated deletion/anonymisation implemented", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-09",
      name: "Transfer Limitation",
      description: "Ensure comparable protection for personal data transferred outside Singapore.",
      category: "cross-border-transfers",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Ensure overseas recipients are bound by legally enforceable obligations providing a standard of protection comparable to PDPA. Use contractual clauses, BCRs, or certifications. Conduct transfer assessments. Document transfer mechanisms per recipient. [Ref: PDPA Section 26; PDPC Transfer Limitation Guidelines]",
      checks: [
        { id: "PDPA-SG-09-C1", description: "Legally enforceable transfer mechanisms in place", status: "not-implemented" },
        { id: "PDPA-SG-09-C2", description: "Comparable protection assessment documented", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-10",
      name: "Data Breach Notification (PDPA Amendment 2021)",
      description: "Notify PDPC and affected individuals of notifiable data breaches within 3 calendar days.",
      category: "incident-management",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Assess breaches for notifiability (significant scale: 500+ individuals, or significant harm). Notify PDPC within 3 calendar days of assessing a breach as notifiable. Notify affected individuals if significant harm is likely. Maintain a breach register. Document assessment rationale. [Ref: PDPA Section 26B-26E; PDPC Breach Notification Guidelines]",
      checks: [
        { id: "PDPA-SG-10-C1", description: "Breach notifiability assessment procedure", status: "not-implemented" },
        { id: "PDPA-SG-10-C2", description: "PDPC notification within 3 calendar days", status: "not-implemented" },
        { id: "PDPA-SG-10-C3", description: "Individual notification for significant harm", status: "not-implemented" },
        { id: "PDPA-SG-10-C4", description: "Breach register maintained", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-11",
      name: "Data Portability (PDPA Amendment)",
      description: "Implement data portability allowing individuals to request data transmission to another organization.",
      category: "data-subject-rights",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Implement mechanisms for individuals to request personal data in a structured, commonly used, and machine-readable format. Enable direct transmission to another organization where technically feasible. Develop portability request handling procedures aligned with PDPC guidance. [Ref: PDPA Section 26F-26H]",
      checks: [
        { id: "PDPA-SG-11-C1", description: "Data portability request mechanism implemented", status: "not-implemented" },
        { id: "PDPA-SG-11-C2", description: "Machine-readable export format available", status: "not-implemented" },
      ],
    },
    {
      id: "PDPA-SG-12",
      name: "Do Not Call Registry",
      description: "Comply with DNC registry requirements for telemarketing communications.",
      category: "consent-management",
      framework: "PDPA-SG",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Check Singapore DNC registry before sending marketing messages to Singapore phone numbers (voice, text, fax). Maintain clear, written consent for telemarketing. Honor DNC registry entries and individual opt-outs. Appoint a DNC compliance officer. Maintain records of DNC checks. [Ref: PDPA Part IXA; DNC Registry Rules]",
      checks: [
        { id: "PDPA-SG-12-C1", description: "DNC registry checked before each telemarketing campaign", status: "not-implemented" },
        { id: "PDPA-SG-12-C2", description: "Clear, written telemarketing consent maintained", status: "not-implemented" },
        { id: "PDPA-SG-12-C3", description: "Opt-out requests honored within 21 days", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "sg-pdpa",
    name: "Singapore PDPA Pack (2020/2021 Amendments)",
    description: "Comprehensive Singapore PDPA controls covering all obligations: DPO appointment, consent, purpose limitation, notification, access/correction, accuracy, protection, retention, transfer limitation, data breach notification (3-day PDPC), data portability, and Do Not Call registry compliance.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PDPA-SG"],
  };
}

// ============================================================
// PHILIPPINES — DATA PRIVACY ACT OF 2012 (DPA)
// Regulator: National Privacy Commission (NPC)
// Implementing Rules: NPC Circular 16-03, 17-01, 18-01, 19-01, 20-04
// ============================================================

export function createPhilippinesDPAPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "DPA-PH-01",
      name: "PIC and PIP Designation",
      description: "Designate Personal Information Controller (PIC) and Personal Information Processor (PIP) roles.",
      category: "privacy-governance",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Designate and document PIC (determines purposes and means) and PIP (processes on behalf of PIC) roles. The PIC is accountable for compliance. Ensure PIC-PIP contracts clearly define obligations per DPA. Document the accountability chain for all processing. [Ref: DPA Section 3; IRR Article 4]",
      checks: [
        { id: "DPA-PH-01-C1", description: "PIC and PIP roles documented for each processing", status: "not-implemented" },
        { id: "DPA-PH-01-C2", description: "PIC-PIP contracts executed with DPA obligations", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-02",
      name: "Data Protection Officer (Philippines)",
      description: "Designate a DPO and register with the NPC.",
      category: "privacy-governance",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Designate a DPO who shall: ensure compliance, advise on DPIAs, cooperate with NPC, and serve as contact for data subjects. Register the DPO with the NPC. The DPO should have sufficient knowledge of the DPA and IRR. [Ref: DPA Section 11; IRR Article 7; NPC Circular 17-01]",
      checks: [
        { id: "DPA-PH-02-C1", description: "DPO designated and registered with NPC", status: "not-implemented" },
        { id: "DPA-PH-02-C2", description: "DPO responsibilities documented", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-03",
      name: "NPC Registration",
      description: "Register personal data processing systems with the NPC if processing 1,000+ records.",
      category: "privacy-governance",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Register with the NPC if processing personal data of 1,000 or more individuals. Submit registration forms including: PIC details, DPO information, processing system descriptions, and data categories. Renew registration annually. Update within 30 days of material changes. [Ref: NPC Circular 17-01; DPA IRR Article 7]",
      checks: [
        { id: "DPA-PH-03-C1", description: "NPC registration completed if applicable", status: "not-implemented" },
        { id: "DPA-PH-03-C2", description: "Annual renewal process established", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-04",
      name: "Criteria for Lawful Processing",
      description: "Document the lawful criteria for processing personal data and sensitive personal information.",
      category: "consent-management",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "For personal data, establish criteria: consent, contract, legal obligation, vital interests, public interest, or legitimate interests. For sensitive personal information (race, marital status, age, color, religious/philosophical/political affiliations, health, education, genetics, sexual life, SSN, licenses). Obtain specific, affirmed consent for SPI. [Ref: DPA Sections 12-13]",
      checks: [
        { id: "DPA-PH-04-C1", description: "Lawful criteria documented per processing", status: "not-implemented" },
        { id: "DPA-PH-04-C2", description: "Specific consent for sensitive personal information", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-05",
      name: "Data Subject Rights (Philippines)",
      description: "Implement DPA data subject rights including bequeathal rights for deceased persons.",
      category: "data-subject-rights",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement rights: information to data subject, right to object, right to access, right to rectification, right to erasure/blocking, right to data portability, and right to damages. Honor bequeathal rights (rights of heirs of deceased). Respond within a reasonable time. Provide mechanisms for filing complaints. [Ref: DPA Sections 16-18]",
      checks: [
        { id: "DPA-PH-05-C1", description: "All DPA rights implemented with request mechanisms", status: "not-implemented" },
        { id: "DPA-PH-05-C2", description: "Bequeathal rights procedure documented", status: "not-implemented" },
        { id: "DPA-PH-05-C3", description: "Complaint filing mechanism available", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-06",
      name: "Security Measures (NPC Circular 16-03)",
      description: "Implement physical, organizational, and technical security measures per NPC Circular 16-03.",
      category: "security-controls",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement: organizational security (data protection policies, access control policies, data mapping), physical security (facility access controls, environmental controls), and technical security (authentication, encryption, network security, logging). Appoint Information Security Officer (can be DPO). Conduct annual security reviews. [Ref: NPC Circular 16-03 Part 3-5]",
      checks: [
        { id: "DPA-PH-06-C1", description: "Organizational security measures documented", status: "not-implemented" },
        { id: "DPA-PH-06-C2", description: "Physical security measures implemented", status: "not-implemented" },
        { id: "DPA-PH-06-C3", description: "Technical security measures implemented", status: "not-implemented" },
        { id: "DPA-PH-06-C4", description: "Annual security review conducted", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-07",
      name: "Privacy Impact Assessment",
      description: "Conduct Privacy Impact Assessments (PIAs) for processing systems and new projects.",
      category: "privacy-governance",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct PIAs for: new processing systems, significant changes to existing systems, automated processing/profiling, processing of sensitive personal information, and large-scale processing. Document: processing description, necessity, risks, mitigation. Submit PIAs to NPC if requested. Review annually. [Ref: DPA IRR Article 8; NPC PIA Guidelines]",
      checks: [
        { id: "DPA-PH-07-C1", description: "PIA criteria established for new/changed processing", status: "not-implemented" },
        { id: "DPA-PH-07-C2", description: "PIAs documented with risk assessments", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-08",
      name: "NPC Breach Notification",
      description: "Report personal data breaches to the NPC within 72 hours and notify affected individuals.",
      category: "incident-management",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Notify NPC within 72 hours of knowledge of breach involving sensitive personal information or affecting 100+ individuals. Include: breach nature, data involved, date/time, circumstances, mitigation. Notify affected individuals within a reasonable time. Document all breaches. [Ref: NPC Circular 16-03 Section 9; DPA IRR Article 9]",
      checks: [
        { id: "DPA-PH-08-C1", description: "NPC 72-hour breach notification procedure", status: "not-implemented" },
        { id: "DPA-PH-08-C2", description: "Individual notification procedures", status: "not-implemented" },
        { id: "DPA-PH-08-C3", description: "Breach register maintained", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-09",
      name: "Data Sharing and Outsourcing",
      description: "Ensure lawful data sharing and outsourcing of personal data processing.",
      category: "vendor-management",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute data sharing agreements with PICs containing: purpose, data categories, security measures, data subject rights, and termination conditions. For outsourcing to PIPs, ensure contracts specify: processing scope, security obligations, sub-processor controls, and data return/deletion. [Ref: DPA Sections 20, 32-36; IRR Articles 21, 28]",
      checks: [
        { id: "DPA-PH-09-C1", description: "Data sharing agreements with PICs executed", status: "not-implemented" },
        { id: "DPA-PH-09-C2", description: "Outsourcing contracts with PIPs executed", status: "not-implemented" },
      ],
    },
    {
      id: "DPA-PH-10",
      name: "Cross-Border Transfers (Philippines)",
      description: "Ensure appropriate safeguards for international transfers of personal data.",
      category: "cross-border-transfers",
      framework: "DPA-PH",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Ensure overseas recipients provide a level of protection comparable to the DPA. Use contractual safeguards or adequate country transfers. Inform data subjects of cross-border transfers. Document transfer mechanisms. Conduct transfer risk assessments. [Ref: DPA Section 21; IRR Article 27]",
      checks: [
        { id: "DPA-PH-10-C1", description: "Cross-border transfer safeguards documented", status: "not-implemented" },
        { id: "DPA-PH-10-C2", description: "Comparable protection ensured", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "ph-dpa",
    name: "Philippines Data Privacy Act Pack (DPA 2012 + IRR)",
    description: "Comprehensive Philippine DPA controls: PIC/PIP roles, NPC registration (1,000+ records), DPO appointment, lawful processing criteria, data subject rights (including bequeathal), NPC Circular 16-03 security measures, PIAs, 72-hour NPC breach notification, and data sharing/outsourcing agreements.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application", "government-system"],
    controls,
    frameworks: ["DPA-PH"],
  };
}

// ============================================================
// JAPAN — APPI (Act on the Protection of Personal Information)
// Amended 2022; Regulator: Personal Information Protection Commission (PPC)
// ============================================================

export function createJapanAPPIPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "APPI-01",
      name: "Purpose of Use Specification",
      description: "Specify the purpose of use for personal information and publicly announce or notify it.",
      category: "consent-management",
      framework: "APPI",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Specify the purpose of use as specifically as possible. Ensure purposes are not improperly associated with the individual. Publish purposes on the website or notify data subjects directly. Obtain consent before changing the purpose beyond the reasonable scope of the original. [Ref: APPI Article 17]",
      checks: [
        { id: "APPI-01-C1", description: "Purpose of use specified for each data category", status: "not-implemented" },
        { id: "APPI-01-C2", description: "Purposes published or notified to data subjects", status: "not-implemented" },
        { id: "APPI-01-C3", description: "Purpose change consent obtained", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-02",
      name: "Proper Acquisition",
      description: "Acquire personal information by lawful and fair means, not by deceptive means.",
      category: "consent-management",
      framework: "APPI",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Acquire data by lawful and fair means. For sensitive personal information (race, creed, social status, medical history, criminal record, crime victim, etc.), obtain consent unless an exception applies. Notify or publish the purpose when acquiring sensitive data. [Ref: APPI Article 18-19]",
      checks: [
        { id: "APPI-02-C1", description: "Data acquisition methods reviewed for lawfulness", status: "not-implemented" },
        { id: "APPI-02-C2", description: "Consent obtained for sensitive personal information", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-03",
      name: "Security Control Measures",
      description: "Implement security control measures to prevent leakage, loss, or damage of personal data.",
      category: "security-controls",
      framework: "APPI",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement organizational (policies, personnel training), personnel (agreements, access control), physical (facility access, equipment management), and technical (access control, encryption, intrusion detection) security measures. Follow PPC Basic Policy and guidelines. Conduct regular audits. [Ref: APPI Article 23; PPC Guidelines]",
      checks: [
        { id: "APPI-03-C1", description: "Organizational and personnel security measures implemented", status: "not-implemented" },
        { id: "APPI-03-C2", description: "Physical and technical security measures implemented", status: "not-implemented" },
        { id: "APPI-03-C3", description: "Regular security audits conducted", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-04",
      name: "Outsourcing Supervision",
      description: "Exercise necessary and appropriate supervision over personal data processing outsourced to contractors.",
      category: "vendor-management",
      framework: "APPI",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Select qualified contractors. Execute written outsourcing contracts specifying: purpose of use, security measures, sub-contractor restrictions, and data handling. Conduct regular assessments of contractor compliance. Supervise implementation. [Ref: APPI Article 22]",
      checks: [
        { id: "APPI-04-C1", description: "Outsourcing contracts executed with required clauses", status: "not-implemented" },
        { id: "APPI-04-C2", description: "Regular contractor compliance assessments", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-05",
      name: "Third-Party Provision Restriction",
      description: "Obtain consent before providing personal data to third parties, with limited exceptions.",
      category: "consent-management",
      framework: "APPI",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Obtain prior consent for third-party provision unless an exception applies. When providing to third parties, record: recipient, data items, and date. When receiving data from third parties, verify the acquisition circumstances. Maintain an opt-out mechanism with PPC notification. [Ref: APPI Articles 27-28]",
      checks: [
        { id: "APPI-05-C1", description: "Consent obtained before third-party provision", status: "not-implemented" },
        { id: "APPI-05-C2", description: "Provision records maintained", status: "not-implemented" },
        { id: "APPI-05-C3", description: "Opt-out mechanism with PPC notification", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-06",
      name: "Cross-Border Transfer Requirements",
      description: "Obtain prior consent for providing personal data to third parties in foreign countries.",
      category: "cross-border-transfers",
      framework: "APPI",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain prior consent for cross-border transfers to countries without equivalent protection. Inform data subjects of: destination country, recipient information, and data categories. Transfers to countries with equivalent protection (currently not recognized by PPC) or under adequate exceptions do not require consent. [Ref: APPI Article 28]",
      checks: [
        { id: "APPI-06-C1", description: "Prior consent obtained for cross-border transfers", status: "not-implemented" },
        { id: "APPI-06-C2", description: "Transfer information provided to data subjects", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-07",
      name: "Individual Rights (Disclosure, Correction, Suspension)",
      description: "Implement rights to disclosure, correction, and suspension of use of personal data.",
      category: "data-subject-rights",
      framework: "APPI",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement: right to request disclosure of retained personal data, right to request correction/addition/deletion (with proof), and right to request suspension of use/third-party provision. Respond within set periods (disclosure: prompt, correction: 2 weeks). Document reasons for refusal if applicable. [Ref: APPI Articles 32-37]",
      checks: [
        { id: "APPI-07-C1", description: "Disclosure request mechanism implemented", status: "not-implemented" },
        { id: "APPI-07-C2", description: "Correction/addition/deletion request mechanism", status: "not-implemented" },
        { id: "APPI-07-C3", description: "Suspension of use/provision request mechanism", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-08",
      name: "Personal Data Breach Notification (PPC)",
      description: "Notify PPC and affected individuals of personal data breaches meeting threshold.",
      category: "incident-management",
      framework: "APPI",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Report breaches to PPC promptly when involving sensitive information or potentially causing financial damage, or when affecting 1,000+ individuals. Report within 3-5 days ideally. Include: incident facts, data items, cause, damage, countermeasures. Notify affected individuals for breaches likely to cause damage. [Ref: APPI Article 26; PPC Breach Reporting Guidelines]",
      checks: [
        { id: "APPI-08-C1", description: "PPC breach notification procedure for threshold breaches", status: "not-implemented" },
        { id: "APPI-08-C2", description: "Individual notification for harmful breaches", status: "not-implemented" },
        { id: "APPI-08-C3", description: "Breach records maintained", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-09",
      name: "Personal Information Protection Officer",
      description: "Designate a Personal Information Protection Officer and establish internal structures.",
      category: "privacy-governance",
      framework: "APPI",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Designate a person responsible for personal information protection. Establish contact point for individual requests and complaints. Maintain a description of personal data processing. Provide training to employees handling personal data. [Ref: APPI Article 25; PPC Management Guidelines]",
      checks: [
        { id: "APPI-09-C1", description: "Protection officer designated and documented", status: "not-implemented" },
        { id: "APPI-09-C2", description: "Internal request/complaint handling structure", status: "not-implemented" },
      ],
    },
    {
      id: "APPI-10",
      name: "Anonymously Processed Information",
      description: "Comply with APPA requirements when creating and providing anonymously processed information.",
      category: "data-inventory",
      framework: "APPI",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "When creating anonymously processed data: delete or alter descriptions that identify individuals, prevent re-identification. Document anonymisation methods. When providing, conduct appropriate checks. Avoid combining with other data that could re-identify individuals. [Ref: APPI Articles 36-38]",
      checks: [
        { id: "APPI-10-C1", description: "Anonymisation procedures documented", status: "not-implemented" },
        { id: "APPI-10-C2", description: "Re-identification risk assessed", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "jp-appi",
    name: "Japan APPI Pack (2022 Amendment)",
    description: "Comprehensive Japan Act on the Protection of Personal Information controls: purpose specification, proper acquisition, security control measures, outsourcing supervision, third-party provision, cross-border transfer consent, individual rights (disclosure/correction/suspension), PPC breach notification, and anonymously processed information.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["APPI"],
  };
}

// ============================================================
// SOUTH KOREA — PIPA (Personal Information Protection Act, amended 2023)
// Regulator: Personal Information Protection Commission (PIPC)
// ============================================================

export function createSouthKoreaPIPAPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "PIPA-01",
      name: "Personal Information Processing Policy (공개)",
      description: "Draft, publish, and maintain a personal information processing policy in Korean.",
      category: "privacy-governance",
      framework: "PIPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Publish a privacy policy including: items collected, purpose, retention/use period, third-party provision, outsourcing, cross-border transfer, data subject rights, and DPO contact. Publish on website homepage. Use plain Korean language. Review and update annually. [Ref: PIPA Article 17]",
      checks: [
        { id: "PIPA-01-C1", description: "Privacy policy published in Korean on homepage", status: "not-implemented" },
        { id: "PIPA-01-C2", description: "All PIPA-required items included", status: "not-implemented" },
        { id: "PIPA-01-C3", description: "Annual review documented", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-02",
      name: "Separate Consent Requirements",
      description: "Obtain separate consent for each purpose, sensitive data, third-party provision, and cross-border transfers.",
      category: "consent-management",
      framework: "PIPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain separate consent for: each processing purpose, sensitive information (ideology, creed, union membership, political opinions, health, sexual life, biometric, criminal records), unique identifiers (RRN, passport), third-party provision, and cross-border transfers. Use non-pre-checked boxes. Provide opt-out mechanisms. [Ref: PIPA Articles 17, 23, 24, 28]",
      checks: [
        { id: "PIPA-02-C1", description: "Separate consent per purpose, sensitive data, third-party, and transfer", status: "not-implemented" },
        { id: "PIPA-02-C2", description: "Non-pre-checked boxes used", status: "not-implemented" },
        { id: "PIPA-02-C3", description: "Consent withdrawal mechanisms available", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-03",
      name: "Privacy Impact Assessment",
      description: "Conduct PIAs for processing likely to infringe on privacy rights.",
      category: "privacy-governance",
      framework: "PIPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct PIAs for: public agencies processing personal information, large-scale processing, sensitive information processing, new technologies (AI, IoT), and systematic profiling. Submit PIA results to PIPC if public sector. Implement mitigation measures. Review periodically. [Ref: PIPA Article 33; PIPA Enforcement Decree Article 25]",
      checks: [
        { id: "PIPA-03-C1", description: "PIA criteria established", status: "not-implemented" },
        { id: "PIPA-03-C2", description: "PIAs conducted and documented", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-04",
      name: "Data Protection Officer (Korea)",
      description: "Designate a Chief Privacy Officer (CPO) if required by scale thresholds.",
      category: "privacy-governance",
      framework: "PIPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Designate a CPO if processing personal information of 10,000+ data subjects (public), 10,000+ (private with 50+ employees), or 1,000+ sensitive information. CPO must: establish privacy policies, conduct audits, handle complaints, liaise with PIPC. Register CPO with PIPC. [Ref: PIPA Article 30]",
      checks: [
        { id: "PIPA-04-C1", description: "CPO designated if threshold met", status: "not-implemented" },
        { id: "PIPA-04-C2", description: "CPO registered with PIPC", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-05",
      name: "Security Measures (Technical, Physical, Administrative)",
      description: "Implement technical, physical, and administrative security measures for personal information.",
      category: "security-controls",
      framework: "PIPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Technical: access control, encryption, security programs. Physical: access control to processing facilities, document security. Administrative: internal policies, employee training, access privilege management, regular audits. Special measures for unique identifiers (RRN). Maintain security measure documentation. [Ref: PIPA Article 29; Enforcement Rule Article 14]",
      checks: [
        { id: "PIPA-05-C1", description: "Technical security measures implemented and documented", status: "not-implemented" },
        { id: "PIPA-05-C2", description: "Physical security measures implemented", status: "not-implemented" },
        { id: "PIPA-05-C3", description: "Administrative security measures implemented", status: "not-implemented" },
        { id: "PIPA-05-C4", description: "Special RRN protection measures", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-06",
      name: "KISA/PIPC Breach Notification",
      description: "Notify PIPC/KISA and affected individuals of personal data breaches without delay.",
      category: "incident-management",
      framework: "PIPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Notify PIPC without delay when breach involves: personal information of 1,000+ subjects, sensitive information, or RRN. Notify affected individuals when breach is likely to cause harm. Include: items leaked, time/place, countermeasures, damage mitigation. Submit written report within 5 days. [Ref: PIPA Article 34]",
      checks: [
        { id: "PIPA-06-C1", description: "PIPC notification procedure for threshold breaches", status: "not-implemented" },
        { id: "PIPA-06-C2", description: "Individual notification for harmful breaches", status: "not-implemented" },
        { id: "PIPA-06-C3", description: "Written report within 5 days", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-07",
      name: "Data Subject Rights (Korea)",
      description: "Implement PIPA data subject rights including reading and suspension requests.",
      category: "data-subject-rights",
      framework: "PIPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement: access to personal information, suspension of processing, correction/deletion, and deletion of consented data. Respond within 10-15 days. Provide reasons for refusal if applicable. Implement digital request mechanisms. Ensure portability of personal information. [Ref: PIPA Articles 35-38]",
      checks: [
        { id: "PIPA-07-C1", description: "All PIPA rights implemented", status: "not-implemented" },
        { id: "PIPA-07-C2", description: "Response within 10-15 days", status: "not-implemented" },
        { id: "PIPA-07-C3", description: "Suspension of processing mechanism available", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-08",
      name: "Resident Registration Number (RRN) Protection",
      description: "Implement special protections for Resident Registration Numbers and other unique identifiers.",
      category: "security-controls",
      framework: "PIPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Do not collect RRN unless specifically permitted by law. Store RRN encrypted with strong key management. Limit access to authorized personnel only. Implement audit logging for all RRN access. Never use RRN for identification beyond legally permitted purposes. Delete RRN when purpose is fulfilled. [Ref: PIPA Article 24; PIPA Enforcement Decree Article 19]",
      checks: [
        { id: "PIPA-08-C1", description: "RRN collection limited to legally permitted purposes", status: "not-implemented" },
        { id: "PIPA-08-C2", description: "RRN encrypted with strong key management", status: "not-implemented" },
        { id: "PIPA-08-C3", description: "RRN access audit logging implemented", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-09",
      name: "Cross-Border Transfer (Korea)",
      description: "Obtain separate consent and document safeguards for cross-border personal data transfers.",
      category: "cross-border-transfers",
      framework: "PIPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Obtain separate consent for cross-border transfers specifying: destination country, recipient, purpose, data items, retention period. Implement safeguards (contracts, equivalent protection). Allow withdrawal of consent. Document transfer register. [Ref: PIPA Article 28]",
      checks: [
        { id: "PIPA-09-C1", description: "Separate consent for cross-border transfers", status: "not-implemented" },
        { id: "PIPA-09-C2", description: "Transfer register maintained", status: "not-implemented" },
      ],
    },
    {
      id: "PIPA-10",
      name: "Outsourcing Management",
      description: "Execute contracts with outsourced processors and maintain an outsourcing register.",
      category: "vendor-management",
      framework: "PIPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute contracts with processors specifying: processing scope, security measures, sub-contractor restrictions, and data handling. Maintain an outsourcing register published on the website. Conduct periodic assessments. Notify data subjects of outsourcing. [Ref: PIPA Article 27]",
      checks: [
        { id: "PIPA-10-C1", description: "Outsourcing contracts executed", status: "not-implemented" },
        { id: "PIPA-10-C2", description: "Outsourcing register published", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "kr-pipa",
    name: "South Korea PIPA Pack (2023 Amendment)",
    description: "Comprehensive South Korea PIPA controls: privacy policy publication, separate consent requirements, PIA, CPO designation, three-tier security measures, RRN protection, KISA/PIPC breach notification, data subject rights, cross-border transfers, and outsourcing management.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PIPA"],
  };
}

// ============================================================
// CHINA — PIPL (Personal Information Protection Law, effective Nov 1, 2021)
// Regulator: Cyberspace Administration of China (CAC)
// ============================================================

export function createChinaPIPLPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "PIPL-01",
      name: "Legal Basis and Consent",
      description: "Identify legal basis and obtain valid consent for personal information processing.",
      category: "consent-management",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Obtain consent that is: freely given, informed, voluntary, and clear. Alternatively, process based on: contract performance, legal obligations, public health, news reporting, or legally permitted circumstances. Consent must be for specific purposes, with clear affirmative action. Single consent cannot bundle multiple purposes. [Ref: PIPL Articles 13-14]",
      checks: [
        { id: "PIPL-01-C1", description: "Legal basis documented per processing activity", status: "not-implemented" },
        { id: "PIPL-01-C2", description: "Consent is freely given, informed, voluntary, clear", status: "not-implemented" },
        { id: "PIPL-01-C3", description: "No bundled consent for multiple purposes", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-02",
      name: "Privacy Policy (Chinese Language)",
      description: "Publish a comprehensive privacy policy in clear, plain Chinese language.",
      category: "privacy-governance",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Publish privacy policy including: handler identity, contact person, processing purposes/methods, data categories, retention, data subject rights, and mechanisms. Use clear, plain Chinese. Display prominently. Make it accessible, easy to read, and convenient to save. [Ref: PIPL Article 17]",
      checks: [
        { id: "PIPL-02-C1", description: "Privacy policy published in Chinese with all required items", status: "not-implemented" },
        { id: "PIPL-02-C2", description: "Policy displayed prominently and accessible", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-03",
      name: "Sensitive Personal Information Controls",
      description: "Obtain separate consent and implement stricter controls for sensitive personal information.",
      category: "consent-management",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Sensitive PI includes: biometrics, religious beliefs, specific identity, medical health, financial accounts, location tracking, minors under 14. Obtain separate consent with necessity explanation. Implement stricter access controls and encryption. Conduct PIPIA (Personal Information Protection Impact Assessment). Minimize collection. [Ref: PIPL Articles 28-32]",
      checks: [
        { id: "PIPL-03-C1", description: "Sensitive PI identified and classified", status: "not-implemented" },
        { id: "PIPL-03-C2", description: "Separate consent with necessity explanation", status: "not-implemented" },
        { id: "PIPL-03-C3", description: "Stricter security controls for sensitive PI", status: "not-implemented" },
        { id: "PIPL-03-C4", description: "PIPIA conducted for sensitive data processing", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-04",
      name: "Data Localization",
      description: "Store personal information of Chinese residents within mainland China when required.",
      category: "cross-border-transfers",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Store PI within China for: Critical Information Infrastructure Operators (CIIO), and handlers processing PI of 1,000,000+ individuals or transferring 100,000+ non-sensitive or 10,000+ sensitive PI abroad. Implement technical controls ensuring affected data remains within China. [Ref: PIPL Article 40; Data Export Security Assessment Measures]",
      checks: [
        { id: "PIPL-04-C1", description: "Data localization thresholds assessed", status: "not-implemented" },
        { id: "PIPL-04-C2", description: "Technical controls enforce China data residency", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-05",
      name: "CAC Cross-Border Transfer Assessment",
      description: "Complete required CAC assessments before transferring personal information abroad.",
      category: "cross-border-transfers",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Complete: CAC Security Assessment for large-scale transfers, CAC Standard Contract filing, or CAC certification. Obtain separate informed consent from individuals. Inform: purpose, recipient, data items, retention, rights. Conduct PIPIA before transfer. Maintain transfer records. [Ref: PIPL Article 38-39; CAC Standard Contract Measures]",
      checks: [
        { id: "PIPL-05-C1", description: "Appropriate CAC mechanism completed (assessment/contract/certification)", status: "not-implemented" },
        { id: "PIPL-05-C2", description: "Separate consent from individuals obtained", status: "not-implemented" },
        { id: "PIPL-05-C3", description: "PIPIA conducted before transfer", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-06",
      name: "PIPL Individual Rights",
      description: "Implement all PIPL data subject rights including right to refuse profiling.",
      category: "data-subject-rights",
      framework: "PIPL",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement rights: know/access, copy, correct, delete, restrict, portability, explain/refuse automated decisions, withdraw consent, delete deceased user's data. Respond within 15 working days. Provide clear mechanisms. Do not refuse on technical grounds. [Ref: PIPL Articles 44-49]",
      checks: [
        { id: "PIPL-06-C1", description: "All PIPL rights implemented", status: "not-implemented" },
        { id: "PIPL-06-C2", description: "Automated decision explanation and refusal", status: "not-implemented" },
        { id: "PIPL-06-C3", description: "Responses within 15 working days", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-07",
      name: "Personal Information Protection Impact Assessment (PIPIA)",
      description: "Conduct PIPIA before high-risk processing activities.",
      category: "privacy-governance",
      framework: "PIPL",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct PIPIA for: sensitive PI, automated decision-making/profiling, entrusting/outsourcing, public disclosure, cross-border transfers. Document: processing purpose, necessity, impact assessment, risk mitigation. PIPIA records kept for at least 3 years. [Ref: PIPL Article 55-56]",
      checks: [
        { id: "PIPL-07-C1", description: "PIPIA criteria established for triggering activities", status: "not-implemented" },
        { id: "PIPL-07-C2", description: "PIPIA records maintained for 3+ years", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-08",
      name: "Automated Decision-Making Controls",
      description: "Implement safeguards for automated decisions, profiling, and algorithmic recommendations.",
      category: "data-subject-rights",
      framework: "PIPL",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide transparency about automated decisions. Do not use automated decisions that produce unreasonable differential treatment. Provide opt-out and explanation mechanisms. Ensure decisions do not discriminate based on personal characteristics. [Ref: PIPL Article 24; Algorithm Recommendation Management Provisions]",
      checks: [
        { id: "PIPL-08-C1", description: "Automated decision transparency implemented", status: "not-implemented" },
        { id: "PIPL-08-C2", description: "Opt-out and explanation available", status: "not-implemented" },
        { id: "PIPL-08-C3", description: "Non-discrimination safeguards in place", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-09",
      name: "Personal Information Handler Representative",
      description: "Designate a person in charge of personal information protection.",
      category: "privacy-governance",
      framework: "PIPL",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Designate a person responsible for personal information protection. Publicize their name and contact information. Establish a dedicated department or designate personnel for large-scale processing. [Ref: PIPL Article 52]",
      checks: [
        { id: "PIPL-09-C1", description: "Protection representative designated", status: "not-implemented" },
        { id: "PIPL-09-C2", description: "Contact information publicized", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-10",
      name: "Children's Personal Information (Under 14)",
      description: "Implement special protections for minors under 14 as sensitive personal information.",
      category: "consent-management",
      framework: "PIPL",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Treat children's PI as sensitive. Obtain consent from guardian. Create a dedicated handler rule for minors' data. Appoint a person responsible for children's PI. Minimize collection. Do not target children with profiling or behavioral advertising. [Ref: PIPL Article 31; Children's PI Network Protection Provisions]",
      checks: [
        { id: "PIPL-10-C1", description: "Guardian consent obtained for minors under 14", status: "not-implemented" },
        { id: "PIPL-10-C2", description: "Dedicated children's PI handling rules established", status: "not-implemented" },
        { id: "PIPL-10-C3", description: "No behavioral advertising targeting minors", status: "not-implemented" },
      ],
    },
    {
      id: "PIPL-11",
      name: "Breach Notification (PIPL)",
      description: "Notify authorities and affected individuals of personal information security incidents.",
      category: "incident-management",
      framework: "PIPL",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Immediately take remedial measures for security incidents. Notify authorities and affected individuals when a leak/tampering/loss occurs or may cause harm. Include: type of data, cause, and harm. Maintain remedial measures and documentation. Report to CAC if required. [Ref: PIPL Article 57]",
      checks: [
        { id: "PIPL-11-C1", description: "Incident response and remedial procedures", status: "not-implemented" },
        { id: "PIPL-11-C2", description: "Authority notification for harmful incidents", status: "not-implemented" },
        { id: "PIPL-11-C3", description: "Individual notification with required details", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "cn-pipl",
    name: "China PIPL Pack (Effective Nov 2021)",
    description: "Comprehensive China PIPL controls: consent/legal basis, Chinese-language privacy policy, sensitive PI controls, data localization (CIIO/thresholds), CAC cross-border assessment (security/contract/certification), PIPIA, automated decision controls, children's protection (under 14), and breach notification.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["PIPL"],
  };
}

// ============================================================
// INDIA — DPDPA (Digital Personal Data Protection Act 2023)
// Regulator: Data Protection Board of India
// ============================================================

export function createIndiaDPDPAPolicyPack(): PolicyPack {
  const controls: Control[] = [
    {
      id: "DPDPA-01",
      name: "Consent Manager Framework",
      description: "Implement interoperable consent management through DPDP-approved Consent Manager platforms.",
      category: "consent-management",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Integrate with interoperable Consent Managers registered with the Data Protection Board. Consent must be: free, specific, informed, unconditional, unambiguous, and with clear affirmative action. Provide ability to withdraw consent through the same Consent Manager. Maintain verifiable consent records. [Ref: DPDPA Section 5-6]",
      checks: [
        { id: "DPDPA-01-C1", description: "Consent Manager integration implemented", status: "not-implemented" },
        { id: "DPDPA-01-C2", description: "Consent withdrawal via Consent Manager", status: "not-implemented" },
        { id: "DPDPA-01-C3", description: "Verifiable consent records maintained", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-02",
      name: "Notice Requirements",
      description: "Provide clear notices describing personal data processing in multiple languages.",
      category: "privacy-governance",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide notices in clear, plain language (English and Indian languages) containing: personal data items, processing purpose, data fiduciary rights, data principal rights, manner of withdrawal, grievance redressal mechanism. Notices must be available in specified languages. [Ref: DPDPA Section 5]",
      checks: [
        { id: "DPDPA-02-C1", description: "Notices provided in multiple languages", status: "not-implemented" },
        { id: "DPDPA-02-C2", description: "All required notice items included", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-03",
      name: "Data Principal Rights",
      description: "Implement DPDPA rights for data principals.",
      category: "data-subject-rights",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement: access to data summary, correction/erasure, grievance redressal, and nomination (rights after death/incapacity). Provide a dedicated grievance officer contact. Respond within prescribed timeframes. Do not charge fees for basic rights. [Ref: DPDPA Sections 11-14]",
      checks: [
        { id: "DPDPA-03-C1", description: "Access and correction mechanisms implemented", status: "not-implemented" },
        { id: "DPDPA-03-C2", description: "Grievance redressal officer designated", status: "not-implemented" },
        { id: "DPDPA-03-C3", description: "Nomination mechanism available", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-04",
      name: "Significant Data Fiduciary Obligations",
      description: "Comply with enhanced obligations if designated as a Significant Data Fiduciary (SDF).",
      category: "privacy-governance",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "If designated as SDF by the Central Government: appoint a DPO based in India, conduct DPIAs, conduct independent data audits, and implement additional measures. The DPO shall be responsible to the Board of Directors. Report DPIA results and audit findings. [Ref: DPDPA Section 10]",
      checks: [
        { id: "DPDPA-04-C1", description: "SDF status assessment documented", status: "not-implemented" },
        { id: "DPDPA-04-C2", description: "India-based DPO appointed if SDF", status: "not-implemented" },
        { id: "DPDPA-04-C3", description: "DPIAs and audits conducted if SDF", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-05",
      name: "Children's Data Protection",
      description: "Implement special protections for children's personal data (under 18).",
      category: "consent-management",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Obtain verifiable consent from a parent/guardian before processing children's data. Do not process children's data in a manner likely to cause detrimental effect on well-being. Do not track, target, or conduct behavioral monitoring of children or advertising aimed at children. [Ref: DPDPA Section 9]",
      checks: [
        { id: "DPDPA-05-C1", description: "Verifiable parental consent mechanism", status: "not-implemented" },
        { id: "DPDPA-05-C2", description: "No behavioral monitoring/targeting of children", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-06",
      name: "Breach Notification (DPDPA)",
      description: "Notify the Data Protection Board and affected individuals of personal data breaches.",
      category: "incident-management",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Notify the Data Protection Board of any personal data breach. Provide detailed description of: the breach, its extent, and mitigation measures. Notify affected individuals if the Board determines it necessary. Maintain breach documentation. Report within prescribed timelines. [Ref: DPDPA Section 8(6)]",
      checks: [
        { id: "DPDPA-06-C1", description: "Board notification procedure implemented", status: "not-implemented" },
        { id: "DPDPA-06-C2", description: "Individual notification when required", status: "not-implemented" },
        { id: "DPDPA-06-C3", description: "Breach register maintained", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-07",
      name: "Cross-Border Transfers (India)",
      description: "Ensure cross-border transfers comply with DPDPA transfer rules.",
      category: "cross-border-transfers",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Transfer personal data only to countries not on the negative list published by the Central Government. Ensure adequate level of data protection in destination country. Inform data principals of transfer arrangements. Maintain transfer documentation. [Ref: DPDPA Section 16]",
      checks: [
        { id: "DPDPA-07-C1", description: "Negative list checked before transfer", status: "not-implemented" },
        { id: "DPDPA-07-C2", description: "Adequate protection ensured", status: "not-implemented" },
      ],
    },
    {
      id: "DPDPA-08",
      name: "Exemptions for Legitimate Uses",
      description: "Document processing exemptions for voluntary provision, legitimate uses, and other exceptions.",
      category: "consent-management",
      framework: "DPDPA",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Document processing without consent for: voluntarily provided data (with notice), employment, medical emergency, disaster, lawful investigation, research/archives/statistical purposes, or other legitimate uses notified by the government. [Ref: DPDPA Section 7]",
      checks: [
        { id: "DPDPA-08-C1", description: "Legitimate use exemptions documented where applicable", status: "not-implemented" },
        { id: "DPDPA-08-C2", description: "Notice still provided for exempt processing", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "in-dpdpa",
    name: "India DPDPA Pack (2023)",
    description: "Comprehensive India Digital Personal Data Protection Act controls: Consent Manager framework, multi-language notices, data principal rights (incl. nomination), Significant Data Fiduciary obligations, children's protection (under 18), Data Protection Board breach notification, and cross-border transfer rules.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["DPDPA"],
  };
}
