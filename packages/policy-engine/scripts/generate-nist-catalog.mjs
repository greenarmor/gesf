#!/usr/bin/env node
/**
 * Generates the NIST SP 800-53 Rev. 5 catalog and SP 800-53B baseline data
 * modules for the GESF policy engine from authoritative NIST OSCAL content.
 *
 * Sources (download once, then run offline):
 *   https://github.com/usnistgov/oscal-content  (nist.gov/SP800-53/rev5/json)
 *     - NIST_SP-800-53_rev5_catalog.json
 *     - NIST_SP-800-53_rev5_LOW-baseline_profile.json
 *     - NIST_SP-800-53_rev5_MODERATE-baseline_profile.json
 *     - NIST_SP-800-53_rev5_HIGH-baseline_profile.json
 *
 * Usage:
 *   node scripts/generate-nist-catalog.mjs <oscal-dir> <out-dir>
 *
 * Output: one TypeScript module per control family (ac.ts ... sr.ts)
 * plus baselines.ts with the SP 800-53B baseline control selections.
 */
import * as fs from "node:fs";
import * as path from "node:path";

const oscalDir = process.argv[2] ?? "/tmp/oscal";
const outDir = process.argv[3] ?? path.join(process.cwd(), "src", "nist-catalog", "data");

const CATALOG_FILE = "NIST_SP-800-53_rev5_catalog.json";
const BASELINE_FILES = {
  low: "NIST_SP-800-53_rev5_LOW-baseline_profile.json",
  moderate: "NIST_SP-800-53_rev5_MODERATE-baseline_profile.json",
  high: "NIST_SP-800-53_rev5_HIGH-baseline_profile.json",
};
const SOURCE_URL =
  "https://github.com/usnistgov/oscal-content/tree/main/nist.gov/SP800-53/rev5/json";

function readJson(name) {
  const p = path.join(oscalDir, name);
  if (!fs.existsSync(p)) {
    console.error(`Missing OSCAL file: ${p}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

/** ac-2 -> AC-2 ; ac-2.3 -> AC-2(3) */
function officialId(oscalId) {
  const m = /^([a-z]{2})-(\d+)(?:\.(\d+))?$/.exec(oscalId);
  if (!m) return oscalId.toUpperCase();
  const [, fam, num, enh] = m;
  const base = `${fam.toUpperCase()}-${parseInt(num, 10)}`;
  return enh ? `${base}(${parseInt(enh, 10)})` : base;
}

function prop(item, name) {
  return item?.props?.find((p) => p.name === name)?.value;
}

function flattenPart(part, indent) {
  const lines = [];
  if (part.prose) lines.push(indent + part.prose);
  for (const sub of part.parts ?? []) {
    const label = prop(sub, "label") ?? "";
    const prefix = indent + (label ? `${label} ` : "");
    if (sub.prose) lines.push(prefix + sub.prose);
    if (sub.parts) lines.push(...flattenPart(sub, indent + "  "));
  }
  return lines;
}

function statementText(control) {
  const stmt = (control.parts ?? []).find((p) => p.name === "statement");
  if (!stmt) return "";
  return flattenPart(stmt, "").join("\n").trim();
}

function guidanceText(control) {
  const gdn = (control.parts ?? []).find((p) => p.name === "guidance");
  if (!gdn) return undefined;
  return flattenPart(gdn, "").join("\n").trim() || undefined;
}

function objectives(control) {
  const objPart = (control.parts ?? []).find((p) => p.name === "assessment-objective");
  if (!objPart) return [];
  const out = [];
  const walk = (part) => {
    if (part.prose) {
      out.push({
        id: part.id ?? "",
        label: prop(part, "label") ?? part.id ?? "",
        text: part.prose.trim(),
      });
    }
    for (const sub of part.parts ?? []) walk(sub);
  };
  for (const sub of objPart.parts ?? []) walk(sub);
  return out;
}

function methods(control) {
  const parts = (control.parts ?? []).filter((p) => p.name === "assessment-method");
  return parts
    .map((p) => {
      const raw = prop(p, "method") ?? "";
      const method = raw.toLowerCase();
      if (!["examine", "interview", "test"].includes(method)) return null;
      return {
        method,
        label: prop(p, "label") ?? "",
        ...(p.prose ? { prose: p.prose.trim() } : {}),
      };
    })
    .filter(Boolean);
}

function parameters(control) {
  return (control.params ?? []).map((param) => {
    const entry = { id: param.id ?? "", label: param.label ?? "" };
    if (param.prose) entry.prose = param.prose.trim();
    const choices = param.select?.choice;
    if (Array.isArray(choices) && choices.length > 0) entry.choices = choices.map(String);
    const def = param.select?.["how-many"];
    if (def) entry.how_many = def;
    return entry;
  });
}

function resolveParamInserts(text, params) {
  if (!text) return text;
  const byId = new Map(params.map((p) => [p.id, p]));
  return text.replace(/\{\{\s*insert:\s*param,\s*([^}]+?)\s*\}\}/g, (_m, paramId) => {
    const param = byId.get(paramId.trim());
    return `<${param?.label || "organization-defined parameter"}>`;
  });
}

function transformControl(oscalControl, familyCode, backmatter, isEnhancement, parentId) {
  const references = [];
  for (const link of oscalControl.links ?? []) {
    if (link.rel !== "reference") continue;
    const res = backmatter.get(String(link.href ?? "").replace(/^#/, ""));
    if (res?.title) {
      references.push({
        title: res.title,
        ...(prop(res, "identifier") ? { identifier: prop(res, "identifier") } : {}),
      });
    }
  }
  const related = [];
  for (const link of oscalControl.links ?? []) {
    if (link.rel !== "related") continue;
    const target = String(link.href ?? "").replace(/^#/, "");
    related.push(officialId(target.split("_")[0].replace(/_smt.*/g, "")));
  }
  const control = {
    id: officialId(oscalControl.id),
    oscal_id: oscalControl.id,
    family: familyCode,
    title: oscalControl.title ?? "",
    statement: "",
    ...(guidanceText(oscalControl) ? { supplemental_guidance: guidanceText(oscalControl) } : {}),
    ...(prop(oscalControl, "implementation-level")
      ? { implementation_level: prop(oscalControl, "implementation-level") }
      : {}),
  };
  const params = parameters(oscalControl);
  control.statement = resolveParamInserts(statementText(oscalControl), params);
  if (control.supplemental_guidance) {
    control.supplemental_guidance = resolveParamInserts(control.supplemental_guidance, params);
  }
  if (params.length > 0) control.parameters = params;
  const objs = objectives(oscalControl);
  if (objs.length > 0) control.objectives = objs;
  const mts = methods(oscalControl);
  if (mts.length > 0) control.methods = mts;
  const refs = dedupeByTitle(references);
  if (refs.length > 0) control.references = refs;
  const rel = [...new Set(related)].filter((r) => r !== control.id);
  if (rel.length > 0) control.related_controls = rel;
  if (isEnhancement) {
    control.is_enhancement = true;
    control.parent_id = parentId;
  } else {
    const enhancements = (oscalControl.controls ?? []).map((e) =>
      transformControl(e, familyCode, backmatter, true, control.id),
    );
    if (enhancements.length > 0) control.enhancements = enhancements;
  }
  return control;
}

function dedupeByTitle(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (seen.has(item.title)) continue;
    seen.add(item.title);
    out.push(item);
  }
  return out;
}

function main() {
  const catalogDoc = readJson(CATALOG_FILE);
  const meta = catalogDoc.catalog.metadata ?? {};
  const resources = new Map(
    (catalogDoc.catalog["back-matter"]?.resources ?? []).map((r) => [r.uuid, r]),
  );

  fs.mkdirSync(outDir, { recursive: true });
  const written = [];
  const allIds = new Set();

  for (const group of catalogDoc.catalog.groups ?? []) {
    const code = String(group.id ?? "").toUpperCase();
    const family = {
      code,
      name: group.title ?? code,
      controls: (group.controls ?? []).map((c) => transformControl(c, code, resources, false)),
    };
    for (const c of family.controls) {
      collectIds(c, allIds);
    }
    const varName = `FAMILY_${code}`;
    const fileBody = `import type { NistCatalogFamily } from "../types.js";\n\n// Generated from NIST OSCAL content. Do not edit by hand.\nexport const ${varName}: NistCatalogFamily = ${JSON.stringify(family)};\n`;
    const fileName = `${code.toLowerCase()}.ts`;
    fs.writeFileSync(path.join(outDir, fileName), fileBody);
    written.push({ code, file: fileName, varName, count: family.controls.length });
  }

  const baselines = { baselines: [] };
  for (const [name, file] of Object.entries(BASELINE_FILES)) {
    const profile = readJson(file).profile ?? {};
    const ids = (profile.imports ?? []).flatMap(
      (imp) => (imp["include-controls"] ?? []).flatMap((ic) => ic["with-ids"] ?? []),
    );
    baselines.baselines.push({
      name,
      label: name.charAt(0).toUpperCase() + name.slice(1) + " Impact Baseline",
      source: "NIST SP 800-53B Control Baselines",
      control_ids: ids.map(officialId),
    });
  }

  const baselineBody = `import type { NistBaselineSet } from "../types.js";\n\n// Generated from NIST OSCAL SP 800-53B baseline profiles. Do not edit by hand.\nexport const NIST_BASELINES: NistBaselineSet = ${JSON.stringify(baselines)};\n`;
  fs.writeFileSync(path.join(outDir, "baselines.ts"), baselineBody);

  const stats = {
    families: written.length,
    base_controls: written.reduce((s, f) => s + f.count, 0),
    total_entries: allIds.size,
    import_date: new Date().toISOString().slice(0, 10),
    oscal_title: meta.title ?? "NIST SP 800-53 Rev. 5",
    oscal_version: meta.version ?? "Rev. 5",
    source: SOURCE_URL,
  };
  const statsBody = `import type { NistCatalogSourceMetadata } from "../types.js";\n\n// Generated from NIST OSCAL content. Do not edit by hand.\nexport const CATALOG_METADATA: NistCatalogSourceMetadata = ${JSON.stringify(stats, null, 2)};\n`;
  fs.writeFileSync(path.join(outDir, "metadata.ts"), statsBody);

  console.log(
    JSON.stringify({ written, stats }, null, 2),
  );
}

function collectIds(control, set) {
  set.add(control.id);
  for (const e of control.enhancements ?? []) set.add(e.id);
}

main();
