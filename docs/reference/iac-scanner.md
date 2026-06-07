# IaC Scanner

The Infrastructure-as-Code (IaC) scanner analyzes Terraform (`.tf`), CloudFormation (`.yaml`/`.yml`/`.json`), and Docker configurations for security misconfigurations that could expose your infrastructure to attack.

## Overview

The IaC scanner runs automatically as part of `ges audit`. It checks 15 rules across 6 categories:

| Category | Rules | What It Checks |
|----------|-------|---------------|
| S3 Buckets | IAC-004, IAC-005, IAC-006 | Public access, encryption, versioning |
| Security Groups | IAC-002, IAC-007, IAC-008, IAC-009 | Open ports, public exposure |
| Databases (RDS) | IAC-010, IAC-011, IAC-012 | Public access, encryption, deletion protection |
| IAM Policies | IAC-013, IAC-014 | Wildcard actions and resources |
| KMS Keys | IAC-015 | Key rotation |
| Terraform General | IAC-001, IAC-003 | Force destroy, SSL/TLS |

## Supported File Types

| Format | Extensions |
|--------|-----------|
| Terraform | `.tf`, `.tfvars` |
| CloudFormation | `.yaml`, `.yml`, `.json` (with `AWS::` resource types) |
| Dockerfile | `Dockerfile`, `docker-compose.yml` |

## Rule Reference

### IAC-001: S3 Bucket force_destroy Enabled

**Severity:** Medium  
**Controls:** GDPR-ART32-008, ISO27001-A17

Detects when `force_destroy` is set to `true` on an S3 bucket, which will permanently delete all objects when the bucket is destroyed.

```hcl title="main.tf" hl_lines="4"
resource "aws_s3_bucket" "data" {
  bucket = "my-data-bucket"
  force_destroy = true
}
```

**Fix:** Set `force_destroy = false` unless the bucket is temporary.

---

### IAC-002: Security Group Open to 0.0.0.0/0

**Severity:** Critical  
**Controls:** OWASP-ASVS-006, ISO27001-A9

Detects security group ingress rules that allow traffic from any IP address.

```hcl title="main.tf" hl_lines="4"
resource "aws_security_group" "web" {
  ingress {
    cidr_blocks = ["0.0.0.0/0"]
    from_port   = 443
    to_port     = 443
  }
}
```

**Fix:** Restrict `cidr_blocks` to specific IP ranges.

---

### IAC-003: SSL/TLS Disabled

**Severity:** High  
**Controls:** GDPR-ART32-002, HIPAA-164.312-e

Detects resources where SSL/TLS is explicitly disabled.

```hcl title="main.tf" hl_lines="3"
resource "aws_elasticsearch_domain" "search" {
  domain_name = "search"
  ssl_enabled = false
}
```

**Fix:** Enable SSL/TLS encryption for all data in transit.

---

### IAC-004: S3 Bucket Set to public-read

**Severity:** Critical  
**Controls:** GDPR-ART32-002, OWASP-ASVS-006

Detects S3 buckets with public-read ACLs.

```hcl title="main.tf" hl_lines="3"
resource "aws_s3_bucket" "uploads" {
  bucket = "my-uploads"
  acl    = "public-read"
}
```

**Fix:** Set bucket ACL to `private`. Use presigned URLs for temporary access.

---

### IAC-005: S3 Bucket Without Server-Side Encryption

**Severity:** High  
**Controls:** GDPR-ART32-001, HIPAA-164.312-a

Detects S3 buckets without server-side encryption configured.

```hcl title="main.tf"
resource "aws_s3_bucket" "data" {
  bucket = "my-data"
  # Missing server_side_encryption_configuration
}
```

**Fix:** Add server-side encryption:

```hcl title="main.tf"
resource "aws_s3_bucket_server_side_encryption_configuration" "data" {
  bucket = aws_s3_bucket.data.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}
```

---

### IAC-006: S3 Bucket Without Versioning

**Severity:** Medium  
**Controls:** GDPR-ART32-008, ISO27001-A8

Detects S3 buckets without versioning enabled.

**Fix:** Enable versioning to protect against accidental data loss:

```hcl
resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id
  versioning_configuration {
    status = "Enabled"
  }
}
```

---

### IAC-007: SSH (Port 22) Open to the Internet

**Severity:** Critical  
**Controls:** OWASP-ASVS-006, ISO27001-A9, CIS-005

Detects security groups allowing SSH from `0.0.0.0/0`.

```hcl title="main.tf" hl_lines="4"
resource "aws_security_group" "ssh" {
  ingress {
    from_port   = 22
    to_port     = 22
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

**Fix:** Restrict SSH to specific IPs or use a bastion host.

---

### IAC-008: MySQL (Port 3306) Open to the Internet

**Severity:** Critical  
**Controls:** GDPR-ART32-002, OWASP-ASVS-006

Detects security groups allowing MySQL access from `0.0.0.0/0`.

**Fix:** Restrict database access to application servers only.

---

### IAC-009: PostgreSQL (Port 5432) Open to the Internet

**Severity:** Critical  
**Controls:** GDPR-ART32-002, OWASP-ASVS-006

Detects security groups allowing PostgreSQL access from `0.0.0.0/0`.

**Fix:** Restrict database access to application servers only.

---

### IAC-010: RDS Instance Publicly Accessible

**Severity:** Critical  
**Controls:** GDPR-ART32-002, OWASP-ASVS-006

Detects RDS instances with `publicly_accessible = true`.

```hcl title="main.tf" hl_lines="3"
resource "aws_db_instance" "db" {
  name                 = "mydb"
  publicly_accessible  = true
}
```

**Fix:** Set `publicly_accessible = false`. Use VPC-only access.

---

### IAC-011: RDS Instance Without Encryption at Rest

**Severity:** High  
**Controls:** GDPR-ART32-001, HIPAA-164.312-a

Detects RDS instances without storage encryption.

```hcl title="main.tf"
resource "aws_db_instance" "db" {
  name = "mydb"
  # Missing storage_encrypted = true
}
```

**Fix:** Set `storage_encrypted = true`.

---

### IAC-012: RDS Instance Without Deletion Protection

**Severity:** Medium  
**Controls:** GDPR-ART32-008

Detects RDS instances without deletion protection.

**Fix:** Set `deletion_protection = true` for production databases.

---

### IAC-013: IAM Policy with Wildcard Action

**Severity:** High  
**Controls:** OWASP-ASVS-003, ISO27001-A9, CIS-005

Detects IAM policies that grant all actions (`Action = *`).

```json title="policy.json" hl_lines="4"
{
  "Statement": [
    {
      "Action": "*",
      "Resource": "*"
    }
  ]
}
```

**Fix:** Restrict IAM actions to only those required.

---

### IAC-014: IAM Policy with Wildcard Resource

**Severity:** Medium  
**Controls:** OWASP-ASVS-003, ISO27001-A9

Detects IAM policies that apply to all resources (`Resource = *`).

**Fix:** Specify exact resource ARNs.

---

### IAC-015: KMS Key Without Rotation

**Severity:** Medium  
**Controls:** GDPR-ART32-001, ISO27001-A10

Detects KMS keys without automatic key rotation.

```hcl title="main.tf"
resource "aws_kms_key" "main" {
  # Missing enable_key_rotation = true
}
```

**Fix:** Set `enable_key_rotation = true`.

---

## Compliance Control Mapping

IaC findings map to multiple compliance frameworks:

| Framework | Controls Referenced |
|-----------|-------------------|
| GDPR | ART32-001 (encryption), ART32-002 (security), ART32-008 (backup/recovery) |
| HIPAA | 164.312-a (access control), 164.312-e (transmission security) |
| OWASP | ASVS-003 (access control), ASVS-006 (infrastructure) |
| ISO 27001 | A8 (assets), A9 (access), A10 (crypto), A17 (availability) |
| CIS | CIS-005 (network security) |

!!! example "Exercise: Scan a Vulnerable Terraform Project"

    1. Create a test project:

    ```bash
    mkdir /tmp/iac-test && cd /tmp/iac-test
    echo '{"name":"iac-test","version":"1.0.0"}' > package.json
    ges init -n "IaC Test" -t generic-web-application -f "GDPR,OWASP"
    ```

    2. Create a vulnerable Terraform file:

    ```hcl title="main.tf"
    # S3 bucket with multiple issues
    resource "aws_s3_bucket" "data" {
      bucket         = "my-sensitive-data"
      acl            = "public-read"
      force_destroy  = true
      # No encryption
      # No versioning
    }

    # Security group open to the world
    resource "aws_security_group" "web" {
      ingress {
        from_port   = 22
        to_port     = 22
        protocol    = "tcp"
        cidr_blocks = ["0.0.0.0/0"]
      }
    }

    # RDS open to the world without encryption
    resource "aws_db_instance" "db" {
      publicly_accessible = true
      # No storage_encrypted
      # No deletion_protection
    }

    # Overly permissive IAM
    resource "aws_iam_role_policy" "admin" {
      policy = jsonencode({
        Statement = [{
          Action   = "*"
          Resource = "*"
        }]
      })
    }
    ```

    3. Run the audit:

    ```bash
    ges audit
    ```

    4. Count the IaC findings — you should see rules IAC-001 through IAC-015 triggered

    5. Fix each issue one by one and re-run `ges audit` to watch findings disappear

    !!! question "Questions"
        - Which IaC finding is the most dangerous?
        - How many compliance frameworks does each finding affect?
        - What is the minimum set of changes to get the Terraform file to pass?
