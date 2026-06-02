import type { Scanner, Finding, ScanContext } from "./types.js";

const DB_SCHEMA_EXTENSIONS = new Set([
  ".prisma", ".sql",
]);

const DB_SCHEMA_FILENAMES = [
  /(?:^|[\/\\])(?:schema|migration|knexfile|drizzle\.config|database\.conf)/i,
];

const DB_DIR_INDICATORS = [
  /[\/\\](?:migrations?|models?|entities?|repositories?|schemas?|db|database)[\/\\]/i,
];

const ORM_ENTITY_PATTERNS: Record<string, RegExp> = {
  ".ts": /(?:@Entity|@Table|@Schema|BaseModel)\s*\(|(?:Model|Entity|Schema)\s+extends\s+|Schema\s*=\s*new\s+mongoose\.Schema/i,
  ".js": /(?:@Entity|@Table|@Schema|BaseModel)\s*\(/,
  ".py": /class\s+\w+\s*\(\s*(?:models\.Model|Base|declarative_base)\)/i,
  ".rb": /class\s+\w+\s*<\s*(?:ApplicationRecord|ActiveRecord::Base)/i,
  ".go": /type\s+\w+\s+struct\s*\{[\s\S]*?gorm/i,
  ".java": /@Entity\s*(?:public\s+)?class/i,
  ".php": /class\s+\w+\s+extends\s+(?:Model|Eloquent|Doctrine)/i,
};

function isDatabaseSchemaFile(filePath: string, content: string): boolean {
  const ext = filePath.substring(filePath.lastIndexOf("."));
  const basename = filePath.substring(filePath.lastIndexOf("/") + 1);

  if (DB_SCHEMA_EXTENSIONS.has(ext)) return true;

  for (const pattern of DB_SCHEMA_FILENAMES) {
    if (pattern.test(basename)) return true;
  }

  for (const pattern of DB_DIR_INDICATORS) {
    if (pattern.test(filePath)) return true;
  }

  const ormPattern = ORM_ENTITY_PATTERNS[ext];
  if (ormPattern && ormPattern.test(content)) return true;

  return false;
}

export class DatabaseScanner implements Scanner {
  name = "database";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    this.checkSchemaPatterns(ctx, findings);
    this.checkORMConfig(ctx, findings);

    return findings;
  }

  private checkSchemaPatterns(ctx: ScanContext, findings: Finding[]): void {
    for (const [filePath, content] of ctx.fileContents) {
      if (!isDatabaseSchemaFile(filePath, content)) continue;

      const hasTimestamps = /\b(?:timestamps|created_at|createdAt|createdDate|date_created|timecreated|createdTime)\s*[:\(]/i.test(content);
      const hasSoftDelete = /\b(?:deleted_at|deletedAt|softDelete|paranoid|is_deleted|isDeleted|deleted|active)\s*[:\(]/i.test(content);
      const hasUserAudit = /\b(?:created_by|createdBy|updated_by|updatedBy|owner_id|author_id)\s*[:\(]/i.test(content);

      const hasSchemaDef = /\b(?:model|schema|entity|table|struct|class)\b.*\{/i.test(content) ||
        /\bCREATE\s+TABLE\b/i.test(content) ||
        /@(?:Entity|Table|Schema)\b/.test(content);

      if (!hasSchemaDef) continue;

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
          fix: "Add created_at and updated_at columns. In Prisma: add DateTime fields, in Sequelize: timestamps: true, in Django: auto_now_add=True.",
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
          fix: "Add deleted_at column or soft delete flag. In Prisma: DeletedAt DateTime?, in Sequelize: paranoid: true, in Django: SoftDeleteModel.",
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
