import type { Scanner, Finding, ScanContext } from "./types.js";

const SQL_INJECTION_PATTERNS = [
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\+\s*(?:req|params|query|body|input|request)/gi, desc: "SQL query with string concatenation from user input" },
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\$\{(?:req|params|query|body)/gi, desc: "SQL query with template literal injection" },
  { pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL SELECT with concatenated user input" },
  { pattern: /INSERT\s+INTO\s+.*VALUES\s*\(.*\+\s*(?:req|params|query|body)/gi, desc: "SQL INSERT with concatenated user input" },
  { pattern: /DELETE\s+FROM\s+.*WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL DELETE with concatenated user input" },
  { pattern: /UPDATE\s+.*SET\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL UPDATE with concatenated user input" },
];

const XSS_PATTERNS = [
  { pattern: /innerHTML\s*=\s*(?:req|params|query|body|input)/gi, desc: "Direct innerHTML assignment from user input" },
  { pattern: /document\.write\s*\(\s*(?:req|params|query|body)/gi, desc: "document.write with user input" },
  { pattern: /v-html\s*=\s*(?:req|params|query|body|input)/gi, desc: "Vue v-html with user input" },
  { pattern: /dangerouslySetInnerHTML\s*=\s*\{.*(?:req|params|query|body)/gi, desc: "React dangerouslySetInnerHTML with user input" },
  { pattern: /\.html\s*\(\s*(?:req|params|query|body)/gi, desc: "jQuery .html() with user input" },
];

const INPUT_VALIDATION_PATTERNS = [
  { pattern: /(?:parseInt|parseFloat|Number)\s*\(\s*req\.(?:body|params|query)/gi, desc: "Unvalidated number parsing from request" },
  { pattern: /eval\s*\(\s*(?:req|params|query|body|input)/gi, desc: "eval() with user input - critical RCE risk" },
  { pattern: /Function\s*\(\s*(?:req|params|query|body)/gi, desc: "Function constructor with user input" },
  { pattern: /exec\s*\(\s*(?:req|params|query|body)/gi, desc: "Command execution with user input" },
  { pattern: /child_process.*(?:req|params|query|body)/gi, desc: "Child process with user input" },
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php"]);

export class CodeSecurityScanner implements Scanner {
  name = "code-security";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    for (const [filePath, content] of ctx.fileContents) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (const { pattern, desc } of SQL_INJECTION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-001",
              severity: "critical",
              category: "injection",
              title: "SQL Injection vulnerability",
              description: desc + ". Use parameterized queries or an ORM.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-001", "GDPR-ART5-006"],
              fix: "Use parameterized queries: db.query('SELECT * FROM users WHERE id = $1', [req.query.id])",
            });
          }
        }

        for (const { pattern, desc } of XSS_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-002",
              severity: "critical",
              category: "xss",
              title: "Cross-Site Scripting (XSS) vulnerability",
              description: desc + ". Sanitize all user input before rendering.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-002", "GDPR-ART5-006"],
              fix: "Use textContent instead of innerHTML, or sanitize input with a library like DOMPurify.",
            });
          }
        }

        for (const { pattern, desc } of INPUT_VALIDATION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "INJECT-003",
              severity: "critical",
              category: "injection",
              title: "Code injection risk",
              description: desc + ". Never pass user input to code execution functions.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["OWASP-ASVS-001"],
              fix: "Remove eval/exec usage with user input. Use safe alternatives.",
            });
          }
        }
      }
    }

    return findings;
  }
}
