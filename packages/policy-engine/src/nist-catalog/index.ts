/**
 * NIST SP 800-53 Rev. 5 control catalog access layer.
 * Data is generated from authoritative NIST OSCAL content — see
 * scripts/generate-nist-catalog.mjs and data/metadata.ts for provenance.
 */
import type {
  NistBaselineDefinition,
  NistBaselineName,
  NistCatalogControl,
  NistCatalogFamily,
  NistCatalogSourceMetadata,
} from "./types.js";
import { CATALOG_METADATA } from "./data/metadata.js";
import { NIST_BASELINES } from "./data/baselines.js";
import { FAMILY_AC } from "./data/ac.js";
import { FAMILY_AT } from "./data/at.js";
import { FAMILY_AU } from "./data/au.js";
import { FAMILY_CA } from "./data/ca.js";
import { FAMILY_CM } from "./data/cm.js";
import { FAMILY_CP } from "./data/cp.js";
import { FAMILY_IA } from "./data/ia.js";
import { FAMILY_IR } from "./data/ir.js";
import { FAMILY_MA } from "./data/ma.js";
import { FAMILY_MP } from "./data/mp.js";
import { FAMILY_PE } from "./data/pe.js";
import { FAMILY_PL } from "./data/pl.js";
import { FAMILY_PM } from "./data/pm.js";
import { FAMILY_PS } from "./data/ps.js";
import { FAMILY_PT } from "./data/pt.js";
import { FAMILY_RA } from "./data/ra.js";
import { FAMILY_SA } from "./data/sa.js";
import { FAMILY_SC } from "./data/sc.js";
import { FAMILY_SI } from "./data/si.js";
import { FAMILY_SR } from "./data/sr.js";

export * from "./types.js";

const FAMILIES: NistCatalogFamily[] = [
  FAMILY_AC,
  FAMILY_AT,
  FAMILY_AU,
  FAMILY_CA,
  FAMILY_CM,
  FAMILY_CP,
  FAMILY_IA,
  FAMILY_IR,
  FAMILY_MA,
  FAMILY_MP,
  FAMILY_PE,
  FAMILY_PL,
  FAMILY_PM,
  FAMILY_PS,
  FAMILY_PT,
  FAMILY_RA,
  FAMILY_SA,
  FAMILY_SC,
  FAMILY_SI,
  FAMILY_SR,
];

const CONTROL_INDEX = new Map<string, NistCatalogControl>();
const ALL_CONTROLS: NistCatalogControl[] = [];
const BASE_CONTROLS: NistCatalogControl[] = [];

function indexFamily(family: NistCatalogControl[]): void {
  for (const control of family) {
    ALL_CONTROLS.push(control);
    BASE_CONTROLS.push(control);
    CONTROL_INDEX.set(control.id.toUpperCase(), control);
    for (const enhancement of control.enhancements ?? []) {
      ALL_CONTROLS.push(enhancement);
      CONTROL_INDEX.set(enhancement.id.toUpperCase(), enhancement);
    }
  }
}

for (const family of FAMILIES) {
  indexFamily(family.controls);
}

export function getCatalogMetadata(): NistCatalogSourceMetadata {
  return CATALOG_METADATA;
}

export function listFamilies(): NistCatalogFamily[] {
  return FAMILIES;
}

export function listFamilyCodes(): string[] {
  return FAMILIES.map((f) => f.code);
}

export function getFamily(code: string): NistCatalogFamily | undefined {
  const target = code.trim().toUpperCase();
  return FAMILIES.find((f) => f.code === target);
}

/** Normalizes user input to the official identifier form: "ac-2.3" / "AC 2 (3)" -> "AC-2(3)". */
export function normalizeNistControlId(input: string): string {
  const trimmed = input.trim().toUpperCase().replace(/\s+/g, "");
  const dotForm = /^([A-Z]{2})-?(\d+)\.(\d+)$/.exec(trimmed);
  if (dotForm) {
    return `${dotForm[1]}-${parseInt(dotForm[2], 10)}(${parseInt(dotForm[3], 10)})`;
  }
  const parenForm = /^([A-Z]{2})-?(\d+)\((\d+)\)$/.exec(trimmed);
  if (parenForm) {
    return `${parenForm[1]}-${parseInt(parenForm[2], 10)}(${parseInt(parenForm[3], 10)})`;
  }
  const baseForm = /^([A-Z]{2})-?(\d+)$/.exec(trimmed);
  if (baseForm) {
    return `${baseForm[1]}-${parseInt(baseForm[2], 10)}`;
  }
  return trimmed;
}

export function getNistControl(id: string): NistCatalogControl | undefined {
  return CONTROL_INDEX.get(normalizeNistControlId(id));
}

export function getAllNistControls(): NistCatalogControl[] {
  return ALL_CONTROLS;
}

export function getBaseNistControls(): NistCatalogControl[] {
  return BASE_CONTROLS;
}

export interface NistCatalogStats {
  families: number;
  base_controls: number;
  enhancements: number;
  total_entries: number;
  controls_with_objectives: number;
  controls_with_methods: number;
  objectives: number;
  catalog_version: string;
  import_date: string;
  source: string;
}

export function getCatalogStats(): NistCatalogStats {
  let enhancements = 0;
  let objectives = 0;
  let withObjectives = 0;
  let withMethods = 0;
  for (const control of ALL_CONTROLS) {
    enhancements += control.enhancements?.length ?? 0;
    const objCount = control.objectives?.length ?? 0;
    objectives += objCount;
    if (objCount > 0) withObjectives += 1;
    if ((control.methods?.length ?? 0) > 0) withMethods += 1;
  }
  return {
    families: FAMILIES.length,
    base_controls: BASE_CONTROLS.length,
    enhancements,
    total_entries: ALL_CONTROLS.length,
    controls_with_objectives: withObjectives,
    controls_with_methods: withMethods,
    objectives,
    catalog_version: CATALOG_METADATA.oscal_version,
    import_date: CATALOG_METADATA.import_date,
    source: CATALOG_METADATA.source,
  };
}

export function searchNistControls(query: string, limit = 50): NistCatalogControl[] {
  const q = query.trim().toUpperCase();
  if (!q) return [];
  const matches: NistCatalogControl[] = [];
  for (const control of ALL_CONTROLS) {
    if (
      control.id.toUpperCase().includes(q) ||
      control.title.toUpperCase().includes(q) ||
      control.statement.toUpperCase().includes(q)
    ) {
      matches.push(control);
      if (matches.length >= limit) break;
    }
  }
  return matches;
}

/** Returns the official SP 800-53B baseline definitions (low, moderate, high). */
export function getNistBaselines(): NistBaselineDefinition[] {
  return NIST_BASELINES.baselines;
}

export function getNistBaseline(name: "low" | "moderate" | "high"): NistBaselineDefinition {
  const baseline = NIST_BASELINES.baselines.find((b) => b.name === name);
  if (!baseline) {
    throw new Error(`Unknown baseline: ${name}`);
  }
  return baseline;
}

/**
 * Resolves a baseline (official or custom ID list) to catalog controls.
 * Selecting an enhancement always includes its parent base control.
 * Unknown IDs are reported, never silently dropped.
 */
export function resolveBaselineControlIds(controlIds: string[]): {
  resolved: string[];
  unknown: string[];
} {
  const requested = new Set(controlIds.map((id) => normalizeNistControlId(id)));
  const resolved = new Set<string>();
  const unknown: string[] = [];
  for (const id of requested) {
    const control = CONTROL_INDEX.get(id);
    if (!control) {
      unknown.push(id);
      continue;
    }
    resolved.add(control.id);
    if (control.parent_id) {
      resolved.add(control.parent_id);
    }
  }
  return { resolved: [...resolved], unknown };
}

export function isNistBaselineName(name: string): name is NistBaselineName {
  return ["low", "moderate", "high", "tailored", "custom"].includes(name);
}
