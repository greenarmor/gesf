# Americas Privacy Packs

---

## Brazil — LGPD (Law 13,709/2018)

**Pack ID**: `br-lgpd`
**Framework**: `LGPD`
**Regulator**: ANPD (Autoridade Nacional de Proteção de Dados)
**Controls**: 10 (5 critical, 5 high)
**Law**: Lei Geral de Proteção de Dados (effective September 18, 2020; sanctions from August 1, 2021)

### LGPD-01: Encarregado (DPO) Appointment

!!! danger "Critical"

    Appoint an Encarregado (Data Protection Officer) and publish their contact information.

    **Legal Reference**: LGPD Article 41; ANPD Resolution CD/ANPD No. 5/2022

    The Encarregado is responsible for: accepting complaints, communicating with ANPD, guiding employees on LGPD compliance. Publish identity and contact details on the website. Must be a person of integrity and independence. Small entities may be exempted by ANPD.

| Check | Description |
|-------|-------------|
| LGPD-01-C1 | Encarregado appointed with defined responsibilities |
| LGPD-01-C2 | Contact information published and accessible |
| LGPD-01-C3 | ANPD exemption assessment documented if applicable |

### LGPD-02: Records of Processing Activities

!!! danger "Critical"

    Maintain a Record of Personal Data Processing Operations (ROPD).

    **Legal Reference**: LGPD Article 37

    Document: controller/processor/Encarregado details, data subject categories, personal data categories, purposes, data sharing, international transfers, retention, security measures. Small entities exempt unless high-risk processing.

| Check | Description |
|-------|-------------|
| LGPD-02-C1 | ROPD maintained with all Article 37 required fields |
| LGPD-02-C2 | Records updated when processing activities change |
| LGPD-02-C3 | Exemption assessment documented for small entities |

### LGPD-03: Legal Basis for Processing

!!! danger "Critical"

    Identify and document one of the ten LGPD legal bases for each processing activity.

    **Legal Reference**: LGPD Article 7

    Ten bases: (1) consent, (2) legal/regulatory duty, (3) public administration, (4) research, (5) contract performance, (6) exercise of rights, (7) life/physical safety protection, (8) health protection by professionals, (9) legitimate interests, (10) credit protection. Conduct balancing test for legitimate interests.

| Check | Description |
|-------|-------------|
| LGPD-03-C1 | Legal basis documented per processing activity |
| LGPD-03-C2 | Legitimate interest balancing test conducted where applicable |
| LGPD-03-C3 | Legal basis communicated in privacy notice |

### LGPD-04: Consent Management (LGPD)

!!! danger "Critical"

    Obtain free, informed, and unambiguous consent that is specific for each purpose.

    **Legal Reference**: LGPD Articles 8, 11, 14

    Consent must be free, informed, unambiguous, expressed in writing or other means. Specific for each purpose (no bundled consent). Sensitive data requires written/separate consent. Children require consent from at least one parent/guardian (best interest principle). Easy free withdrawal.

| Check | Description |
|-------|-------------|
| LGPD-04-C1 | Consent obtained per specific purpose (no bundling) |
| LGPD-04-C2 | Written/separate consent for sensitive data |
| LGPD-04-C3 | Guardian consent for minors (best interest principle) |
| LGPD-04-C4 | Easy, free consent withdrawal mechanism |

### LGPD-05: Holder Rights (Article 18)

!!! danger "Critical"

    Implement all data holder rights with response within 15 days of request.

    **Legal Reference**: LGPD Article 18

    Rights: (1) confirmation of processing, (2) access, (3) correction, (4) anonymization/blocking/deletion, (5) portability, (6) deletion of consented data, (7) information about data sharing, (8) information about denying consent. Respond within 15 days. Free mechanism.

| Check | Description |
|-------|-------------|
| LGPD-05-C1 | All Article 18 rights implemented and accessible |
| LGPD-05-C2 | Response within 15 days of request |
| LGPD-05-C3 | Free mechanism for exercising rights |

### LGPD-06: Security of Personal Data

!!! danger "Critical"

    Implement appropriate technical and organizational security measures.

    **Legal Reference**: LGPD Article 46

    Measures appropriate to data nature, considering current technology, processing characteristics, and potential risks. Include access controls, encryption, network security, authentication, backup, incident response. Review periodically. Follow ANPD guidance.

| Check | Description |
|-------|-------------|
| LGPD-06-C1 | Security measures documented and risk-assessed |
| LGPD-06-C2 | Encryption and access controls implemented |
| LGPD-06-C3 | Security measures reviewed and updated periodically |

### LGPD-07: Data Protection Impact Assessment (DPIA)

!!! warning "High"

    Conduct DPIA for processing based on legitimate interests or high-risk activities.

    **Legal Reference**: LGPD Article 38; ANPD DPIA Guidance

    Document: processing description, legitimacy assessments, risk analysis, mitigation measures. Consult the Encarregado. Keep under confidentiality. Submit to ANPD when requested or high-risk processing.

| Check | Description |
|-------|-------------|
| LGPD-07-C1 | DPIA criteria established based on ANPD guidance |
| LGPD-07-C2 | DPIAs conducted for high-risk processing |
| LGPD-07-C3 | DPIA records maintained under confidentiality |

### LGPD-08: ANPD Breach Notification

!!! danger "Critical"

    Notify ANPD and affected data subjects of security incidents that may cause risk or harm.

    **Legal Reference**: LGPD Article 48; ANPD Resolution CD/ANPD No. 15/2024

    Notify ANPD within a reasonable timeframe. Include: nature of data, incident description, affected subjects, technical/security measures, risks, reasons for delay. Notify affected subjects unless risk mitigated (e.g., encryption). Maintain incident register.

| Check | Description |
|-------|-------------|
| LGPD-08-C1 | ANPD notification procedure established |
| LGPD-08-C2 | Affected data subjects notified when risk/harm exists |
| LGPD-08-C3 | Incident register maintained |

### LGPD-09: International Data Transfer (LGPD)

!!! warning "High"

    Ensure international transfers comply with LGPD Articles 33-36.

    **Legal Reference**: LGPD Articles 33-36; ANPD International Transfer Regulations

    Transfer only when: destination provides adequate protection (ANPD adequacy), controller guarantees compliance (SCCs), international cooperation instruments exist, or controller proves effective compliance. Burden of proof is on the controller.

| Check | Description |
|-------|-------------|
| LGPD-09-C1 | Transfer register maintained with basis per transfer |
| LGPD-09-C2 | ANPD SCCs or adequacy for each international transfer |
| LGPD-09-C3 | ANPD adequacy decisions monitored |

### LGPD-10: Operator (Processor) Contracts

!!! warning "High"

    Execute LGPD-compliant contracts with all operators (processors).

    **Legal Reference**: LGPD Article 39

    Cover: processing purposes, nature/scope, duration, data categories, data subject rights, security measures, confidentiality, sub-processor controls, data return/deletion, audit rights. Operators jointly liable for damages from deviation.

| Check | Description |
|-------|-------------|
| LGPD-10-C1 | Article 39 contracts executed with all operators |
| LGPD-10-C2 | Sub-processor flow-down terms included |
| LGPD-10-C3 | Data return/deletion upon termination guaranteed |

---

## Canada — PIPEDA (10 Fair Information Principles)

**Pack ID**: `ca-pipeda`
**Framework**: `PIPEDA`
**Regulator**: OPC (Office of the Privacy Commissioner of Canada)
**Controls**: 10 (3 critical, 5 high, 2 medium)
**Law**: Personal Information Protection and Electronic Documents Act, S.C. 2000, c. 5 (PIPEDA Schedule 1, CSA Model Code)

### PIPEDA-01: Accountability (Principle 1)

!!! danger "Critical"

    Designate a Privacy Officer responsible for compliance and implement accountability policies.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.1

    Organization is responsible for personal information under its control, including information transferred to third parties. Implement policies and practices. Make Privacy Officer contact available upon request.

| Check | Description |
|-------|-------------|
| PIPEDA-01-C1 | Privacy Officer designated and documented |
| PIPEDA-01-C2 | Accountability policies implemented |
| PIPEDA-01-C3 | Privacy Officer contact available upon request |

### PIPEDA-02: Identifying Purposes (Principle 2)

!!! warning "High"

    Document and communicate the purposes for collection before or at the time of collection.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.2; PIPEDA Section 5

    Identify purposes before collection. Communicate to the individual. For secondary use, obtain consent. Purposes must be what a reasonable person would consider appropriate.

| Check | Description |
|-------|-------------|
| PIPEDA-02-C1 | Purposes documented before/at collection |
| PIPEDA-02-C2 | New consent obtained for secondary purposes |

### PIPEDA-03: Consent (Principle 3)

!!! danger "Critical"

    Obtain meaningful knowledge and consent for collection, use, or disclosure.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.3; PIPEDA Section 6.1

    Consent can be express or implied. Express for sensitive information. Do not make consent a condition of service beyond what is necessary. Provide withdrawal mechanism. Consider PIPEDA Section 5(3) "appropriate purposes" test. Parental consent for minors.

| Check | Description |
|-------|-------------|
| PIPEDA-03-C1 | Consent obtained appropriate to circumstances |
| PIPEDA-03-C2 | Express consent for sensitive data |
| PIPEDA-03-C3 | Consent withdrawal mechanism available |

### PIPEDA-04: Limiting Collection (Principle 4)

!!! warning "High"

    Limit collection of personal information to what is necessary for identified purposes.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.4

    Collect by fair and lawful means. Do not collect unnecessary information. Document minimization practices. Avoid deceptive collection.

| Check | Description |
|-------|-------------|
| PIPEDA-04-C1 | Collection limited to identified purposes |
| PIPEDA-04-C2 | Collection methods are fair and lawful |

### PIPEDA-05: Limiting Use, Disclosure, Retention (Principle 5)

!!! warning "High"

    Do not use or disclose for new purposes without consent. Retain only as long as necessary.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.5

    Use only for the purpose collected unless consent or law requires. Retain only as long as necessary or legally required. Destroy, erase, or anonymize expired data. Document retention and destruction guidelines.

| Check | Description |
|-------|-------------|
| PIPEDA-05-C1 | New purposes require fresh consent |
| PIPEDA-05-C2 | Retention schedules documented |
| PIPEDA-05-C3 | Destruction/anonymization of expired data |

### PIPEDA-06: Accuracy (Principle 6)

!!! note "Medium"

    Ensure personal information is accurate, complete, and up-to-date for its intended use.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.6

    Minimize use of inaccurate information for decisions. Update when inaccuracies identified. Provide amendment mechanisms. Do not routinely update unless necessary.

| Check | Description |
|-------|-------------|
| PIPEDA-06-C1 | Accuracy verification procedures implemented |
| PIPEDA-06-C2 | Individual amendment/challenge mechanism available |

### PIPEDA-07: Safeguards (Principle 7)

!!! danger "Critical"

    Implement security safeguards appropriate to the sensitivity of personal information.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.7; OPC Security Guidance

    Physical measures (locked offices, restricted access), organizational measures (security clearances, need-to-know), technological measures (passwords, encryption, firewalls). Secure disposal methods. Employee confidentiality training.

| Check | Description |
|-------|-------------|
| PIPEDA-07-C1 | Safeguards proportional to data sensitivity |
| PIPEDA-07-C2 | Physical, organizational, and technical safeguards implemented |
| PIPEDA-07-C3 | Secure disposal methods preventing unauthorized access |

### PIPEDA-08: Openness and Access (Principles 8 and 9)

!!! warning "High"

    Provide individuals access to their personal information and make privacy policies available.

    **Legal Reference**: PIPEDA Schedule 1, Principles 4.8-4.9; PIPEDA Section 8

    Make privacy policies readily available. Upon request, inform of existence, use, and disclosure. Respond within 30 days (extendable by 30). Provide access at minimal or no cost. Allow accuracy challenges. Document refusals.

| Check | Description |
|-------|-------------|
| PIPEDA-08-C1 | Privacy policy publicly available |
| PIPEDA-08-C2 | Access requests fulfilled within 30 days |
| PIPEDA-08-C3 | Accuracy challenge mechanism implemented |

### PIPEDA-09: Challenging Compliance (Principle 10)

!!! note "Medium"

    Establish procedures to receive and respond to complaints about personal information handling.

    **Legal Reference**: PIPEDA Schedule 1, Principle 4.10

    Accessible complaint procedures. Inform of recourse avenues including OPC complaint. Investigate all complaints. Take remedial action. Document complaints and outcomes.

| Check | Description |
|-------|-------------|
| PIPEDA-09-C1 | Accessible complaint procedure established |
| PIPEDA-09-C2 | OPC escalation communicated to complainants |
| PIPEDA-09-C3 | Complaint register maintained |

### PIPEDA-10: Mandatory Breach Notification (RROSH)

!!! danger "Critical"

    Notify the OPC and affected individuals of breaches posing a "real risk of significant harm."

    **Legal Reference**: PIPEDA Section 10.1; Breach of Security Safeguards Regulations

    Conduct Real Risk of Significant Harm (RROSH) assessment. If RROSH: notify individuals, OPC, and other organizations that may mitigate harm. Maintain breach records for 24 months containing: description, date, affected count, RROSH assessment, remediation.

| Check | Description |
|-------|-------------|
| PIPEDA-10-C1 | RROSH assessment procedure implemented |
| PIPEDA-10-C2 | OPC and individual notification for RROSH breaches |
| PIPEDA-10-C3 | Breach records maintained for 24 months |

---

## California — CPRA (CCPA as amended)

**Pack ID**: `us-cpra`
**Framework**: `CPRA`
**Regulator**: CPPA (California Privacy Protection Agency)
**Controls**: 9 (3 critical, 5 high, 1 medium)
**Law**: California Consumer Privacy Act (2018) as amended by California Privacy Rights Act (2020). Civil Code Sections 1798.100-1798.199.100

### CPRA-01: Right to Know and Access

!!! danger "Critical"

    Implement consumer rights to know what personal information is collected, used, shared, or sold.

    **Legal Reference**: Cal. Civ. Code Sections 1798.100, 1798.110, 1798.115

    Provide: categories and specific pieces of PI collected, sources, business/commercial purposes, categories of third parties. Two submission methods minimum (toll-free + internet). Verify identity. Respond within 45 days (extendable by 45).

| Check | Description |
|-------|-------------|
| CPRA-01-C1 | Two request submission methods available |
| CPRA-01-C2 | Identity verification procedure implemented |
| CPRA-01-C3 | Response within 45 days (90 max) |

### CPRA-02: Right to Delete

!!! warning "High"

    Allow consumers to request deletion of their personal information.

    **Legal Reference**: Cal. Civ. Code Section 1798.105

    Delete from business records and direct service providers to delete. Exceptions: completing transactions, security/fraud, debugging, free speech, legal obligations, internal uses aligned with expectations, legal compliance.

| Check | Description |
|-------|-------------|
| CPRA-02-C1 | Deletion request process implemented |
| CPRA-02-C2 | Service provider deletion directed |
| CPRA-02-C3 | Exceptions documented and applied appropriately |

### CPRA-03: Right to Correct

!!! note "Medium"

    Allow consumers to correct inaccurate personal information.

    **Legal Reference**: Cal. Civ. Code Section 1798.106

    Implement correction request mechanism. Use reasonable efforts to verify accuracy. Consider data nature, use, and potential impact. Communicate outcome.

| Check | Description |
|-------|-------------|
| CPRA-03-C1 | Correction request process implemented |
| CPRA-03-C2 | Reasonable accuracy verification before correction |

### CPRA-04: Right to Opt-Out of Sale/Sharing

!!! danger "Critical"

    Provide mechanisms for consumers to opt out of sale or sharing of personal information.

    **Legal Reference**: Cal. Civ. Code Sections 1798.120, 1798.135; CPPA GPC Regulations

    "Do Not Sell or Share My Personal Information" link on homepage. Honor Global Privacy Control (GPC) browser signals. No account requirement for opt-out. No discrimination against consumers exercising rights. Support authorized agents.

| Check | Description |
|-------|-------------|
| CPRA-04-C1 | "Do Not Sell or Share" link on homepage |
| CPRA-04-C2 | GPC browser signals honored |
| CPRA-04-C3 | No account requirement for opt-out |
| CPRA-04-C4 | Authorized agent requests supported |

### CPRA-05: Sensitive Personal Information Controls

!!! warning "High"

    Allow consumers to limit use and disclosure of sensitive personal information.

    **Legal Reference**: Cal. Civ. Code Section 1798.121; Definition Section 1798.140(ae)

    "Limit the Use of My Sensitive Personal Information" link. Sensitive PI: SSN, driver's license, financial accounts with access codes, precise geolocation, racial/ethnic origin, religious beliefs, private communications, genetic/biometric/health data, sex life/orientation. Limit use to what is necessary for services.

| Check | Description |
|-------|-------------|
| CPRA-05-C1 | "Limit Sensitive PI" link on homepage |
| CPRA-05-C2 | Sensitive PI categories identified and mapped |
| CPRA-05-C3 | Use limiting mechanism implemented |

### CPRA-06: Privacy Policy Requirements

!!! warning "High"

    Publish a privacy policy meeting all CPRA disclosure requirements.

    **Legal Reference**: Cal. Civ. Code Section 1798.130; CPPA Privacy Policy Regulations

    Disclose: PI categories collected, retention periods per category, PI sold/shared, consumer rights and how to exercise them, GPC recognition, financial incentives, collection purposes/sources/third parties, whether secondary uses occur, whether assessments are conducted. Update at least every 12 months. Submit to CPPA registry if required.

| Check | Description |
|-------|-------------|
| CPRA-06-C1 | Privacy policy includes all CPRA-required disclosures |
| CPRA-06-C2 | Retention periods disclosed per data category |
| CPRA-06-C3 | Policy reviewed at least annually |

### CPRA-07: Service Provider and Contractor Contracts

!!! warning "High"

    Execute CPRA-compliant contracts with all service providers, contractors, and third parties.

    **Legal Reference**: Cal. Civ. Code Sections 1798.140(ag), 1798.100(d); CPPA Contract Regulations

    Contracts must: set out business purposes, prohibit other uses, prohibit combining data (except permitted), prohibit selling/sharing, require notification of inability within 5 days, grant audit rights, require sub-processor flow-down, specify security. Third-party contracts must prohibit combining for cross-context behavioral advertising.

| Check | Description |
|-------|-------------|
| CPRA-07-C1 | CPRA-compliant contracts with all service providers |
| CPRA-07-C2 | Audit rights and sub-processor flow-down included |
| CPRA-07-C3 | Cross-context behavioral advertising prohibition in third-party contracts |

### CPRA-08: Cybersecurity Audits and DPAs

!!! warning "High"

    Conduct cybersecurity audits and data protection assessments for processing presenting significant risk.

    **Legal Reference**: Cal. Civ. Code Section 1798.185(a)(15); CPPA ADMT Regulations

    Regular cybersecurity audits. Data Protection Assessments for: selling/sharing PI, processing sensitive PI, automated decision-making technology (ADMT), processing for incompatible purposes. Document and make available to CPPA upon request.

| Check | Description |
|-------|-------------|
| CPRA-08-C1 | Cybersecurity audit program established |
| CPRA-08-C2 | DPAs conducted for significant-risk processing |
| CPRA-08-C3 | ADMT assessments conducted where applicable |

### CPRA-09: Data Minimization and Purpose Limitation

!!! warning "High"

    Collect and process personal information only for specific, explicit, and disclosed purposes.

    **Legal Reference**: Cal. Civ. Code Section 1798.100(c)

    Collect, use, retain, and share only what is reasonably necessary and proportionate to disclosed purposes. Document collection purposes. Do not use for incompatible secondary purposes without notice and consent. Retain no longer than necessary.

| Check | Description |
|-------|-------------|
| CPRA-09-C1 | Collection limited to reasonably necessary data |
| CPRA-09-C2 | Purpose compatibility assessed before secondary use |

---

!!! example "Exercise: Compare Breach Notification Timelines"

    | Jurisdiction | Regulator | Deadline | Individual Notification |
    |-------------|-----------|----------|------------------------|
    | Brazil LGPD | ANPD | ? | ? |
    | Canada PIPEDA | OPC | ? | ? |
    | California CPRA | CPPA | ? | ? |

    !!! tip "Answers"
        - LGPD: "reasonable timeframe" (no fixed hours, but promptly). Individual notification when risk/harm exists.
        - PIPEDA: "as soon as feasible" after assessing RROSH. Individual notification when RROSH exists.
        - CPRA: No specific breach notification deadline in the statute itself (California's separate data breach law, Cal. Civ. Code 1798.82, requires "most expedient time possible" without unreasonable delay).

!!! example "Exercise: Design a CPRA-Compliant Homepage"

    Sketch a website homepage layout that includes:

    1. Where would you place the "Do Not Sell or Share My Personal Information" link?
    2. Where would you place the "Limit the Use of My Sensitive Personal Information" link?
    3. How would you handle Global Privacy Control (GPC) signals?
    4. What would your privacy policy link text say?

    !!! tip "Checklist"
        - [ ] Both links in the website footer
        - [ ] GPC signal detection script loaded on every page
        - [ ] GPC opt-out processed without requiring account creation
        - [ ] Privacy policy accessible within one click from any page
        - [ ] "Your Privacy Choices" or similar opt-out preference center

!!! example "Exercise: LGPD Legal Basis Mapping"

    For each processing activity in your project, identify the LGPD legal basis:

    | Processing Activity | Legal Basis (Art 7) |
    |---------------------|---------------------|
    | User registration and account creation | ? |
    | Sending marketing emails | ? |
    | Processing payments | ? |
    | Complying with tax authority requests | ? |
    | Health data for a medical app | ? |
    | Credit scoring | ? |

    !!! tip "Answers"
        - Contract performance (V)
        - Consent (I) or legitimate interests (IX)
        - Contract performance (V)
        - Legal/regulatory obligation (II)
        - Health protection by professionals (VIII) + consent for sensitive data (Art 11)
        - Credit protection (X)
