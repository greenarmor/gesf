import { describe, it, expect } from "vitest";
import { IaCScanner } from "./iac-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: ".",
    files: Object.keys(files),
    fileContents,
  };
}

describe("IaCScanner", () => {
  const scanner = new IaCScanner();

  it("has name iac", () => {
    expect(scanner.name).toBe("iac");
  });

  it("detects public S3 bucket ACL", () => {
    const ctx = makeCtx({
      "main.tf": `resource "aws_s3_bucket" "data" {
  bucket = "my-bucket"
  acl    = "public-read"
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-004")).toBe(true);
  });

  it("detects S3 bucket without encryption", () => {
    const ctx = makeCtx({
      "main.tf": `resource "aws_s3_bucket" "data" {
  bucket = "my-bucket"
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-005")).toBe(true);
  });

  it("does not flag encrypted S3 bucket", () => {
    const ctx = makeCtx({
      "main.tf": `resource "aws_s3_bucket" "data" {
  bucket = "my-bucket"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-005")).toBe(false);
  });

  it("detects SSH open to internet", () => {
    const ctx = makeCtx({
      "sg.tf": `resource "aws_security_group" "web" {
  ingress {
    from_port = 22
    to_port = 22
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-007")).toBe(true);
  });

  it("detects MySQL open to internet", () => {
    const ctx = makeCtx({
      "sg.tf": `resource "aws_security_group" "db" {
  ingress {
    from_port = 3306
    to_port = 3306
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-008")).toBe(true);
  });

  it("detects RDS publicly accessible", () => {
    const ctx = makeCtx({
      "db.tf": `resource "aws_db_instance" "main" {
  engine = "mysql"
  publicly_accessible = true
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-010")).toBe(true);
  });

  it("detects RDS without encryption", () => {
    const ctx = makeCtx({
      "db.tf": `resource "aws_db_instance" "main" {
  engine = "mysql"
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-011")).toBe(true);
  });

  it("detects IAM wildcard action", () => {
    const ctx = makeCtx({
      "policy.tf": `resource "aws_iam_role_policy" "example" {
  policy = jsonencode({
    Statement = [{
      Action = "*"
      Effect = "Allow"
      Resource = "*"
    }]
  })
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-013")).toBe(true);
  });

  it("detects KMS key without rotation", () => {
    const ctx = makeCtx({
      "kms.tf": `resource "aws_kms_key" "main" {
  description = "My key"
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-015")).toBe(true);
  });

  it("detects force_destroy on S3", () => {
    const ctx = makeCtx({
      "main.tf": `resource "aws_s3_bucket" "temp" {
  bucket = "temp-bucket"
  force_destroy = true
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.ruleId === "IAC-001")).toBe(true);
  });

  it("returns no findings for clean Terraform", () => {
    const ctx = makeCtx({
      "main.tf": `resource "aws_s3_bucket" "data" {
  bucket = "my-bucket"
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
  versioning {
    enabled = true
  }
}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("returns empty for non-IaC files", () => {
    const ctx = makeCtx({
      "app.ts": 'const x = "hello";',
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });
});
