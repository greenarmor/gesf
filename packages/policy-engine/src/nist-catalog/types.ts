/**
 * Types for the NIST SP 800-53 Rev. 5 control catalog and SP 800-53B baselines.
 * Derived from authoritative NIST OSCAL content (usnistgov/oscal-content).
 */

export type NistAssessmentMethodKind = "examine" | "interview" | "test";

export interface NistCatalogParameter {
  id: string;
  label: string;
  prose?: string;
  choices?: string[];
  how_many?: string;
}

export interface NistCatalogObjective {
  id: string;
  label: string;
  text: string;
}

export interface NistCatalogMethod {
  method: NistAssessmentMethodKind;
  label: string;
  prose?: string;
}

export interface NistCatalogReference {
  title: string;
  identifier?: string;
}

export interface NistCatalogControl {
  /** Official identifier, e.g. "AC-2" or enhancement "AC-2(3)". */
  id: string;
  /** Original OSCAL identifier, e.g. "ac-2" or "ac-2.3". */
  oscal_id: string;
  family: string;
  title: string;
  statement: string;
  supplemental_guidance?: string;
  implementation_level?: string;
  parameters?: NistCatalogParameter[];
  objectives?: NistCatalogObjective[];
  methods?: NistCatalogMethod[];
  references?: NistCatalogReference[];
  related_controls?: string[];
  enhancements?: NistCatalogControl[];
  is_enhancement?: boolean;
  parent_id?: string;
}

export interface NistCatalogFamily {
  code: string;
  name: string;
  controls: NistCatalogControl[];
}

export interface NistCatalogSourceMetadata {
  families: number;
  base_controls: number;
  total_entries: number;
  import_date: string;
  oscal_title: string;
  oscal_version: string;
  source: string;
}

export interface NistBaselineDefinition {
  name: "low" | "moderate" | "high";
  label: string;
  source: string;
  control_ids: string[];
}

export interface NistBaselineSet {
  baselines: NistBaselineDefinition[];
}

export type NistBaselineName = "low" | "moderate" | "high" | "tailored" | "custom";
