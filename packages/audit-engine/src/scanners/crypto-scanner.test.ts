import { describe, it, expect } from "vitest";
import { CryptoScanner } from "./crypto-scanner.js";
import type { ScanContext } from "./types.js";

function makeCtx(files: Record<string, string>): ScanContext {
  const fileContents = new Map(Object.entries(files));
  return {
    root: "/test",
    files: Object.keys(files),
    fileContents,
    isWebProject: true,
  };
}

describe("CryptoScanner", () => {
  const scanner = new CryptoScanner();

  it("detects MD5 usage", () => {
    const ctx = makeCtx({
      "hash.ts": `const h = md5(input);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("MD5"))).toBe(true);
  });

  it("detects SHA1 usage", () => {
    const ctx = makeCtx({
      "hash.ts": `const h = sha1(input);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("SHA1"))).toBe(true);
  });

  it("detects Node.js createHash md5", () => {
    const ctx = makeCtx({
      "hash.ts": `const h = createHash("md5");`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("MD5"))).toBe(true);
  });

  it("detects Python hashlib md5", () => {
    const ctx = makeCtx({
      "hash.py": `h = hashlib.md5(data)`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("MD5"))).toBe(true);
  });

  it("detects DES cipher", () => {
    const ctx = makeCtx({
      "crypto.ts": `const cipher = new DES(key);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBeGreaterThanOrEqual(1);
  });

  it("detects AES-128 usage", () => {
    const ctx = makeCtx({
      "crypto.ts": `const c = createCipheriv("aes-128-cbc", key, iv);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("AES-128"))).toBe(true);
  });

  it("detects deprecated createCipher", () => {
    const ctx = makeCtx({
      "crypto.ts": `const c = createCipher("aes-256-cbc", key);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("createCipher"))).toBe(true);
  });

  it("detects disabled TLS verification", () => {
    const ctx = makeCtx({
      "client.ts": `tls.connect({ rejectUnauthorized: false });`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("TLS"))).toBe(true);
  });

  it("detects globally disabled TLS", () => {
    const ctx = makeCtx({
      "app.ts": `process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("TLS"))).toBe(true);
  });

  it("detects plaintext password comparison", () => {
    const ctx = makeCtx({
      "auth.ts": `if (storedPassword === userInput) { login(); }`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.some(f => f.title.includes("Plaintext") || f.title.includes("password"))).toBe(true);
  });

  it("returns no findings for secure code", () => {
    const ctx = makeCtx({
      "secure.ts": `const hash = argon2id.hash(password);\nconst verify = argon2id.verify(hash, input);`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });

  it("only scans code file extensions", () => {
    const ctx = makeCtx({
      "readme.md": `Use md5() for hashing.`,
      "data.json": `{"algo": "md5"}`,
    });
    const findings = scanner.scan(ctx);
    expect(findings.length).toBe(0);
  });
});
