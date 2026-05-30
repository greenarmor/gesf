import type { Scanner, Finding, ScanContext } from "./types.js";

const WEAK_HASH_PATTERNS = [
  { pattern: /\bmd5\s*\(/gi, algo: "MD5" },
  { pattern: /\bsha1\s*\(/gi, algo: "SHA1" },
  { pattern: /\bcreateHash\s*\(\s*['"]md5['"]\s*\)/gi, algo: "MD5 (Node.js crypto)" },
  { pattern: /\bcreateHash\s*\(\s*['"]sha1['"]\s*\)/gi, algo: "SHA1 (Node.js crypto)" },
  { pattern: /\.digest\s*\(\s*['"]md5['"]\s*\)/gi, algo: "MD5 digest" },
  { pattern: /hashlib\.md5\(/gi, algo: "MD5 (Python)" },
  { pattern: /hashlib\.sha1\(/gi, algo: "SHA1 (Python)" },
];

const WEAK_CRYPTO_PATTERNS = [
  { pattern: /\bDES\b|\b3DES\b|\bBlowfish\b/g, algo: "Weak encryption algorithm" },
  { pattern: /\bcreateCipheriv\s*\(\s*['"]aes-128/gi, algo: "AES-128 (use AES-256)" },
  { pattern: /\bcreateCipher\b\s*\(/g, algo: "Deprecated createCipher (use createCipheriv)" },
  { pattern: /\btc_aes_encrypt\b/gi, algo: "AES-128 (use AES-256)" },
  { pattern: /\bAES.*ECB\b/gi, algo: "AES ECB mode (use GCM or CBC)" },
  { pattern: /Cipher\s*\(\s*['"]des/gi, algo: "DES cipher (deprecated)" },
  { pattern: /\btls\.connect\s*\([^)]*rejectUnauthorized\s*:\s*false/gi, algo: "TLS with certificate verification disabled" },
  { pattern: /process\.env\.NODE_TLS_REJECT_UNAUTHORIZED\s*=\s*['"]0['"]/gi, algo: "TLS verification globally disabled" },
];

const INSECURE_PASSWORD_PATTERNS = [
  { pattern: /\.compare\s*\(.*,\s*.*\)|bcrypt\.compare|argon2\.verify/gi, check: false, desc: "Secure password comparison" },
  { pattern: /password\s*===?\s*|password\s*!==?\s*|\.equals\s*\(\s*password/gi, check: true, desc: "Plaintext password comparison (use Argon2id/bcrypt)" },
];

const SCAN_EXTENSIONS = new Set([".ts", ".tsx", ".js", ".jsx", ".py", ".rb", ".go", ".java", ".php", ".cs"]);

export class CryptoScanner implements Scanner {
  name = "crypto";

  scan(ctx: ScanContext): Finding[] {
    const findings: Finding[] = [];

    for (const [filePath, content] of ctx.fileContents) {
      const ext = filePath.substring(filePath.lastIndexOf("."));
      if (!SCAN_EXTENSIONS.has(ext)) continue;

      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        for (const { pattern, algo } of WEAK_HASH_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-001",
              severity: "critical",
              category: "authentication",
              title: `Weak hashing algorithm: ${algo}`,
              description: `${algo} is cryptographically broken and must not be used for passwords or security-sensitive operations. Use Argon2id for passwords, SHA-256+ for general hashing.`,
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
              fix: `Replace ${algo} with Argon2id (passwords) or SHA-256+ (general hashing).`,
            });
          }
        }

        for (const { pattern, algo } of WEAK_CRYPTO_PATTERNS) {
          pattern.lastIndex = 0;
          if (pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-002",
              severity: "high",
              category: "encryption",
              title: `Insecure encryption: ${algo}`,
              description: `${algo} is not approved for use. Use AES-256-GCM or ChaCha20-Poly1305.`,
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-002", "GDPR-ART32-003"],
              fix: "Replace with AES-256-GCM or ChaCha20-Poly1305 for data at rest, TLS 1.3 for data in transit.",
            });
          }
        }

        for (const { pattern, check, desc } of INSECURE_PASSWORD_PATTERNS) {
          pattern.lastIndex = 0;
          if (check && pattern.test(line)) {
            findings.push({
              ruleId: "CRYPTO-003",
              severity: "critical",
              category: "authentication",
              title: desc,
              description: "Passwords must be hashed using Argon2id before comparison. Never compare plaintext passwords.",
              file: filePath,
              line: i + 1,
              evidence: line.trim(),
              controlIds: ["GDPR-ART32-004", "OWASP-ASVS-003"],
              fix: "Use argon2.verify(hashedPassword, inputPassword) for password comparison.",
            });
          }
        }
      }
    }

    return findings;
  }
}
