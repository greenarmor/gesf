import type { Control } from "@greenarmor/ges-core";
import { createArticle5Controls } from "./article-5.js";
import { createArticle25Controls } from "./article-25.js";
import { createArticle30Controls } from "./article-30.js";
import { createArticle32Controls } from "./article-32.js";
import { createArticle33Controls } from "./article-33.js";
import { createArticle34Controls } from "./article-34.js";

export function createGDPRControls(): Control[] {
  return [
    ...createArticle5Controls(),
    ...createArticle25Controls(),
    ...createArticle30Controls(),
    ...createArticle32Controls(),
    ...createArticle33Controls(),
    ...createArticle34Controls(),
  ];
}

export { createArticle5Controls } from "./article-5.js";
export { createArticle25Controls } from "./article-25.js";
export { createArticle30Controls } from "./article-30.js";
export { createArticle32Controls } from "./article-32.js";
export { createArticle33Controls } from "./article-33.js";
export { createArticle34Controls } from "./article-34.js";

export function evaluateControl(control: Control): Control {
  const totalChecks = control.checks.length;
  const passedChecks = control.checks.filter(c => c.status === "pass").length;

  if (passedChecks === totalChecks) {
    return { ...control, status: "pass" };
  }
  if (passedChecks === 0) {
    return { ...control, status: control.status === "not-implemented" ? "not-implemented" : "fail" };
  }
  return { ...control, status: "warning" };
}
