import type { PolicyPack, Control } from "@greenarmor/ges-core";

export function createPrivacyCorePolicyPack(): PolicyPack {
  const controls: Control[] = [

    // ============================================================
    // PRIV-GOV — GOVERNANCE
    // ============================================================

    {
      id: "PRIV-GOV-01",
      name: "Privacy Program",
      description: "Establish and maintain a formal privacy program with defined scope, objectives, and oversight.",
      category: "privacy-governance",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Define a privacy program charter with scope, objectives, governance structure, and reporting cadence. Assign executive sponsorship. Document the program's alignment with business objectives and regulatory requirements. Review and update the charter annually.",
      checks: [
        { id: "PRIV-GOV-01-C1", description: "Privacy program charter documented and approved", status: "not-implemented" },
        { id: "PRIV-GOV-01-C2", description: "Executive sponsor assigned and documented", status: "not-implemented" },
        { id: "PRIV-GOV-01-C3", description: "Program reviewed and updated annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-GOV-02",
      name: "Privacy Policies",
      description: "Develop, approve, and maintain privacy policies that govern personal data processing.",
      category: "privacy-governance",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Create a comprehensive privacy policy covering data collection, use, sharing, retention, and individual rights. Ensure policies are accessible, written in plain language, and available in relevant languages. Review and update policies at least annually or upon significant changes.",
      checks: [
        { id: "PRIV-GOV-02-C1", description: "Privacy policy published and accessible", status: "not-implemented" },
        { id: "PRIV-GOV-02-C2", description: "Internal privacy procedures documented", status: "not-implemented" },
        { id: "PRIV-GOV-02-C3", description: "Policies reviewed at least annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-GOV-03",
      name: "Data Protection Officer",
      description: "Appoint a Data Protection Officer (DPO) or privacy lead with defined responsibilities and authority.",
      category: "privacy-governance",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Appoint a DPO or equivalent privacy lead. Define their responsibilities: monitoring compliance, advising on privacy impact assessments, cooperating with regulators, and serving as a contact point for data subjects. Ensure the DPO reports to the highest level of management and operates independently.",
      checks: [
        { id: "PRIV-GOV-03-C1", description: "DPO or privacy lead appointed and documented", status: "not-implemented" },
        { id: "PRIV-GOV-03-C2", description: "DPO responsibilities defined and communicated", status: "not-implemented" },
        { id: "PRIV-GOV-03-C3", description: "DPO contact information publicly available", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-GOV-04",
      name: "Privacy Risk Management",
      description: "Establish a privacy risk management process integrated with the overall risk management framework.",
      category: "privacy-governance",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define a privacy risk assessment methodology. Identify, analyze, and evaluate privacy risks. Define risk thresholds and treatment strategies (accept, mitigate, transfer, avoid). Document risk decisions and track remediation. Integrate with enterprise risk management.",
      checks: [
        { id: "PRIV-GOV-04-C1", description: "Privacy risk methodology documented", status: "not-implemented" },
        { id: "PRIV-GOV-04-C2", description: "Privacy risk register maintained", status: "not-implemented" },
        { id: "PRIV-GOV-04-C3", description: "Risk treatment decisions documented", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-GOV-05",
      name: "Management Review",
      description: "Conduct regular management reviews of the privacy program's effectiveness.",
      category: "privacy-governance",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Schedule privacy program reviews at least quarterly with senior management. Review metrics, incident trends, audit findings, risk status, and regulatory changes. Document review outcomes and action items. Track action item completion.",
      checks: [
        { id: "PRIV-GOV-05-C1", description: "Management review conducted at least quarterly", status: "not-implemented" },
        { id: "PRIV-GOV-05-C2", description: "Review outcomes and actions documented", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-INV — DATA INVENTORY
    // ============================================================

    {
      id: "PRIV-INV-01",
      name: "Data Inventory Register",
      description: "Maintain a comprehensive inventory of all personal data collected, processed, and stored.",
      category: "data-inventory",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create and maintain a data inventory that documents: data categories, data sources, collection methods, processing purposes, storage locations, retention periods, access controls, and third-party sharing. Use automated discovery tools where possible. Review and update the inventory at least annually.",
      checks: [
        { id: "PRIV-INV-01-C1", description: "Data inventory register maintained and up-to-date", status: "not-implemented" },
        { id: "PRIV-INV-01-C2", description: "Inventory includes all required metadata fields", status: "not-implemented" },
        { id: "PRIV-INV-01-C3", description: "Inventory reviewed at least annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INV-02",
      name: "Data Flow Mapping",
      description: "Document the flow of personal data through systems, applications, and third parties.",
      category: "data-inventory",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Create data flow maps showing how personal data moves through the organization: collection points, processing systems, storage locations, third-party transfers, and deletion points. Identify cross-border data flows. Update maps when processing activities change.",
      checks: [
        { id: "PRIV-INV-02-C1", description: "Data flow maps documented for all processing activities", status: "not-implemented" },
        { id: "PRIV-INV-02-C2", description: "Cross-border data flows identified and mapped", status: "not-implemented" },
        { id: "PRIV-INV-02-C3", description: "Maps updated when processing activities change", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INV-03",
      name: "Processing Activity Records",
      description: "Maintain records of processing activities (ROPA) as required by applicable privacy laws.",
      category: "data-inventory",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Maintain a ROPA documenting: processing purposes, data categories, data subjects, recipients, third-country transfers, retention periods, and security measures. Keep records current and available for regulatory inspection. Align format with applicable legal requirements (e.g., GDPR Article 30).",
      checks: [
        { id: "PRIV-INV-03-C1", description: "ROPA maintained and accessible for regulatory inspection", status: "not-implemented" },
        { id: "PRIV-INV-03-C2", description: "ROPA includes all legally required fields", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INV-04",
      name: "System Classification",
      description: "Classify systems and applications based on the sensitivity of personal data they process.",
      category: "data-inventory",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Assign data classification levels (public, internal, confidential, restricted) to all systems processing personal data. Define handling requirements per classification level. Implement access controls aligned with classification. Review classifications when processing changes.",
      checks: [
        { id: "PRIV-INV-04-C1", description: "All systems classified by data sensitivity", status: "not-implemented" },
        { id: "PRIV-INV-04-C2", description: "Handling requirements defined per classification", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-CNS — CONSENT & LEGAL BASIS
    // ============================================================

    {
      id: "PRIV-CNS-01",
      name: "Consent Collection",
      description: "Implement mechanisms for collecting, recording, and managing consent for personal data processing.",
      category: "consent-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement a consent management platform that captures granular, informed, and freely given consent. Record: what was consented to, when, how, the privacy policy version, and withdrawal options. Support separate consent for different processing purposes. Ensure consent is as easy to withdraw as to give.",
      checks: [
        { id: "PRIV-CNS-01-C1", description: "Consent management platform deployed", status: "not-implemented" },
        { id: "PRIV-CNS-01-C2", description: "Granular consent per processing purpose", status: "not-implemented" },
        { id: "PRIV-CNS-01-C3", description: "Consent records include timestamp, method, and policy version", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-CNS-02",
      name: "Consent Withdrawal",
      description: "Provide mechanisms for individuals to withdraw consent as easily as it was given.",
      category: "consent-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement a user-facing consent withdrawal mechanism accessible from account settings, privacy preferences, or a dedicated page. Process withdrawal requests within defined timeframes. Stop processing upon withdrawal. Notify third parties of withdrawn consent.",
      checks: [
        { id: "PRIV-CNS-02-C1", description: "Consent withdrawal mechanism available to users", status: "not-implemented" },
        { id: "PRIV-CNS-02-C2", description: "Withdrawal processed within defined SLA", status: "not-implemented" },
        { id: "PRIV-CNS-02-C3", description: "Third parties notified of withdrawn consent", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-CNS-03",
      name: "Legal Basis Documentation",
      description: "Document the legal basis for each personal data processing activity.",
      category: "consent-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "For each processing activity, identify and document the legal basis (consent, contract, legal obligation, vital interests, public task, or legitimate interests). Conduct legitimate interest assessments where applicable. Maintain documentation alongside the ROPA.",
      checks: [
        { id: "PRIV-CNS-03-C1", description: "Legal basis documented for each processing activity", status: "not-implemented" },
        { id: "PRIV-CNS-03-C2", description: "Legitimate interest assessments conducted where applicable", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-CNS-04",
      name: "Purpose Limitation",
      description: "Ensure personal data is processed only for specified, explicit, and legitimate purposes.",
      category: "consent-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define and document specific processing purposes for each data collection. Implement technical controls preventing data use beyond stated purposes. Conduct compatibility assessments before reusing data for new purposes. Communicate purposes to data subjects at collection.",
      checks: [
        { id: "PRIV-CNS-04-C1", description: "Processing purposes documented per data collection", status: "not-implemented" },
        { id: "PRIV-CNS-04-C2", description: "Compatibility assessment before data reuse", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-DSR — DATA SUBJECT RIGHTS
    // ============================================================

    {
      id: "PRIV-DSR-01",
      name: "Right of Access",
      description: "Provide individuals with the ability to access their personal data upon request.",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement a DSAR (Data Subject Access Request) process allowing individuals to request a copy of their personal data. Verify identity before disclosure. Provide data in a structured, commonly used, machine-readable format. Respond within statutory timeframes (typically 30 days). Document all requests and responses.",
      checks: [
        { id: "PRIV-DSR-01-C1", description: "DSAR process implemented and documented", status: "not-implemented" },
        { id: "PRIV-DSR-01-C2", description: "Identity verification before disclosure", status: "not-implemented" },
        { id: "PRIV-DSR-01-C3", description: "Responses provided within statutory timeframes", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-DSR-02",
      name: "Right to Rectification",
      description: "Allow individuals to correct inaccurate or incomplete personal data.",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide a mechanism for individuals to request correction of inaccurate personal data. Implement a verification process for rectification requests. Update data across all systems within defined timeframes. Notify third parties of corrections where data was shared.",
      checks: [
        { id: "PRIV-DSR-02-C1", description: "Rectification request mechanism available", status: "not-implemented" },
        { id: "PRIV-DSR-02-C2", description: "Corrections propagated across all systems", status: "not-implemented" },
        { id: "PRIV-DSR-02-C3", description: "Third parties notified of corrections", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-DSR-03",
      name: "Right to Erasure",
      description: "Allow individuals to request deletion of their personal data (right to be forgotten).",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement a deletion request process with defined criteria for when erasure applies. Verify identity and assess legal obligations before deletion. Delete data from all systems including backups (or flag for deletion on next backup cycle). Notify third parties of erasure. Document the erasure action.",
      checks: [
        { id: "PRIV-DSR-03-C1", description: "Erasure request process implemented", status: "not-implemented" },
        { id: "PRIV-DSR-03-C2", description: "Data deleted from all systems including backups", status: "not-implemented" },
        { id: "PRIV-DSR-03-C3", description: "Third parties notified of erasure", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-DSR-04",
      name: "Right to Data Portability",
      description: "Provide individuals with their personal data in a structured, machine-readable format for transfer.",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Implement an export mechanism providing personal data in JSON, CSV, or XML format. Ensure the export includes all personal data provided by the individual and data generated from their activity. Provide a direct transfer option to another controller where technically feasible.",
      checks: [
        { id: "PRIV-DSR-04-C1", description: "Data export in machine-readable format available", status: "not-implemented" },
        { id: "PRIV-DSR-04-C2", description: "Direct transfer to another controller supported", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-DSR-05",
      name: "Right to Object",
      description: "Allow individuals to object to processing of their personal data for specific purposes.",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide a mechanism for individuals to object to processing (especially direct marketing, profiling, and research). Stop processing upon valid objection unless compelling legitimate grounds exist. Inform individuals of their right to object at the point of collection and in privacy notices.",
      checks: [
        { id: "PRIV-DSR-05-C1", description: "Objection mechanism available to individuals", status: "not-implemented" },
        { id: "PRIV-DSR-05-C2", description: "Processing stopped upon valid objection", status: "not-implemented" },
        { id: "PRIV-DSR-05-C3", description: "Right to object communicated in privacy notices", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-DSR-06",
      name: "Automated Decision Review",
      description: "Protect individuals from solely automated decisions with legal or significant effects, including profiling.",
      category: "data-subject-rights",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Identify all automated decision-making systems and profiling activities. Implement safeguards: human intervention, ability to contest decisions, and explanation of logic. Obtain explicit consent for automated decisions where required. Document the algorithms and criteria used.",
      checks: [
        { id: "PRIV-DSR-06-C1", description: "Automated decision systems identified and documented", status: "not-implemented" },
        { id: "PRIV-DSR-06-C2", description: "Human intervention capability available", status: "not-implemented" },
        { id: "PRIV-DSR-06-C3", description: "Decision explanation provided to individuals", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-SEC — SECURITY CONTROLS
    // ============================================================

    {
      id: "PRIV-SEC-01",
      name: "Access Management",
      description: "Implement role-based access controls for systems processing personal data.",
      category: "security-controls",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement RBAC for all systems processing personal data. Apply least privilege principle. Conduct quarterly access reviews. Implement just-in-time access for privileged operations. Log and monitor all access to personal data.",
      checks: [
        { id: "PRIV-SEC-01-C1", description: "RBAC implemented for all personal data systems", status: "not-implemented" },
        { id: "PRIV-SEC-01-C2", description: "Quarterly access reviews conducted", status: "not-implemented" },
        { id: "PRIV-SEC-01-C3", description: "All personal data access logged", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-SEC-02",
      name: "Encryption",
      description: "Encrypt personal data at rest and in transit using industry-standard algorithms.",
      category: "security-controls",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Implement AES-256-GCM encryption at rest for all personal data. Enforce TLS 1.2+ for all data in transit. Implement field-level encryption for highly sensitive data (PII, health data, financial data). Manage encryption keys using a KMS or HSM. Rotate keys periodically.",
      checks: [
        { id: "PRIV-SEC-02-C1", description: "AES-256 encryption at rest for personal data", status: "not-implemented" },
        { id: "PRIV-SEC-02-C2", description: "TLS 1.2+ for all data in transit", status: "not-implemented" },
        { id: "PRIV-SEC-02-C3", description: "Field-level encryption for sensitive PII", status: "not-implemented" },
        { id: "PRIV-SEC-02-C4", description: "Key management via KMS/HSM", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-SEC-03",
      name: "Pseudonymisation and Anonymisation",
      description: "Implement pseudonymisation and anonymisation techniques to reduce privacy risk.",
      category: "security-controls",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement pseudonymisation for data used in analytics, testing, and research. Store mapping keys separately from pseudonymised data. Implement anonymisation techniques (k-anonymity, differential privacy) for published datasets. Verify anonymisation effectiveness before publishing.",
      checks: [
        { id: "PRIV-SEC-03-C1", description: "Pseudonymisation implemented for analytics/testing", status: "not-implemented" },
        { id: "PRIV-SEC-03-C2", description: "Mapping keys stored separately", status: "not-implemented" },
        { id: "PRIV-SEC-03-C3", description: "Anonymisation verified before data publication", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-SEC-04",
      name: "Secure Development",
      description: "Integrate privacy and security controls into the software development lifecycle.",
      category: "security-controls",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Implement privacy by design principles in the SDLC. Conduct privacy impact assessments for new features. Integrate SAST/DAST into CI/CD pipelines. Perform security code reviews. Train developers on secure coding practices.",
      checks: [
        { id: "PRIV-SEC-04-C1", description: "Privacy by design integrated into SDLC", status: "not-implemented" },
        { id: "PRIV-SEC-04-C2", description: "SAST/DAST in CI/CD pipelines", status: "not-implemented" },
        { id: "PRIV-SEC-04-C3", description: "Security code reviews conducted", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-INC — INCIDENT & BREACH MANAGEMENT
    // ============================================================

    {
      id: "PRIV-INC-01",
      name: "Incident Response Plan",
      description: "Develop and maintain a privacy incident response plan with defined roles and procedures.",
      category: "incident-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create a privacy incident response plan covering: detection, classification, containment, eradication, notification, and recovery. Define roles and responsibilities (IR team, legal, communications, DPO). Test the plan annually via tabletop exercises. Update based on lessons learned.",
      checks: [
        { id: "PRIV-INC-01-C1", description: "Privacy incident response plan documented", status: "not-implemented" },
        { id: "PRIV-INC-01-C2", description: "Roles and responsibilities defined", status: "not-implemented" },
        { id: "PRIV-INC-01-C3", description: "Plan tested annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INC-02",
      name: "Breach Classification",
      description: "Establish criteria for classifying privacy breach severity and determining notification obligations.",
      category: "incident-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define breach severity levels based on data types, volume, sensitivity, and risk to individuals. Create a decision matrix for regulatory notification thresholds. Document assessment procedures. Train incident responders on classification criteria.",
      checks: [
        { id: "PRIV-INC-02-C1", description: "Breach classification criteria documented", status: "not-implemented" },
        { id: "PRIV-INC-02-C2", description: "Notification decision matrix defined", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INC-03",
      name: "Regulatory Notification",
      description: "Implement procedures for notifying regulators of qualifying privacy breaches within statutory timeframes.",
      category: "incident-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Define regulatory notification procedures for all applicable jurisdictions. Map notification timeframes per jurisdiction (e.g., GDPR 72 hours, various state laws 30-90 days). Prepare notification templates. Maintain regulator contact information. Test notification workflows.",
      checks: [
        { id: "PRIV-INC-03-C1", description: "Notification procedures documented per jurisdiction", status: "not-implemented" },
        { id: "PRIV-INC-03-C2", description: "Notification templates prepared", status: "not-implemented" },
        { id: "PRIV-INC-03-C3", description: "Regulator contact information maintained", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-INC-04",
      name: "Data Subject Notification",
      description: "Implement procedures for notifying affected individuals of qualifying privacy breaches.",
      category: "incident-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define criteria for when individual notification is required (high risk to rights and freedoms). Prepare notification templates in relevant languages. Define communication channels (email, mail, in-app, public notice). Coordinate timing with regulatory notifications.",
      checks: [
        { id: "PRIV-INC-04-C1", description: "Individual notification criteria defined", status: "not-implemented" },
        { id: "PRIV-INC-04-C2", description: "Multi-language notification templates prepared", status: "not-implemented" },
        { id: "PRIV-INC-04-C3", description: "Communication channels defined", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-VEN — THIRD-PARTY MANAGEMENT
    // ============================================================

    {
      id: "PRIV-VEN-01",
      name: "Vendor Due Diligence",
      description: "Conduct privacy and security due diligence before engaging vendors processing personal data.",
      category: "vendor-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Establish a vendor assessment process evaluating privacy practices, security controls, certifications (ISO 27001, SOC 2), and compliance history. Classify vendors by risk level. Require completion of security questionnaires. Document assessment results and risk decisions.",
      checks: [
        { id: "PRIV-VEN-01-C1", description: "Vendor assessment process documented and enforced", status: "not-implemented" },
        { id: "PRIV-VEN-01-C2", description: "Vendors classified by risk level", status: "not-implemented" },
        { id: "PRIV-VEN-01-C3", description: "Security questionnaires completed for high-risk vendors", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-VEN-02",
      name: "Processor Agreements",
      description: "Execute data processing agreements (DPAs) with all vendors acting as data processors.",
      category: "vendor-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Execute DPAs with all processors before data sharing. Ensure DPAs define: processing scope, security obligations, sub-processor controls, breach notification timelines, data return/deletion, and audit rights. Review and renew DPAs at least annually or upon material changes.",
      checks: [
        { id: "PRIV-VEN-02-C1", description: "DPAs executed with all processors", status: "not-implemented" },
        { id: "PRIV-VEN-02-C2", description: "DPAs include all legally required clauses", status: "not-implemented" },
        { id: "PRIV-VEN-02-C3", description: "DPAs reviewed and renewed annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-VEN-03",
      name: "Ongoing Monitoring",
      description: "Monitor vendor compliance with privacy and security requirements throughout the relationship.",
      category: "vendor-management",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Conduct periodic reviews of vendor security posture. Require annual SOC 2 or equivalent reports. Track vendor breach notifications. Monitor for changes in vendor security certifications. Reassess vendors upon scope changes or incidents.",
      checks: [
        { id: "PRIV-VEN-03-C1", description: "Annual vendor security reviews conducted", status: "not-implemented" },
        { id: "PRIV-VEN-03-C2", description: "Vendor breach notifications tracked", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-XBT — CROSS-BORDER TRANSFERS
    // ============================================================

    {
      id: "PRIV-XBT-01",
      name: "Transfer Assessment",
      description: "Identify and document all cross-border personal data transfers.",
      category: "cross-border-transfers",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Map all international personal data transfers including: source/destination countries, data categories, transfer mechanisms, recipients, and purpose. Maintain a transfer register. Update when new transfers are established. Identify transfers to non-adequate countries.",
      checks: [
        { id: "PRIV-XBT-01-C1", description: "Cross-border transfer register maintained", status: "not-implemented" },
        { id: "PRIV-XBT-01-C2", description: "All transfers mapped with countries and mechanisms", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-XBT-02",
      name: "Adequacy Assessment",
      description: "Determine whether destination countries have adequate data protection levels.",
      category: "cross-border-transfers",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Maintain a list of countries recognized as providing adequate data protection (EU adequacy decisions, UK adequacy regulations, etc.). Verify adequacy status before transferring data. For non-adequate countries, implement appropriate safeguards (SCCs, BCRs, or derogations).",
      checks: [
        { id: "PRIV-XBT-02-C1", description: "Adequacy status tracked per destination country", status: "not-implemented" },
        { id: "PRIV-XBT-02-C2", description: "Safeguards implemented for non-adequate transfers", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-XBT-03",
      name: "Standard Contractual Clauses",
      description: "Execute Standard Contractual Clauses (SCCs) or equivalent safeguards for non-adequate transfers.",
      category: "cross-border-transfers",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Execute the latest version of SCCs (EU SCCs, UK IDTA, or equivalent) for all transfers to non-adequate countries. Conduct Transfer Impact Assessments (TIAs) before relying on SCCs. Implement supplementary measures where TIAs identify risks. Maintain executed SCC records.",
      checks: [
        { id: "PRIV-XBT-03-C1", description: "SCCs executed for all non-adequate transfers", status: "not-implemented" },
        { id: "PRIV-XBT-03-C2", description: "Transfer Impact Assessments conducted", status: "not-implemented" },
        { id: "PRIV-XBT-03-C3", description: "Supplementary measures implemented where needed", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-XBT-04",
      name: "Data Localization Requirements",
      description: "Identify and comply with data localization mandates applicable to the organization.",
      category: "cross-border-transfers",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Identify countries with data localization requirements (e.g., China PIPL, Russia, India DPDPA for certain data). Implement technical controls ensuring affected data remains within required jurisdictions. Monitor regulatory changes affecting localization obligations. Document compliance measures.",
      checks: [
        { id: "PRIV-XBT-04-C1", description: "Data localization requirements identified per jurisdiction", status: "not-implemented" },
        { id: "PRIV-XBT-04-C2", description: "Technical controls enforce localization", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-RET — RETENTION & DISPOSAL
    // ============================================================

    {
      id: "PRIV-RET-01",
      name: "Retention Schedule",
      description: "Define and enforce data retention periods for each category of personal data.",
      category: "data-retention",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "critical",
      implementation_guidance: "Create a retention schedule defining how long each data category is retained based on legal requirements, business needs, and contractual obligations. Implement automated retention enforcement (TTL, scheduled deletion). Review and update the schedule at least annually. Document retention decisions.",
      checks: [
        { id: "PRIV-RET-01-C1", description: "Retention schedule documented per data category", status: "not-implemented" },
        { id: "PRIV-RET-01-C2", description: "Automated retention enforcement implemented", status: "not-implemented" },
        { id: "PRIV-RET-01-C3", description: "Retention schedule reviewed annually", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-RET-02",
      name: "Secure Disposal",
      description: "Implement secure disposal procedures for personal data that has exceeded retention.",
      category: "data-retention",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Define secure disposal methods for digital data (cryptographic erase, overwriting, secure deletion) and physical media (shredding, degaussing, incineration). Document disposal actions including date, method, data category, and personnel. Verify disposal effectiveness periodically.",
      checks: [
        { id: "PRIV-RET-02-C1", description: "Secure disposal procedures documented", status: "not-implemented" },
        { id: "PRIV-RET-02-C2", description: "Disposal actions logged and verified", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-RET-03",
      name: "Data Minimization",
      description: "Collect and retain only the minimum personal data necessary for stated purposes.",
      category: "data-retention",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Implement data minimization principles: collect only data necessary for the stated purpose, implement field-level controls in forms, conduct periodic data minimization reviews, and anonymize or delete data no longer needed.",
      checks: [
        { id: "PRIV-RET-03-C1", description: "Data minimization principles applied to collection forms", status: "not-implemented" },
        { id: "PRIV-RET-03-C2", description: "Periodic minimization reviews conducted", status: "not-implemented" },
      ],
    },

    // ============================================================
    // PRIV-TRN — TRAINING & AWARENESS
    // ============================================================

    {
      id: "PRIV-TRN-01",
      name: "Employee Privacy Training",
      description: "Provide privacy awareness training to all employees upon hire and at least annually.",
      category: "privacy-training",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "high",
      implementation_guidance: "Provide privacy training covering: data handling procedures, individual rights, breach reporting, data minimization, secure communication, and applicable privacy laws. Track completion. Require annual refresher training. Update content to reflect regulatory changes.",
      checks: [
        { id: "PRIV-TRN-01-C1", description: "Privacy training provided on hire", status: "not-implemented" },
        { id: "PRIV-TRN-01-C2", description: "Annual refresher training completed by all staff", status: "not-implemented" },
        { id: "PRIV-TRN-01-C3", description: "Training completion tracked", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-TRN-02",
      name: "Specialized Role Training",
      description: "Provide role-specific privacy training to personnel with specialized privacy responsibilities.",
      category: "privacy-training",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "medium",
      implementation_guidance: "Identify roles requiring specialized training (developers, system admins, customer support, HR, legal). Develop role-specific training modules. Include hands-on exercises for data handling, DSAR processing, and breach response. Update training content annually.",
      checks: [
        { id: "PRIV-TRN-02-C1", description: "Specialized roles identified and documented", status: "not-implemented" },
        { id: "PRIV-TRN-02-C2", description: "Role-specific training modules delivered", status: "not-implemented" },
      ],
    },
    {
      id: "PRIV-TRN-03",
      name: "Privacy Awareness Program",
      description: "Maintain ongoing privacy awareness activities beyond formal training.",
      category: "privacy-training",
      framework: "PRIVACY-CORE",
      status: "not-implemented",
      severity: "low",
      implementation_guidance: "Conduct ongoing awareness activities: privacy newsletters, awareness campaigns (Data Privacy Day), phishing simulations, privacy tips in internal communications, and visible privacy policy reminders. Measure awareness through periodic assessments.",
      checks: [
        { id: "PRIV-TRN-03-C1", description: "Ongoing awareness activities conducted", status: "not-implemented" },
        { id: "PRIV-TRN-03-C2", description: "Awareness measured through periodic assessments", status: "not-implemented" },
      ],
    },
  ];

  return {
    id: "privacy-core",
    name: "Privacy Core Framework (Global Baseline)",
    description: "Universal privacy controls covering 10 core domains: Governance, Data Inventory, Consent Management, Data Subject Rights, Security Controls, Incident Management, Third-Party Management, Cross-Border Transfers, Retention & Disposal, and Training & Awareness. This is the foundational layer — install country packs on top for jurisdiction-specific requirements.",
    version: "1.0.0",
    project_types: [
      "saas",
      "ai-application",
      "healthcare-system",
      "generic-web-application",
      "api-backend",
      "mobile-application",
      "government-system",
      "mcp-server",
      "blockchain",
      "event-platform",
      "photo-storage-platform",
      "vulnerability-scanner",
      "wallet",
    ],
    controls,
    frameworks: ["PRIVACY-CORE"],
  };
}
