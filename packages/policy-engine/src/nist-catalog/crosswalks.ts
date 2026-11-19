/**
 * Cross-framework crosswalks (Phase 9).
 *
 * Mappings are informational only. They are derived from authoritative
 * informative references (NIST CSF 2.0 -> SP 800-53) or from GESF's own pack
 * alignment. A mapping never proves equivalence or compliance with another
 * framework. Mappings for CIS / ISO 27001 / OWASP are intentionally not
 * asserted here because no authoritative machine-readable reference is
 * bundled with GESF; inventing them would violate the framework's rules.
 */
import type { NistCrosswalkMapping } from "@greenarmor/ges-core";
import { createNISTPolicyPack } from "../packs/nist.js";
import { createNIST80053PolicyPack } from "../packs/nist-800-53.js";
import { getAllNistControls, getNistControl } from "./index.js";

const CSF_REF_PATTERN = /SP 800-53:\s*([^\]]+)\]/g;

const catalogIds = new Set(getAllNistControls().map((c) => c.id.toUpperCase()));

function parseControlRefList(raw: string): string[] {
  return raw
    .split(/[,;]/)
    .map((id) => id.trim())
    .filter((id) => /^[A-Za-z]{2}-\d+(\(\d+\))?$/.test(id))
    .map((id) => id.toUpperCase());
}

let cachedMappings: NistCrosswalkMapping[] | null = null;

export function getNistCrosswalkMappings(): NistCrosswalkMapping[] {
  if (cachedMappings) return cachedMappings;
  const mappings: NistCrosswalkMapping[] = [];

  // NIST CSF 2.0 -> NIST SP 800-53 (official informative references embedded
  // in the CSF 2.0 outcomes, carried in the GESF CSF pack guidance).
  const csfPack = createNISTPolicyPack();
  for (const control of csfPack.controls) {
    const matches = [...control.implementation_guidance.matchAll(CSF_REF_PATTERN)];
    for (const match of matches) {
      for (const nistId of parseControlRefList(match[1])) {
        if (!catalogIds.has(nistId)) continue;
        mappings.push({
          from_framework: "NIST-CSF-2.0",
          from_id: control.id,
          to_framework: "NIST-800-53",
          to_id: nistId,
          relationship: "informative-reference",
          source: "NIST CSF 2.0 informative references (SP 800-53 Rev. 5)",
        });
      }
    }
  }

  // GESF nist-800-53 policy pack control IDs <-> official catalog identifiers.
  const pack = createNIST80053PolicyPack();
  for (const control of pack.controls) {
    const officialId = control.id.replace(/^NIST-800-53-/, "");
    if (!getNistControl(officialId)) continue;
    mappings.push({
      from_framework: "GESF",
      from_id: control.id,
      to_framework: "NIST-800-53",
      to_id: officialId,
      relationship: "related",
      source: "GESF policy pack alignment",
    });
  }

  cachedMappings = mappings;
  return mappings;
}

export function getCrosswalksForControl(controlId: string): NistCrosswalkMapping[] {
  const target = controlId.toUpperCase();
  return getNistCrosswalkMappings().filter(
    (m) => m.to_id.toUpperCase() === target || m.from_id.toUpperCase() === target,
  );
}
