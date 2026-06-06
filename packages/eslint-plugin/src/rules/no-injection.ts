import type { Rule } from "eslint";

const INJECTION_PATTERNS = [
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\+\s*(?:req|params|query|body|input|request)/gi, message: "SQL injection: string concatenation with user input. Use parameterized queries." },
  { pattern: /(?:query|execute|raw|sql)\s*\(\s*[`"'].*\$\{(?:req|params|query|body)/gi, message: "SQL injection: template literal with user input. Use parameterized queries." },
  { pattern: /innerHTML\s*=\s*(?:req|params|query|body|input)/gi, message: "XSS: innerHTML assignment from user input. Use textContent." },
  { pattern: /document\.write\s*\(\s*(?:req|params|query|body)/gi, message: "XSS: document.write with user input. Use safe DOM methods." },
];

export const noInjection: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Detect SQL injection, XSS, and code injection vulnerabilities",
      category: "Security",
    },
  },
  create(context: Rule.RuleContext) {
    return {
      CallExpression(node) {
        const text = context.getSourceCode().getText(node);
        for (const { pattern, message } of INJECTION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(text)) {
            context.report({ node, message });
            break;
          }
        }
      },
      AssignmentExpression(node) {
        const text = context.getSourceCode().getText(node);
        for (const { pattern, message } of INJECTION_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(text)) {
            context.report({ node, message });
            break;
          }
        }
      },
    };
  },
};
