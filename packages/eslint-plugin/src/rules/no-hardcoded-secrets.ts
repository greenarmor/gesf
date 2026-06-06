import type { Rule } from "eslint";

const SECRET_PATTERNS = [
  { pattern: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"]{4,}/gi, message: "Hardcoded password detected. Move to environment variable." },
  { pattern: /(?:api[_-]?key|apikey)\s*[:=]\s*['"][^'"]{4,}/gi, message: "Hardcoded API key detected. Move to environment variable." },
  { pattern: /(?:secret|token|auth)\s*[:=]\s*['"][^'"]{8,}/gi, message: "Hardcoded secret/token detected. Move to environment variable." },
  { pattern: /sk-[a-zA-Z0-9]{20,}/g, message: "OpenAI/API key pattern detected in source." },
  { pattern: /AKIA[0-9A-Z]{16}/g, message: "AWS Access Key ID detected in source." },
  { pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g, message: "Private key detected in source." },
  { pattern: /ghp_[a-zA-Z0-9]{36}/g, message: "GitHub personal access token detected." },
];

export const noHardcodedSecrets: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Detect hardcoded secrets, passwords, API keys, and private keys",
      category: "Security",
    },
  },
  create(context: Rule.RuleContext) {
    return {
      Literal(node) {
        if (typeof node.value !== "string") return;
        for (const { pattern, message } of SECRET_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(node.value)) {
            context.report({
              node,
              message,
            });
          }
        }
      },
      TemplateElement(node) {
        const raw = node.value.raw;
        if (!raw) return;
        for (const { pattern, message } of SECRET_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(raw)) {
            context.report({
              node,
              message,
            });
          }
        }
      },
    };
  },
};
