import { describe, it, expect } from "vitest";
import {
  CLASSIFICATION_RULES,
  APPROVED_AUTH_METHODS,
  REJECTED_AUTH_METHODS,
  APPROVED_ENCRYPTION,
  SECRETS_RULES,
  LOGGING_RULES,
  DB_STANDARDS,
  API_STANDARDS,
  STORAGE_RULES,
} from "./index.js";

describe("CLASSIFICATION_RULES", () => {
  it("has all 4 classification levels", () => {
    expect(Object.keys(CLASSIFICATION_RULES).length).toBe(4);
    expect(CLASSIFICATION_RULES.public).toBeDefined();
    expect(CLASSIFICATION_RULES.internal).toBeDefined();
    expect(CLASSIFICATION_RULES.confidential).toBeDefined();
    expect(CLASSIFICATION_RULES.restricted).toBeDefined();
  });

  it("restricted requires encryption", () => {
    expect(CLASSIFICATION_RULES.restricted.requiresEncryption).toBe(true);
  });

  it("restricted requires access controls", () => {
    expect(CLASSIFICATION_RULES.restricted.requiresAccessControls).toBe(true);
  });

  it("restricted requires audit logging", () => {
    expect(CLASSIFICATION_RULES.restricted.requiresAuditLogging).toBe(true);
  });

  it("public does not require encryption", () => {
    expect(CLASSIFICATION_RULES.public.requiresEncryption).toBe(false);
  });

  it("confidential requires encryption", () => {
    expect(CLASSIFICATION_RULES.confidential.requiresEncryption).toBe(true);
  });
});

describe("APPROVED_AUTH_METHODS", () => {
  it("includes Argon2id", () => {
    expect(APPROVED_AUTH_METHODS.some(m => m.name === "Argon2id")).toBe(true);
  });

  it("includes MFA", () => {
    expect(APPROVED_AUTH_METHODS.some(m => m.name === "MFA")).toBe(true);
  });

  it("includes Passkey", () => {
    expect(APPROVED_AUTH_METHODS.some(m => m.name === "Passkey")).toBe(true);
  });

  it("all are approved", () => {
    for (const m of APPROVED_AUTH_METHODS) {
      expect(m.approved).toBe(true);
    }
  });
});

describe("REJECTED_AUTH_METHODS", () => {
  it("includes MD5", () => {
    expect(REJECTED_AUTH_METHODS.some(m => m.name === "MD5")).toBe(true);
  });

  it("includes SHA1", () => {
    expect(REJECTED_AUTH_METHODS.some(m => m.name === "SHA1")).toBe(true);
  });

  it("includes Plain Text", () => {
    expect(REJECTED_AUTH_METHODS.some(m => m.name === "Plain Text")).toBe(true);
  });

  it("all are rejected", () => {
    for (const m of REJECTED_AUTH_METHODS) {
      expect(m.approved).toBe(false);
    }
  });
});

describe("APPROVED_ENCRYPTION", () => {
  it("includes AES-256-GCM", () => {
    expect(APPROVED_ENCRYPTION.some(e => e.algorithm === "AES-256-GCM")).toBe(true);
  });

  it("includes ChaCha20-Poly1305", () => {
    expect(APPROVED_ENCRYPTION.some(e => e.algorithm === "ChaCha20-Poly1305")).toBe(true);
  });

  it("includes TLS 1.3 and TLS 1.2", () => {
    expect(APPROVED_ENCRYPTION.some(e => e.algorithm === "TLS 1.3")).toBe(true);
    expect(APPROVED_ENCRYPTION.some(e => e.algorithm === "TLS 1.2")).toBe(true);
  });
});

describe("SECRETS_RULES", () => {
  it("rejects passwords in source code", () => {
    const rule = SECRETS_RULES.find(r => r.practice === "Passwords in source code");
    expect(rule?.allowed).toBe(false);
  });

  it("rejects private keys in Git", () => {
    const rule = SECRETS_RULES.find(r => r.practice === "Private keys in Git");
    expect(rule?.allowed).toBe(false);
  });

  it("allows HashiCorp Vault", () => {
    const rule = SECRETS_RULES.find(r => r.practice === "HashiCorp Vault");
    expect(rule?.allowed).toBe(true);
  });

  it("allows AWS KMS", () => {
    const rule = SECRETS_RULES.find(r => r.practice === "AWS KMS");
    expect(rule?.allowed).toBe(true);
  });
});

describe("LOGGING_RULES", () => {
  it("requires logging authentication events", () => {
    const rule = LOGGING_RULES.find(r => r.event === "Authentication events");
    expect(rule?.mustLog).toBe(true);
  });

  it("requires logging authorization decisions", () => {
    const rule = LOGGING_RULES.find(r => r.event === "Authorization decisions");
    expect(rule?.mustLog).toBe(true);
  });

  it("prohibits logging passwords", () => {
    const rule = LOGGING_RULES.find(r => r.event === "Passwords");
    expect(rule?.mustNotLog).toBe(true);
  });

  it("prohibits logging tokens", () => {
    const rule = LOGGING_RULES.find(r => r.event === "Tokens");
    expect(rule?.mustNotLog).toBe(true);
  });

  it("prohibits logging sensitive personal data", () => {
    const rule = LOGGING_RULES.find(r => r.event === "Sensitive personal data");
    expect(rule?.mustNotLog).toBe(true);
  });
});

describe("DB_STANDARDS", () => {
  it("requires primary keys", () => {
    expect(DB_STANDARDS.some(s => s.requirement === "Primary Keys" && s.mandatory)).toBe(true);
  });

  it("requires audit columns", () => {
    expect(DB_STANDARDS.some(s => s.requirement === "Audit Columns" && s.mandatory)).toBe(true);
  });

  it("requires soft delete", () => {
    expect(DB_STANDARDS.some(s => s.requirement === "Soft Delete" && s.mandatory)).toBe(true);
  });

  it("all standards are mandatory", () => {
    for (const s of DB_STANDARDS) {
      expect(s.mandatory).toBe(true);
    }
  });
});

describe("API_STANDARDS", () => {
  it("requires input validation", () => {
    expect(API_STANDARDS.some(s => s.requirement === "Input Validation")).toBe(true);
  });

  it("requires authentication", () => {
    expect(API_STANDARDS.some(s => s.requirement === "Authentication")).toBe(true);
  });

  it("requires rate limiting", () => {
    expect(API_STANDARDS.some(s => s.requirement === "Rate Limiting")).toBe(true);
  });

  it("all standards are mandatory", () => {
    for (const s of API_STANDARDS) {
      expect(s.mandatory).toBe(true);
    }
  });
});

describe("STORAGE_RULES", () => {
  it("includes S3", () => {
    expect(STORAGE_RULES.some(s => s.provider === "S3")).toBe(true);
  });

  it("includes Azure Blob", () => {
    expect(STORAGE_RULES.some(s => s.provider === "Azure Blob")).toBe(true);
  });

  it("all providers require encryption", () => {
    for (const s of STORAGE_RULES) {
      expect(s.rules.some(r => r.toLowerCase().includes("encrypt"))).toBe(true);
    }
  });

  it("all providers require private by default", () => {
    for (const s of STORAGE_RULES) {
      expect(s.rules.some(r => r.toLowerCase().includes("private"))).toBe(true);
    }
  });
});
