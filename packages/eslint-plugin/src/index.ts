import type { Rule } from "eslint";
import { noHardcodedSecrets } from "./rules/no-hardcoded-secrets.js";
import { noWeakCrypto } from "./rules/no-weak-crypto.js";
import { noInjection } from "./rules/no-injection.js";

export const rules: Record<string, Rule.RuleModule> = {
  "no-hardcoded-secrets": noHardcodedSecrets,
  "no-weak-crypto": noWeakCrypto,
  "no-injection": noInjection,
};

export const configs = {
  recommended: {
    plugins: ["@greenarmor/ges"],
    rules: {
      "@greenarmor/ges/no-hardcoded-secrets": "error",
      "@greenarmor/ges/no-weak-crypto": "error",
      "@greenarmor/ges/no-injection": "error",
    },
  },
};

export default { rules, configs };
