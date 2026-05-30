import type { Scanner, Finding, ScanContext } from "./types.js";

export class DatabaseScanner implements Scanner {
  name = "database";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    this.checkSchemaPatterns(ctx, findings);
    this.checkORMConfig(ctx, findings);

    return findings;
  }

  private checkSchemaPatterns(ctx: ScanContext, findings: Finding[]): void {
    const requiredAuditColumns = ["created_at", "updated_at"];
    const recommendedAuditColumns = ["deleted_at", "created_by", "updated_by"];
    const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".prisma", ".sql"]);

    for (const [filePath, content] of ctx.fileContents) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!codeExtensions.has(ext)) continue;

      const hasTimestamps = /\b(?:timestamps|created_at|createdAt)\s*[:\(]/i.test(content);
      const hasSoftDelete = /\b(?:deleted_at|deletedAt|softDelete|paranoid)\s*[:\(]/i.test(content);
      const hasUserAudit = /\b(?:created_by|createdBy|updated_by|updatedBy)\s*[:\(]/i.test(content);

      if (/\b(?:model|schema|entity|table)\b.*\{/i.test(content) || /\bCREATE\s+TABLE\b/i.test(content)) {
        if (!hasTimestamps) {
          findings.push({
            ruleId: "DB-001",
            severity: "high",
            category: "database",
            title: "Missing audit timestamps in schema",
            description: "Database schema does not include created_at/updated_at timestamps. These are mandatory for audit trails.",
            file: filePath,
            evidence: "No created_at/updated_at columns detected",
            controlIds: ["GDPR-ART32-006"],
            fix: "Add created_at and updated_at columns to all tables. In Prisma: @@map, in Sequelize: timestamps: true.",
          });
        }

        if (!hasSoftDelete) {
          findings.push({
            ruleId: "DB-002",
            severity: "medium",
            category: "database",
            title: "Missing soft delete pattern",
            description: "No deleted_at column or soft delete pattern found. Hard deletes prevent audit trail and data recovery.",
            file: filePath,
            evidence: "No deleted_at/softDelete pattern detected",
            controlIds: ["GDPR-ART32-007"],
            fix: "Add deleted_at column. In Prisma: add DeletedAt DateTime?, in Sequelize: paranoid: true.",
          });
        }

        if (!hasUserAudit) {
          findings.push({
            ruleId: "DB-003",
            severity: "medium",
            category: "database",
            title: "Missing user audit columns",
            description: "No created_by/updated_by columns found. Track who makes changes for accountability.",
            file: filePath,
            evidence: "No created_by/updated_by columns detected",
            controlIds: ["GDPR-ART32-006"],
            fix: "Add created_by and updated_by columns to track which user made changes.",
          });
        }
      }
    }
  }

  private checkORMConfig(ctx: ScanContext, findings: Finding[]): void {
    const prismaSchema = ctx.fileContents.get("prisma/schema.prisma");
    if (prismaSchema) {
      if (!/@@map/i.test(prismaSchema) && !/model\s+Audit/i.test(prismaSchema)) {
        findings.push({
          ruleId: "DB-004",
          severity: "medium",
          category: "database",
          title: "No Audit model in Prisma schema",
          description: "Consider adding an Audit model for immutable audit logging.",
          file: "prisma/schema.prisma",
          evidence: "No Audit model found",
          controlIds: ["GDPR-ART32-006"],
          fix: "Add model Audit { id Int @id @default(autoincrement()) userId String action String resource String timestamp DateTime @default(now()) ipAddress String }",
        });
      }
    }
  }
}
