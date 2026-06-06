import type { Rule } from "eslint";

const WEAK_HASH_PATTERNS = [
  { pattern: /\bmd5\s*\(/gi, message: "MD5 is cryptographically broken. Use SHA-256 or Argon2id." },
  { pattern: /\bsha1\s*\(/gi, message: "SHA1 is cryptographically weak. Use SHA-256 or Argon2id." },
  { pattern: /\bcreateHash\s*\(\s*['"]md5['"]\s*\)/gi, message: "MD5 is broken. Use createHash('sha256')." },
  { pattern: /\bcreateHash\s*\(\s*['"]sha1['"]\s*\)/gi, message: "SHA1 is weak. Use createHash('sha256')." },
];

const WEAK_CRYPTO_PATTERNS = [
  { pattern: /\bDES\b|\b3DES\b|\bBlowfish\b/g, message: "Weak encryption algorithm. Use AES-256-GCM." },
  { pattern: /\bcreateCipheriv\s*\(\s*['"]aes-128/gi, message: "AES-128 is not approved. Use AES-256." },
  { pattern: /\bcreateCipher\b\s*\(/g, message: "createCipher is deprecated. Use createCipheriv." },
  { pattern: /tls\.connect\s*\([^)]*rejectUnauthorized\s*:\s*false/gi, message: "TLS certificate verification disabled. Remove rejectUnauthorized: false." },
];

export const noWeakCrypto: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description: "Detect weak hashing and encryption algorithms (MD5, SHA1, DES, AES-128)",
      category: "Security",
    },
  },
  create(context: Rule.RuleContext) {
    const allPatterns = [...WEAK_HASH_PATTERNS, ...WEAK_CRYPTO_PATTERNS];

    return {
      CallExpression(node) {
        const text = context.getSourceCode().getText(node);
        for (const { pattern, message } of allPatterns) {
          pattern.lastIndex = 0;
          if (pattern.test(text)) {
            context.report({ node, message });
            break;
          }
        }
      },
      VariableDeclarator(node) {
        const text = context.getSourceCode().getText(node);
        for (const { pattern, message } of allPatterns) {
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
