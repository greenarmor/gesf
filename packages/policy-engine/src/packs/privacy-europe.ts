import type { PolicyPack, Control } from "@greenarmor/ges-core";

// ============================================================
// UK GDPR — UNITED KINGDOM GENERAL DATA PROTECTION REGULATION
// UK Data Protection Act 2018 + UK GDPR (retained EU law)
// ============================================================

export function createUKGDPRPolicyPack(): PolicyPack {
  const controls: Control[] = [

    // --- Registration & Accountability ---

    {
      id: "UK-GDPR-01",
      name: "ICO Registration",
      description: "Register with the UK Information Commissioner's Office (ICO) as a data controller or processor if required.",
      category: "privacy-governance",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Register with the ICO and pay the annual data protection fee if processing personal data (unless exempt). Maintain accurate registration entries describing processing purposes. Update registration when processing activities change. The ICO registration number must be available for inspection. [Ref: DPA 2018 Part 3 Section 137; ICO Registration Guidance]",
      checks: [
        { id: "UK-GDPR-01-C1", description: "ICO registration completed and current", status: "not-implemented" },
        { id: "UK-GDPR-01-C2", description: "Annual data protection fee paid", status: "not-implemented" },
        { id: "UK-GDPR-01-C3", description: "Registration entries reviewed and updated", status: "not-implemented" },
      ],
    },
    {
      id: "UK-GDPR-02",
      name: "Data Protection Officer (UK)",
      description: "Designate a Data Protection Officer where required under UK GDPR and ensure ICO notification.",
      category: "privacy-governance",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Designate a DPO if: a public authority (unless exempt), core activities require large-scale regular and systematic monitoring, or large-scale processing of special category data. Submit DPO contact details to the ICO. DPO must report to highest management level, operate independently, and not receive instructions on how to perform tasks. [Ref: UK GDPR Article 37; DPA 2018 Part 3 Section 69]",
      checks: [
        { id: "UK-GDPR-02-C1", description: "DPO designated if required", status: "not-implemented" },
        { id: "UK-GDPR-02-C2", description: "DPO contact details submitted to ICO", status: "not-implemented" },
        { id: "UK-GDPR-02-C3", description: "DPO independence and reporting line documented", status: "not-implemented" },
      ],
    },
    {
      id: "UK-GDPR-03",
      name: "Records of Processing Activities (UK)",
      description: "Maintain ROPA documenting all UK personal data processing activities.",
      category: "data-inventory",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Maintain written records of processing activities including: controller/processor details, processing purposes, data categories, data subject categories, recipient categories, third-country transfers, retention periods, and security measures. Organizations with fewer than 250 employees are exempt unless processing is likely to risk rights, not occasional, or involves special category/criminal data. [Ref: UK GDPR Article 30]",
      checks: [
        { id: "UK-GDPR-03-C1", description: "ROPA maintained with all Article 30 required fields", status: "not-implemented" },
        { id: "UK-GDPR-03-C2", description: "ROPA reviewed and updated when processing changes", status: "not-implemented" },
        { id: "UK-GDPR-03-C3", description: "Exemption assessment documented if applicable", status: "not-implemented" },
      ],
    },

    // --- Special Category & Criminal Data ---

    {
      id: "UK-GDPR-04",
      name: "Special Category Data Conditions",
      description: "Identify the Article 9 condition AND a Schedule 1 DPA 2018 condition for processing special category data under UK law.",
      category: "consent-management",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "For special category data (race, ethnicity, political, religious, trade union, genetic, biometric, health, sex life, sexual orientation), identify both a UK GDPR Article 9 condition AND a Schedule 1 of the DPA 2018 condition. Some Schedule 1 conditions require an 'appropriate policy document'. For criminal offence data, identify a Article 10 condition and Schedule 1 Part 2 condition. [Ref: UK GDPR Article 9-10; DPA 2018 Schedule 1]",
      checks: [
        { id: "UK-GDPR-04-C1", description: "Article 9 condition identified for each special category processing", status: "not-implemented" },
        { id: "UK-GDPR-04-C2", description: "Schedule 1 DPA 2018 condition identified", status: "not-implemented" },
        { id: "UK-GDPR-04-C3", description: "Appropriate policy document in place where required", status: "not-implemented" },
      ],
    },

    // --- Lawful Basis & Consent ---

    {
      id: "UK-GDPR-05",
      name: "Lawful Basis for Processing (UK)",
      description: "Document and communicate the lawful basis for each processing activity under UK GDPR Article 6.",
      category: "consent-management",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Identify and document the Article 6 lawful basis for each processing activity: consent, contract, legal obligation, vital interests, public task, or legitimate interests. Conduct Legitimate Interests Assessments (LIAs) where relying on that basis. Include the lawful basis in privacy notices. For children's data, ensure consent is given or authorized by a holder of parental responsibility (under 13 in UK). [Ref: UK GDPR Article 6; ICO Guidance on Children]",
      checks: [
        { id: "UK-GDPR-05-C1", description: "Lawful basis documented per processing activity", status: "not-implemented" },
        { id: "UK-GDPR-05-C2", description: "Legitimate Interest Assessments conducted where applicable", status: "not-implemented" },
        { id: "UK-GDPR-05-C3", description: "Children's data protections (age 13 threshold) implemented", status: "not-implemented" },
      ],
    },

    // --- Individual Rights ---

    {
      id: "UK-GDPR-06",
      name: "UK Data Subject Rights",
      description: "Implement all UK GDPR data subject rights with ICO-compliant response procedures.",
      category: "data-subject-rights",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement rights: access (Article 15), rectification (16), erasure (17), restriction (18), portability (20), objection (21), and automated decision-making (22). Respond within one month (extendable by two months for complex requests). Provide free first copy of data. Use ICO guidance for handling requests that are manifestly unfounded or excessive. [Ref: UK GDPR Articles 12-22]",
      checks: [
        { id: "UK-GDPR-06-C1", description: "All 7 data subject rights implemented", status: "not-implemented" },
        { id: "UK-GDPR-06-C2", description: "Response within one month with extension procedure", status: "not-implemented" },
        { id: "UK-GDPR-06-C3", description: "Manifestly unfounded/excessive request handling documented", status: "not-implemented" },
      ],
    },

    // --- Privacy by Design & DPIA ---

    {
      id: "UK-GDPR-07",
      name: "Data Protection Impact Assessment (DPIA)",
      description: "Conduct DPIAs for high-risk processing under UK GDPR and ICO guidance.",
      category: "privacy-governance",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Conduct DPIAs for: large-scale special category data, systematic monitoring of public areas, systematic and extensive profiling, large-scale processing of vulnerable groups. Follow ICO DPIA template. Consult the ICO if high residual risks remain. Review DPIAs when processing changes. [Ref: UK GDPR Article 35; ICO DPIA Guidance]",
      checks: [
        { id: "UK-GDPR-07-C1", description: "DPIA screening criteria established", status: "not-implemented" },
        { id: "UK-GDPR-07-C2", description: "DPIAs conducted for high-risk processing", status: "not-implemented" },
        { id: "UK-GDPR-07-C3", description: "ICO prior consultation when residual high risk", status: "not-implemented" },
      ],
    },

    // --- International Transfers ---

    {
      id: "UK-GDPR-08",
      name: "UK International Transfer Mechanisms",
      description: "Use UK-approved transfer mechanisms for international personal data transfers.",
      category: "cross-border-transfers",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Transfer to adequate countries per UK adequacy regulations (EEA, Gibraltar, and others as designated). For non-adequate countries use: International Data Transfer Agreement (IDTA), UK Addendum to EU SCCs, Binding Corporate Rules (BCRs), or derogations (Article 49). Conduct Transfer Risk Assessments (TRAs) per ICO guidance. [Ref: UK GDPR Chapter V; ICO International Transfers Guidance]",
      checks: [
        { id: "UK-GDPR-08-C1", description: "Transfer register maintained with mechanism per transfer", status: "not-implemented" },
        { id: "UK-GDPR-08-C2", description: "IDTA or UK Addendum executed for non-adequate transfers", status: "not-implemented" },
        { id: "UK-GDPR-08-C3", description: "Transfer Risk Assessments conducted per ICO guidance", status: "not-implemented" },
        { id: "UK-GDPR-08-C4", description: "UK adequacy regulations monitored for updates", status: "not-implemented" },
      ],
    },

    // --- Security ---

    {
      id: "UK-GDPR-09",
      name: "Security of Processing (UK)",
      description: "Implement appropriate technical and organizational security measures per UK GDPR Article 32.",
      category: "security-controls",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement measures appropriate to risk: pseudonymisation, encryption, confidentiality, integrity, availability, resilience, and restoration procedures. Follow ICO security guidance. Regularly test and evaluate effectiveness. Document security risk assessments. [Ref: UK GDPR Article 32; ICO Security Guidance]",
      checks: [
        { id: "UK-GDPR-09-C1", description: "Security measures documented and risk-assessed", status: "not-implemented" },
        { id: "UK-GDPR-09-C2", description: "Encryption and pseudonymisation implemented", status: "not-implemented" },
        { id: "UK-GDPR-09-C3", description: "Measures tested and evaluated regularly", status: "not-implemented" },
      ],
    },

    // --- Breach Notification ---

    {
      id: "UK-GDPR-10",
      name: "ICO Breach Notification",
      description: "Notify the ICO of personal data breaches within 72 hours and notify affected individuals when high risk.",
      category: "incident-management",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Notify the ICO within 72 hours of becoming aware of a personal data breach posing risk to individuals (unless unlikely to result in risk). Use the ICO's personal data breach reporting service. If high risk to individuals, notify them without undue delay. Document all breaches including those not requiring notification. [Ref: UK GDPR Article 33-34; ICO Breach Reporting Guidance]",
      checks: [
        { id: "UK-GDPR-10-C1", description: "ICO 72-hour notification procedure implemented", status: "not-implemented" },
        { id: "UK-GDPR-10-C2", description: "Individual notification for high-risk breaches", status: "not-implemented" },
        { id: "UK-GDPR-10-C3", description: "Internal breach register maintained", status: "not-implemented" },
      ],
    },

    // --- Processor Management ---

    {
      id: "UK-GDPR-11",
      name: "Data Processor Contracts (UK)",
      description: "Execute Article 28-compliant data processing contracts with all processors.",
      category: "vendor-management",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute written contracts with processors covering: subject matter, duration, nature/purpose, data types, data subject obligations, processor duties (act on documented instructions, confidentiality, security, sub-processor controls, data return/deletion, audit assistance). Use ICO-approved contract templates. [Ref: UK GDPR Article 28]",
      checks: [
        { id: "UK-GDPR-11-C1", description: "Article 28 contracts executed with all processors", status: "not-implemented" },
        { id: "UK-GDPR-11-C2", description: "Sub-processor flow-down terms included", status: "not-implemented" },
        { id: "UK-GDPR-11-C3", description: "Contracts reviewed for ICO compliance", status: "not-implemented" },
      ],
    },

    // --- Accountability & Governance ---

    {
      id: "UK-GDPR-12",
      name: "Accountability Principle (UK)",
      description: "Demonstrate compliance with UK GDPR accountability principle through documented evidence.",
      category: "privacy-governance",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain evidence of compliance: policies, procedures, training records, DPIAs, audit results, ROPA, consent records, contracts, breach records, and DPO reports. Conduct annual self-assessments using the ICO accountability framework. Implement a data protection by design approach. [Ref: UK GDPR Article 5(2); ICO Accountability Framework]",
      checks: [
        { id: "UK-GDPR-12-C1", description: "Accountability evidence maintained and organized", status: "not-implemented" },
        { id: "UK-GDPR-12-C2", description: "Annual ICO accountability self-assessment conducted", status: "not-implemented" },
        { id: "UK-GDPR-12-C3", description: "Data protection by design integrated into projects", status: "not-implemented" },
      ],
    },

    // --- Direct Marketing ---

    {
      id: "UK-GDPR-13",
      name: "Direct Marketing (PECR)",
      description: "Comply with Privacy and Electronic Communications Regulations (PECR) for marketing.",
      category: "consent-management",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Obtain consent before sending electronic marketing (email, SMS, in-app) to individuals. Provide clear opt-out in every message. Honor opt-outs promptly. For existing customers (soft opt-in), ensure similar products/services and clear opt-out. PECR works alongside UK GDPR for marketing. [Ref: PECR; ICO Direct Marketing Guidance]",
      checks: [
        { id: "UK-GDPR-13-C1", description: "PECR-compliant consent obtained for electronic marketing", status: "not-implemented" },
        { id: "UK-GDPR-13-C2", description: "Opt-out mechanism in every marketing message", status: "not-implemented" },
        { id: "UK-GDPR-13-C3", description: "Soft opt-in criteria assessed for existing customers", status: "not-implemented" },
      ],
    },

    // --- UK Representative ---

    {
      id: "UK-GDPR-14",
      name: "UK Representative",
      description: "Appoint a UK representative if offering goods/services or monitoring individuals in the UK from outside the UK.",
      category: "privacy-governance",
      framework: "UK-GDPR",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "If based outside the UK and processing UK personal data related to offering goods/services or behavior monitoring, appoint a UK-based representative. The representative acts as a point of contact for data subjects and the ICO. Document the representative appointment and make contact details available to data subjects. [Ref: UK GDPR Article 27]",
      checks: [
        { id: "UK-GDPR-14-C1", description: "UK representative appointed if applicable", status: "not-implemented" },
        { id: "UK-GDPR-14-C2", description: "Representative contact details available to data subjects", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "uk-gdpr",
    name: "UK GDPR & Data Protection Act 2018 Pack",
    description: "Comprehensive UK data protection controls covering UK GDPR articles and DPA 2018: ICO registration, special category data conditions (Schedule 1), PECR direct marketing, IDTA/UK Addendum transfers, and ICO 72-hour breach notification.",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend", "mobile-application"],
    controls,
    frameworks: ["UK-GDPR"],
  };
}

// ============================================================
// SWITZERLAND — FADP (Federal Act on Data Protection, revFADP)
// In effect: September 1, 2023
// ============================================================

export function createSwissFADPPolicyPack(): PolicyPack {
  const controls: Control[] = [

    {
      id: "FADP-01",
      name: "Data Protection Officer / Advisor",
      description: "Designate a data protection advisor if processing high-risk personal data on a large scale.",
      category: "privacy-governance",
      framework: "FADP",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Designate a data protection advisor if a data security risk assessment indicates a high risk to personality or fundamental rights, particularly for large-scale or sensitive data processing. The advisor maintains the data processing register, advises on DPIAs, and liaises with the FDPIC. [Ref: FADP Article 10]",
      checks: [
        { id: "FADP-01-C1", description: "Risk assessment conducted to determine advisor requirement", status: "not-implemented" },
        { id: "FADP-01-C2", description: "Advisor designated if high-risk threshold met", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-02",
      name: "Principles of Data Processing",
      description: "Comply with FADP principles: lawfulness, proportionality, purpose, transparency, and accuracy.",
      category: "consent-management",
      framework: "FADP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Process personal data lawfully, in good faith, and proportionally. Process only for the purpose indicated at collection, which must be recognizable. Process special categories (health, biometric, genetic, racial, religious, political, trade union, sexual) only with explicit consent or narrow legal exceptions. [Ref: FADP Articles 6-7]",
      checks: [
        { id: "FADP-02-C1", description: "Processing purposes documented and communicated", status: "not-implemented" },
        { id: "FADP-02-C2", description: "Explicit consent obtained for special category data", status: "not-implemented" },
        { id: "FADP-02-C3", description: "Proportionality assessment conducted", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-03",
      name: "Transparency and Information Duties",
      description: "Provide information to data subjects about data collection and processing.",
      category: "privacy-governance",
      framework: "FADP",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "When collecting personal data, actively inform data subjects of: controller identity, processing purpose, data categories, recipients, retention, cross-border transfers, and data subject rights. For data obtained from third parties, inform within a reasonable timeframe. Publish privacy notices in clear language. [Ref: FADP Article 19]",
      checks: [
        { id: "FADP-03-C1", description: "Privacy notices published with all FADP-required information", status: "not-implemented" },
        { id: "FADP-03-C2", description: "Third-party data subjects informed within reasonable time", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-04",
      name: "Data Subject Rights",
      description: "Implement FADP data subject rights including access, correction, destruction, and objection.",
      category: "data-subject-rights",
      framework: "FADP",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement rights: information about processing, access to personal data, correction of inaccurate data, destruction of unlawfully processed data, objection to direct marketing/profiling, and restriction. Respond within 30 days (extendable by 60). Provide free access. Charge reasonable fees for copies. [Ref: FADP Articles 25-27]",
      checks: [
        { id: "FADP-04-C1", description: "All FADP data subject rights implemented", status: "not-implemented" },
        { id: "FADP-04-C2", description: "Response within 30 days with extension procedure", status: "not-implemented" },
        { id: "FADP-04-C3", description: "Direct marketing objection respected", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-05",
      name: "Data Security and Breach Notification",
      description: "Implement appropriate security measures and notify the FDPIC of qualifying data breaches.",
      category: "security-controls",
      framework: "FADP",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement appropriate technical and organizational security measures based on risk. Maintain a data processing register. Notify the FDPIC as soon as possible when a data breach is likely to result in a high risk to the personality or fundamental rights of data subjects. The FDPIC may then inform the public. [Ref: FADP Articles 7, 24]",
      checks: [
        { id: "FADP-05-C1", description: "Security measures documented and risk-assessed", status: "not-implemented" },
        { id: "FADP-05-C2", description: "Data processing register maintained", status: "not-implemented" },
        { id: "FADP-05-C3", description: "FDPIC breach notification procedure for high-risk breaches", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-06",
      name: "Cross-Border Data Transfers",
      description: "Ensure adequate protection for personal data transferred outside Switzerland.",
      category: "cross-border-transfers",
      framework: "FADP",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Transfer to countries providing adequate protection (the Swiss FDPIC recognizes EU/EEA and certain other countries as adequate). For non-adequate countries, use safeguards: SCCs (Swiss-specific or EU SCCs with Swiss modifications), BCRs, or FDPIC-approved mechanisms. Conduct transfer assessments. [Ref: FADP Article 16]",
      checks: [
        { id: "FADP-06-C1", description: "Adequacy assessment conducted per destination country", status: "not-implemented" },
        { id: "FADP-06-C2", description: "Swiss SCCs or equivalent safeguards for non-adequate transfers", status: "not-implemented" },
        { id: "FADP-06-C3", description: "FDPIC adequacy list monitored", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-07",
      name: "DPIA for High-Risk Processing",
      description: "Conduct Data Protection Impact Assessments for processing likely to result in high risks.",
      category: "privacy-governance",
      framework: "FADP",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Conduct a DPIA before processing that is likely to result in high risks to personality or fundamental rights, such as: systematic monitoring, large-scale processing of sensitive data, profiling with significant effects, or innovative technologies. Document DPIA methodology, risks, and mitigation measures. [Ref: FADP Article 22-23]",
      checks: [
        { id: "FADP-07-C1", description: "DPIA criteria established for high-risk processing", status: "not-implemented" },
        { id: "FADP-07-C2", description: "DPIAs documented with risk assessments", status: "not-implemented" },
      ],
    },
    {
      id: "FADP-08",
      name: "Processor Management (FADP)",
      description: "Execute written contracts with processors processing personal data on behalf of the controller.",
      category: "vendor-management",
      framework: "FADP",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute written contracts with processors covering: processing only on documented instructions, security obligations, confidentiality, sub-processor controls, data return/deletion, and audit assistance. Processors are jointly and severally liable with controllers for compliance. [Ref: FADP Article 9]",
      checks: [
        { id: "FADP-08-C1", description: "Written contracts with all processors", status: "not-implemented" },
        { id: "FADP-08-C2", description: "Contracts include FADP Article 9 requirements", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "ch-fadp",
    name: "Switzerland FADP Pack (revFADP 2023)",
    description: "Comprehensive Swiss Federal Act on Data Protection controls: FDPIC requirements, FADP principles (Articles 6-7), transparency duties (Article 19), data subject rights (Articles 25-27), cross-border transfers (Article 16), DPIA (Articles 22-23), and breach notification (Article 24).",
    version: "1.0.0",
    project_types: ["saas", "generic-web-application", "api-backend"],
    controls,
    frameworks: ["FADP"],
  };
}
