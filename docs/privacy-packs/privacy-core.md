# Privacy Core Framework (Global Baseline)

The `privacy-core` pack provides **40 universal privacy controls** across 10 domains. It is installed automatically for every project alongside country-specific packs. These controls apply regardless of jurisdiction.

**Pack ID**: `privacy-core`
**Framework**: `PRIVACY-CORE`
**Controls**: 40 (13 critical, 20 high, 6 medium, 1 low)

---

## Domain 1: Privacy Governance (PRIV-GOV)

### PRIV-GOV-01: Privacy Program

!!! danger "Critical Severity"

    Establish and maintain a formal privacy program with defined scope, objectives, and oversight.

    **Implementation**: Define a privacy program charter with scope, objectives, governance structure, and reporting cadence. Assign executive sponsorship. Document alignment with business objectives and regulatory requirements. Review and update the charter annually.

| Check ID | Description |
|----------|-------------|
| PRIV-GOV-01-C1 | Privacy program charter documented and approved |
| PRIV-GOV-01-C2 | Executive sponsor assigned and documented |
| PRIV-GOV-01-C3 | Program reviewed and updated annually |

### PRIV-GOV-02: Privacy Policies

!!! warning "High Severity"

    Develop, approve, and maintain privacy policies that govern personal data processing.

    **Implementation**: Create a comprehensive privacy policy covering data collection, use, sharing, retention, and individual rights. Ensure policies are accessible, written in plain language, and available in relevant languages. Review at least annually.

| Check ID | Description |
|----------|-------------|
| PRIV-GOV-02-C1 | Privacy policy published and accessible |
| PRIV-GOV-02-C2 | Internal privacy procedures documented |
| PRIV-GOV-02-C3 | Policies reviewed at least annually |

### PRIV-GOV-03: Data Protection Officer

!!! warning "High Severity"

    Appoint a DPO or privacy lead with defined responsibilities and authority.

    **Implementation**: Define responsibilities: monitoring compliance, advising on DPIAs, cooperating with regulators, serving as contact point. Ensure DPO reports to highest management level and operates independently.

| Check ID | Description |
|----------|-------------|
| PRIV-GOV-03-C1 | DPO or privacy lead appointed and documented |
| PRIV-GOV-03-C2 | DPO responsibilities defined and communicated |
| PRIV-GOV-03-C3 | DPO contact information publicly available |

### PRIV-GOV-04: Privacy Risk Management

!!! warning "High Severity"

    Establish a privacy risk management process integrated with the overall risk framework.

    **Implementation**: Define methodology, identify/analyze/evaluate risks, define thresholds and treatment strategies (accept, mitigate, transfer, avoid). Document decisions and track remediation.

| Check ID | Description |
|----------|-------------|
| PRIV-GOV-04-C1 | Privacy risk methodology documented |
| PRIV-GOV-04-C2 | Privacy risk register maintained |
| PRIV-GOV-04-C3 | Risk treatment decisions documented |

### PRIV-GOV-05: Management Review

!!! note "Medium Severity"

    Conduct regular management reviews of the privacy program's effectiveness.

    **Implementation**: Schedule reviews at least quarterly with senior management. Review metrics, incident trends, audit findings, risk status, and regulatory changes. Document outcomes and action items.

| Check ID | Description |
|----------|-------------|
| PRIV-GOV-05-C1 | Management review conducted at least quarterly |
| PRIV-GOV-05-C2 | Review outcomes and actions documented |

---

## Domain 2: Data Inventory (PRIV-INV)

### PRIV-INV-01: Data Inventory Register

!!! danger "Critical Severity"

    Maintain a comprehensive inventory of all personal data collected, processed, and stored.

    **Implementation**: Document data categories, sources, collection methods, processing purposes, storage locations, retention periods, access controls, and third-party sharing. Use automated discovery tools. Review annually.

| Check ID | Description |
|----------|-------------|
| PRIV-INV-01-C1 | Data inventory register maintained and up-to-date |
| PRIV-INV-01-C2 | Inventory includes all required metadata fields |
| PRIV-INV-01-C3 | Inventory reviewed at least annually |

### PRIV-INV-02: Data Flow Mapping

!!! warning "High Severity"

    Document the flow of personal data through systems, applications, and third parties.

    **Implementation**: Create data flow maps showing collection points, processing systems, storage locations, third-party transfers, and deletion points. Identify cross-border flows. Update when processing changes.

| Check ID | Description |
|----------|-------------|
| PRIV-INV-02-C1 | Data flow maps documented for all processing activities |
| PRIV-INV-02-C2 | Cross-border data flows identified and mapped |
| PRIV-INV-02-C3 | Maps updated when processing activities change |

### PRIV-INV-03: Processing Activity Records

!!! danger "Critical Severity"

    Maintain records of processing activities (ROPA) as required by applicable privacy laws.

    **Implementation**: Document processing purposes, data categories, data subjects, recipients, third-country transfers, retention periods, and security measures. Align with GDPR Article 30 or equivalent.

| Check ID | Description |
|----------|-------------|
| PRIV-INV-03-C1 | ROPA maintained and accessible for regulatory inspection |
| PRIV-INV-03-C2 | ROPA includes all legally required fields |

### PRIV-INV-04: System Classification

!!! note "Medium Severity"

    Classify systems and applications based on the sensitivity of personal data they process.

    **Implementation**: Assign classification levels (public, internal, confidential, restricted). Define handling requirements per level. Implement access controls aligned with classification.

| Check ID | Description |
|----------|-------------|
| PRIV-INV-04-C1 | All systems classified by data sensitivity |
| PRIV-INV-04-C2 | Handling requirements defined per classification |

---

## Domain 3: Consent and Legal Basis (PRIV-CNS)

### PRIV-CNS-01: Consent Collection

!!! danger "Critical Severity"

    Implement mechanisms for collecting, recording, and managing consent.

    **Implementation**: Capture granular, informed, freely given consent. Record: what was consented to, when, how, the privacy policy version, and withdrawal options. Support separate consent per purpose. Ensure withdrawal is as easy as giving consent.

| Check ID | Description |
|----------|-------------|
| PRIV-CNS-01-C1 | Consent management platform deployed |
| PRIV-CNS-01-C2 | Granular consent per processing purpose |
| PRIV-CNS-01-C3 | Consent records include timestamp, method, and policy version |

### PRIV-CNS-02: Consent Withdrawal

!!! warning "High Severity"

    Provide mechanisms for individuals to withdraw consent as easily as it was given.

    **Implementation**: User-facing withdrawal mechanism accessible from account settings or privacy preferences. Process within defined SLAs. Stop processing upon withdrawal. Notify third parties.

| Check ID | Description |
|----------|-------------|
| PRIV-CNS-02-C1 | Consent withdrawal mechanism available to users |
| PRIV-CNS-02-C2 | Withdrawal processed within defined SLA |
| PRIV-CNS-02-C3 | Third parties notified of withdrawn consent |

### PRIV-CNS-03: Legal Basis Documentation

!!! warning "High Severity"

    Document the legal basis for each personal data processing activity.

    **Implementation**: Identify legal basis (consent, contract, legal obligation, vital interests, public task, legitimate interests). Conduct legitimate interest assessments where applicable. Maintain alongside ROPA.

| Check ID | Description |
|----------|-------------|
| PRIV-CNS-03-C1 | Legal basis documented for each processing activity |
| PRIV-CNS-03-C2 | Legitimate interest assessments conducted where applicable |

### PRIV-CNS-04: Purpose Limitation

!!! warning "High Severity"

    Ensure personal data is processed only for specified, explicit, and legitimate purposes.

    **Implementation**: Define specific purposes. Implement technical controls preventing use beyond stated purposes. Conduct compatibility assessments before reuse. Communicate purposes at collection.

| Check ID | Description |
|----------|-------------|
| PRIV-CNS-04-C1 | Processing purposes documented per data collection |
| PRIV-CNS-04-C2 | Compatibility assessment before data reuse |

---

## Domain 4: Data Subject Rights (PRIV-DSR)

### PRIV-DSR-01: Right of Access

!!! danger "Critical Severity"

    Provide individuals with the ability to access their personal data upon request.

    **Implementation**: Implement DSAR process. Verify identity before disclosure. Provide data in structured, machine-readable format. Respond within statutory timeframes (typically 30 days). Document all requests.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-01-C1 | DSAR process implemented and documented |
| PRIV-DSR-01-C2 | Identity verification before disclosure |
| PRIV-DSR-01-C3 | Responses provided within statutory timeframes |

### PRIV-DSR-02: Right to Rectification

!!! warning "High Severity"

    Allow individuals to correct inaccurate or incomplete personal data.

    **Implementation**: Request mechanism, verification process. Update data across all systems. Notify third parties of corrections.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-02-C1 | Rectification request mechanism available |
| PRIV-DSR-02-C2 | Corrections propagated across all systems |
| PRIV-DSR-02-C3 | Third parties notified of corrections |

### PRIV-DSR-03: Right to Erasure

!!! danger "Critical Severity"

    Allow individuals to request deletion of their personal data (right to be forgotten).

    **Implementation**: Process with defined criteria. Verify identity and assess legal obligations. Delete from all systems including backups. Notify third parties. Document the action.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-03-C1 | Erasure request process implemented |
| PRIV-DSR-03-C2 | Data deleted from all systems including backups |
| PRIV-DSR-03-C3 | Third parties notified of erasure |

### PRIV-DSR-04: Right to Data Portability

!!! note "Medium Severity"

    Provide personal data in a structured, machine-readable format for transfer.

    **Implementation**: Export in JSON, CSV, or XML. Include all personal data provided by the individual and data generated from their activity. Provide direct transfer where feasible.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-04-C1 | Data export in machine-readable format available |
| PRIV-DSR-04-C2 | Direct transfer to another controller supported |

### PRIV-DSR-05: Right to Object

!!! warning "High Severity"

    Allow individuals to object to processing for specific purposes.

    **Implementation**: Objection mechanism for direct marketing, profiling, research. Stop processing upon valid objection unless compelling legitimate grounds exist. Communicate right to object in privacy notices.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-05-C1 | Objection mechanism available to individuals |
| PRIV-DSR-05-C2 | Processing stopped upon valid objection |
| PRIV-DSR-05-C3 | Right to object communicated in privacy notices |

### PRIV-DSR-06: Automated Decision Review

!!! warning "High Severity"

    Protect individuals from solely automated decisions with legal or significant effects.

    **Implementation**: Identify automated decision systems. Implement safeguards: human intervention, ability to contest, explanation of logic. Obtain explicit consent where required. Document algorithms and criteria.

| Check ID | Description |
|----------|-------------|
| PRIV-DSR-06-C1 | Automated decision systems identified and documented |
| PRIV-DSR-06-C2 | Human intervention capability available |
| PRIV-DSR-06-C3 | Decision explanation provided to individuals |

---

## Domain 5: Security Controls (PRIV-SEC)

### PRIV-SEC-01: Access Management

!!! danger "Critical Severity"

    Implement role-based access controls for systems processing personal data.

    **Implementation**: RBAC with least privilege. Quarterly access reviews. Just-in-time access for privileged operations. Log and monitor all access to personal data.

| Check ID | Description |
|----------|-------------|
| PRIV-SEC-01-C1 | RBAC implemented for all personal data systems |
| PRIV-SEC-01-C2 | Quarterly access reviews conducted |
| PRIV-SEC-01-C3 | All personal data access logged |

### PRIV-SEC-02: Encryption

!!! danger "Critical Severity"

    Encrypt personal data at rest and in transit using industry-standard algorithms.

    **Implementation**: AES-256-GCM at rest. TLS 1.2+ in transit. Field-level encryption for sensitive PII. KMS/HSM key management. Periodic key rotation.

| Check ID | Description |
|----------|-------------|
| PRIV-SEC-02-C1 | AES-256 encryption at rest for personal data |
| PRIV-SEC-02-C2 | TLS 1.2+ for all data in transit |
| PRIV-SEC-02-C3 | Field-level encryption for sensitive PII |
| PRIV-SEC-02-C4 | Key management via KMS/HSM |

### PRIV-SEC-03: Pseudonymisation and Anonymisation

!!! warning "High Severity"

    Implement pseudonymisation and anonymisation to reduce privacy risk.

    **Implementation**: Pseudonymise data for analytics, testing, research. Store mapping keys separately. Apply k-anonymity or differential privacy for published datasets. Verify effectiveness before publishing.

| Check ID | Description |
|----------|-------------|
| PRIV-SEC-03-C1 | Pseudonymisation implemented for analytics/testing |
| PRIV-SEC-03-C2 | Mapping keys stored separately |
| PRIV-SEC-03-C3 | Anonymisation verified before data publication |

### PRIV-SEC-04: Secure Development

!!! warning "High Severity"

    Integrate privacy and security controls into the software development lifecycle.

    **Implementation**: Privacy by design in SDLC. Privacy impact assessments for new features. SAST/DAST in CI/CD. Security code reviews. Developer training.

| Check ID | Description |
|----------|-------------|
| PRIV-SEC-04-C1 | Privacy by design integrated into SDLC |
| PRIV-SEC-04-C2 | SAST/DAST in CI/CD pipelines |
| PRIV-SEC-04-C3 | Security code reviews conducted |

---

## Domain 6: Incident and Breach Management (PRIV-INC)

### PRIV-INC-01: Incident Response Plan

!!! danger "Critical Severity"

    Develop and maintain a privacy incident response plan with defined roles and procedures.

    **Implementation**: Cover detection, classification, containment, eradication, notification, recovery. Define roles (IR team, legal, communications, DPO). Test annually via tabletop exercises.

| Check ID | Description |
|----------|-------------|
| PRIV-INC-01-C1 | Privacy incident response plan documented |
| PRIV-INC-01-C2 | Roles and responsibilities defined |
| PRIV-INC-01-C3 | Plan tested annually |

### PRIV-INC-02: Breach Classification

!!! warning "High Severity"

    Establish criteria for classifying privacy breach severity and determining notification obligations.

    **Implementation**: Define severity levels based on data types, volume, sensitivity, risk. Create decision matrix for regulatory notification thresholds. Train responders.

| Check ID | Description |
|----------|-------------|
| PRIV-INC-02-C1 | Breach classification criteria documented |
| PRIV-INC-02-C2 | Notification decision matrix defined |

### PRIV-INC-03: Regulatory Notification

!!! danger "Critical Severity"

    Implement procedures for notifying regulators of qualifying breaches within statutory timeframes.

    **Implementation**: Map timeframes per jurisdiction (GDPR 72 hours, various state laws 30-90 days). Prepare templates. Maintain regulator contacts. Test workflows.

| Check ID | Description |
|----------|-------------|
| PRIV-INC-03-C1 | Notification procedures documented per jurisdiction |
| PRIV-INC-03-C2 | Notification templates prepared |
| PRIV-INC-03-C3 | Regulator contact information maintained |

### PRIV-INC-04: Data Subject Notification

!!! warning "High Severity"

    Implement procedures for notifying affected individuals of qualifying breaches.

    **Implementation**: Define criteria for when individual notification is required. Prepare multi-language templates. Define communication channels. Coordinate timing with regulatory notifications.

| Check ID | Description |
|----------|-------------|
| PRIV-INC-04-C1 | Individual notification criteria defined |
| PRIV-INC-04-C2 | Multi-language notification templates prepared |
| PRIV-INC-04-C3 | Communication channels defined |

---

## Domain 7: Third-Party Management (PRIV-VEN)

### PRIV-VEN-01: Vendor Due Diligence

!!! warning "High Severity"

    Conduct privacy and security due diligence before engaging vendors.

    **Implementation**: Evaluate privacy practices, security controls, certifications (ISO 27001, SOC 2), compliance history. Classify by risk. Require security questionnaires. Document results.

| Check ID | Description |
|----------|-------------|
| PRIV-VEN-01-C1 | Vendor assessment process documented and enforced |
| PRIV-VEN-01-C2 | Vendors classified by risk level |
| PRIV-VEN-01-C3 | Security questionnaires completed for high-risk vendors |

### PRIV-VEN-02: Processor Agreements

!!! danger "Critical Severity"

    Execute data processing agreements (DPAs) with all vendors acting as data processors.

    **Implementation**: Define processing scope, security obligations, sub-processor controls, breach notification timelines, data return/deletion, audit rights. Review annually.

| Check ID | Description |
|----------|-------------|
| PRIV-VEN-02-C1 | DPAs executed with all processors |
| PRIV-VEN-02-C2 | DPAs include all legally required clauses |
| PRIV-VEN-02-C3 | DPAs reviewed and renewed annually |

### PRIV-VEN-03: Ongoing Monitoring

!!! note "Medium Severity"

    Monitor vendor compliance throughout the relationship.

    **Implementation**: Periodic security reviews. Annual SOC 2 reports. Track vendor breach notifications. Monitor certification changes. Reassess on scope changes.

| Check ID | Description |
|----------|-------------|
| PRIV-VEN-03-C1 | Annual vendor security reviews conducted |
| PRIV-VEN-03-C2 | Vendor breach notifications tracked |

---

## Domain 8: Cross-Border Transfers (PRIV-XBT)

### PRIV-XBT-01: Transfer Assessment

!!! danger "Critical Severity"

    Identify and document all cross-border personal data transfers.

    **Implementation**: Map source/destination countries, data categories, transfer mechanisms, recipients, purpose. Maintain transfer register. Identify non-adequate transfers.

| Check ID | Description |
|----------|-------------|
| PRIV-XBT-01-C1 | Cross-border transfer register maintained |
| PRIV-XBT-01-C2 | All transfers mapped with countries and mechanisms |

### PRIV-XBT-02: Adequacy Assessment

!!! warning "High Severity"

    Determine whether destination countries have adequate data protection levels.

    **Implementation**: Maintain adequacy lists (EU decisions, UK regulations). Verify before transferring. Implement safeguards for non-adequate countries.

| Check ID | Description |
|----------|-------------|
| PRIV-XBT-02-C1 | Adequacy status tracked per destination country |
| PRIV-XBT-02-C2 | Safeguards implemented for non-adequate transfers |

### PRIV-XBT-03: Standard Contractual Clauses

!!! warning "High Severity"

    Execute SCCs or equivalent safeguards for non-adequate transfers.

    **Implementation**: Use latest SCCs (EU SCCs, UK IDTA). Conduct Transfer Impact Assessments. Implement supplementary measures where needed.

| Check ID | Description |
|----------|-------------|
| PRIV-XBT-03-C1 | SCCs executed for all non-adequate transfers |
| PRIV-XBT-03-C2 | Transfer Impact Assessments conducted |
| PRIV-XBT-03-C3 | Supplementary measures implemented where needed |

### PRIV-XBT-04: Data Localization Requirements

!!! warning "High Severity"

    Identify and comply with data localization mandates.

    **Implementation**: Identify countries with localization requirements (China PIPL, Russia, India DPDPA). Implement technical controls ensuring data residency. Monitor regulatory changes.

| Check ID | Description |
|----------|-------------|
| PRIV-XBT-04-C1 | Data localization requirements identified per jurisdiction |
| PRIV-XBT-04-C2 | Technical controls enforce localization |

---

## Domain 9: Retention and Disposal (PRIV-RET)

### PRIV-RET-01: Retention Schedule

!!! danger "Critical Severity"

    Define and enforce data retention periods for each category of personal data.

    **Implementation**: Create schedule based on legal requirements, business needs, contractual obligations. Implement automated enforcement (TTL, scheduled deletion). Review annually.

| Check ID | Description |
|----------|-------------|
| PRIV-RET-01-C1 | Retention schedule documented per data category |
| PRIV-RET-01-C2 | Automated retention enforcement implemented |
| PRIV-RET-01-C3 | Retention schedule reviewed annually |

### PRIV-RET-02: Secure Disposal

!!! warning "High Severity"

    Implement secure disposal procedures for personal data that has exceeded retention.

    **Implementation**: Cryptographic erase, overwriting, secure deletion for digital data. Shredding, degaussing for physical media. Document disposal actions. Verify effectiveness.

| Check ID | Description |
|----------|-------------|
| PRIV-RET-02-C1 | Secure disposal procedures documented |
| PRIV-RET-02-C2 | Disposal actions logged and verified |

### PRIV-RET-03: Data Minimization

!!! note "Medium Severity"

    Collect and retain only the minimum personal data necessary for stated purposes.

    **Implementation**: Collect only necessary data. Field-level controls in forms. Periodic minimization reviews. Anonymize or delete unneeded data.

| Check ID | Description |
|----------|-------------|
| PRIV-RET-03-C1 | Data minimization principles applied to collection forms |
| PRIV-RET-03-C2 | Periodic minimization reviews conducted |

---

## Domain 10: Training and Awareness (PRIV-TRN)

### PRIV-TRN-01: Employee Privacy Training

!!! warning "High Severity"

    Provide privacy awareness training to all employees upon hire and at least annually.

    **Implementation**: Cover data handling, individual rights, breach reporting, data minimization, secure communication, applicable laws. Track completion. Annual refreshers.

| Check ID | Description |
|----------|-------------|
| PRIV-TRN-01-C1 | Privacy training provided on hire |
| PRIV-TRN-01-C2 | Annual refresher training completed by all staff |
| PRIV-TRN-01-C3 | Training completion tracked |

### PRIV-TRN-02: Specialized Role Training

!!! note "Medium Severity"

    Provide role-specific privacy training to personnel with specialized privacy responsibilities.

    **Implementation**: Identify roles (developers, sysadmins, support, HR, legal). Role-specific modules with hands-on exercises for DSAR processing and breach response.

| Check ID | Description |
|----------|-------------|
| PRIV-TRN-02-C1 | Specialized roles identified and documented |
| PRIV-TRN-02-C2 | Role-specific training modules delivered |

### PRIV-TRN-03: Privacy Awareness Program

!!! tip "Low Severity"

    Maintain ongoing privacy awareness activities beyond formal training.

    **Implementation**: Newsletters, awareness campaigns (Data Privacy Day), phishing simulations, privacy tips in internal communications. Measure through periodic assessments.

| Check ID | Description |
|----------|-------------|
| PRIV-TRN-03-C1 | Ongoing awareness activities conducted |
| PRIV-TRN-03-C2 | Awareness measured through periodic assessments |

---

!!! example "Exercise: Map Your Privacy Program"

    Use the 10 domains above to assess your current privacy program:

    | Domain | Controls | Implemented? | Gap |
    |--------|----------|-------------|-----|
    | Governance | 5 | | |
    | Data Inventory | 4 | | |
    | Consent | 4 | | |
    | Data Subject Rights | 6 | | |
    | Security | 4 | | |
    | Incident Management | 4 | | |
    | Vendor Management | 3 | | |
    | Cross-Border Transfers | 4 | | |
    | Retention | 3 | | |
    | Training | 3 | | |

    1. For each domain, mark how many controls you currently satisfy
    2. Identify the biggest gaps
    3. Prioritize: critical controls first, then high, then medium

!!! example "Exercise: Build a Data Flow Map"

    Pick a single processing activity in your project (e.g., user registration):

    1. What data is collected? (list every field)
    2. Where is it stored? (database, cache, logs)
    3. Who has access? (roles, teams, vendors)
    4. Where does it flow? (APIs, third parties, analytics)
    5. How long is it kept? (retention period)
    6. How is it deleted? (process, automation)

    Map this against PRIV-INV-01 and PRIV-INV-02 to identify gaps.
