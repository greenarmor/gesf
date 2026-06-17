import type { ProjectType, ProjectConfig } from "@greenarmor/ges-core";
import { GESF_VERSION, GES_DIR, COMPLIANCE_DIR, SECURITY_DIR, CONTROLS_DIR, POLICIES_DIR, CHECKLISTS_DIR, DOCS_DIR, REPORTS_DIR } from "@greenarmor/ges-core";
import * as fs from "node:fs";
import * as path from "node:path";

export interface GeneratedFile {
  filePath: string;
  content: string;
}

export function generateComplianceDocs(projectName: string, projectType: ProjectType): GeneratedFile[] {
  return [
    {
      filePath: path.join(COMPLIANCE_DIR, "gdpr.md"),
      content: generateGDPRDoc(projectName, projectType),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "data-inventory.md"),
      content: generateDataInventoryDoc(projectName),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "retention-policy.md"),
      content: generateRetentionPolicyDoc(projectName),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "processing-records.md"),
      content: generateProcessingRecordsDoc(projectName),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "risk-register.md"),
      content: generateRiskRegisterDoc(projectName),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "access-control-matrix.md"),
      content: generateAccessControlMatrixDoc(projectName),
    },
    {
      filePath: path.join(COMPLIANCE_DIR, "privacy-impact-assessment.md"),
      content: generatePIADoc(projectName, projectType),
    },
  ];
}

export function generateSecurityDocs(projectName: string, projectType: ProjectType): GeneratedFile[] {
  return [
    {
      filePath: path.join(SECURITY_DIR, "threat-model.md"),
      content: generateThreatModelDoc(projectName, projectType),
    },
    {
      filePath: path.join(SECURITY_DIR, "key-management.md"),
      content: generateKeyManagementDoc(projectName),
    },
    {
      filePath: path.join(SECURITY_DIR, "logging-policy.md"),
      content: generateLoggingPolicyDoc(projectName),
    },
    {
      filePath: path.join(SECURITY_DIR, "backup-policy.md"),
      content: generateBackupPolicyDoc(projectName),
    },
    {
      filePath: path.join(SECURITY_DIR, "incident-response.md"),
      content: generateIncidentResponseDoc(projectName),
    },
    {
      filePath: path.join(SECURITY_DIR, "disaster-recovery.md"),
      content: generateDisasterRecoveryDoc(projectName),
    },
    {
      filePath: path.join(SECURITY_DIR, "encryption-standard.md"),
      content: generateEncryptionStandardDoc(projectName),
    },
  ];
}

export function generateConfigYaml(config: ProjectConfig): GeneratedFile {
  return {
    filePath: path.join(GES_DIR, "config.yaml"),
    content: [
      `project_name: ${config.project_name}`,
      `project_type: ${config.project_type}`,
      `version: ${config.version}`,
      `created_at: ${config.created_at}`,
      ``,
      `frameworks:`,
      ...config.frameworks.map(f => `  - ${f}`),
      ``,
      `requirements:`,
      ...Object.entries(config.requirements).map(([key, val]) => [
        `  ${key}:`,
        `    required: ${val.required}`,
        val.level ? `    level: ${val.level}` : null,
      ].filter(Boolean).join("\n")),
    ].join("\n"),
  };
}

export function generateMetadataJson(config: ProjectConfig): GeneratedFile {
  const meta: Record<string, string> = {
    project_name: config.project_name,
    project_type: config.project_type,
    initialized_at: config.created_at,
    gesf_version: GESF_VERSION,
  };
  if (config.country) {
    meta.country = config.country;
  }
  return {
    filePath: path.join(GES_DIR, "metadata.json"),
    content: JSON.stringify(meta, null, 2),
  };
}

export function generateConfigJson(config: ProjectConfig): GeneratedFile {
  return {
    filePath: path.join(GES_DIR, "config.json"),
    content: JSON.stringify(config, null, 2),
  };
}

export function generateFrameworkVersionJson(): GeneratedFile {
  return {
    filePath: path.join(GES_DIR, "framework-version.json"),
    content: JSON.stringify({
      gesf_version: GESF_VERSION,
      packs: {
        gdpr: "1.0.0",
        owasp: "1.0.0",
        ai: "1.0.0",
        blockchain: "1.0.0",
        government: "1.0.0",
        cis: "1.0.0",
        nist: "1.0.0",
      },
    }, null, 2),
  };
}

export function generateScoreJson(): GeneratedFile {
  return {
    filePath: path.join(GES_DIR, "score.json"),
    content: JSON.stringify({
      overall: 0,
      frameworks: {},
      evaluated_at: new Date().toISOString(),
    }, null, 2),
  };
}

function generateGDPRDoc(name: string, type: ProjectType): string {
  return `# GDPR Compliance - ${name}

## Overview

This document tracks GDPR compliance for the **${name}** project (type: ${type}).

## Applicable Articles

- Article 5: Principles relating to processing of personal data
- Article 25: Data protection by design and by default
- Article 30: Records of processing activities
- Article 32: Security of processing
- Article 33: Notification of a personal data breach to the supervisory authority
- Article 34: Communication of a personal data breach to the data subject

## Status

> Run \`ges audit\` to evaluate current compliance status.

## Legal Basis

Document the legal basis for each processing activity:
- [ ] Consent
- [ ] Contract
- [ ] Legal obligation
- [ ] Vital interests
- [ ] Public task
- [ ] Legitimate interests

## Data Subject Rights

Ensure mechanisms exist for:
- [ ] Right of access (Article 15)
- [ ] Right to rectification (Article 16)
- [ ] Right to erasure (Article 17)
- [ ] Right to restriction (Article 18)
- [ ] Right to data portability (Article 20)
- [ ] Right to object (Article 21)
`;
}

function generateDataInventoryDoc(name: string): string {
  return `# Data Inventory - ${name}

## Data Categories

| Category | Type | Classification | Retention | Legal Basis |
|----------|------|---------------|-----------|-------------|
| User profiles | Personal | Restricted | Account lifetime + 30 days | Contract |
| Email addresses | Personal | Confidential | Account lifetime + 30 days | Contract |
| Authentication data | Personal | Restricted | Session duration | Contract |
| Audit logs | Operational | Internal | 1 year | Legal obligation |

## Data Flows

Document all data flows including:
- Data collection points
- Processing activities
- Data storage locations
- Third-party data sharing
- Cross-border transfers

## Third-Party Processors

| Processor | Purpose | Data Shared | DPA Signed | Location |
|-----------|---------|-------------|------------|----------|
| | | | | |
`;
}

function generateRetentionPolicyDoc(name: string): string {
  return `# Data Retention Policy - ${name}

## Retention Periods

| Data Category | Retention Period | Justification | Deletion Method |
|---------------|-----------------|---------------|-----------------|
| User accounts | Account lifetime + 30 days | Contract fulfillment | Automated deletion |
| Authentication logs | 90 days | Security monitoring | Automated rotation |
| Audit logs | 1 year | Legal obligation | Automated archival |
| Session data | Session duration | Operational | Automatic expiry |
| Backup data | 90 days | Disaster recovery | Automated rotation |

## Deletion Procedures

1. Automated deletion via scheduled jobs
2. Soft delete with scheduled hard delete
3. Anonymisation where deletion is not feasible
4. Backup exclusion for deleted records

## Review Schedule

- Monthly: Review deletion jobs
- Quarterly: Review retention periods
- Annually: Full retention policy review
`;
}

function generateProcessingRecordsDoc(name: string): string {
  return `# Records of Processing Activities - ${name}

## Article 30 Requirements

### Controller Information

- **Organization**: [To be completed]
- **Contact**: [To be completed]
- **DPO**: [To be completed]

### Processing Activities

| Activity | Purpose | Data Categories | Recipients | Retention | Transfers | Security Measures |
|----------|---------|----------------|------------|-----------|-----------|-------------------|
| | | | | | | |

## Documentation

Each processing activity must document:
1. Purpose of processing
2. Legal basis
3. Categories of data subjects
4. Categories of personal data
5. Categories of recipients
6. International transfers
7. Retention periods
8. Technical and organisational security measures
`;
}

function generateRiskRegisterDoc(name: string): string {
  return `# Risk Register - ${name}

## Risk Assessment

| ID | Risk | Likelihood | Impact | Severity | Mitigation | Status |
|----|------|-----------|--------|----------|------------|--------|
| R001 | Data breach - unauthorized access | Medium | High | Critical | Encryption, access controls, MFA | Open |
| R002 | Data breach - external attack | Medium | High | Critical | WAF, vulnerability scanning, patching | Open |
| R003 | Insider threat | Low | High | High | RBAC, audit logging, least privilege | Open |
| R004 | Data loss | Low | Critical | Critical | Backups, disaster recovery plan | Open |
| R005 | Non-compliance | Medium | High | High | Regular audits, compliance scanning | Open |

## Review Schedule

- Monthly: Update risk register
- Quarterly: Risk assessment review
- Annually: Full risk assessment
`;
}

function generateAccessControlMatrixDoc(name: string): string {
  return `# Access Control Matrix - ${name}

## Roles

| Role | Description |
|------|-------------|
| Admin | Full system access with audit trail |
| User | Standard user access |
| Auditor | Read-only access to audit data |
| System | Service account for automated processes |

## Permissions Matrix

| Resource | Admin | User | Auditor | System |
|----------|-------|------|---------|--------|
| User Management | CRUD | R (own) | R | R |
| Data Access | CRUD | CR (own) | R | CR |
| Audit Logs | R | - | R | W |
| Configuration | CRUD | - | R | R |
| Reports | CRUD | R (own) | R | CR |

## Principles

- **Least Privilege**: Users have minimum required access
- **Deny by Default**: Access denied unless explicitly granted
- **Separation of Duties**: Critical operations require multiple roles
`;
}

function generatePIADoc(name: string, type: ProjectType): string {
  return `# Privacy Impact Assessment - ${name}

## Project Details

- **Project**: ${name}
- **Type**: ${type}
- **Assessment Date**: ${new Date().toISOString().split("T")[0]}
- **Assessor**: [To be completed]

## Data Processing Description

### What data is being processed?
[To be completed]

### Why is the data being processed?
[To be completed]

### How is the data being processed?
[To be completed]

### Where is the data stored?
[To be completed]

### Who has access?
[To be completed]

### How long is data retained?
[To be completed]

## Necessity and Proportionality

- [ ] Data processing is necessary for the stated purpose
- [ ] Data minimisation principles are applied
- [ ] No less intrusive alternative exists

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| Unauthorized access to personal data | High | Encryption, MFA, RBAC |
| Data breach | High | Security controls, incident response plan |
| Excessive data collection | Medium | Data minimisation review |
| Non-compliant data transfer | Medium | Transfer mechanisms in place |

## Compliance Measures

- [ ] Legal basis documented
- [ ] Privacy notice provided
- [ ] Consent mechanism implemented
- [ ] Data subject rights supported
- [ ] Retention policy defined
- [ ] Security measures implemented
- [ ] DPIA completed (if required)

## Approval

- **DPO Review**: [Pending]
- **Sign-off**: [Pending]
`;
}

function generateThreatModelDoc(name: string, type: ProjectType): string {
  return `# Threat Model - ${name}

## System Overview

- **Project**: ${name}
- **Type**: ${type}

## Assets

- User personal data
- Authentication credentials
- Session tokens
- API keys and secrets
- Application source code
- Infrastructure configuration

## Threat Categories (STRIDE)

### Spoofing
- Unauthorized access via stolen credentials
- Session hijacking

### Tampering
- Data modification by unauthorized users
- SQL injection / NoSQL injection
- Parameter tampering

### Repudiation
- Actions performed without audit trail
- Denial of data access

### Information Disclosure
- Data breach via API vulnerability
- Logging of sensitive data
- Error messages leaking information

### Denial of Service
- Rate limiting bypass
- Resource exhaustion

### Elevation of Privilege
- Role escalation via API
- IDOR vulnerabilities
- JWT manipulation

## Mitigations

| Threat | Mitigation | Status |
|--------|------------|--------|
| Stolen credentials | MFA, Argon2id hashing | [ ] |
| SQL injection | Parameterized queries, input validation | [ ] |
| XSS | Output encoding, CSP headers | [ ] |
| CSRF | CSRF tokens, SameSite cookies | [ ] |
| Data breach | Encryption at rest and in transit | [ ] |
| Insider threat | RBAC, audit logging, least privilege | [ ] |
`;
}

function generateKeyManagementDoc(name: string): string {
  return `# Key Management Policy - ${name}

## Approved Algorithms

- **Symmetric Encryption**: AES-256-GCM, ChaCha20-Poly1305
- **Asymmetric Encryption**: RSA-4096, Ed25519
- **Hashing**: SHA-256, SHA-384, SHA-512
- **Password Hashing**: Argon2id (recommended), bcrypt

## Key Lifecycle

1. **Generation**: Use cryptographically secure random generators
2. **Distribution**: Via secure key management system
3. **Storage**: Encrypted at rest, access controlled
4. **Rotation**: Regular rotation schedule (90 days minimum)
5. **Revocation**: Immediate revocation capability
6. **Destruction**: Secure deletion with verification

## Key Storage

- [ ] HashiCorp Vault
- [ ] AWS KMS
- [ ] Azure Key Vault
- [ ] GCP Secret Manager

## Rotation Schedule

| Key Type | Rotation Period |
|----------|----------------|
| Encryption keys | 90 days |
| API keys | 180 days |
| TLS certificates | 90 days (auto-renew) |
| Database credentials | 90 days |
`;
}

function generateLoggingPolicyDoc(name: string): string {
  return `# Logging Policy - ${name}

## Must Log

- Authentication events (success and failure)
- Authorization decisions (access granted/denied)
- Data export operations
- Role and permission changes
- Administrative actions
- API access (method, path, status code)

## Must NOT Log

- Passwords (even hashed)
- Authentication tokens
- Private keys
- Sensitive personal data (SSN, health data, etc.)
- Full credit card numbers
- Session cookies

## Audit Trail Fields

Every audit log entry must include:
- \`userId\`: Who performed the action
- \`action\`: What action was performed
- \`resource\`: What resource was affected
- \`timestamp\`: When the action occurred (ISO 8601)
- \`ipAddress\`: Source IP address

## Log Retention

| Log Type | Retention Period |
|----------|-----------------|
| Audit logs | 1 year |
| Security logs | 90 days |
| Access logs | 30 days |
| Error logs | 30 days |

## Immutability

All audit logs must be append-only. No modification or deletion is permitted.
`;
}

function generateBackupPolicyDoc(name: string): string {
  return `# Backup Policy - ${name}

## Backup Schedule

- **Daily**: Full database backup at 02:00 UTC
- **Hourly**: Incremental backup of critical data
- **Weekly**: Full system backup including configuration

## Backup Requirements

- [ ] All backups are encrypted (AES-256-GCM)
- [ ] Backups stored in separate geographic region
- [ ] Backup access restricted to authorized personnel
- [ ] Backup integrity verified after creation

## Restore Testing

- **Weekly**: Restore test to staging environment
- **Monthly**: Full recovery test with data verification

## Recovery Objectives

- **RPO (Recovery Point Objective)**: 1 hour
- **RTO (Recovery Time Objective)**: 4 hours

## Backup Inventory

| System | Schedule | Encryption | Last Restore Test |
|--------|----------|------------|-------------------|
| Database | Daily | AES-256-GCM | [Pending] |
| File Storage | Daily | AES-256-GCM | [Pending] |
| Configuration | Weekly | AES-256-GCM | [Pending] |
`;
}

function generateIncidentResponseDoc(name: string): string {
  return `# Incident Response Plan - ${name}

## Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 - Critical | Active data breach, system compromise | 15 minutes |
| P2 - High | Vulnerability being exploited, data at risk | 1 hour |
| P3 - Medium | Vulnerability identified, no active exploit | 4 hours |
| P4 - Low | Security improvement needed | 24 hours |

## Response Process

### 1. Detection and Reporting
- Automated monitoring alerts
- Team member reports
- External vulnerability reports

### 2. Assessment
- Determine severity level
- Identify affected systems and data
- Assess impact on personal data

### 3. Containment
- Isolate affected systems
- Preserve evidence
- Prevent further data loss

### 4. Eradication
- Remove threat
- Patch vulnerabilities
- Rotate compromised credentials

### 5. Recovery
- Restore from clean backups
- Verify system integrity
- Resume normal operations

### 6. Post-Incident
- Document lessons learned
- Update security controls
- Review and update incident response plan

## GDPR Breach Notification

- **72 hours**: Notify supervisory authority (Article 33)
- **Without undue delay**: Notify affected data subjects if high risk (Article 34)

## Contacts

| Role | Contact |
|------|---------|
| Incident Lead | [To be completed] |
| DPO | [To be completed] |
| Legal | [To be completed] |
| Supervisory Authority | [To be completed] |
`;
}

function generateDisasterRecoveryDoc(name: string): string {
  return `# Disaster Recovery Plan - ${name}

## Objectives

- **RPO (Recovery Point Objective)**: 1 hour
- **RTO (Recovery Time Objective)**: 4 hours

## Disaster Scenarios

| Scenario | Impact | Recovery Strategy |
|----------|--------|-------------------|
| Database failure | Critical | Failover to replica, restore from backup |
| Application server failure | High | Auto-scaling, deploy to new instances |
| Storage failure | High | Replicated storage, backup restore |
| Network failure | High | Multi-AZ deployment, CDN failover |
| Complete region failure | Critical | DR region activation |
| Ransomware | Critical | Isolated backups, clean restore |

## Recovery Procedures

### Database Recovery
1. Assess extent of failure
2. Activate replica if available
3. Restore from most recent backup
4. Verify data integrity
5. Resume application connectivity

### Application Recovery
1. Deploy to new infrastructure
2. Restore configuration from IaC
3. Verify all services operational
4. Run smoke tests
5. Open to traffic

## Testing Schedule

- **Monthly**: Component recovery tests
- **Quarterly**: Full DR scenario test
- **Annually**: Complete DR exercise with stakeholders
`;
}

function generateEncryptionStandardDoc(name: string): string {
  return `# Encryption Standard - ${name}

## Approved Algorithms

### Data at Rest
- **Primary**: AES-256-GCM
- **Alternative**: ChaCha20-Poly1305

### Data in Transit
- **Preferred**: TLS 1.3
- **Minimum**: TLS 1.2
- **Prohibited**: TLS 1.0, TLS 1.1, SSL

### Password Hashing
- **Required**: Argon2id
- **Parameters**: memory=65536, iterations=3, parallelism=4
- **Prohibited**: MD5, SHA1, plain text

### Key Hashing
- SHA-256 minimum
- HMAC for message authentication

## Implementation Requirements

- [ ] All databases encrypted at rest
- [ ] All file storage encrypted
- [ ] All API communications over TLS 1.2+
- [ ] All backups encrypted
- [ ] HSTS headers configured
- [ ] Certificate pinning for mobile clients
`;
}
