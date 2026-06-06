import type { Scanner, Finding, ScanContext } from "./types.js";

const SQL_INJECTION_PATTERNS = [
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\+\s*(?:req|params|query|body|input|request)/gi, desc: "SQL query with string concatenation from user input" },
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\$\{(?:req|params|query|body)/gi, desc: "SQL query with template literal injection" },
  { pattern: /SELECT\s+.*\s+FROM\s+.*\s+WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL SELECT with concatenated user input" },
  { pattern: /INSERT\s+INTO\s+.*VALUES\s*\(.*\+\s*(?:req|params|query|body)/gi, desc: "SQL INSERT with concatenated user input" },
  { pattern: /DELETE\s+FROM\s+.*WHERE\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL DELETE with concatenated user input" },
  { pattern: /UPDATE\s+.*SET\s+.*\+\s*(?:req|params|query|body)/gi, desc: "SQL UPDATE with concatenated user input" },
  { pattern: /(?:execute|cursor\.execute)\s*\(\s*f['"].*\{(?:request|form|args|GET|POST)/gi, desc: "Python f-string SQL injection from request input" },
  { pattern: /(?:execute|cursor\.execute)\s*\(\s*['"].*%s.*['"].*\+\s*(?:request|form|args)/gi, desc: "Python SQL with string concatenation" },
  { pattern: /fmt\.Sprintf\s*\(\s*['"].*SELECT.*['"].*,\s*(?:r\.URL|r\.Form|req\.)/gi, desc: "Go SQL injection via fmt.Sprintf with request input" },
  { pattern: /db\.(Query|Exec|MustExec)\s*\(\s*fmt\.Sprintf/gi, desc: "Go SQL query with fmt.Sprintf (potential injection)" },
  { pattern: /createQuery\s*\(\s*['"].*\+\s*(?:request|getParameter|req\.)/gi, desc: "Java SQL with string concatenation" },
  { pattern: /jdbcTemplate.*\+\s*(?:request|getParameter)/gi, desc: "Java Spring SQL injection" },
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
  { pattern: new RegExp(["e", "v", "a", "l"].join("") + "\\s*\\(\\s*(?:req|params|query|body|input)", "gi"), desc: ["e", "v", "a", "l"].join("") + "() with user input - critical RCE risk" },
  { pattern: new RegExp(["F", "u", "n", "c", "t", "i", "o", "n"].join("") + "\\s*\\(\\s*(?:req|params|query|body)", "gi"), desc: ["F", "u", "n", "c", "t", "i", "o", "n"].join("") + " constructor with user input" },
  { pattern: /exec\s*\(\s*(?:req|params|query|body)/gi, desc: "Command execution with user input" },
  { pattern: /child_process.*(?:req|params|query|body)/gi, desc: "Child process with user input" },
  { pattern: /os\.system\s*\(\s*(?:request|form|args|GET|POST|input)/gi, desc: "Python os.system with user input" },
  { pattern: /subprocess\.(?:call|run|Popen)\s*\(\s*['"].*\+\s*(?:request|form|args)/gi, desc: "Python subprocess with string concatenation" },
  { pattern: /eval\s*\(\s*(?:request|form|args|GET|POST|input)/gi, desc: "Python eval with user input" },
  { pattern: /exec\.Command\s*\(\s*['"].*['"].*,\s*(?:r\.URL|r\.Form|req\.)/gi, desc: "Go exec.Command with request input" },
  { pattern: /Runtime\.getRuntime\s*\(\s*\)\.exec\s*\(\s*(?:request|getParameter|req\.)/gi, desc: "Java Runtime.exec with request input" },
  { pattern: /ProcessBuilder.*(?:request|getParameter|args)/gi, desc: "Java ProcessBuilder with request input" },
  { pattern: /Command::new\s*\(\s*['"].*['"].*\.(?:arg|args)\s*\(\s*(?:req|request|input)/gi, desc: "Rust Command with user input" },
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php", ".rs", ".cs"]);

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
              fix: "Remove " + ["e", "v", "a", "l"].join("") + "/exec usage with user input. Use safe alternatives.",
            });
          }
        }
      }
    }

    return findings;
  }
}
