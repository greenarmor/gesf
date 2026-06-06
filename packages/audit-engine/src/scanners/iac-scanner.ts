import type { Scanner, Finding, ScanContext } from "./types.js";

const IAC_EXTENSIONS = new Set([".tf", ".tfvars", ".cfn", ".yaml", ".yml", ".json", ".dockerfile"]);

export class IaCScanner implements Scanner {
  name = "iac";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    this.checkTerraform(ctx, findings);
    this.checkS3Buckets(ctx, findings);
    this.checkSecurityGroups(ctx, findings);
    this.checkDatabases(ctx, findings);
    this.checkIAMPolicies(ctx, findings);
    this.checkKMSKeys(ctx, findings);

    return findings;
  }

  private checkTerraform(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf")) continue;

      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();

        if (line.includes("force_destroy") && line.includes("true")) {
          findings.push({
            ruleId: "IAC-001",
            severity: "medium",
            category: "infrastructure",
            title: "S3 bucket force_destroy enabled",
            description: "force_destroy will permanently delete all objects in the bucket when destroyed. This can cause unintended data loss.",
            file: filePath,
            line: i + 1,
            evidence: lines[i].trim(),
            controlIds: ["GDPR-ART32-008", "ISO27001-A17"],
            fix: "Set force_destroy to false unless this is a temporary bucket.",
          });
        }

        if (line.includes("0.0.0.0/0") && (line.includes("ingress") || line.includes("cidr_blocks"))) {
          findings.push({
            ruleId: "IAC-002",
            severity: "critical",
            category: "infrastructure",
            title: "Security group open to the entire internet (0.0.0.0/0)",
            description: "Security group rule allows traffic from any IP address. This exposes the resource to the entire internet.",
            file: filePath,
            line: i + 1,
            evidence: lines[i].trim(),
            controlIds: ["OWASP-ASVS-006", "ISO27001-A9"],
            fix: "Restrict cidr_blocks to specific IP ranges instead of 0.0.0.0/0.",
          });
        }

        if (line.includes("ssl") && (line.includes("false") || line.includes("disabled"))) {
          findings.push({
            ruleId: "IAC-003",
            severity: "high",
            category: "encryption",
            title: "SSL/TLS disabled on resource",
            description: "SSL/TLS is explicitly disabled. Data in transit will be unencrypted.",
            file: filePath,
            line: i + 1,
            evidence: lines[i].trim(),
            controlIds: ["GDPR-ART32-002", "HIPAA-164.312-e"],
            fix: "Enable SSL/TLS encryption for all data in transit.",
          });
        }
      }
    }
  }

  private checkS3Buckets(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf") && !filePath.endsWith(".yaml") && !filePath.endsWith(".yml")) continue;

      if (!content.includes("aws_s3_bucket") && !content.includes("AWS::S3::Bucket")) continue;

      if (content.includes("acl") && (content.match(/acl\s*=\s*["']public-read["']/) || content.match(/AccessControl.*PublicRead/))) {
        findings.push({
          ruleId: "IAC-004",
          severity: "critical",
          category: "infrastructure",
          title: "S3 bucket set to public-read",
          description: "S3 bucket ACL is set to public-read. Anyone on the internet can read the contents.",
          file: filePath,
          evidence: "acl = public-read or AccessControl: PublicRead",
          controlIds: ["GDPR-ART32-002", "OWASP-ASVS-006"],
          fix: "Set bucket ACL to private. Use presigned URLs for temporary access.",
        });
      }

      if (!content.includes("server_side_encryption") && !content.includes("BucketEncryption")) {
        findings.push({
          ruleId: "IAC-005",
          severity: "high",
          category: "encryption",
          title: "S3 bucket without server-side encryption",
          description: "S3 bucket does not have server-side encryption configured. Data at rest is unencrypted.",
          file: filePath,
          evidence: "No server_side_encryption or BucketEncryption block found",
          controlIds: ["GDPR-ART32-001", "HIPAA-164.312-a"],
          fix: "Add server_side_encryption_configuration with AES-256 or AWS KMS.",
        });
      }

      if (!content.includes("versioning") && !content.includes("VersioningConfiguration")) {
        findings.push({
          ruleId: "IAC-006",
          severity: "medium",
          category: "infrastructure",
          title: "S3 bucket without versioning",
          description: "S3 bucket does not have versioning enabled. Accidental deletions cannot be recovered.",
          file: filePath,
          evidence: "No versioning or VersioningConfiguration block found",
          controlIds: ["GDPR-ART32-008", "ISO27001-A8"],
          fix: "Enable versioning on the bucket to protect against accidental data loss.",
        });
      }
    }
  }

  private checkSecurityGroups(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf") && !filePath.endsWith(".yaml") && !filePath.endsWith(".yml")) continue;
      if (!content.includes("security") && !content.includes("SecurityGroup")) continue;

      const lines = content.split("\n");

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();

        if ((line.includes("from_port") && line.match(/\b22\b/)) || (line.includes("port") && line.match(/\b22\b/))) {
          const fullBlock = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 10)).join(" ").toLowerCase();
          if (fullBlock.includes("0.0.0.0/0")) {
            findings.push({
              ruleId: "IAC-007",
              severity: "critical",
              category: "infrastructure",
              title: "SSH (port 22) open to the internet",
              description: "Security group allows SSH access from 0.0.0.0/0. This is a common attack vector.",
              file: filePath,
              line: i + 1,
              evidence: lines[i].trim(),
              controlIds: ["OWASP-ASVS-006", "ISO27001-A9", "CIS-005"],
              fix: "Restrict SSH access to specific IP ranges or use a bastion host.",
            });
          }
        }

        if ((line.includes("from_port") && line.match(/\b3306\b/)) || (line.includes("port") && line.match(/\b3306\b/))) {
          const fullBlock = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 10)).join(" ").toLowerCase();
          if (fullBlock.includes("0.0.0.0/0")) {
            findings.push({
              ruleId: "IAC-008",
              severity: "critical",
              category: "infrastructure",
              title: "Database (port 3306) open to the internet",
              description: "Security group allows MySQL access from 0.0.0.0/0. Databases should never be publicly accessible.",
              file: filePath,
              line: i + 1,
              evidence: lines[i].trim(),
              controlIds: ["GDPR-ART32-002", "OWASP-ASVS-006"],
              fix: "Restrict database access to application servers only.",
            });
          }
        }

        if ((line.includes("from_port") && line.match(/\b5432\b/)) || (line.includes("port") && line.match(/\b5432\b/))) {
          const fullBlock = lines.slice(Math.max(0, i - 5), Math.min(lines.length, i + 10)).join(" ").toLowerCase();
          if (fullBlock.includes("0.0.0.0/0")) {
            findings.push({
              ruleId: "IAC-009",
              severity: "critical",
              category: "infrastructure",
              title: "Database (port 5432) open to the internet",
              description: "Security group allows PostgreSQL access from 0.0.0.0/0. Databases should never be publicly accessible.",
              file: filePath,
              line: i + 1,
              evidence: lines[i].trim(),
              controlIds: ["GDPR-ART32-002", "OWASP-ASVS-006"],
              fix: "Restrict database access to application servers only.",
            });
          }
        }
      }
    }
  }

  private checkDatabases(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf") && !filePath.endsWith(".yaml") && !filePath.endsWith(".yml")) continue;

      if (content.includes("aws_db_instance") || content.includes("aws_rds_cluster") || content.includes("AWS::RDS::DBInstance")) {
        if (content.includes("publicly_accessible") && content.match(/publicly_accessible\s*=\s*true/)) {
          findings.push({
            ruleId: "IAC-010",
            severity: "critical",
            category: "infrastructure",
            title: "RDS instance publicly accessible",
            description: "Database instance is configured as publicly accessible. This exposes the database to the internet.",
            file: filePath,
            evidence: "publicly_accessible = true",
            controlIds: ["GDPR-ART32-002", "OWASP-ASVS-006"],
            fix: "Set publicly_accessible to false. Use VPC-only access.",
          });
        }

        if (!content.includes("storage_encrypted") && !content.includes("StorageEncrypted")) {
          findings.push({
            ruleId: "IAC-011",
            severity: "high",
            category: "encryption",
            title: "RDS instance without encryption at rest",
            description: "Database instance does not have storage encryption enabled. Data at rest is unencrypted.",
            file: filePath,
            evidence: "No storage_encrypted or StorageEncrypted property found",
            controlIds: ["GDPR-ART32-001", "HIPAA-164.312-a"],
            fix: "Set storage_encrypted = true or enable StorageEncrypted.",
          });
        }

        if (!content.includes("deletion_protection") || content.match(/deletion_protection\s*=\s*false/)) {
          findings.push({
            ruleId: "IAC-012",
            severity: "medium",
            category: "infrastructure",
            title: "RDS instance without deletion protection",
            description: "Database instance does not have deletion protection enabled. Accidental deletion can cause data loss.",
            file: filePath,
            evidence: "deletion_protection missing or set to false",
            controlIds: ["GDPR-ART32-008"],
            fix: "Set deletion_protection = true for production databases.",
          });
        }
      }
    }
  }

  private checkIAMPolicies(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf") && !filePath.endsWith(".json") && !filePath.endsWith(".yaml") && !filePath.endsWith(".yml")) continue;

      if (content.includes("Action") && content.includes("Resource")) {
        if (content.includes('"*"') && content.match(/Action.*\*/)) {
          findings.push({
            ruleId: "IAC-013",
            severity: "high",
            category: "infrastructure",
            title: "IAM policy with wildcard action",
            description: "IAM policy grants all actions (*). This violates least privilege principle.",
            file: filePath,
            evidence: "Action = * grants full access",
            controlIds: ["OWASP-ASVS-003", "ISO27001-A9", "CIS-005"],
            fix: "Restrict IAM actions to only those required for the role.",
          });
        }

        if (content.match(/Resource.*\*/) && content.includes("arn:aws")) {
          findings.push({
            ruleId: "IAC-014",
            severity: "medium",
            category: "infrastructure",
            title: "IAM policy with wildcard resource",
            description: "IAM policy applies to all resources (*). This is overly permissive.",
            file: filePath,
            evidence: "Resource = * applies to all resources",
            controlIds: ["OWASP-ASVS-003", "ISO27001-A9"],
            fix: "Specify exact resource ARNs instead of using wildcard.",
          });
        }
      }
    }
  }

  private checkKMSKeys(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!filePath.endsWith(".tf")) continue;

      if (content.includes("aws_kms_key")) {
        if (content.match(/enable_key_rotation\s*=\s*false/) || !content.includes("enable_key_rotation")) {
          findings.push({
            ruleId: "IAC-015",
            severity: "medium",
            category: "encryption",
            title: "KMS key without rotation",
            description: "KMS key does not have automatic key rotation enabled. Using the same key long-term increases risk.",
            file: filePath,
            evidence: "enable_key_rotation missing or set to false",
            controlIds: ["GDPR-ART32-001", "ISO27001-A10"],
            fix: "Set enable_key_rotation = true on KMS keys.",
          });
        }
      }
    }
  }
}
