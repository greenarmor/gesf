import { describe, it, expect } from "vitest";
import { rules, configs } from "./index.js";

describe("ESLint Plugin", () => {
  it("exports 3 rules", () => {
    expect(Object.keys(rules).length).toBe(3);
    expect(rules["no-hardcoded-secrets"]).toBeDefined();
    expect(rules["no-weak-crypto"]).toBeDefined();
    expect(rules["no-injection"]).toBeDefined();
  });

  it("exports recommended config", () => {
    expect(configs.recommended).toBeDefined();
    expect(configs.recommended.plugins).toContain("@greenarmor/ges");
    expect(configs.recommended.rules["@greenarmor/ges/no-hardcoded-secrets"]).toBe("error");
    expect(configs.recommended.rules["@greenarmor/ges/no-weak-crypto"]).toBe("error");
    expect(configs.recommended.rules["@greenarmor/ges/no-injection"]).toBe("error");
  });

  it("each rule has meta with type problem", () => {
    for (const rule of Object.values(rules)) {
      expect(rule.meta?.type).toBe("problem");
    }
  });

  it("each rule has a create function", () => {
    for (const rule of Object.values(rules)) {
      expect(typeof rule.create).toBe("function");
    }
  });

  it("each rule has docs description", () => {
    for (const rule of Object.values(rules)) {
      const meta = rule.meta as { docs?: { description?: string } };
      expect(meta.docs?.description).toBeTruthy();
    }
  });
});
